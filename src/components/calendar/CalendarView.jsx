import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

const statusColors = {
  PENDING: 'bg-blue-100 border-blue-200',
  IN_PROGRESS: 'bg-orange-100 border-orange-200',
  COMPLETED: 'bg-green-100 border-green-200',
  EXPIRED: 'bg-gray-100 border-gray-200',
};

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export default function CalendarView({ tasks, loading, error }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // tasks 객체를 배열로 변환
  const allTasks = useMemo(() => {
    if (!tasks) return [];
    return Object.values(tasks).flat();
  }, [tasks]);

  // 마감일이 있는 태스크만 필터링하고 날짜순 정렬
  const tasksWithDueDate = useMemo(() => {
    return allTasks
      .filter((task) => task.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [allTasks]);

  // 마감일이 없는 대기 중인 태스크 (PENDING만)
  const waitingTasks = useMemo(() => {
    return allTasks.filter((task) => !task.dueDate && task.status === 'PENDING');
  }, [allTasks]);

  // 오늘 태스크
  const todayTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tasksWithDueDate.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate < tomorrow;
    });
  }, [tasksWithDueDate]);

  // 이번 주 태스크 (오늘 제외)
  const thisWeekTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 내일
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 이번 주 일요일 계산
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);

    // 이번 주 토요일 자정 (일요일 00:00 직전)
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 7);
    thisWeekEnd.setHours(0, 0, 0, 0);

    return tasksWithDueDate.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= tomorrow && dueDate < thisWeekEnd;
    });
  }, [tasksWithDueDate]);

  // 선택한 날짜의 태스크
  const selectedDateTasks = useMemo(() => {
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    const nextDay = new Date(selected);
    nextDay.setDate(nextDay.getDate() + 1);

    return tasksWithDueDate.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= selected && dueDate < nextDay;
    });
  }, [tasksWithDueDate, selectedDate]);

  // 날짜별 태스크 개수 맵
  const taskCountByDate = useMemo(() => {
    const countMap = {};
    tasksWithDueDate.forEach((task) => {
      const date = new Date(task.dueDate);
      date.setHours(0, 0, 0, 0);
      const key = date.toISOString().split('T')[0];
      countMap[key] = (countMap[key] || 0) + 1;
    });
    return countMap;
  }, [tasksWithDueDate]);

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

  const getTaskCount = (date) => {
    const key = date.toISOString().split('T')[0];
    return taskCountByDate[key] || 0;
  };

  const formatTime = (dueDate) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '내일';
    if (diffDays < 0) return `${Math.abs(diffDays)}일 지남`;
    if (diffDays <= 7) return `${diffDays}일 남음`;

    const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${date.getMonth() + 1}/${date.getDate()} (${weekday})`;
  };

  if (loading && !tasks) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-destructive">에러: {error}</p>
      </div>
    );
  }

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
                <span className="text-xs text-muted-foreground">
                  ({todayTasks.length}개)
                </span>
              </div>

              {todayTasks.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  오늘 예정된 태스크가 없습니다
                </div>
              ) : (
                <div className="space-y-3">
                  {todayTasks.map((task) => (
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
                            {formatTime(task.dueDate)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Date Section (if not today) */}
            {!isToday(selectedDate) && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-foreground">선택한 날짜</span>
                  <span className="text-sm text-muted-foreground">
                    {selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({selectedDateTasks.length}개)
                  </span>
                </div>

                {selectedDateTasks.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    이 날짜에 예정된 태스크가 없습니다
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateTasks.map((task) => (
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
                              {formatTime(task.dueDate)}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* This Week Section */}
            {thisWeekTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-foreground">이번 주</span>
                  <span className="text-xs text-muted-foreground">
                    ({thisWeekTasks.length}개)
                  </span>
                </div>

                <div className="space-y-3">
                  {thisWeekTasks.map((task) => (
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
                            {formatTime(task.dueDate)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
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
                  const taskCount = getTaskCount(date);

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        'relative aspect-square flex items-center justify-center text-xs rounded-md transition-colors',
                        !isCurrentMonth && 'text-muted-foreground/40',
                        isCurrentMonth && 'text-foreground hover:bg-accent',
                        isTodayDate && 'bg-primary text-primary-foreground font-bold',
                        isSelectedDate && !isTodayDate && 'bg-accent ring-2 ring-primary'
                      )}
                    >
                      <span>{date.getDate()}</span>
                      {taskCount > 0 && isCurrentMonth && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                      )}
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
            {waitingTasks.length > 0 && (
              <Card className="p-4 mt-4 bg-green-50 border-green-200">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  대기 중인 목록 ({waitingTasks.length}개)
                </h4>
                <div className="space-y-2">
                  {waitingTasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="text-xs text-muted-foreground truncate"
                      title={task.content}
                    >
                      {task.content}
                    </div>
                  ))}
                  {waitingTasks.length > 5 && (
                    <div className="text-xs text-muted-foreground font-medium">
                      +{waitingTasks.length - 5}개 더
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
