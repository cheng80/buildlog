'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { ContainedButton, FilterChip, GhostButton, IconButton, OutlinedButton } from '@/components/ds';
import { AdBadge, col, EmptyBox, hairline, Initial, muted, PostCard, row } from '@/components/ui';
import { OFFICIAL, P, type Official, type Post } from '@/lib/data';
import { useIsMobile, useStore } from '@/lib/store';

export default function FeedPage() {
  const { s, set, allPosts, proj, needMine, toast } = useStore();
  const router = useRouter();
  const mob = useIsMobile();

  // Featured slot: the project with a live order, otherwise a demo project.
  const live = s.orders.find((o) => o.status === 'live' && proj(o.pid));
  const ad = (live && proj(live.pid)) || P.ledger;

  const posts = s.tab === 'following' ? allPosts.filter((p) => s.followed[p.pid]) : allPosts;

  // Consecutive posts from one project fold into a single card (latest first, "이전 글 N개 펼치기").
  const groups: { pid: string; key: string; items: Post[] }[] = [];
  for (const p of posts) {
    const g = groups[groups.length - 1];
    if (g && g.pid === p.pid) g.items.push(p);
    else groups.push({ pid: p.pid, key: p.id, items: [p] });
  }
  const cards: ReactNode[] = [];
  for (const g of groups) {
    const n = g.items.length - 1;
    if (n > 0 && s.expanded[g.key]) g.items.forEach((p, i) => cards.push(<PostCard key={p.id} p={p} expandKey={g.key} collapse={i === n} />));
    else cards.push(<PostCard key={g.items[0].id} p={g.items[0]} expandKey={g.key} hiddenCount={n} />);
  }

  // Official cards sit after the 2nd card and then every 5th card, never on the following tab.
  const out: ReactNode[] = [];
  if (s.tab === 'following') out.push(...cards);
  else {
    const offs = [...s.approved, ...OFFICIAL];
    let oi = 0;
    cards.forEach((c, i) => {
      out.push(c);
      if ((i === 1 || (i > 1 && (i - 1) % 5 === 0)) && oi < offs.length) {
        const o = offs[oi++];
        out.push(<OfficialCard key={'off-' + o.id} o={o} onCta={
          o.act === 'compose' ? () => needMine('/compose') : o.act === 'external' ? () => toast('외부 사이트로 이동합니다') : () => router.push(`/p/${o.act}`)
        } />);
      }
    });
  }

  return (
    <>
      {mob && (
        <div style={{ position: 'sticky', top: 0, zIndex: 2, background: 'var(--color-background)', ...row(0), height: 56, padding: '0 8px 0 20px', boxShadow: 'inset 0 -1px 0 var(--color-outline-1)' }}>
          <span style={{ font: '800 20px/26px var(--font-sans)' }}>buildlog</span>
          <div style={{ marginLeft: 'auto' }}><IconButton icon="search" size="lg" ariaLabel="검색" onClick={() => router.push('/explore')} /></div>
        </div>
      )}
      <div style={{ maxWidth: mob ? '100%' : 1016, margin: '0 auto', display: 'flex', gap: 48, padding: mob ? 0 : '8px 24px 0', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0, ...col(0) }}>
          {mob && (
            <div style={{ padding: '12px 20px 0' }}>
              <div style={{ ...row(12), padding: 12, ...hairline() }}>
                <span style={{ flex: 'none', width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 16px/20px var(--font-sans)', color: 'var(--color-on-view-2)' }}>{ad.name.slice(0, 1)}</span>
                <div style={{ flex: 1, minWidth: 0, ...col(2) }}>
                  <div style={row(6)}><AdBadge /><span style={muted}>Featured</span></div>
                  <span style={{ font: '700 14px/18px var(--font-sans)' }}>{ad.name} <span style={{ fontWeight: 400, color: 'var(--color-on-view-2)' }}>· {ad.line}</span></span>
                </div>
                <IconButton icon="chevron-right" ariaLabel="광고 프로젝트 보기" onClick={() => router.push(`/p/${ad.id}`)} />
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, padding: mob ? '16px 20px 4px' : '16px 0 4px' }}>
            <FilterChip selected={s.tab === 'latest'} onClick={() => set({ tab: 'latest' })}>최신</FilterChip>
            <FilterChip selected={s.tab === 'following'} onClick={() => set({ tab: 'following' })}>팔로잉</FilterChip>
          </div>
          {out.length === 0 && (
            <div style={{ margin: '24px 20px' }}>
              <EmptyBox icon="folder-heart" title="팔로우한 프로젝트가 없어요" desc="프로젝트를 팔로우하면 다음 글이 이 탭에 떠요. 알림은 보내지 않습니다." action="최신 글 둘러보기" onAction={() => set({ tab: 'latest' })} />
            </div>
          )}
          {out}
          {out.length > 0 && <p style={{ margin: 0, padding: '32px 20px', textAlign: 'center', ...muted }}>최신순 · 같은 프로젝트의 연속 글은 한 장으로 접어서 보여요</p>}
        </div>

        {!mob && (
          <aside style={{ flex: 'none', width: 320, position: 'sticky', top: 88, ...col(16) }}>
            <div style={{ ...col(12), padding: 20, ...hairline('var(--radius-xxl)') }}>
              <span style={{ font: '700 14px/18px var(--font-sans)' }}>내 프로젝트</span>
              {s.mine ? (
                <>
                  <button type="button" onClick={() => router.push(`/p/${s.mine!.id}`)} style={{ border: 0, background: 'transparent', padding: 0, cursor: 'pointer', textAlign: 'left', ...row(12), color: 'var(--color-on-view-1)' }}>
                    <Initial name={s.mine.name} />
                    <span style={{ ...col(2), minWidth: 0 }}><span style={{ font: '700 14px/18px var(--font-sans)' }}>{s.mine.name}</span><span style={muted}>기록 {s.posts.length}개</span></span>
                  </button>
                  <ContainedButton kind="tertiary" icon="plus" fullWidth onClick={() => needMine('/compose')}>오늘 만든 것 올리기</ContainedButton>
                </>
              ) : (
                <>
                  <span style={{ font: 'var(--font-paragraph4)', color: 'var(--color-on-view-2)' }}>프로젝트를 만들면 글이 타임라인에 쌓여요.</span>
                  <ContainedButton kind="tertiary" fullWidth onClick={() => needMine('/compose')}>프로젝트 만들기</ContainedButton>
                </>
              )}
            </div>
            <div style={{ ...col(12), padding: 20, ...hairline('var(--radius-xxl)') }}>
              <div style={row(6)}><AdBadge /><span style={muted}>Featured · 자연 피드와 따로 보여요</span></div>
              <div style={{ aspectRatio: '16/10', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '500 12px/16px ui-monospace,Menlo,monospace', color: 'var(--color-on-view-3)' }}>대표 이미지</div>
              <div style={col(4)}>
                <span style={{ font: '700 16px/20px var(--font-sans)' }}>{ad.name}</span>
                <span style={{ font: 'var(--font-paragraph4)', color: 'var(--color-on-view-2)' }}>{ad.line}</span>
              </div>
              <OutlinedButton fullWidth onClick={() => router.push(`/p/${ad.id}`)}>프로젝트 보기</OutlinedButton>
            </div>
            <span style={{ ...muted, padding: '0 4px' }}>문의 contact@buildlog.example · 데모 프로젝트는 예시입니다</span>
          </aside>
        )}
      </div>
    </>
  );
}

function OfficialCard({ o, onCta }: { o: Official; onCta: () => void }) {
  const mob = useIsMobile();
  return (
    <article style={{ padding: mob ? 20 : '24px 0', boxShadow: 'inset 0 -1px 0 var(--color-outline-1)' }}>
      <div style={{ ...col(12), padding: 20, borderRadius: 'var(--radius-xxl)', background: 'var(--color-primary-container)' }}>
        <div style={row(6)}>
          <span style={{ font: '700 11px/14px var(--font-sans)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>공식</span>
          <span style={{ font: '700 13px/18px var(--font-sans)', color: 'var(--color-on-primary-container)' }}>{o.kindLabel}</span>
        </div>
        <span style={{ font: '700 20px/26px var(--font-sans)', textWrap: 'pretty' }}>{o.title}</span>
        <span style={{ font: 'var(--font-paragraph4)', color: 'var(--color-on-view-2)', textWrap: 'pretty' }}>{o.body}</span>
        <div style={{ ...row(12), justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <span style={muted}>{o.source}</span>
          <GhostButton color="onViewPrimary" size="sm" arrow onClick={onCta}>{o.cta}</GhostButton>
        </div>
      </div>
    </article>
  );
}
