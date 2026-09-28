# Triage Labels

기본 triage 역할과 이 저장소에서 사용할 문자열은 다음과 같다. 로컬 Markdown 이슈에서는 해당 문자열을 `Status:` 값으로 기록한다.

| 스킬의 역할 | 이 저장소의 문자열 | 의미 |
| --- | --- | --- |
| `needs-triage` | `needs-triage` | 관리자의 이슈 검토가 필요함 |
| `needs-info` | `needs-info` | 제보자의 추가 정보를 기다리는 중 |
| `ready-for-agent` | `ready-for-agent` | 명세가 충분하여 에이전트가 자율 구현할 수 있음 |
| `ready-for-human` | `ready-for-human` | 사람의 구현이 필요함 |
| `wontfix` | `wontfix` | 처리하지 않기로 결정함 |

스킬이 triage 역할을 지정하면 표의 대응 문자열을 사용한다. 용어를 바꾸려면 이 문서의 두 번째 열을 수정한다.

wayfinder 티켓의 진행 상태는 [issue-tracker.md](issue-tracker.md)의 `Wayfinding operations`를 따른다.
