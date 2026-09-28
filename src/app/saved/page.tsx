'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon, IconButton } from '@/components/ds';
import { col, EmptyBox, ellipsis, muted, row, thumbIcon } from '@/components/ui';
import { ago, summary } from '@/lib/data';
import { useIsMobile, useStore } from '@/lib/store';

export default function SavedPage() {
  const { s, allPosts, proj, toggleSave } = useStore();
  const router = useRouter();
  const mob = useIsMobile();
  const list = allPosts.filter((p) => s.saved[p.id]);
  return (
    <div style={{ maxWidth: mob ? '100%' : 640, margin: '0 auto', padding: mob ? '20px 20px 32px' : '32px 24px 64px', ...col(8) }}>
      <h1 style={{ margin: 0, font: '700 24px/32px var(--font-sans)' }}>저장</h1>
      <span style={{ ...row(4), ...muted, paddingBottom: 12 }}><Icon name="lock" size={12} />저장한 글은 나만 볼 수 있어요</span>
      {list.map((p) => (
        <div key={p.id} style={{ ...row(12), padding: '12px 0', boxShadow: 'inset 0 -1px 0 var(--color-outline-1)' }}>
          <Link href={`/posts/${p.id}`} style={{ flex: 1, minWidth: 0, ...row(12) }}>
            <span style={{ flex: 'none', width: 64, height: 64, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-on-view-3)' }}>
              <Icon name={thumbIcon(p)} size={20} />
            </span>
            <span style={{ flex: 1, minWidth: 0, ...col(4) }}>
              <span style={{ font: 'var(--font-body2)', ...ellipsis }}>{summary(p)}</span>
              <span style={muted}>{proj(p.pid)!.name} · {ago(p.ago)}</span>
            </span>
          </Link>
          <IconButton icon="bookmark" weight="fill" size={mob ? 'lg' : 'md'} ariaLabel="저장 해제" onClick={() => toggleSave(p.id)} />
        </div>
      ))}
      {list.length === 0 && <EmptyBox icon="bookmark" title="저장한 글이 없어요" desc="피드에서 북마크를 누르면 여기에 모여요." action="피드 둘러보기" onAction={() => router.push('/')} />}
    </div>
  );
}
