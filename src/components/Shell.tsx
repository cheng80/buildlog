'use client';

// Page chrome: desktop header, mobile bottom tabs, the shared bottom sheet and the toast.

import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { ME } from '@/lib/data';
import { useIsMobile, useStore } from '@/lib/store';
import { Avatar, ContainedButton, GhostButton, Icon, IconButton, OutlinedButton, Toast } from './ds';
import { col, row } from './ui';

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const mob = useIsMobile();
  const bare = path === '/login' || path === '/onboarding';
  const tabbed = path === '/' || path === '/explore' || path === '/saved' || /^\/(p|u)\/[^/]+$/.test(path);
  const showNav = mob && tabbed;
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {!mob && !bare && <Header />}
      <main style={{ flex: 1, minHeight: 0 }}>{children}</main>
      {showNav && <BottomNav />}
      <SheetLayer />
      <ToastLayer bottom={showNav ? 84 : 24} />
    </div>
  );
}

function Header() {
  const path = usePathname();
  const router = useRouter();
  const { needMine } = useStore();
  const color = (p: string) => (path === p ? 'onView1' : 'onView3');
  const goProfile = () => needMine(`/u/${ME}`);
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 2, background: 'var(--color-background)', flex: 'none', height: 64, ...row(24), padding: '0 32px', boxShadow: 'inset 0 -1px 0 var(--color-outline-1)' }}>
      <button type="button" onClick={() => router.push('/')} style={{ border: 0, background: 'transparent', cursor: 'pointer', padding: 0, font: '800 22px/26px var(--font-sans)', color: 'var(--color-on-view-1)' }}>buildlog</button>
      <nav style={{ display: 'flex', gap: 20 }}>
        <GhostButton color={color('/')} onClick={() => router.push('/')}>피드</GhostButton>
        <GhostButton color={color('/explore')} onClick={() => router.push('/explore')}>탐색</GhostButton>
        <GhostButton color={color('/saved')} onClick={() => router.push('/saved')}>저장</GhostButton>
      </nav>
      <div style={{ marginLeft: 'auto', ...row(8) }}>
        <IconButton icon="search" ariaLabel="검색" onClick={() => router.push('/explore')} />
        <ContainedButton icon="plus" onClick={() => needMine('/compose')}>올리기</ContainedButton>
        <button type="button" onClick={goProfile} aria-label="내 프로필" style={{ border: 0, background: 'transparent', padding: 0, cursor: 'pointer', display: 'flex' }}>
          <Avatar size={32} />
        </button>
      </div>
    </header>
  );
}

const TABS = [
  ['/', '피드', 'house'], ['/explore', '탐색', 'compass'], ['/compose', '올리기', 'square-plus'],
  ['/saved', '저장', 'bookmark'], [`/u/${ME}`, '프로필', 'circle-user-round'],
] as const;

