# MyTodoList - 직관적인 칸반 스타일 할 일 관리 서비스

<div align="center">
  <img src="https://img.shields.io/badge/version-v1.2.0-blue" alt="version" />
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
- **칸반 보드 스타일 작업 관리**: 해야할 일, 진행 중, 완료 상태로 직관적인 작업 관리
- **작업 기간 설정**: 각 작업에 만료 기간을 설정하여 우선순위 관리
- **자동 만료 처리**: 설정한 기간이 지나면 자동으로 만료 탭으로 이동
- **만료 작업 재활성화**: 만료된 작업에 새 기간을 설정하여 다시 활성화
- **모달 기반 작업 입력**: 사용자 친화적인 모달 UI로 새 작업 추가
- **드래그 앤 드롭**: 직관적인 작업 상태 변경을 위한 드래그 앤 드롭 기능

## 🚀 버전 히스토리

| 버전 | 출시일 | 주요 기능 |
|------|--------|----------|
| v1.0.0 | 2024-01-15 | 기본 칸반 보드 (해야할 일, 진행 중, 완료) |
| v1.0.1 | 2024-02-10 | 태스크 입력 모달 구현 |
| v1.0.2 | 2024-02-15 | 모달 렌더링 버그 수정 |
| v1.0.3 | 2024-02-20 | 모달 UI 개선 및 사용자 경험 향상 |
| v1.1.0 | 2024-03-01 | 작업 만료 기간 설정 기능 |
| v1.1.1 | 2024-03-15 | 자동 만료 처리 기능 |
| v1.2.0 | 2024-04-01 | 만료 작업 재활성화 기능 |

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

## 📚 문서화 원칙

이 프로젝트는 다음과 같은 문서화 원칙을 따릅니다:

1. **기능 정의 문서**: 모든 새로운 기능은 구현 전 명세서 작성
2. **변경 이력 관리**: 버전별 변경사항 문서화
3. **코드 품질 원칙**: DRY(Don't Repeat Yourself), SOLID 원칙 준수
4. **일관된 문서 구조**: 템플릿 기반 문서화로 일관성 유지

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
