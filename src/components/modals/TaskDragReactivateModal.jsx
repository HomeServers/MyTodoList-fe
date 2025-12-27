import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function TaskDragReactivateModal({ isOpen, onClose, task, onConfirm }) {
  const [newDueDate, setNewDueDate] = useState('');

  const handleConfirm = () => {
    if (!newDueDate) return;
    onConfirm(newDueDate);
    setNewDueDate('');
  };

  const handleClose = () => {
    setNewDueDate('');
    onClose();
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>만료된 태스크 이동</DialogTitle>
          <DialogDescription>
            만료된 태스크를 이동하려면 새로운 마감일을 설정해야 합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-md">
            <p
              className="text-sm font-medium break-words"
              style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
            >
              {task.content}
            </p>
          </div>

          <div>
            <label htmlFor="dragNewDueDate" className="text-sm font-medium block mb-2">
              새 마감일
            </label>
            <Input
              id="dragNewDueDate"
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={!newDueDate}>
            이동
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
