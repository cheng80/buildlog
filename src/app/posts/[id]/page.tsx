'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Icon, IconButton, OutlinedButton } from '@/components/ds';
import { ActionRow, AuthorLine, col, EmptyBox, ellipsis, hairline, Initial, muted, PostMedia, row, TopRow } from '@/components/ui';
import { ago, summary } from '@/lib/data';
import { useIsMobile, useStore } from '@/lib/store';

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { allPosts, proj, askReport } = useStore();
  const router = useRouter();
  const mob = useIsMobile();
  const p = allPosts.find((x) => x.id === id);
  const pad = mob ? '8px 20px 32px' : '32px 24px 48px';

  if (!p) return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: pad, ...col(16) }}>
      <TopRow title="게시물" />
      <EmptyBox title="글을 찾을 수 없어요" desc="삭제되었거나 숨김 처리된 글이에요." action="피드 둘러보기" onAction={() => router.push('/')} />
    </div>
  );

  const pr = proj(p.pid)!;
  const others = allPosts.filter((x) => x.pid === p.pid && x.id !== p.id).slice(0, 3);
  return (
    <div style={{ maxWidth: mob ? '100%' : 640, margin: '0 auto', padding: pad, ...col(16) }}>
      <TopRow title="게시물" right={<IconButton icon="flag" size={mob ? 'lg' : 'md'} ariaLabel="신고" onClick={() => askReport(p.id)} />} />
      <AuthorLine p={p} project={pr} avatar={40} nameSize={15} />
      <PostMedia p={p} detail />
      {p.text && <p style={{ margin: 0, font: 'var(--font-paragraph2)', textWrap: 'pretty' }}>{p.text}</p>}
      <ActionRow p={p} project={pr} />
      <div style={{ ...row(12), padding: 16, ...hairline() }}>
        <Initial name={pr.name} size={48} font="800 20px/26px var(--font-sans)" />
        <div style={{ flex: 1, minWidth: 0, ...col(2) }}>
          <span style={{ font: '700 15px/20px var(--font-sans)' }}>{pr.name}</span>
          <span style={muted}>{pr.line}</span>
        </div>
        <OutlinedButton size="sm" onClick={() => router.push(`/p/${pr.id}`)}>프로젝트 보기</OutlinedButton>
      </div>
      {others.length > 0 && (
        <div style={{ ...col(4), paddingTop: 8 }}>
          <span style={{ font: '700 14px/18px var(--font-sans)', paddingBottom: 4 }}>이 프로젝트의 다른 기록</span>
          {others.map((o) => (
            <Link key={o.id} href={`/posts/${o.id}`} style={{ padding: '12px 0', ...row(12), boxShadow: 'inset 0 -1px 0 var(--color-outline-1)' }}>
              <span style={{ flex: 1, minWidth: 0, font: 'var(--font-body2)', ...ellipsis }}>{summary(o)}</span>
              <span style={muted}>{ago(o.ago)}</span>
              <Icon name="chevron-right" size={16} color="var(--color-on-view-3)" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
