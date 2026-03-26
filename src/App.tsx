import { useState } from 'react';
import type { Order, OrderStatus, OrderTerm } from './types';
import Calendar from './components/Calendar';
import OrderModal from './components/OrderModal';
import TermModal from './components/TermModal';

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  // Modal states
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [termModal, setTermModal] = useState<{
    orderId: string;
    date?: string;
    editingTerm?: OrderTerm;
  } | null>(null);

  const addOrder = (name: string, code: string, parentId: string | null) => {
    setOrders((prev) => [
      ...prev,
      { id: generateId(), name, code, parentId, terms: [] },
    ]);
  };

  const addTerm = (orderId: string, startDate: string, endDate: string, startTime: string, endTime: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, terms: [...o.terms, { id: generateId(), startDate, endDate, startTime, endTime, status }] }
          : o
      )
    );
  };

  const updateTerm = (orderId: string, termId: string, startDate: string, endDate: string, startTime: string, endTime: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              terms: o.terms.map((t) =>
                t.id === termId ? { ...t, startDate, endDate, startTime, endTime, status } : t
              ),
            }
          : o
      )
    );
  };

  const deleteTerm = (orderId: string, termId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, terms: o.terms.filter((t) => t.id !== termId) }
          : o
      )
    );
  };

  const prevMonth = () => {
    setCurrentDate((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  };

  const nextMonth = () => {
    setCurrentDate((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Planning Calendar</h1>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowOrderModal(true)}>
            + Insert Order
          </button>
        </div>
      </header>

      <div className="month-nav">
        <button onClick={() => setCurrentDate((p) => ({ year: p.year - 1, month: p.month }))}>«</button>
        <button onClick={prevMonth}>‹</button>
        <span className="month-label">
          {new Date(currentDate.year, currentDate.month).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </span>
        <button onClick={nextMonth}>›</button>
        <button onClick={() => setCurrentDate((p) => ({ year: p.year + 1, month: p.month }))}>»</button>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          No orders yet. Click "Insert Order" to get started.
        </div>
      ) : (
        <Calendar
          year={currentDate.year}
          month={currentDate.month}
          orders={orders}
          onDayClick={(orderId, date) =>
            setTermModal({ orderId, date })
          }
          onTermClick={(orderId, term) =>
            setTermModal({ orderId, editingTerm: term })
          }
          onTermDelete={deleteTerm}
        />
      )}

      {showOrderModal && (
        <OrderModal
          orders={orders}
          onSubmit={addOrder}
          onClose={() => setShowOrderModal(false)}
        />
      )}

      {termModal && (
        <TermModal
          initialDate={termModal.date}
          editingTerm={termModal.editingTerm}
          onSubmit={(startDate, endDate, startTime, endTime, status) => {
            if (termModal.editingTerm) {
              updateTerm(termModal.orderId, termModal.editingTerm.id, startDate, endDate, startTime, endTime, status);
            } else {
              addTerm(termModal.orderId, startDate, endDate, startTime, endTime, status);
            }
          }}
          onClose={() => setTermModal(null)}
        />
      )}
    </div>
  );
}