import prisma from '@/lib/prisma';
import { MenuInput } from '@/lib/validations';

export class MenuService {
  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    isActive?: boolean;
  }) {
    const { page = 1, limit = 10, search, categoryId, isActive } = params;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (search) where.name = { contains: search };
    if (categoryId) where.categoryId = categoryId;
    if (isActive !== undefined) where.isActive = isActive;

    const [menus, total] = await Promise.all([
      prisma.menu.findMany({
        where,
        include: {
          category: true,
          images: { where: { isPrimary: true }, take: 1 },
          tax: true,
          discount: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.menu.count({ where }),
    ]);

    return {
      data: menus,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return prisma.menu.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        tax: true,
        discount: true,
      },
    });
  }

  async create(data: MenuInput, userId: string) {
    const menu = await prisma.menu.create({
      data: {
        code: data.code,
        barcode: data.barcode,
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        price: data.price,
        cost: data.cost,
        stock: data.stock,
        minStock: data.minStock,
        isActive: data.isActive,
        taxId: data.taxId || null,
        discountId: data.discountId || null,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId,
        action: 'CREATE',
        module: 'menu',
        targetId: menu.id,
        detail: `Created menu: ${menu.name}`,
      },
    });

    return menu;
  }

  async update(id: string, data: Partial<MenuInput>, userId: string) {
    const menu = await prisma.menu.update({
      where: { id },
      data: {
        code: data.code,
        barcode: data.barcode,
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        price: data.price,
        cost: data.cost,
        stock: data.stock,
        minStock: data.minStock,
        isActive: data.isActive,
        taxId: data.taxId || null,
        discountId: data.discountId || null,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId,
        action: 'UPDATE',
        module: 'menu',
        targetId: menu.id,
        detail: `Updated menu: ${menu.name}`,
      },
    });

    return menu;
  }

  async delete(id: string, userId: string) {
    const menu = await prisma.menu.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await prisma.activityLog.create({
      data: {
        userId,
        action: 'DELETE',
        module: 'menu',
        targetId: menu.id,
        detail: `Deleted menu: ${menu.name}`,
      },
    });

    return menu;
  }

  async updateStock(id: string, quantity: number, type: string, userId: string, note?: string) {
    const menu = await prisma.menu.findUnique({ where: { id } });
    if (!menu) throw new Error('Menu tidak ditemukan');

    const beforeQty = menu.stock;
    const afterQty = type === 'in' ? beforeQty + quantity : beforeQty - quantity;

    await prisma.menu.update({
      where: { id },
      data: { stock: afterQty },
    });

    await prisma.stockMovement.create({
      data: {
        menuId: id,
        type,
        quantity,
        beforeQty,
        afterQty,
        note,
        userId,
      },
    });
  }
}

export const menuService = new MenuService();
