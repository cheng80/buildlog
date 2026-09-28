# 제작자 반복 게시: 인터뷰 대체 공개 관찰

작성일: 2026-09-26 · 상태: **공개 관찰 + [제안]·[미정] / 제품 결정 아님 · 재시도 보완 2026-09-26**

출시 전 인터뷰가 불가능하다는 2026-09-26 사용자 결정을 전제로 K-1·K-6·K-9·K-11을 공개 자료와 출시 후 행동으로 나눠 확인한다. 인터뷰를 실행 대안으로 제안하지 않는다. [제품 명세 §2](../01_PRODUCT_SPEC.md#2-문제가치목표), [전략 레드팀](../strategy-red-team.md), [용어집](../../CONTEXT.md)을 따른다. Q1~Q14와 ADR-0001~0003의 결정을 변경하지 않는다.

**현재 확인된 범위:** 최신 목록에서 제작자 반복 게시는 보였으나 같은 프로젝트의 연재 지속·중단 원인은 확인하지 못했다. 개발 게시물을 만드는 수고에 관한 공개 발언은 있으나, 긴 글 쓰기라는 특정 문제의 중요도·만족도나 빌드로그의 수요를 입증하지 않는다. 외부 링크와 알림 기능의 존재도 실제 공유 전환·재방문 효과와 구분한다.

## 수집 규칙과 한계

- 로그인·게시·팔로우·구독 신청 없이 공개 자료만 읽었다. 원문 전문·실명·이메일은 이 문서에 보관하지 않으며 식별에는 공개 URL과 핸들만 쓴다.
- B1은 `Most recent`의 첫 30건, B2는 검색으로 찾은 관련 자료 6건, B3은 16개 공개 단위다. B3의 itch.io 5건은 B1을 재사용한다. 목록 전수 수집이나 무제한 페이지 순회는 하지 않았다.
- 표본은 접근 가능한 편의 표본이다. 작성자를 빌드로그 잠재 사용자로 단정하지 않고 국내 제작자·전체 서비스의 대표성, 유지율, 인과를 주장하지 않는다.
- 확인 시각은 모두 KST다. 표의 공통 시각은 해당 표의 각 행에 적용한다. `게시일`은 원문/RSS 또는 검색 발췌가 표시한 날짜이며, 확인일과 구분한다. 웹 도구 관찰은 로컬 확인 구간으로 기록했으며, 정확한 게시일을 확보하지 못한 R6은 미확인으로 남겼다.
- `원문 확인`과 `검색 발췌만 확인`을 분리한다. 후자는 원문의 현재 상태·전체 문맥을 확인한 증거로 쓰지 않으며 B6에서 별도 집계한다. 원문 직접 인용 없이 짧게 의역했다.

## B1. K-1 — 최근 게시 횟수와 반응 표시

**표본 n=30개 게시물, 24개 제작자 핸들, 30개 프로젝트.** 목록: [itch.io devlogs](https://itch.io/devlogs)에서 발견한 [Most recent](https://itch.io/devlogs/most-recent)의 첫 30개 `.blog_post`. 확인: **2026-09-26 22:48:43 KST**. 새로고침이나 다음 페이지를 합쳐 표본을 늘리지 않았다. 기본 목록은 `New and popular`이므로 최신순 표본으로 쓰지 않았다.

`최근 게시 횟수`는 **이 30건 안에서 동일 서브도메인 핸들이 나온 횟수**다. 프로젝트 전체 이력이나 최근 6개월의 횟수가 아니다. 계정을 사람 수로 바꾸지 않는다.

| 표본 안 제작자별 게시 횟수 | 핸들 수 | 해당 게시물 수 | 근거 |
|---|---:|---:|---|
| 1회 | 22 | 22 | 아래 원장 중 `boo64`, `g-and-t` 외 |
| 2~3회 | 1 | 2 | `boo64` (I07, I10) |
| 4회 이상 | 1 | 6 | `g-and-t` (I15~I19, I23) |
| 합계 | 24 | 30 | 표본 원장 I01~I30 |

같은 프로젝트 URL로 묶으면 **1회 30개 / 2~3회 0개 / 4회 이상 0개**다. 여러 프로젝트에 한 번씩 올린 계정을 같은 프로젝트의 연재로 계산하지 않는다. 따라서 K-1의 “두 번째 게시가 지속된다”는 가설은 **[미정]**이다. 이번 짧은 목록 창 밖의 과거 글·삭제 글·비공개 글은 보지 않았으므로 1회 관찰을 연재 중단으로 해석할 수 없다.

**같은 목록 화면의 반응 표시(n=30, 위 시각·목록 URL):** 제목 옆에 좋아요는 하트 아이콘과 숫자(`post_likes`, `title="1 like"`), 댓글은 말풍선 아이콘과 숫자(`post_comments`, `title="1 comment"`)로 표시됐다. I14·I20·I25에는 각각 좋아요 1이 보였고 I25에는 댓글 1도 보였다. 나머지는 해당 숫자 요소가 없었다. **미표시를 반응 0으로 치환하지 않는다.** 댓글 본문은 목록에 펼쳐지지 않고 게시물 상세에서 확인하는 구조였다.

### B1 표본 원장

각 행은 게시물 1건이다. 확인 시각은 전 행 **2026-09-26 22:48:43 KST**, 공통 목록 URL은 위 `Most recent`다. 프로젝트는 게시물 URL의 `/devlog/` 앞부분으로 식별한다. 제목의 연재 번호는 게시 횟수로 사용하지 않았다.

| ID | 제작자 핸들 | 프로젝트 식별자 | 확인 게시물 URL | 목록 반응 |
|---|---|---|---|---|
| I01 | `nerdofalltrades505` | `the-headless-horseman-wants-a-date` | [게시물](https://nerdofalltrades505.itch.io/the-headless-horseman-wants-a-date/devlog/1678042/devlog-5-14) | 숫자 미표시 |
| I02 | `king100ton` | `sweet-home-neogeo` | [게시물](https://king100ton.itch.io/sweet-home-neogeo/devlog/1678040/enemy-sprites-0926) | 숫자 미표시 |
| I03 | `maccawtpi` | `overtime` | [게시물](https://maccawtpi.itch.io/overtime/devlog/1678038/v102-release-notes) | 숫자 미표시 |
| I04 | `oreiluiz` | `crop-guardian` | [게시물](https://oreiluiz.itch.io/crop-guardian/devlog/1678037/novos-inimigos-novas-plantas-monstruosas-e-o-caminho-para-o-deserto-) | 숫자 미표시 |
| I05 | `daf1` | `asiden` | [게시물](https://daf1.itch.io/asiden/devlog/1678035/your-companion-your-controls-customisation-editable-memory) | 숫자 미표시 |
| I06 | `ryanpond` | `detour` | [게시물](https://ryanpond.itch.io/detour/devlog/1678033/day-6-how-i-balanced-fuel-and-difficulty-without-adding-more-features) | 숫자 미표시 |
| I07 | `boo64` | `red-forest` | [게시물](https://boo64.itch.io/red-forest/devlog/1678032/developer-blog-red-forest-a-new-direction) | 숫자 미표시 |
| I08 | `yummypotato99` | `doodle-towers` | [게시물](https://yummypotato99.itch.io/doodle-towers/devlog/1678031/v051-to-v053-patch-notes) | 숫자 미표시 |
| I09 | `gaborkepes` | `deodatos-dilemma` | [게시물](https://gaborkepes.itch.io/deodatos-dilemma/devlog/1678030/surprise-minigame-for-swtpc-cannibal-holocaust) | 숫자 미표시 |
| I10 | `boo64` | `ailurophile` | [게시물](https://boo64.itch.io/ailurophile/devlog/1678025/i-made-a-horror-game-in-space-where-something-can-hear-you-breathe) | 숫자 미표시 |
| I11 | `kiro-ramy-entertainments` | `barney-error-1-remastered` | [게시물](https://kiro-ramy-entertainments.itch.io/barney-error-1-remastered/devlog/1678026/1500-downloads-appreciation) | 숫자 미표시 |
| I12 | `projekt-mueller` | `exclusion-zone-eg-71` | [게시물](https://projekt-mueller.itch.io/exclusion-zone-eg-71/devlog/1678024/v03-out-now) | 숫자 미표시 |
| I13 | `lemon64k` | `the-chirping-of-the-birdsil-cinguettio-degli-uccelli` | [게시물](https://lemon64k.itch.io/the-chirping-of-the-birdsil-cinguettio-degli-uccelli/devlog/1678022/trailer-delay) | 숫자 미표시 |
| I14 | `alternalo` | `alterworld` | [게시물](https://alternalo.itch.io/alterworld/devlog/1678021/masterworking-crit-builds-weapons-and-other-changes) | 1 like |
| I15 | `g-and-t` | `retro-electronics-lab-free-sfx` | [게시물](https://g-and-t.itch.io/retro-electronics-lab-free-sfx/devlog/1678020/six-free-retro-electronic-sounds-for-your-next-project) | 숫자 미표시 |
| I16 | `g-and-t` | `kons-first-ship` | [게시물](https://g-and-t.itch.io/kons-first-ship/devlog/1678019/set-sail-with-kons-first-ship-five-retro-rpg-themes) | 숫자 미표시 |
| I17 | `g-and-t` | `ghost-in-the-log` | [게시물](https://g-and-t.itch.io/ghost-in-the-log/devlog/1678018/meet-ghost-in-the-log-five-songs-from-a-fracturing-ai) | 숫자 미표시 |
| I18 | `g-and-t` | `coffee-corner` | [게시물](https://g-and-t.itch.io/coffee-corner/devlog/1678017/meet-coffee-corner-a-small-cafe-setup-in-three-palettes) | 숫자 미표시 |
| I19 | `g-and-t` | `celestial-cafe-set` | [게시물](https://g-and-t.itch.io/celestial-cafe-set/devlog/1678016/meet-the-celestial-cafe-set-three-little-cups-three-moods) | 숫자 미표시 |
| I20 | `oddengine` | `battlebottactics` | [게시물](https://oddengine.itch.io/battlebottactics/devlog/1678010/big-update-new-garage-new-arena-new-look) | 1 like |
| I21 | `weirdowl` | `space-beads-the-spincher` | [게시물](https://weirdowl.itch.io/space-beads-the-spincher/devlog/1678007/levelmaker-open-your-levels-can-ship-in-the-next-build) | 숫자 미표시 |
| I22 | `dionous` | `deep-siren` | [게시물](https://dionous.itch.io/deep-siren/devlog/1678006/bugfix-update) | 숫자 미표시 |
| I23 | `g-and-t` | `retro-electronics-lab` | [게시물](https://g-and-t.itch.io/retro-electronics-lab/devlog/1678004/now-with-a-quick-demo-free-sfx-mini-pack) | 숫자 미표시 |
| I24 | `elushis` | `cielchan-desktop-ai-companion` | [게시물](https://elushis.itch.io/cielchan-desktop-ai-companion/devlog/1677977/v190-released-webcam-presence-better-conversations-connection-improvements) | 숫자 미표시 |
| I25 | `timezonitch` | `bush-cutter-simulator` | [게시물](https://timezonitch.itch.io/bush-cutter-simulator/devlog/1678001/rumor-bush-cutter-remastered-in-the-making) | 1 like · 1 comment |
| I26 | `yuzukigamestudio` | `feastfall` | [게시물](https://yuzukigamestudio.itch.io/feastfall/devlog/1677998/-feastfall-hotfix-219-growth-fixed) | 숫자 미표시 |
| I27 | `dsavioni` | `lighttreefm` | [게시물](https://dsavioni.itch.io/lighttreefm/devlog/1669825/new-autumn-release-out-now-) | 숫자 미표시 |
| I28 | `ditoness` | `dummy-bricks-npcs-in-brickbattles` | [게시물](https://ditoness.itch.io/dummy-bricks-npcs-in-brickbattles/devlog/1677997/small-patch-upd-1) | 숫자 미표시 |
| I29 | `jeremycouillard` | `soul-injector-commando` | [게시물](https://jeremycouillard.itch.io/soul-injector-commando/devlog/1677996/sic-update-1) | 숫자 미표시 |
| I30 | `dmzemo` | `somnia` | [게시물](https://dmzemo.itch.io/somnia/devlog/1677994/v-280-v-300) | 숫자 미표시 |

## B2. K-1 — 중단·지속 부담의 정성 자료

**수집 n=6개 관련 스레드, 원문 확인 2개 + 검색 발췌만 확인 4개.** 스레드마다 핵심 발언 한 단위만 코딩한다. 댓글 여러 개를 별도 제작자로 부풀리지 않는다. 직접 중단 경험, 작성 고민, 독자의 관찰을 구분한다. 최대 15건 안에서 종료했으며 한국어 검색에서 적합한 중단 경험을 확인하지 못했다는 사실을 국내 사례가 없다는 뜻으로 해석하지 않는다.

검색어: `devlog 그만둔 이유`, `개발로그 연재 중단`, `stopped writing devlog`, `stopped devlogs`, `why I quit posting devlogs` 계열 및 r/gamedev·r/IndieDev·GeekNews·디스콰이엇 한정 검색. 채택 자료는 r/gamedev에 편중됐다. 유튜브 영상·자막은 수집하지 않았다.

| ID | 확인 URL·자료 위치 | 게시일 | 확인 시각 KST | 한 줄 요지 | 분류 [제안] | 확인 수준·적용 한계 |
|---|---|---|---|---|---|---|
| R1 | [6개월간 devlog를 못 올린 고민](https://www.reddit.com/r/gamedev/comments/f6599l/) · [RSS](https://www.reddit.com/r/gamedev/comments/f6599l.rss) | 2020-02-19 | 2026-09-26 22:48:54 | 개발과 일상 사진 공유는 계속하지만 누적 변경을 적당한 길이의 영상으로 압축하지 못해 다음 편을 미룬다고 설명한다. | 시간·수고 | RSS 원문 확인; 영상 연재 지연이며 프로젝트 중단이 아님 |
| R2 | [개발과 devlog 작업 분리 질문의 댓글](https://www.reddit.com/r/gamedev/comments/13uqtur/how_do_you_make_devlogs_without_distracting/jm1yufa/) · [스레드 RSS](https://www.reddit.com/r/gamedev/comments/13uqtur.rss) | 2023-05-29 | 2026-09-26 22:50:50 | 게임 완성에 쓸 시간이 제한돼 devlog를 만들지 않는 선택을 했다고 설명한다. | 시간·수고 | RSS 원문 확인; 미제작 선택이며 연재하다 중단했는지는 불명 |
| R3 | [Gamedev Logs and Why You Should Use Them의 중단 댓글](https://www.reddit.com/r/gamedev/comments/m246n2) | 2021-03-10 | 2026-09-26 22:47:48 | 영상에 드는 시간에 비해 도달·관심이 작아 devlog를 그만두고 결과물을 먼저 만들기로 했다는 발언이다. | 반응 없음 | 검색 발췌만 확인; 분류명은 ‘낮은 반응’ 포함이며 실제 반응 0을 뜻하지 않음; 시간·수고도 동반 언급 · → 재시도 보완 절 참조 |
| R4 | [A short Youtube career in a 3 year project](https://www.reddit.com/r/gamedev/comments/1bl4psq) | 2024-03-22 | 2026-09-26 22:47:48 | 유튜브 활동 계획을 재고해 멈췄으며 자신을 촬영하거나 음성·대사를 녹음하는 어려움을 설명한다. | 시간·수고 | 검색 발췌만 확인; 모든 중단 이유나 결과를 확보한 것은 아님 · → 재시도 보완 절 참조 |
| R5 | [To Devlog Or Not?의 제작 부담 논의](https://www.reddit.com/r/gamedev/comments/1dtrgxc) | 2024-07-02 | 2026-09-26 22:47:48 | 영상 제작·편집은 부담이라는 의견과 텍스트 기록은 상대적으로 적은 수고로 가능하다는 반대 근거가 함께 보인다. | 시간·수고 | 검색 발췌만 확인; 실제 연재 중단 사례로 세지 않음 · → 재시도 보완 절 참조 |
| R6 | [출시 때 devlog 갱신을 요청한 독자 글](https://www.reddit.com/r/gamedev/comments/dnxf3r) | 미확인(검색 결과에는 약 6.9년 전) | 2026-09-26 22:47~22:49 | devlog 주소 변경과 갱신 누락으로 기존 구독자가 출시 소식을 놓치는 경험을 설명한다. | 기타 | 검색 발췌만 확인; 제작자의 중단 이유가 아닌 독자 관찰 · → 재시도 보완 절 참조 |

### B2 건수 표

분류는 확인된 발언의 주제를 정리한 **[제안] 코딩**이다. 1개 스레드에 주분류 1개만 부여했다. 발언의 진실성·전체 이용자의 비율을 검증한 값이 아니다.

| 주분류 | 원문 확인 n=2 | 검색 발췌만 n=4 | 전체 관련 자료 n=6 | 해당 ID |
|---|---:|---:|---:|---|
| 반응 없음(낮은 반응 포함) | 0 | 1 | 1 | R3 |
| 시간·수고 | 2 | 2 | 4 | R1, R2, R4, R5 |
| 프로젝트 중단 | 0 | 0 | 0 | 없음 |
| 기타 | 0 | 1 | 1 | R6 |
| 합계 | 2 | 4 | 6 | R1~R6 |

**[미정]** 반응 부족과 제작 수고 중 어느 쪽이 더 중요한지는 이 표로 정하지 않는다. R3처럼 두 이유가 한 발언에 섞일 수 있고, 질문·미제작 선택·독자 관찰도 포함돼 있다. 특히 R5의 텍스트 기록에 대한 반대 근거를 함께 남긴다. 숫자가 안 보이는 목록과 낮은 반응 때문에 중단했다는 발언은 서로 다른 관찰이다.

접근 기록: 일부 Reddit URL의 일반 열기는 `Cache miss`, `insane-search`의 RSS는 일부 성공 후 429, JSON 경로는 403이었다. HTML 200·`weak_ok`에서도 실제 글 본문이 검증되지 않은 경우 원문 확인으로 올리지 않았다. 모바일 경로와 `old.reddit.com`의 본문 선택자 검증도 시도했으나 해당 본문을 얻지 못했다. 세션 브라우저 폴백은 Chrome·IAB 모두 `Browser is not available`이어서 추가 확인 수단이 없었다(2026-09-26 22:50~22:55 KST). **접근 경로가 영구히 막혔다는 결론이 아니라 이번 세션의 원문 확인 한계**다. R3~R6의 해석은 이 한계를 유지한다.

## B3. K-6 — 외부 프로젝트 링크를 놓는 위치

**표본 n=16:** Show HN 10건 + B1의 itch.io I01~I05 재사용 5건 + 디스콰이엇 프로젝트 소개 1건. HN 목록은 [showstories.json](https://hacker-news.firebaseio.com/v0/showstories.json)의 첫 10개 ID를 [item API](https://hacker-news.firebaseio.com/v0/item/49845172.json)로 읽었다. 확인: **2026-09-26 22:48:43 KST**. 이는 현재 노출 목록의 앞 10건이며 게시시각 내림차순 전수 목록이 아니다. HN 게시일 범위는 2026-09-21~26 KST다.

**코딩 규칙 [제안]:** 링크의 ‘놓인 위치’와 ‘향하는 목적지’를 분리한다. 건수 표는 게시물당 대표 목적지 한 개만 센다. HN은 `url`, 없으면 `text`의 첫 프로젝트 링크; itch.io는 게시물과 연결된 프로젝트 링크; 디스콰이엇은 소개 페이지의 `방문하기`를 사용한다. GitHub 저장소의 README 존재는 공개 API로 확인했으며, README 안에서 다른 플랫폼으로 연결하는 행위는 별도 보조 관찰이다. 링크 선택 이유·빌드로그 URL 공유 의향을 추정하지 않는다.

| ID | 확인 URL | 링크 위치 | 대표 목적지 | 목적지 분류 | 확인 시각 KST |
|---|---|---|---|---|---|
| H01 | [Show HN](https://news.ycombinator.com/item?id=49845172) · [API](https://hacker-news.firebaseio.com/v0/item/49845172.json) | 제목 연결 `url` | [링크](https://jev-pokemon.vercel.app/) | 자체 사이트 | 2026-09-26 22:48:43 |
| H02 | [Show HN](https://news.ycombinator.com/item?id=49844497) · [API](https://hacker-news.firebaseio.com/v0/item/49844497.json) | 제목 연결 `url` | [링크](https://hackeratlas.com/) | 자체 사이트 | 2026-09-26 22:48:43 |
| H03 | [Show HN](https://news.ycombinator.com/item?id=49788014) · [API](https://hacker-news.firebaseio.com/v0/item/49788014.json) | 제목 연결 `url` | [링크](https://gmays.com/making-math-automatic-with-mathy/) | 자체 사이트 | 2026-09-26 22:48:43 |
| H04 | [Show HN](https://news.ycombinator.com/item?id=49849986) · [API](https://hacker-news.firebaseio.com/v0/item/49849986.json) | 제목 연결 `url` | [링크](https://www.gptbeyond.com/try?home=1) | 자체 사이트 | 2026-09-26 22:48:43 |
| H05 | [Show HN](https://news.ycombinator.com/item?id=49854203) · [API](https://hacker-news.firebaseio.com/v0/item/49854203.json) | 제목 연결 `url` | [링크](https://printgraphpaper.app/) | 자체 사이트 | 2026-09-26 22:48:43 |
| H06 | [Show HN](https://news.ycombinator.com/item?id=49833867) · [API](https://hacker-news.firebaseio.com/v0/item/49833867.json) | 제목 연결 `url` | [링크](https://github.com/devdotfast/whiteboard) | GitHub README | 2026-09-26 22:48:43 |
| H07 | [Show HN](https://news.ycombinator.com/item?id=49823332) · [API](https://hacker-news.firebaseio.com/v0/item/49823332.json) | 본문 `text` | [링크](https://github.com/giga-james/jevgpt) | GitHub README | 2026-09-26 22:48:43 |
| H08 | [Show HN](https://news.ycombinator.com/item?id=49853451) · [API](https://hacker-news.firebaseio.com/v0/item/49853451.json) | 제목 연결 `url` | [링크](https://github.com/sfmqrb/gutcheck) | GitHub README | 2026-09-26 22:48:43 |
| H09 | [Show HN](https://news.ycombinator.com/item?id=49827375) · [API](https://hacker-news.firebaseio.com/v0/item/49827375.json) | 제목 연결 `url` | [링크](https://cms-sfx-demo.apeleg.com/) | 자체 사이트 | 2026-09-26 22:48:43 |
| H10 | [Show HN](https://news.ycombinator.com/item?id=49850553) · [API](https://hacker-news.firebaseio.com/v0/item/49850553.json) | 제목 연결 `url` | [링크](https://recurse.run) | 자체 사이트 | 2026-09-26 22:48:43 |
| I01 | [devlog](https://nerdofalltrades505.itch.io/the-headless-horseman-wants-a-date/devlog/1678042/devlog-5-14) | 제목/프로젝트 탐색 링크 | [프로젝트](https://nerdofalltrades505.itch.io/the-headless-horseman-wants-a-date) | 플랫폼 프로젝트 페이지 | 2026-09-26 22:50:23 |
| I02 | [devlog](https://king100ton.itch.io/sweet-home-neogeo/devlog/1678040/enemy-sprites-0926) | 제목/프로젝트 탐색 링크 | [프로젝트](https://king100ton.itch.io/sweet-home-neogeo) | 플랫폼 프로젝트 페이지 | 2026-09-26 22:50:24 |
| I03 | [devlog](https://maccawtpi.itch.io/overtime/devlog/1678038/v102-release-notes) | 제목/프로젝트 탐색 링크 | [프로젝트](https://maccawtpi.itch.io/overtime) | 플랫폼 프로젝트 페이지 | 2026-09-26 22:50:23 |
| I04 | [devlog](https://oreiluiz.itch.io/crop-guardian/devlog/1678037/novos-inimigos-novas-plantas-monstruosas-e-o-caminho-para-o-deserto-) | 제목/프로젝트 탐색 링크 | [프로젝트](https://oreiluiz.itch.io/crop-guardian) | 플랫폼 프로젝트 페이지 | 2026-09-26 22:50:24 |
| I05 | [devlog](https://daf1.itch.io/asiden/devlog/1678035/your-companion-your-controls-customisation-editable-memory) | 프로젝트 탐색 링크 및 본문 다운로드 안내 링크 | [프로젝트](https://daf1.itch.io/asiden) | 플랫폼 프로젝트 페이지 | 2026-09-26 22:50:24 |
| D01 | [Filer AI 소개](https://disquiet.io/products/filer-ai) | 상단 `방문하기` 및 소개 본문의 URL | [사이트](https://filer-ai.com/) | 자체 사이트 | 2026-09-26 22:50~22:52 |

D01은 공개 프로젝트 소개이며 해당 페이지의 별도 포스트는 없었다. 소개의 게시일은 확인되지 않아 ‘최근 게시물’이라고 부르지 않는다. itch.io의 프로젝트 탐색 링크는 플랫폼이 제공하는 구조이므로 제작자가 외부에 공유하기로 선택한 횟수로 읽을 수 없다. `플랫폼 프로젝트 페이지`는 해당 devlog/소개에서 향하는 페이지의 분류이지 반드시 다른 도메인을 뜻하지 않는다.

### B3 건수 표

| 대표 목적지 분류 | Show HN n=10 | itch.io n=5 | 디스콰이엇 n=1 | 합계 n=16 |
|---|---:|---:|---:|---:|
| GitHub README(저장소 첫 화면) | 3 | 0 | 0 | 3 |
| 자체 사이트 | 7 | 0 | 1 | 8 |
| 스토어 | 0 | 0 | 0 | 0 |
| 플랫폼 프로젝트 페이지 | 0 | 5 | 0 | 5 |
| 없음 | 0 | 0 | 0 | 0 |
| 합계 | 10 | 5 | 1 | 16 |

대표 링크 이외의 링크를 없다고 처리하지 않는다. 예를 들어 H03의 본문에는 자체 앱 사이트와 [App Store](https://apps.apple.com/us/app/mathy-build-math-automaticity/id6804888736) 링크도 있었다. 따라서 스토어 0은 **대표 목적지 0건**이며 스토어 링크 부재가 아니다(동일 H03 item API, 2026-09-26 22:48:43 KST, n=1).

**README 보조 관찰(n=3, 2026-09-26 22:51:44 KST):** H06의 [README](https://github.com/devdotfast/whiteboard/blob/main/README.md)에는 설치 사이트와 자체 사이트 링크가 있었다. H07의 [README](https://github.com/giga-james/jevgpt/blob/main/README.md)에는 의존 서비스·개발 도구 문서 링크가, H08의 [README](https://github.com/sfmqrb/gutcheck/blob/main/README.md)에는 설치 스크립트·저장소·참고 데이터 링크가 있었다. 읽은 README 3개에서 별도 개발 기록 플랫폼 링크는 식별하지 못했다. 없다는 사실을 공유 거절로 해석하지 않으며, 사이트로부터 README로 오는 링크와 README에서 빌드로그 같은 프로젝트 기록 페이지로 나가는 링크를 같은 행동으로 세지 않는다.

**[미정]** 공개 자료는 링크의 존재·위치만 보여준다. 클릭·유입·가입·후속 게시, 링크의 소유권, 빌드로그 링크를 추가할 의향은 확인하지 못했다. K-6의 성장 채널 가설은 이 조사로 검증 완료가 되지 않는다.

## B4. K-9 — 팔로우·구독과 알림, 확인할 수 없는 재방문

**기능 관찰 n=4개 서비스, 근거 n=7개 공개 안내 페이지/운영자 설명 + B3의 D01.** 아래 시각은 문서·화면을 확인한 때이며 알림을 실제 수신한 시각이 아니다. 계정 생성이나 알림 발송 실험은 하지 않았다.

| 서비스 | 팔로우·구독 경로 | 이메일 | 푸시·인앱 | 확인 URL·시각 KST |
|---|---|---|---|---|
| itch.io | 계정 팔로우; 새 게임·devlog 등이 팔로워 피드에 표시 | 현재 안내에는 새 게임·판매 알림, 과거 운영자 답변에는 설정을 켠 경우 devlog 일간 다이제스트가 명시됨 | 피드와 팔로우받음 알림을 안내; devlog 전용 인앱 알림함·푸시는 미확인 | [Followers 안내](https://itch.io/docs/accounts/followers), 2026-09-26 22:50~22:51 · [운영자 답변](https://itch.io/post/1309958), 2026-09-26 22:50~22:52 |
| 디스콰이엇 | D01 공개 제품 소개에 `팔로우` 표시 | 현재 리뉴얼 공지에서 뉴스레터 제외; 프로젝트 팔로우 이메일의 현재 제공 여부는 미확인 | 현재 공지는 알림·푸시를 이번 버전에서 제외했다고 명시 | [리뉴얼 공지](https://disquiet.io/announcement), 2026-09-26 22:50~22:51 · [D01](https://disquiet.io/products/filer-ai), 2026-09-26 22:50~22:52 |
| GeekNews / Show GN | Weekly 이메일 구독, RSS; 프로젝트별 팔로우는 이번 근거에서 미확인 | Weekly 제공; 후원 혜택에 내 글의 새 댓글·내 댓글의 답글 이메일 명시 | 자체 푸시·팔로우 인앱 알림은 이번 근거에서 미확인; 쓰레드 탐색과 알림을 혼동하지 않음 | [Weekly](https://news.hada.io/weekly), 2026-09-26 22:50~22:52 · [후원 안내](https://news.hada.io/support), 2026-09-26 22:50~22:51 |
| Hacker News / Show HN | 공개 FAQ에서 프로젝트 팔로우·구독 알림 제공을 확인하지 못함 | 자체 이메일 제공 미확인 | 자체 푸시·인앱 제공 미확인; 외부 서비스의 답글 푸시 구현은 HN 자체 기능으로 세지 않음 | [공식 FAQ](https://news.ycombinator.com/newsfaq.html), 2026-09-26 22:50~22:51 · [외부 알림 도구의 제작자 설명](https://news.ycombinator.com/item?id=49644273), 2026-09-26 22:49~22:50 |

디스콰이엇의 과거 알림 소개를 현재 기능으로 옮기지 않는다. itch.io 운영자 답변은 오래된 기능 설명이므로 현재 계정 설정·실제 전달까지 확인한 증거가 아니다. `미확인`은 기능이 없다는 단정이 아니다. 위 표는 기능 유무에 대한 문서 증거이지 이용 빈도·재방문율 표가 아니다.

**알림 없는 자발 재방문은 공개 관찰로 확인 불가. 출시 후 팔로잉 피드 열람 이벤트로만 측정 [미정, K-2].** `following_feed_viewed` 같은 기록의 정의·구현이 선행돼야 한다. 탭 열람은 특정 다음 게시물을 실제 읽었다는 뜻이 아니며, `팔로우 시각 < 게시 시각 < 열람 시각`과 새 글 존재 여부를 결합해도 읽음·방문 원인의 인과는 별도 문제다. 외부 공유 링크로 돌아온 방문을 자발 습관 방문으로 확정하지 않는다. Q3·ADR-0003의 범위를 이 관찰로 바꾸지 않는다.

## B5. K-11 — 첫 외부 제작자의 행동 관찰 [제안]

**실험 제안:** 핵심 흐름 1 배포 후 **14일 안에 운영자·데모 프로젝트를 제외한 실제 사용자의 `post_published` 1건 이상**이 기록되는지 본다. **14일·1건은 실험 설계용 제안이며 확정 목표·현재 성과가 아니다.** 인터뷰 부탁이나 게시 의향을 실제 게시로 대체 집계하지 않는다.

| 항목 | 기록·판정 방법 [제안] |
|---|---|
| 시작 | 외부 실제 사용자가 가입 → 프로젝트 생성 → 게시를 할 수 있는 핵심 흐름 1의 배포 시각을 기준으로 기록 |
| 포함 | 서버가 게시 성공을 확정한 실제 사용자 `post_published`; 동일 게시물의 중복 이벤트는 한 번만 집계 |
| 제외 | `is_operator`, `is_demo`에 해당하는 활동과 테스트 이벤트; 공식 카드·수집 소재·데모 프로젝트 생성은 사용자 게시로 세지 않음 |
| 관찰 성공 | 유효 게시 1건 이상: ‘외부 제작자 첫 게시 관찰’만 확인; 연재 지속·유료 노출 수요·자발 재방문으로 확장하지 않음 |
| 0건 | 유입 부재, 온보딩/게시 실패, 기록 누락을 분리해 점검한 후 첫 게시 유입 경로를 재검토; 수요 없음으로 단정하지 않음 |
| 계측 누락 | 실패/성공 수치 대신 ‘측정 불가’로 기록; 운영자 자체 게시 성공으로 대체하지 않음 |

관찰 표본 **n=0(아직 실험 미실행)**, 실제 배포 URL·시각 **[미정]**. 확인할 공개 자료가 없으므로 확인 URL을 만들지 않는다. 설계 근거는 [제품 명세 §2](../01_PRODUCT_SPEC.md#2-문제가치목표)와 [레드팀 K-11](../strategy-red-team.md#k-11-운영자-자체-devlog가-실사용-예시가-된다), 검토 시각 **2026-09-26 22:58 KST**다. 실행 시 배포 URL·14일 관찰 구간·제외 후 건수·계측 누락 여부를 남긴다.

## B6. Opportunity Score 대신 문제 언급의 정성 서열 [제안]

**분모는 B2의 관련 자료 6건(R1~R6), 그중 원문 확인 2건이다.** 원문 확인 시각·URL은 B2 각 행과 같으며 추가 자료를 모아 순위를 유리하게 바꾸지 않았다. 한 문제를 한 스레드에서 여러 번 언급해도 1건이다. 제작 수고라는 넓은 주제와 제품 명세의 정확한 문제를 분리해 코딩한다.

| 제품 명세 §2의 문제 | 직접 언급: 원문 확인 n=2 | 직접 언급: 검색 발췌 n=4 | 인접 주제(직접 언급에 합산하지 않음) | 정성 판단 [제안] |
|---|---:|---:|---|---|
| 긴 개발 글을 별도로 쓰기 어렵다 | 0 | 0 | 제작·편집 수고: R1·R2 원문 2건, R3·R4·R5 발췌 3건. 대부분 영상 제작이며 R5는 텍스트 기록이 적은 수고로 가능하다는 반대 근거도 포함 | ‘게시용 콘텐츠 제작 부담’을 우선 확인할 인접 신호; 긴 글 문제 자체의 검증은 미정 |
| 게시물이 흘러가면 프로젝트의 맥락을 잃는다 | 0 | 0 | R6 발췌 1건의 주소 변경·갱신 누락은 전달 단절이지 피드에서 이력이 흘러가는 현상과 동일하지 않음 | 원래 문제의 서열 유보 |
| 한 번 출시하고 나면 다시 소개하기 어렵다 | 0 | 0 | R6은 출시 소식을 놓친 사례로, 출시 **후 재소개가 어렵다**는 제작자 발언이 아님 | 서열 유보 |
| 초기 사용자 수가 적으면 볼거리가 부족하다 | 0 | 0 | 낮은 반응(R3)을 읽을 콘텐츠 부족으로 바꾸어 해석할 수 없음 | 서열 유보 |

**정성 대체 서열:** 정확한 네 문제의 직접 언급은 모두 0건이므로 동률·판단 유보다. 인접 신호만으로 정한 탐색 순서는 **콘텐츠 제작 부담 우선 → 나머지 세 문제 간 순서는 미정**이다. 이는 텍스트 게시 마찰을 검증했다는 뜻도, 만족도를 낮게 평가했다는 뜻도 아니다. 원문 확인 자료 2건만 사용해도 제작 부담이라는 인접 신호는 남지만 나머지 문제의 우열은 정할 수 없다.

**인터뷰 데이터가 생기기 전까지의 대체 서열**이며 인터뷰 실행을 후속 대안으로 제안하는 문장이 아니다. 중요도·만족도 점수와 Opportunity Score는 만들지 않는다. 키워드 검색은 수고·중단 관련 발언을 찾도록 편향돼 있고 발췌만 확보한 자료도 있으므로, 언급 건수를 문제의 빈도·중요도·시장성으로 바꾸지 않는다. 이후 판정은 B5의 실제 게시와 B4의 구현된 열람 계측이 확보하는 행동 범위 안에서 갱신한다. [미정]

## 재시도 보완 (2026-09-26)

### H2. Reddit R3~R6 — 원문 확보 실패 기록

**추가 원문 확인 0건이며 B2의 원문 확인 2건·검색 발췌만 4건을 유지한다. R6 게시일도 미확인이다.** 원문을 확보하지 못했으므로 기존 게시일·요지·분류를 새로 검증했다고 표시하지 않는다. 아래 세 경로에 `insane-search`의 `scripts/run -m engine URL --json-content`를 적용했고, Jina에는 `--device mobile`을 바꾼 재시도까지 실행했다. 모든 확인 시각은 2026-09-26 KST다.

| ID | old.reddit.com | URL 뒤 `.json` | Jina Reader | 게시일·분류·원문 확인 결과 |
|---|---|---|---|---|
| R3 | [old 원문](https://old.reddit.com/r/gamedev/comments/m246n2) · 23:31:27~23:31:31: 로그인 URL로 이동, 본문 없음 | [JSON](https://www.reddit.com/r/gamedev/comments/m246n2.json) · 23:31:27~23:31:28: HTTP 403, 글·댓글 확인 불가 | [Jina](https://r.jina.ai/https://www.reddit.com/r/gamedev/comments/m246n2) · 23:31:28~23:31:41; 모바일 23:33:42~23:34:11: 대상 403 안내만 반환 | **원문 미확인 유지.** 2021-03-10은 기존 검색 발췌의 날짜이며 재검증하지 못함. ‘반응 없음(낮은 반응 포함)’ 분류 [제안]과 시간·수고 동반 언급은 발췌 범위에서만 유지 |
| R4 | [old 원문](https://old.reddit.com/r/gamedev/comments/1bl4psq) · 23:31:31~23:31:34: 로그인 URL로 이동, 본문 없음 | [JSON](https://www.reddit.com/r/gamedev/comments/1bl4psq.json) · 23:31:34~23:31:35: HTTP 403, 글·댓글 확인 불가 | [Jina](https://r.jina.ai/https://www.reddit.com/r/gamedev/comments/1bl4psq) · 23:31:35~23:31:56; 모바일 23:33:42~23:34:11: 대상 403 안내만 반환 | **원문 미확인 유지.** 2024-03-22는 기존 검색 발췌의 날짜이며 재검증하지 못함. ‘시간·수고’ 분류 [제안] 유지, 중단 이유 전부로 확장하지 않음 |
| R5 | [old 원문](https://old.reddit.com/r/gamedev/comments/1dtrgxc) · 23:31:41~23:31:45: 로그인 URL로 이동, 본문 없음 | [JSON](https://www.reddit.com/r/gamedev/comments/1dtrgxc.json) · 23:31:45~23:31:46: HTTP 403, 글·댓글 확인 불가 | [Jina](https://r.jina.ai/https://www.reddit.com/r/gamedev/comments/1dtrgxc) · 23:31:46~23:31:58; 모바일 23:33:50~23:34:11: 대상 403 안내만 반환 | **원문 미확인 유지.** 2024-07-02는 기존 검색 발췌의 날짜이며 재검증하지 못함. ‘시간·수고’ 분류 [제안] 및 텍스트 기록은 수고가 적다는 반대 근거 유지 |
| R6 | [old 원문](https://old.reddit.com/r/gamedev/comments/dnxf3r) · 23:30:18: 로그인 URL로 이동, 본문 없음 | [JSON](https://www.reddit.com/r/gamedev/comments/dnxf3r.json) · 23:31:56: HTTP 403, 글·댓글 확인 불가 | [Jina](https://r.jina.ai/https://www.reddit.com/r/gamedev/comments/dnxf3r) · 23:31:56~23:32:07; 모바일 23:33:53~23:34:11: 대상 403 안내만 반환 | **원문·게시일 미확인 유지.** 상대 연령 ‘약 6.9년 전’에서 날짜를 역산하지 않음. ‘기타’ 분류 [제안] 유지, 제작자의 중단 원인으로 해석하지 않음 |

추가 공식 RSS 경로도 모바일 설정으로 확인했다. [R3 RSS](https://www.reddit.com/r/gamedev/comments/m246n2.rss)·[R4 RSS](https://www.reddit.com/r/gamedev/comments/1bl4psq.rss)는 23:32:27부터, [R5 RSS](https://www.reddit.com/r/gamedev/comments/1dtrgxc.rss)·[R6 RSS](https://www.reddit.com/r/gamedev/comments/dnxf3r.rss)는 23:32:33부터 요청해 모두 `rate_limited`로 끝났다(결과 확인 23:33 KST). 429는 일시 제한이며 원문이 없거나 영구 차단됐다는 증거로 삼지 않는다.

**성공 판독 보정:** old 경로의 HTTP 200·`weak_ok`는 최종 URL이 `/login/`인 빈 로그인 화면이었다. JSON 경로도 엔진이 `weak_ok`를 반환했으나 trace의 HTTP 403과 본문 검증 실패 때문에 원문 확인으로 세지 않았다. Jina의 HTTP 200은 Reader 자체 응답이며 그 안에는 대상 Reddit의 403 안내만 있었다. Jina의 기본·모바일 시도는 `grid_exhausted=true`였지만 `must_invoke_playwright_mcp=true`와 미시도 경로가 남아 있어 전수 성공·영구 접근 불가를 선언하지 않는다. 근거 URL·시각은 위 표 각 행이다.

브라우저 폴백은 [R6 원문](https://www.reddit.com/r/gamedev/comments/dnxf3r)의 Chrome 열기와 [R6 Jina](https://r.jina.ai/https://www.reddit.com/r/gamedev/comments/dnxf3r)의 IAB 열기 모두 `Browser is not available`이었다(2026-09-26 23:32 KST). 엔진 trace의 로컬 Chrome 경로도 실행 파일을 찾지 못했다(위 Jina 모바일 URL 4개, 2026-09-26 23:33:42~23:34:11 KST). 로그인·토큰 발급·계정 생성은 하지 않았으며 **현재 세션에서 공개 본문 확인 수단이 부족한 상태**로 기록한다.

B2·B6의 분모·정성 서열은 바뀌지 않는다. 추가 원문 인용·전문 저장·개인 식별 정보 기록은 없으며, 확인 실패를 기존 발췌 요지의 진실성이나 반증으로 사용하지 않는다. K-1의 중단 원인·본인 통계 필요성과 K-6·K-9·K-11의 실제 행동은 여전히 미확인이다.
