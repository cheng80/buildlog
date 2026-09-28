'use client';

import Link from 'next/link';
import { ago, type Project } from '@/lib/data';
import { useStore } from '@/lib/store';
import { Icon } from './ds';
import { col, DemoBadge, ellipsis, hairline, Initial, muted, row } from './ui';

/** "개발 중 · 최근 3시간 전" under a project name. */
export function useProjectMeta() {
  const { allPosts } = useStore();
  return (p: Project) => {
    const last = allPosts.find((x) => x.pid === p.id);
    return p.stage + ' · ' + (last ? '최근 ' + ago(last.ago) : '기록 없음');
  };
}

export function ProjectRow({ p }: { p: Project }) {
  const meta = useProjectMeta();
  return (
    <Link href={`/p/${p.id}`} style={{ ...row(14), padding: 14, ...hairline() }}>
      <Initial name={p.name} size={48} font="800 20px/26px var(--font-sans)" />
      <span style={{ flex: 1, minWidth: 0, ...col(2) }}>
        <span style={{ font: '700 15px/20px var(--font-sans)' }}>{p.name}</span>
        <span style={{ font: 'var(--font-body3)', color: 'var(--color-on-view-2)', ...ellipsis }}>{p.line}</span>
        <span style={muted}>{meta(p)}</span>
      </span>
      <Icon name="chevron-right" size={18} color="var(--color-on-view-3)" />
    </Link>
  );
}

export function ProjectTile({ p }: { p: Project }) {
  const meta = useProjectMeta();
  return (
    <Link href={`/p/${p.id}`} style={{ ...col(12), padding: 16, ...hairline('var(--radius-xxl)') }}>
      <span style={row(12)}>
        <Initial name={p.name} font="800 18px/22px var(--font-sans)" />
        <span style={{ ...col(2), minWidth: 0 }}>
          <span style={row(6)}><span style={{ font: '700 15px/20px var(--font-sans)' }}>{p.name}</span>{p.demo && <DemoBadge />}</span>
          <span style={muted}>{meta(p)}</span>
        </span>
      </span>
      <span style={{ font: 'var(--font-paragraph4)', color: 'var(--color-on-view-2)' }}>{p.line}</span>
      <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {p.tech.map((t) => <span key={t} style={{ font: '500 11px/14px var(--font-sans)', padding: '4px 8px', borderRadius: 999, background: 'var(--color-surface-1)', color: 'var(--color-on-view-2)' }}>{t}</span>)}
      </span>
    </Link>
  );
}
