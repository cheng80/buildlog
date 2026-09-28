# 커스텀 도메인 없이 GitHub·Google 로그인 확인하기

작성일: 2026-09-27 · 대상: 레드팀 K-10 · 상태: **공식 문서 확인 완료 / 실제 로그인 미확인**

**판단:** 공식 문서를 종합하면 Supabase 기본 호스트와 Vercel의 `*.vercel.app` 주소로 로그인 확인을 준비할 수 있다. 아래는 앱 구현 없이 정적 페이지와 브라우저만 사용하는 검증안이며, 두 제공자의 실제 성공은 사용자 실행 뒤 판정한다. [A2], [V1]

**30분 판단:** 계정과 권한이 준비되어 있으면 조작시간 약 29분으로 계획할 수 있으나, 완료 보장은 불가하다. Google 설정 반영만 **5분~몇 시간** 걸릴 수 있다는 공식 안내가 있다. 아래 시간은 작성자의 계획 추정이며 실측이 아니다. [G4]

범위는 [기술 명세 §3](../03_TECH_SPEC.md#3-인증권한보안), [PLAN-001 §5](../plans/PLAN-001-planning-review.md#5-두-번째-라운드--운영-정책-구체화), [레드팀 K-10](../strategy-red-team.md#k-10-우선순위-13은-자원-미정-없이-착수할-수-있다-4-선행-미정-열)을 따른다. Vercel 기본 호스트 사용은 2026-09-27 사용자 결정이다. 여기서 Supabase/Google/Vercel의 “프로젝트”는 서비스 설정 단위이며, 빌드로그의 도메인 용어인 **프로젝트**와 별개다.

이번 조사에서는 계정 생성·서비스 가입·프로젝트 생성·키 발급·배포·로그인·결제를 수행하지 않았다. 앱의 쿠키 유지, 서버 인증, 계정 연결, 권한, 행동 이벤트도 미검증이다. 로그인 성공만으로 K-2의 행동 이벤트 기록이나 핵심 흐름 전체를 완료 처리하지 않는다.

## 1. 공식 문서 확인표

아래 링크의 확인 시각은 모두 KST다. 본문의 `[S1]` 같은 표기는 같은 URL과 확인 시각을 재사용한다. 문서의 설정 화면 위치는 공식 안내를 옮긴 것이며 사용자 계정의 실제 화면은 열지 않았다.

| 항목 | 확인한 규칙과 이번 적용 | 공식 출처 / 확인 시각(KST) |
|---|---|---|
| Site URL | 로그인 후 기본 도착 주소다. `redirectTo`를 생략하면 사용한다. 기본 안내값은 `http://localhost:3000`이다. 이번에는 실제로 열리는 주소 하나를 넣는다. 와일드카드 허용은 아래 Redirect URLs 규칙이며 Site URL에 `*.vercel.app`를 넣는 근거가 아니다. | [S1: Redirect URLs][S1] / 2026-09-27 00:23 |
| Redirect URLs 와일드카드 | `*`는 구분자 `.`·`/`를 넘지 않는 문자열, `**`는 구분자를 포함한 문자열, `?`는 구분자 이외 한 글자와 맞는다. `\c`는 문자 그대로, `[!a-z]`는 a~z를 제외한 범위다. `http://localhost:3000/*`는 `/foo`와 맞지만 `/foo/bar`·`/foo/`와 맞지 않는다. | [S1] / 2026-09-27 00:23 |
| Vercel 미리보기 허용 예시 | 공식 예시는 `https://*-<team-or-account-slug>.vercel.app/**`다. 예를 들어 실제 계정 식별자가 `my-team`이라면 `https://*-my-team.vercel.app/**`로 제한한다. 이 예시 문자열은 배포된 주소가 아니다. 이번 한 번의 검증은 복사한 정확한 주소를 등록하는 편이 단순하며, 운영에서도 정확한 경로 사용을 권장한다. | [S1] / 2026-09-27 00:23 |
| Vercel 기본 주소 | Vercel은 배포에 `.vercel.app` 주소를 자동 부여한다. 도메인 구매 없이 사용할 호스트의 근거다. 다른 계정의 배포까지 허용하는 `https://*.vercel.app/**`는 이번 허용 목록으로 쓰지 않는다. | [V1: Working with domains][V1], [S1] / 2026-09-27 00:23~00:25 |
| GitHub OAuth App 등록 | `Homepage URL`에는 사이트의 전체 주소, `Authorization callback URL`에는 로그인 제공자가 돌아올 주소를 넣는다. 현재 공식 문서는 콜백을 최대 **10개** 등록할 수 있다고 안내한다. 이번에는 Supabase 화면에서 복사한 `https://<ref>.supabase.co/auth/v1/callback` 하나를 등록한다. | [H1: Creating an OAuth app][H1], [S2: Sign in with GitHub][S2] / 2026-09-27 00:23~00:24 |
| GitHub 콜백 일치 규칙 | 와일드카드 매칭을 끄면 정확히 일치해야 한다. 켜면 하위 도메인·하위 경로를 허용하되 기본 호스트와 포트 제약이 있다. 2026-08-03 전의 단일 콜백 앱에는 기존 동작 보존을 위해 매칭이 켜져 있을 수 있다. 이번에는 매칭을 끄고 정확한 Supabase 콜백을 사용한다. Supabase의 `*` 문법을 이 칸에 옮기지 않는다. | [H2: Authorizing OAuth apps][H2] / 2026-09-27 00:24 |
| Google 승인된 리디렉션 URI | 클라이언트 유형은 `Web application`. 요청의 `redirect_uri`가 등록값과 정확히 맞아야 하며 스킴·대소문자·끝 `/`도 비교한다. HTTPS가 원칙이고 localhost는 예외다. `*`, URL 조각(`#...`), 사용자정보 부분, 상위 경로 이동 표현은 허용하지 않는다. 이번 등록값은 Supabase 콜백이다. | [G1: Web Server OAuth][G1], [A2] / 2026-09-27 00:23~00:24 |
| Google JavaScript origins | 브라우저 JavaScript에서 Google API를 호출할 때 쓰는 출처 설정으로, 리디렉션 URI와 별개다. 경로·쿼리·`#`·와일드카드를 넣지 않는다. Supabase 설정 안내에 따라 임시 페이지의 출처(예: `http://localhost:3000` 또는 실제 `https://…vercel.app`)를 등록한다. | [G4: Manage OAuth Clients][G4], [S3] / 2026-09-27 00:23~00:26 |
| Google 게시 상태: 일반 Testing 규칙 | 일반적으로 지정한 테스트 사용자 최대 **100명**만 허용하고 동의는 **7일** 뒤 만료된다. 오프라인 접근으로 받은 Google 갱신 토큰도 해당된다. 이는 Supabase 세션의 수명 설명이 아니다. | [G2: Manage App Audience][G2] / 2026-09-27 00:24 |
| Google Testing의 기본 범위 예외 | 요청이 `openid`, `userinfo.email`, `userinfo.profile` 또는 동등한 이름·이메일·프로필 범위 안에만 있으면 테스트 사용자 목록 등록, 해당 미검증 경고, **7일 만료가 적용되지 않는다**. 다른 범위를 요청하면 예외가 사라진다. 따라서 이번 로그인에 “무조건 테스트 사용자 100명 제한”을 적용하면 부정확하다. | [G2] / 2026-09-27 00:24 |
| Google 게시 상태: In production | `Publish app`으로 전환하면 일반 Google 계정 대상이 된다. 이름·로고 표시와 민감/제한 범위의 검증 요구는 별도다. 이번 검증에서는 Testing을 유지한다. | [G2] / 2026-09-27 00:24 |
| Google 앱 검증 필요 여부 | 개발·테스트 앱은 OAuth 검증을 의무로 요구하지 않는다. 이번에는 `External`·`Testing`과 기본 범위만 사용해 검증 심사를 기다리지 않는 안이다. 이름·로고를 동의 화면에 표시하는 **브랜드 검증**은 별도이고, 운영 공개·민감/제한 범위 추가의 요구를 이번 결과로 면제하지 않는다. | [G3: When is verification not needed][G3], [G5: Manage OAuth App Branding][G5], [G6: Manage App Data Access][G6] / 2026-09-27 00:24~00:25 |
| Supabase GitHub 제공자 | `Authentication > Sign In / Providers > GitHub`에서 활성화하고 GitHub의 `Client ID`, `Client Secret`을 저장한다. 같은 화면의 Callback URL을 GitHub에 등록한다. | [S2] / 2026-09-27 00:23 |
| Supabase Google 제공자 | Google 제공자를 활성화하고 웹 클라이언트의 `Client ID`, `Client Secret`을 저장한다. 필요한 범위는 `openid`, `…/auth/userinfo.email`, `…/auth/userinfo.profile`이다. 웹·모바일 Client ID를 함께 넣는 경우 웹 ID가 먼저지만, 이번에는 웹 ID 하나만 사용한다. | [S3] / 2026-09-27 00:23~00:24 |
| 직접 시작 주소와 `redirect_to` | 공식 API 명세에 `GET /authorize`와 선택값 `redirect_to`가 있다. README는 `provider=github`·`google` 및 **Site URL과 같은 호스트 또는 `URI_ALLOW_LIST`에 맞는 목적지**를 허용한다고 설명한다. 현재 가이드도 표준 주소 `/auth/v1/authorize`를 제시한다. 아래 URL은 이 근거를 조합한 검증안이다. | [A1: Auth API 명세][A1], [A2: Auth README][A2], [A3: 표준 authorize 주소][A3] / 2026-09-27 00:24 |
| URL 조각으로 성공 확인 | Supabase의 브라우저 토큰 반환 방식(implicit flow)은 성공 후 `#access_token=…&refresh_token=…`를 돌려준다. 브라우저는 `#` 뒤를 서버에 보내지 않는다. 따라서 정적 페이지의 서버 로그가 아닌 주소 표시줄에서 확인한다. | [S4: Implicit flow][S4] / 2026-09-27 00:23~00:24 |
| Google 연락처·대기시간 | 지원 이메일은 실제 확인하는 로그인 계정 주소 또는 관리하는 Google 그룹에서 선택한다. 서비스 목업의 `contact@buildlog.example`을 대신 넣지 않는다. OAuth 클라이언트 설정 반영은 **5분~몇 시간** 걸릴 수 있다. | [G7: Google Auth Platform 시작][G7], [G4] / 2026-09-27 00:24~00:26 |

`<ref>`는 사용자의 실제 Supabase 프로젝트 식별자로 바꾸는 자리다. `*.vercel.app` 역시 호스트 종류를 나타내는 표현이며 주소 표시줄에 그대로 입력할 주소가 아니다.

## 2. 앱 코드 없는 최소 절차

주소 두 종류를 구분한다. **제공자 콜백**은 GitHub·Google → Supabase, **최종 도착 주소**는 Supabase → 임시 페이지다. 로컬 페이지를 택해도 Supabase는 클라우드 프로젝트이므로 콜백은 계속 `https://<ref>.supabase.co/auth/v1/callback`이다. [S2]

1. 사용자가 Supabase 프로젝트를 만들고 §3의 제공자 등록·설정을 수행한다. [S5]
2. 최종 도착 페이지 하나를 준비한다. **K-10의 `vercel.app` 검증은 A**, Vercel 계정·배포 준비 없이 반환 동작부터 확인하려면 B를 선택한다. B만 성공하면 `vercel.app` 실증은 계속 미확인으로 남긴다.
3. Supabase `Authentication > URL Configuration`의 Site URL과 Redirect URLs에 선택한 **정확한 최종 도착 주소**를 저장한다. [S1]
4. 아래 시작 URL을 브라우저 주소 표시줄에 입력하고 본인의 GitHub 또는 Google 계정으로 로그인·동의한다. [A1], [A2], [A3]
5. 돌아온 주소의 호스트·경로가 등록한 대상이고, `#` 뒤에 값이 있는 `access_token`이 오며 오류가 없는지 확인한다. 각 제공자를 따로 실행하고 Supabase `Authentication > Users`에서 해당 사용자도 확인한다. [S4], [S6]

### A. Vercel 정적 페이지

아래 내용을 `index.html`로 임시 폴더에 저장한다. 앱 소스나 로그인 SDK가 없는 도착 표시용 문서다. 기존 Vercel 계정으로 [Vercel Drop](https://vercel.com/drop)을 열어 이 **파일 하나만** 올리고 팀·임시 서비스 이름을 고른 다음 `Deploy`한다. 공식 안내상 Git 연결 없이 새 프로젝트로 공개되며 배포 결과의 실제 `.vercel.app` 주소를 복사한다. 이 업로드·배포는 사용자 실행 항목이다. [V1], [V2]

```html
<!doctype html>
<html lang="ko">
<meta charset="utf-8">
<title>로그인 반환 확인</title>
<p>주소 표시줄에서 로그인 반환 결과를 확인하세요.</p>
</html>
```

검증 주소는 설명용으로 `https://<실제-배포-호스트>.vercel.app/`라고 부른다. 먼저 새 비공개 창에서 이 페이지가 열리는지 확인한다. Vercel 로그인 화면이 뜨면 임시 프로젝트의 `Settings > Deployment Protection`을 확인하고, 사용자에게 열리는 실제 도착 주소가 준비된 뒤 진행한다. 보호 화면 도달은 OAuth 성공 판정이 아니다. [V3]

### B. 공식 허용 로컬 주소

Supabase 공식 문서의 `http://localhost:3000/`를 사용한다. Python 3가 이미 있으면 새 임시 폴더에 위 `index.html` 하나를 저장하고 아래 명령을 실행한다. 경로는 실제 임시 폴더로 바꾼다. 저장소나 홈 전체를 제공할 필요가 없다. [S1], [P1]

```sh
python3 -m http.server 3000 --bind 127.0.0.1 --directory '/실제/임시/폴더'
```

브라우저에서 `http://localhost:3000/`가 열리는 동안 서버를 켜 둔다. 종료는 해당 터미널에서 `Ctrl+C`다. 이 준비는 Python 공식 서버 명령을 적용한 제안이며 실제 OAuth를 실행한 기록은 아니다. [P1]

### 브라우저에서 열 시작 URL

로컬 주소를 선택한 경우 아래 `<ref>`만 바꾼다. `redirect_to`는 URL의 한 값이므로 아래처럼 URL 인코딩한다. 이 요청에 Client Secret을 붙이지 않는다. Supabase의 표준 시작 주소와 `redirect_to` 계약에 근거한 예시다. [A1], [A2], [A3]

```text
https://<ref>.supabase.co/auth/v1/authorize?provider=github&redirect_to=http%3A%2F%2Flocalhost%3A3000%2F
https://<ref>.supabase.co/auth/v1/authorize?provider=google&redirect_to=http%3A%2F%2Flocalhost%3A3000%2F
```

Vercel 대상은 `redirect_to` 값을 실제 주소를 인코딩한 `https%3A%2F%2F<실제-배포-호스트>.vercel.app%2F`로 바꾼다. 예시의 `<…>`까지 전송하지 않는다. **`redirect_to`의 제공자 콜백 혼입, `redirect_uri`로의 잘못된 이름 변경, `/auth/v1/oauth/authorize`로의 경로 변경**을 피한다. 여기서 쓰는 것은 외부 제공자 로그인용 `/auth/v1/authorize`다. [A1], [A3]

성공 결과의 구조만 다음처럼 기록한다. 실제 토큰·전체 결과 URL·이메일은 보고서나 스크린샷에 남기지 않는다.

```text
https://<실제-배포-호스트>.vercel.app/#access_token=[가림]&refresh_token=[가림]&...
```

`provider_token`만으로 성공을 판정하지 않는다. 이후 Next.js 서버 인증의 PKCE(코드를 토큰으로 교환하는 방식)는 `?code=…` 뒤 교환 처리까지 별도 검증한다. 이번 URL 조각 방식은 앱의 최종 인증 구현을 대신하지 않는다. [S4], [S7]

## 3. 사용자가 실행할 체크리스트

소요시간은 **작성자 추정 조작시간**이다. 계정 가입·조직 승인·서비스 준비·설정 반영 대기시간은 포함하지 않는다. Google은 기본 범위만 요청하고 앱 이름·로고 공개 심사는 이번에 신청하지 않는 구성이다. [G2], [G3], [G5]

| 순서 | 예상 | 화면 위치와 할 일 | 성공 판정 | 실패 시 확인할 것 / 근거 |
|---|---:|---|---|---|
| ☐ 0. 계정 준비 확인 | 2분 | 본인의 Supabase·GitHub·Google Cloud 계정과 생성 권한을 확인한다. A는 Vercel 계정도 준비한다. | 필요한 관리 화면에 접근 가능 | 가입·조직 승인부터 필요하면 30분 계획에서 분리한다. [S5], [H1], [G7], [V2] |
| ☐ 1. Supabase 프로젝트 | 4분 | Dashboard에서 새 프로젝트를 만들고 준비 완료를 기다린다. `Authentication > Sign In / Providers`에서 콜백 주소를 복사한다. | 프로젝트 관리 화면과 `https://<ref>.supabase.co/auth/v1/callback` 확보 | 프로젝트 준비 상태·생성 권한 확인. 준비 지연은 로그인 실패로 기록하지 않는다. [S5], [S2] |
| ☐ 2. 도착 페이지 | 3분 | §2의 A(Vercel Drop) 또는 B(Python 로컬 서버)를 준비하고 직접 연다. | 실제 페이지 표시, 사용할 정확한 주소 확보 | A: `index.html`·루트 경로·Deployment Protection 확인. B: 서버 실행·3000 포트 확인. [V2], [V3], [P1] |
| ☐ 3. GitHub OAuth App | 4분 | GitHub `Settings > Developer settings > OAuth apps > New OAuth App`에서 이름, Homepage URL=2단계 주소, Authorization callback URL=1단계 콜백을 입력한다. Device Flow는 끄고 등록한다. Client ID·Client Secret을 안전하게 보관한다. | OAuth App 등록, 콜백 정확 일치, 인증 정보 확보 | GitHub App과 OAuth App을 혼동하지 않았는지 확인. 콜백 매칭을 끄고 다른 Supabase 프로젝트 주소가 아닌지 대조한다. [H1], [H2], [S2] |
| ☐ 4. Google 동의 화면·클라이언트 | 7분 | Google Cloud 프로젝트를 선택/생성하고 `Google Auth Platform > Get started`에서 이름·실제 지원 이메일·연락처를 등록한다. `Audience`는 External·Testing, `Data Access`는 §1의 기본 범위만 둔다. `Clients > Create client > Web application`에서 origins=2단계 출처, Authorized redirect URIs=1단계 콜백으로 만든다. | 웹 Client ID·Client Secret 확보, 요청할 범위 확인 | 추가 범위·Internal 선택·잘못된 URI 확인. 일반 Testing 규칙을 쓰는 경우 `Audience > Test users`에 본인 계정을 추가한다. 기본 범위 예외와 조직 계정 제한은 구분한다. [G7], [G2], [G4], [S3] |
| ☐ 5. Supabase 제공자 저장 | 2분 | `Authentication > Sign In / Providers`에서 GitHub·Google 각각 활성화하고 해당 Client ID·Client Secret을 입력·저장한다. | 두 제공자 활성·저장 상태 | 두 제공자의 키를 바꾸어 넣었는지, 공백·다른 프로젝트의 키인지 확인한다. 비밀키를 HTML·URL에 넣지 않는다. [S2], [S3] |
| ☐ 6. 목적지 허용 | 1분 | `Authentication > URL Configuration`에서 Site URL과 Redirect URLs에 2단계의 정확한 주소를 저장한다. | 저장된 주소와 브라우저 시작 URL의 `redirect_to` 대상 일치 | `http/https`, 포트, 경로, 끝 `/` 비교. 미리보기면 정확한 주소부터 검증한다. [S1] |
| ☐ 7. GitHub 로그인 | 2분 | 새 비공개 창에서 §2의 GitHub 시작 URL을 열고 본인이 로그인·동의한다. | 의도한 페이지로 복귀, 값 있는 `access_token`, 오류 없음; Users에서 사용자 확인 | §1의 설정과 `#error`·`error_description` 확인. 이전 성공 URL 재열람은 재검증으로 세지 않는다. [A1], [S4], [S6] |
| ☐ 8. Google 로그인 | 2분 | 별도의 새 비공개 창에서 Google 시작 URL을 열고 본인이 로그인·동의한다. | 7단계와 같은 조건을 Google에서도 충족 | `redirect_uri_mismatch`는 콜백 불일치, 접근 거부는 범위·테스트 사용자·조직 제한을 확인한다. 수정 직후라면 반영 대기도 기록한다. [G1], [G2], [G4] |
| ☐ 9. 결과 기록·정리 | 2분 | 아래 결과표에 제공자별 성공/실패/보류, KST 시각, 토큰을 가린 목적지와 오류명만 적는다. 비공개 창을 닫고 B의 임시 서버를 종료한다. | 두 제공자의 관찰 결과가 각각 남음 | 토큰·Client Secret·전체 이메일이 기록되지 않았는지 확인. 창 닫기를 서버 세션 철회로 기록하지 않는다. [S4], [A2] |

Google `Branding > Authorized domains`는 승인된 리디렉션 URI와 다른 항목이다. 공식 문서는 사용하는 도메인을 미리 등록하도록 안내하며, 검증 신청 시 도메인 소유 확인을 요구한다. 사용자 콘솔이 실제로 요구하는 입력·검증 여부는 **미확인**이다. 해당 화면에서 막히면 요구 문구와 입력한 호스트만 기록하고 보류하며, 소유하지 않은 도메인을 소유했다고 제출하지 않는다. 이번 기본 범위 테스트의 검증 면제와 운영 브랜드 검증을 혼동하지 않는다. [G5], [G3]

**합계 29분은 조건부 계획**이다. 특히 4단계 이후 Google 설정 전파가 늦으면 30분 내 두 로그인 완료를 판정할 수 없다. 30분이 되면 성공한 제공자와 실패·대기 중인 단계를 분리해 기록한다. 시간 초과만으로 “커스텀 도메인이 필요하다”거나 “로그인이 불가능하다”고 결론 내리지 않는다. [G4]

K-10의 이번 실증 완료 기준은 **GitHub·Google 각각 새 로그인 → 같은 소유자의 실제 `.vercel.app` 페이지 도착 → 토큰 반환 확인**이다. 로컬만 성공한 경우에는 “커스텀 도메인 없는 로컬 반환 확인, Vercel 반환 미확인”으로 기록한다. 앱의 게시 흐름·계정 연결·로그아웃·세션 갱신·K-2 행동 이벤트는 PRD 이후 구현 검증으로 남긴다.

## 4. 출처와 확인 범위

아래는 전부 서비스 제공자의 공식 문서 또는 Supabase 공식 저장소다. 확인한 것은 공개 문서의 내용이며 로그인 성공 증거가 아니다. Supabase 변경 기록도 확인했으며 이번에 쓰는 클라우드 제공자 로그인을 막는 변경은 조사 범위에서 찾지 못했다([변경 기록](https://supabase.com/changelog.md), 2026-09-27 00:24 KST). 공개 페이지의 402·403 차단은 발생하지 않아 `insane-search` 우회 실행은 필요하지 않았다.

| 표기 | 공식 URL | 확인 시각(KST) |
|---|---|---|
| S1 | [Supabase Redirect URLs][S1] | 2026-09-27 00:23 |
| S2 | [Supabase GitHub 제공자][S2] | 2026-09-27 00:23 |
| S3 | [Supabase Google 제공자][S3] | 2026-09-27 00:23~00:24 |
| S4 | [Supabase Implicit flow][S4] | 2026-09-27 00:23~00:24 |
| S5 | [Supabase 프로젝트 생성 안내][S5] | 2026-09-27 00:24~00:25 |
| S6 | [Supabase 사용자 조회][S6] | 2026-09-27 00:25 |
| S7 | [Supabase PKCE flow][S7] | 2026-09-27 00:33 |
| A1 | [Supabase Auth의 authorize·callback API 명세][A1] | 2026-09-27 00:24 |
| A2 | [Supabase Auth README: SITE_URL·URI_ALLOW_LIST·authorize·callback][A2] | 2026-09-27 00:24 |
| A3 | [Supabase의 표준 authorize 주소 안내][A3] | 2026-09-27 00:24 |
| H1 | [GitHub OAuth App 생성][H1] | 2026-09-27 00:23~00:24 |
| H2 | [GitHub OAuth App 콜백 규칙][H2] | 2026-09-27 00:24 |
| G1 | [Google 웹 서버 OAuth·리디렉션 규칙][G1] | 2026-09-27 00:23~00:24 |
| G2 | [Google 대상 사용자·게시 상태·기본 범위 예외][G2] | 2026-09-27 00:24 |
| G3 | [Google 검증 면제][G3] | 2026-09-27 00:24~00:25 |
| G4 | [Google OAuth 클라이언트·설정 전파 시간][G4] | 2026-09-27 00:26 |
| G5 | [Google 브랜드 설정·검증][G5] | 2026-09-27 00:24~00:25 |
| G6 | [Google 데이터 접근 범위][G6] | 2026-09-27 00:24~00:25 |
| G7 | [Google Auth Platform 최초 설정·지원 이메일][G7] | 2026-09-27 00:24 |
| V1 | [Vercel 기본 도메인][V1] | 2026-09-27 00:24~00:25 |
| V2 | [Vercel Drop 정적 파일 배포][V2] | 2026-09-27 00:25~00:26 |
| V3 | [Vercel Deployment Protection][V3] | 2026-09-27 00:25 |
| P1 | [Python 임시 HTTP 서버 명령][P1] | 2026-09-27 00:24~00:25 |

[S1]: https://supabase.com/docs/guides/auth/redirect-urls
[S2]: https://supabase.com/docs/guides/auth/social-login/auth-github
[S3]: https://supabase.com/docs/guides/auth/social-login/auth-google
[S4]: https://supabase.com/docs/guides/auth/sessions/implicit-flow
[S5]: https://supabase.com/docs/guides/auth/quickstarts/react
[S6]: https://supabase.com/docs/guides/auth/managing-user-data
[S7]: https://supabase.com/docs/guides/auth/sessions/pkce-flow
[A1]: https://github.com/supabase/auth/blob/master/docs/oauth.go
[A2]: https://github.com/supabase/auth/blob/master/README.md
[A3]: https://supabase.com/docs/guides/auth/custom-oauth-providers#user-sign-in
[H1]: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
[H2]: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#redirect-urls
[G1]: https://developers.google.com/identity/protocols/oauth2/web-server
[G2]: https://support.google.com/cloud/answer/15549945?hl=en
[G3]: https://support.google.com/cloud/answer/13464323/
[G4]: https://support.google.com/cloud/answer/15549257
[G5]: https://support.google.com/cloud/answer/15549049
[G6]: https://support.google.com/cloud/answer/15549135
[G7]: https://support.google.com/cloud/answer/15544987?hl=en
[V1]: https://vercel.com/docs/domains/working-with-domains
[V2]: https://vercel.com/docs/drop
[V3]: https://vercel.com/docs/deployment-protection
[P1]: https://docs.python.org/3/library/http.server.html#command-line-interface

## 5. 실행 결과 기록표

사용자 실행 전에는 결과·시각·비고를 비워 둔다. 비고에는 `Vercel/로컬`, 토큰 값이 없는 목적지, 오류명, 대기 사유만 적는다. 시각은 KST이며 `access_token`·`refresh_token`·`provider_token`·Client Secret의 실제 값은 기록하지 않는다.

| 단계 | 결과 | 시각(KST) | 비고 |
|---|---|---|---|
| 0. 계정·권한 준비 | | | |
| 1. Supabase 프로젝트·콜백 확인 | | | |
| 2. 임시 도착 페이지 | | | |
| 3. GitHub OAuth App | | | |
| 4. Google 동의 화면·OAuth 클라이언트 | | | |
| 5. Supabase 제공자 활성·저장 | | | |
| 6. Site URL·Redirect URLs | | | |
| 7. GitHub 로그인·토큰 반환 | | | |
| 8. Google 로그인·토큰 반환 | | | |
| 9. 기록·정리 | | | |
| 총 소요시간·외부 대기시간 | | | |
| K-10 판정: Vercel에서 두 제공자 확인 | | | |
