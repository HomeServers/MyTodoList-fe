# API 엔드포인트 명세

## 기본 정보
- 기본 URL: `https://api.todo.nuhgnod.site/api`
- 응답 형식: JSON
- 인증 방식: 현재 인증 없음 (향후 확장 가능)

## 엔드포인트 목록

### 1. 태스크 목록 조회

- **URL**: `/items`
- **Method**: `GET`
- **설명**: 모든 태스크 항목을 조회합니다.
- **응답 예시**:
  ```json
  [
    {
      "id": "task123",
      "content": "디자인 시안 검토",
      "status": "PENDING",
      "hash": "task123"
    },
    {
      "id": "task456",
      "content": "API 연동 구현",
      "status": "IN_PROGRESS",
      "hash": "task456"
    }
  ]
  ```

### 2. 새 태스크 추가

- **URL**: `/items`
- **Method**: `POST`
- **설명**: 새로운 태스크를 추가합니다.
- **요청 본문**:
  ```json
  {
    "content": "새 태스크 내용",
    "status": "PENDING"
  }
  ```
- **응답 예시**:
  ```json
  {
    "id": "task789",
    "content": "새 태스크 내용",
    "status": "PENDING",
    "hash": "task789"
  }
  ```

### 3. 태스크 상태 업데이트

- **URL**: `/items/:id`
- **Method**: `PUT`
- **설명**: 특정 태스크의 상태를 업데이트합니다.
- **URL 파라미터**:
  - `id`: 태스크 ID
- **요청 본문**:
  ```json
  {
    "id": "task123",
    "content": "디자인 시안 검토",
    "status": "IN_PROGRESS",
    "hash": "task123"
  }
  ```
- **응답**: 업데이트된 태스크 객체

## 에러 처리

- **400 Bad Request**: 잘못된 요청 형식
- **404 Not Found**: 존재하지 않는 태스크 ID
- **500 Internal Server Error**: 서버 내부 오류

## 데이터 모델

### 태스크 (Task)

| 필드명 | 타입 | 설명 |
|--------|------|------|
| id     | String | 태스크 고유 식별자 |
| hash   | String | 드래그 앤 드롭을 위한 고유 키 (id와 동일) |
| content | String | 태스크 내용 |
| status | String | 태스크 상태 (PENDING, IN_PROGRESS, COMPLETED) |
