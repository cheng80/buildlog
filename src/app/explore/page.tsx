'use client';

import { FilterChip, TextField } from '@/components/ds';
import { ProjectTile } from '@/components/ProjectRow';
import { col, EmptyBox, muted } from '@/components/ui';
import { CATS, P } from '@/lib/data';
import { useIsMobile, useStore } from '@/lib/store';
import { useState } from 'react';

export default function ExplorePage() {
  const { s } = useStore();
  const mob = useIsMobile();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const needle = q.trim().toLowerCase();
  const results = [...Object.values(P), ...(s.mine ? [s.mine] : [])].filter((p) =>
    (cat === 'all' || p.cat === cat) && (!needle || (p.name + ' ' + p.line + ' ' + p.tech.join(' ')).toLowerCase().includes(needle)));

  return (
    <div style={{ maxWidth: mob ? '100%' : 960, margin: '0 auto', padding: mob ? '20px 20px 32px' : '32px 24px 64px', ...col(16) }}>
      <h1 style={{ margin: 0, font: '700 24px/32px var(--font-sans)' }}>탐색</h1>
      <TextField label="프로젝트·기술 검색" value={q} onChange={setQ} clearable />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {CATS.map(([k, l]) => <FilterChip key={k} selected={cat === k} onClick={() => setCat(k)}>{l}</FilterChip>)}
      </div>
      <span style={muted}>프로젝트 {results.length}개</span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
        {results.map((p) => <ProjectTile key={p.id} p={p} />)}
      </div>
      {results.length === 0 && <EmptyBox title="검색 결과가 없어요" desc="다른 이름이나 기술로 찾아보세요." action="검색 지우기" onAction={() => { setQ(''); setCat('all'); }} />}
    </div>
  );
}
