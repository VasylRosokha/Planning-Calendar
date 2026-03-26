import { useMemo, useState } from 'react';
import type { OrderTerm } from '../types';
import {
  getDaysInMonth,
  formatDate,
  todayStr,
  isDateInRange,
  timeToPercent,
  hasChildren,
  buildOrderTree,
  getVisibleOrders,
} from '../utils/calendar';

interface CalendarProps {
  year: number;
  month: number;
  orders: import('../types').Order[];
  onDayClick: (orderId: string, date: string) => void;
  onTermClick: (orderId: string, term: OrderTerm) => void;
  onTermDelete: (orderId: string, termId: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  new: '#ef4444',
  in_preparation: '#f59e0b',
  finished: '#22c55e',
};

const STATUS_BG: Record<string, string> = {
  new: 'rgba(239,68,68,0.15)',
  in_preparation: 'rgba(245,158,11,0.15)',
  finished: 'rgba(34,197,94,0.15)',
};

const DAY_NAMES = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

export default function Calendar({
  year,
  month,
  orders,
  onDayClick,
  onTermClick,
  onTermDelete,
}: CalendarProps) {
  const days = useMemo(() => getDaysInMonth(year, month), [year, month]);
  const tree = useMemo(() => buildOrderTree(orders), [orders]);
  const today = todayStr();

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const visibleOrders = useMemo(() => getVisibleOrders(tree, collapsed), [tree, collapsed]);

  const toggleCollapse = (orderId: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  return (
    <div className="calendar-wrapper">
      <table className="calendar-table">
        <thead>
          <tr>
            <th className="th-code">Kód</th>
            <th className="th-name">Položka</th>
            {days.map((d) => {
              const dayOfWeek = d.getDay();
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              const dateStr = formatDate(d);
              const isToday = dateStr === today;
              return (
                <th
                  key={dateStr}
                  className={`th-day${isWeekend ? ' weekend' : ''}${isToday ? ' today' : ''}`}
                >
                  <span className="day-name">{DAY_NAMES[(dayOfWeek + 6) % 7]}</span>
                  <span className="day-num">{d.getDate()}</span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {visibleOrders.map((order) => {
            const isParent = hasChildren(order.id, orders);
            const isCollapsed = collapsed.has(order.id);

            return (
              <tr key={order.id} className={`order-row depth-${order._depth}`}>
                <td className="td-code">
                  <div className="code-cell" style={{ paddingLeft: `${4 + order._depth * 12}px` }}>
                    {order._depth > 0 && <span className="indent-line" />}
                    <span className="code-text">{order.code}</span>
                  </div>
                </td>
                <td className="td-name">
                  <div className="name-cell">
                    {isParent && (
                      <button
                        className="collapse-btn"
                        onClick={() => toggleCollapse(order.id)}
                      >
                        {isCollapsed ? '+' : '−'}
                      </button>
                    )}
                    <div className="name-bar" />
                    <span className="name-text">{order.name}</span>
                  </div>
                </td>
                {days.map((d) => {
                  const dateStr = formatDate(d);
                  const dayOfWeek = d.getDay();
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  const isToday = dateStr === today;

                  const matchingTerms = order.terms.filter((t) =>
                    isDateInRange(dateStr, t.startDate, t.endDate)
                  );

                  return (
                    <td
                      key={dateStr}
                      className={`td-day${isWeekend ? ' weekend' : ''}${isToday ? ' today' : ''}`}
                      onClick={() => {
                        if (matchingTerms.length > 0) {
                          onTermClick(order.id, matchingTerms[0]);
                        } else {
                          onDayClick(order.id, dateStr);
                        }
                      }}
                    >
                      {matchingTerms.map((term) => {
                        const isStart = term.startDate === dateStr;
                        const isEnd = term.endDate === dateStr;
                        const leftPct = isStart ? timeToPercent(term.startTime) : 0;
                        const rightPct = isEnd ? 100 - timeToPercent(term.endTime) : 0;
                        return (
                          <div
                            key={term.id}
                            className={`term-block${isStart ? ' term-start' : ''}${isEnd ? ' term-end' : ''}`}
                            title={`${term.startDate} ${term.startTime} — ${term.endDate} ${term.endTime}`}
                            style={{
                              backgroundColor: STATUS_COLORS[term.status],
                              boxShadow: `0 0 0 1px ${STATUS_COLORS[term.status]}`,
                              left: isStart ? `${leftPct}%` : '-1px',
                              right: isEnd ? `${rightPct}%` : '-1px',
                            }}
                          >
                            <div
                              className="term-bg"
                              style={{ backgroundColor: STATUS_BG[term.status] }}
                            />
                            <button
                              className="term-delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                onTermDelete(order.id, term.id);
                              }}
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}