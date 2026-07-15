'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Grid3X3,
  Table,
  ShoppingCart,
  CreditCard,
  Users,
  DollarSign,
  Package,
  Truck,
  BarChart3,
  Settings,
  UserCog,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/ui-store';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard.view' },
  { href: '/menu', label: 'Menu', icon: UtensilsCrossed, permission: 'menu.view' },
  { href: '/categories', label: 'Kategori', icon: Grid3X3, permission: 'category.view' },
  { href: '/tables', label: 'Meja', icon: Table, permission: 'table.view' },
  { href: '/orders', label: 'Order', icon: ShoppingCart, permission: 'order.view' },
  { href: '/payments', label: 'Pembayaran', icon: CreditCard, permission: 'payment.view' },
  { href: '/customers', label: 'Pelanggan', icon: Users, permission: 'customer.view' },
  { href: '/expenses', label: 'Pengeluaran', icon: DollarSign, permission: 'expense.view' },
  { href: '/stock', label: 'Stok', icon: Package, permission: 'stock.view' },
  { href: '/purchases', label: 'Pembelian', icon: Truck, permission: 'purchase.view' },
  { href: '/reports', label: 'Laporan', icon: BarChart3, permission: 'report.view' },
  { href: '/users', label: 'User', icon: UserCog, permission: 'user.view' },
  { href: '/shift', label: 'Shift', icon: Clock, permission: 'shift.view' },
  { href: '/settings', label: 'Pengaturan', icon: Settings, permission: 'settings.view' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-3">
        {!sidebarCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
              KK
            </div>
            <span className="font-semibold text-sm">KasirKu</span>
          </Link>
        )}
        <Button variant="ghost" size="sm" onClick={toggleSidebar} className="ml-auto">
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <nav className="mt-2 space-y-1 px-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
