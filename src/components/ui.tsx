'use client';

// Building blocks shared by several screens of the prototype (post card, media cards, badges, headers).

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CSSProperties, ReactNode } from 'react';
import { ago, type Post, type Project } from '@/lib/data';
import { useIsMobile, useStore } from '@/lib/store';
import { Avatar, FilterChip, GhostButton, Icon, IconButton, OutlinedButton } from './ds';

export const col = (gap: number, extra?: CSSProperties): CSSProperties => ({ display: 'flex', flexDirection: 'column', gap, ...extra });
export const row = (gap: number, extra?: CSSProperties): CSSProperties => ({ display: 'flex', alignItems: 'center', gap, ...extra });
export const hairline = (r = 'var(--radius-lg)'): CSSProperties => ({ borderRadius: r, boxShadow: 'inset 0 0 0 1px var(--color-outline-2)' });
export const muted: CSSProperties = { font: 'var(--font-body4)', color: 'var(--color-on-view-3)' };
export const ellipsis: CSSProperties = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const mono = '500 12px/16px ui-monospace,Menlo,monospace';

/** 3-step progress bar of the first-post flow (project → post → share). */
export function Steps({ done }: { done: number }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[0, 1, 2].map((i) => <span key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i < done ? 'var(--color-primary)' : 'var(--color-surface-1)' }} />)}
    </div>
  );
}

export function DemoBadge() {
  return <span style={{ font: '700 11px/14px var(--font-sans)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', boxShadow: 'inset 0 0 0 1px var(--color-outline-2)', color: 'var(--color-on-view-2)' }}>데모</span>;
}

export function AdBadge() {
  return <span style={{ font: '700 11px/14px var(--font-sans)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', background: 'var(--violet-vibrant)', color: '#fff' }}>광고</span>;
}

export function ReleasePill({ version }: { version?: string }) {
  return <span style={{ font: '700 12px/16px var(--font-sans)', padding: '3px 8px', borderRadius: 999, background: 'var(--color-inverse-surface)', color: 'var(--color-on-inverse-surface)' }}>Release {version}</span>;
}

export function Initial({ name, size = 44, font = '700 16px/20px var(--font-sans)', radius = 'var(--radius-md)' }: { name: string; size?: number; font?: string; radius?: string }) {
  return (
    <span style={{ flex: 'none', width: size, height: size, borderRadius: radius, background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', font }}>
      {name.slice(0, 1)}
    </span>
  );
}

export function Changes({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 18, ...col(4), font: 'var(--font-paragraph4)', color: 'var(--color-on-view-2)' }}>
      {items.map((c, i) => <li key={i}>{c}</li>)}
    </ul>
  );
}

export function ReleaseBox({ version, title, changes, titleSize = 14 }: { version?: string; title?: string; changes: string[]; titleSize?: number }) {
  return (
    <div style={{ ...col(8), padding: 16, ...hairline() }}>
      <div style={row(8)}><ReleasePill version={version} /><span style={{ font: `700 ${titleSize}px/${titleSize + 4}px var(--font-sans)` }}>{title}</span></div>
      <Changes items={changes} />
    </div>
  );
}

/** Back/close row at the top of sub screens. */
export function TopRow({ title, icon = 'chevron-left', onClose, right }: { title: ReactNode; icon?: string; onClose?: () => void; right?: ReactNode }) {
  const { goBack } = useStore();
  const mob = useIsMobile();
  return (
    <div style={{ ...row(8), marginLeft: -8 }}>
      <IconButton icon={icon} size={mob ? 'lg' : 'md'} ariaLabel={icon === 'x' ? '닫기' : '뒤로'} onClick={onClose || goBack} />
      <span style={{ font: '700 16px/20px var(--font-sans)' }}>{title}</span>
      {right && <div style={{ marginLeft: 'auto' }}>{right}</div>}
    </div>
  );
}

export function EmptyBox({ icon, title, desc, action, onAction }: { icon?: string; title: string; desc: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ padding: '40px 24px', borderRadius: 'var(--radius-xxl)', background: 'var(--color-surface-1)', ...col(12, { alignItems: 'center', textAlign: 'center' }) }}>
      {icon && <Icon name={icon} size={28} color="var(--color-on-view-3)" />}
      <span style={{ font: '700 16px/20px var(--font-sans)' }}>{title}</span>
      <span style={{ font: 'var(--font-paragraph4)', color: 'var(--color-on-view-2)', maxWidth: 280 }}>{desc}</span>
      {action && <OutlinedButton onClick={onAction}>{action}</OutlinedButton>}
    </div>
  );
}

