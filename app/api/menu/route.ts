import { NextRequest, NextResponse } from 'next/server';
import { menuService } from '@/services/menu.service';
import { menuSchema } from '@/lib/validations';
import { getCurrentUser } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || undefined;
    const isActive = searchParams.get('isActive');

    const result = await menuService.findAll({
      page,
      limit,
      search,
      categoryId,
      isActive: isActive ? isActive === 'true' : undefined,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const validatedData = menuSchema.parse(body);

    const menu = await menuService.create(validatedData, user.userId);

    return NextResponse.json({ data: menu }, { status: 201 });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Kode menu atau barcode sudah digunakan' },
          { status: 400 }
        );
      }
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