function BottomNav() {
  const path = usePathname();
  const router = useRouter();
  const { needMine } = useStore();
  return (
    <nav style={{ position: 'sticky', bottom: 0, zIndex: 2, flex: 'none', display: 'flex', height: 64, paddingBottom: 12, background: 'var(--color-background)', boxShadow: 'inset 0 1px 0 var(--color-outline-1)' }}>
      {TABS.map(([href, label, icon]) => {
        const on = path === href;
        const go = href === '/compose' || href.startsWith('/u/') ? () => needMine(href) : () => router.push(href);
        return (
          <button key={href} type="button" onClick={go} aria-label={label} style={{ flex: 1, border: 0, background: 'transparent', cursor: 'pointer', ...col(3, { alignItems: 'center', justifyContent: 'center' }), color: on ? 'var(--color-on-view-1)' : 'var(--color-on-view-3)', font: '500 10px/12px var(--font-sans)' }}>
            <Icon name={icon} weight={on ? 'fill' : 'regular'} size={24} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}

function SheetLayer() {
  const { sheet, setSheet, confirmSheet, toast } = useStore();
  const router = useRouter();
  const mob = useIsMobile();
  if (!sheet) return null;
  const go = (href: string) => { setSheet(null); router.push(href); };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3, display: 'flex', alignItems: mob ? 'flex-end' : 'center', justifyContent: 'center' }}>
      <div onClick={() => setSheet(null)} style={{ position: 'absolute', inset: 0, background: 'var(--color-dim)' }} />
      <div role="dialog" aria-modal style={{ position: 'relative', width: '100%', maxWidth: 440, margin: mob ? 0 : '0 24px', padding: '24px 20px 28px', borderRadius: mob ? 'var(--radius-xxl) var(--radius-xxl) 0 0' : 'var(--radius-xxl)', background: 'var(--color-surface-2)', boxShadow: 'var(--elevation-2)', ...col(20) }}>
        {sheet.type === 'posted' && (
          <div style={col(8)}>
            <span style={{ ...row(6), font: '700 13px/18px var(--font-sans)', color: 'var(--color-success)' }}><Icon name="circle-check" size={18} />{sheet.stepLabel}</span>
            <span style={{ font: '700 20px/26px var(--font-sans)' }}>게시되었습니다</span>
            <span style={{ font: 'var(--font-paragraph4)', color: 'var(--color-on-view-2)' }}>같은 글이 피드와 {sheet.name} 타임라인에 함께 올라갔어요. 링크를 공유하면 프로젝트 전체를 보여줄 수 있어요.</span>
          </div>
        )}
        {sheet.type === 'share' && (
          <div style={col(8)}>
            <span style={{ font: '700 20px/26px var(--font-sans)' }}>{sheet.name} 링크 공유</span>
            <span style={{ font: 'var(--font-paragraph4)', color: 'var(--color-on-view-2)' }}>링크 하나로 소개와 개발 기록을 모두 볼 수 있어요.</span>
          </div>
        )}
        {sheet.type === 'confirm' ? (
          <>
            <div style={col(8)}>
              <span style={{ font: '700 20px/26px var(--font-sans)' }}>{sheet.title}</span>
              <span style={{ font: 'var(--font-paragraph4)', color: 'var(--color-on-view-2)', textWrap: 'pretty' }}>{sheet.desc}</span>
            </div>
            <div style={row(8)}>
              <OutlinedButton size="lg" style={{ flex: 1 }} onClick={() => setSheet(null)}>취소</OutlinedButton>
              <ContainedButton kind="secondary" size="lg" style={{ flex: 1 }} onClick={confirmSheet}>{sheet.confirmLabel}</ContainedButton>
            </div>
          </>
        ) : (
          <>
            <div style={{ ...row(8), padding: '6px 6px 6px 14px', borderRadius: 'var(--radius-md)', boxShadow: 'inset 0 0 0 1px var(--color-outline-2)' }}>
              <span style={{ flex: 1, minWidth: 0, font: '500 13px/18px ui-monospace,Menlo,monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sheet.url}</span>
              <ContainedButton size="sm" kind="secondary" onClick={() => { navigator.clipboard?.writeText('https://' + sheet.url).catch(() => {}); toast('링크가 복사되었습니다'); }}>링크 복사</ContainedButton>
            </div>
            <div style={row(8)}>
              <OutlinedButton size="lg" style={{ flex: 1 }} onClick={() => go(`/p/${sheet.pid}`)}>타임라인 보기</OutlinedButton>
              <ContainedButton size="lg" style={{ flex: 1 }} onClick={() => go('/')}>피드 보기</ContainedButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ToastLayer({ bottom }: { bottom: number }) {
  const { toastMsg } = useStore();
  if (!toastMsg) return null;
  return (
    <div style={{ position: 'fixed', left: 0, right: 0, bottom, zIndex: 4, display: 'flex', justifyContent: 'center', pointerEvents: 'none', padding: '0 16px' }}>
      <Toast title={toastMsg} />
    </div>
  );
}
