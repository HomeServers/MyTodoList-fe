# RFC 5545 통합 계획 - Frontend

## 개요

MyTodoList Frontend에 RFC 5545 (iCalendar) 표준을 통합하여 사용자가 외부 캘린더와 할일을 쉽게 동기화할 수 있도록 UI/UX를 제공합니다.

---

## 현재 시스템 분석

### 현재 UI 구조
- **칸반 보드**: PENDING, IN_PROGRESS, COMPLETED, EXPIRED 4개 컬럼
- **Drag & Drop**: 상태 간 이동
- **모달 시스템**: 추가, 수정, 상세보기, 재활성화, 삭제 확인
- **날짜 선택**: react-datepicker를 사용한 마감일 설정

### 현재 기능
- 로그인/회원가입
- 할일 CRUD
- 상태 변경 (드래그 또는 모달)
- 마감일 설정
- 만료된 할일 재활성화

---

## RFC 5545 통합 목표

### 1단계: Import/Export 기능 ✅ **완료**
- [x] .ics 파일 내보내기 버튼
- [x] .ics 파일 가져오기 버튼
- [x] Import 결과 표시 (성공/실패 개수)
- [x] Export 진행 중 로딩 표시

### 2단계: 고급 필드 지원
- [ ] 우선순위 설정 (높음, 중간, 낮음)
- [ ] 진행률 슬라이더 (0-100%)
- [ ] 상세 설명 필드 (멀티라인)
- [ ] 카테고리/태그 입력
- [ ] 위치 필드

### 3단계: 반복 일정 UI
- [ ] 반복 일정 생성 모달
- [ ] 반복 패턴 선택 (매일, 매주, 매월, 매년)
- [ ] 반복 종료 조건 (무한, 횟수, 종료일)
- [ ] 반복 일정 목록 보기
- [ ] 반복 일정 수정/삭제

### 4단계: Google Calendar 연동 UI
- [ ] Google OAuth 인증 플로우
- [ ] 연결 상태 표시
- [ ] 동기화 제어 패널
- [ ] 동기화 상태 인디케이터
- [ ] 동기화 히스토리 확인
- [ ] 충돌 해결 UI (선택)

### 5단계: 알림 설정
- [ ] 알림 시간 설정 UI (만료 전 N분/시간/일)
- [ ] 알림 채널 선택 (이메일 등)
- [ ] 알림 내역 확인

---

## UI/UX 설계

### 1. 메인 칸반 보드 개선

#### 헤더 영역 확장
```
┌────────────────────────────────────────────────────────┐
│  MyTodoList                                            │
│  ┌──────────┐  ┌──────────┐  [사용자명] [로그아웃]    │
│  │📥 Import │  │📤 Export │                           │
│  └──────────┘  └──────────┘                           │
└────────────────────────────────────────────────────────┘
```

#### 칸반 카드 개선
```
┌─────────────────────────────────┐
│ [🔴] 프로젝트 완료               │  ← 우선순위 표시
│ 📅 2025-12-31                   │  ← 마감일
│ 📍 회의실 A                      │  ← 위치 (새로 추가)
│ 🏷️ work, important              │  ← 카테고리 (새로 추가)
│ ████████░░ 80%                  │  ← 진행률 (새로 추가)
│ 🔔 1시간 전 알림                 │  ← 알림 설정 (새로 추가)
│                          [🗑️]   │
└─────────────────────────────────┘
```

### 2. Import/Export 기능

#### Export 버튼 클릭 시
```javascript
// 다운로드 옵션 모달 또는 즉시 다운로드
- 전체 할일 내보내기
- 선택한 상태만 내보내기 (PENDING만, COMPLETED만 등)
- 날짜 범위 선택 (2025-01-01 ~ 2025-12-31)
```

#### Import 버튼 클릭 시
```javascript
// 파일 선택 모달
1. 사용자가 .ics 파일 선택
2. 파일 업로드 및 파싱
3. 미리보기 (가져올 항목 확인)
4. 중복 처리 옵션 (덮어쓰기/무시/병합)
5. Import 실행
6. 결과 표시 (성공 15개, 실패 2개)
```

### 3. 할일 추가/수정 모달 확장

