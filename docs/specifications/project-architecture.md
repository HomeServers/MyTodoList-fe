# 프로젝트 아키텍처

## 개요
MyTodoList는 React 기반의 칸반 보드 스타일 Todo 관리 애플리케이션으로, 드래그 앤 드롭 기능을 통해 직관적인 태스크 관리를 제공합니다.

## 기술 스택
- **프론트엔드 프레임워크**: React 18.2.0
- **상태 관리**: React Hooks (useState, useEffect)
- **드래그 앤 드롭**: @hello-pangea/dnd 17.0.0
- **API 통신**: 네이티브 Fetch API
- **스타일링**: CSS 모듈

## 디렉토리 구조
```
src/
├── components/          # 리액트 컴포넌트
│   ├── Inputs/         # 입력 관련 컴포넌트
│   │   └── InputField.jsx
│   ├── Kanban/         # 칸반 보드 관련 컴포넌트
│   │   ├── KanbanBoard.jsx
│   │   ├── KanbanColumn.jsx
│   │   ├── KanbanCard.jsx
│   │   └── styles/     # 칸반 컴포넌트별 스타일
│   ├── Modal/          # 모달 관련 컴포넌트
│   │   ├── TaskInputModal.jsx
│   │   └── styles/     # 모달 스타일
│   └── buttons/        # 버튼 컴포넌트
│       ├── PrimaryButton.jsx
│       └── SecondaryButton.jsx
├── constants/          # 상수 정의
│   └── tasks.js        # 태스크 관련 상수
├── context/           # React Context (향후 확장)
├── data/              # 데이터 관련 (향후 확장)
├── hooks/             # 커스텀 훅
│   └── useKanban.js   # 칸반 보드 로직 관리 훅
├── styles/            # 전역 스타일
├── App.jsx            # 메인 애플리케이션 컴포넌트
└── index.js           # 진입점
```

## 아키텍처 패턴

### 컴포넌트 구조
- **프레젠테이셔널 컴포넌트**: UI 표현에 집중 (KanbanBoard, KanbanColumn, KanbanCard)
- **컨테이너 컴포넌트**: 데이터 및 로직 관리 (App.jsx)
- **커스텀 훅**: 비즈니스 로직 분리 (useKanban)

### 데이터 흐름
1. **상태 관리**: 
   - `useKanban` 훅에서 태스크 상태 및 관련 함수 관리
   - App 컴포넌트에서 상태와 핸들러 함수를 하위 컴포넌트로 전달

2. **이벤트 처리**:
   - 드래그 앤 드롭: KanbanBoard → useKanban.handleDragEnd → API 업데이트
   - 태스크 추가: KanbanColumn → useKanban.addTask → API 업데이트

3. **API 통신**:
   - 초기 데이터 로드: useEffect에서 fetchTasks 호출
   - 태스크 추가: addTask 함수에서 POST 요청
   - 태스크 상태 업데이트: handleDragEnd 함수에서 PUT 요청

## 주요 컴포넌트 역할

### App.jsx
- 애플리케이션의 진입점
- useKanban 훅을 통해 상태와 핸들러 함수 관리
- KanbanBoard 컴포넌트에 props 전달

### useKanban.js
- 태스크 상태 관리 (PENDING, IN_PROGRESS, COMPLETED)
- API 통신 로직 (fetchTasks, addTask, handleDragEnd)
- 드래그 앤 드롭 이벤트 처리

### KanbanBoard.jsx
- 전체 칸반 보드 레이아웃 관리
- DragDropContext 제공
- 상태별 KanbanColumn 렌더링

### KanbanColumn.jsx
- 특정 상태의 태스크 목록 표시
- 새 태스크 추가 UI 관리 (PENDING 컬럼)
- Droppable 영역 제공

### KanbanCard.jsx
- 개별 태스크 표시
- Draggable 요소 제공

## 확장성 고려사항
1. **상태 관리 확장**:
   - 애플리케이션 규모 확장 시 Context API 또는 Redux 도입 고려
   
2. **기능 확장**:
   - 태스크 삭제/편집 기능
   - 태스크 상세 정보 (기한, 우선순위 등)
   - 사용자 인증 및 개인화

3. **성능 최적화**:
   - React.memo를 통한 불필요한 리렌더링 방지
   - 가상 스크롤링 (대량의 태스크 처리 시)
