import type { Order } from '../types';

export function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const count = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= count; d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayStr(): string {
  return formatDate(new Date());
}

export function isDateInRange(date: string, start: string, end: string) {
  return date >= start && date <= end;
}

export function timeToPercent(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return ((h * 60 + m) / 1440) * 100;
}

export function getOrderDepth(order: Order, ordersMap: Map<string, Order>): number {
  let depth = 0;
  let current = order;
  while (current.parentId) {
    depth++;
    const parent = ordersMap.get(current.parentId);
    if (!parent) break;
    current = parent;
  }
  return depth;
}

export function hasChildren(orderId: string, orders: Order[]): boolean {
  return orders.some((o) => o.parentId === orderId);
}

export interface TreeOrder extends Order {
  _depth: number;
}

export function buildOrderTree(orders: Order[]): TreeOrder[] {
  const ordersMap = new Map(orders.map((o) => [o.id, o]));
  const result: TreeOrder[] = [];
  const roots = orders.filter((o) => !o.parentId);

  function addWithChildren(order: Order) {
    result.push({ ...order, _depth: getOrderDepth(order, ordersMap) });
    const children = orders.filter((o) => o.parentId === order.id);
    children.forEach(addWithChildren);
  }

  roots.forEach(addWithChildren);
  return result;
}

export function getVisibleOrders(tree: TreeOrder[], collapsed: Set<string>): TreeOrder[] {
  const visible: TreeOrder[] = [];
  const hiddenParents = new Set<string>();

  for (const order of tree) {
    if (order.parentId && (hiddenParents.has(order.parentId) || collapsed.has(order.parentId))) {
      hiddenParents.add(order.id);
      continue;
    }
    visible.push(order);
  }
  return visible;
}
