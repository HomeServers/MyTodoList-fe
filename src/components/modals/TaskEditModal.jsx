import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export default function TaskEditModal({ isOpen, onClose, onConfirm, task }) {
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setContent(task.content || '');
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);

    try {
      let finalDueDate = null;
      if (dueDate) {
        const d = new Date(dueDate);
        d.setHours(23, 59, 59, 999);
        finalDueDate = d.toISOString();
      }

      await onConfirm({
        ...task,
        content: content.trim(),
        dueDate: finalDueDate,
      });

      onClose();
    } catch (error) {
      console.error('태스크 수정 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>할 일 수정</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="content" className="text-sm font-medium block mb-2">
              내용
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="할 일을 입력하세요"
              rows={4}
              required
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="text-sm font-medium block mb-2">
              마감일 (선택사항)
            </label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              취소
            </Button>
            <Button type="submit" disabled={!content.trim() || loading}>
              {loading ? '수정 중...' : '저장'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
