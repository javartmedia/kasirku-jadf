import prisma from '@/lib/prisma';
import { OrderInput } from '@/lib/validations';
import { generateOrderNumber, calculateTotal } from '@/lib/utils';

export class OrderService {
  async findAll(params: { page?: number; limit?: number; status?: string; date?: string }) {
    const { page = 1, limit = 10, status, date } = params;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (status) where.status = status;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      where.createdAt = { gte: startDate, lte: endDate };
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: { include: { menu: true } },
          table: true,
          customer: true,
          user: { select: { name: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findActive() {
    return prisma.order.findMany({
      where: { status: { in: ['draft', 'pending', 'cooking'] }, deletedAt: null },
      include: {
        items: { include: { menu: true } },
        table: true,
        customer: true,
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { menu: { include: { category: true, images: true } } } },
        table: true,
        customer: true,
        payments: { include: { paymentMethod: true } },
        user: { select: { name: true } },
      },
    });
  }

  async create(data: OrderInput, userId: string) {
    const orderNumber = generateOrderNumber();

    const menuItems = await Promise.all(
      data.items.map(async (item) => {
        const menu = await prisma.menu.findUnique({ where: { id: item.menuId } });
        if (!menu) throw new Error(`Menu dengan ID ${item.menuId} tidak ditemukan`);
        if (menu.stock < item.quantity) throw new Error(`Stok ${menu.name} tidak mencukupi`);
        
        let taxAmount = 0;
        if (menu.taxId) {
          const tax = await prisma.tax.findUnique({ where: { id: menu.taxId } });
          if (tax) taxAmount = (menu.price * tax.rate) / 100;
        }

        let discountAmount = 0;
        if (menu.discountId) {
          const discount = await prisma.discount.findUnique({ where: { id: menu.discountId } });
          if (discount) {
            if (discount.type === 'percentage') {
              discountAmount = (menu.price * discount.value) / 100;
            } else {
              discountAmount = discount.value;
            }
          }
        }

        const subtotal = (menu.price - discountAmount + taxAmount) * item.quantity;

        return {
          menuId: item.menuId,
          quantity: item.quantity,
          price: menu.price,
          discount: discountAmount,
          tax: taxAmount,
          subtotal,
          note: item.note,
        };
      })
    );

    const total = menuItems.reduce((sum, item) => sum + item.subtotal, 0);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        type: data.type,
        status: 'draft',
        tableId: data.tableId || null,
        customerId: data.customerId || null,
        userId,
        subtotal: total,
        taxAmount: menuItems.reduce((sum, item) => sum + item.tax, 0),
        discountAmount: menuItems.reduce((sum, item) => sum + item.discount, 0),
        total,
        note: data.note,
        items: {
          create: menuItems,
        },
      },
      include: { items: true },
    });

    if (data.tableId) {
      await prisma.table.update({
        where: { id: data.tableId },
        data: { status: 'occupied' },
      });
    }

    await prisma.activityLog.create({
      data: {
        userId,
        action: 'CREATE',
        module: 'order',
        targetId: order.id,
        orderId: order.id,
        detail: `Created order: ${order.orderNumber}`,
      },
    });

    return order;
  }

  async updateStatus(id: string, status: string, userId: string) {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    await prisma.activityLog.create({
      data: {
        userId,
        action: 'STATUS_CHANGE',
        module: 'order',
        targetId: order.id,
        orderId: order.id,
        detail: `Updated order ${order.orderNumber} status to ${status}`,
      },
    });

    return order;
  }

  async cancel(id: string, userId: string) {
    const order = await prisma.order.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    if (order.tableId) {
      await prisma.table.update({
        where: { id: order.tableId },
        data: { status: 'available' },
      });
    }

    await prisma.activityLog.create({
      data: {
        userId,
        action: 'CANCEL',
        module: 'order',
        targetId: order.id,
        orderId: order.id,
        detail: `Cancelled order: ${order.orderNumber}`,
      },
    });

    return order;
  }
}

export const orderService = new OrderService();
