import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

// Mock data
const mockTasks = [
  { id: '1', content: 'Mary Johnson', status: 'PENDING', dueDate: '2025-01-15T10:00:00.000Z', time: '9 Mon' },
  { id: '2', content: 'Get ready for the executive meeting', status: 'PENDING', dueDate: '2025-01-15T14:30:00.000Z', time: '2:30 - 3:30 pm' },
  { id: '3', content: 'Check new Google Events', status: 'PENDING', dueDate: '2025-01-16T11:00:00.000Z', time: '3 Wed' },
  { id: '4', content: 'Organize product team with John and Kate', status: 'IN_PROGRESS', dueDate: '2025-01-16T09:00:00.000Z', time: '5 days left' },
  { id: '5', content: 'Write email ready for scheduling new marketing campaign', status: 'PENDING', dueDate: '2025-01-17T16:00:00.000Z', time: '4 Thu' },
  { id: '6', content: 'Finalize the bill of marketing campaign', status: 'IN_PROGRESS', dueDate: '2025-01-18T13:00:00.000Z', time: '1 Fri' },
];

const statusColors = {
  PENDING: 'bg-blue-100 border-blue-200',
  IN_PROGRESS: 'bg-orange-100 border-orange-200',
  COMPLETED: 'bg-green-100 border-green-200',
  EXPIRED: 'bg-gray-100 border-gray-200',
};

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 이번 달의 첫날과 마지막 날
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // 달력 시작일 (이전 달 마지막 주 포함)
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // 달력 종료일 (다음 달 첫 주 포함)
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  // 달력 날짜 배열 생성
  const calendarDays = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    calendarDays.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-8 py-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">캘린더 플래너</h1>
            <p className="text-sm text-muted-foreground mt-1">
              일정과 태스크를 캘린더에서 확인하세요
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              새 일정
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Schedule List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Today Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Button variant="ghost" size="sm" className="text-primary font-medium">
                  Today
                </Button>
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                </span>
              </div>

              <div className="space-y-3">
                {mockTasks.slice(0, 3).map((task) => (
                  <Card
                    key={task.id}
                    className={cn(
                      'p-4 cursor-pointer transition-all hover:shadow-md border',
                      statusColors[task.status]
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p
                          className="text-sm font-medium text-foreground mb-1 break-words"
                          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                        >
                          {task.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {task.time}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Other Days */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-foreground">이번 주</span>
              </div>

              <div className="space-y-3">
                {mockTasks.slice(3).map((task) => (
                  <Card
                    key={task.id}
                    className={cn(
                      'p-4 cursor-pointer transition-all hover:shadow-md border',
                      statusColors[task.status]
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p
                          className="text-sm font-medium text-foreground mb-1 break-words"
                          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                        >
                          {task.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {task.time}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Mini Calendar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevMonth}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <h3 className="font-semibold text-sm">
                  {year}년 {months[month]}
                </h3>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextMonth}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-muted-foreground py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  const isCurrentMonth = date.getMonth() === month;
                  const isTodayDate = isToday(date);
                  const isSelectedDate = isSelected(date);

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        'aspect-square flex items-center justify-center text-xs rounded-md transition-colors',
                        !isCurrentMonth && 'text-muted-foreground/40',
                        isCurrentMonth && 'text-foreground hover:bg-accent',
                        isTodayDate && 'bg-primary text-primary-foreground font-bold',
                        isSelectedDate && !isTodayDate && 'bg-accent ring-2 ring-primary'
                      )}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              {/* Today Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => {
                  const today = new Date();
                  setCurrentDate(today);
                  setSelectedDate(today);
                }}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                오늘
              </Button>
            </Card>

            {/* Waiting List Card */}
            <Card className="p-4 mt-4 bg-green-50 border-green-200">
              <h4 className="text-sm font-semibold text-foreground mb-2">
                대기 중인 목록
              </h4>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  Employee Training
                </div>
                <div className="text-xs text-muted-foreground">
                  Product Roadmap
                </div>
                <div className="text-xs text-muted-foreground">
                  Submit article: Marketing campaign
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