#### TaskInputModal.jsx 확장
```
┌─────────────────────────────────────────┐
│  새 할일 추가                            │
├─────────────────────────────────────────┤
│  할일 내용 *                             │
│  ┌─────────────────────────────────────┐│
│  │프로젝트 문서 작성                    ││
│  └─────────────────────────────────────┘│
│                                          │
│  상세 설명 (선택)                        │
│  ┌─────────────────────────────────────┐│
│  │상세한 내용을 입력하세요...           ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                          │
│  마감일 *                                │
│  [📅 2025-12-31 18:00]                  │
│                                          │
│  우선순위 (선택)                         │
│  ◯ 가장 높음  ◯ 높음  ⦿ 보통            │
│  ◯ 낮음      ◯ 가장 낮음               │
│                                          │
│  카테고리 (선택)                         │
│  ┌─────────────────────────────────────┐│
│  │work, important                      ││
│  └─────────────────────────────────────┘│
│                                          │
│  위치 (선택)                             │
│  ┌─────────────────────────────────────┐│
│  │회의실 A                              ││
│  └─────────────────────────────────────┘│
│                                          │
│  알림 설정 (선택)                        │
│  ☐ 알림 받기                             │
│  └─ [30] 분 전   ▼                      │
│                                          │
│  🔁 반복 일정으로 만들기                 │
│                                          │
│         [취소]  [저장]                   │
└─────────────────────────────────────────┘
```

### 4. 반복 일정 생성 모달

#### RecurringTaskModal.jsx (새로 생성)
```
┌─────────────────────────────────────────┐
│  반복 일정 만들기                        │
├─────────────────────────────────────────┤
│  할일 내용 *                             │
│  ┌─────────────────────────────────────┐│
│  │매일 운동하기                         ││
│  └─────────────────────────────────────┘│
│                                          │
│  시작일 *                                │
│  [📅 2025-12-10]                        │
│                                          │
│  반복 패턴 *                             │
│  ⦿ 매일                                  │
│  ◯ 매주 [월] [화] [수] [목] [금] [토] [일]│
│  ◯ 매월 [10]일                           │
│  ◯ 매년 [12]월 [10]일                    │
│                                          │
│  반복 간격                               │
│  [2] 일/주/월마다                        │
│                                          │
│  종료 조건 *                             │
│  ◯ 무한 반복                             │
│  ⦿ 횟수 지정  [30]회                     │
│  ◯ 종료일 지정 [📅 2026-01-09]          │
│                                          │
│  매일 마감 시간                          │
│  [18:00]                                │
│                                          │
│  미리보기:                               │
│  "2025-12-10부터 30일 동안 매일 생성됨"  │
│                                          │
│         [취소]  [생성]                   │
└─────────────────────────────────────────┘
```

### 5. 진행률 표시

#### TaskDetailModal에 진행률 슬라이더 추가
```
┌─────────────────────────────────────────┐
│  할일 상세                               │
├─────────────────────────────────────────┤
│  프로젝트 문서 작성                      │
│  상태: IN_PROGRESS                       │
│                                          │
│  진행률                                  │
│  ████████░░ 80%                         │
│  0────────────────────────100           │
│                                          │
│  [진행률 업데이트]                       │
└─────────────────────────────────────────┘
```

---

## 컴포넌트 설계

### 새로운 컴포넌트

#### 1. ImportExportButtons.jsx
```javascript
// 위치: src/components/ImportExport/ImportExportButtons.jsx
// 기능: Import/Export 버튼 및 로직
- handleExport(): .ics 파일 다운로드
- handleImport(): 파일 선택 및 업로드
- ImportModal: 파일 업로드 및 미리보기
- ExportOptionsModal: 내보내기 옵션 선택
```

#### 2. RecurringTaskModal.jsx
```javascript
// 위치: src/components/Modal/RecurringTaskModal.jsx
// 기능: 반복 일정 생성/수정
- RecurrencePatternSelector: 반복 패턴 선택
- RecurrenceEndSelector: 종료 조건 선택
- RecurrencePreview: 미리보기
```

#### 3. RecurringTaskList.jsx
```javascript
// 위치: src/components/RecurringTask/RecurringTaskList.jsx
// 기능: 반복 일정 목록 표시
- RecurringTaskCard: 개별 반복 일정 카드
- 활성화/비활성화 토글
- 수정/삭제 버튼
```

