'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ContainedButton, GhostButton, Icon, IconButton, OutlinedButton } from '@/components/ds';
import { Changes, col, DemoBadge, EmptyBox, ellipsis, Initial, linkIcon, muted, ReleasePill, row } from '@/components/ui';
import { ago } from '@/lib/data';
import { useIsMobile, useStore } from '@/lib/store';

const chip = { font: '500 12px/16px var(--font-sans)', padding: '6px 10px', borderRadius: 999 };

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { s, proj, allPosts, needMine, openShare, toggleFollow } = useStore();
  const router = useRouter();
  const mob = useIsMobile();
  const pr = proj(id);

  if (!pr) return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>
      <EmptyBox title="프로젝트를 찾을 수 없어요" desc="삭제되었거나 주소가 바뀌었어요." action="피드 둘러보기" onAction={() => router.push('/')} />
    </div>
  );

  const isMine = pr.id === s.mine?.id;
  const fol = !!s.followed[pr.id];
  const tl = allPosts.filter((p) => p.pid === pr.id);
  const count = (m: Record<string, boolean>) => tl.filter((p) => m[p.id]).length;

  return (
    <>
      {mob && (
        <div style={{ position: 'sticky', top: 0, zIndex: 2, background: 'var(--color-background)', ...row(0), height: 56, padding: '0 8px', boxShadow: 'inset 0 -1px 0 var(--color-outline-1)' }}>
          <IconButton icon="chevron-left" size="lg" ariaLabel="뒤로" onClick={() => router.push('/')} />
          <span style={{ font: '700 16px/20px var(--font-sans)' }}>{pr.name}</span>
          <div style={{ marginLeft: 'auto' }}><IconButton icon="share" size="lg" ariaLabel="공유" onClick={() => openShare(pr)} /></div>
        </div>
      )}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: mob ? '20px 20px 32px' : '32px 24px 64px', ...col(28) }}>
        {!mob && (
          <nav aria-label="breadcrumb" style={{ ...row(2), font: 'var(--font-body3)' }}>
            <Link href="/" style={{ color: 'var(--color-on-view-3)' }}>피드</Link>
            <Icon name="chevron-right" size={14} color="var(--color-on-view-3)" />
            <span aria-current="page" style={{ fontWeight: 700 }}>{pr.name}</span>
          </nav>
        )}
        <div style={col(16)}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <Initial name={pr.name} size={72} font="800 28px/36px var(--font-sans)" radius="var(--radius-lg)" />
            <div style={{ flex: 1, minWidth: 0, ...col(6) }}>
              <div style={{ ...row(8), flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, font: '700 24px/32px var(--font-sans)' }}>{pr.name}</h1>
                {pr.demo && <DemoBadge />}
              </div>
              <span style={{ font: 'var(--font-paragraph3)', color: 'var(--color-on-view-2)', textWrap: 'pretty' }}>{pr.line}</span>
              <Link href={`/u/${pr.handle}`} style={muted}>{pr.owner} · @{pr.handle} · {pr.stage}</Link>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {pr.tech.map((t) => <span key={t} style={{ ...chip, background: 'var(--color-surface-1)', color: 'var(--color-on-view-2)' }}>{t}</span>)}
            {pr.links.map((l) => <span key={l} style={{ ...chip, display: 'inline-flex', alignItems: 'center', gap: 4, boxShadow: 'inset 0 0 0 1px var(--color-outline-2)' }}><Icon name="link" size={12} />{l}</span>)}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {isMine ? (
              <>
                <ContainedButton size="lg" icon="plus" style={{ flex: 1 }} onClick={() => needMine('/compose')}>올리기</ContainedButton>
                <OutlinedButton size="lg" icon="tag" onClick={() => router.push(`/p/${pr.id}/release`)}>Release</OutlinedButton>
              </>
            ) : (
              <ContainedButton kind={fol ? 'tertiary' : 'primary'} size="lg" icon={fol ? 'check' : 'plus'} style={{ flex: 1 }} onClick={() => toggleFollow(pr.id)}>{fol ? '팔로잉' : '프로젝트 팔로우'}</ContainedButton>
            )}
            <OutlinedButton size="lg" icon="link" onClick={() => openShare(pr)}>링크 공유</OutlinedButton>
          </div>
          {isMine && (
            <>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <GhostButton size="sm" color="onView2" weight="medium" arrow onClick={() => router.push(`/p/${pr.id}/edit`)}>프로젝트 편집</GhostButton>
                <GhostButton size="sm" color="onView2" weight="medium" arrow onClick={() => router.push('/promote')}>Featured로 홍보하기</GhostButton>
              </div>
              <div style={{ ...row(12), flexWrap: 'wrap', padding: '12px 16px', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-1)', font: 'var(--font-body3)', color: 'var(--color-on-view-2)' }}>
                <span style={{ ...row(4), color: 'var(--color-on-view-3)' }}><Icon name="lock" size={14} />나에게만 보여요</span>
                <span>좋아요 <b style={{ color: 'var(--color-on-view-1)' }}>{count(s.liked)}</b></span>
                <span>저장 <b style={{ color: 'var(--color-on-view-1)' }}>{count(s.saved)}</b></span>
                <span>팔로우 <b style={{ color: 'var(--color-on-view-1)' }}>0</b></span>
              </div>
            </>
          )}
        </div>

        <div style={col(4)}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 12 }}>
            <span style={{ font: '700 18px/22px var(--font-sans)' }}>타임라인</span>
            <span style={muted}>기록 {tl.length}개 · 시간순</span>
          </div>
          {tl.length === 0 && (
            isMine
              ? <EmptyBox title="첫 기록을 올려 주세요" desc="스크린샷 한 장이나 링크 하나면 충분해요." action="올리기" onAction={() => needMine('/compose')} />
              : <EmptyBox title="아직 기록이 없어요" desc="첫 글이 올라오면 여기에 쌓여요." />
          )}
          {tl.map((e) => {
            const rel = e.kind === 'release';
            const dot = rel ? 12 : 8;
            const embed = e.media === 'youtube' || e.media === 'github' || e.media === 'web';
            return (
              <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '24px minmax(0,1fr)', gap: 14 }}>
                <div style={{ ...col(0), alignItems: 'center' }}>
                  <span style={{ width: dot, height: dot, marginTop: 6, borderRadius: 999, background: rel || e.ago < 0 ? 'var(--color-primary)' : 'var(--color-on-view-3)', boxShadow: '0 0 0 4px var(--color-background)' }} />
                  <span style={{ flex: 1, width: 1, background: 'var(--color-outline-2)', marginTop: 6 }} />
                </div>
                <Link href={`/posts/${e.id}`} style={{ ...col(10), paddingBottom: 28 }}>
                  <div style={{ ...row(8), flexWrap: 'wrap' }}>
                    {rel && <ReleasePill version={e.version} />}
                    <span style={muted}>{ago(e.ago)}</span>
                    {e.ago < 0 && <span style={{ font: '700 11px/14px var(--font-sans)', color: 'var(--color-on-view-primary)' }}>방금 올린 글 · 피드에도 떠요</span>}
                  </div>
                  {rel && <><span style={{ font: '700 16px/20px var(--font-sans)' }}>{e.releaseTitle}</span><Changes items={e.changes || []} /></>}
                  {e.text && <p style={{ margin: 0, font: 'var(--font-paragraph3)', textWrap: 'pretty' }}>{e.text}</p>}
                  {e.media === 'image' && (
                    <div style={{ width: 'min(100%,280px)', aspectRatio: '4/3', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-1)', boxShadow: 'inset 0 0 0 1px var(--color-outline-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '500 11px/14px ui-monospace,Menlo,monospace', color: 'var(--color-on-view-3)' }}>{e.mediaLabel}</div>
                  )}
                  {embed && (
                    <div style={{ ...row(10), padding: '10px 12px', borderRadius: 'var(--radius-md)', boxShadow: 'inset 0 0 0 1px var(--color-outline-2)', maxWidth: 420 }}>
                      <Icon name={linkIcon(e)} size={18} />
                      <span style={{ font: '500 13px/18px var(--font-sans)', flex: 1, minWidth: 0, ...ellipsis }}>{e.mediaLabel}</span>
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
