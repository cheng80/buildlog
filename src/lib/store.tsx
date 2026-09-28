'use client';

// App-wide prototype state. The design prototype kept everything in one component; here it lives in a
// context so every route shares it. Saved to localStorage so a page refresh or a typed URL keeps the session.
// ponytail: localStorage mock, swap for Supabase reads/writes when the data layer lands.

import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  DRAFTS, LOG0, ME, OFFICIAL, P, REPORTS, SEED, newMine, now, projectUrl, summary,
  type Official, type Order, type OrderStatus, type Post, type Project,
} from './data';

type Draft = (typeof DRAFTS)[number] & { status: 'pending' | 'approved' | 'rejected' };
type Report = { id: string; postId: string; reason: string; time: string; status: 'open' | 'hidden' | 'kept' | 'restored' };
type LogRow = { id: string; type: string; reason: string; at: string; by: string; target: string };
export type MyProfile = { name: string; bio: string; regionPublic: boolean; region: string };

export type Sheet =
  | { type: 'posted'; name: string; url: string; pid: string; stepLabel: string }
  | { type: 'share'; name: string; url: string; pid: string }
  | { type: 'confirm'; title: string; desc: string; confirmLabel: string; action: 'report' | 'cancel' | 'delete' | 'logout' | 'withdraw'; arg?: string };

type State = {
  loggedIn: boolean; mine: Project | null; posts: Post[];
  liked: Record<string, boolean>; saved: Record<string, boolean>; followed: Record<string, boolean>; expanded: Record<string, boolean>;
  tab: 'latest' | 'following'; inFlow: boolean; profile: MyProfile;
  orders: Order[]; drafts: Draft[]; approved: Official[]; reports: Report[]; hidden: Record<string, boolean>; log: LogRow[]; todayPub: number;
  seq: number;
};

const base = (): State => ({
  loggedIn: false, mine: null, posts: [], liked: {}, saved: {}, followed: {}, expanded: {}, tab: 'latest', inFlow: false,
  profile: { name: '김하늘', bio: '작은 데스크톱 앱을 만듭니다.', regionPublic: false, region: '서울 성동구' },
  orders: [], drafts: DRAFTS.map((d) => ({ ...d, status: 'pending' })), approved: [],
  reports: REPORTS.map((r) => ({ ...r, status: 'open' })), hidden: {}, log: [...LOG0], todayPub: 0, seq: 0,
});

const KEY = 'buildlog-prototype-v1';