#### 4. PrioritySelector.jsx
```javascript
// 위치: src/components/Inputs/PrioritySelector.jsx
// 기능: 우선순위 선택 (라디오 버튼 또는 드롭다운)
- HIGHEST, HIGH, MEDIUM, LOW, LOWEST
- 색상 코드: 빨강, 주황, 노랑, 파랑, 회색
```

#### 5. ProgressSlider.jsx
```javascript
// 위치: src/components/Inputs/ProgressSlider.jsx
// 기능: 진행률 슬라이더 (0-100%)
- 시각적 바 표시
- 퍼센트 숫자 표시
```

#### 6. CategoryInput.jsx
```javascript
// 위치: src/components/Inputs/CategoryInput.jsx
// 기능: 카테고리/태그 입력
- 쉼표로 구분
- 자동완성 (이전에 사용한 카테고리)
- 태그 형태로 표시
```

#### 7. AlarmSetting.jsx
```javascript
// 위치: src/components/Inputs/AlarmSetting.jsx
// 기능: 알림 시간 설정
- 체크박스 (알림 받기)
- 시간 선택 (분, 시간, 일 단위)
```

### 기존 컴포넌트 수정

#### KanbanCard.jsx 확장
```javascript
// 추가 표시 요소
- 우선순위 아이콘 (🔴 높음, 🟡 보통, 🔵 낮음)
- 진행률 바
- 카테고리 태그
- 위치 아이콘
- 알림 아이콘
```

#### TaskInputModal.jsx 확장
```javascript
// 새로운 입력 필드
- description (상세 설명)
- priority (우선순위)
- categories (카테고리)
- location (위치)
- alarmMinutesBefore (알림 시간)
- isRecurring (반복 일정 여부)
```

#### TaskEditModal.jsx 확장
```javascript
// percentComplete 슬라이더 추가
// 기존 필드 + RFC 5545 필드 모두 수정 가능
```

---

## API 연동

### 새로운 API 함수 (src/services/api.js)

```javascript
// Export
export const exportToIcs = async (accessToken, options = {}) => {
  const response = await fetch(`${API_URL}/api/items/export.ics`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) throw new Error('Export failed');

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mytodolist_${new Date().toISOString().split('T')[0]}.ics`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Import
export const importFromIcs = async (accessToken, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/api/items/import`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    body: formData
  });

  if (!response.ok) throw new Error('Import failed');

  const result = await response.json();
  return result; // { imported: 15, failed: 2 }
};

// 반복 일정 생성
export const createRecurringTask = async (accessToken, data) => {
  const response = await fetch(`${API_URL}/api/recurring-tasks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error('Failed to create recurring task');

  return await response.json();
};

// 반복 일정 목록
export const fetchRecurringTasks = async (accessToken) => {
  const response = await fetch(`${API_URL}/api/recurring-tasks`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) throw new Error('Failed to fetch recurring tasks');

  return await response.json();
};

