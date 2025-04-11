# API 설정 가이드

## 환경 변수 설정

프로젝트는 다양한 환경(개발, 테스트, 프로덕션)에서 다른 API 엔드포인트를 사용할 수 있도록 환경 변수를 사용합니다.

### 환경 변수 파일

프로젝트 루트에 다음 파일들을 생성하여 환경별 설정을 관리할 수 있습니다:

- `.env`: 모든 환경에서 공통으로 사용되는 기본 환경 변수
- `.env.development`: 개발 환경에서 사용되는 환경 변수 (npm start)
- `.env.production`: 프로덕션 빌드에서 사용되는 환경 변수 (npm run build)
- `.env.test`: 테스트 환경에서 사용되는 환경 변수 (npm test)
- `.env.local`: 로컬 환경에서만 사용되는 환경 변수 (다른 .env 파일보다 우선순위가 높음)

### 사용 가능한 환경 변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `REACT_APP_API_URL` | API 서버 URL | https://api.todo.nuhgnod.site/api/items |

### 환경 변수 설정 방법

1. 프로젝트 루트에 `.env.local` 파일을 생성합니다.
2. 다음과 같이 환경 변수를 설정합니다:

```
REACT_APP_API_URL=https://api.todo.nuhgnod.site/api/items
```

3. 개발 서버를 재시작하거나 애플리케이션을 다시 빌드합니다.

### 프로덕션 환경 설정

프로덕션 환경에서는 `.env.production` 파일을 사용합니다. 이 파일은 `npm run build` 명령을 실행할 때 적용됩니다.

```
REACT_APP_API_URL=https://api.todo.nuhgnod.site/api/items
```

### 로컬 개발 환경 설정

로컬 개발 환경에서는 `.env.development` 또는 `.env.local` 파일을 사용합니다.

```
REACT_APP_API_URL=http://localhost:18080/api/items
```

## 주의사항

- 모든 환경 변수는 `REACT_APP_` 접두사로 시작해야 합니다.
- 환경 변수 파일은 버전 관리 시스템에 포함되지 않습니다 (`.gitignore`에 추가됨).
- 환경 변수를 변경한 후에는 개발 서버를 재시작해야 합니다.