function useStoreValue() {
  const router = useRouter();
  const [s, setS] = useState<State>(base);
  const [ready, setReady] = useState(false);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved: State = { ...base(), ...JSON.parse(raw) };
        // A refresh drops the mock confirmation timers, so settle in-flight orders the way the server would.
        const settle: Partial<Record<OrderStatus, OrderStatus>> = { checking: 'paid', cancelling: 'cancelled' };
        saved.orders = saved.orders.map((o) => ({ ...o, status: settle[o.status] ?? o.status }));
        setS(saved);
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  }, [s, ready]);

  const set = useCallback((patch: Partial<State> | ((st: State) => Partial<State>)) =>
    setS((st) => ({ ...st, ...(typeof patch === 'function' ? patch(st) : patch) })), []);

  const toast = useCallback((msg: string) => {
    clearTimeout(timer.current);
    setToastMsg(msg);
    timer.current = setTimeout(() => setToastMsg(''), 2200);
  }, []);

  const proj = (id: string) => (s.mine && id === s.mine.id ? s.mine : P[id]);
  const allPosts = [...s.posts, ...SEED].filter((p) => !s.hidden[p.id] && proj(p.pid)).sort((a, b) => a.ago - b.ago);
  const findPost = (id: string) => [...s.posts, ...SEED].find((p) => p.id === id);

  const needMine = (href: string) => {
    if (!s.loggedIn) return router.push('/login');
    if (!s.mine) return router.push('/onboarding');
    router.push(href);
  };

  const setOrder = (id: string, status: OrderStatus) =>
    set((st) => ({ orders: st.orders.map((o) => (o.id === id ? { ...o, status } : o)) }));

  const logAct = (type: string, reason: string, target: string) =>
    set((st) => ({ log: [{ id: 'l' + Date.now(), type, reason, at: now(), by: '운영자', target }, ...st.log] }));

  const addPost = (post: Omit<Post, 'id' | 'pid' | 'ago'>, stepLabel: string) => {
    const mine = s.mine!;
    const n = s.seq + 1;
    set((st) => ({ seq: n, posts: [{ ...post, id: 'n' + n, pid: mine.id, ago: -n }, ...st.posts], tab: 'latest', inFlow: false }));
    setSheet({ type: 'posted', name: mine.name, url: projectUrl(mine.id), pid: mine.id, stepLabel });
  };

  const actions = {
    set, toast, setSheet, needMine, setOrder,
    goBack: () => (window.history.length > 1 ? router.back() : router.push('/')),
    toggleLike: (id: string) => set((st) => ({ liked: { ...st.liked, [id]: !st.liked[id] } })),
    toggleSave: (id: string) => {
      if (!s.saved[id]) toast('저장되었습니다. 나만 볼 수 있어요');
      set((st) => ({ saved: { ...st.saved, [id]: !st.saved[id] } }));
    },
    toggleFollow: (pid: string) => {
      if (!s.loggedIn) return router.push('/login');
      if (!s.followed[pid]) toast('팔로우했어요. 다음 글은 팔로잉 탭에 떠요');
      set((st) => ({ followed: { ...st.followed, [pid]: !st.followed[pid] } }));
    },
    toggleExpanded: (key: string) => set((st) => ({ expanded: { ...st.expanded, [key]: !st.expanded[key] } })),
    openShare: (p: Project) => setSheet({ type: 'share', name: p.name, url: projectUrl(p.id), pid: p.id }),
    askReport: (postId: string) => setSheet({ type: 'confirm', title: '이 글을 신고할까요?', desc: '운영자가 확인한 뒤 숨김 여부를 정해요. 신고한 사람은 공개되지 않습니다.', confirmLabel: '신고하기', action: 'report', arg: postId }),
    login: () => { set({ loggedIn: true }); router.push(s.mine ? '/' : '/onboarding'); },
    createProject: (over: Partial<Project>) => { set({ loggedIn: true, inFlow: true, mine: newMine(over) }); router.push('/compose'); },
    addPost,
    pay: () => {
      const id = 'BL-0928-' + String(s.orders.length + 1).padStart(3, '0');
      set((st) => ({ orders: [{ id, pid: s.mine!.id, status: 'checking', date: '2026.09.28 ' + now() }, ...st.orders] }));
      setTimeout(() => setOrder(id, 'paid'), 1600);
      router.push(`/payments/${id}/result`);
    },
    approveDraft: (d: Draft) => {
      if (s.todayPub >= 2) return;
      set((st) => ({
        todayPub: st.todayPub + 1,
        drafts: st.drafts.map((y) => (y.id === d.id ? { ...y, status: 'approved' } : y)),
        approved: [{ id: d.id, kindLabel: d.kind, title: d.title, body: d.body, source: '출처 ' + d.source, cta: '원문 보기', act: 'external' }, ...st.approved],
      }));
      logAct('게시', '공식 카드 승인', d.title);
      toast('승인되었습니다. 피드에 게시돼요');
    },
    rejectDraft: (d: Draft) => {
      set((st) => ({ drafts: st.drafts.map((y) => (y.id === d.id ? { ...y, status: 'rejected' } : y)) }));
      logAct('반려', '공식 카드 초안', d.title);
    },
    resolveReport: (r: Report, status: Report['status']) => {
      const p = findPost(r.postId);
      set((st) => ({
        reports: st.reports.map((x) => (x.id === r.id ? { ...x, status } : x)),
        ...(status === 'hidden' || status === 'restored' ? { hidden: { ...st.hidden, [r.postId]: status === 'hidden' } } : {}),
      }));
      logAct({ hidden: '숨김', kept: '유지', restored: '복원', open: '' }[status], r.reason, p ? summary(p) : r.postId);
      if (status === 'hidden') toast('숨김 처리되었습니다. 모든 공개 경로에서 내려가요');
    },
    confirmSheet: () => {
      if (!sheet || sheet.type !== 'confirm') return;
      const { action, arg } = sheet;
      setSheet(null);
      if (action === 'report') {
        set((st) => ({ reports: [{ id: 'r' + Date.now(), postId: arg!, reason: '사용자 신고', time: '방금', status: 'open' }, ...st.reports] }));
        toast('신고가 접수되었습니다');
      } else if (action === 'cancel') {
        setOrder(arg!, 'cancelling');
        setTimeout(() => { setOrder(arg!, 'cancelled'); toast('취소가 확인되었습니다'); }, 1400);
      } else if (action === 'delete') {
        set({ mine: null, posts: [] });
        router.push('/');
        toast('삭제되었습니다. 30일 뒤 완전히 정리돼요');
      } else {
        setS(base());
        router.push('/login');
        toast(action === 'withdraw' ? '탈퇴가 접수되었습니다. 즉시 비공개로 바뀌어요' : '로그아웃되었습니다');
      }
    },
  };

  return { s, ready, sheet, toastMsg, proj, allPosts, findPost, ...actions };
}

type Store = ReturnType<typeof useStoreValue>;
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const value = useStoreValue();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore outside StoreProvider');
  return v;
}

/** Redirects once saved state has loaded: to /login when signed out, to /onboarding when a project is required but missing. */
export function useGuard(need: 'login' | 'mine') {
  const { s, ready } = useStore();
  const router = useRouter();
  const blocked = !s.loggedIn || (need === 'mine' && !s.mine);
  useEffect(() => {
    if (!ready || !blocked) return;
    router.replace(!s.loggedIn ? '/login' : '/onboarding');
  }, [ready, blocked, s.loggedIn, router]);
  return ready && !blocked;
}

const mq = '(max-width: 767px)';
const subscribe = (cb: () => void) => {
  const m = window.matchMedia(mq);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};

/** Matches the prototype's "모바일 390" frame below 768px, "데스크톱" above. */
export function useIsMobile() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(mq).matches, () => false);
}

export const isMe = (handle: string) => handle === ME;
