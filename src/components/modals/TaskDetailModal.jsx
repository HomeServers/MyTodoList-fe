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
import { FileText, Calendar, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const statusLabels = {
  PENDING: '대기',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  EXPIRED: '만료',
};

const statusColors = {
  PENDING: 'bg-blue-100 text-blue-800 border-blue-200',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
  EXPIRED: 'bg-red-100 text-red-800 border-red-200',
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

  // D-day 계산
  const getDdayText = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `D+${Math.abs(diffDays)}`;
    if (diffDays === 0) return 'D-Day';
    return `D-${diffDays}`;
  };

  const ddayText = task.dueDate ? getDdayText(task.dueDate) : null;
  const isDday = ddayText === 'D-Day' || (ddayText && ddayText.startsWith('D+'));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isReactivating ? '태스크 재활성화' : '할 일 상세'}</DialogTitle>
        </DialogHeader>

        {isReactivating ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  만료된 태스크를 재활성화하려면 새로운 마감일을 설정하세요.
                </p>
              </div>
            </div>
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
            {/* 상태 배지 */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium border',
                  statusColors[task.status]
                )}
              >
                {statusLabels[task.status]}
              </span>
              {ddayText && (
                <span
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-bold border',
                    isDday
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : 'bg-slate-100 text-slate-800 border-slate-200'
                  )}
                >
                  {ddayText}
                </span>
              )}
            </div>

            {/* 내용 */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    내용
                  </h4>
                  <p
                    className="text-foreground whitespace-pre-wrap break-words"
                    style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                  >
                    {task.content}
                  </p>
                </div>
              </div>
            </div>

            {/* 마감일 */}
            {task.dueDate && (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      마감일
                    </h4>
                    <p className="text-foreground font-medium">
                      {new Date(task.dueDate).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
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
