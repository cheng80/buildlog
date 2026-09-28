'use client';

import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';
import { Callout, ContainedButton, FilterChip, GhostButton, TextField } from '@/components/ds';
import { col, muted, TopRow } from '@/components/ui';
import { projectUrl, STAGES, TECH, type Project } from '@/lib/data';
import { useGuard, useIsMobile, useStore } from '@/lib/store';

// Only the owner edits: the guard handles signed-out / no-project, and someone else's project is a 404.
export default function ProjectEditPage() {
  const { id } = useParams<{ id: string }>();
  const ok = useGuard('mine');
  const { s } = useStore();
  if (!ok || !s.mine) return null;
  if (id !== s.mine.id) notFound();
  return <EditForm mine={s.mine} />;
}

function EditForm({ mine }: { mine: Project }) {
  const { set, goBack, toast, setSheet } = useStore();
  const mob = useIsMobile();
  const [name, setName] = useState(mine.name);
  const [line, setLine] = useState(mine.line);
  const [link, setLink] = useState(mine.links[0] || '');
  const [stage, setStage] = useState(mine.stage);
  const [tech, setTech] = useState<Record<string, boolean>>(Object.fromEntries(mine.tech.map((t) => [t, true])));

  const save = () => {
    set({ mine: { ...mine, name: name.trim(), line: line.trim(), stage, links: link ? [link.replace(/^https?:\/\//, '')] : [], tech: Object.keys(tech).filter((t) => tech[t]) } });
    goBack();
    toast('저장되었습니다');
  };

  return (
    <div style={{ maxWidth: mob ? '100%' : 640, margin: '0 auto', padding: mob ? '8px 20px 32px' : '32px 24px 48px', ...col(24) }}>
      <TopRow title="프로젝트 편집" right={<ContainedButton disabled={!name.trim()} onClick={save}>저장</ContainedButton>} />
      <div style={col(12)}>
        <TextField label="프로젝트 이름" value={name} onChange={setName} />
        <TextField label="한 줄 소개" value={line} onChange={setLine} />
        <TextField label="대표 링크" value={link} onChange={setLink} placeholder="https://" />
      </div>
      <div style={col(12)}>
        <span style={{ font: '700 14px/18px var(--font-sans)' }}>단계</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {STAGES.map((t) => <FilterChip key={t} selected={stage === t} onClick={() => setStage(t)}>{t}</FilterChip>)}
        </div>
      </div>
      <div style={col(12)}>
        <span style={{ font: '700 14px/18px var(--font-sans)' }}>기술</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TECH.map((t) => <FilterChip key={t} selected={!!tech[t]} onClick={() => setTech((x) => ({ ...x, [t]: !x[t] }))}>{t}</FilterChip>)}
        </div>
      </div>
      <Callout icon="link">공개 링크는 이름을 바꿔도 그대로예요 · {projectUrl(mine.id)}</Callout>
      <div style={{ ...col(8), paddingTop: 16, boxShadow: 'inset 0 1px 0 var(--color-outline-1)' }}>
        <div>
          <GhostButton size="sm" color="onView2" weight="medium" onClick={() => setSheet({ type: 'confirm', title: '프로젝트를 삭제할까요?', desc: '모든 공개 경로에서 즉시 내려가고, 연결된 글도 함께 비공개돼요. 원문과 파일은 30일 뒤 정리됩니다.', confirmLabel: '삭제하기', action: 'delete' })}>프로젝트 삭제</GhostButton>
        </div>
        <span style={muted}>삭제하면 모든 공개 경로에서 즉시 내려가고, 30일 뒤 원문과 파일이 정리돼요.</span>
      </div>
    </div>
  );
}
