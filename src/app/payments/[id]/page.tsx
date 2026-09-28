'use client';

import { useParams, useRouter } from 'next/navigation';
import { Callout, ContainedButton, OutlinedButton } from '@/components/ds';
import { col, EmptyBox, InfoRows, TopRow } from '@/components/ui';
import { orderView } from '@/lib/data';
import { useGuard, useIsMobile, useStore } from '@/lib/store';

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const ok = useGuard('login');
  const { s, proj, setOrder, toast, setSheet } = useStore();
  const router = useRouter();
  const mob = useIsMobile();
  if (!ok) return null;

  const o = s.orders.find((x) => x.id === id);
  const pad = mob ? '8px 20px 32px' : '32px 24px 48px';
  if (!o) return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: pad, ...col(20) }}>
      <TopRow title="결제 상세" />
      <EmptyBox title="주문을 찾을 수 없어요" desc="결제내역에서 다시 확인해 주세요." action="결제내역" onAction={() => router.push('/payments')} />
    </div>
  );

  const v = orderView(o, proj(o.pid)?.name ?? '삭제된 프로젝트');
  return (
    <div style={{ maxWidth: mob ? '100%' : 640, margin: '0 auto', padding: pad, ...col(20) }}>
      <TopRow title="결제 상세" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8 }}>
        {v.steps.map((st) => (
          <div key={st.k} style={{ ...col(6), padding: 14, borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-1)' }}>
            <span style={{ font: 'var(--font-body4)', color: 'var(--color-on-view-3)' }}>{st.k}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: '700 14px/18px var(--font-sans)', color: st.color }}>
              <span style={{ flex: 'none', width: 8, height: 8, borderRadius: 999, background: st.color }} />{st.v}
            </span>
          </div>
        ))}
      </div>
      <InfoRows rows={v.info} />
      <Callout>{v.note}</Callout>
      <div style={col(8)}>
        {v.canStart && <ContainedButton size="lg" fullWidth onClick={() => { setOrder(o.id, 'live'); toast('노출을 시작했어요. 10월 5일까지 광고 자리에 보여요'); }}>노출 시작</ContainedButton>}
        {v.canCancel && <OutlinedButton size="lg" fullWidth onClick={() => setSheet({ type: 'confirm', title: '전액 취소할까요?', desc: '노출을 시작하기 전이라 1,000원 테스트 결제가 전액 취소돼요.', confirmLabel: '전액 취소', action: 'cancel', arg: o.id })}>전액 취소</OutlinedButton>}
      </div>
    </div>
  );
}
