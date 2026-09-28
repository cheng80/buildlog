'use client';

// buildlog design system primitives, ported from the Claude Design bundle (_ds_bundle.js).
// Only the components the app uses are kept.

import { useState, type CSSProperties, type ReactNode } from 'react';
import {
  ArrowDown, ArrowUp, ArrowUpDown, Bookmark, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp,
  CircleAlert, CircleCheck, CircleUserRound, Compass, Ellipsis, ExternalLink, Flag, Folder, FolderHeart,
  Globe, Heart, House, Image, ImagePlus, Info, Link, Lock, LogOut, Mail, MapPin, Play, Plus, Receipt,
  Search, Settings, Share, Shield, ShieldCheck, SquarePlus, Tag, Text, TriangleAlert, UserRound, UserX, X,
  type LucideIcon,
} from 'lucide-react';

// Lucide dropped brand icons; these two paths are copied from lucide@0.460.0 (the version the design used).
const brand = (paths: string[]) => paths.map((d) => <path key={d} d={d} />);
const BRAND: Record<string, ReactNode> = {
  github: brand(['M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4', 'M9 18c-4.51 2-5-2-7-2']),
  youtube: brand(['M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17', 'm10 15 5-3-5-3z']),
};

const ICONS: Record<string, LucideIcon> = {
  'arrow-down': ArrowDown, 'arrow-up': ArrowUp, 'arrow-up-down': ArrowUpDown, bookmark: Bookmark, check: Check,
  'chevron-down': ChevronDown, 'chevron-left': ChevronLeft, 'chevron-right': ChevronRight, 'chevron-up': ChevronUp,
  'circle-alert': CircleAlert, 'circle-check': CircleCheck, 'circle-user-round': CircleUserRound, compass: Compass,
  ellipsis: Ellipsis, 'external-link': ExternalLink, flag: Flag, folder: Folder, 'folder-heart': FolderHeart,
  globe: Globe, heart: Heart, house: House, image: Image, 'image-plus': ImagePlus, info: Info, link: Link, lock: Lock,
  'log-out': LogOut, mail: Mail, 'map-pin': MapPin, play: Play, plus: Plus, receipt: Receipt, search: Search,
  settings: Settings, share: Share, shield: Shield, 'shield-check': ShieldCheck, 'square-plus': SquarePlus, tag: Tag,
  text: Text, 'triangle-alert': TriangleAlert, 'user-round': UserRound, 'user-x': UserX, x: X,
};

type Weight = 'regular' | 'thin' | 'fill';

export function Icon({ name, weight = 'regular', size = 24, color = 'currentColor', style }: {
  name: string; weight?: Weight; size?: number; color?: string; style?: CSSProperties;
}) {
  const sw = weight === 'thin' ? 1.25 : weight === 'fill' ? 1.5 : 1.75;
  const st: CSSProperties = { display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', ...style };
  const fill = weight === 'fill' ? color : 'none';
  const Cmp = ICONS[name];
  if (Cmp) return <Cmp size={size} color={color} strokeWidth={sw} fill={fill} aria-hidden style={st} />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden style={st}>
      {BRAND[name]}
    </svg>
  );
}

// ---------- buttons ----------

type Size = 'lg' | 'md' | 'sm';
const btnSizes = {
  lg: { h: 48, px: 18, font: 'var(--font-title6)', icon: 20, gap: 6 },
  md: { h: 40, px: 14, font: 'var(--font-title7)', icon: 18, gap: 4 },
  sm: { h: 32, px: 12, font: 'var(--font-body3)', icon: 16, gap: 4 },
};

function btnBase(s: (typeof btnSizes)[Size], full?: boolean, disabled?: boolean): CSSProperties {
  return {
    display: full ? 'flex' : 'inline-flex', width: full ? '100%' : undefined, alignItems: 'center', justifyContent: 'center',
    gap: s.gap, height: s.h, padding: `0 ${s.px}px`, borderRadius: 'var(--radius-md)', font: s.font, fontWeight: 700,
    fontFamily: 'var(--font-sans)', border: 'none', cursor: disabled ? 'default' : 'pointer', whiteSpace: 'nowrap',
    transition: 'filter var(--duration-fast) var(--ease-out-quad), transform var(--duration-fast) var(--ease-out-quad), background var(--duration-fast)',
    userSelect: 'none',
  };
}

