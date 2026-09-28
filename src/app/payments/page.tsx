'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { col, EmptyBox, hairline, muted, TopRow } from '@/components/ui';
import { ORDER_LABEL } from '@/lib/data';
import { useGuard, useIsMobile, useStore } from '@/lib/store';

export default function PaymentsPage() {
  const ok = useGuard('login');
  const { s, proj } = useStore();
  const router = useRouter();
  const mob = useIsMobile();
  if (!ok) return null;
  return (
    <div style={{ maxWidth: mob ? '100%' : 640, margin: '0 auto', padding: mob ? '8px 20px 32px' : '32px 24px 48px', ...col(12) }}>
      <TopRow title="결제내역" />
      {s.orders.map((o) => {
        const [label, color] = ORDER_LABEL[o.status];
        return (
          <Link key={o.id} href={`/payments/${o.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, ...hairline() }}>
            <span style={{ flex: 1, minWidth: 0, ...col(4) }}>
              <span style={{ font: '700 15px/20px var(--font-sans)' }}>Featured 7일 · {proj(o.pid)?.name ?? '삭제된 프로젝트'}</span>
              <span style={muted}>{o.date} · {o.id}</span>
            </span>
            <span style={{ ...col(4), alignItems: 'flex-end' }}>
              <span style={{ font: '700 15px/20px var(--font-sans)', fontVariantNumeric: 'tabular-nums' }}>1,000원</span>
              <span style={{ font: '700 12px/16px var(--font-sans)', color }}>{label}</span>
            </span>
          </Link>
        );
      })}
      {s.orders.length === 0 && <EmptyBox title="결제내역이 없어요" desc="Featured로 프로젝트를 추가 소개할 수 있어요." action="홍보 알아보기" onAction={() => router.push('/promote')} />}
    </div>
  );
}
