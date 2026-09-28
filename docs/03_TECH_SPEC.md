# 빌드로그 기술 명세

갱신일: 2026-09-27 · 상태: **설계 제안 / 미구현** · 관련: [제품](01_PRODUCT_SPEC.md), [UI/UX](02_UI_UX.md)

Next.js 사용은 현재 사용자 요청이며, 첫 문답에서 기반 플랫폼·로그인·선택적 위치·단일 소유자·프로젝트 팔로우·최신순 피드·외부 RSS/AI 원고·Featured 테스트 결제·혼합 첨부·Release 유형을 확정했다. 자동화 소재는 인디 뉴스·포럼 중심이며 주요 업계 최신 뉴스도 포함한다. 구체적인 패키지·데이터 구조·API는 구현 전 설계안이며, 패키지 설치·DB 생성·외부 연결을 했다는 뜻이 아니다. Q15~Q24 및 연속 카드 접기는 [확정, 사용자 2026-09-26]이며 아래 데이터 표현·제약 방식은 구현 설계안으로 구분한다.

## 1. 기술 스택과 선택 근거

| 영역 | 제안 | 이유 / 미결정 |
|---|---|---|
| 웹 | Next.js App Router + TypeScript 제안 | Next.js 확정. 라우터·언어·정확한 버전은 구현안 |
| 스타일 | Tailwind CSS + 공통 토큰 | 화면을 빠르게 구성하되 브랜드 토큰을 한곳에서 관리. 추가 UI 라이브러리는 필요할 때 선택 |
| 데이터·회원·파일 | Supabase PostgreSQL / Auth / Storage | Q1 확정. 관계·소유권·파일 관리 통합 |
| 가입·로그인 | Supabase Auth + GitHub / Google | Q1 확정. 이메일 가입은 MVP 제외, 계정 연결은 제공자 기본 동작·수동 UI 제외(Q22) [확정, 사용자 2026-09-26] |
| DB 접근 | Supabase 클라이언트 + SQL migration | 초기 ORM 추가 없이 관계 제약·트랜잭션·RLS를 직접 검증 |
| 배포 | Vercel | Q1 확정. 요금제·실행 시간·스케줄러 제약은 구현 전 확인 |
| 지도 | Kakao Maps Web API | Q1/Q11 확정. 위치 선택·기본 비공개, 지역 대표 좌표만 사용. 키·허용 도메인은 구현 전 확인 |
| 결제 | Toss Payments v2 테스트 결제 | Q12 확정. Featured 1,000원·7일·수동 시작·시작 전 취소·예외 운영자 취소 |
| 콘텐츠 작업 | 외부 RSS/Atom·공식 API 수집 + AI 원고 생성(Q5), DB 작업 상태 + 서버 실행기 | 하루 1회 수집·AI 초안 최대 5개·승인 후 게시 최대 2개(Q8). 초기 소스 4개·KST 집계 확정(Q15/Q23) [확정, 사용자 2026-09-26], 모델·비용 상한은 미정 |
| AI 원고 | GPT 5.6 Luna(사용자 지정 2026-09-27) | 정확한 API 모델 ID·연결 방식은 연동 시 확인. AI 비용 바탕은 GPT Pro 5X 구독(사용자 2026-09-27). API 월 상한 기본값 $5 [기본값 제안], 설정 후 생성 활성. 연동 시 구독 사용량과 API 토큰 과금이 별도인지 확인. 홍보·마케팅 예산은 [미정, 후속]. 가격 페이지(2026-09-27 확인, https://developers.openai.com/api/docs/pricing) 기준 1M 토큰당 `gpt-5.6-luna` 입력 $0.20/출력 $1.20, `gpt-6-luna` 입력 $0.10/출력 $0.50, `gpt-5-nano` 입력 $0.05/출력 $0.40. 가성비 대안은 `gpt-6-luna` [제안]. Q8 물량(하루 초안 최대 5개, 초안당 입력 약 3천·출력 약 1천 토큰 가정)이면 세 모델 모두 월 수 달러 이내 [추정, 실제 사용량으로 정산]. 월 상한 기본값 $5 [기본값 제안]. |
| 검증 도구 | 타입 검사·ESLint·Vitest·Playwright 후보 | 도구 수보다 도메인 제약·권한·결제 재시도 검증을 우선 |

프레임워크와 패키지의 **정확한 버전은 앱 기반 구성 시 공식 지원 범위와 함께 고정**한다. 현재 저장소에는 `package.json`·lockfile·앱 소스가 없다. 별도 Cloudflare 서비스, Redis, 실시간 구독, 벡터 DB는 기본 전제가 아니다.

## 2. 아키텍처와 모듈 경계

```text
브라우저
  ├─ 공개 페이지: Server Components로 첫 콘텐츠 제공
  ├─ 입력/반응/지도/결제: 필요한 Client Components
  └─ 업로드: 권한 확인 후 제한된 Storage 업로드 경로
           ↓
Next.js
  ├─ 읽기 서비스: 피드 / 프로젝트 / 프로필 / 검색
  ├─ 변경 서비스: 프로젝트 / 게시 / 소셜 / 운영
  ├─ 결제 서비스: 주문 / 승인 / 취소 / 대사
  └─ 외부 경계: URL 미리보기 / 뉴스·포럼 수집 / AI 생성 / 결제 / 예약 작업
           ↓
PostgreSQL + RLS   /   Storage   /   외부 제공자
```

- UI와 외부 API 처리 아래에 동일한 도메인 서비스를 둔다. Server Component가 자기 서버의 HTTP API를 호출하는 중복 경로는 기본으로 만들지 않는다.
- 사용자 변경은 Route Handler를 기본 계약으로 제안한다. Server Action을 쓰더라도 권한·검증 로직은 같은 서비스에 둔다.
- 공개 페이지의 내용과 개인별 좋아요/저장 상태를 구분한다. 관리자·결제 코드와 비밀키는 서버 전용 모듈로 제한한다.
- 기본 서버 런타임은 Node.js다. OG 수집·결제와 인증에 Edge 제약을 불필요하게 추가하지 않는다.
- 결제와 콘텐츠 작업은 외부 시스템 호출이 중간에 실패할 수 있는 상태 전이로 다룬다. 분산 트랜잭션이 된다고 가정하지 않는다.

예정 구조:

```text
src/app/                 화면·로딩·오류·Route Handlers
src/features/projects/   프로젝트 규칙·서비스·입력 검증
src/features/posts/      게시물·미디어·Release
src/features/feed/       피드·검색 읽기 모델
src/features/social/     좋아요·저장·팔로우
src/features/content/    공식 카드·검수·예약
src/features/billing/    주문·결제·노출
src/features/profiles/   프로필·공개 위치
src/lib/                 외부 클라이언트·서버 설정
supabase/migrations/     구현할 때 생성하는 스키마 변경
```

위 경로는 설계 예시이며 아직 존재하지 않는다. 도메인 변경이 생기기 전부터 빈 계층·추상 저장소 인터페이스를 만들 필요는 없다.

## 3. 인증·권한·보안

### 인증 방식과 구현안

Supabase Auth의 GitHub·Google 로그인을 사용한다(Q1 확정). 구현안은 `@supabase/ssr`의 쿠키 기반 브라우저/서버 클라이언트를 분리하는 방식이다. 서버는 검증된 신원으로 권한을 판정하고 쿠키의 세션 객체를 그대로 신뢰하지 않는다. Next.js 16 계열의 세션 갱신 경계는 `proxy.ts`지만, 실제 선택 버전의 공식 지침을 따라 파일명을 정한다. [공식 SSR 문서](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs)

**K-10 공식 확인(2026-09-26 22:47 KST):** Supabase Redirect URLs는 와일드카드를 허용하므로 문서의 `*`·`**` 규칙상 `https://*.vercel.app/**`를 허용 목록에 쓸 수 있고(공식 Vercel 예시는 `https://*-<team-or-account-slug>.vercel.app/**`), GitHub·Google OAuth 제공자에 등록하는 콜백은 기본 호스팅 기준 Supabase 프로젝트의 `https://<ref>.supabase.co/auth/v1/callback`이다. 출처: [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls), [GitHub 제공자](https://supabase.com/docs/guides/auth/social-login/auth-github), [Google 제공자](https://supabase.com/docs/guides/auth/social-login/auth-google).

**[제안, K-10]** 위 문서에서 추론하면 커스텀 도메인 없이 Vercel 제공 호스트로 인증 구현에 착수할 수 있다. 앱으로 돌아오는 `redirectTo`·Site URL과 제공자 콜백은 구분하고, 미리보기 허용 목록은 소유한 팀·계정 범위로 제한하며 운영은 정확한 URL 경로를 사용한다. 실제 Supabase·OAuth 앱·Vercel 설정 및 로그인은 미검증이고 Q7의 도메인 결정은 유지한다.

**K-10 조사 반영(2026-09-27):** [로그인 확인표·사용자 체크리스트](research/oauth-login-check.md)에 따라 Site URL은 실제 도착 주소로, Redirect URLs는 정확한 주소 또는 소유한 Vercel 미리보기 범위로 설정하고 GitHub·Google에는 Supabase 콜백을 등록하며, Google 기본 이름·이메일·프로필 범위의 Testing 예외와 직접 `/auth/v1/authorize` 요청 후 URL 조각의 `access_token` 확인 절차까지 문서로 확인했으나 **실제 로그인 검증은 사용자 실행 체크리스트로 진행, 결과 미기록**이다(공식 출처: [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls), [GitHub](https://supabase.com/docs/guides/auth/social-login/auth-github), [Google](https://supabase.com/docs/guides/auth/social-login/auth-google), [Testing 예외](https://support.google.com/cloud/answer/15549945?hl=en), [Auth API](https://github.com/supabase/auth/blob/master/docs/oauth.go), [토큰 반환](https://supabase.com/docs/guides/auth/sessions/implicit-flow); 조사 확인 2026-09-27 00:23~00:24 KST).

**계정 연결(D9·Q22):** Supabase Auth 제공자의 기본 계정 연결 동작을 따른다. 소유 확인 없는 임의 병합은 금지하고 수동 연결 UI는 MVP에서 제외한다. [확정, 사용자 2026-09-26]. 이는 제품 정책이며 실제 제공자 설정·로그인 동작은 인증 연동 시 검증한다.

민감 작업은 최신 계정 상태·프로젝트 소유·운영자 역할을 다시 확인한다. 운영자 역할은 사용자가 수정 가능한 프로필 메타데이터로 판정하지 않는다. 정지·삭제 이후 남아 있는 토큰에 대한 처리도 구현 검증에 포함한다. 운영자는 사용자 본인 계정에 명시적 역할을 부여하며 개발자라는 이유로 자동 권한을 얻지 않는다. 승인·게시·숨김·복원·취소는 감사 기록을 남긴다. [확정, 사용자 2026-09-26] (D6·Q18)

### 접근 행렬

| 데이터/행동 | 비회원 | 본인 | 다른 회원 | 운영자/작업 실행기 |
|---|---|---|---|---|
| 공개 프로필·프로젝트·게시물 | 공개 필드 읽기 | 소유 항목 변경 | 공개 읽기 | 정책에 따른 숨김/복원 |
| 저장 목록 | 불가 | 본인만 읽기·변경 | 불가 | 일상 운영 조회 대상 아님 |
| 좋아요·팔로우 | 기본 카드 숫자 없음(Q3) | 관계 추가·삭제, 본인 게시물/프로젝트 통계(Q19) | 타인의 관계 변경·본인 통계 조회 불가 | 역할에 따른 집계 관리 |
| 행동 이벤트·집계 | 불가 | 일반 회원 불가 | 불가 | 운영자 역할만 집계 접근(Q20) [확정, 사용자 2026-09-26] |
| 비공개 위치 | 불가 | 읽기·변경 | 불가 | 원칙적으로 공개 API에 없음 |
| 주문·결제 | 불가 | 자신의 내역 읽기·정해진 요청 | 불가 | 서버 결제 처리, 제한된 운영 조회 |
| 공식 초안·예약 | 불가 | 일반 회원 불가 | 불가 | 권한자만 작성·승인·게시 |
| 신고·조치 기록 | 불가 | 자기 제출 결과만 | 불가 | 제한된 운영 조회·조치 |

- 외부 노출 스키마의 테이블은 RLS와 필요한 명시적 권한을 함께 설정한다. UPDATE에는 기존 행 소유권과 변경 후 소유권 검사를 모두 둔다. 뷰와 DB 함수도 우회 경로가 없는지 검사한다. [공식 RLS 문서](https://supabase.com/docs/guides/database/postgres/row-level-security)
- 일반 요청에 관리자/secret 클라이언트를 사용해 RLS를 우회하지 않는다. 서버 작업의 제한된 권한과 사용자 요청의 권한을 분리한다.
- 위치는 시·군·구 코드와 대표 좌표만 다룬다(Q11). 정확한 개인/업무 주소·실시간 좌표는 수집하지 않는다. 비공개로 설정한 지역도 공개 응답에서 제외한다.
- 인증 쿠키를 갱신하거나 개인 데이터를 포함한 응답을 공유 캐시에 저장하지 않는다.
- HTML 입력은 지원하지 않는 안을 권장한다. 텍스트·링크·구조화된 카드만 렌더하고 URL 스킴·파일 MIME·파일 서명·크기를 검증한다.

### 비밀정보와 실행 설정

| 종류 | 예시 이름 | 노출 경계 |
|---|---|---|
| 공개 설정 | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 공개 가능, RLS가 접근 통제 |
| 서버 전용 | `SUPABASE_SECRET_KEY`, `TOSS_SECRET_KEY`, `CONTENT_JOB_SECRET` | 브라우저 번들·로그·Git 금지 |
| AI 서버 설정 | `OPENAI_API_KEY`, `CONTENT_AI_MODEL`, `CONTENT_AI_MONTHLY_BUDGET` | GPT 직접 API 연결 시의 이름 예시. 실제 제공 경로·모델·비용 상한 확정 전 생성 비활성 |
| 도메인 제한 공개 키 | `NEXT_PUBLIC_KAKAO_MAP_KEY`, `NEXT_PUBLIC_TOSS_CLIENT_KEY` | 제공자 요구에 맞춰 허용 도메인/환경 분리 |
| 제품 정책 | 게시 크기·첨부 제한·노출 기간·공식 카드 간격 | 확정된 Q 답변을 설정·서버 검증에 동일 적용 |

이름은 설계안이다. 실제 값은 문서에 기록하지 않는다. 도메인·문의 이메일은 더미로 진행한다(사용자 2026-09-27): 호스트는 Vercel 기본 `*.vercel.app`, 문의 이메일은 예약 예시 도메인을 쓴 `contact@buildlog.example`이며 출시 전 실제 값으로 교체한다. 개발·미리보기·운영 환경의 키와 데이터는 분리한다.

## 4. 데이터 모델

### 공통 규칙

- 식별자는 UUID를 기본으로, 시각은 UTC `timestamptz`로 저장하고 예약·게시 시각은 UI에서 KST로 표시한다. 일일 상한은 KST 00:00 기준이며 지연·재시도는 원래 집계 날짜를 유지한다. [확정, 사용자 2026-09-26] (D10·Q23)
- 본문 2,000자, 이미지/GIF 합계 4개, 정적 이미지 10MB·GIF 20MB·첨부 전체 40MB, 대표 링크 1개(Q9 후속)를 클라이언트·서버에서 같은 기준으로 검사한다. 기술 기준으로 MB는 1,000,000바이트이며 실제 업로드 파일 크기로 검증한다. 제목·버전명의 저장 한도는 일반 안전성 검증으로 정하되 버전 형식·숫자 순서·유일성은 강제하지 않는다.
- `published_at`은 최초 공개 시각이며 `updated_at`과 분리한다. 삭제/숨김은 공개 읽기에서 반드시 제외한다.
- 소유자·작성자·권한은 클라이언트 입력으로 덮어쓸 수 없다. 사용자 삭제·탈퇴는 즉시 공개 종료하고 30일 뒤 원문·파일을 정리한다(Q13). `deleted_at`과 `purge_after`를 기록하고 운영자 숨김과 구분한다.

### 핵심 엔터티

| 엔터티 | 주요 필드 | 제약·관계 |
|---|---|---|
| `profiles` | `id uuid`, `handle text`, `display_name text`, `bio text?`, `avatar_asset_id uuid?`, `website_url text?`, `team_label text?`, `status text` | `id`는 인증 사용자와 1:1. 정규화 핸들 unique. 팀 표시는 권한이 아니며 운영자 역할은 사용자 편집 필드와 분리(Q18) [확정, 사용자 2026-09-26] |
| `roles` [제안] | `profile_id uuid`, `role text` | 사용자 본인 계정에 명시적으로 부여한 운영자 역할만 허용(Q18) [확정, 사용자 2026-09-26]. 서버 전용 부여·회수 경로, 일반 프로필 편집으로 변경 불가 |
| `profile_locations` | `profile_id uuid`, `visibility text`, `region_code text?`, `region_label text?`, `region_center_lat numeric?`, `region_center_lng numeric?` | `visibility=private/region`, 기본 private. 지역 대표 좌표만 저장. 정확 주소·개인 좌표 필드 없음(Q11) |
| `projects` | `id uuid`, `owner_id uuid`, `name text`, `summary text`, `category text?`, `stage text`, `website_url text?`, `github_url text?`, `cover_asset_id uuid?`, `last_activity_at timestamptz?`, `status text`, `created_at`, `updated_at` | 소유자 FK. 생성 시 분류 생략은 null(미분류), 단계 기본값은 개발 중 제안. 공개 URL은 안정적인 ID 경로로 이름 변경에 영향받지 않음 |
| `project_technologies` | `project_id uuid`, `technology_key text`, `label text` | `(project_id, technology_key)` unique. 초기에는 정규화된 태그로 충분 |
| `project_screenshots` | `project_id uuid`, `asset_id uuid`, `position int` | 프로젝트 내 순서 unique, 파일 소유권 검증 |
| `posts` | `id uuid`, `project_id uuid`, `author_id uuid`, `kind text`, `body text`, `status text`, `published_at`, `updated_at`, `version int` | `project_id NOT NULL`. `kind = standard/release`(Q10). 일반 글은 본문·미디어·대표 링크 중 하나 이상(Q9), Release는 추가 필수값 검사 |
| `post_media` | `post_id uuid`, `asset_id uuid`, `position int`, `alt_text text?` | 첨부 순서, 자산의 소유/연결 검증 |
| `link_previews` | `id uuid`, `post_id uuid`, `original_url text`, `canonical_url text`, `provider text`, `title text?`, `description text?`, `thumbnail_url text?`, `duration_seconds int?`, `status text`, `fetched_at` | `provider = youtube/github/web`. `post_id` unique: 대표 카드 하나(Q9). 본문의 다른 URL은 일반 링크. 미리보기 실패에도 원본 URL 보존 |
| `releases` | `post_id uuid`, `version_label text`, `title text`, `release_url text?` | `posts`와 1:1, 연결 post의 `kind=release` 검증. `version_label`은 자유 텍스트·수정 가능·unique/형식 제약 없음(Q10 자유 원칙) |
| `media_assets` | `id uuid`, `uploader_id uuid`, `object_key text`, `mime text`, `byte_size bigint`, `width int`, `height int`, `status text` | 검증 완료 자산만 공개 게시에 연결. 사용자 제공 경로를 신뢰하지 않음 |
| `likes` | `user_id uuid`, `post_id uuid`, `created_at` | 복합 PK, 중복 반응 금지 |
| `bookmarks` | `user_id uuid`, `post_id uuid`, `created_at` | 복합 PK, 본인만 조회 |
| `project_follows` | `user_id uuid`, `project_id uuid`, `created_at` | 복합 PK. 프로젝트 팔로우 확정(Q3), 개발자 팔로우 관계는 MVP에 없음 |
| `events` [제안] | `id uuid`, `event_name text`, `occurred_at timestamptz`, `actor_user_id uuid?`, `anonymous_session_key text?`, `project_id uuid`, `post_id uuid?`, `is_demo boolean`, `is_operator boolean`, `dedupe_key text` | 추가 의존성 없는 최소 행동 기록안. 서버만 기록·제한된 운영 집계만 조회, `dedupe_key` unique. 이벤트 5개·주체·제외 기준은 §8. 보존·접근은 Q20 확정 [확정, 사용자 2026-09-26]: 30일 후 삭제/익명화(Q13 상수 재사용 [확정 원칙 / 기본값은 제안, 구현 시 변경 가능] [기본값 제안]), 비회원 세션의 가입 계정/다른 기기 연결 금지, 집계는 운영자 역할만. 도구는 구현 시 선택 |

**본인 통계 읽기(D7·Q19) [확정, 사용자 2026-09-26]:** 본인 게시물의 `likes`·`bookmarks` 수와 본인 프로젝트의 게시물 반응 합계·`project_follows` 수를 프로젝트 관리·게시물 상세 본인 보기·프로필 본인 보기에 제공한다. [제안] 서버가 프로젝트 소유를 검사한 읽기 모델로 개수만 반환하며 저장한 사람의 신원·타인의 저장 목록은 공개하지 않는다. 이는 FR-007의 소셜 집계이고 운영자 전용 `events` 분석 접근과 별개다. 개인 응답은 공유 캐시에 두지 않고 공개 기본 카드의 숫자 숨김(Q3)을 유지한다.

`last_activity_at`은 마지막 공개 게시물의 `published_at`에서 계산한 읽기용 값이다. 삭제/숨김 시 다음 유효 게시물로 재계산한다. 프로젝트의 현재 버전은 최신 유효 Release에서 파생하며 수동 버전 필드를 따로 두어 충돌시키지 않는 안을 제안한다.

프로젝트 삭제는 공개 상태를 먼저 닫고 게시물·검색·미디어 접근 정책을 연동한다. 결제·운영 기록을 `CASCADE`로 지우지 않는다. Q2에 따라 `owner_id` 한 계정만 일반 편집·게시 권한을 갖는다. 멤버 초대·공동 편집·소유권 이전은 MVP에 없으며, `owner_id`는 편집 API로 변경할 수 없다. 운영자의 제재 권한은 별도다.

### 공식 콘텐츠·운영

| 엔터티 | 주요 필드 | 제약·관계 |
|---|---|---|
| `content_sources` | `id`, `name`, `endpoint_url`, `site_url`, `adapter`, `topic_scope`, `enabled`, `etag?`, `last_modified?`, `last_checked_at?`, `last_success_at?`, `last_error_code?` | 운영자 허용 RSS/Atom·공식 API만 하루 1회 수집(Q8). 초기 허용 목록은 GeekNews·Show HN·itch.io devlogs·Ars Technica(Q15) [확정, 사용자 2026-09-26]. Ars Technica는 업계 뉴스 전용. 이용 범위 확인·실행 시각은 구현 준비 |
| `source_items` | `id`, `source_id`, `external_id?`, `canonical_url`, `original_url?`, `discussion_url?`, `author_name?`, `title`, `source_published_at?`, `fetched_at`, `excerpt`, `content_hash`, `topic`, `status`, `skip_reason?` | 소스 ID/GUID와 정규 URL·내용 해시로 중복 식별. 포럼 토론 링크와 원문 링크를 구분. 원문 보존 범위는 소스 활성화 전에 결정 |
| `generation_runs` | `id`, `source_item_id?`, `input_ref`, `input_hash`, `prompt_version`, `provider`, `model`, `status`, `usage?`, `estimated_cost?`, `output_card_id?`, `last_error_code?` | 동일 입력 재생성 추적. 비밀키 제외, JSON·출처·내용 검증 |
| `official_cards` | `id`, `type`, `topic?`, `title`, `summary`, `slides jsonb`, `source_item_id?`, `source_name?`, `source_url?`, `source_date?`, `project_id?`, `status`, `scheduled_at?`, `published_at?`, `approved_by?`, `approved_at?`, `content_version` | 일반 사용자 게시물과 별도. 추천 카드는 공개 프로젝트 참조, 외부 소식은 출처 소재와 연결 |
| `content_jobs` | `id`, `job_type`, `dedupe_key`, `status`, `input_ref`, `output_ref?`, `attempts`, `next_attempt_at?`, `last_error_code?`, `quota_date date` [제안] | `collect/generate/publish`별 dedupe key unique. 실패한 단계만 재시도하며 KST 원래 집계 날짜를 유지(Q23) [확정, 사용자 2026-09-26] |
| `demo_markers` 또는 엔터티의 `is_demo` | `profile/project`의 데모 여부 | 구현 시 한 방식 선택. API·UI·집계에서 같은 출처 표시 유지 |
| `reports` | `id`, `reporter_id`, `target_type`, `target_id`, `reason`, `details?`, `status`, `created_at` | 접근 제한, 중복/빈도 제어. 상태는 검토 정책 확정 후 |
| `moderation_actions` | `id`, `actor_id`, `target_type`, `target_id`, `action`, `reason`, `created_at` | 승인·게시·숨김·복원·취소 기록(Q18), 최소 조치 종류·사유·시각·조치자·대상 ID(Q24) [확정, 사용자 2026-09-26]. 일반 회원 변경 불가 |

공식 카드 예시(JSON은 **합성 예시**, 서비스 데이터가 아님):

```json
{
  "type": "build_prompt",
  "title": "이번 주 바뀐 화면을 보여 주세요",
  "summary": "바꾸기 전과 후를 짧게 소개해 보세요.",
  "slides": [
    { "type": "cover", "title": "무엇이 바뀌었나요?" },
    { "type": "bullet", "items": ["바뀐 화면", "바꾼 이유"] }
  ],
  "source": null
}
```

사이트에서는 검증된 JSON을 React 컴포넌트로 표시한다. 이미지 렌더링·SNS 공유는 별도 기능이다. 외부 RSS·AI 생성은 Q5에서, 일일 생성/게시 한도는 Q8에서 확정했다. 초기 허용 출처는 Q15로 확정했다 [확정, 사용자 2026-09-26]. 슬라이드 수는 구현 설계이며 모델·비용 상한은 미정이다. JSON에 임의 HTML/스크립트를 허용하지 않는다. 소식 카드는 `topic=indie/industry`와 원문/포럼 링크를 보존하며, 이를 일반 사용자 게시물·프로필·등록 프로젝트로 변환하지 않는다.

### 주문·결제·노출

| 엔터티 | 주요 필드 | 제약·관계 |
|---|---|---|
| `promotion_products` | `id`, `name`, `price_krw int`, `duration`, `placement`, `policy_version`, `enabled` | Featured 테스트 1,000원·7일(Q12). 실판매 상품과 분리하며 운영 키로 승인하지 않음 |
| `orders` | `id`, `buyer_id`, `project_id`, `product_id`, `product_snapshot jsonb`, `amount_krw int`, `environment text`, `status`, `client_request_id`, `created_at` | 현재 `environment=test`. 서버가 금액 계산. `(buyer_id, client_request_id)` unique. 정책 스냅샷 보존 |
| `payments` | `id`, `order_id`, `provider_payment_key`, `status`, `confirmed_at?`, `canceled_at?` | order당 결제 완료 한 건. 제공자 식별자 unique, 접근 제한 |
| `payment_operations` | `id`, `payment_id?`, `order_id`, `kind`, `idempotency_key`, `request_hash`, `status`, `provider_result?`, `updated_at` | 승인·취소 의도와 재시도 추적. 같은 key에 다른 요청은 거부 |
| `promotions` | `id`, `order_id`, `project_id`, `status`, `starts_at?`, `ends_at?`, `placement` | order당 하나, 결제 확인 뒤 pending. 사용자 시작 시 starts_at, 이후 7일을 ends_at으로 저장. 공개 프로젝트·정상 결제만 활성화. 같은 프로젝트의 활성/시작 대기 주문 추가 구매 금지(Q16) [확정, 사용자 2026-09-26] |
| `provider_events` | `id`, `provider_event_key`, `received_at`, `processed_at?`, `status` | 외부 사건 중복/역순 수신 추적. 민감 원문은 최소 보존 |

**Featured 운영(D4·Q16) [확정, 사용자 2026-09-26]:** 광고 슬롯 1개·활성 노출끼리 균등 순환을 적용한다 [확정 원칙 / 기본값은 제안, 구현 시 변경 가능] [기본값 제안]. 같은 프로젝트에 활성 또는 시작 대기 주문이 있으면 추가 구매를 차단한다. [제안] `promotions`의 `pending/active`에 프로젝트별 유일성 제약을 두고 주문 생성·결제 확인에서 프로젝트 잠금과 상태 재검사로 경합을 막는다. 결제 후 30일 안에 시작하지 않은 주문은 운영자 전액 취소 대상이며 Q13의 30일 상수를 재사용한다 [확정 원칙 / 기본값은 제안, 구현 시 변경 가능] [기본값 제안]. 결제 확인 시각으로 기한을 계산하고 운영자 취소·감사·대사 경로를 사용하며 자동 시작하지 않는다. Q12의 테스트 금액·7일 기간·수동 시작·취소 경계는 유지한다.

상태 분리안:

```text
주문: created → confirming → paid
                   ├─ failed
                   └─ reconciliation_required → paid 또는 failed

결제: confirmed → cancel_pending → canceled
                         ├─ confirmed (취소 실패가 확정된 경우)
                         └─ reconciliation_required (결과 불명)

노출: pending → active (사용자 시작) → completed (7일 경과)
           └─ canceled
       active → suspended (대상 숨김·제공 장애 등 운영 확인)
       active/suspended/completed → canceled (운영자 예외 취소 확정)
```

취소 중에는 노출 시작을 막는다. 활성화와 취소의 경합은 동일 주문/노출의 조건부 갱신 또는 잠금으로 하나만 선점하게 한다. 외부 결제 API를 기다리는 동안 긴 DB 트랜잭션을 유지하지 않고 작업 의도를 먼저 기록한다. 결제 완료 후 DB 갱신 실패는 제공자 조회·대사로 복구하며 새 결제를 요청하지 않는다.

Q12의 사용자 전액 취소는 `pending`에서만 허용한다. 시작 뒤 미제공·서비스 오류의 운영자 전액 취소는 역할·사유·감사 기록을 검증하고 노출을 중지한다. 7일은 시작 시각부터의 기간으로 계산하고 만료 판정은 조회 시에도 적용한다. 스케줄러 지연 때문에 만료된 광고가 계속 노출되어서는 안 된다.

운영자 취소 요청 시 활성 노출은 `suspended`로 전환하고 결제 작업은 `cancel_pending`으로 추적한다. 성공 확인 후 결제·노출 모두 `canceled`로 확정하고 진행 거래에서 제외한다. 결과 불명은 대사 대상으로 유지하며 다시 노출하지 않는다. 취소 실패가 확정되면 결제는 `confirmed`, 노출은 운영 확인 상태를 유지한다. 정상 제공이 가능하다고 운영자가 판단한 경우에만 기존 종료 시각 내 재개할 수 있으며 기간을 자동 연장하지 않는다. 이미 `completed`인 노출의 사후 오류 취소도 기록을 보존한 채 `canceled`로 변경한다.

### 필수 제약·조회 인덱스

- FK와 CHECK로 게시물의 필수 프로젝트, 금액·시간 범위, 승인된 카드의 공개 조건을 검사한다.
- 공개 게시물 `(published_at desc, id desc)`, 프로젝트별 `(project_id, published_at desc, id desc)`와 소유자 프로젝트 조회를 우선 인덱싱한다.
- 소셜 복합 PK, 주문 요청 키, 제공자 결제 키, 콘텐츠 작업 중복 키에 unique 제약을 둔다.
- 결제 취소·노출 활성화·게시물 생성은 동시성·중복 요청 테스트를 만든다. 검색 전용 엔진은 실제 데이터로 필요성을 확인한 뒤 도입한다.

## 5. API 계약안

아래는 앱 서버의 계약이다. 외부 제공자의 API 경로와 혼동하지 않는다. 모든 변경은 검증된 사용자·요청 origin·대상 권한을 확인한다. URL query나 body의 `userId`를 신원으로 사용하지 않는다.

| ID | 메서드·경로 | 입력 → 결과 / 핵심 조건 |
|---|---|---|
| API-001 | `GET /api/feed` | `scope, cursor?` → `{items,nextCursor}`. 개인 scope는 로그인 필요 |
| API-002 | `GET /api/projects` | `q?, category?, technology?, cursor?` → 프로젝트 목록 |
| API-003 | `POST /api/projects` | 이름·소개·기술, 선택 `category` → `201 {project}`. 소유자는 서버가 설정, 분류 생략 시 미분류 |
| API-004 | `GET/PATCH/DELETE /api/projects/:id` | 공개 상세 / 소유자의 내용 변경·공개 종료. 소유권 이전 불가, 활성 거래면 충돌 응답 |
| API-005 | `POST /api/posts` | `projectId, body, assetIds, primaryUrl?, clientRequestId` → `201 {post}`. 본문·첨부·대표 링크 중 하나 이상, 중복 키 재요청은 기존 결과 |
| API-006 | `GET/PATCH/DELETE /api/posts/:id` | 공개 조회 / 권한자 변경·삭제. 수정 요청에 `version`으로 충돌 검사 |
| API-007 | `POST /api/projects/:id/releases` | `versionLabel,title,body,assetIds,releaseUrl?,clientRequestId` → post+release 원자적 생성. `releaseUrl`은 검증 후 `releases.release_url`에 저장 |
| API-008 | `POST /api/media/uploads` | 파일 메타·업로드 목적 → 제한된 업로드 정보. 완료 검증 후 asset 사용 가능 |
| API-009 | `POST /api/link-previews` | `url` → `{status,preview?}`. 속도 제한·SSRF 방어 |
| API-010 | `PUT/DELETE /api/posts/:id/like` | body 없음 → `{liked}`. toggle 대신 목표 상태 지정 |
| API-011 | `PUT/DELETE /api/posts/:id/bookmark` | body 없음 → `{saved}`. 저장 목록은 `GET /api/bookmarks` |
| API-012 | `PUT/DELETE /api/projects/:id/follow` | body 없음 → `{following}`. 프로젝트 팔로우 확정(Q3) |
| API-013 | `PATCH /api/me/profile`, `PUT/DELETE /api/me/location` | 공개 프로필/위치 입력 → 본인 결과. 공개 projection과 구분 |
| API-014 | `POST /api/orders` | `projectId,productId,clientRequestId` → 서버 확정 금액·주문 ID. 같은 프로젝트 활성/시작 대기 주문이 있으면 추가 구매 거부(Q16) |
| API-015 | `POST /api/payments/confirm` | `orderId,paymentKey,amount` → 완료/확인 중. 저장된 금액과 대조 |
| API-016 | `POST /api/orders/:id/cancel` | `reason,clientRequestId` → 취소/확인 중. 구매자·취소 조건 재검증 |
| API-017 | `GET /api/me/orders`, `GET /api/me/orders/:id` | 본인 주문·결제·노출 상태. 제공자 비밀 응답은 제외 |
| API-018 | `POST /api/webhooks/payments` | 제공자 사건 → 수신 결과. 제공자 검증·조회로 신뢰 확인 후 상태 반영 |
| API-019 | `POST /api/admin/content`, `PATCH /api/admin/content/:id` | 권한자 초안 생성·편집. 승인/예약/게시 작업은 상태별 명령으로 분리 |
| API-020 | `POST /api/internal/content-jobs/run` | 서버 작업 인증 → 실행 결과. 중복 실행에 안전해야 함 |
| API-021 | `POST /api/reports`, `POST /api/admin/moderation` | 신고 제출 / 운영자 조치. 서로 다른 권한 검사 |
| API-022 | `GET/POST /api/admin/content-sources`, `PATCH /api/admin/content-sources/:id` | 허용 소스 조회·등록·사용 중지. URL 조회에 네트워크 안전성 검사 |
| API-023 | `GET /api/admin/source-items`, `POST /api/admin/source-items/:id/generate` | 수집 소재·제외 사유 조회 / AI 초안 작업 → `202 {jobId}`. 한도·중복 확인 |
| API-024 | `GET /api/admin/content-jobs/:id`, `POST /api/admin/content-jobs/:id/retry` | 단계·결과·사용량 조회 / 재시도. 재승인·자동 공개를 암묵적으로 수행하지 않음 |
| API-025 | `POST /api/promotions/:id/start` | 본인 주문·공개 프로젝트·결제 완료·pending·취소 진행 없음 검증 → 시작/종료 시각. 반복 시작은 기간을 늘리지 않음 |
| API-026 | `POST /api/admin/orders/:id/cancel` | 운영자·미제공/서비스 오류 또는 결제 후 30일 미시작(Q16 기본값) 사유 확인 → 전액 취소 요청·노출 중지·감사 기록. 중복 요청 안전 |
| API-027 | `DELETE /api/me` | 재인증·진행 결제/노출 정리 검증 → 계정 공개 종료·세션 차단·30일 정리 예약. 미확정 거래는 `409`와 내역 경로 반환 |

새 계정 생성·OAuth callback은 제공자의 SSR 통합 규약을 따르며 비밀번호 API를 추가하지 않는다(Q1). 댓글·별도 알림함 API는 MVP에서 제외한다(Q3). 계정 종료는 재인증·진행 거래 정리 후 공개 종료와 세션 차단, 30일 뒤 삭제 작업을 수행하는 계약으로 설계한다(Q13).

### 삭제·정리 작업 계약

최소 감사 항목은 조치 종류·사유·시각·조치자·대상 ID이며 승인·게시·숨김·복원·취소에 적용한다. 설정 화면의 이메일 문의 링크를 이의 제기 경로로 사용하며 주소는 더미 `contact@buildlog.example`로 진행하고 출시 전 실주소로 교체한다(사용자 2026-09-27). [확정, 사용자 2026-09-26] (D6·D11·Q18/Q24)

사용자 삭제가 승인되는 시점에 `deleted_at`과 30일 뒤의 `purge_after`를 기록한다. 프로젝트·계정의 공개 종료는 하위 게시물·Release·미디어·검색·공유 읽기에도 전파한다. 기존 토큰만으로 계속 접근하지 못하도록 계정 상태를 DB 권한과 서버에서 검사한다. 운영자 숨김에는 사용자 삭제의 정리 기한을 자동 적용하지 않는다.

서버 정리 작업은 만료된 항목을 일정 수씩 선점해 파일·파생 미리보기·본문·개인정보를 정리한다. 파일 삭제 실패를 완료로 표시하지 않고 단계별로 재시도한다. 최소 감사·거래 기록은 원문과 분리하고 계정 참조를 익명화할 수 있도록 설계한다. 백업 복구 때도 삭제 완료 목록을 재적용해 콘텐츠를 다시 공개하지 않는다. 백업·운영 기록의 실제 보존 범위는 해당 서비스 설정을 확인하고 삭제·운영 기능을 구현할 때 기록한다.

공통 오류 예시:

```json
{
  "error": {
    "code": "PROJECT_NOT_WRITABLE",
    "message": "이 프로젝트에 게시할 수 없습니다.",
    "fieldErrors": {},
    "requestId": "request-example"
  }
}
```

| HTTP | 의미 |
|---|---|
| 400 | 잘못된 입력·지원하지 않는 파일/URL |
| 401 | 인증 필요·검증 불가 세션 |
| 403 | 허용하지 않은 작업. 비공개 대상의 존재를 숨길 때는 404 |
| 404 | 없거나 공개할 수 없는 대상 |
| 409 | 수정 충돌·이미 진행 중인 거래·취소 불가 상태·멱등 키 불일치 |
| 429 | 게시·로그인·미리보기·신고 빈도 제한 |
| 502/503 | 외부 서비스/일시 장애. 결제 결과 불명은 별도 확인 중 계약 사용 |

결제 등 비동기 확인 중인 요청은 `202 {status:"reconciliation_required",orderId}` 형태로 처리한다. 클라이언트에는 결제 실패로 단정하지 않고 본인 내역 확인 경로를 준다.

## 6. 피드·캐시·동기화

**연속 카드 접기(D2·K-12·BR-017) [확정, 사용자 2026-09-26]:** 전체·팔로잉 자연 피드에서 같은 프로젝트 게시물이 연속 2건 이상이면 최신 1장에 “이 프로젝트의 이전 게시물 N개 펼치기”를 붙인다. 펼치면 원래 위치·최신순을 유지하고 접힌 게시물에 Release가 있으면 “Release 포함”을 표시한다. 프로젝트 타임라인의 전체 기록·Q4 정렬·`published_at`은 불변이며 공식 카드·광고는 접지 않는다. 한 페이지 응답 안에서만 접는 방식은 [확정 원칙 / 기본값은 제안, 구현 시 변경 가능] [기본값 제안]이다.

**피드 응답 설계 [제안]:** API-001의 연속 `user_post` 구간에서 같은 `project_id`를 묶고 대표 항목에 `group: { collapsed_count, collapsed_posts, contains_release }`를 붙인다. `collapsed_count`는 최신 1장을 제외한 N개이며 `collapsed_posts`는 해당 페이지에서 허용된 원래 항목을 최신순 그대로 보존한다. Q14 혼합 결과의 인접 항목만 묶어 공식 카드 경계를 넘지 않고, 혼합 비율과 `nextCursor`는 접기 전 원항목을 기준으로 계산한다. 펼치기는 그 위치에 원항목을 복원하며 서버의 삭제·숨김 검사는 그룹 내부에도 적용한다. 페이지 간 그룹 병합과 타임라인 그룹화는 하지 않는다.

- 피드 응답은 `user_post | official_card | promoted_project`의 구별된 타입으로 구성한다. 화면 타입과 게시물의 미디어 타입을 하나의 enum으로 섞지 않는다.
- 자연 피드는 `(published_at, id)` 커서와 조회 기준 시각으로 안정적으로 넘긴다. 메인은 사용자 글 5개당 공식 카드 1개(Q14)를 섞으며, 조회 세션에서 중복되지 않도록 커서에 혼합 위치를 반영한다. 사용자 글 부족 시 공식·데모로 보충하고 같은 카드를 복제하지 않는다. `scope=following`은 팔로우한 프로젝트 게시물만 반환한다. 광고는 별도 영역에서 Q12의 활성 노출 조건을 적용하며 자연 피드의 정렬을 바꾸지 않는다.
- 새 게시 트랜잭션에서 프로젝트 활동 시각을 갱신한다. 수정은 재노출하지 않고, 삭제/숨김은 활동 값과 읽기 결과를 함께 정리한다.
- 초기에는 공개 읽기도 최신 DB 결과를 우선해 정확성을 확인한다. 이후 캐시를 추가할 때 공개 내용만 캐시하고 사용자별 반응·저장·주문·관리자 화면은 공유하지 않는다.
- 공개 콘텐츠 변경 후 관련 피드/프로젝트/프로필/검색/메타데이터를 갱신한다. 캐시를 도입하면 각 경로의 무효화 계약을 추가한다.
- 공유 미리보기는 공개 상태를 확인한다. 숨긴 게시물의 제목·이미지가 오래 남는 문제는 외부 공유 서비스의 캐시와 자체 캐시를 구분해 운영 제한으로 기록한다.

## 7. 외부 연동과 장애 경계

### 파일 업로드

제안 순서: 인증·소유 프로젝트 확인 → 업로드 허용 정보 발급 → 비공개 임시 저장 → 서버의 실제 파일 검증 → 게시물에 연결 → 읽기 권한에 따라 제공. 중단된 파일은 참조 여부를 확인한 후 정리한다. Q13의 공개 종료 계약에 맞춰 미디어 읽기도 현재 공개 상태를 검사하는 서버 경로를 기본안으로 둔다. 비공개 Storage 원본의 공개 URL·권한 검사 없는 장기 서명 URL을 브라우저에 노출하지 않고, 이미지 최적화/CDN 캐시도 이를 우회하지 않도록 한다. 이미 사용자가 내려받은 사본이나 외부 공유 서비스의 캐시는 서버의 삭제로 회수할 수 없으므로 자체 제공 종료와 구분한다.

### YouTube·GitHub·일반 URL

- YouTube/Shorts는 허용한 호스트·영상 ID를 추출해 고정된 임베드 경로를 만든다. 사용자가 넣은 iframe HTML을 렌더하지 않는다. 메타데이터/길이의 제공 경로와 API 키·쿼터는 구현 시 확인한다.
- GitHub는 공개 저장소 메타데이터 후보이며 토큰 없이 가능한 범위·요청 제한을 확인한다. 별·언어 등의 값이 없으면 생략한다.
- 일반 OG 수집은 서버에서 시간·응답 크기·리다이렉트 수를 제한한다. loopback/private/link-local·클라우드 메타데이터 주소·인증정보 포함 URL·비 HTTP(S)를 차단한다. DNS 해석과 각 리다이렉트에서 재검사하고 요청자의 쿠키나 인증 헤더를 전달하지 않는다.
- 안전한 메타데이터만 저장한다. 외부 이미지도 추적·유해 주소·프록시 요청 위험을 검토한다. URL 확인 실패 시 원문 링크로 대체하며 재시도로 게시물을 복제하지 않는다.

### Toss Payments

서버 주문의 금액·구매자·프로젝트를 확인한 후 결제를 요청하고, 리다이렉트 결과는 서버 승인 검증의 입력으로만 쓴다. 취소 역시 서버에서 제공자 결과를 확인한다. [공식 결제 연동](https://docs.tosspayments.com/guides/v2/payment-widget/integration), [공식 API](https://docs.tosspayments.com/reference)

중복/역순 webhook, 제공자 처리 후 연결 단절, DB 장애에는 주문 기준 조회·대사를 수행한다. 제공자 멱등 헤더·서명/인증 방식은 실제 선택 API의 공식 계약으로 확인하고, 앱 자체의 작업 키·유일성 제약도 유지한다. 외부 요청 실패를 곧바로 미결제로 해석하지 않는다.

### 지도

Kakao Maps는 Client Component에서 필요한 화면에만 로드한다. Q11에 따라 선택된 시·군·구의 대표 좌표를 사용하며 상세 주소를 지오코딩해 개인 위치로 저장하지 않는다. 도메인·키·지역 데이터의 정확성을 검증하고 실패해도 공개 지역 텍스트와 프로젝트 흐름은 동작해야 한다. [공식 Web API 가이드](https://apis.map.kakao.com/web/guide/)

### 콘텐츠 작업

```text
인디 뉴스/포럼 + 주요 업계 뉴스의 허용 RSS·API
  → 주기적 수집 → 정규화·중복/품질 필터 → AI 한국어 초안
내부 프로젝트/운영자 소재 ────────────→ AI/템플릿 초안
                                             ↓
                      검수 대기 → 승인 → 예약 → 게시
                      ↑ 반려/수정      └ 실패 → 재시도
```

Q5 및 추가 요청에 따라 인디 뉴스·포럼 중심으로 수집하고 주요 업계 소식도 다룬다. 다음은 Q8의 운영 정책을 구현할 경계안이다.

1. **수집:** 운영자가 허용한 RSS/Atom·공식 API만 요청한다. 소스별 어댑터를 두고 ETag/Last-Modified가 제공되면 활용한다. 원문 날짜와 수집 날짜를 구분한다. 일반 미리보기의 SSRF·시간/크기 제한을 적용하고 XML 외부 엔터티·외부 파일 참조를 금지한다.
2. **정규화·중복:** 출처 ID·GUID·정규 URL·내용 해시를 보존한다. 같은 소재 재수집으로 새 카드를 자동 생성하지 않는다. 포럼의 외부 기사 URL과 토론 URL을 분리하고, 같은 사건의 다른 출처는 묶어 검수한다. 내용 변경은 재검수 후보로 남긴다.
3. **AI 생성:** GPT 계열 사용 예정(Q7)이며 구체 모델·연결 방식은 구현 전 선택한다. 허용된 발췌·출처·날짜로 구조화된 한국어 요약·소개를 생성한다. 제목·링크만 있는 항목은 본문을 읽은 것처럼 요약하지 않고 링크 소개로 표시하거나 보류한다. 원문 속 지시문은 자료로만 취급하며 도구 실행·설정 변경·자동 게시 명령으로 따르지 않는다. 비공개 사용자 정보·비밀키를 입력에 넣지 않는다. 개인 의견·프로젝트 소개와 검증된 보도 내용을 구분한다.
4. **결과 검사:** JSON 구조·슬라이드 수·출처 URL·날짜·근거 없는 수치를 검사한다. 출처 URL은 모델이 새로 발명하거나 바꾸지 못한다. 근거 부족·상충 정보는 보류한다. 원문 전문·댓글 모음 재게시를 기본 결과로 생성하지 않는다.
5. **한도·실패:** AI 초안 하루 최대 5개·공식 카드 게시 하루 최대 2개(Q8)를 DB에서 검사·예약해 동시 실행도 한도를 넘지 않게 한다. 생성 전에 비용 여유도 확인하고 완료 후 실제 사용량으로 정산한다. 실패 재시도도 비용 검사에서 빠지지 않으며 무한 재시도를 하지 않는다. 월 비용 상한은 미정이다. KST 00:00 기준 일일 집계와 예약·게시 KST 표시, 지연·재시도의 원래 날짜 집계·중복 발행 금지를 적용한다 [확정, 사용자 2026-09-26] (Q23). [제안] 최초 작업의 `quota_date`와 중복 키를 재시도에서도 유지한다.
6. **검수·공개:** 관리자 승인 후 게시한다(Q8). 승인한 원고 버전만 예약하고, 승인 뒤 수정하면 재검수하며 게시 직전에 대상 프로젝트·출처·원고·예약 상태를 확인한다. 하루 1회 수집과 발행은 별도 작업이고, 수동 실행도 게시 상한을 지켜야 한다.

각 단계의 claim·결과·중복 키로 겹친 스케줄을 처리한다. 수집·AI·게시 실패 중 필요한 단계만 재시도한다. AI 장애 시 직접 작성은 가능하지만 수동 경로가 RSS/AI 연동 검증을 대체하지 않는다. 스케줄러·모델·실행 시각·AI 예산은 구현 전에 정하며 무제한 호출이나 무료 실행을 전제하지 않는다. 구체 모델·비용 상한이 미설정이면 유료 생성은 실행하지 않고 관리자에게 설정 필요 상태를 표시한다.

### 실제 수집 경로를 확인한 소스 후보

2026-09-17의 읽기 전용 병렬 조사에서 아래 공식 안내·연결과 HTTP `200` XML/JSON 응답을 확인했다. **당시 기술적 수집 가능성의 확인이며 재게시 이용 범위·빌드로그 수집기 구현 완료를 뜻하지 않는다.** 당시 수집 경로 관찰과 별도로 초기 허용 목록은 2026-09-26 Q15에서 이 4개로 확정했다 [확정, 사용자 2026-09-26]. Ars Technica는 업계 뉴스 용도로만 사용하며 적합 소재가 부족한 날은 발행하지 않아도 된다(Q8은 상한). 주간 다이제스트 채택은 7일 관찰 후 결정한다. [미정 유지]

| 소스 / 소재 | 공식 근거와 경로 | 어댑터·입력 범위·주의점 |
|---|---|---|
| GeekNews — 한국어 개발/기술 뉴스, Ask·Show | [공식 피드 안내](https://news.hada.io/blog/geeknews_feed), [피드](https://news.hada.io/rss/news) | 실제 형식은 Atom. 제목·게시/수정일·ID·토픽 링크·작성자·짧은 HTML 발췌. 인디 관련 주제만 선별하며 댓글 본문은 별도 수집하지 않음 |
| Show HN — 앱·웹·개발자 도구 등 제작자 소개 | [공식 API](https://github.com/HackerNews/API), [Show 목록](https://hacker-news.firebaseio.com/v0/showstories.json) | JSON ID 목록 후 item 조회. 제목·생성시각·작성자·원문 URL·선택적 본문. 댓글은 별도 item이므로 기본 수집에서 제외. 삭제/비활성 항목 제외 |
| itch.io devlogs — 인디 게임·제작 도구 | [공식 개발로그](https://itch.io/devlogs), [RSS](https://itch.io/devlogs.xml) | RSS 2.0. 제목·발행일·GUID·프로젝트 글 링크·분류·HTML 발췌. 게임 쪽 보완 소스이며 앱·웹을 대체하지 않음 |
| Ars Technica — 주요 업계/기술 소식 | [공식 RSS 안내](https://arstechnica.com/rss-feeds/), [기사 RSS](https://feeds.arstechnica.com/arstechnica/index) | RSS 2.0. 제목·발행일·기사 URL·작성자·분류·발췌. 인디/개발과 무관한 기사는 제외. 댓글 URL/개수는 댓글 본문이 아님 |

각 소스의 전체 글을 무제한 가져오지 않는다. 피드/API가 제공한 범위를 우선 사용하고 필요 이상의 본문·댓글·프로필을 모으지 않는다. 요청 제한·캐시/조건부 조회·이용 조건은 실제 활성화 전에 다시 확인한다. 하나의 기사와 그 기사를 소개한 포럼 토픽은 원문 URL을 기준으로 연결하고 중복 카드 후보를 검수한다.

## 8. 오류·관측·운영

- 요청 ID로 서버 오류·콘텐츠 작업·주문 처리 단계를 연결한다. 토큰·비밀키·정확한 비공개 주소·결제 개인정보는 로그에 남기지 않는다.
- 관측 항목: 게시 실패, 업로드 실패, 미리보기 실패율, 콘텐츠 작업 실패, 결제 확인 지연/불일치, 공개 페이지 오류. 임계 수치는 초기 측정 후 정한다.
- 관리자 화면은 원문 예외 대신 조치 가능한 실패 단계·재시도 가능 여부를 제공한다. 장애 알림 채널은 운영 방식 결정 후 연결한다.
- 장애 시 우선순위: 사용자 데이터 노출 차단 → 중복 결제/취소 방지 → 게시 보존 → 읽기 회복 → 미리보기/추천 복구.

### 행동 이벤트

프로젝트 생성·게시·프로젝트 페이지 열람·공유 클릭·프로젝트 팔로우를 최소 행동 이벤트로 기록한다(K-2). 기록 도구는 **Supabase PostgreSQL의 자체 `events` 테이블**로 확정했다 [확정, 사용자 2026-09-27; 근거: [docs/research/event-tool-check.md](research/event-tool-check.md)]. 기존 DB에서 수집 열·비회원 분리·정리·권한을 직접 통제하며 아래 구체화 3항목도 PRD 권고안 A4로 채택했다. 이벤트 5개 기록·데모/운영자 제외는 KR5의 1차 완료 기준이고, 표의 기록 시점·중복 처리 세부는 구현 설계다. 도구·구성 확정을 Q20 준수나 실제 이벤트 기록 완료로 판정하지 않는다. 테이블·집계 결과를 공개 API나 일반 회원에게 직접 노출하지 않으며, 작성자 본인 통계는 FR-007·Q19로 확정된 별도 소셜 집계이며 이 분석 테이블 접근을 허용하지 않는다 [확정, 사용자 2026-09-26].

| 이벤트 | 기록 시점 [제안] | 기록 주체·중복 처리 [제안] |
|---|---|---|
| `project_created` | 프로젝트 생성이 성공적으로 저장될 때 | 서버가 인증된 생성자·프로젝트 ID를 기록. 같은 생성 요청 재시도는 추가 기록하지 않음 |
| `post_published` | 게시물이 처음 공개될 때. Release도 같은 게시물 한 건으로 처리 | 서버가 작성자·프로젝트·게시물 ID를 기록. 편집·재시도·피드/프로젝트 타임라인 동시 반영으로 중복 기록하지 않음 |
| `project_viewed` | 공개 프로젝트 페이지가 실제로 표시된 뒤 열람 신호를 서버가 받아 공개 상태를 확인할 때 | 서버가 기록. 프리페치·알려진 자동 요청은 제외하고 같은 페이지 표시 신호의 재전송은 중복 제거. 서버 응답만으로 실제 열람을 단정하지 않음 |
| `share_clicked` | 공개 프로젝트·게시물의 URL 복사 또는 공유 버튼을 눌렀다는 신호를 서버가 받아 대상 공개 상태를 확인할 때 | 서버가 기록. 같은 클릭 신호의 재전송은 중복 제거. 복사 성공·외부 공유 완료를 뜻하지 않음 |
| `project_followed` | 프로젝트 팔로우 관계가 새로 저장될 때 | 서버가 인증된 사용자·프로젝트 ID를 기록. 이미 있는 관계에 대한 반복 요청·관계 해제는 기록하지 않음 |

- **저장 신뢰성 [제안]:** 생성·게시·프로젝트 팔로우는 도메인 변경과 이벤트를 같은 트랜잭션에서 저장한다. 열람·공유 신호는 이벤트 이름·대상·공개 상태·요청 출처를 검사하고 빈도를 제한한다. 기록 시각·회원 신원·제외 표시는 서버가 정하며 클라이언트 값을 그대로 신뢰하지 않는다. 이벤트 저장 실패는 관측하고, 열람·공유 자체를 막거나 누락을 정상 기록으로 간주하지 않는다.
- **데모·운영자 제외 [제안]:** 서버가 행동 주체와 대상 프로젝트의 데모 표시, 행동 주체와 프로젝트 소유자의 운영자 역할을 확인해 `is_demo`·`is_operator`를 기록한다. 둘 중 하나라도 참이면 실제 사용자 지표에서 제외하고 점검용으로 별도 집계한다. 공식 카드 게시를 `post_published`로 집계하지 않는다. 로그아웃한 운영자 점검은 서버가 식별한 점검 세션으로 제외하며, 식별하지 못한 비회원 활동이 섞일 수 있다는 한계를 기록한다.
- **정책 경계(D8·Q20) [확정, 사용자 2026-09-26]:** 행동 이벤트는 30일 후 삭제 또는 익명화하며 Q13의 30일 상수를 재사용한다 [확정 원칙 / 기본값은 제안, 구현 시 변경 가능] [기본값 제안]. 비회원 세션은 가입 계정·다른 기기에 연결하지 않는다. 행동 집계 접근은 운영자 역할만 허용한다. 삭제/익명화 후 개인 연결이 남지 않는지 검증하며 세션 키 저장·정리 실행 방식은 구현 설계다.
- **비회원 세션 [확정, 사용자 2026-09-27]:** `actor_user_id` 없이 서버가 발급한 무작위 세션 키만 사용한다. 같은 세션의 열람·공유만 연결하고 IP·기기 지문으로 사람을 추정하지 않는다. Q20에 따라 가입 후 계정이나 다른 기기에 연결하지 않으며, 키가 없는 요청은 연결 불가로 집계한다. 세션 수를 고유 사람 수로 해석하지 않는다. 세션 키 유효기간·저장 방식은 아래 확정 구성을 따르고 인증 전후 단절을 구현 검증한다.
- **개인정보 최소화 [제안]:** 이벤트 이름·시각·필요한 내부 ID·세션 키·제외 표시·중복 제거 키만 저장한다. 본문·이메일·인증 토큰·원시 IP·전체 referrer URL·자유 입력 속성은 저장하지 않는다. 회원 연결 키도 접근을 제한하고 탈퇴 시 제거·익명화하는 안을 둔다. 보존 기간·집계 접근 권한은 Q20 확정 정책을 따르며 아래 확정 정리 구성에서는 행 삭제를 사용한다. 30일 기본값 이후 개인 연결 가능한 이벤트가 남지 않게 검증한다.

**구현 구체화 3항목 [확정, 사용자 2026-09-27]:** 공식 기능의 확인 시각은 아래에 적었으며 실제 구성·통과 증거는 없다. 상세 SQL·실패 조건은 [도구 조사 §4](research/event-tool-check.md#4-제안-채택할-기록-계약과-구체화)를 따른다.

1. **비회원 세션 키 [확정, 사용자 2026-09-27]:** 서버가 `randomBytes(32)`로 만든 무작위 값과 발급 시각에 HMAC 서명을 붙인다. 자체 쿠키는 `HttpOnly; Secure; SameSite=Lax; Path=/`, `Domain` 생략, 발급 후 **30분 절대 만료**로 두고 자동 연장하지 않는다. DB의 `anonymous_session_key`에는 무작위 값의 SHA-256 해시만 저장하며 이 값도 보존 대상이다. 가입·로그인 시작과 인증 완료 때 쿠키를 지우고 회원 이벤트에는 `actor_user_id`만 기록한다. 두 식별 열 동시 저장·병합표·다른 기기 연결을 금지하고, 로그아웃은 새 키, 쿠키 차단은 연결 불가로 처리한다. IP·기기 특성을 키 생성에 쓰거나 `localStorage`·공유 URL·OAuth `state`로 키를 전달하지 않는다. 근거: [Node.js Crypto](https://nodejs.org/api/crypto.html), [Next.js 쿠키](https://nextjs.org/docs/app/api-reference/functions/cookies), 조사 확인 2026-09-27 00:26 KST.
2. **30일 정리 [확정, 사용자 2026-09-27]:** Supabase Cron(`pg_cron`) 작업 하나에서 매분 `occurred_at <= now() - interval '30 days'`인 `events` 행을 삭제한다. `cron.job_run_details`의 마지막 성공·실패와 30일 초과 잔존 행 수를 확인하고, 실패 시 같은 조건으로 재시도하며 복구 후 서비스 재개 전에 정리한다. 조회도 최근 30일 미만으로 제한하지만 조회 차단을 삭제로 세지 않는다. 정상 실행에도 다음 실행까지 약 1분과 실행 시간이 추가되므로 **30일 보존 경계·작업 지연/프로젝트 중지·백업 사본의 삭제는 미확인**이다. 더 일찍 정리하는 여유와 사본 처리까지 검증하기 전 Q20 충족으로 판정하거나 유예를 승인된 정책으로 해석하지 않는다. 근거: [Cron](https://supabase.com/docs/guides/cron), [삭제·실행 이력](https://supabase.com/docs/guides/cron/quickstart), [백업](https://supabase.com/docs/guides/platform/backups), 조사 확인 2026-09-27 00:23·00:26 KST.
3. **운영자 집계 화면 [확정, 사용자 2026-09-27]:** `operator_event_daily` SQL 뷰 하나와 `/admin/events` 페이지 하나를 둔다. 서버가 현재 운영자 역할을 확인한 뒤 고정 집계만 조회하고 원시 테이블·뷰의 일반 회원/비회원 권한은 차단한다. PostgreSQL 15 이상의 `security_invoker`와 RLS를 적용하고 서버 실행 역할의 최소 권한도 별도로 검증한다. 최근 7일/30일·프로젝트별·KST 일자별 이벤트 건수, `is_demo=false AND is_operator=false`인 실제 사용자 지표, 제외 건수·회원/비회원/연결 불가 건수와 정리 상태를 표시한다. 원시 회원 ID·세션 키는 화면에 보내지 않고 응답은 `private, no-store`로 둔다. 집계 별도 장기 저장은 하지 않으며 작성자 본인 통계(Q19)는 소셜 관계 집계로 분리한다. 근거: [RLS·뷰·서버 권한](https://supabase.com/docs/guides/database/postgres/row-level-security), 조사 확인 2026-09-27 00:26 KST.

- **측정 범위 [제안]:** 이 5개는 최소 기록이며 가입 전환·피드 체류·두 번째 페이지 이동·다음 게시물 열람·원문 클릭까지 측정하지 않는다. 해당 전략 지표의 추가 이벤트·속성·개인정보 범위는 별도 정의 전까지 [미정]으로 남긴다.

## 9. 검증 계약

| 계층 | 우선 검증 |
|---|---|
| 단위 | 내용 판별, 공개 상태, 취소 가능 조건, 시간 경계, 카드 입력 검증 |
| DB/통합 | 타인 쓰기 금지·비공개 데이터·FK/unique·Release 원자성·중복 게시·취소/활성화 경합 |
| 외부 계약 | 테스트 결제 승인/취소/조회, 지도 로드, 영상/링크 fallback, 파일 검증, 실제 RSS/API 수집·AI 원고 응답 |
| E2E | 가입 → 프로젝트 → 게시 → 피드/타임라인 → 반응/팔로우 → 공개 링크. [확정, 사용자 2026-09-27; KR3·1차 완료 조건] 자동 검사 3개: ① 피드 타입별 배지(공식/데모/광고) 존재 ② 기본 카드에 반응 숫자 없음 ③ `promoted_project`가 자연 피드 커서 결과에 없음 |
| 운영 | 수집/생성/예약 중복·단계별 재시도·AI 비용 제한·출처 위조/지시문 격리, 신고 숨김, 결제 대사, 삭제된 추천 대상, 30일 정리 경계·실패 재시도·미디어 직접 접근 차단 |

- **[확정, 사용자 2026-09-27; KR5] 이벤트 5개 검증은 1차 프로토타입 완료 조건이다.** 프로젝트 생성·게시·프로젝트 열람·공유 클릭·프로젝트 팔로우의 서버 기록·재시도 중복 제거·데모/운영자 제외·비회원 세션 처리·민감정보 미저장을 확인하고 증거를 남긴다. 5개 중 하나라도 기록 증거가 없으면 1차를 완료로 인정하지 않는다. 최소 팔로우 동작은 이 검증을 위해 1차에 포함하고 팔로잉 탭·다음 글 열람 확장은 2차에 둔다. 확정된 구성도 30일 경계·정리 실패/중지/백업 사본과 권한을 실제 검증하기 전에는 Q20 완전 준수로 판정하지 않는다.
- **[확정, 사용자 2026-09-27; KR3·K-13] 정직성 자동 검사 3개는 1차 프로토타입 완료 조건이다.** 공식 카드 내부 3종·데모 3개·5:1 혼합과 함께 ① 공식/데모/광고 배지 ② 기본 카드 반응 숫자 없음 ③ `promoted_project`의 자연 피드 커서 제외를 검사하고 통과 증거를 남긴다. 공식 카드는 `official_card`, 데모는 `is_demo`, 유료 노출은 `promoted_project`에 맞는 표시를 확인한다. 데모를 별도 피드 타입으로 추가하는 결정은 아니며 Q19 본인 화면 통계도 기본 카드 검사와 구분한다.

UI 상태·오류·접근성은 [UI/UX 기준](02_UI_UX.md), 실행 절차·완료 판정은 [개발 작업 흐름](04_DEVELOPMENT_WORKFLOW.md)을 따른다. 위 검증은 모두 계획이며 현재 통과 결과가 아니다.

## 10. 공식 자료와 확인 범위

확인일: 2026-09-17. 문서 열람만 했으며 실제 SDK·계정·키·웹훅·스토리지를 연결하지 않았다. 다음 구현 시 버전과 제공자 조건을 재확인한다.

| 자료 | 이번에 확인한 범위 |
|---|---|
| [Next.js Server/Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) | 서버 읽기와 브라우저 상호작용 경계 |
| [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs) | 쿠키·서버/브라우저 클라이언트·검증된 신원·공유 캐시 주의 |
| [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) | 노출 테이블의 행 수준 권한 설계 |
| [Supabase 변경 기록](https://supabase.com/changelog) | 신규 설계 참고. 기존 연동은 없어 마이그레이션 검증 대상 없음 |
| [Toss Payments 연동](https://docs.tosspayments.com/guides/v2/payment-widget/integration)·[API](https://docs.tosspayments.com/reference) | 주문 정보 보존·서버 승인·취소/조회 계약의 출발점 |
| [Kakao Maps 가이드](https://apis.map.kakao.com/web/guide/) | 웹 지도 로드와 앱/키 설정의 출발점 |
