import { useState } from 'react';
import Modal from './Modal';
import type { OrderStatus, OrderTerm } from '../types';

interface TermModalProps {
  initialDate?: string;
  editingTerm?: OrderTerm;
  onSubmit: (startDate: string, endDate: string, startTime: string, endTime: string, status: OrderStatus) => void;
  onClose: () => void;
}

export default function TermModal({ initialDate, editingTerm, onSubmit, onClose }: TermModalProps) {
  const [startDate, setStartDate] = useState(editingTerm?.startDate ?? initialDate ?? '');
  const [endDate, setEndDate] = useState(editingTerm?.endDate ?? initialDate ?? '');
  const [startTime, setStartTime] = useState(editingTerm?.startTime ?? '08:00');
  const [endTime, setEndTime] = useState(editingTerm?.endTime ?? '17:00');
  const [status, setStatus] = useState<OrderStatus>(editingTerm?.status ?? 'new');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    onSubmit(startDate, endDate, startTime, endTime, status);
    onClose();
  };

  return (
    <Modal title={editingTerm ? 'Edit Term' : 'Set Order Term'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label>
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
        <label>
          Start Time
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </label>
        <label>
          End Date
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            required
          />
        </label>
        <label>
          End Time
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
            <option value="new">New</option>
            <option value="in_preparation">In Preparation</option>
            <option value="finished">Finished</option>
          </select>
        </label>
        <div className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">
            {editingTerm ? 'Save' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}