/** Map placeholder until the Kakao Maps key is wired in. Only a district's representative point is ever shown. */
export function MapBox({ label, height, size, note }: { label: string; height: number; size: number; note?: boolean }) {
  return (
    <div style={{ position: 'relative', height, borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-1)', boxShadow: 'inset 0 0 0 1px var(--color-outline-1)', ...col(6, { alignItems: 'center', justifyContent: 'center' }), color: 'var(--color-on-view-3)' }}>
      <span style={{ color: 'var(--color-primary)', display: 'flex' }}><Icon name="map-pin" weight="fill" size={size} /></span>
      <span style={{ font: '500 12px/16px ui-monospace,Menlo,monospace' }}>{label}</span>
      {note && <span style={{ position: 'absolute', left: 12, bottom: 10, font: 'var(--font-body5)' }}>시·군·구 대표 좌표만 표시돼요</span>}
    </div>
  );
}

export function InfoRows({ rows }: { rows: { k: string; v: string }[] }) {
  return (
    <div style={{ ...col(0), padding: '4px 16px', ...hairline() }}>
      {rows.map((r) => (
        <div key={r.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 0', font: 'var(--font-body2)', boxShadow: 'inset 0 -1px 0 var(--color-outline-1)' }}>
          <span style={{ color: 'var(--color-on-view-3)' }}>{r.k}</span>
          <span style={{ fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{r.v}</span>
        </div>
      ))}
    </div>
  );
}

export const linkIcon = (p: Post) => (p.media === 'github' ? 'github' : p.media === 'youtube' ? 'youtube' : 'globe');
export const thumbIcon = (p: Post) =>
  p.kind === 'release' ? 'tag' : p.media === 'image' ? 'image' : p.media === 'youtube' ? 'youtube' : p.media === 'github' ? 'github' : p.media === 'web' ? 'globe' : 'text';

export function LinkCard({ icon, label, kind, external }: { icon: string; label?: string; kind: string; external?: boolean }) {
  return (
    <div style={{ ...row(12), padding: '12px 14px', ...hairline() }}>
      <span style={{ flex: 'none', width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={20} />
      </span>
      <div style={{ flex: 1, minWidth: 0, ...col(2) }}>
        <span style={{ font: '700 13px/18px var(--font-sans)', ...ellipsis }}>{label}</span>
        <span style={muted}>{kind}</span>
      </div>
      {external && <Icon name="external-link" size={16} color="var(--color-on-view-3)" />}
    </div>
  );
}

/** Image / YouTube / link / Release attachment of a post. `detail` switches to the post-detail sizes. */
export function PostMedia({ p, detail, onOpen }: { p: Post; detail?: boolean; onOpen?: () => void }) {
  const click: CSSProperties = onOpen ? { cursor: 'pointer' } : {};
  if (p.media === 'image')
    return (
      <div onClick={onOpen} style={{ ...click, aspectRatio: detail ? '4/3' : '1/1', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-1)', boxShadow: 'inset 0 0 0 1px var(--color-outline-1)', ...col(8, { alignItems: 'center', justifyContent: 'center' }), color: 'var(--color-on-view-3)' }}>
        <Icon name="image" size={detail ? 32 : 28} weight="thin" />
        <span style={{ font: mono }}>{p.mediaLabel}{detail && ' · 원본 비율'}</span>
      </div>
    );
  if (p.media === 'youtube')
    return (
      <div onClick={onOpen} style={{ ...click, ...col(0), borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'inset 0 0 0 1px var(--color-outline-2)' }}>
        <div style={{ aspectRatio: '16/9', background: '#171717', ...col(8, { alignItems: 'center', justifyContent: 'center' }), color: '#ffffffa6' }}>
          <span style={{ width: detail ? 64 : 56, height: detail ? 64 : 56, borderRadius: 999, background: 'var(--color-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Icon name="play" weight="fill" size={detail ? 28 : 24} />
          </span>
          {!detail && <span style={{ font: mono }}>영상 썸네일</span>}
        </div>
        <div style={{ ...row(8), padding: '12px 14px' }}>
          <Icon name="youtube" size={18} color="var(--color-error)" />
          <span style={{ font: '500 13px/18px var(--font-sans)', flex: 1, minWidth: 0, ...ellipsis }}>{p.mediaLabel}</span>
        </div>
      </div>
    );
  if (p.media === 'github' || p.media === 'web')
    return <LinkCard icon={linkIcon(p)} label={p.mediaLabel} kind={p.media === 'github' ? 'GitHub' : '웹 링크'} external={detail} />;
  if (p.kind === 'release') return <ReleaseBox version={p.version} title={p.releaseTitle} changes={p.changes || []} titleSize={detail ? 16 : 14} />;
  return null;
}

/** Like / share / save row. */
export function ActionRow({ p, project }: { p: Post; project: Project }) {
  const { s, toggleLike, toggleSave, openShare } = useStore();
  const mob = useIsMobile();
  const size = mob ? 'lg' : 'md';
  const liked = !!s.liked[p.id];
  return (
    <div style={{ ...row(0), margin: '-4px 0 -4px -8px' }}>
      <IconButton icon="heart" active={liked} size={size} ariaLabel="좋아요" onClick={() => toggleLike(p.id)} style={liked ? { color: 'var(--color-error)' } : undefined} />
      <IconButton icon="share" size={size} ariaLabel="공유" onClick={() => openShare(project)} />
      <span style={{ flex: 1 }} />
      <IconButton icon="bookmark" active={!!s.saved[p.id]} size={size} ariaLabel="저장" onClick={() => toggleSave(p.id)} />
    </div>
  );
}

/** Author line: avatar, owner, handle · time. */
export function AuthorLine({ p, project, avatar = 32, nameSize = 14, right }: { p: Post; project: Project; avatar?: number; nameSize?: number; right?: ReactNode }) {
  return (
    <div style={row(10)}>
      <Link href={`/u/${project.handle}`} aria-label="프로필 보기" style={{ display: 'flex' }}><Avatar size={avatar} /></Link>
      <Link href={`/u/${project.handle}`} style={{ flex: 1, minWidth: 0, ...col(2) }}>
        <span style={row(6)}><span style={{ font: `700 ${nameSize}px/${nameSize + 4}px var(--font-sans)` }}>{project.owner}</span>{project.demo && <DemoBadge />}</span>
        <span style={muted}>@{project.handle} · {ago(p.ago)}</span>
      </Link>
      {right}
    </div>
  );
}

/** One post in the feed. Consecutive posts of the same project fold into one card with an expand toggle. */
export function PostCard({ p, hiddenCount = 0, expandKey, collapse }: { p: Post; hiddenCount?: number; expandKey?: string; collapse?: boolean }) {
  const { proj, askReport, toggleExpanded } = useStore();
  const router = useRouter();
  const mob = useIsMobile();
  const pr = proj(p.pid)!;
  const open = () => router.push(`/posts/${p.id}`);
  return (
    <article style={{ ...col(12), padding: mob ? 20 : '24px 0', boxShadow: 'inset 0 -1px 0 var(--color-outline-1)' }}>
      <AuthorLine p={p} project={pr} right={<IconButton icon="ellipsis" size={mob ? 'lg' : 'md'} ariaLabel="더보기" onClick={() => askReport(p.id)} />} />
      <PostMedia p={p} onOpen={open} />
      <ActionRow p={p} project={pr} />
      {p.text && <p onClick={open} style={{ cursor: 'pointer', margin: 0, font: 'var(--font-paragraph3)', textWrap: 'pretty' }}>{p.text}</p>}
      <div style={{ ...row(8), flexWrap: 'wrap' }}>
        <FilterChip size="sm" startIcon="folder" endIcon="chevron-right" onClick={() => router.push(`/p/${pr.id}`)}>{pr.name}</FilterChip>
        {expandKey && hiddenCount > 0 && <GhostButton size="sm" color="onView2" weight="medium" disclosure={false} onClick={() => toggleExpanded(expandKey)}>이전 글 {hiddenCount}개 펼치기</GhostButton>}
        {expandKey && collapse && <GhostButton size="sm" color="onView2" weight="medium" onClick={() => toggleExpanded(expandKey)}>접기</GhostButton>}
      </div>
    </article>
  );
}
