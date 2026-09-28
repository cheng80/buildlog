'use client';

import { useState } from 'react';
import { Callout, ContainedButton, FilterChip, OutlinedButton, Table } from '@/components/ds';
import { col, hairline, muted, row, TopRow } from '@/components/ui';
import { C, summary } from '@/lib/data';
import { useGuard, useIsMobile, useStore } from '@/lib/store';

const DS = { pending: ['승인 대기', C.warn], approved: ['게시됨', C.ok], rejected: ['반려됨', C.v3] } as const;
const RS = { open: ['처리 대기', C.warn], hidden: ['숨김', C.err], kept: ['유지', C.v3], restored: ['복원됨', C.ok] } as const;
const tag = { font: '700 11px/14px var(--font-sans)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' };
const LOG_COLS = [{ key: 'type', title: '종류', width: 64 }, { key: 'reason', title: '사유' }, { key: 'at', title: '시각', width: 64 }, { key: 'by', title: '조치자', width: 72 }, { key: 'target', title: '대상' }];

// ponytail: any signed-in account sees this; the real operator role check lives server-side (roles table).
export default function AdminPage() {
  const ok = useGuard('login');
  const { s, findPost, proj, approveDraft, rejectDraft, resolveReport } = useStore();
  const mob = useIsMobile();
  const [tab, setTab] = useState<'drafts' | 'reports' | 'log'>('drafts');
  if (!ok) return null;

  const pending = s.drafts.filter((d) => d.status === 'pending').length;
  const openRep = s.reports.filter((r) => r.status === 'open').length;
  const cap = s.todayPub >= 2;
  const stats = [{ k: '오늘 게시', v: s.todayPub + ' / 2' }, { k: '대기 초안', v: pending + ' / 5' }, { k: '오늘 수집', v: '1회 · 09:00' }];

  return (
    <div style={{ maxWidth: mob ? '100%' : 960, margin: '0 auto', padding: mob ? '8px 20px 32px' : '32px 24px 48px', ...col(16) }}>
      <TopRow title={<span style={row(8)}>운영자 도구<span style={{ ...tag, background: 'var(--color-inverse-surface)', color: 'var(--color-on-inverse-surface)' }}>운영자만 보여요</span></span>} />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <FilterChip selected={tab === 'drafts'} onClick={() => setTab('drafts')}>공식 카드 초안 {pending}</FilterChip>
        <FilterChip selected={tab === 'reports'} onClick={() => setTab('reports')}>신고 {openRep}</FilterChip>
        <FilterChip selected={tab === 'log'} onClick={() => setTab('log')}>조치 기록</FilterChip>
      </div>

      {tab === 'drafts' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8 }}>
            {stats.map((st) => (
              <div key={st.k} style={{ ...col(4), padding: 14, borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-1)' }}>
                <span style={muted}>{st.k}</span>
                <span style={{ font: '700 18px/22px var(--font-sans)', fontVariantNumeric: 'tabular-nums' }}>{st.v}</span>
              </div>
            ))}
          </div>
          {cap && <Callout kind="warning">오늘 게시 한도 2개에 도달했어요. 남은 초안은 내일 승인할 수 있어요.</Callout>}
          {s.drafts.map((d) => (
            <div key={d.id} style={{ ...col(10), padding: 18, ...hairline() }}>
              <div style={{ ...row(6), flexWrap: 'wrap' }}>
                <span style={{ ...tag, background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}>{d.kind}</span>
                <span style={{ ...tag, boxShadow: 'inset 0 0 0 1px var(--color-outline-2)', color: 'var(--color-on-view-2)' }}>AI 초안</span>
                <span style={{ marginLeft: 'auto', font: '700 12px/16px var(--font-sans)', color: DS[d.status][1] }}>{DS[d.status][0]}</span>
              </div>
              <span style={{ font: '700 16px/20px var(--font-sans)', textWrap: 'pretty' }}>{d.title}</span>
              <span style={{ font: 'var(--font-paragraph4)', color: 'var(--color-on-view-2)' }}>{d.body}</span>
              <div style={{ ...row(8), flexWrap: 'wrap' }}>
                <span style={{ flex: 1, ...muted }}>출처 {d.source}</span>
                {d.status === 'pending' && (
                  <>
                    <OutlinedButton size="sm" onClick={() => rejectDraft(d)}>반려</OutlinedButton>
                    <ContainedButton size="sm" disabled={cap} onClick={() => approveDraft(d)}>승인·게시</ContainedButton>
                  </>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      {tab === 'reports' && s.reports.map((r) => {
        const p = findPost(r.postId);
        const pj = p && proj(p.pid);
        return (
          <div key={r.id} style={{ ...col(10), padding: 18, ...hairline() }}>
            <div style={{ ...row(8), flexWrap: 'wrap' }}>
              <span style={{ font: '700 12px/16px var(--font-sans)', color: 'var(--color-error)' }}>신고 · {r.reason}</span>
              <span style={muted}>{r.time}</span>
              <span style={{ marginLeft: 'auto', font: '700 12px/16px var(--font-sans)', color: RS[r.status][1] }}>{RS[r.status][0]}</span>
            </div>
            <span style={{ font: 'var(--font-body2)' }}>{p ? summary(p) : '삭제된 글'}</span>
            <span style={muted}>{pj ? pj.name : '-'} · {pj ? pj.owner : '-'}</span>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              {r.status === 'open' && (
                <>
                  <OutlinedButton size="sm" onClick={() => resolveReport(r, 'kept')}>유지</OutlinedButton>
                  <ContainedButton kind="secondary" size="sm" onClick={() => resolveReport(r, 'hidden')}>숨김</ContainedButton>
                </>
              )}
              {r.status === 'hidden' && <OutlinedButton size="sm" onClick={() => resolveReport(r, 'restored')}>복원</OutlinedButton>}
            </div>
          </div>
        );
      })}

      {tab === 'log' && <Table columns={LOG_COLS} data={s.log} emptyText="조치 기록이 없어요" />}
    </div>
  );
}
