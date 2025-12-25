import React, { useState } from 'react';
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

export default function TaskAddModal({ isOpen, onClose, onConfirm, initialStatus = 'PENDING' }) {
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

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

      await onConfirm({ content: content.trim(), dueDate: finalDueDate });

      // 성공 후 초기화
      setContent('');
      setDueDate('');
      onClose();
    } catch (error) {
      console.error('태스크 추가 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setContent('');
    setDueDate('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 할 일 추가</DialogTitle>
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
              onClick={handleClose}
              disabled={loading}
            >
              취소
            </Button>
            <Button type="submit" disabled={!content.trim() || loading}>
              {loading ? '추가 중...' : '추가'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
