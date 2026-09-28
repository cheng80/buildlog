// Seed data and pure helpers, carried over from the Claude Design prototype (Buildlog Prototype.dc.html).
// Nothing here talks to a server yet — Supabase replaces this file when the real data layer lands.

export type Project = {
  id: string; name: string; line: string; owner: string; handle: string; demo: boolean;
  tech: string[]; stage: string; links: string[]; cat: string;
};

export type Media = 'image' | 'youtube' | 'github' | 'web' | 'none';

export type Post = {
  id: string; pid: string; ago: number; text: string; media: Media; mediaLabel?: string;
  kind?: 'release'; version?: string; releaseTitle?: string; changes?: string[];
};

export type Official = { id: string; kindLabel: string; title: string; body: string; source: string; cta: string; act: string };

export type Profile = { handle: string; name: string; bio: string; region: string | null; links: string[]; demo: boolean };

export const ME = 'haneul';
export const MINE_ID = 'h7k2q9';

export const P: Record<string, Project> = {
  buildlog: { id: 'buildlog', name: '빌드로그', line: '붙여넣기 하나로 올리는 개발 기록 서비스', owner: '빌드로그 운영자', handle: 'buildlog', demo: false, tech: ['Next.js', 'Supabase', 'Vercel'], stage: '개발 중', links: ['buildlog.vercel.app'], cat: 'web' },
  tile: { id: 'tile', name: '타일 농장', line: '밭 타일을 이어 붙이는 작은 농장 퍼즐 게임', owner: '데모 스튜디오', handle: 'demo_studio', demo: true, tech: ['Godot', 'GDScript'], stage: '프로토타입', links: ['itch.io'], cat: 'game' },
  pixel: { id: 'pixel', name: '픽셀 우체국', line: '직접 그린 우표로 편지를 보내는 웹', owner: '데모 스튜디오', handle: 'demo_studio', demo: true, tech: ['SvelteKit', 'Canvas'], stage: '개발 중', links: ['github.com'], cat: 'web' },
  ledger: { id: 'ledger', name: '한 줄 가계부', line: '지출을 한 줄로 적는 가계부 앱', owner: '데모 스튜디오', handle: 'demo_studio', demo: true, tech: ['Flutter'], stage: '베타', links: [], cat: 'app' },
};

export const PROFILES: Record<string, Profile> = {
  buildlog: { handle: 'buildlog', name: '빌드로그 운영자', bio: '빌드로그를 만들고 운영합니다. 서비스 자체 개발 기록도 여기에 올려요.', region: '서울 마포구', links: ['contact@buildlog.example'], demo: false },
  demo_studio: { handle: 'demo_studio', name: '데모 스튜디오', bio: '사용 예시를 보여주기 위한 데모 계정이에요. 실제 팀이 아닙니다.', region: null, links: [], demo: true },
};

export const newMine = (over: Partial<Project> = {}): Project => ({
  id: MINE_ID, name: '포모 타이머', line: '집중 시간을 기록하는 작은 데스크톱 앱', owner: '김하늘', handle: ME, demo: false,
  tech: ['Tauri', 'React'], stage: '개발 중', links: [], cat: 'app', ...over,
});

export const SEED: Post[] = [
  { id: 'a1', pid: 'tile', ago: 35, text: '수확 애니메이션을 0.2초 줄였어요. 손맛이 확실히 달라졌습니다.', media: 'image', mediaLabel: 'harvest.gif' },
  { id: 'a2', pid: 'buildlog', ago: 90, text: '연속 카드 접기 규칙을 구현한 과정을 영상으로 남겼어요.', media: 'youtube', mediaLabel: '빌드로그 devlog #7 · 연속 카드 접기' },
  { id: 'a3', pid: 'pixel', ago: 180, text: '편지 봉투가 열리는 효과 초안이에요.', media: 'image', mediaLabel: 'envelope-open.png' },
  { id: 'a4', pid: 'pixel', ago: 300, text: '우표 에디터 저장소를 공개했어요.', media: 'github', mediaLabel: 'demo/pixel-post-stamp-editor' },
  { id: 'a5', pid: 'pixel', ago: 420, text: '배경 팔레트를 8색으로 줄였습니다.', media: 'none' },
  { id: 'a6', pid: 'ledger', ago: 600, text: '', media: 'none', kind: 'release', version: 'v0.3', releaseTitle: '반복 지출 자동 입력', changes: ['매달 같은 지출을 한 번에 등록', '카테고리 색상 정리'] },
  { id: 'a7', pid: 'tile', ago: 1500, text: '밭 타일 16종을 다 그렸어요.', media: 'image', mediaLabel: 'tiles-16.png' },
  { id: 'a8', pid: 'buildlog', ago: 2900, text: '피드 정직성 규칙 3개를 자동 검사로 묶었어요.', media: 'web', mediaLabel: 'buildlog.vercel.app/about' },
  { id: 'a9', pid: 'buildlog', ago: 7200, text: '', media: 'none', kind: 'release', version: '0.1', releaseTitle: '첫 프로토타입', changes: ['GitHub·Google 로그인', '프로젝트 만들기와 게시'] },
  { id: 'a10', pid: 'tile', ago: 10100, text: '', media: 'none', kind: 'release', version: 'alpha-1', releaseTitle: '첫 플레이 빌드', changes: ['3개 스테이지', '저장 기능'] },
];

