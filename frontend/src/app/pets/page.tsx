'use client';

import { useEffect, useState } from 'react';
import { petApi } from '@/lib/api';
import { Pet } from '@/types';
import GlassCard from '@/components/ui/GlassCard';
import { PetCardSkeleton } from '@/components/ui/Skeleton';
import { Plus, Search, PawPrint, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const PET_EMOJIS: Record<string, string> = {
  dog: '🐶', cat: '🐱', rabbit: '🐰', hamster: '🐹',
  parrot: '🦜', fish: '🐠', turtle: '🐢', bird: '🦅',
};

function getPetEmoji(breed: string): string {
  const lower = breed.toLowerCase();
  for (const [key, emoji] of Object.entries(PET_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return '🐾';
}

const CARD_GRADIENTS = [
  'from-indigo-500/20 to-purple-500/10',
  'from-teal-500/20 to-cyan-500/10',
  'from-pink-500/20 to-rose-500/10',
  'from-amber-500/20 to-orange-500/10',
  'from-emerald-500/20 to-green-500/10',
  'from-blue-500/20 to-sky-500/10',
];

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    petApi.getAll()
      .then((res) => {
        const data = res.data;
        setPets(Array.isArray(data) ? data : data.pets ?? []);
      })
      .catch(() => setError('Failed to load pets. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = pets.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.breed.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-7 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1
            className="text-2xl font-bold gradient-text"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            My Pets
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {loading ? 'Loading...' : `${pets.length} pet${pets.length !== 1 ? 's' : ''} registered`}
          </p>
        </div>
        <Link
          href="/pets/add"
          className="btn-gradient flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold w-fit"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus size={16} /> Add New Pet
          </span>
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 glass-input rounded-xl px-4 py-3 max-w-sm">
        <Search size={16} className="text-white/40 shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or breed..."
          className="bg-transparent outline-none text-sm w-full text-white placeholder:text-white/35"
        />
      </div>

      {/* Error */}
      {error && (
        <GlassCard className="p-4 border-red-500/30 bg-red-500/10">
          <p className="text-red-400 text-sm">{error}</p>
        </GlassCard>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <PetCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <GlassCard className="p-14 text-center">
          <PawPrint size={48} className="text-white/20 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">
            {search ? 'No pets match your search' : 'No pets yet'}
          </h3>
          <p className="text-white/40 text-sm mb-6">
            {search
              ? 'Try a different name or breed.'
              : 'Start by adding your first pet to the system.'}
          </p>
          {!search && (
            <Link
              href="/pets/add"
              className="btn-gradient inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Plus size={16} /> Add Your First Pet
              </span>
            </Link>
          )}
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((pet, i) => (
            <PetCard key={pet._id || pet.id} pet={pet} gradient={CARD_GRADIENTS[i % CARD_GRADIENTS.length]} />
          ))}
        </div>
      )}
    </div>
  );
}

function PetCard({ pet, gradient }: { pet: Pet; gradient: string }) {
  const id = pet._id || pet.id;
  const emoji = getPetEmoji(pet.breed);

  return (
    <GlassCard className={`p-6 bg-gradient-to-br ${gradient} hover:-translate-y-1 transition-all duration-300 group`}>
      {/* Avatar */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-14 h-14 rounded-2xl glass border border-white/15 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform duration-300">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg leading-tight truncate">{pet.name}</h3>
          <p className="text-sm text-white/55 truncate">{pet.breed}</p>
        </div>
      </div>

      {/* Info pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="badge-blue text-xs px-3 py-1 rounded-full font-medium">
          🎂 {pet.age} yr{pet.age !== 1 ? 's' : ''}
        </span>
        {pet.species && (
          <span className="badge-green text-xs px-3 py-1 rounded-full font-medium">
            {pet.species}
          </span>
        )}
        {pet.weight && (
          <span className="glass text-xs px-3 py-1 rounded-full text-white/60 font-medium border border-white/10">
            ⚖️ {pet.weight} kg
          </span>
        )}
      </div>

      {/* View button */}
      <Link href={`/pets/${id}`}>
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl glass border border-white/15 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 group">
          View Profile
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </Link>
    </GlassCard>
  );
}
