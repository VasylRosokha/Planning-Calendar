export type OrderStatus = 'new' | 'in_preparation' | 'finished';

export interface OrderTerm {
  id: string;
  startDate: string;
  endDate: string;
  startTime: string; // "HH:MM" e.g. "08:00"
  endTime: string;   // "HH:MM" e.g. "17:00"
  status: OrderStatus;
}

export interface Order {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
  terms: OrderTerm[];
}