export const OFFICIAL: Official[] = [
  { id: 'o1', kindLabel: '오늘의 만들기 주제', title: '로딩 화면 하나만 다듬어 보기', body: '오늘 만든 로딩 화면을 한 장 올려 주세요. 전후 비교도 좋아요.', source: '빌드로그 · 9월 28일', cta: '이 주제로 올리기', act: 'compose' },
  { id: 'o2', kindLabel: '개발 팁과 소식', title: '작은 팀의 첫 스토어 페이지 준비 순서', body: '출시 전 스토어 페이지에 먼저 넣을 것들을 정리한 글을 소개해요.', source: '출처 itch.io devlogs · 9월 27일', cta: '원문 보기', act: 'external' },
  { id: 'o3', kindLabel: '이번 주 프로젝트', title: '타일 농장', body: '밭 타일을 이어 붙이는 농장 퍼즐. 데모 프로젝트입니다.', source: '빌드로그 · 데모', cta: '프로젝트 보기', act: 'tile' },
];

export const DRAFTS = [
  { id: 'd1', kind: '개발 팁과 소식', title: '1인 개발자가 공개한 스크린샷 편집 도구', body: '공유용 스크린샷을 빠르게 다듬는 오픈소스 도구가 소개됐어요. 게시용 이미지를 만들 때 참고해 보세요.', source: 'Show HN · 9월 28일' },
  { id: 'd2', kind: '개발 팁과 소식', title: '작은 서비스의 초기 사용자 모집 경험 모음', body: '출시 초기에 첫 사용자를 모은 경험담을 정리한 글들을 소개해요.', source: 'GeekNews · 9월 28일' },
  { id: 'd3', kind: '개발 팁과 소식', title: '게임 엔진 요금 정책 논의 요약', body: '주요 게임 엔진의 요금 정책을 둘러싼 업계 논의를 짧게 정리했어요. 자세한 내용은 원문에서 확인해 주세요.', source: 'Ars Technica · 9월 27일' },
  { id: 'd4', kind: '오늘의 만들기 주제', title: '설정 화면 하나만 정리해 보기', body: '오늘 정리한 설정 화면을 한 장 올려 주세요.', source: '빌드로그 · 9월 29일 예약' },
];

export const REPORTS = [
  { id: 'r1', postId: 'a5', reason: '프로젝트와 관계없는 내용', time: '20분 전' },
  { id: 'r2', postId: 'a7', reason: '스팸·홍보', time: '1시간 전' },
];

export const LOG0 = [{ id: 'l0', type: '게시', reason: '공식 카드 승인', at: '09:10', by: '운영자', target: '오늘의 만들기 주제' }];
export const TECH = ['React', 'Next.js', 'Flutter', 'Swift', 'Kotlin', 'Unity', 'Godot', 'Tauri'];
export const STAGES = ['아이디어', '프로토타입', '개발 중', '베타', '출시'];
export const REGIONS = ['서울 마포구', '서울 성동구', '경기 성남시 분당구', '부산 해운대구', '대전 유성구', '제주 제주시'];
export const CATS = [['all', '전체'], ['app', '앱'], ['web', '웹'], ['game', '게임']] as const;

export const C = {
  ok: 'var(--color-success)', warn: 'var(--color-warning)', err: 'var(--color-error)',
  v1: 'var(--color-on-view-1)', v2: 'var(--color-on-view-2)', v3: 'var(--color-on-view-3)', pri: 'var(--color-on-view-primary)',
};

