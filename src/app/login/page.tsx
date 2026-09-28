'use client';

import Link from 'next/link';
import { ContainedButton, GhostButton, OutlinedButton } from '@/components/ds';
import { col } from '@/components/ui';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useStore();
  const router = useRouter();
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      <div style={{ width: '100%', maxWidth: 380, ...col(32) }}>
        <div style={col(16)}>
          <Link href="/" style={{ font: '800 28px/36px var(--font-sans)' }}>buildlog</Link>
          <h1 style={{ margin: 0, font: '700 24px/32px var(--font-sans)', textWrap: 'pretty' }}>오늘 만든 것 하나로<br />프로젝트를 알리세요</h1>
          <p style={{ margin: 0, font: 'var(--font-paragraph3)', color: 'var(--color-on-view-2)', textWrap: 'pretty' }}>스크린샷 한 장이나 유튜브 링크 하나면 게시가 끝나요. 같은 글이 프로젝트 타임라인에 개발 기록으로 쌓입니다.</p>
        </div>
        <div style={col(8)}>
          <ContainedButton kind="secondary" size="lg" icon="github" fullWidth onClick={login}>GitHub로 계속하기</ContainedButton>
          <OutlinedButton size="lg" fullWidth onClick={login}>Google로 계속하기</OutlinedButton>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
            <GhostButton color="onView2" weight="medium" size="sm" arrow onClick={() => router.push('/')}>로그인 없이 구경하기</GhostButton>
          </div>
        </div>
        <p style={{ margin: 0, font: 'var(--font-body4)', color: 'var(--color-on-view-3)' }}>테스트 운영 중인 서비스입니다 · 문의 contact@buildlog.example</p>
      </div>
    </div>
  );
}
