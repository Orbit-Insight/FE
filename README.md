# Planet Project

React + Vite 프론트엔드와 Express 백엔드가 함께 있는 프로젝트입니다.

## 실행

- 프론트엔드: `npm run dev`
- 백엔드 API: `npm run server` (기본 포트 4000, `.env`의 `PORT`로 변경 가능)

## 환경변수

- 프론트엔드가 백엔드를 호출하도록 `./.env`에 `VITE_API_URL=http://localhost:4000` (또는 `/api`까지 적어도 됨) 설정

## API

- `GET /` API 안내
- `GET /health` 상태 체크
- `GET /api/planets` 행성 목록
- `GET /api/planets/:id` 단일 행성 조회 (예: `earth`, `mars`)
- `POST /api/auth/login` 로그인 (데모 계정: astro / planet123)
- `POST /api/auth/signup` 회원가입 (메모리 저장)
