import prisma from '@/lib/prisma';

export class DashboardService {
  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [
      todaySales,
      monthSales,
      todayTransactions,
      topMenus,
      totalMenus,
      totalTables,
      totalUsers,
      activeOrders,
      lowStock,
      todayExpenses,
      salesChartData,
    ] = await Promise.all([
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: today, lt: tomorrow }, status: 'completed' },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: monthStart, lte: monthEnd }, status: 'completed' },
      }),
      prisma.order.count({
        where: { createdAt: { gte: today, lt: tomorrow }, status: 'completed' },
      }),
      prisma.orderItem.groupBy({
        by: ['menuId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
      prisma.menu.count({ where: { deletedAt: null } }),
      prisma.table.count(),
      prisma.user.count({ where: { deletedAt: null, isActive: true } }),
      prisma.order.count({ where: { status: { in: ['draft', 'pending', 'cooking'] } } }),
      prisma.menu.findMany({
        where: { stock: { lte: prisma.menu.fields.minStock }, deletedAt: null },
        select: { id: true, name: true, stock: true, minStock: true },
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { date: { gte: today, lt: tomorrow } },
      }),
      prisma.payment.groupBy({
        by: ['createdAt'],
        _sum: { amount: true },
        where: { createdAt: { gte: monthStart, lte: monthEnd }, status: 'completed' },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    const topMenusData = await prisma.menu.findMany({
      where: { id: { in: topMenus.map((m) => m.menuId) } },
      select: { id: true, name: true },
    });

    return {
      todaySales: todaySales._sum.amount || 0,
      monthSales: monthSales._sum.amount || 0,
      todayTransactions,
      topMenus: topMenus.map((item) => ({
        name: topMenusData.find((m) => m.id === item.menuId)?.name || 'Unknown',
        quantity: item._sum.quantity || 0,
      })),
      totalMenus,
      totalTables,
      totalUsers,
      activeOrders,
      lowStock,
      todayExpenses: todayExpenses._sum.amount || 0,
      profit: (todaySales._sum.amount || 0) - (todayExpenses._sum.amount || 0),
      salesChart: salesChartData.map((item) => ({
        date: item.createdAt.toISOString().split('T')[0],
        amount: item._sum.amount || 0,
      })),
    };
  }
}

export const dashboardService = new DashboardService();
