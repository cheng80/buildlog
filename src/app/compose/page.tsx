'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Callout, ContainedButton, FilterChip, Icon, IconButton } from '@/components/ds';
import { col, LinkCard, muted, row, Steps, TopRow } from '@/components/ui';
import { detect } from '@/lib/data';
import { useGuard, useIsMobile, useStore } from '@/lib/store';

export default function ComposePage() {
  const ok = useGuard('mine');
  const { s, addPost } = useStore();
  const router = useRouter();
  const mob = useIsMobile();
  const [text, setText] = useState('');
  const [images, setImages] = useState(0);
  if (!ok) return null;

  const d = detect(text);
  const submit = () => {
    const body = (d ? text.replace(d.url, '') : text).trim();
    const media = images > 0 ? 'image' : d ? d.type : 'none';
    const mediaLabel = images > 0
      ? (images > 1 ? 'screenshot 외 ' + (images - 1) + '장' : 'screenshot.png')
      : d ? (d.type === 'youtube' ? 'YouTube 영상 · 타이머 알림음 바꾼 과정' : d.url.replace(/^https?:\/\//, '')) : '';
    addPost({ text: body, media, mediaLabel }, s.inFlow ? '3 / 3 · 링크 공유' : '피드·타임라인 동시 게시');
    setText('');
    setImages(0);
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: mob ? '8px 20px 32px' : '32px 24px 48px', ...col(16) }}>
      <TopRow icon="x" title={s.inFlow ? '2 / 3 · 오늘 만든 것 올리기' : '올리기'} onClose={() => router.push('/')}
        right={<ContainedButton disabled={!text.trim() && images === 0} onClick={submit}>게시하기</ContainedButton>} />
      {s.inFlow && <Steps done={2} />}
      <div style={row(8)}>
        <span style={muted}>올릴 프로젝트</span>
        <FilterChip size="sm" selected startIcon="folder">{s.mine!.name}</FilterChip>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} maxLength={2000}
        placeholder="오늘 만든 것 한 줄, 또는 유튜브·GitHub·웹 링크를 붙여넣어 주세요"
        style={{ width: '100%', resize: 'none', border: 0, outline: 0, background: 'transparent', color: 'var(--color-on-view-1)', font: 'var(--font-paragraph2)', padding: '8px 0' }} />

      {images > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 8 }}>
          {Array.from({ length: images }, (_, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-1)', boxShadow: 'inset 0 0 0 1px var(--color-outline-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '500 11px/14px ui-monospace,Menlo,monospace', color: 'var(--color-on-view-3)' }}>
              이미지 {i + 1}
              <button type="button" aria-label="이미지 빼기" onClick={() => setImages((n) => n - 1)} style={{ position: 'absolute', top: 4, right: 4, width: 24, height: 24, border: 0, borderRadius: 999, background: 'var(--color-dim)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                <Icon name="x" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {d && images === 0 && (
        <div style={col(8)}>
          <span style={{ ...row(6), font: '700 12px/16px var(--font-sans)', color: 'var(--color-success)' }}><Icon name="circle-check" size={16} />{d.msg}</span>
          <LinkCard icon={d.icon} label={d.type === 'youtube' ? 'YouTube 영상 · 제목은 게시 후 불러와요' : d.label} kind={d.kind} />
        </div>
      )}

      <div style={{ ...row(8), paddingTop: 8, marginTop: 8, boxShadow: 'inset 0 1px 0 var(--color-outline-1)' }}>
        <IconButton icon="image-plus" size={mob ? 'lg' : 'md'} ariaLabel="이미지 추가" disabled={images >= 4} onClick={() => setImages((n) => Math.min(4, n + 1))} />
        <span style={muted}>이미지·GIF {images} / 4</span>
      </div>
      <div style={{ ...row(8), flexWrap: 'wrap' }}>
        <span style={muted}>예시 붙여넣기</span>
        <FilterChip size="sm" startIcon="youtube" onClick={() => { setText('타이머 알림음 바꾼 과정 https://youtu.be/8kQ2x_devlog'); setImages(0); }}>유튜브</FilterChip>
        <FilterChip size="sm" startIcon="github" onClick={() => { setText('설정 화면 코드 정리했어요 https://github.com/haneul/pomo-timer'); setImages(0); }}>GitHub</FilterChip>
        <FilterChip size="sm" startIcon="image" onClick={() => { setText((t) => t || '다크 모드 첫 화면'); setImages((n) => Math.max(1, n)); }}>스크린샷</FilterChip>
      </div>
      <Callout>내용 하나만 있으면 게시할 수 있어요. 이미지·GIF는 합계 4개, 링크는 대표 1개까지 카드로 만들어집니다.</Callout>
    </div>
  );
}
