import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create roles
  const ownerRole = await prisma.role.upsert({
    where: { name: 'owner' },
    update: {},
    create: {
      name: 'owner',
      description: 'Pemilik Rumah Makan',
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'manager' },
    update: {},
    create: {
      name: 'manager',
      description: 'Manajer',
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator',
    },
  });

  const cashierRole = await prisma.role.upsert({
    where: { name: 'cashier' },
    update: {},
    create: {
      name: 'cashier',
      description: 'Kasir',
    },
  });

  // Create permissions
  const permissions = [
    { name: 'dashboard.view', module: 'dashboard', action: 'view' },
    { name: 'menu.view', module: 'menu', action: 'view' },
    { name: 'menu.create', module: 'menu', action: 'create' },
    { name: 'menu.edit', module: 'menu', action: 'edit' },
    { name: 'menu.delete', module: 'menu', action: 'delete' },
    { name: 'menu.import', module: 'menu', action: 'import' },
    { name: 'menu.export', module: 'menu', action: 'export' },
    { name: 'category.view', module: 'category', action: 'view' },
    { name: 'category.create', module: 'category', action: 'create' },
    { name: 'category.edit', module: 'category', action: 'edit' },
    { name: 'category.delete', module: 'category', action: 'delete' },
    { name: 'table.view', module: 'table', action: 'view' },
    { name: 'table.create', module: 'table', action: 'create' },
    { name: 'table.edit', module: 'table', action: 'edit' },
    { name: 'table.delete', module: 'table', action: 'delete' },
    { name: 'order.view', module: 'order', action: 'view' },
    { name: 'order.create', module: 'order', action: 'create' },
    { name: 'order.edit', module: 'order', action: 'edit' },
    { name: 'order.cancel', module: 'order', action: 'cancel' },
    { name: 'order.complete', module: 'order', action: 'complete' },
    { name: 'payment.view', module: 'payment', action: 'view' },
    { name: 'payment.create', module: 'payment', action: 'create' },
    { name: 'payment.refund', module: 'payment', action: 'refund' },
    { name: 'customer.view', module: 'customer', action: 'view' },
    { name: 'customer.create', module: 'customer', action: 'create' },
    { name: 'customer.edit', module: 'customer', action: 'edit' },
    { name: 'customer.delete', module: 'customer', action: 'delete' },
    { name: 'expense.view', module: 'expense', action: 'view' },
    { name: 'expense.create', module: 'expense', action: 'create' },
    { name: 'expense.edit', module: 'expense', action: 'edit' },
    { name: 'expense.delete', module: 'expense', action: 'delete' },
    { name: 'stock.view', module: 'stock', action: 'view' },
    { name: 'stock.adjust', module: 'stock', action: 'adjust' },
    { name: 'purchase.view', module: 'purchase', action: 'view' },
    { name: 'purchase.create', module: 'purchase', action: 'create' },
    { name: 'purchase.edit', module: 'purchase', action: 'edit' },
    { name: 'purchase.delete', module: 'purchase', action: 'delete' },
    { name: 'report.view', module: 'report', action: 'view' },
    { name: 'report.export', module: 'report', action: 'export' },
    { name: 'user.view', module: 'user', action: 'view' },
    { name: 'user.create', module: 'user', action: 'create' },
    { name: 'user.edit', module: 'user', action: 'edit' },
    { name: 'user.delete', module: 'user', action: 'delete' },
    { name: 'settings.view', module: 'settings', action: 'view' },
    { name: 'settings.edit', module: 'settings', action: 'edit' },
    { name: 'shift.view', module: 'shift', action: 'view' },
    { name: 'shift.manage', module: 'shift', action: 'manage' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }

  // Assign all permissions to owner
  const allPermissions = await prisma.permission.findMany();
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: ownerRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: ownerRole.id,
        permissionId: perm.id,
      },
    });
  }

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12);

  await prisma.user.upsert({
    where: { username: 'owner' },
    update: {},
    create: {
      username: 'owner',
      email: 'owner@kasirku.com',
      password: hashedPassword,
      name: 'Pemilik',
      roleId: ownerRole.id,
    },
  });

  await prisma.user.upsert({
    where: { username: 'manager' },
    update: {},
    create: {
      username: 'manager',
      email: 'manager@kasirku.com',
      password: hashedPassword,
      name: 'Manajer',
      roleId: managerRole.id,
    },
  });

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@kasirku.com',
      password: hashedPassword,
      name: 'Admin',
      roleId: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { username: 'kasir' },
    update: {},
    create: {
      username: 'kasir',
      email: 'kasir@kasirku.com',
      password: hashedPassword,
      name: 'Kasir',
      roleId: cashierRole.id,
    },
  });

  // Create categories
  const categories = [
    { name: 'Makanan', description: 'Menu makanan utama' },
    { name: 'Minuman', description: 'Menu minuman' },
    { name: 'Snack', description: 'Menu camilan' },
    { name: 'Dessert', description: 'Menu pencuci mulut' },
    { name: 'Paket Hemat', description: 'Paket hemat dan promo' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  // Create tables
  for (let i = 1; i <= 10; i++) {
    await prisma.table.upsert({
      where: { number: `M${i}` },
      update: {},
      create: {
        number: `M${i}`,
        capacity: i <= 5 ? 2 : 4,
        position: i <= 5 ? 'Indoor' : 'Outdoor',
      },
    });
  }

  // Create payment methods
  const paymentMethods = [
    { name: 'Cash', code: 'cash', description: 'Pembayaran tunai' },
    { name: 'QRIS', code: 'qris', description: 'Pembayaran via QRIS' },
    { name: 'Debit', code: 'debit', description: 'Kartu debit' },
    { name: 'Credit Card', code: 'credit_card', description: 'Kartu kredit' },
    { name: 'Transfer', code: 'transfer', description: 'Transfer bank' },
  ];

  for (const pm of paymentMethods) {
    await prisma.paymentMethod.upsert({
      where: { code: pm.code },
      update: {},
      create: pm,
    });
  }

  // Create sample menus
  const menuList = [
    { code: 'MKN001', name: 'Nasi Goreng', category: 'Makanan', price: 15000, cost: 8000, stock: 50 },
    { code: 'MKN002', name: 'Mie Goreng', category: 'Makanan', price: 12000, cost: 6000, stock: 40 },
    { code: 'MKN003', name: 'Ayam Geprek', category: 'Makanan', price: 18000, cost: 10000, stock: 30 },
    { code: 'MKN004', name: 'Soto Ayam', category: 'Makanan', price: 15000, cost: 8000, stock: 35 },
    { code: 'MKN005', name: 'Bakso', category: 'Makanan', price: 12000, cost: 6000, stock: 45 },
    { code: 'MKN006', name: 'Sate Ayam', category: 'Makanan', price: 20000, cost: 12000, stock: 25 },
    { code: 'MKN007', name: 'Gado-gado', category: 'Makanan', price: 13000, cost: 7000, stock: 30 },
    { code: 'MKN008', name: 'Rawon', category: 'Makanan', price: 17000, cost: 9000, stock: 20 },
    { code: 'MKN009', name: 'Pecel Lele', category: 'Makanan', price: 16000, cost: 8000, stock: 25 },
    { code: 'MKN010', name: 'Nasi Campur', category: 'Makanan', price: 14000, cost: 7000, stock: 40 },
    { code: 'MIN001', name: 'Es Teh', category: 'Minuman', price: 5000, cost: 2000, stock: 100 },
    { code: 'MIN002', name: 'Es Jeruk', category: 'Minuman', price: 6000, cost: 2500, stock: 80 },
    { code: 'MIN003', name: 'Kopi Panas', category: 'Minuman', price: 8000, cost: 3000, stock: 60 },
    { code: 'MIN004', name: 'Air Mineral', category: 'Minuman', price: 4000, cost: 1500, stock: 120 },
    { code: 'MIN005', name: 'Jus Alpukat', category: 'Minuman', price: 10000, cost: 5000, stock: 40 },
    { code: 'MIN006', name: 'Teh Tarik', category: 'Minuman', price: 7000, cost: 3000, stock: 50 },
    { code: 'MIN007', name: 'Es Campur', category: 'Minuman', price: 9000, cost: 4000, stock: 45 },
    { code: 'SNC001', name: 'Kentang Goreng', category: 'Snack', price: 10000, cost: 5000, stock: 30 },
    { code: 'SNC002', name: 'Tahu Crispy', category: 'Snack', price: 8000, cost: 4000, stock: 35 },
    { code: 'SNC003', name: 'Pisang Goreng', category: 'Snack', price: 7000, cost: 3000, stock: 40 },
    { code: 'SNC004', name: 'Martabak Mini', category: 'Snack', price: 12000, cost: 6000, stock: 25 },
    { code: 'DSS001', name: 'Es Krim', category: 'Dessert', price: 8000, cost: 4000, stock: 50 },
    { code: 'DSS002', name: 'Puding', category: 'Dessert', price: 6000, cost: 3000, stock: 40 },
    { code: 'DSS003', name: 'Salad Buah', category: 'Dessert', price: 10000, cost: 5000, stock: 30 },
    { code: 'PKT001', name: 'Paket Nasi Goreng + Es Teh', category: 'Paket Hemat', price: 18000, cost: 10000, stock: 999 },
    { code: 'PKT002', name: 'Paket Ayam Geprek + Es Jeruk', category: 'Paket Hemat', price: 22000, cost: 12000, stock: 999 },
  ];

  const categoryMap: Record<string, string> = {};
  const allCategories = await prisma.category.findMany();
  allCategories.forEach(c => { categoryMap[c.name] = c.id; });

  for (const menu of menuList) {
    await prisma.menu.upsert({
      where: { code: menu.code },
      update: {},
      create: {
        code: menu.code,
        name: menu.name,
        categoryId: categoryMap[menu.category],
        price: menu.price,
        cost: menu.cost,
        stock: menu.stock,
        minStock: 5,
      },
    });
  }

  // Create default settings
  const settings = [
    { key: 'restaurant_name', value: 'KasirKu Rumah Makan', description: 'Nama rumah makan' },
    { key: 'restaurant_address', value: 'Jl. Contoh No. 123, Jakarta', description: 'Alamat rumah makan' },
    { key: 'restaurant_phone', value: '08123456789', description: 'Nomor telepon' },
    { key: 'default_tax', value: '0', description: 'Pajak default (%)' },
    { key: 'default_discount', value: '0', description: 'Diskon default (%)' },
    { key: 'language', value: 'id', description: 'Bahasa' },
    { key: 'timezone', value: 'Asia/Jakarta', description: 'Timezone' },
    { key: 'invoice_prefix', value: 'INV', description: 'Prefix nomor invoice' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  // Create receipt template
  await prisma.receiptTemplate.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Default',
      headerText: 'Terima kasih telah berkunjung',
      footerText: 'Simpan struk ini sebagai bukti pembayaran',
      showLogo: true,
      showQr: true,
      paperSize: '58mm',
      isDefault: true,
    },
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
