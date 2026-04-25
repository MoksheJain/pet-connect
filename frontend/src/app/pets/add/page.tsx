'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { petApi } from '@/lib/api';
import GlassCard from '@/components/ui/GlassCard';
import Spinner from '@/components/ui/Spinner';
import { PawPrint, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

export default function AddPetPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', breed: '', age: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.breed.trim() || !form.age) {
      setError('All fields are required.');
      return;
    }
    const age = Number(form.age);
    if (isNaN(age) || age < 0 || age > 50) {
      setError('Please enter a valid age (0–50).');
      return;
    }
    setLoading(true);
    try {
      const res = await petApi.create({ name: form.name.trim(), breed: form.breed.trim(), age });
      const petId = res.data?._id || res.data?.id || res.data?.pet?._id;
      setSuccess(true);
      setTimeout(() => {
        router.push(petId ? `/pets/${petId}` : '/pets');
      }, 1200);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to add pet. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    {
      name: 'name',
      label: 'Pet Name',
      placeholder: 'e.g. Buddy, Luna, Max',
      type: 'text',
      icon: '🐾',
    },
    {
      name: 'breed',
      label: 'Breed',
      placeholder: 'e.g. Golden Retriever, Persian Cat',
      type: 'text',
      icon: '🧬',
    },
    {
      name: 'age',
      label: 'Age (years)',
      placeholder: 'e.g. 3',
      type: 'number',
      icon: '🎂',
    },
  ];

  return (
    <div className="max-w-xl mx-auto animate-slide-up">
      {/* Back */}
      <Link
        href="/pets"
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={15} /> Back to Pets
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center text-3xl mx-auto mb-4 shadow-glow">
          <span>🐾</span>
        </div>
        <h1
          className="text-2xl font-bold gradient-text"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          Add a New Pet
        </h1>
        <p className="text-white/40 text-sm mt-2">
          Register your pet to start tracking their health records.
        </p>
      </div>

      <GlassCard className="p-8">
        {success ? (
          <div className="text-center py-8 animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-emerald-400" />
            </div>
            <h3 className="font-bold text-lg mb-1">Pet Added!</h3>
            <p className="text-white/50 text-sm">Redirecting to profile...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(({ name, label, placeholder, type, icon }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  <span className="mr-1.5">{icon}</span>
                  {label}
                </label>
                <div className="relative">
                  <input
                    name={name}
                    type={type}
                    value={form[name as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    min={type === 'number' ? 0 : undefined}
                    max={type === 'number' ? 50 : undefined}
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>
            ))}

            {/* Error */}
            {error && (
              <div className="glass border border-red-500/30 bg-red-500/10 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="relative z-10 flex items-center gap-2">
                  <Spinner className="w-4 h-4" /> Adding Pet...
                </span>
              ) : (
                <span className="relative z-10 flex items-center gap-2">
                  <PawPrint size={16} /> Add Pet
                </span>
              )}
            </button>
          </form>
        )}
      </GlassCard>

      {/* Tips */}
      <GlassCard className="mt-4 p-5">
        <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Tips</p>
        <ul className="space-y-2 text-sm text-white/50">
          <li className="flex gap-2"><span>💡</span> Enter your pet's common name, not their full registered name.</li>
          <li className="flex gap-2"><span>💡</span> Be specific with the breed for better health recommendations.</li>
          <li className="flex gap-2"><span>💡</span> You can update all details from the pet profile page later.</li>
        </ul>
      </GlassCard>
    </div>
  );
}
