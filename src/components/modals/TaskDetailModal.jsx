import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';

const statusLabels = {
  PENDING: '대기',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  EXPIRED: '만료',
};

export default function TaskDetailModal({ isOpen, onClose, task, onEdit, onDelete }) {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>할 일 상세</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">내용</h4>
            <p className="whitespace-pre-wrap">{task.content}</p>
          </div>

          {task.dueDate && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">마감일</h4>
              <p>{new Date(task.dueDate).toLocaleDateString('ko-KR')}</p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">상태</h4>
            <p>{statusLabels[task.status] || task.status}</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button variant="destructive" onClick={() => {
            onDelete(task);
            onClose();
          }}>
            삭제
          </Button>
          <Button onClick={() => {
            onEdit(task);
            onClose();
          }}>
            수정
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
