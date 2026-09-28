# 저장소 작업 지침

한국어로 간결하게 답변한다. 결과를 먼저 제시하고 필요한 설명과 검증 결과를 덧붙인다. 코드 식별자·경로·명령어는 원문을 유지한다.

- 실행 요청은 승인된 범위의 구현·실행·결과 확인·발견한 문제 수정을 마칠 때까지 진행한다. 중간 구현을 최종 결과로 제출하지 않는다.
- 일상적인 판단과 되돌릴 수 있는 로컬 작업은 자율적으로 진행한다. 중요한 정보나 추가 승인이 필요하면 진행 가능한 준비를 마친 뒤 구체적으로 묻는다. 이미 받은 승인은 반복 확인하지 않는다.
- 기존 구현과 도구로 요구사항을 충족하는 가장 단순한 해결책을 선택한다.
- 독립 작업의 병렬 위임과 작업에 맞는 모델·추론 수준 선택을 명시적으로 허용한다. 작은 작업은 직접 처리한다. 현재 도구가 지원하는 모델을 사용하고, 인증·사용량 실패 시 같은 호출을 반복하지 않는다.
- 커밋·push·PR·merge·원격 상태 변경은 사용자가 요청한 범위에서 수행한다. 커밋 메시지와 PR은 한국어로 작성한다. 사용자 변경과 미반영 작업을 보존한다.

## Agent skills

### Issue tracker

이슈와 명세는 `.scratch/<feature-slug>/`의 로컬 Markdown으로 관리한다. 생성·조회·갱신 전 `docs/agents/issue-tracker.md`를 읽는다.

### Triage labels

기본 triage 역할 5개를 그대로 사용한다. 이슈를 분류하거나 상태를 변경할 때 `docs/agents/triage-labels.md`를 읽는다.

### Domain docs

도메인 문서는 루트 `CONTEXT.md`와 `docs/adr/`를 사용하는 `single-context` 구성이다. 코드베이스 탐색 전 `docs/agents/domain.md`를 읽는다.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
