'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ContainedButton, FilterChip, IconButton, TextField } from '@/components/ds';
import { col, Steps } from '@/components/ui';
import { TECH } from '@/lib/data';
import { useIsMobile, useStore } from '@/lib/store';

export default function OnboardingPage() {
  const { createProject } = useStore();
  const router = useRouter();
  const mob = useIsMobile();
  const [name, setName] = useState('포모 타이머');
  const [line, setLine] = useState('집중 시간을 기록하는 작은 데스크톱 앱');
  const [tech, setTech] = useState<Record<string, boolean>>({ Tauri: true, React: true });
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: mob ? '8px 20px 32px' : '48px 24px', ...col(28) }}>
      <div style={{ marginLeft: -8 }}>
        <IconButton icon="chevron-left" size={mob ? 'lg' : 'md'} ariaLabel="뒤로" onClick={() => router.push('/login')} />
      </div>
      <div style={col(12)}>
        <Steps done={1} />
        <span style={{ font: 'var(--font-body4)', color: 'var(--color-on-view-3)' }}>1 / 3 · 프로젝트 만들기</span>
        <h1 style={{ margin: 0, font: '700 24px/32px var(--font-sans)' }}>어떤 걸 만들고 있나요?</h1>
        <p style={{ margin: 0, font: 'var(--font-paragraph4)', color: 'var(--color-on-view-2)' }}>프로젝트 페이지가 만들어지고, 앞으로 올리는 글이 여기에 쌓여요. 이름은 나중에 바꿔도 링크는 그대로입니다.</p>
      </div>
      <div style={col(12)}>
        <TextField label="프로젝트 이름" value={name} onChange={setName} clearable />
        <TextField label="한 줄 소개" value={line} onChange={(v) => setLine(v.slice(0, 60))} helperText={line.length + ' / 60'} />
      </div>
      <div style={col(12)}>
        <span style={{ font: '700 14px/18px var(--font-sans)' }}>기술 <span style={{ fontWeight: 400, color: 'var(--color-on-view-3)' }}>· 선택</span></span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TECH.map((t) => <FilterChip key={t} selected={!!tech[t]} onClick={() => setTech((x) => ({ ...x, [t]: !x[t] }))}>{t}</FilterChip>)}
        </div>
      </div>
      <ContainedButton size="lg" fullWidth disabled={!name.trim()}
        onClick={() => createProject({ name: name.trim(), line: line.trim(), tech: TECH.filter((t) => tech[t]) })}>다음</ContainedButton>
    </div>
  );
}
