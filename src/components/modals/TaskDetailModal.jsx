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

const statusLabels = {
  PENDING: '대기',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  EXPIRED: '만료',
};

export default function TaskDetailModal({ isOpen, onClose, task, onEdit, onDelete }) {
  const [isReactivating, setIsReactivating] = useState(false);
  const [newDueDate, setNewDueDate] = useState('');

  if (!task) return null;

  const handleReactivate = async () => {
    if (!newDueDate) return;

    const d = new Date(newDueDate);
    d.setHours(23, 59, 59, 999);

    await onEdit({
      ...task,
      status: 'PENDING',
      dueDate: d.toISOString(),
    });

    setIsReactivating(false);
    setNewDueDate('');
    onClose();
  };

  const isExpired = task.status === 'EXPIRED';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isReactivating ? '태스크 재활성화' : '할 일 상세'}</DialogTitle>
        </DialogHeader>

        {isReactivating ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              만료된 태스크를 재활성화하려면 새로운 마감일을 설정하세요.
            </p>
            <div>
              <label htmlFor="newDueDate" className="text-sm font-medium block mb-2">
                새 마감일
              </label>
              <Input
                id="newDueDate"
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">내용</h4>
              <p
                className="whitespace-pre-wrap break-words"
                style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
              >
                {task.content}
              </p>
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
        )}

        <DialogFooter className="gap-2">
          {isReactivating ? (
            <>
              <Button variant="outline" onClick={() => {
                setIsReactivating(false);
                setNewDueDate('');
              }}>
                취소
              </Button>
              <Button onClick={handleReactivate} disabled={!newDueDate}>
                재활성화
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                닫기
              </Button>
              <Button variant="destructive" onClick={() => {
                onDelete(task);
                onClose();
              }}>
                삭제
              </Button>
              {isExpired ? (
                <Button onClick={() => setIsReactivating(true)}>
                  재활성화
                </Button>
              ) : (
                <Button onClick={() => {
                  onEdit(task);
                  onClose();
                }}>
                  수정
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
