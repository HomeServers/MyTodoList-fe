import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';

export default function TaskDeleteConfirmModal({ isOpen, onClose, task, onConfirm }) {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>태스크 삭제</DialogTitle>
          <DialogDescription>
            정말로 이 태스크를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-muted p-4 rounded-md">
            <p
              className="text-sm font-medium break-words"
              style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
            >
              {task.content}
            </p>
            {task.dueDate && (
              <p className="text-xs text-muted-foreground mt-2">
                마감일: {new Date(task.dueDate).toLocaleDateString('ko-KR')}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm(task);
              onClose();
            }}
          >
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
