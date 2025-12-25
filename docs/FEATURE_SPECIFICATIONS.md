# MyTodoList Frontend - 기능 명세서

> 프로젝트 재구성을 위한 기능 명세 문서
> 작성일: 2025-12-24

---

## 📌 프로젝트 개요

**프로젝트명:** MyTodoList
**타입:** 할 일 관리 웹 애플리케이션
**주요 기술:** React 18, JWT 인증, .ics Import/Export

---

## 🎯 핵심 기능

### 1. 사용자 인증

#### 1.1 회원가입
- 입력 필드: 아이디, 비밀번호, 이름
- 아이디 중복 검증
- 회원가입 성공 시 자동으로 로그인 페이지로 이동

#### 1.2 로그인
- 입력 필드: 아이디, 비밀번호
- JWT 토큰 기반 인증
- 로그인 상태 유지 (localStorage)
- 로그인 실패 시 에러 메시지 표시

#### 1.3 로그아웃
- 로그아웃 버튼 클릭 시 토큰 삭제
- 로그인 페이지로 리다이렉트

---

### 2. 태스크 관리

#### 2.1 태스크 데이터 구조
```javascript
{
  id: "string",              // 서버에서 생성
  content: "string",         // 할 일 내용 (필수)
  status: "PENDING | IN_PROGRESS | COMPLETED | EXPIRED",
  dueDate: "ISO 8601 string" // 마감일 (선택적, nullable)
}
```

#### 2.2 태스크 상태
- **PENDING**: 대기 중
- **IN_PROGRESS**: 진행 중
- **COMPLETED**: 완료
- **EXPIRED**: 만료됨 (마감일이 지난 태스크)

#### 2.3 태스크 생성
- 모달을 통한 입력
- 내용 입력 (필수)
- 마감일 선택 (선택적)
  - 날짜 선택기 (DatePicker) 사용
  - 오늘 이전 날짜는 선택 불가
  - 선택한 날짜의 23:59:59로 설정
- 생성 시 기본 상태: PENDING

#### 2.4 태스크 조회
- 로그인 시 자동으로 전체 태스크 조회
- 상태별로 자동 분류

#### 2.5 태스크 수정
- **내용 수정**: 모달을 통해 content 수정
- **마감일 수정**: 모달을 통해 dueDate 수정
- **상태 변경**: 드래그앤드롭 또는 직접 수정
- **EXPIRED 태스크 재활성화**:
  - 새로운 마감일 설정
  - 상태를 PENDING으로 변경

#### 2.6 태스크 삭제
- 삭제 확인 모달 표시
- 확인 후 서버에서 삭제
- UI에서 즉시 제거

---

### 3. 뷰 모드

#### 3.1 칸반 보드 뷰 (Kanban View)
- **4개 컬럼**: PENDING, IN_PROGRESS, COMPLETED, EXPIRED
- **드래그 앤 드롭**:
  - 태스크를 다른 상태 컬럼으로 드래그하여 상태 변경
  - EXPIRED 컬럼은 드래그 불가 (이동 불가)
  - 드래그 시 실시간으로 서버에 업데이트
- **태스크 카드 표시**:
  - 제목 (content)
  - 마감일 (있는 경우)
  - 삭제 버튼
- **카드 클릭**: 상세 모달 표시
- **각 컬럼에 추가 버튼**: 해당 상태로 새 태스크 생성

#### 3.2 리스트 뷰 (List View)
- **테이블 형식**으로 모든 태스크 표시

- **정렬 기능**:
  - 마감일 (dueDate)
  - 내용 (content)
  - 상태 (status)
  - 오름차순/내림차순 전환

- **필터 기능**:
  - 전체 (all)
  - 상태별 필터 (PENDING, IN_PROGRESS, COMPLETED, EXPIRED)

- **검색 기능**:
  - 태스크 내용 기반 실시간 검색
  - 대소문자 구분 없음

- **행 클릭**: 상세 모달 표시
- **삭제 버튼**: 각 행마다 표시

#### 3.3 뷰 전환
- 칸반 뷰 ↔ 리스트 뷰 토글 버튼
- 사용자 선호 뷰를 localStorage에 저장
- 페이지 새로고침 시에도 선택한 뷰 유지

---

### 4. Import/Export 기능

#### 4.1 Export (.ics)
- 모든 태스크를 .ics (iCalendar) 형식으로 내보내기
- VTODO 형식 사용
- 파일명: `mytodolist_YYYY-MM-DD.ics`
- 버튼 클릭 시 즉시 다운로드