function usePress(disabled?: boolean) {
  const [p, setP] = useState(false);
  const [h, setH] = useState(false);
  return {
    pressed: p && !disabled,
    hovered: h && !disabled,
    handlers: {
      onPointerDown: () => setP(true),
      onPointerUp: () => setP(false),
      onPointerLeave: () => { setP(false); setH(false); },
      onPointerEnter: () => setH(true),
    },
  };
}

type BtnProps = {
  size?: Size; icon?: string; disclosure?: boolean; disabled?: boolean; fullWidth?: boolean;
  onClick?: () => void; style?: CSSProperties; children?: ReactNode;
};

const KIND = {
  primary: ['var(--color-primary)', 'var(--color-on-primary)'],
  secondary: ['var(--color-inverse-surface)', 'var(--color-on-inverse-surface)'],
  tertiary: ['var(--color-surface-1)', 'var(--color-on-view-1)'],
};

export function ContainedButton({ kind = 'primary', size = 'md', icon, disclosure, disabled, fullWidth, onClick, style, children }:
  BtnProps & { kind?: keyof typeof KIND }) {
  const s = btnSizes[size];
  const [bg, fg] = KIND[kind];
  const { pressed, hovered, handlers } = usePress(disabled);
  return (
    <button type="button" disabled={disabled} onClick={onClick} {...handlers} style={{
      ...btnBase(s, fullWidth, disabled),
      background: disabled ? 'var(--color-disable)' : bg, color: disabled ? 'var(--color-on-view-3)' : fg,
      filter: hovered ? 'brightness(0.94)' : undefined, transform: pressed ? 'scale(0.98)' : undefined, ...style,
    }}>
      {icon && <Icon name={icon} size={s.icon} />}
      <span>{children}</span>
      {disclosure !== undefined && <Icon name={disclosure ? 'chevron-up' : 'chevron-down'} size={s.icon} />}
    </button>
  );
}

export function OutlinedButton({ size = 'md', icon, disabled, fullWidth, onClick, style, children }: BtnProps) {
  const s = btnSizes[size];
  const { pressed, hovered, handlers } = usePress(disabled);
  return (
    <button type="button" disabled={disabled} onClick={onClick} {...handlers} style={{
      ...btnBase(s, fullWidth, disabled),
      background: hovered ? 'var(--color-surface-1)' : 'transparent', color: disabled ? 'var(--color-on-view-3)' : 'var(--color-on-view-1)',
      boxShadow: 'inset 0 0 0 1px var(--color-outline-2)', transform: pressed ? 'scale(0.98)' : undefined, ...style,
    }}>
      {icon && <Icon name={icon} size={s.icon} />}
      <span>{children}</span>
    </button>
  );
}

const GCOL: Record<string, string> = {
  onView1: 'var(--color-on-view-1)', onView2: 'var(--color-on-view-2)', onView3: 'var(--color-on-view-3)',
  onViewPrimary: 'var(--color-on-view-primary)',
};
const GSZ = { lg: ['var(--font-title6)', 18], md: ['var(--font-title7)', 16], sm: ['var(--font-body3)', 14] } as const;

export function GhostButton({ size = 'md', color = 'onView1', weight = 'bold', arrow, disclosure, onClick, children }: {
  size?: Size; color?: string; weight?: 'regular' | 'medium' | 'bold'; arrow?: boolean; disclosure?: boolean;
  onClick?: () => void; children?: ReactNode;
}) {
  const [h, setH] = useState(false);
  const [f, is] = GSZ[size];
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      display: 'inline-flex', alignItems: 'center', gap: 2, padding: 0, background: 'none', border: 'none', font: f,
      fontWeight: weight === 'regular' ? 400 : weight === 'medium' ? 500 : 700, fontFamily: 'var(--font-sans)',
      color: GCOL[color] || color, opacity: h ? 0.7 : 1, cursor: 'pointer', transition: 'opacity var(--duration-fast)',
    }}>
      <span>{children}</span>
      {arrow && <Icon name="chevron-right" size={is} />}
      {disclosure !== undefined && <Icon name={disclosure ? 'chevron-up' : 'chevron-down'} size={is} />}
    </button>
  );
}

