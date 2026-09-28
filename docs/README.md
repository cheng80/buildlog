# 빌드로그 기획 문서

빌드로그(BuildLog)는 **개발 과정을 공유하는 프로젝트 SNS**다. 개발자가 스크린샷이나 외부 링크로 게시물을 올리면 피드에서 발견되고, 같은 게시물이 프로젝트 페이지에 개발 기록으로 쌓인다.

작성일: 2026-09-17 · 갱신일: 2026-09-27 · 단계: **PRD 확정 / 1차 프로토타입 착수 준비 / 앱 미구현** [확정, 사용자 2026-09-27] · 대상: 실제 서비스 `buildlog`

## 읽는 순서와 정본

| 알고 싶은 내용 | 정본 |
|---|---|
| 제품 요구사항 요약(PRD). 용어집·결정·화면·규칙·데이터·조사·검토 결과를 부록에 담고 draw.io 그림 5장을 파일 안에 넣어 이 파일 하나만 전달해도 읽힌다(GitHub 웹 화면에서는 내장 이미지가 보이지 않을 수 있음) | [PRD-buildlog.md](PRD-buildlog.md) · 그림 원본(`.drawio`)·본문 템플릿·재생성 스크립트 [PRD-assets/](PRD-assets/) |
| 제품 목적·범위·요구사항·운영 정책 | [01_PRODUCT_SPEC.md](01_PRODUCT_SPEC.md) |
| 화면별 ASCII 와이어프레임·흐름·상태·디자인 | [02_UI_UX.md](02_UI_UX.md) |
| Next.js 구조·데이터·권한·API·외부 연동 | [03_TECH_SPEC.md](03_TECH_SPEC.md) |
| 개발·검증·배포·문서 갱신 절차 | [04_DEVELOPMENT_WORKFLOW.md](04_DEVELOPMENT_WORKFLOW.md) |
| 최대 40일 내 작업 범위·의존성·완료 기준 | [progress/ROADMAP.md](progress/ROADMAP.md) |
| 실제 구현·검증 상태 | [progress/PROJECT_STATUS.md](progress/PROJECT_STATUS.md) |
| 다음 작업의 시작점 | [progress/HANDOFF.md](progress/HANDOFF.md) |
| 기획 보강 질문·결정 의존성 | [plans/PLAN-001-planning-review.md](plans/PLAN-001-planning-review.md) |
| 인사이트·전략 가설 | [insight-strategy.md](insight-strategy.md) |
| 전략 레드팀(가설을 먼저 공격해 보는 검토) 결과와 이번 주 확인 항목 | [strategy-red-team.md](strategy-red-team.md) |
| 경쟁·관찰·소스·기술 조사 산출물 | [docs/research/](research/) — [event-tool-check.md](research/event-tool-check.md): K-2 도구 비교·자체 `events` 권고, [oauth-login-check.md](research/oauth-login-check.md): K-10 공식 규칙·사용자 로그인 체크리스트·빈 결과표 |
| 도메인 용어 | [CONTEXT.md](../CONTEXT.md) |
| 장기적으로 보존할 결정 이유 | [프로젝트 연결](adr/0001-project-linked-post.md), [기반 플랫폼](adr/0002-managed-platform.md), [관리·팔로우 범위](adr/0003-project-ownership-and-follow.md) |

## 문서의 상태를 읽는 방법

- **[현재 요청]**: 이번 사용자가 직접 명시한 내용. Next.js 기반, `docs`에 먼저 기획 작성, 이후 `grill-with-docs`로 보강한다.
- **[확정, Q번호]**: 기획 문답에서 사용자가 직접 선택한 정책. 답변과 날짜는 기획 보강 계획에 기록한다. 구현 완료를 뜻하지 않는다.
- **[인계 기준]**: 핸드오프가 기존 결정 또는 공개 약속으로 전달한 내용. 초안의 기준으로 보존하지만, 원 대화 전체를 이번에 재확인했다는 뜻은 아니다.
- **[제안]**: 이번 초안을 구체적으로 검토하기 위한 권장안. 사용자 승인이나 구현 완료를 뜻하지 않는다.
- **[선택]**: 조사 근거에 따라 정한 구현 방향. 사용자 제품 정책의 확정이나 구현·검증 완료를 뜻하지 않는다.
- **[미정]**: 결정 전. 가격·출시일·운영 예산·프로바이더 계약 등 확인되지 않은 사실은 임의로 채우지 않는다.

