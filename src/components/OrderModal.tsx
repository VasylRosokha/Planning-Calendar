import { useState } from 'react';
import Modal from './Modal';
import type { Order } from '../types';

interface OrderModalProps {
  orders: Order[];
  onSubmit: (name: string, code: string, parentId: string | null) => void;
  onClose: () => void;
}

export default function OrderModal({ orders, onSubmit, onClose }: OrderModalProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [parentId, setParentId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    onSubmit(name.trim(), code.trim(), parentId || null);
    onClose();
  };

  return (
    <Modal title="Insert Order" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label>
          Order Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </label>
        <label>
          Order Code
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </label>
        <label>
          Parent Order (optional)
          <select value={parentId} onChange={(e) => setParentId(e.target.value)}>
            <option value="">— None —</option>
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.code})
              </option>
            ))}
          </select>
        </label>
        <div className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Insert</button>
        </div>
      </form>
    </Modal>
  );
}