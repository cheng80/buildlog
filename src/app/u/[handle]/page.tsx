'use client';

import { useParams, useRouter } from 'next/navigation';
import { Avatar, Icon, IconButton, OutlinedButton } from '@/components/ds';
import { ProjectRow } from '@/components/ProjectRow';
import { col, DemoBadge, EmptyBox, MapBox, row } from '@/components/ui';
import { ME, P, PROFILES, type Profile } from '@/lib/data';
import { useIsMobile, useStore } from '@/lib/store';

const pill = { display: 'inline-flex', alignItems: 'center', gap: 4, font: '500 12px/16px var(--font-sans)', padding: '6px 10px', borderRadius: 999 };

export default function ProfilePage() {
  const { handle } = useParams<{ handle: string }>();
  const { s, goBack } = useStore();
  const router = useRouter();
  const mob = useIsMobile();
  const isMine = handle === ME;
  const prof: Profile | undefined = isMine
    ? { handle: ME, name: s.profile.name, bio: s.profile.bio, region: s.profile.regionPublic ? s.profile.region : null, links: [], demo: false }
    : PROFILES[handle];
  const iconSize = mob ? 'lg' : 'md';

  if (!prof) return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>
      <EmptyBox title="프로필을 찾을 수 없어요" desc="주소를 다시 확인해 주세요." action="피드 둘러보기" onAction={() => router.push('/')} />
    </div>
  );

  const projects = [...Object.values(P), ...(s.mine ? [s.mine] : [])].filter((p) => p.handle === prof.handle);
  return (
    <div style={{ maxWidth: mob ? '100%' : 720, margin: '0 auto', padding: mob ? '20px 20px 32px' : '32px 24px 64px', ...col(24) }}>
      <div style={{ ...row(8), margin: '-8px 0 -8px -8px' }}>
        <IconButton icon="chevron-left" size={iconSize} ariaLabel="뒤로" onClick={goBack} />
        <span style={{ font: 'var(--font-body3)', color: 'var(--color-on-view-3)' }}>buildlog.vercel.app/u/{prof.handle}</span>
        {isMine && <div style={{ marginLeft: 'auto' }}><IconButton icon="settings" size={iconSize} ariaLabel="설정" onClick={() => router.push('/settings')} /></div>}
      </div>
      <div style={row(16)}>
        <Avatar size={56} />
        <div style={{ ...col(4), minWidth: 0 }}>
          <div style={row(8)}><h1 style={{ margin: 0, font: '700 22px/28px var(--font-sans)' }}>{prof.name}</h1>{prof.demo && <DemoBadge />}</div>
          <span style={{ font: 'var(--font-body3)', color: 'var(--color-on-view-3)' }}>@{prof.handle}</span>
        </div>
      </div>
      <p style={{ margin: 0, font: 'var(--font-paragraph3)', color: 'var(--color-on-view-2)', textWrap: 'pretty' }}>{prof.bio}</p>
      {(prof.region || prof.links.length > 0) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {prof.region && <span style={{ ...pill, background: 'var(--color-surface-1)', color: 'var(--color-on-view-2)' }}><Icon name="map-pin" size={12} />{prof.region}</span>}
          {prof.links.map((l) => <span key={l} style={{ ...pill, boxShadow: 'inset 0 0 0 1px var(--color-outline-2)' }}><Icon name="link" size={12} />{l}</span>)}
        </div>
      )}
      {prof.region && <MapBox label={`Kakao 지도 · ${prof.region} 중심`} height={160} size={28} note />}
      {isMine && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <OutlinedButton onClick={() => router.push('/settings')}>프로필·위치 설정</OutlinedButton>
          <OutlinedButton onClick={() => router.push('/payments')}>결제내역</OutlinedButton>
        </div>
      )}
      <div style={col(12)}>
        <span style={{ font: '700 18px/22px var(--font-sans)' }}>프로젝트 {projects.length}개</span>
        {projects.map((p) => <ProjectRow key={p.id} p={p} />)}
      </div>
    </div>
  );
}
