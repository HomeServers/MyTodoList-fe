# MyTodoList - 직관적인 칸반 스타일 할 일 관리 서비스

<div align="center">
  <img src="https://img.shields.io/badge/version-v1.2.0-green" alt="version" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="license" />
  <img src="https://img.shields.io/badge/react-18.2.0-61DAFB" alt="react" />
</div>

<div align="center">
  <img src="public/logo192.png" alt="MyTodoList Logo" width="120" />
  <h3> 🚀 <a href="https://todo.nuhgnod.site">https://todo.nuhgnod.site</a></h3>
  <p>효율적인 작업 관리를 위한 직관적인 칸반 보드 기반 할 일 관리 서비스</p>
</div>

## 📋 주요 기능

### 현재 버전 (v1.2.0)
- **Task 수정 모달(TaskEditModal)**: TaskInputModal과 동일한 UX/UI로 태스크 내용/마감일 수정 가능
- **상세 모달(TaskDetailModal)에서 수정 진입** 및 서버 동기화
- **key 중복 경고 완전 해결** (KanbanCard key: task.id || task.hash)
- **모달 기반 작업 입력/수정**: 일관된 UX, DatePicker, 클리어(X) 아이콘
- **칸반 보드 스타일 작업 관리**: 해야할 일, 진행 중, 완료 상태로 직관적인 작업 관리
- **작업 기간 설정/자동 만료**
- **드래그 앤 드롭**: 직관적인 작업 상태 변경

## 🚀 버전 히스토리

| 버전 | 출시일 | 주요 기능 |
|------|--------|----------|
| v1.0.0 | 2024-01-15 | 기본 칸반 보드 (해야할 일, 진행 중, 완료) |
| v1.0.1 | 2024-02-10 | 태스크 입력 모달 구현 |
| v1.0.2 | 2024-02-15 | 모달 렌더링 버그 수정 |
| v1.0.3 | 2024-02-20 | 모달 UI 개선 및 사용자 경험 향상 |
| v1.1.0 | 2024-03-01 | 작업 만료 기간 설정 기능 |
| v1.1.1 | 2024-03-15 | 자동 만료 처리 기능 |
| v1.2.0 | 2025-05-10 | Task 수정 모달(TaskEditModal) 신설, key 중복 경고 해결, 모달 UX 통일 |
| v1.3.0 | (예정) | 각 칸반 보드 페이지네이션, 만료된 task 재활성화 기능 도입 예정 |

## 🛠️ 기술 스택

- **Frontend**: React, CSS Modules
- **Drag & Drop**: @hello-pangea/dnd
- **상태 관리**: React Hooks
- **배포**: Netlify

## 🚀 시작하기

### 설치

```bash
# 저장소 복제
git clone https://github.com/yourusername/MyTodoList-fe.git

# 디렉토리 이동
cd MyTodoList-fe

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

### 빌드

```bash
# 프로덕션 빌드
npm run build
```

## 📝 프로젝트 구조

```
MyTodoList-fe/
├── public/              # 정적 파일
├── src/                 # 소스 코드
│   ├── components/      # 컴포넌트
│   │   ├── Kanban/      # 칸반 관련 컴포넌트
│   │   ├── Modal/       # 모달 컴포넌트
│   │   └── buttons/     # 버튼 컴포넌트
│   ├── hooks/           # 커스텀 훅
│   ├── styles/          # 전역 스타일
│   └── App.jsx          # 메인 앱 컴포넌트
└── docs/                # 문서
    ├── changes/         # 변경 이력
    ├── specifications/  # 기능 명세
    └── cascade/         # 문서 템플릿
```

## 📚 버전 관리 및 문서화 정책

- **기능 명세서**: `/docs/specifications/features/`에 모든 신규/수정 기능 명세화 (예: `task-edit-modal.md`)
- **변경 이력**: `/docs/changes/`에 날짜별/버전별 상세 변경내역 기록 (예: `2025-05-10-task-modal-edit-feature.md`)
- **명확한 버전 정책**: 주요 UI/UX/기능 개선 시 마이너 버전 업, 버그/패치 시 패치 버전 업
- **코드 품질**: DRY, SOLID, 일관된 네이밍/스타일, 문서화 원칙 준수
- **문서 구조**: 기능/변경/설정/템플릿 디렉토리 구분, 템플릿 기반 일관성 유지
- **AI 지원 개발**: 모든 주요 변경은 AI(예: Cascade)와 협업하며, 명세-구현-문서-테스트 일원화

---

> **버전 관리 팁:**
> - `/docs/changes/`의 날짜별 파일과 README의 버전 히스토리를 반드시 동기화하세요.
> - 신규 기능/주요 개선 시 반드시 기능 명세서와 변경이력을 먼저 작성하고, 구현 후 README/문서에 반영하세요.
> - 예시: `v1.3.0` = TaskEditModal 신설, key 중복 경고 해결, 모달 UX 통일


## 🤖 AI 지원 개발

이 프로젝트의 모든 코드는 GPT(ChatGPT)와 Cascade AI 코딩 어시스턴트의 도움을 받아 작성되었습니다. AI의 도움으로 효율적인 개발 프로세스를 구현하고, 최신 웹 개발 패턴을 적용했습니다.

AI 지원 개발 방식:
- 기능 명세서 작성 및 검토
- 코드 구현 및 리팩토링
- 버그 수정 및 최적화
- 문서화 작업

## 📄 라이선스

MIT License 2024 MyTodoList

## 📞 연락처

- 웹사이트: [https://todo.nuhgnod.site](https://todo.nuhgnod.site)
- 이메일: zhfptm12@gmail.com
- GitHub: [https://github.com/HomeServers/MyTodoList-fe](https://github.com/HomeServers/MyTodoList-fe)
