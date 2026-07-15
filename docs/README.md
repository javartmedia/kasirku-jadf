# KasirKu - Aplikasi Kasir Rumah Makan

Aplikasi Point of Sale (POS) modern untuk rumah makan berbasis web. Dibangun dengan Next.js, TypeScript, Tailwind CSS, Prisma ORM, dan SQLite.

## Fitur Utama

- **Dashboard** - Ringkasan penjualan, transaksi, menu terlaris, dan grafik
- **Manajemen Menu** - CRUD menu dengan foto, kategori, harga, stok
- **Manajemen Kategori** - Kategori menu yang dapat diaktifkan/nonaktifkan
- **Manajemen Meja** - Nomor meja, status (kosong/dipakai/reserved), QR code
- **Order** - Dine in & take away, draft order, cooking status
- **Pembayaran** - Cash, QRIS, debit, credit card, transfer, split bill
- **Cetak Struk** - Thermal & PDF printing dengan react-to-print
- **Laporan** - Penjualan harian/bulanan/tahunan, per menu, per kasir
- **Pengaturan** - Nama resto, logo, printer, pajak, diskon
- **User Management** - RBAC dengan role: Owner, Manager, Admin, Kasir
- **Shift & Cash Drawer** - Buka/tutup shift, saldo awal/akhir
- **Manajemen Stok** - Stock in/out, adjustment, minimum stock alert
- **Pelanggan** - Data pelanggan dengan poin member
- **Pengeluaran** - Catat pengeluaran harian
- **Global Search** - Pencarian realtime dengan debounce
- **Dark Mode** - Tema terang dan gelap
- **Responsive** - Desktop, tablet, dan mobile

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **CSS**: Tailwind CSS
- **ORM**: Prisma
- **Database**: SQLite
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Table**: TanStack Table
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notification**: Sonner
- **State**: Zustand
- **Date**: date-fns
- **Print**: react-to-print

## Instalasi

Lihat [INSTALL.md](INSTALL.md) untuk panduan instalasi lengkap.

## API Documentation

Lihat [API.md](API.md) untuk dokumentasi API endpoint.

## Database

Lihat [DATABASE.md](DATABASE.md) untuk skema database.

## Deployment

Lihat [DEPLOYMENT.md](DEPLOYMENT.md) untuk panduan deployment.

## User Guide

Lihat [USER_GUIDE.md](USER_GUIDE.md) untuk panduan penggunaan.
