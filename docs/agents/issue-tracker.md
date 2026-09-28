# Issue tracker: Local Markdown

이 저장소의 이슈와 명세는 `.scratch/` 아래 Markdown 파일로 관리한다.

## 파일 규칙

- 기능별 디렉터리: `.scratch/<feature-slug>/`
- 명세: `.scratch/<feature-slug>/spec.md`
- 구현 이슈: `.scratch/<feature-slug>/issues/<NN>-<slug>.md`. 티켓마다 파일 하나를 만들고, 번호는 `01`부터 의존 작업이 먼저 오도록 부여한다.
- 이슈 상단의 `Status:` 줄에 triage 상태를 기록한다. 역할별 문자열은 [triage-labels.md](triage-labels.md)를 따른다. `**Status:**`처럼 Markdown 강조를 사용한 줄도 같은 필드로 읽는다.
- 댓글과 대화 이력은 파일 하단의 `## Comments` 아래에 추가한다.

## 이슈 트래커에 게시할 때

명세는 `spec.md`에, 구현 이슈는 `issues/<NN>-<slug>.md`에 작성한다. 필요한 디렉터리는 게시 시 생성한다.

## 관련 티켓을 조회할 때

전달받은 경로의 파일을 읽는다. 번호만 전달받으면 해당 기능의 `issues/`에서 찾고, 여러 기능에 같은 번호가 있으면 기능이나 경로를 확인한다.

## Wayfinding operations

`/wayfinder`는 진행 지도와 판단할 질문을 다음 파일로 관리한다.

- **Map**: `.scratch/<effort>/map.md`. 본문에 `Notes`, `Decisions-so-far`, `Fog`를 기록한다.
- **Child ticket**: `.scratch/<effort>/issues/<NN>-<slug>.md`. 번호는 `01`부터 부여하고 본문에 질문을 적는다. `Type:`은 `research`, `prototype`, `grilling`, `task` 중 하나다.
- **상태**: wayfinder 티켓의 `Status:`는 `open`, `claimed`, `resolved`를 사용한다. 이 값은 일반 이슈의 triage 분류와 구분되는 작업 진행 상태다.
- **Blocking**: 상단의 `Blocked by: NN, NN`에 선행 티켓 번호를 기록한다. 의존성이 없으면 `Blocked by: None`으로 표시한다. 모든 선행 티켓이 `resolved`이면 진행할 수 있다.
- **Frontier**: 해당 `issues/`에서 `open` 상태이고 모든 의존성이 해소된 티켓을 찾는다. 번호가 가장 작은 티켓을 먼저 선택한다.
- **Claim**: 작업을 시작하기 전에 `Status: claimed`로 저장한다.
- **Resolve**: `## Answer` 아래에 답을 추가하고 `Status: resolved`로 바꾼다. 이어서 `map.md`의 `Decisions-so-far`에 답의 요약과 티켓 링크를 추가한다.
