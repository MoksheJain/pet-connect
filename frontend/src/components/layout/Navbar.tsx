'use client';

import { useRouter } from 'next/navigation';
import { clearAuth, getUser } from '@/lib/auth';
import { getInitials } from '@/lib/utils';
import { LogOut, Bell, Search } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const user = getUser();
  const [showDropdown, setShowDropdown] = useState(false);

  function handleLogout() {
    clearAuth();
    router.push('/auth/login');
  }

  return (
    <header className="h-16 glass border-b border-white/10 flex items-center px-6 gap-4 sticky top-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center text-sm font-bold">
          <span>🐾</span>
        </div>
        <span
          className="font-bold text-lg gradient-text"
          style={{ fontFamily: 'var(--font-syne), sans-serif' }}
        >
          PetCare
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md hidden md:flex items-center gap-2 glass-input rounded-xl px-4 py-2">
        <Search size={15} className="text-white/40" />
        <input
          placeholder="Search pets, records..."
          className="bg-transparent outline-none text-sm text-white/80 placeholder:text-white/35 w-full"
        />
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <button className="relative w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
        <Bell size={16} className="text-white/70" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-400 rounded-full" />
      </button>

      {/* Avatar */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 glass rounded-xl px-3 py-1.5 hover:bg-white/10 transition-colors"
        >
          <div className="w-7 h-7 rounded-lg btn-gradient flex items-center justify-center text-xs font-bold">
            <span>{user?.name ? getInitials(user.name) : 'U'}</span>
          </div>
          <span className="text-sm font-medium text-white/80 hidden sm:block">
            {user?.name ?? 'User'}
          </span>
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl border border-white/10 shadow-glass py-1 z-50">
            <div className="px-4 py-2 border-b border-white/10">
              <p className="text-xs text-white/50">Signed in as</p>
              <p className="text-sm font-medium truncate">{user?.email ?? ''}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