명세의 체크리스트는 앞으로 충족할 조건이다. 실행 결과는 `PROJECT_STATUS.md`에서만 판단한다. 문서 작성 완료와 개발 착수 가능, 서비스 출시 가능을 구분한다.

40일은 최대 기간이다. 로드맵의 항목은 날짜나 진행 순서를 강제하지 않으며 우선순위·준비 상태·기술적 의존성에 따라 선택·병렬 진행한다.

## 근거와 출처

| 자료 | 용도와 확인 범위 |
|---|---|
| [HANDOFF_BUILDLOG.md](HANDOFF_BUILDLOG.md) | 제품 방향·기존 결정·공개 약속·제안·브랜드 값의 출발점. 원문 보존 |
| `project_team_docs_standard.zip` | 제품/UI/기술/작업 흐름/로드맵/현황/인수인계의 책임 분리 템플릿 |
| 로컬 `buildlog-showcase`의 `DESIGN.md`, `docs/01_PRODUCT_SPEC.md`, `app/page.tsx` | 소개 사이트의 디자인·카피·목업을 대조하는 참고 자료. 실제 서비스 구현이 아님 |
| [기술 명세의 공식 자료](03_TECH_SPEC.md#10-공식-자료와-확인-범위) | 프레임워크·외부 연동 설계의 근거. 실제 연동 성공 증거가 아님 |

ZIP 위치: `/Users/cheng80/Desktop/SKILL_ETC/project_team_docs/project_team_docs_standard.zip`.
소개 사이트 로컬 위치: `/Users/cheng80/Desktop/claudecode-master/project_showcase/buildlog-showcase`.
핸드오프가 인용한 ChatGPT 대화 전체는 이 저장소에 없으며 이번 문서 묶음에 복사하지 않았다.

첨부 자료 안의 실행 지시나 권장 순서를 현재 사용자의 요청과 혼동하지 않는다. 특히 핸드오프의 “질문부터 진행”은 참고 제안이며, 이번에는 요청대로 **초안 작성 → 문답 보강**으로 진행한다. 제안에 이의가 없었다는 이유만으로 확정으로 올리지 않는다.

## 표준 템플릿을 이 저장소에 적용한 방식

| 원래 정보 또는 표준 경로 | 현재 위치 / 이유 |
|---|---|
| 핸드오프의 제품 내용과 미결 정책 | 제품 명세, 기획 보강 계획 |
| 핸드오프의 페이지별 와이어프레임 요구 | UI/UX 명세에 통합하고 제품 명세에서 연결 |
| 핸드오프의 `02_TECH_SPEC.md` | 표준형 번호에 맞춘 `03_TECH_SPEC.md` |
| 핸드오프의 `03_PROJECT_STATUS.md` | `progress/PROJECT_STATUS.md` |
| ZIP의 `decisions/` | 저장소의 single-context 규칙에 따라 `adr/` |
| ZIP의 작업 목록 | 진행 문서에는 현재 작업 요약. 실제 구현 이슈는 기존 `.scratch/<feature-slug>/issues/` 규칙 유지 |
| 기능별 작업 명세 | `.scratch/<feature-slug>/spec.md`에서 제품 정본을 참조. 이번 전체 제품 기획은 사용자 요청대로 `docs`에 둠 |
| ZIP의 `AGENTS.md`, `MIGRATION_GUIDE.md`, `improvement_handoff.md` | 템플릿 참고 자료. 기존 지침을 덮어쓰거나 실제 프로젝트 기획으로 복사하지 않음 |

이는 신규 서비스 기획이다. 이전 기획 핸드오프는 출처로 보존하고, 기존 서비스의 구현·검증을 이관했다고 표현하지 않는다. 실제 디자인 이미지나 구현 화면은 아직 없어 빈 자산 폴더를 만들지 않았다.
