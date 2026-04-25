'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PawPrint,
  PlusCircle,
  ChevronRight,
  Heart,
  Settings,
} from 'lucide-react';

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'My Pets',
    href: '/pets',
    icon: PawPrint,
  },
  {
    label: 'Add Pet',
    href: '/pets/add',
    icon: PlusCircle,
  },
];

const bottomItems = [
  { label: 'Health Tips', href: '#', icon: Heart },
  { label: 'Settings', href: '#', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 h-[calc(100vh-4rem)] glass border-r border-white/10 flex flex-col py-6 sticky top-16">
      {/* Nav section */}
      <div className="px-4 mb-2">
        <p className="text-[11px] font-semibold text-white/30 uppercase tracking-widest px-3 mb-2">
          Menu
        </p>
        <nav className="space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active =
              pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-white/60 hover:text-white hover:bg-white/08'
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    'transition-colors',
                    active ? 'text-indigo-400' : 'text-white/40 group-hover:text-white/70'
                  )}
                />
                <span>{label}</span>
                {active && (
                  <ChevronRight size={14} className="ml-auto text-indigo-400/60" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom section */}
      <div className="px-4 border-t border-white/08 pt-4">
        <p className="text-[11px] font-semibold text-white/30 uppercase tracking-widest px-3 mb-2">
          More
        </p>
        <nav className="space-y-1">
          {bottomItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/08 transition-all duration-200"
            >
              <Icon size={18} className="text-white/30 group-hover:text-white/60 transition-colors" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Version tag */}
      <p className="px-7 mt-4 text-[10px] text-white/20">PetCare v1.0.0</p>
    </aside>
  );
}
