'use client';

import { useRouter } from 'next/navigation';
import { Callout, ContainedButton, Icon } from '@/components/ds';
import { AdBadge, col, hairline, row, TopRow } from '@/components/ui';
import { useGuard, useIsMobile, useStore } from '@/lib/store';

const RULES = ['기간 7일 · 노출 시작은 직접 눌러야 시작돼요', '시작 전에는 전액 취소할 수 있어요', '같은 프로젝트는 동시에 한 건만 주문할 수 있어요'];

export default function PromotePage() {
  const ok = useGuard('mine');
  const { s, pay } = useStore();
  const router = useRouter();
  const mob = useIsMobile();
  if (!ok) return null;

  // One open order per project: checking / paid / live blocks a second purchase.
  const blocking = s.orders.find((o) => o.pid === s.mine!.id && ['checking', 'paid', 'live'].includes(o.status));
  return (
    <div style={{ maxWidth: mob ? '100%' : 640, margin: '0 auto', padding: mob ? '8px 20px 32px' : '32px 24px 48px', ...col(20) }}>
      <TopRow title="프로젝트 홍보" />
      <Callout kind="informative">테스트 결제예요. 실제로 청구되지 않습니다.</Callout>
      <div style={{ ...col(16), padding: 24, ...hairline('var(--radius-xxl)') }}>
        <div style={row(6)}><AdBadge /><span style={{ font: '700 13px/18px var(--font-sans)' }}>Featured</span></div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ font: '700 22px/28px var(--font-sans)' }}>{s.mine!.name} 7일 노출</span>
          <span style={{ font: '800 24px/32px var(--font-sans)' }}>1,000원</span>
        </div>
        <span style={{ font: 'var(--font-paragraph4)', color: 'var(--color-on-view-2)', textWrap: 'pretty' }}>광고 자리 1칸에서 다른 Featured 프로젝트와 번갈아 보여요. 항상 &apos;광고&apos;로 표시되고 자연 피드에는 섞이지 않습니다.</span>
        <div style={{ ...col(10), paddingTop: 12, boxShadow: 'inset 0 1px 0 var(--color-outline-1)' }}>
          {RULES.map((r) => <span key={r} style={{ ...row(8), font: 'var(--font-body2)' }}><Icon name="check" size={16} color="var(--color-on-view-primary)" />{r}</span>)}
        </div>
      </div>
      {blocking && (
        <Callout kind="warning" buttonText="주문 보기" onButtonClick={() => router.push(`/payments/${blocking.id}`)}>이 프로젝트는 이미 진행 중인 주문이 있어요. 같은 프로젝트는 중복 구매할 수 없습니다.</Callout>
      )}
      <ContainedButton size="lg" fullWidth disabled={!!blocking} onClick={pay}>1,000원 테스트 결제하기</ContainedButton>
      <span style={{ font: 'var(--font-body4)', color: 'var(--color-on-view-3)', textAlign: 'center' }}>Toss Payments 테스트 환경 · 30일 안에 노출을 시작하지 않으면 운영자가 주문을 취소할 수 있어요</span>
    </div>
  );
}
