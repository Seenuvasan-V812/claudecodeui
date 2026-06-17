import type { ReactNode } from 'react';

import { cn } from '../../../lib/utils';

/* ── Container ─────────────────────────────────────────────────── */
type PillBarProps = {
  children: ReactNode;
  className?: string;
};

export function PillBar({ children, className }: PillBarProps) {
  return (
    <div className={cn('inline-flex items-center gap-[2px] rounded-lg bg-slate-100/80 p-[3px] dark:bg-muted/60', className)}>
      {children}
    </div>
  );
}

/* ── Individual pill button ────────────────────────────────────── */
type PillProps = {
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
};

export function Pill({ isActive, onClick, children, className }: PillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex touch-manipulation items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150',
        isActive
          ? [
              'bg-white text-foreground dark:bg-background',
              // Layered shadow: subtle depth + teal bottom accent line
              'shadow-[0_1px_3px_rgba(0,0,0,0.12),0_2px_0_-1px_rgba(0,0,0,0.04),inset_0_-2px_0_0_rgb(13,148,136)]',
              'dark:shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_-2px_0_0_rgb(20,184,166)]',
            ]
          : 'text-muted-foreground hover:bg-white/60 hover:text-foreground dark:hover:bg-background/40 active:bg-white/80',
        className,
      )}
    >
      {children}
    </button>
  );
}