// 반복 일정 삭제
export const deleteRecurringTask = async (accessToken, id) => {
  const response = await fetch(`${API_URL}/api/recurring-tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) throw new Error('Failed to delete recurring task');
};

// 진행률 업데이트 (기존 updateTask 확장)
export const updateTaskProgress = async (accessToken, itemId, percentComplete) => {
  return updateTask(itemId, { percentComplete }, accessToken);
};
```

---

## 상태 관리

### useKanban Hook 확장
```javascript
// src/hooks/useKanban.js

const [recurringTasks, setRecurringTasks] = useState([]);

const fetchRecurringTasksData = async () => {
  if (!user?.accessToken) return;
  try {
    const data = await fetchRecurringTasks(user.accessToken);
    setRecurringTasks(data);
  } catch (error) {
    console.error('Failed to fetch recurring tasks:', error);
  }
};

const addRecurringTask = async (taskData) => {
  try {
    const newTask = await createRecurringTask(user.accessToken, taskData);
    setRecurringTasks([...recurringTasks, newTask]);
    return newTask;
  } catch (error) {
    console.error('Failed to create recurring task:', error);
    throw error;
  }
};
```

---

## 구현 단계

### Phase 1: Import/Export 기능 ✅ **완료** (1-2주)
1. **ImportExportButtons 컴포넌트 생성**
   - Export 버튼 클릭 시 .ics 다운로드
   - Import 버튼 클릭 시 파일 선택 모달

2. **API 연동**
   - exportToIcs 함수 구현
   - importFromIcs 함수 구현

3. **UI 통합**
   - KanbanBoard 헤더에 버튼 추가
   - Import 결과 토스트/모달로 표시

4. **테스트**
   - 다양한 .ics 파일 테스트
   - Google Calendar, Outlook 호환성 확인

### Phase 2: 고급 필드 UI (2주)
1. **입력 컴포넌트 생성**
   - PrioritySelector
   - ProgressSlider
   - CategoryInput
   - AlarmSetting

2. **모달 확장**
   - TaskInputModal에 새 필드 추가
   - TaskEditModal에 새 필드 추가
   - TaskDetailModal에 진행률 표시

3. **KanbanCard 개선**
   - 우선순위 표시
   - 진행률 바
   - 카테고리 태그
   - 알림 아이콘

4. **API 연동**
   - createTask, updateTask에 새 필드 포함

### Phase 3: 반복 일정 UI (2-3주)
1. **RecurringTaskModal 생성**
   - 반복 패턴 선택기
   - 종료 조건 선택기
   - RRULE 생성 로직

2. **RecurringTaskList 생성**
   - 반복 일정 목록 표시
   - 수정/삭제 기능

3. **Navigation 추가**
   - 탭 또는 사이드바에 "반복 일정" 메뉴
   - 칸반 보드와 전환 가능

4. **API 연동**
   - createRecurringTask
   - fetchRecurringTasks
   - updateRecurringTask
   - deleteRecurringTask

### Phase 4: Google Calendar 연동 UI (2-3주)
1. **CalendarConnectionsPage 생성**
   - 연결된 캘린더 목록 표시
   - 각 연결의 상태 (활성, 비활성, 에러)
   - 마지막 동기화 시간 표시

2. **GoogleCalendarConnect 컴포넌트**
   - "Google 계정으로 연결" 버튼
   - OAuth 인증 플로우 처리
   - Redirect URI 처리 (/callback)
   - 연결 성공/실패 표시

3. **SyncControlPanel 생성**
   - 자동 동기화 ON/OFF 토글
   - 수동 동기화 버튼 ("지금 동기화")
   - 동기화 방향 선택 (양방향, 단방향)

4. **SyncStatusIndicator 생성**
   - 헤더에 동기화 상태 표시
   - 동기화 중 아이콘 (스피너)
   - 마지막 동기화 시간
   - 에러 발생 시 경고 표시

5. **SyncHistoryModal 생성**
   - 동기화 히스토리 목록
   - 각 동기화의 성공/실패 항목 수
   - 에러 메시지 표시

6. **ConflictResolutionModal (선택)**
   - 충돌 발생 시 사용자에게 선택 요청
   - 양쪽 버전 비교 표시

7. **API 연동**
   ```javascript
   // src/services/googleCalendarSync.js
   - initiateGoogleAuth()
   - getGoogleSyncStatus()
   - triggerGoogleSync()
   - disconnectGoogle()
   - fetchSyncHistory()
   ```

8. **네비게이션 추가**
   - "캘린더 연동" 메뉴 추가
   - 설정 페이지에서 접근 가능

### Phase 5: UX 개선 및 최적화 (1주)
1. **로딩 상태 표시**
   - Import/Export 진행 중 스피너
   - 반복 일정 생성 중 표시

2. **에러 핸들링**
   - Import 실패 시 에러 메시지
   - 유효성 검사 (RRULE 오류 등)

3. **반응형 디자인**
   - 모바일에서도 사용 가능한 UI
   - 터치 친화적인 컨트롤

4. **접근성 개선**
   - 키보드 네비게이션
   - ARIA 속성 추가

---

## 디자인 시스템

### 우선순위 색상
```css
.priority-highest { color: #e74c3c; } /* 빨강 */
.priority-high { color: #e67e22; }    /* 주황 */
.priority-medium { color: #f39c12; }  /* 노랑 */
.priority-low { color: #3498db; }     /* 파랑 */
.priority-lowest { color: #95a5a6; }  /* 회색 */
```

### 진행률 바
```css
.progress-bar {
  height: 8px;
  background: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  transition: width 0.3s ease;
}
```

### 카테고리 태그
```css
.category-tag {
  display: inline-block;
  padding: 2px 8px;
  margin: 2px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 12px;
  font-size: 12px;
}
```

---

## 의존성 추가

### package.json 업데이트
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^7.1.3",
    "@hello-pangea/dnd": "^17.0.0",
    "react-datepicker": "^4.8.0",

    // 새로 추가
    "ical.js": "^1.5.0",           // iCalendar 파싱/생성 (클라이언트)
    "react-select": "^5.8.0",      // 고급 셀렉트 (카테고리 자동완성)
    "react-toastify": "^10.0.0",   // 토스트 알림 (Import 결과 등)
    "date-fns": "^3.0.0"           // 날짜 포맷팅 (RRULE 미리보기)
  }
}
```

---

## 테스트 전략

### 단위 테스트
- RRULE 생성 로직 테스트
- 우선순위 선택 컴포넌트
- 진행률 슬라이더

### 통합 테스트
- Import/Export 플로우
- 반복 일정 생성 플로우
- API 연동

### E2E 테스트
- 사용자가 .ics 파일을 import하는 전체 플로우
- 반복 일정을 생성하고 확인하는 플로우

---

## 예상 일정

| Phase | 내용 | 예상 기간 |
|-------|------|-----------|
| Phase 1 | Import/Export 기능 ✅ | ~~1-2주~~ 완료 |
| Phase 2 | 고급 필드 UI | 2주 |
| Phase 3 | 반복 일정 UI | 2-3주 |
| Phase 4 | Google Calendar 연동 UI | 2-3주 |
| Phase 5 | UX 개선 및 최적화 | 1주 |
| **총계 (1-3)** | **MVP** | **5-7주** |
| **총계 (1-4)** | **Google 연동 포함** | **7-10주** |
| **총계 (1-5)** | **전체** | **8-11주** |

---

## 사용자 시나리오

### 시나리오 1: Google Calendar에서 가져오기
1. 사용자가 Google Calendar에서 할일 목록을 .ics 파일로 export
2. MyTodoList에서 "Import" 버튼 클릭
3. .ics 파일 선택
4. 미리보기 화면에서 가져올 항목 확인
5. "가져오기" 클릭
6. 칸반 보드에 새 할일들이 나타남

### 시나리오 2: 매일 반복되는 운동 일정 만들기
1. 사용자가 "반복 일정" 탭으로 이동
2. "새 반복 일정" 버튼 클릭
3. 모달에서 설정:
   - 내용: "아침 운동"
   - 시작일: 2025-12-10
   - 반복: 매일
   - 종료: 30회 반복
   - 마감 시간: 오전 8시
4. "생성" 클릭
5. 시스템이 30개의 할일을 자동 생성 (또는 백엔드 스케줄러가 순차 생성)

### 시나리오 3: 우선순위와 진행률 관리
1. 사용자가 중요한 프로젝트를 추가
2. 우선순위를 "가장 높음"으로 설정
3. 칸반 카드에 빨간색 표시
4. 작업 진행 시 카드 클릭하여 진행률 업데이트 (50% → 80%)
5. 진행률 바가 실시간으로 변경

### 시나리오 4: Google Calendar 연동
1. 사용자가 "캘린더 연동" 메뉴로 이동
2. "Google 계정으로 연결" 버튼 클릭
3. Google OAuth 인증 화면으로 리다이렉트
4. 권한 승인 후 MyTodoList로 돌아옴
5. 연결 성공 메시지 표시
6. "지금 동기화" 버튼으로 초기 동기화 실행
7. MyTodoList의 할일들이 Google Calendar에 나타남
8. Google Calendar에서 이벤트 수정
9. MyTodoList에 자동 반영 (실시간)
10. 동기화 히스토리에서 변경 내역 확인

---

## 참고 자료

- [RFC 5545 - iCalendar Specification](https://datatracker.ietf.org/doc/html/rfc5545)
- [ical.js Library Documentation](https://github.com/kewisch/ical.js/)
- [React DatePicker](https://reactdatepicker.com/)
- [React Select](https://react-select.com/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)

---

## 문의 및 피드백

프로젝트 관련 문의사항이나 제안사항은 GitHub Issues에 등록해주세요.
