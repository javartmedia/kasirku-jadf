import prisma from '@/lib/prisma';
import { generateToken, JWTPayload } from '@/lib/jwt';
import bcrypt from 'bcryptjs';
import { LoginInput, RegisterInput } from '@/lib/validations';

export class AuthService {
  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { username: data.username },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new Error('Username atau password salah');
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      throw new Error('Username atau password salah');
    }

    const permissions = user.role.permissions.map(
      (rp) => rp.permission.name
    );

    const payload: JWTPayload = {
      userId: user.id,
      username: user.username,
      role: user.role.name,
      permissions,
    };

    const token = generateToken(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        module: 'auth',
        detail: 'User login',
      },
    });

    return { token, user: { id: user.id, name: user.name, username: user.username, role: user.role.name } };
  }

  async register(data: RegisterInput) {
    const exists = await prisma.user.findFirst({
      where: {
        OR: [
          { username: data.username },
          ...(data.email ? [{ email: data.email }] : []),
        ],
      },
    });

    if (exists) {
      throw new Error('Username atau email sudah digunakan');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        roleId: data.roleId,
      },
    });

    return { id: user.id, username: user.username, name: user.name };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: {
          select: {
            id: true,
            name: true,
            permissions: {
              select: {
                permission: {
                  select: {
                    name: true,
                    module: true,
                    action: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return user;
  }
}

export const authService = new AuthService();
