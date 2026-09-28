'use client';

import { useParams, useRouter } from 'next/navigation';
import { ContainedButton, Icon, OutlinedButton, Spinner } from '@/components/ds';
import { col, EmptyBox, InfoRows } from '@/components/ui';
import { orderView } from '@/lib/data';
import { useGuard, useStore } from '@/lib/store';

// Toss Payments returns here. The order only reads as paid once the server confirms (mocked with a timer).
export default function PayResultPage() {
  const { id } = useParams<{ id: string }>();
  const ok = useGuard('login');
  const { s, proj, setOrder, toast } = useStore();
  const router = useRouter();
  if (!ok) return null;

  const o = s.orders.find((x) => x.id === id);
  return (
    <div style={{ minHeight: '80dvh', maxWidth: 440, margin: '0 auto', padding: '48px 24px', ...col(24, { justifyContent: 'center' }) }}>
      {!o && <EmptyBox title="주문을 찾을 수 없어요" desc="결제내역에서 다시 확인해 주세요." action="결제내역" onAction={() => router.push('/payments')} />}
      {o?.status === 'checking' && (
        <div style={col(16, { alignItems: 'center', textAlign: 'center' })}>
          <Spinner size={40} />
          <span style={{ font: '700 20px/26px var(--font-sans)' }}>결제를 확인하고 있어요</span>
          <span style={{ font: 'var(--font-paragraph4)', color: 'var(--color-on-view-2)' }}>서버 확인이 끝나야 완료로 표시돼요. 창을 닫아도 결제내역에서 확인할 수 있습니다.</span>
        </div>
      )}
      {o && o.status !== 'checking' && (
        <>
          <div style={col(12, { alignItems: 'center', textAlign: 'center' })}>
            <span style={{ color: 'var(--color-success)', display: 'flex' }}><Icon name="circle-check" size={48} /></span>
            <span style={{ font: '700 20px/26px var(--font-sans)' }}>결제가 확인되었습니다</span>
            <span style={{ font: 'var(--font-paragraph4)', color: 'var(--color-on-view-2)' }}>노출은 직접 시작해야 시작돼요. 시작 전에는 전액 취소할 수 있어요.</span>
          </div>
          <InfoRows rows={orderView(o, proj(o.pid)?.name ?? '삭제된 프로젝트').info} />
          <div style={col(8)}>
            <ContainedButton size="lg" fullWidth disabled={o.status !== 'paid'} onClick={() => { setOrder(o.id, 'live'); router.push(`/payments/${o.id}`); toast('노출을 시작했어요. 10월 5일까지 광고 자리에 보여요'); }}>지금 노출 시작</ContainedButton>
            <OutlinedButton size="lg" fullWidth onClick={() => router.push(`/payments/${o.id}`)}>나중에 시작하기</OutlinedButton>
          </div>
        </>
      )}
    </div>
  );
}
