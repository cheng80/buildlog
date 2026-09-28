'use client';

import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';
import { ContainedButton, FilterChip, TextField } from '@/components/ds';
import { col, muted, ReleaseBox, row, TopRow } from '@/components/ui';
import { linesOf } from '@/lib/data';
import { useGuard, useIsMobile, useStore } from '@/lib/store';

export default function ReleasePage() {
  const { id } = useParams<{ id: string }>();
  const ok = useGuard('mine');
  const { s, addPost } = useStore();
  const mob = useIsMobile();
  const [version, setVersion] = useState('');
  const [title, setTitle] = useState('');
  const [changes, setChanges] = useState('');
  if (!ok) return null;
  if (id !== s.mine?.id) notFound();

  const ready = !!(version.trim() && title.trim());
  const submit = () => {
    addPost({ text: '', media: 'none', kind: 'release', version: version.trim(), releaseTitle: title.trim(), changes: linesOf(changes) }, 'Release 게시 · 피드에 다시 떠요');
    setVersion(''); setTitle(''); setChanges('');
  };

  return (
    <div style={{ maxWidth: mob ? '100%' : 640, margin: '0 auto', padding: mob ? '8px 20px 32px' : '32px 24px 48px', ...col(20) }}>
      <TopRow icon="x" title="Release 작성" right={<ContainedButton disabled={!ready} onClick={submit}>게시하기</ContainedButton>} />
      <div style={row(8)}>
        <span style={muted}>프로젝트</span>
        <FilterChip size="sm" selected startIcon="folder">{s.mine!.name}</FilterChip>
      </div>
      <TextField label="버전" value={version} onChange={setVersion} helperText="형식은 자유예요. v1.0, 2026.09, alpha-2 모두 괜찮아요" />
      <TextField label="제목" value={title} onChange={setTitle} />
      <label style={col(8)}>
        <span style={{ font: '700 14px/18px var(--font-sans)' }}>바뀐 점</span>
        <textarea value={changes} onChange={(e) => setChanges(e.target.value)} rows={5} placeholder="한 줄에 하나씩 적어 주세요"
          style={{ width: '100%', resize: 'none', outline: 0, border: 0, borderRadius: 'var(--radius-md)', boxShadow: 'inset 0 0 0 1px var(--color-outline-2)', background: 'transparent', color: 'var(--color-on-view-1)', font: 'var(--font-paragraph3)', padding: '14px 16px' }} />
      </label>
      {ready && (
        <div style={col(8)}>
          <span style={muted}>미리보기 · 피드와 타임라인에 이렇게 보여요</span>
          <ReleaseBox version={version} title={title} changes={linesOf(changes)} />
        </div>
      )}
    </div>
  );
}