#### 4.2 Import (.ics)
- .ics 파일 업로드를 통한 태스크 가져오기
- **지원 형식**:
  - VTODO (할 일)
  - VEVENT (일정) - 일정의 종료 시간을 마감일로 변환
- Google Calendar, Apple Calendar 등과 호환
- Import 결과 표시:
  - 성공한 개수
  - 실패한 개수
  - 전체 개수
- Import 후 자동으로 태스크 목록 갱신

#### 4.3 사용 시나리오
- Google Calendar에서 일정을 내보내기하여 태스크로 가져오기
- 다른 기기 또는 사용자와 태스크 공유
- 백업 및 복원

---

### 5. 네비게이션

#### 5.1 메뉴 구조
- **메뉴 항목**:
  - Tasks (태스크 관리 메인)
  - Recurring Tasks (반복 일정 - Phase 3 예정)
  - Import/Export (가져오기/내보내기)
- **사용자 정보**:
  - 사용자 이름 표시
  - 로그아웃 기능

#### 5.2 반응형 동작
- **데스크톱**: 사이드바 또는 네비게이션 고정 표시
- **모바일**: 햄버거 메뉴 등을 통한 토글 방식
- 사용자의 사이드바 접기/펼치기 선호도를 localStorage에 저장

---

### 6. 모달 동작 요구사항

#### 6.1 태스크 추가
- 입력 필드:
  - 내용 (textarea, 필수)
  - 마감일 (DatePicker, 선택적)
- 취소 및 확인 액션 제공
- ESC 키로 닫기 지원
- 모달 외부 클릭으로 닫기 지원

#### 6.2 태스크 상세 보기
- 태스크 정보 표시:
  - 내용
  - 마감일 (있는 경우)
  - 현재 상태
- EXPIRED 상태: 재활성화 액션 제공
- 기타 상태: 수정 액션 제공
- 닫기 액션 제공

#### 6.3 태스크 수정
- 입력 필드:
  - 내용 (현재 값 미리 채움)
  - 마감일 (현재 값 미리 채움)
- 취소 및 저장 액션 제공

#### 6.4 재활성화 (EXPIRED 태스크)
- 새로운 마감일 선택 요구
- 확인 시 상태를 PENDING으로 변경

#### 6.5 삭제 확인
- 삭제할 태스크 식별 정보 표시
- 확인/취소 액션 제공

---

### 7. 기능적 요구사항

#### 7.1 상태 관리
- API 호출 중 로딩 상태 표시
- 버튼 중복 클릭 방지
- 네트워크 오류 및 API 오류 처리

#### 7.2 사용자 피드백
- Import/Export 작업 결과 표시
- 태스크 생성/수정/삭제 결과 피드백
- 에러 발생 시 명확한 메시지 제공

#### 7.3 폼 검증
- 필수 필드 비어있을 시 제출 버튼 비활성화
- 로그인: 아이디/비밀번호 필수
- 회원가입: 아이디/비밀번호/이름 필수
- 태스크 생성/수정: 내용 필수

#### 7.4 키보드 지원
- 모달: ESC 키로 닫기
- 폼: Enter 키로 제출 (적절한 경우)
- Tab 키를 통한 포커스 이동

---

## 🔌 API 명세

### Base URL
```
http://localhost:8080/api
또는
https://api.todo.nuhgnod.site/api
```

---

### 인증 API

#### POST /auths/signin
로그인

**Request:**
```json
{
  "account": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  // JWT 토큰
}
```

**Error:**
- `401 Unauthorized`: 아이디 또는 비밀번호 불일치

---

#### POST /auths/signup
회원가입

**Request:**
```json
{
  "account": "string",
  "password": "string",
  "name": "string"
}
```

**Response (200):**
```json
{
  "success": true
}
```

**Error:**
- `409 Conflict`: 이미 존재하는 아이디

---

### 태스크 API

모든 태스크 API는 선택적으로 Authorization 헤더를 포함할 수 있습니다:
```
Authorization: Bearer {accessToken}
```

---

#### GET /items
태스크 목록 조회

