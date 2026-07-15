import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter').max(50),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  remember: z.boolean().optional(),
});

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().optional(),
  password: z.string().min(6),
  name: z.string().min(1, 'Nama wajib diisi'),
  phone: z.string().optional(),
  roleId: z.string(),
});

export const menuSchema = z.object({
  code: z.string().min(1, 'Kode menu wajib diisi'),
  barcode: z.string().optional(),
  name: z.string().min(1, 'Nama menu wajib diisi'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  cost: z.number().min(0).default(0),
  stock: z.number().int().min(0).default(0),
  minStock: z.number().int().min(0).default(5),
  isActive: z.boolean().default(true),
  taxId: z.string().optional().nullable(),
  discountId: z.string().optional().nullable(),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi'),
  description: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const tableSchema = z.object({
  number: z.string().min(1, 'Nomor meja wajib diisi'),
  capacity: z.number().int().min(1).default(4),
  position: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const orderSchema = z.object({
  type: z.enum(['dine_in', 'take_away']),
  tableId: z.string().optional().nullable(),
  customerId: z.string().optional().nullable(),
  note: z.string().optional(),
  items: z.array(z.object({
    menuId: z.string(),
    quantity: z.number().int().min(1),
    note: z.string().optional(),
  })).min(1, 'Minimal 1 item'),
});

export const paymentSchema = z.object({
  orderId: z.string(),
  paymentMethodId: z.string(),
  amount: z.number().min(0),
  reference: z.string().optional(),
});

export const customerSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
});

export const expenseSchema = z.object({
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  amount: z.number().min(0, 'Jumlah tidak boleh negatif'),
  description: z.string().optional(),
  date: z.string().or(z.date()),
});

export const shiftSchema = z.object({
  openingBalance: z.number().min(0),
  note: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type MenuInput = z.infer<typeof menuSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type TableInput = z.infer<typeof tableSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type ExpenseInput = z.infer<typeof expenseSchema>;
export type ShiftInput = z.infer<typeof shiftSchema>;