export const ago = (m: number) => (m < 1 ? '방금' : m < 60 ? m + '분 전' : m < 1440 ? Math.floor(m / 60) + '시간 전' : Math.floor(m / 1440) + '일 전');

export const now = () => {
  const d = new Date();
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
};

export const projectUrl = (id: string) => 'buildlog.vercel.app/p/' + id;

export const summary = (p: Post) => (p.kind === 'release' ? 'Release ' + p.version + ' · ' + p.releaseTitle : p.text || p.mediaLabel || '');

export const linesOf = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);

const URL_RE = /(https?:\/\/\S+|(?:www\.)?(?:youtu\.be|youtube\.com|github\.com)\/\S+)/i;

export type Detected = { type: 'youtube' | 'github' | 'web'; url: string; label: string; icon: string; kind: string; msg: string };

/** Finds the first link in a post body and decides which card it becomes (one representative link per post). */
export function detect(text: string): Detected | null {
  const m = (text || '').match(URL_RE);
  if (!m) return null;
  const url = m[0];
  const host = url.replace(/^https?:\/\//, '').replace(/^www\./, '');
  if (/youtu\.?be/.test(host)) return { type: 'youtube', url, label: 'YouTube 영상', icon: 'youtube', kind: '유튜브 영상 카드', msg: '유튜브 영상으로 게시돼요' };
  if (/^github\.com/.test(host)) return { type: 'github', url, label: host.replace(/^github\.com\//, ''), icon: 'github', kind: 'GitHub 저장소 카드', msg: 'GitHub 카드로 게시돼요' };
  return { type: 'web', url, label: host.split('/')[0], icon: 'globe', kind: '웹 링크 카드', msg: '웹 링크 카드로 게시돼요' };
}

export type OrderStatus = 'checking' | 'paid' | 'live' | 'cancelling' | 'cancelled';
export type Order = { id: string; pid: string; status: OrderStatus; date: string };

export const ORDER_LABEL: Record<OrderStatus, [string, string]> = {
  checking: ['결제 확인 중', C.warn], paid: ['노출 시작 전', C.v2], live: ['노출 중', C.pri], cancelling: ['취소 확인 중', C.warn], cancelled: ['취소됨', C.v3],
};

// Order / payment / exposure state per order status: [label, color] for each of the three steps.
const ORDER_STEPS: Record<OrderStatus, [string, string][]> = {
  checking: [['접수', C.v2], ['확인 중', C.warn], ['시작 전', C.v3]],
  paid: [['완료', C.ok], ['확인됨', C.ok], ['시작 전', C.v2]],
  live: [['완료', C.ok], ['확인됨', C.ok], ['노출 중', C.pri]],
  cancelling: [['취소 요청', C.v2], ['취소 확인 중', C.warn], ['없음', C.v3]],
  cancelled: [['취소됨', C.v3], ['전액 취소됨', C.v2], ['없음', C.v3]],
};

const ORDER_NOTE: Record<OrderStatus, string> = {
  paid: '30일 안에 노출을 시작하지 않으면 운영자가 주문을 취소할 수 있어요.',
  live: '노출을 시작한 뒤에는 취소할 수 없어요.',
  cancelled: '취소가 확인되었습니다. 테스트 결제라 실제 청구는 없었어요.',
  checking: '서버 확인이 끝나면 완료로 바뀌어요.',
  cancelling: '취소 확인이 끝나면 전액 취소로 바뀌어요.',
};

export function orderView(o: Order, projectName: string) {
  return {
    steps: ['주문', '결제', '노출'].map((k, i) => ({ k, v: ORDER_STEPS[o.status][i][0], color: ORDER_STEPS[o.status][i][1] })),
    info: [
      { k: '주문번호', v: o.id }, { k: '상품', v: 'Featured · 7일' }, { k: '프로젝트', v: projectName },
      { k: '금액', v: '1,000원 (테스트)' }, { k: '주문 시각', v: o.date },
      ...(o.status === 'live' ? [{ k: '노출 기간', v: '9월 28일 – 10월 5일' }] : []),
    ],
    note: ORDER_NOTE[o.status],
    canStart: o.status === 'paid',
    canCancel: o.status === 'paid',
  };
}