**Response (200):**
```json
{
  "data": [
    {
      "id": "string",
      "content": "string",
      "status": "PENDING | IN_PROGRESS | COMPLETED | EXPIRED",
      "dueDate": "2025-12-31T23:59:59.999Z",  // nullable
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

---

#### POST /items
태스크 생성

**Request:**
```json
{
  "content": "string",                        // 필수
  "status": "PENDING",                       // 필수
  "dueDate": "2025-12-31T23:59:59.999Z"     // 선택적
}
```

**Response (200/201):**
```json
{
  "data": {
    "id": "string",
    "content": "string",
    "status": "PENDING",
    "dueDate": "2025-12-31T23:59:59.999Z",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

---

#### PUT /items/{itemId}
태스크 수정

**Request:**
```json
{
  "id": "string",
  "content": "string",
  "status": "PENDING | IN_PROGRESS | COMPLETED | EXPIRED",
  "dueDate": "2025-12-31T23:59:59.999Z"  // nullable
}
```

**Response (200):**
```json
{
  "data": {
    "id": "string",
    "content": "string",
    "status": "PENDING",
    "dueDate": "2025-12-31T23:59:59.999Z",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

---

#### DELETE /items/{itemId}
태스크 삭제

**Response (200):**
```json
{
  "success": true
}
```

---

### Import/Export API

#### GET /items/export.ics
모든 태스크를 .ics 파일로 내보내기

**Response (200):**
```
Content-Type: text/calendar
Content-Disposition: attachment; filename="tasks.ics"

BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MyTodoList//EN
BEGIN:VTODO
UID:...
SUMMARY:할 일 내용
STATUS:NEEDS-ACTION
DUE:20251231T235959Z
END:VTODO
END:VCALENDAR
```

---

#### POST /items/import
.ics 파일에서 태스크 가져오기

**Request:**
```
Content-Type: multipart/form-data

file: {.ics 파일}
```

**Response (200):**
```json
{
  "imported": 10,  // 성공
  "failed": 2,     // 실패
  "total": 12      // 전체
}
```

**지원 형식:**
- VTODO (할 일)
- VEVENT (일정) - 종료 시간 → 마감일 변환

---

## 📦 필수 라이브러리

### 핵심 라이브러리
- **React 18**: UI 프레임워크
- **react-router-dom**: 라우팅 (필요 시)
- **react-datepicker**: 날짜 선택기

### 칸반 보드
- **@hello-pangea/dnd**: 드래그 앤 드롭
  - 또는 **dnd-kit**, **react-beautiful-dnd** 등 대체 가능

### 상태 관리
- 현재는 React hooks (useState, useEffect) 사용
- 필요 시 Zustand, Jotai 등 경량 상태 관리 라이브러리 고려

---

## 💾 로컬 스토리지

저장해야 할 데이터:
1. **user**: 사용자 정보 및 JWT 토큰
   ```json
   {
     "account": "string",
     "accessToken": "string"
   }
   ```

2. **preferredView**: 선호하는 뷰 모드
   - 값: `"kanban"` 또는 `"list"`

3. **sidebarCollapsed**: 사이드바 접기 상태
   - 값: `true` 또는 `false`

---

## 🎨 UI/디자인 (별도 정의 필요)

> 이 섹션은 새 UI 프레임워크/디자인 시스템 선택 후 작성 예정

### 반응형 브레이크포인트 (권장)
- **모바일**: 0 ~ 767px
- **태블릿**: 768px ~ 1023px
- **데스크톱**: 1024px 이상

---

## 📝 추가 고려사항

### Phase 3 예정 기능
- 반복 일정 (Recurring Tasks)
- RFC 5545 (iCalendar) RRULE 지원

### 성능 최적화
- 태스크 목록 가상화 (Virtual Scrolling) - 태스크 개수가 많을 경우
- React.memo 활용
- 불필요한 리렌더링 방지

### 보안
- XSS 방지 (사용자 입력 sanitize)
- JWT 토큰 만료 처리
- HTTPS 사용 (프로덕션)

### 테스트
- 단위 테스트 (Jest, React Testing Library)
- E2E 테스트 (Playwright, Cypress)

---

## 🚀 개발 우선순위

1. **Phase 1**: 기본 인증 + 태스크 CRUD
2. **Phase 2**: 칸반 보드 뷰 + 드래그앤드롭
3. **Phase 3**: 리스트 뷰 + 정렬/필터/검색
4. **Phase 4**: Import/Export 기능
5. **Phase 5**: 반응형 디자인 + 모바일 최적화

---

## 📄 변경 이력

- **2025-12-25**: UI 관련 내용 제거, 순수 기능 명세로 재구성
- **2025-12-24**: 초기 문서 작성 (기존 프로젝트 기준)

---

**참고:**
- 이 문서는 **기능적 요구사항**에 집중합니다
- UI/디자인 시스템은 새 프로젝트 시작 시 별도로 정의하세요
- API 명세는 현재 백엔드 기준으로 작성되었습니다

---

**문서 끝**