const ISZ = { sm: [32, 16], md: [40, 20], lg: [48, 24] } as const;

export function IconButton({ icon, size = 'md', weight = 'regular', ariaLabel, disabled, active, onClick, style }: {
  icon: string; size?: Size; weight?: Weight; ariaLabel: string; disabled?: boolean; active?: boolean;
  onClick?: () => void; style?: CSSProperties;
}) {
  const [d, is] = ISZ[size];
  const [h, setH] = useState(false);
  return (
    <button type="button" aria-label={ariaLabel} aria-pressed={active} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
        width: d, height: d, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: 'none', padding: 0,
        borderRadius: 'var(--radius-full)', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.35 : 1,
        transition: 'background var(--duration-fast)', color: 'var(--color-on-view-1)',
        background: h && !disabled ? 'var(--color-surface-1)' : 'transparent', ...style,
      }}>
      <Icon name={icon} size={is} weight={active ? 'fill' : weight} />
    </button>
  );
}

// ---------- inputs ----------

const CSZ = { md: { h: 36, px: 14, f: 'var(--font-body2)', i: 16 }, sm: { h: 28, px: 10, f: 'var(--font-body4)', i: 14 } };

export function FilterChip({ size = 'md', selected, startIcon, endIcon, onClick, children }: {
  size?: 'md' | 'sm'; selected?: boolean; startIcon?: string; endIcon?: string; onClick?: () => void; children?: ReactNode;
}) {
  const s = CSZ[size];
  return (
    <button type="button" aria-pressed={!!selected} onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, minHeight: s.h, padding: `0 ${s.px}px`,
      borderRadius: 'var(--radius-full)', font: s.f, fontWeight: selected ? 700 : 500, fontFamily: 'var(--font-sans)',
      border: 'none', cursor: onClick ? 'pointer' : 'default', maxWidth: '100%', transition: 'background var(--duration-fast)',
      background: selected ? 'var(--color-inverse-surface)' : 'var(--color-background)',
      color: selected ? 'var(--color-on-inverse-surface)' : 'var(--color-on-view-1)',
      boxShadow: selected ? 'none' : 'inset 0 0 0 1px var(--color-outline-2)',
    }}>
      {startIcon && <Icon name={startIcon} size={s.i} />}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>{children}</span>
      {endIcon && <Icon name={endIcon} size={s.i} />}
    </button>
  );
}

export function TextField({ label, value, onChange, placeholder, helperText, clearable }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; helperText?: string; clearable?: boolean;
}) {
  const [focus, setFocus] = useState(false);
  const h = 48;
  const floated = focus || value.length > 0;
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: 8, height: h, padding: '0 14px',
        borderRadius: 'var(--radius-md)', background: 'var(--color-background)', cursor: 'text',
        boxShadow: `inset 0 0 0 1px ${focus ? 'var(--color-outline-neutral)' : 'var(--color-outline-2)'}`,
        transition: 'box-shadow var(--duration-fast) var(--ease-out-quad)',
      }}>
        <div style={{ position: 'relative', flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
          <span style={{
            position: 'absolute', left: 0, top: '50%', transformOrigin: 'left top',
            transform: floated ? `translateY(-${h / 2 - 8}px) scale(0.8)` : 'translateY(-50%)',
            font: 'var(--font-body2)', color: 'var(--color-on-view-3)', pointerEvents: 'none',
            transition: 'transform var(--duration-base) var(--ease-out-quad)',
          }}>{label}</span>
          <input value={value} placeholder={floated ? placeholder : ''} onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={{
              width: '100%', border: 'none', outline: 'none', background: 'transparent', font: 'var(--font-body2)',
              fontFamily: 'var(--font-sans)', color: 'var(--color-on-view-1)', padding: 0, paddingTop: 14,
            }} />
        </div>
        {clearable && value.length > 0 && (
          <button type="button" aria-label="지우기" onClick={(e) => { e.preventDefault(); onChange(''); }} style={{
            border: 'none', background: 'var(--color-surface-4)', color: 'var(--color-background)', width: 18, height: 18,
            borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, cursor: 'pointer',
          }}><Icon name="x" size={12} style={{ strokeWidth: 3 }} /></button>
        )}
      </div>
      {helperText && <span style={{ font: 'var(--font-body4)', color: 'var(--color-on-view-3)', paddingLeft: 2 }}>{helperText}</span>}
    </label>
  );
}

