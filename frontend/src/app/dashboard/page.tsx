'use client';

import { useEffect, useState } from 'react';
import { petApi } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { Pet } from '@/types';
import GlassCard from '@/components/ui/GlassCard';
import { StatCardSkeleton } from '@/components/ui/Skeleton';
import { PawPrint, Syringe, Bell, TrendingUp, ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const user = getUser();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) setCurrentTime('Good morning');
    else if (hour < 17) setCurrentTime('Good afternoon');
    else setCurrentTime('Good evening');

    petApi.getAll()
      .then((res) => {
        const data = res.data;
        setPets(Array.isArray(data) ? data : data.pets ?? []);
      })
      .catch(() => setPets([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: 'Total Pets',
      value: loading ? '—' : pets.length,
      icon: PawPrint,
      color: 'from-indigo-500/20 to-indigo-600/10',
      iconColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/20',
      change: '+0 this month',
    },
    {
      label: 'Vaccinations',
      value: '—',
      icon: Syringe,
      color: 'from-teal-500/20 to-teal-600/10',
      iconColor: 'text-teal-400',
      borderColor: 'border-teal-500/20',
      change: 'View records',
    },
    {
      label: 'Reminders',
      value: '—',
      icon: Bell,
      color: 'from-purple-500/20 to-purple-600/10',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/20',
      change: 'No pending',
    },
    {
      label: 'Health Score',
      value: '98%',
      icon: TrendingUp,
      color: 'from-emerald-500/20 to-emerald-600/10',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      change: '↑ Excellent',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/40 text-sm mb-1">{currentTime} 👋</p>
          <h1
            className="text-3xl font-bold gradient-text"
            style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}
          >
            {user?.name ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Welcome back!'}
          </h1>
          <p className="text-white/50 mt-1.5 text-sm">
            Here&apos;s an overview of your pets&apos; health status.
          </p>
        </div>
        <Link
          href="/pets/add"
          className="btn-gradient hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus size={16} />
            Add Pet
          </span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map((stat, i) => (
            <GlassCard
              key={i}
              className={`p-6 bg-gradient-to-br ${stat.color} border ${stat.borderColor} group hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 glass rounded-xl ${stat.iconColor}`}>
                  <stat.icon size={20} />
                </div>
                <span className="text-xs text-white/40">{stat.change}</span>
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-white/50">{stat.label}</p>
            </GlassCard>
          ))}
      </div>

      {/* Recent Pets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ fontFamily: 'Syne, sans-serif' }}>
            Your Pets
          </h2>
          <Link
            href="/pets"
            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 space-y-4">
                <div className="skeleton h-14 w-14 rounded-full" />
                <div className="skeleton h-5 w-32 rounded-lg" />
                <div className="skeleton h-4 w-24 rounded-lg" />
              </div>
            ))}
          </div>
        ) : pets.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <div className="text-5xl mb-4">🐾</div>
            <h3 className="text-lg font-semibold mb-2">No pets yet</h3>
            <p className="text-white/50 text-sm mb-6">
              Add your first pet to start tracking their health records.
            </p>
            <Link
              href="/pets/add"
              className="btn-gradient inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Plus size={16} /> Add your first pet
              </span>
            </Link>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.slice(0, 6).map((pet) => (
              <MiniPetCard key={pet._id || pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Add New Pet', desc: 'Register a new pet', icon: '🐶', href: '/pets/add' },
            { label: 'View All Pets', desc: 'Manage your pets', icon: '📋', href: '/pets' },
            { label: 'Health Records', desc: 'View vaccinations & history', icon: '💉', href: '/pets' },
          ].map((action) => (
            <Link key={action.href + action.label} href={action.href}>
              <GlassCard hover className="p-5 flex items-center gap-4">
                <span className="text-3xl">{action.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{action.label}</p>
                  <p className="text-xs text-white/40 mt-0.5">{action.desc}</p>
                </div>
                <ArrowRight size={16} className="ml-auto text-white/30" />
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniPetCard({ pet }: { pet: Pet }) {
  const emoji = ['🐶', '🐱', '🐰', '🐹', '🦜', '🐠'][Math.floor(Math.random() * 6)];
  return (
    <Link href={`/pets/${pet._id || pet.id}`}>
      <GlassCard hover glow className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-white/10 flex items-center justify-center text-2xl shrink-0">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{pet.name}</p>
          <p className="text-sm text-white/50 truncate">{pet.breed}</p>
          <p className="text-xs text-white/30 mt-0.5">{pet.age} yr{pet.age !== 1 ? 's' : ''} old</p>
        </div>
        <ArrowRight size={15} className="text-white/30 shrink-0" />
      </GlassCard>
    </Link>
  );
}
