import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className,
  hover = false,
  glow = false,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass rounded-2xl shadow-glass',
        hover && 'glass-hover cursor-pointer transition-all duration-300',
        glow && 'hover:shadow-glow',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