// ---------- feedback ----------

const CK = {
  default: ['var(--color-surface-1)', 'var(--color-on-view-2)', 'info'],
  informative: ['var(--color-informative-container)', 'var(--color-informative)', 'info'],
  warning: ['var(--color-warning-container)', 'var(--color-warning)', 'triangle-alert'],
};

export function Callout({ kind = 'default', icon, buttonText, onButtonClick, children }: {
  kind?: keyof typeof CK; icon?: string; buttonText?: string; onButtonClick?: () => void; children?: ReactNode;
}) {
  const [bg, fg, ic] = CK[kind];
  return (
    <div style={{ display: 'flex', gap: 10, padding: '14px 16px', borderRadius: 'var(--radius-lg)', background: bg }}>
      <Icon name={icon || ic} size={18} color={fg} style={{ marginTop: 1 }} />
      <span style={{ flex: 1, minWidth: 0, font: 'var(--font-paragraph4)', color: 'var(--color-on-view-2)' }}>{children}</span>
      {buttonText && (
        <button type="button" onClick={onButtonClick} style={{
          alignSelf: 'center', border: 'none', background: 'transparent', color: 'var(--color-on-view-1)', font: 'var(--font-body3)',
          fontWeight: 700, fontFamily: 'var(--font-sans)', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3,
        }}>{buttonText}</button>
      )}
    </div>
  );
}

export function Toast({ title }: { title: string }) {
  return (
    <div role="status" style={{
      display: 'inline-flex', alignItems: 'center', gap: 10, minHeight: 48, padding: '8px 20px', borderRadius: 'var(--radius-full)',
      background: 'var(--color-inverse-surface)', color: 'var(--color-on-inverse-surface)', boxShadow: 'var(--elevation-2)', maxWidth: '100%',
    }}>
      <span style={{ font: 'var(--font-body2)', fontWeight: 500, flex: 1 }}>{title}</span>
    </div>
  );
}

export function Spinner({ size = 32 }: { size?: number }) {
  return (
    <span role="status" aria-label="로딩 중" style={{
      display: 'inline-block', width: size, height: size, borderRadius: '50%', border: `${Math.max(2, Math.round(size / 10))}px solid currentColor`,
      borderRightColor: 'transparent', color: 'var(--color-on-view-3)', animation: 'bl-spin 0.8s linear infinite', flexShrink: 0,
    }} />
  );
}

// ---------- data ----------

export function Avatar({ size = 40 }: { size?: number }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, borderRadius: 'var(--radius-full)',
      overflow: 'hidden', background: 'var(--color-surface-1)', boxShadow: 'inset 0 0 0 1px var(--color-outline-1)',
      color: 'var(--color-on-view-3)', flexShrink: 0,
    }}>
      <Icon name="user-round" weight="fill" size={Math.round(size * 0.6)} />
    </span>
  );
}

type Col = { key: string; title: string; width?: number };

export function Table({ columns, data, emptyText }: { columns: Col[]; data: Record<string, string>[]; emptyText: string }) {
  const cell = { padding: '12px 16px', borderBottom: '1px solid var(--color-outline-1)' };
  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', boxShadow: 'inset 0 0 0 1px var(--color-outline-2)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ ...cell, width: c.width, font: 'var(--font-body3)', fontWeight: 500, color: 'var(--color-on-view-3)', textAlign: 'left', background: 'var(--color-surface-1)', whiteSpace: 'nowrap' }}>{c.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={99} style={{ ...cell, font: 'var(--font-body2)', textAlign: 'center', color: 'var(--color-on-view-3)', padding: 40 }}>{emptyText}</td></tr>
          ) : data.map((r) => (
            <tr key={r.id}>
              {columns.map((c) => <td key={c.key} style={{ ...cell, font: 'var(--font-body2)', color: 'var(--color-on-view-1)' }}>{r[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
