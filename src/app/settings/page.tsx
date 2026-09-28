'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Callout, ContainedButton, FilterChip, Icon, TextField } from '@/components/ds';
import { col, MapBox, TopRow } from '@/components/ui';
import { C, REGIONS } from '@/lib/data';
import { useGuard, useIsMobile, useStore, type MyProfile } from '@/lib/store';

export default function SettingsPage() {
  const ok = useGuard('login');
  const { s } = useStore();
  if (!ok) return null;
  return <SettingsForm initial={s.profile} />;
}

function SettingsForm({ initial }: { initial: MyProfile }) {
  const { s, set, goBack, toast, setSheet } = useStore();
  const router = useRouter();
  const mob = useIsMobile();
  const [stg, setStg] = useState(initial);
  const patch = (p: Partial<MyProfile>) => setStg((x) => ({ ...x, ...p }));

  const links = [
    { label: '결제내역', sub: '테스트 결제 ' + s.orders.length + '건', icon: 'receipt', color: C.v1, onClick: () => router.push('/payments') },
    { label: '운영자 도구', sub: '공식 카드 승인 · 신고 처리', icon: 'shield', color: C.v1, onClick: () => router.push('/admin') },
    { label: '문의하기', sub: 'contact@buildlog.example', icon: 'mail', color: C.v1, onClick: () => { window.location.href = 'mailto:contact@buildlog.example'; } },
    { label: '로그아웃', sub: 'GitHub 계정', icon: 'log-out', color: C.v1, onClick: () => setSheet({ type: 'confirm', title: '로그아웃할까요?', desc: '다시 로그인하면 이어서 쓸 수 있어요.', confirmLabel: '로그아웃', action: 'logout' }) },
    { label: '계정 탈퇴', sub: '즉시 비공개 · 30일 뒤 정리', icon: 'user-x', color: C.err, onClick: () => setSheet({ type: 'confirm', title: '탈퇴할까요?', desc: '프로필·프로젝트·글이 즉시 비공개로 바뀌고, 30일 뒤 원문과 파일이 정리돼요.', confirmLabel: '탈퇴하기', action: 'withdraw' }) },
  ];

  return (
    <div style={{ maxWidth: mob ? '100%' : 640, margin: '0 auto', padding: mob ? '8px 20px 32px' : '32px 24px 48px', ...col(28) }}>
      <TopRow title="설정" right={<ContainedButton onClick={() => { set({ profile: stg }); goBack(); toast('저장되었습니다'); }}>저장</ContainedButton>} />
      <div style={col(12)}>
        <span style={{ font: '700 16px/20px var(--font-sans)' }}>프로필</span>
        <TextField label="표시 이름" value={stg.name} onChange={(v) => patch({ name: v })} />
        <TextField label="소개" value={stg.bio} onChange={(v) => patch({ bio: v })} />
        <span style={{ font: 'var(--font-body4)', color: 'var(--color-on-view-3)' }}>핸들 @haneul · GitHub로 로그인됨</span>
      </div>
      <div style={col(12)}>
        <span style={{ font: '700 16px/20px var(--font-sans)' }}>활동 지역</span>
        <span style={{ font: 'var(--font-paragraph4)', color: 'var(--color-on-view-2)' }}>프로필에 시·군·구까지만 보여줄 수 있어요. 기본은 비공개입니다.</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <FilterChip selected={!stg.regionPublic} startIcon="lock" onClick={() => patch({ regionPublic: false })}>비공개</FilterChip>
          <FilterChip selected={stg.regionPublic} startIcon="map-pin" onClick={() => patch({ regionPublic: true })}>공개</FilterChip>
        </div>
        {stg.regionPublic && (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {REGIONS.map((r) => <FilterChip key={r} size="sm" selected={stg.region === r} onClick={() => patch({ region: r })}>{r}</FilterChip>)}
            </div>
            <MapBox label={`Kakao 지도 · ${stg.region} 대표 좌표`} height={200} size={32} />
          </>
        )}
        <Callout icon="shield-check">정확한 주소와 현재 위치는 수집하지 않아요.</Callout>
      </div>
      <div style={col(0)}>
        {links.map((l) => (
          <button key={l.label} type="button" onClick={l.onClick} style={{ border: 0, background: 'transparent', cursor: 'pointer', padding: '16px 0', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', color: l.color, boxShadow: 'inset 0 -1px 0 var(--color-outline-1)' }}>
            <Icon name={l.icon} size={20} />
            <span style={{ flex: 1, ...col(2) }}>
              <span style={{ font: '500 15px/20px var(--font-sans)' }}>{l.label}</span>
              <span style={{ font: 'var(--font-body4)', color: 'var(--color-on-view-3)' }}>{l.sub}</span>
            </span>
            <Icon name="chevron-right" size={16} color="var(--color-on-view-3)" />
          </button>
        ))}
      </div>
    </div>
  );
}
