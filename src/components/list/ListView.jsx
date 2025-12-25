import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, LayoutGrid, Search, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const statusLabels = {
  PENDING: '대기',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  EXPIRED: '만료',
};

const statusColors = {
  PENDING: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  EXPIRED: 'bg-gray-100 text-gray-800',
};

// Mock data
const mockTasks = [
  { id: '1', content: '3가지 스타일로 디자인 초안 작성', status: 'IN_PROGRESS', dueDate: '2025-04-17T23:59:59.999Z' },
  { id: '2', content: '와이어프레임 개발', status: 'IN_PROGRESS' },
  { id: '3', content: '웹사이트 카피 작성', status: 'IN_PROGRESS', dueDate: '2025-04-19T23:59:59.999Z' },
  { id: '4', content: '각 페이지의 메타 제목 및 설명 작성', status: 'PENDING' },
  { id: '5', content: '선택한 CMS 플랫폼을 사용하여 웹사이트 개발', status: 'PENDING', dueDate: '2025-04-19T23:59:59.999Z' },
  { id: '6', content: '전체 스타일로 웹사이트 디자인', status: 'PENDING', dueDate: '2025-04-24T23:59:59.999Z' },
  { id: '7', content: '웹 개발자용 디자인 파일 준비', status: 'PENDING' },
  { id: '8', content: 'CMS 플랫폼 조사', status: 'COMPLETED' },
  { id: '9', content: '새 웹사이트 구조 개발', status: 'COMPLETED' },
];

export default function ListView({ onViewChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch = task.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (taskId) => {
    console.log('Delete task:', taskId);
  };

  const handleRowClick = (task) => {
    console.log('Task clicked:', task);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b bg-background">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">리스트 뷰</h1>
            <p className="text-sm text-muted-foreground mt-1">
              모든 태스크를 테이블 형식으로 확인하세요
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => onViewChange?.('kanban')} variant="outline" size="sm">
              <LayoutGrid className="h-4 w-4 mr-2" />
              칸반 뷰
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              새 태스크
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="태스크 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              전체
            </Button>
            {Object.keys(statusLabels).map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status)}
              >
                {statusLabels[status]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-card rounded-lg border">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold text-sm">태스크</th>
                <th className="text-left p-4 font-semibold text-sm w-32">상태</th>
                <th className="text-left p-4 font-semibold text-sm w-40">마감일</th>
                <th className="text-right p-4 font-semibold text-sm w-20">액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(task)}
                >
                  <td className="p-4">
                    <p className="font-medium text-foreground">{task.content}</p>
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        statusColors[task.status]
                      )}
                    >
                      {statusLabels[task.status]}
                    </span>
                  </td>
                  <td className="p-4">
                    {task.dueDate ? (
                      <span className="text-sm text-muted-foreground">
                        {new Date(task.dueDate).toLocaleDateString('ko-KR')}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(task.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>태스크가 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
