# TaskEditModal (태스크 수정 모달) 기능 명세서

## 개요
- 기존 TaskInputModal과 동일한 UX/UI로, 태스크의 내용 및 마감일을 수정할 수 있는 모달 컴포넌트
- KanbanBoard에서 상세 모달(TaskDetailModal) → "수정" 버튼 클릭 시 진입

## 주요 기능
- 태스크 내용(textarea) 및 마감일(DatePicker) 수정
- 마감일 미지정 시 dueDate: null, 지정 시 23:59:59.999로 고정
- DatePicker: 오늘 이전 날짜 선택 불가, 달력(📅) 아이콘 및 클리어(X) 제공
- 저장 시 서버에 PUT 요청, 이후 서버에서 최신 데이터로 동기화
- 저장/취소 버튼, ESC 및 오버레이 클릭 시 닫힘

## UI/UX 명세
- TaskInputModal과 동일한 스타일, 버튼, 입력 필드, DatePicker UI 제공
- 마감일 영역: 버튼+달력 아이콘+날짜 표기+클리어(X) 아이콘
- 반응형 레이아웃, 키보드 접근성, 스크린 리더 지원

## 동작 시나리오
1. 상세 모달에서 "수정" 클릭 → TaskEditModal 팝업
2. 내용/마감일 수정 후 "저장" → 서버 PUT → KanbanBoard에 즉시 반영
3. "취소" 또는 ESC/오버레이 클릭 시 입력 내용 초기화 및 모달 닫힘

## 검증/테스트 요구사항
- 날짜 미지정 시 dueDate: null
- 날짜 지정 시 dueDate: 23:59:59.999로 고정
- DatePicker: 오늘 이전 날짜 비활성화
- 저장 시 dueDate가 올바른지 확인
- 다양한 길이의 텍스트 입력 테스트
- 모달 열기/닫기 및 수정 완료 후 동작 테스트
- 모바일 환경에서의 반응형 테스트

## 추가 고려사항
- 접근성: 키보드 탐색 및 스크린 리더 지원
- 성능: 모달 컴포넌트 최적화 (React.memo 등 고려)
- 확장성: TaskInputModal과 UI/로직 최대한 통일, 재사용성 확보
- 코드 품질: DRY/SOLID 원칙, 일관된 네이밍 및 스타일 적용

## 변경이력
- 2025-05-10: TaskEditModal 신설, TaskInputModal과 UI/UX 완전 통일, 서버 동기화 강화, key 중복 경고 해결 등
