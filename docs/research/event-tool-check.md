# 행동 기록 도구 선택 조사 — K-2

작성일: 2026-09-27 · 공식 자료 확인: 2026-09-27 00:23~00:33 KST · 상태: **조사 완료 / 도구 권고는 [제안] / 앱·DB·연동 미구현**

**[제안] Supabase PostgreSQL의 자체 `events` 테이블을 선택한다.** 이미 확정한 Next.js + Supabase + Vercel 안에서 서버 기록·수집 필드·비회원 연결·운영자 접근을 직접 통제할 수 있다. Vercel Web Analytics와 PostHog 무료 플랜은 30일 보존 조건에서 제외하고, Umami 자체 호스팅은 기본 세션 구분 방식과 정리 작업의 추가 구현 때문에 제외한다. 다만 자체 테이블도 정기 삭제의 실행 지연과 백업 사본까지 검증한 것은 아니므로 **Q20 준수 완료로 승인한 후보는 없다**. 아래 권고는 구현할 설계 후보 하나를 정한 것이며, 미확인 사항을 충족으로 바꾸지 않는다.

## 1. 판단 기준과 확인 범위

- 정책 정본: [PLAN-001 §9 Q20](../plans/PLAN-001-planning-review.md#9-3차-문답-q15q24-2026-09-26-확정), [기술 §8 행동 이벤트](../03_TECH_SPEC.md#행동-이벤트). 5개 이벤트의 서버 기록, 30일 후 삭제/익명화, 비회원 세션의 가입 계정·다른 기기 연결 금지, 운영자만 집계 조회, IP·기기 지문·전체 referrer 저장 금지를 비교 기준으로 삼았다. 숫자 기본값의 상태 표기는 정본을 유지하고, 이번 비교는 요청대로 **30일**을 적용한다.
- 선행 문서: `AGENTS.md`, `docs/agents/domain.md`, `CONTEXT.md`, `docs/README.md`, `docs/03_TECH_SPEC.md`, PLAN-001 §5·§9, `docs/strategy-red-team.md` K-2·K-10, [ADR-0002](../adr/0002-managed-platform.md)를 읽었다. 도구 선택과 외부 계정·인증의 실제 동작 확인은 별개다.
- 네 번째 후보는 **Umami 자체 호스팅**을 택했다. Umami Cloud와 Plausible은 이 비교의 후보에 섞지 않았다. 현재 Umami 공식 문서는 v3 기준이라고 안내한다. [공식 소개](https://docs.umami.is/) · 확인 2026-09-27 00:23 KST.
- “가능”은 공식 기능과 아래 제안으로 구현할 수 있다는 판단이며 실제 연결 성공을 뜻하지 않는다. “미확인”은 확인한 공식 문서에 충분한 근거가 없다는 뜻이다. 모든 가격은 USD이며 세금·환율·실제 사용량은 계산하지 않았다.
- 계정·프로젝트·키 생성, 외부 가입·결제, 배포를 하지 않았다. 공식 공개 자료만 읽었으며 원문 전문을 복사하지 않았다. `insane-search`는 PostHog 문서의 일반 웹 도구 형식 오류와 Umami의 본문 추출 문제 등에 사용했다. 수집 성공 표시만 믿지 않고 실제 본문·메타데이터에서 확인한 범위를 구분했다.

## 2. 같은 기준으로 비교 — 후보 4 × 기준 7

각 셀의 시각은 해당 근거를 확인한 KST 시각이다. 제품 기본 동작과 Q20에 맞추기 위해 필요한 변경을 함께 적었다.

| 기준 | ① Supabase 자체 `events` | ② Vercel Web Analytics + 커스텀 이벤트 | ③ PostHog Cloud 무료 플랜 | ④ Umami 자체 호스팅 |
|---|---|---|---|---|
| **(a) 서버에서 기록** | **가능.** 기존 서버에서 행을 삽입한다. 프로젝트 생성·게시·프로젝트 팔로우와 이벤트를 하나의 DB 트랜잭션으로 묶을 수 있다. 서로 다른 `insert()` 두 번을 호출하는 것만으로는 같은 트랜잭션이 되지 않는다. [삽입](https://supabase.com/docs/reference/javascript/insert), [트랜잭션](https://www.postgresql.org/docs/current/tutorial-transactions.html) · **2026-09-27 00:24·00:26 KST** | **가능, Pro 이상.** `@vercel/analytics/server`의 `track()`을 API 경로·Server Action에서 호출한다. 외부 전송과 빌드로그 DB 변경은 별도 처리이므로 누락·재시도 대책이 필요하다. [서버 이벤트](https://vercel.com/docs/analytics/custom-events) · **2026-09-27 00:23 KST** | **가능.** `posthog-node`의 `capture({distinctId,event,properties})` 또는 수집 API를 쓴다. 짧게 실행되는 서버에서는 전송 대기열을 끝까지 비우는 처리가 필요하다. [Node.js](https://posthog.com/docs/libraries/node) · **2026-09-27 00:24 KST** | **가능.** 서버에서 `POST /api/send`로 이름·속성을 보낸다. 수집 경로는 인증 토큰 없이 열려 있고 올바른 `User-Agent`가 필요하므로, 서버만 기록하게 하려면 수집 경로 접근도 자체 통제해야 한다. [수집 API](https://docs.umami.is/docs/api/sending-stats) · **2026-09-27 00:24 KST** |
| **(b) 커스텀 이벤트·속성·한도** | **직접 정의.** §4의 고정 열로 5개만 허용하고 임의 JSON 속성은 받지 않는 안이다. Free는 **$0/월, DB 500 MB, API 요청 수 무제한**이나 DB·전송량·처리 성능은 유한하다. 이벤트 몇 건을 담는지는 행·인덱스 크기 측정 전 **미확인**이다. [삽입](https://supabase.com/docs/reference/javascript/insert), [가격](https://supabase.com/pricing) · **2026-09-27 00:24 KST** | Hobby는 **월 50,000건, 커스텀 이벤트 미지원**. Pro는 커스텀 이벤트당 속성 **2개**, Plus는 **8개**. Pro/Plus 이벤트 요금은 **1,000건당 $0.03**이며 자동 페이지뷰도 사용량에 포함된다. 최소 테이블의 모든 열이 Pro 속성 2개에 들어간다고 가정하지 않는다. [한도·가격](https://vercel.com/docs/analytics/limits-and-pricing) · **2026-09-27 00:26 KST** | 커스텀 이벤트·속성 지원. 무료 **월 1,000,000건, 프로젝트 1개**, 무료 한도 초과분은 버려진다. 속성 개수·크기의 고정 상한과 현재 유료 초과 단가는 이번 가격 본문에서 **미확인**이며 옛 단가를 재사용하지 않았다. [Node.js](https://posthog.com/docs/libraries/node), [가격](https://posthog.com/pricing) · **2026-09-27 00:24·00:26 KST** | 이름·속성 지원, 이벤트 이름 **50자** 제한. 자체 호스팅은 공식 가격 페이지 메타 설명에서 무료로 안내하지만 월 처리 가능 건수·속성 수의 운영 상한은 **미확인**이다. Cloud의 무료 할당량을 자체 호스팅에 적용하지 않는다. [이벤트](https://docs.umami.is/docs/track-events), [가격](https://umami.is/pricing) · **2026-09-27 00:26 KST** |
| **(c) IP·쿠키·기기 지문·referrer** | **수집 필드를 직접 통제.** 행 삽입 API에 넣은 열만 기록하는 방식으로 IP·브라우저 정보·referrer 열을 두지 않는다 [제안]. 비회원 무작위 키용 자체 쿠키만 사용한다. 이는 분석 테이블의 설계이며 Vercel/Supabase의 기반 시설 로그까지 미수집이라는 주장이 아니다. [삽입](https://supabase.com/docs/reference/javascript/insert), [쿠키 옵션](https://nextjs.org/docs/app/api-reference/functions/cookies) · **2026-09-27 00:24·00:26 KST** | 공식 안내는 제3자 쿠키 없이 요청에서 만든 해시로 구분하며 개별 IP와 연결되지 않는다고 설명한다. 기본 항목에는 referrer·지역·OS·브라우저·기기 종류가 있다. 해시의 정확한 입력·무작위 키로의 대체와 모든 금지 항목의 차단 설정은 **미확인**이다. [개인정보·수집 항목](https://vercel.com/docs/analytics/privacy-policy) · **2026-09-27 00:26 KST** | Web SDK는 기본 `localStorage+cookie` 저장과 URL·referrer 등 자동 속성이 있다. IP 기본값은 조직/프로젝트 설정에 의존하고 EU 조직은 기본 수집 비활성이다. 프로젝트의 IP 폐기 설정, 자동 수집 끄기, 서버 SDK에서 허용 속성만 보내는 방식이 가능하다. 쿠키 없는 서버 해시 모드는 별도 기능이므로 무작위 세션 키 방식과 혼동하지 않는다. [수집 제어](https://posthog.com/docs/privacy/data-collection), [저장 제어](https://posthog.com/docs/privacy/data-storage), [기본 식별 설정](https://posthog.com/docs/data/anonymous-vs-identified-events) · **2026-09-27 00:24·00:27 KST** | 추적 쿠키·원시 IP는 저장하지 않지만 **IP·User-Agent·사이트 ID의 해시**로 세션을 구분한다. 기본 항목에는 referrer·브라우저·화면·지역 등이 있다. 서버 전송에서 referrer를 빈 값으로 만들 수 있으나, 기기 정보 기반 구분을 완전히 끄는 공식 설정은 **미확인**이다. [세션](https://docs.umami.is/docs/sessions), [수집 항목](https://docs.umami.is/docs/metric-definitions), [수집 API](https://docs.umami.is/docs/api/sending-stats) · **2026-09-27 00:23~00:24 KST** |
| **(d) 보존을 30일로 제한** | **직접 정리 구현 가능.** `pg_cron`에서 시각 조건으로 `DELETE`하고 실행 이력을 확인할 수 있다. 조회 필터만 두어서는 삭제가 아니다. 실행 지연·실패와 백업 사본 문제는 §4.2의 필수 검증으로 남긴다. [Cron](https://supabase.com/docs/guides/cron), [삭제 예제](https://supabase.com/docs/guides/cron/quickstart), [백업](https://supabase.com/docs/guides/platform/backups) · **2026-09-27 00:23·00:26 KST** | **충족 확인 불가.** 조회 보장 기간은 Hobby 1개월/Pro 12개월/Plus 24개월이며, 공식 문서는 더 오래 보관할 수 있다고 명시한다. 1개월 조회 창은 30일 삭제 설정이 아니다. 30일 삭제·익명화 설정은 **미확인**이다. [조회 기간의 의미](https://vercel.com/docs/analytics/limits-and-pricing#what-is-the-reporting-window) · **2026-09-27 00:23 KST** | **무료 플랜 제외.** 이벤트 보존은 **1년**이며 더 짧게 설정하거나 요청할 수 없다고 명시한다. 사람·프로젝트 삭제는 별도 도구이고 이벤트 삭제는 비동기로 처리된다. 화면 녹화의 30일 보존은 행동 이벤트 보존이 아니다. [이벤트 보존](https://posthog.com/docs/data/events-retention), [삭제](https://posthog.com/docs/privacy/data-storage) · **2026-09-27 00:24 KST** | **기본값 불충족.** 자체 호스팅 데이터는 수동 삭제 전까지 무기한 보관한다. 자체 DB 정리 작업을 만들 여지는 있으나, 이벤트·세션·속성·백업을 함께 30일로 제한하는 공식 설정/절차는 **미확인**이다. [FAQ 보존 안내](https://docs.umami.is/docs/faq), [설치](https://docs.umami.is/docs/install) · **2026-09-27 00:24 KST** |
| **(e) 비회원 식별·계정 연결** | **직접 분리 가능.** 서버 발급 무작위 키만 사용하고 가입/로그인 전에 폐기, 회원 이벤트에는 비회원 키를 쓰지 않는다 [제안]. 계정·다른 기기와 연결하는 표나 후처리를 만들지 않는다. §4.1 참고. [서버 쿠키](https://nextjs.org/docs/app/api-reference/functions/cookies), [무작위 값](https://nodejs.org/api/crypto.html#cryptorandombytessize-callback) · **2026-09-27 00:26 KST** | 요청 해시로 구분한 방문 세션은 **24시간 후 폐기**한다고 안내한다. 서로 다른 앱·사이트를 가로질러 사용자를 식별하지 않는다는 설명은 있지만, 빌드로그가 발급한 비회원 키로 교체하는 계약은 **미확인**이다. 계정 ID를 사용자 속성으로 보내지 않는 추가 규칙도 필요하다. [방문자 식별](https://vercel.com/docs/analytics/privacy-policy) · **2026-09-27 00:26 KST** | Web SDK의 비회원 기록과 `identify()`/`alias()` 계정 연결 기능이 있다. 서버 SDK는 기본적으로 사람 프로필을 만드는 방식이어서 `$process_person_profile:false`와 별도 무작위 `distinctId`가 필요하다. 기존 계정의 ID를 다시 쓰면 익명 처리되지 않으므로 가입·기기 사이 ID 전달/병합을 금지해야 한다. [비회원·회원 이벤트](https://posthog.com/docs/data/anonymous-vs-identified-events), [식별 제어](https://posthog.com/docs/privacy/data-collection) · **2026-09-27 00:24·00:27 KST** | 기본 해시 세션이며 `Distinct ID`를 붙이면 여러 세션·기기의 활동이 연결된다. `identify()`와 계정 ID 전송을 사용하지 않아야 한다. API의 `payload.id` 필드 존재만으로 기본 해시 처리가 전부 사라진다고 추정하지 않았다. [세션·연결](https://docs.umami.is/docs/sessions), [수집 API](https://docs.umami.is/docs/api/sending-stats) · **2026-09-27 00:23~00:24 KST** |
| **(f) 운영자만 조회** | **가능, 직접 구현.** 테이블/뷰 권한과 행 단위 접근 규칙(RLS)을 함께 설정하고 운영자 검증을 통과한 서버 경로만 집계를 반환한다. 일반 회원과 비회원에게 테이블·뷰 권한을 주지 않는다. 뷰의 기본 RLS 우회도 막아야 한다. [권한·RLS·뷰](https://supabase.com/docs/guides/database/postgres/row-level-security) · **2026-09-27 00:26 KST** | Vercel 프로젝트 대시보드에서 조회한다. Pro의 무료 Viewer도 분석을 읽을 수 있으므로 빌드로그 운영자로 지정한 사람에게만 Vercel 접근을 주는 별도 관리가 필요하다. 앱의 운영자 역할과 자동 연동된다는 근거는 없다. [분석 조회](https://vercel.com/docs/analytics/using-web-analytics), [Pro Viewer 권한](https://vercel.com/docs/plans/pro-plan#viewer-team-seat) · **2026-09-27 00:23·00:25 KST** | **운영자만 조직에 참여시키면 가능.** 무료/종량제는 세부 접근 제어 없이 모든 조직 구성원이 모든 프로젝트·자료를 볼 수 있다. 무료 플랜에서 일반 구성원에게 분석만 숨길 수 있다고 가정하면 안 된다. [플랜별 접근 제어](https://posthog.com/docs/settings/access-control) · **2026-09-27 00:26 KST** | 기본 통계는 비공개이며 조회 API는 인증이 필요하다. 운영자 계정만 두고 공개 Share URL을 만들지 않는 안으로 제한 가능하다. 빌드로그 운영자 역할과 Umami 계정 관리는 별개다. [기본 비공개](https://docs.umami.is/docs/enable-share-url), [API 인증](https://docs.umami.is/docs/api/authentication) · **2026-09-27 00:26·00:24 KST** |
| **(g) 추가 의존성·월 비용·운영** | 기존 Supabase 클라이언트·SQL만 사용하고 DB 확장 `pg_cron`을 활성화하는 안이다. 별도 분석 서비스 사용료는 없지만 기존 DB 용량·연산을 쓴다. Free **$0/월**, Pro **$25/월부터**이며 Free는 1주 비활동 시 일시 중지된다. 이벤트 때문에 유료 전환이 필요한 시점은 **미확인**. 집계 화면·정리 실패 점검은 직접 만든다. [가격](https://supabase.com/pricing), [Cron](https://supabase.com/docs/guides/cron) · **2026-09-27 00:24·00:23 KST** | `@vercel/analytics` 추가, 수집·차트 운영은 제공자가 맡는다. 커스텀 이벤트에 필요한 Pro는 **$20/월**(배포 좌석 1개·사용량 크레딧 $20 포함), 분석 사용량 **$0.03/1,000건**. 속성 8개가 필요하면 Plus **추가 $10/월**. 기존 Pro 여부에 따라 추가 부담이 다르다. [Pro 가격](https://vercel.com/docs/plans/pro-plan#platform-fee), [분석 가격](https://vercel.com/docs/analytics/limits-and-pricing) · **2026-09-27 00:25~00:26 KST** | 무료 범위는 **$0/월**. `posthog-node` 또는 HTTP 연동, 별도 프로젝트 설정·전송 실패 처리·수집 필터·조직 권한 점검이 추가된다. DB와 외부 이벤트 전송의 성공을 묶는 작업도 필요하다. 무료 한도 초과는 자동 유료 전환이 아니라 기록 손실이 될 수 있다. [가격](https://posthog.com/pricing), [Node.js](https://posthog.com/docs/libraries/node) · **2026-09-27 00:26·00:24 KST** | 소프트웨어 자체 호스팅은 무료로 안내된다. **서버·DB의 실제 월 비용은 미확인**이며 $0 운영으로 계산하지 않았다. 별도 Umami 앱, Node.js 또는 Docker, PostgreSQL, 배포·업데이트·백업·삭제 점검이 필요하다. 기존 Supabase를 쓴다고 이 운영이 사라지지 않는다. [가격 메타 설명](https://umami.is/pricing), [설치](https://docs.umami.is/docs/install), [업데이트](https://docs.umami.is/docs/updates) · **2026-09-27 00:26·00:24·00:33 KST** |

## 3. Q20로 걸러낸 결과와 권고

| 후보 | 결과 | 이유 |
|---|---|---|
| Supabase 자체 `events` | **[제안] 유일한 구현 검토 후보로 유지** | 기록·식별·조회·삭제를 기존 DB에서 직접 제한할 수 있다. §4의 구현 및 보존/백업 확인을 통과한 뒤에만 Q20 충족으로 판정한다. 근거: 비교표 (a)~(g). |
| Vercel Web Analytics | **제외** | 무료 커스텀 이벤트 미지원, 30일 삭제 설정 미확인, 기본 요청 해시를 Q20 무작위 키로 대체하는 방법 미확인. 근거: 비교표 (b)~(e). |
| PostHog Cloud 무료 | **제외** | 이벤트 1년 보존 및 보존 기간 단축 불가. 사람 삭제 API의 비동기 처리로 30일 자동 정리 계약을 대신할 수 없다. 근거: 비교표 (d). |
| Umami 자체 호스팅 | **제외** | 기본 세션이 IP·브라우저 정보에 기반하고 보존은 무기한이다. 이를 고치려면 자체 기록/정리 경로를 만들면서 별도 앱 운영도 맡아야 한다. 공식 문서에서 금지 항목을 모두 끄는 구성을 확인하지 못했다. 근거: 비교표 (c)~(e), (g). |

**권고는 하나: [제안] 자체 `events` 테이블.** “모든 제약을 이미 충족한 도구”의 목록은 현재 비어 있다. 외부 계정·실제 DB를 만들지 않는 이번 조사에서 구현 성공까지 확인할 수 없고, 특히 §4.2의 보존 경계는 문서만으로 통과 처리하지 않는다. 나머지 도구의 미확인 사항을 충족으로 간주해 최종 후보에 넣지 않았다.

Q20를 구현할 대응 관계는 다음과 같다. 모두 제품 공급자의 기본 보장이 아닌 **[제안] 구현 계약**이다. 구현 근거 URL·시각은 비교표의 해당 항목과 §4에 적었다.

| Q20 항목 | 자체 테이블에 적용할 계약 |
|---|---|
| 이벤트 5개를 서버가 기록 | §4의 표를 그대로 사용. 이벤트 이름 허용 목록·대상 검증·중복 키를 서버에서 적용. 생성·게시·프로젝트 팔로우는 도메인 변경과 같은 트랜잭션. |
| 30일 후 삭제/익명화 | §4.2의 삭제 작업을 사용. 30일 조회 필터도 함께 적용하되 삭제의 대체로 취급하지 않음. 실패·백업 사본은 별도 합격 조건. |
| 비회원과 가입 계정·다른 기기 연결 금지 | §4.1의 별도 무작위 키, 인증 경계에서 폐기, 두 식별 열 동시 저장 금지, 병합표·공유 식별자 없음. |
| 운영자만 집계 | §4.3의 서버 역할 확인·테이블/뷰 권한·비공개 응답. 프로젝트 소유자에게 `events` 접근을 주지 않음. |
| IP·기기 지문·전체 referrer 저장 금지 | 기존 고정 열만 저장. 요청 헤더·본문·쿠키 원문·자유 입력 속성의 일괄 저장 금지. 비회원 키는 기기 특성에서 만들지 않음. |

## 4. [제안] 채택할 기록 계약과 구체화

### 기록 계약 — 기술 §8의 표를 그대로 채택

다음 표는 [기술 §8](../03_TECH_SPEC.md#행동-이벤트)의 내용을 그대로 옮겼다. 자체 테이블 권고 때문에 이벤트·시점·주체를 바꾸지 않는다.

| 이벤트 | 기록 시점 [제안] | 기록 주체·중복 처리 [제안] |
|---|---|---|
| `project_created` | 프로젝트 생성이 성공적으로 저장될 때 | 서버가 인증된 생성자·프로젝트 ID를 기록. 같은 생성 요청 재시도는 추가 기록하지 않음 |
| `post_published` | 게시물이 처음 공개될 때. Release도 같은 게시물 한 건으로 처리 | 서버가 작성자·프로젝트·게시물 ID를 기록. 편집·재시도·피드/프로젝트 타임라인 동시 반영으로 중복 기록하지 않음 |
| `project_viewed` | 공개 프로젝트 페이지가 실제로 표시된 뒤 열람 신호를 서버가 받아 공개 상태를 확인할 때 | 서버가 기록. 프리페치·알려진 자동 요청은 제외하고 같은 페이지 표시 신호의 재전송은 중복 제거. 서버 응답만으로 실제 열람을 단정하지 않음 |
| `share_clicked` | 공개 프로젝트·게시물의 URL 복사 또는 공유 버튼을 눌렀다는 신호를 서버가 받아 대상 공개 상태를 확인할 때 | 서버가 기록. 같은 클릭 신호의 재전송은 중복 제거. 복사 성공·외부 공유 완료를 뜻하지 않음 |
| `project_followed` | 프로젝트 팔로우 관계가 새로 저장될 때 | 서버가 인증된 사용자·프로젝트 ID를 기록. 이미 있는 관계에 대한 반복 요청·관계 해제는 기록하지 않음 |

저장 열도 기술 §4의 `id`, `event_name`, `occurred_at`, `actor_user_id`, `anonymous_session_key`, `project_id`, `post_id`, `is_demo`, `is_operator`, `dedupe_key`를 유지한다. 이벤트 이름은 5개만 허용하고 `dedupe_key`는 unique로 둔다. `occurred_at`·회원 신원·데모/운영자 표시는 서버가 정하며 `actor_user_id`와 `anonymous_session_key`는 동시에 채울 수 없게 한다. 둘 다 null인 연결 불가 기록은 허용한다. 별도 자유 입력 속성 열을 추가하지 않는다. [제안; 정본: 기술 §4·§8]

**원자성:** 생성·게시·프로젝트 팔로우를 처리하는 DB 함수/트랜잭션 안에서 이벤트도 저장한다. 공개 API에서 도메인 변경과 `events.insert()`를 각각 호출한 뒤 둘 다 성공했기를 기대하는 구조는 채택하지 않는다. 열람·공유는 신호 재전송에 같은 키를 쓰고, 실패는 횟수로 관측하되 사용자의 열람·공유 자체를 막지 않는다. PostgreSQL은 트랜잭션의 변경들을 함께 성공/취소하도록 지원한다. [공식 트랜잭션](https://www.postgresql.org/docs/current/tutorial-transactions.html) · 확인 2026-09-27 00:26 KST.

### 4.1. 비회원 세션 키 발급·저장

1. **발급:** 같은 출처의 서버 경로가 `node:crypto`의 `randomBytes(32)`로 무작위 값을 만든다. IP·OS·브라우저·계정·다른 서비스 ID는 입력으로 쓰지 않는다. 무작위 값과 발급 시각에 서버 서명을 붙여 위조·유효기간 변조를 검사한다. 서버 비밀값은 구현/배포 단계에 설정하며 이번 조사에서는 발급하지 않았다. Node.js는 무작위 값·해시·HMAC 기능을 기본 제공한다. [공식 Crypto](https://nodejs.org/api/crypto.html) · 확인 2026-09-27 00:26 KST. **32바이트·서명 구성은 [제안]**이다.
2. **브라우저 저장:** `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, `Domain` 생략인 자체 쿠키에 둔다. **발급 후 30분 절대 만료, 활동으로 자동 연장하지 않음 [제안]**. 서버도 발급 시각을 검증하고 만료 시 새 무작위 값을 쓴다. `localStorage`, 공유 URL, OAuth `state`에는 옮기지 않는다. 쿠키를 읽지 못하면 IP로 대체하지 않고 연결 불가로 센다. `cookies().set/delete`는 Route Handler/Server Function에서 처리하고 개인 쿠키가 포함된 응답을 공유 캐시에 저장하지 않는다. [공식 쿠키 API](https://nextjs.org/docs/app/api-reference/functions/cookies) · 확인 2026-09-27 00:26 KST.
3. **DB 저장과 단절:** `anonymous_session_key`에는 발급한 무작위 값의 SHA-256 해시만 저장한다 [제안]. 이 해시도 세션 연결이 가능한 값이므로 개인정보 보존 대상에서 제외하지 않는다. 가입/로그인을 시작할 때와 인증 완료 경계에서 쿠키를 지우며, 회원 이벤트는 `actor_user_id`만 기록한다. 로그아웃 후에는 새 키를 발급한다. 이전 비회원 기록을 갱신해 계정 ID를 채우거나 두 ID를 잇는 표를 만들지 않는다. 중복 키에도 두 신원을 함께 넣지 않는다. 다른 기기는 키를 새로 받는다. 근거 기능: [Crypto](https://nodejs.org/api/crypto.html), [쿠키 삭제](https://nextjs.org/docs/app/api-reference/functions/cookies#deleting-cookies) · 확인 2026-09-27 00:26 KST; 연결 금지는 Q20의 구현 제안이다.

30분은 사용자 수 추정을 위한 장기 식별 기간이 아니다. 같은 세션의 열람·공유 신호만 연결한다. 쿠키 차단·삭제·만료·브라우저 변경으로 세션 수는 달라지므로 **세션 수를 사람 수로 표시하지 않는다**. 비회원 키를 계정에 붙이지 않으므로 가입 전환율을 이 데이터만으로 계산하지 않는다. 탈퇴한 회원은 해당 `actor_user_id`의 이벤트를 삭제하는 안으로 최소화한다. [제안; Q20 및 기술 §8]

### 4.2. 30일 정리 작업 — Supabase Cron

**[제안] Supabase Cron(`pg_cron`) 작업 하나를 DB 안에서 실행한다.** 별도 Vercel HTTP 호출·작업 인증키·분석 서비스가 필요 없다. Supabase는 SQL/DB 함수 예약과 실행 이력 조회를 지원하며, 공식 예제에도 오래된 `events` 삭제가 있다. [Cron](https://supabase.com/docs/guides/cron), [Quickstart](https://supabase.com/docs/guides/cron/quickstart) · 확인 2026-09-27 00:23 KST.

아래는 **실행하지 않은 설계 예시**다. 실제 테이블/권한 구성을 적용한 뒤 migration과 통합 검증에 넣는다. 작업 실행 역할에만 삭제 권한을 준다.

```sql
-- 시각은 UTC timestamptz, occurred_at 인덱스 사용을 전제로 한다.
select cron.schedule(
  'purge-behavior-events',
  '* * * * *',
  $$ delete from public.events
     where occurred_at <= now() - interval '30 days'; $$
);
```

- **정리 단위 [제안]:** 매분 만료 행 전체를 삭제한다. `actor_user_id`만 null로 만드는 방식은 `project_id`·세션 키·중복 키로 다시 연결될 수 있으므로 초기에는 익명화보다 행 삭제를 택한다. 큰 삭제가 부담이 되는지는 실제 행 수·인덱스로 측정하며 불필요한 분할 저장은 미리 추가하지 않는다.
- **30일 경계의 한계:** 이 SQL은 정확히 30일이 되는 순간의 물리 삭제를 보장하지 않는다. 정상 실행에서도 다음 실행까지 약 1분과 실행 시간이 더 걸릴 수 있다. 조회는 별도로 30일 미만만 허용하지만 **조회 차단은 삭제/익명화가 아니다**. Q20를 초 단위 최대 보존으로 적용하려면 실행 지연을 포함해 더 일찍 정리하는 설계와 검증이 필요하다. 이 차이를 사용자 승인 없이 허용 유예로 확정하지 않는다. **현재 미확인/구현 합격 조건**이다.
- **실패 점검 [제안]:** `cron.job_run_details`에서 마지막 성공·실패를 확인하고, 30일 초과 행 수가 0인지 함께 검사한다. 실패하면 다음 실행에서 같은 시각 조건으로 재시도하고 운영 화면에 정리 실패를 표시한다. 복구/재시작 때도 정리를 먼저 실행한다. 초과 행이 있으면 개인정보 정리 완료와 핵심 흐름 완료 판정을 하지 않는다. Cron 자체 실행 이력은 자동 정리되지 않으므로 별도 운영 이력 보존 정책으로 정리하며, SQL에 세션 키·회원 ID의 실제 값을 넣지 않는다. [실행 이력·정리](https://supabase.com/docs/guides/cron/quickstart) · 확인 2026-09-27 00:23 KST.
- **Free 중지:** Free 프로젝트는 1주 비활동 시 중지될 수 있다. Cron 등록만으로 중지 중 정리 실행까지 보장된다고 가정하지 않는다. 실제 요금제와 중지/복구 동작을 확인해야 한다. [가격·중지 조건](https://supabase.com/pricing) · 확인 2026-09-27 00:24 KST.
- **백업 사본:** Pro의 일일 백업은 최근 7일분을 제공하고, 지원되는 프로젝트는 물리 백업을 사용한다. 현재 행을 삭제해도 기존 백업 속 이벤트까지 지워졌다는 뜻은 아니다. 행동 데이터의 백업 제외 또는 사본까지 포함한 30일 삭제 가능 여부는 **미확인**이다. 복원 후 서비스 재개 전에 만료 행을 다시 지우는 것은 필요하지만 사본 삭제의 대체는 아니다. **백업을 포함한 Q20 완전 준수는 이번 조사에서 통과 판정하지 않는다.** [공식 백업](https://supabase.com/docs/guides/platform/backups) · 확인 2026-09-27 00:26 KST.

Vercel Cron도 대안이지만 Hobby는 하루 1회만 실행할 수 있고 예약 시각에서 최대 59분 늦게 호출될 수 있다. Cron 자체는 플랜에 포함되지만 실행 함수의 사용량 과금은 따르므로 이번 분 단위 정리안에는 Supabase Cron을 권한다. [Vercel Cron 한도·가격](https://vercel.com/docs/cron-jobs/usage-and-pricing) · 확인 2026-09-27 00:26 KST. 정확한 보존 상한을 Cron의 가격만으로 판단하지 않는다.

### 4.3. 운영자 집계 화면 — SQL 뷰 1개 + 관리자 페이지 1개

**[제안] `operator_event_daily` 뷰 하나와 `/admin/events` 페이지 하나**로 시작한다. 집계 결과를 별도 장기 테이블에 복사하지 않아 만료 행 삭제 후 집계도 함께 사라지게 한다. 실제 사용자 지표는 `is_demo=false AND is_operator=false`만 사용하고, 데모/운영자 활동은 점검용 숫자로 분리한다. 두 표시는 서버가 행동 주체와 대상 프로젝트/소유자 정보를 확인해 기록한다. 로그아웃한 운영자를 식별하지 못한 경우 실제 사용자 지표에 섞일 수 있다는 기술 §8의 한계를 표시한다.

아래는 **실행하지 않은 최소 뷰 예시**다. PostgreSQL 15 이상에서 호출자의 권한을 따르는 `security_invoker`를 사용한다. 일반 회원의 RLS 정책을 우회하는 공개 뷰로 만들지 않는다. [공식 RLS와 뷰](https://supabase.com/docs/guides/database/postgres/row-level-security) · 확인 2026-09-27 00:26 KST.

```sql
create view public.operator_event_daily
with (security_invoker = true) as
select
  (occurred_at at time zone 'Asia/Seoul')::date as day_kst,
  event_name,
  project_id,
  is_demo,
  is_operator,
  count(*) as event_count,
  count(*) filter (where actor_user_id is not null) as member_event_count,
  count(*) filter (where anonymous_session_key is not null) as anonymous_event_count,
  count(*) filter (
    where actor_user_id is null and anonymous_session_key is null
  ) as unlinked_event_count
from public.events
where occurred_at > now() - interval '30 days'
group by 1, 2, 3, 4, 5;

alter table public.events enable row level security;
revoke all on public.events from public, anon, authenticated;
revoke all on public.operator_event_daily from public, anon, authenticated;
```

**접근 경계 [제안]:** 쓰기·집계를 수행하는 서버 내부 코드만 DB 접근을 갖는다. 운영 페이지는 로그인 검증 후 서버가 관리하는 `roles`의 현재 운영자 역할을 확인하고, 이를 통과해야 고정 집계 쿼리를 호출한다. 일반 페이지 요청·범용 쿼리 API에 관리자 클라이언트를 공유하지 않는다. 서버 비밀키는 브라우저에 보내지 않는다. 위 `REVOKE` 예시는 일반 접근을 막는 부분이며 **서버 실행 역할의 최소 권한 부여와 실제 DB 통합 검증을 추가해야 실행 가능한 구성**이다. 사용자가 수정 가능한 `user_metadata`를 운영자 판정에 사용하지 않는다. [권한·RLS·서버 키 경계](https://supabase.com/docs/guides/database/postgres/row-level-security) · 확인 2026-09-27 00:26 KST; 운영자 역할 정본은 기술 §3·Q18이다.

페이지의 최소 표시는 다음과 같다 [제안].

- 최근 7일/30일 선택과 프로젝트 필터, KST 일자별 이벤트 5종의 건수. “기록된 행동 수”라고 표시하고 빠진 이벤트도 0으로 보여 준다.
- 실제 사용자 지표와 데모/운영자 제외 건수, 회원/비회원/연결 불가 **이벤트 건수**. 사람 수·가입 전환·공유 성공률로 바꾸어 표시하지 않는다.
- 마지막 정리 성공 시각, 최근 정리 실패, 30일 초과 잔존 행 수. 이 상태는 Cron 실행 이력·상태 쿼리로 읽으며 분석용 뷰를 더 만들지 않는다.
- 로딩·빈 결과·기록 오류·접근 거부를 구분한다. 응답은 `private, no-store`로 두고 원시 회원 ID·세션 키·중복 키를 페이지/다운로드에 노출하지 않는다. 최초 범위에는 공개 링크·CSV 내보내기를 넣지 않는다.

작성자 본인 통계는 Q19의 좋아요·저장·프로젝트 팔로우 관계 집계로 제공하며, 이 운영 화면이나 `events` 권한을 프로젝트 소유자에게 주지 않는다. [제안; 정본: 기술 §3·§4·§8, Q19·Q20]

## 5. 조사 완료 증거와 구현 때 남은 확인

**이번에 완료:** 후보 4개 × 기준 7개 비교, 28개 셀의 공식 URL·KST 시각 기록, 후보 제외 근거, 권고 1개, 기술 §8 표의 동일성 대조, 세션 키·정리 작업·집계 화면의 세 가지 제안 작성. 로컬 문서만 생성했으며 서비스에 데이터를 기록하거나 삭제하지 않았다.

**구현 때 확인할 항목 [미검증]:** 이벤트 5종 실제 기록, 동일 요청 재시도 중복 제거, 데모/운영자 제외, 인증 전후 키 단절, 두 기기 키 분리, 쿠키 차단 시 연결 불가 처리, 비회원·일반 회원·권한 회수 후 운영 화면/API 차단, 금지 필드와 로그 유출 검사, 30일 경계·Cron 실패/중지/복구, 백업 사본과 복원 후 삭제. 보존 상한과 백업 사본 문제를 해소하기 전에는 “Q20 전 항목 충족”으로 기록하지 않는다.

**연구 범위 밖:** K-9의 팔로잉 탭 열람·다음 게시물 열람 등 추가 이벤트, 계정 가입 전환 연결, 도메인·OAuth 실제 로그인, 도구 가입/결제. 기존 다섯 이벤트의 측정 범위를 넓히는 결정은 하지 않았다.
