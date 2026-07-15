export const ORDER_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  COOKING: 'cooking',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_TYPE = {
  DINE_IN: 'dine_in',
  TAKE_AWAY: 'take_away',
} as const;

export const TABLE_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
} as const;

export const PAYMENT_METHODS = [
  'cash',
  'qris',
  'debit',
  'credit_card',
  'transfer',
] as const;

export const STOCK_MOVEMENT_TYPE = {
  IN: 'in',
  OUT: 'out',
  ADJUSTMENT: 'adjustment',
} as const;

export const ITEMS_PER_PAGE = 10;
export const DEBOUNCE_DELAY = 300;
