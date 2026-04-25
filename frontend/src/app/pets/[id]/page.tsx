'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { petApi, VaccinationPayload, ReminderPayload, HistoryPayload } from '@/lib/api';
import { PetFullProfile, Vaccination, Reminder, MedicalHistory } from '@/types';
import GlassCard from '@/components/ui/GlassCard';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils';
import {
  ArrowLeft, Syringe, Bell, ClipboardList, Plus,
  CheckCircle, Calendar, User, AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

type ModalType = 'vaccination' | 'reminder' | 'history' | null;

export default function PetProfilePage() {
  const params = useParams();
  let id = params?.id as string;
  const [pet, setPet] = useState<PetFullProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<ModalType>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const fetchProfile = useCallback(async () => {
    id = "1";
    if (!id) {
      console.error("ID is undefined, skipping API call");
      return;
    }

    try {
      const res = await petApi.getFullProfile(id);
      setPet(res.data?.pet ?? res.data);
    } catch {
      setError("Failed to load pet profile.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // ── Vaccination form ──────────────────────────────────────
  const [vacForm, setVacForm] = useState<VaccinationPayload>({
    vaccineName: '', dateAdministered: '', nextDueDate: '', notes: '',
  });

  async function submitVaccination() {
    if (!vacForm.vaccineName || !vacForm.dateAdministered) {
      setSaveError('Vaccine name and date are required.'); return;
    }
    setSaving(true); setSaveError('');
    try {
      await petApi.addVaccination(id, vacForm);
      setModal(null);
      setVacForm({ vaccineName: '', dateAdministered: '', nextDueDate: '', notes: '' });
      fetchProfile();
    } catch { setSaveError('Failed to save vaccination.'); }
    finally { setSaving(false); }
  }

  // ── Reminder form ──────────────────────────────────────────
  const [remForm, setRemForm] = useState<ReminderPayload>({ title: '', dueDate: '', description: '' });

  async function submitReminder() {
    if (!remForm.title || !remForm.dueDate) {
      setSaveError('Title and due date are required.'); return;
    }
    setSaving(true); setSaveError('');
    try {
      await petApi.addReminder(id, remForm);
      setModal(null);
      setRemForm({ title: '', dueDate: '', description: '' });
      fetchProfile();
    } catch { setSaveError('Failed to save reminder.'); }
    finally { setSaving(false); }
  }

  // ── History form ───────────────────────────────────────────
  const [histForm, setHistForm] = useState<HistoryPayload>({ date: '', description: '', veterinarian: '' });

  async function submitHistory() {
    if (!histForm.date || !histForm.description) {
      setSaveError('Date and description are required.'); return;
    }
    setSaving(true); setSaveError('');
    try {
      await petApi.addHistory(id, histForm);
      setModal(null);
      setHistForm({ date: '', description: '', veterinarian: '' });
      fetchProfile();
    } catch { setSaveError('Failed to save history.'); }
    finally { setSaving(false); }
  }

  function closeModal() { setModal(null); setSaveError(''); }

  if (loading) return <ProfileSkeleton />;
  if (error || !pet) return (
    <div className="max-w-4xl mx-auto pt-10 text-center">
      <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
      <p className="text-red-400">{error || 'Pet not found.'}</p>
      <Link href="/pets" className="text-indigo-400 text-sm mt-4 inline-block hover:underline">← Back to pets</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <Link href="/pets" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
        <ArrowLeft size={15} /> Back to Pets
      </Link>

      {/* Profile Header */}
      <GlassCard className="p-6 bg-gradient-to-br from-indigo-500/15 to-purple-500/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-white/15 flex items-center justify-center text-4xl shrink-0">
            🐾
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>{pet.name}</h1>
            <p className="text-white/50 mt-1">{pet.breed}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="badge-blue text-xs px-3 py-1 rounded-full font-medium">🎂 {pet.age} yr{pet.age !== 1 ? 's' : ''} old</span>
              {pet.species && <span className="badge-green text-xs px-3 py-1 rounded-full font-medium">{pet.species}</span>}
              {pet.weight && <span className="glass text-xs px-3 py-1 rounded-full text-white/60 border border-white/10">⚖️ {pet.weight} kg</span>}
            </div>
          </div>
          {/* Stats */}
          <div className="flex gap-4 shrink-0">
            {[
              { label: 'Vaccines', value: pet.vaccinations?.length ?? 0, color: 'text-teal-400' },
              { label: 'Reminders', value: pet.reminders?.length ?? 0, color: 'text-purple-400' },
              { label: 'Records', value: pet.medicalHistory?.length ?? 0, color: 'text-indigo-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center glass rounded-xl px-4 py-3">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-white/40 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Grid: Vaccinations + Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vaccinations */}
        <Section
          title="Vaccinations"
          icon={<Syringe size={18} className="text-teal-400" />}
          onAdd={() => { setModal('vaccination'); setSaveError(''); }}
          color="teal"
        >
          {(pet.vaccinations ?? []).length === 0 ? (
            <EmptyState icon="💉" text="No vaccinations recorded yet." />
          ) : (
            <div className="space-y-3">
              {pet.vaccinations.map((v) => <VaccinationRow key={v._id} v={v} />)}
            </div>
          )}
        </Section>

        {/* Reminders */}
        <Section
          title="Reminders"
          icon={<Bell size={18} className="text-purple-400" />}
          onAdd={() => { setModal('reminder'); setSaveError(''); }}
          color="purple"
        >
          {(pet.reminders ?? []).length === 0 ? (
            <EmptyState icon="🔔" text="No reminders set yet." />
          ) : (
            <div className="space-y-3">
              {pet.reminders.map((r) => <ReminderRow key={r._id} r={r} />)}
            </div>
          )}
        </Section>
      </div>

      {/* Medical History */}
      <Section
        title="Medical History"
        icon={<ClipboardList size={18} className="text-indigo-400" />}
        onAdd={() => { setModal('history'); setSaveError(''); }}
        color="indigo"
      >
        {(pet.medicalHistory ?? []).length === 0 ? (
          <EmptyState icon="📋" text="No medical history recorded yet." />
        ) : (
          <div className="space-y-3">
            {pet.medicalHistory.map((h) => <HistoryRow key={h._id} h={h} />)}
          </div>
        )}
      </Section>

      {/* ── Vaccination Modal ── */}
      <Modal open={modal === 'vaccination'} onClose={closeModal} title="Add Vaccination">
        <div className="space-y-4">
          {[
            { key: 'vaccineName', label: 'Vaccine Name *', placeholder: 'e.g. Rabies, Distemper', type: 'text' },
            { key: 'dateAdministered', label: 'Date Administered *', placeholder: '', type: 'date' },
            { key: 'nextDueDate', label: 'Next Due Date', placeholder: '', type: 'date' },
            { key: 'notes', label: 'Notes', placeholder: 'Optional notes...', type: 'text' },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="block text-sm text-white/60 mb-1.5">{label}</label>
              <input
                type={type}
                value={vacForm[key as keyof VaccinationPayload]}
                onChange={(e) => setVacForm((p) => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          ))}
          <ModalFooter error={saveError} saving={saving} onCancel={closeModal} onSave={submitVaccination} />
        </div>
      </Modal>

      {/* ── Reminder Modal ── */}
      <Modal open={modal === 'reminder'} onClose={closeModal} title="Add Reminder">
        <div className="space-y-4">
          {[
            { key: 'title', label: 'Title *', placeholder: 'e.g. Annual Checkup', type: 'text' },
            { key: 'dueDate', label: 'Due Date *', placeholder: '', type: 'date' },
            { key: 'description', label: 'Description', placeholder: 'Optional details...', type: 'text' },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="block text-sm text-white/60 mb-1.5">{label}</label>
              <input
                type={type}
                value={remForm[key as keyof ReminderPayload]}
                onChange={(e) => setRemForm((p) => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          ))}
          <ModalFooter error={saveError} saving={saving} onCancel={closeModal} onSave={submitReminder} />
        </div>
      </Modal>

      {/* ── History Modal ── */}
      <Modal open={modal === 'history'} onClose={closeModal} title="Add Medical History">
        <div className="space-y-4">
          {[
            { key: 'date', label: 'Date *', placeholder: '', type: 'date' },
            { key: 'description', label: 'Description *', placeholder: 'e.g. Annual wellness exam, treated for...', type: 'text' },
            { key: 'veterinarian', label: 'Veterinarian', placeholder: 'Dr. Smith', type: 'text' },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="block text-sm text-white/60 mb-1.5">{label}</label>
              <input
                type={type}
                value={histForm[key as keyof HistoryPayload]}
                onChange={(e) => setHistForm((p) => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          ))}
          <ModalFooter error={saveError} saving={saving} onCancel={closeModal} onSave={submitHistory} />
        </div>
      </Modal>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function Section({
  title, icon, onAdd, color, children,
}: {
  title: string; icon: ReactNode; onAdd: () => void; color: string; children: ReactNode;
}) {
  const borderMap: Record<string, string> = {
    teal: 'border-teal-500/20', purple: 'border-purple-500/20', indigo: 'border-indigo-500/20',
  };
  return (
    <GlassCard className={`p-6 border ${borderMap[color] ?? ''}`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 glass rounded-lg">{icon}</div>
          <h2 className="font-semibold" style={{ fontFamily: 'Syne, sans-serif' }}>{title}</h2>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 glass rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all"
        >
          <Plus size={13} /> Add
        </button>
      </div>
      {children}
    </GlassCard>
  );
}

function VaccinationRow({ v }: { v: Vaccination }) {
  return (
    <div className="flex items-start gap-3 p-3 glass rounded-xl hover:bg-white/05 transition-colors">
      <CheckCircle size={16} className="text-teal-400 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{v.vaccineName}</p>
        <p className="text-xs text-white/40 mt-0.5">
          Given: {formatDate(v.dateAdministered)}
          {v.nextDueDate && <> · Next: {formatDate(v.nextDueDate)}</>}
        </p>
        {v.notes && <p className="text-xs text-white/30 mt-1 italic">{v.notes}</p>}
      </div>
    </div>
  );
}

function ReminderRow({ r }: { r: Reminder }) {
  const isPast = new Date(r.dueDate) < new Date();
  return (
    <div className="flex items-start gap-3 p-3 glass rounded-xl hover:bg-white/05 transition-colors">
      <Calendar size={16} className={`mt-0.5 shrink-0 ${isPast ? 'text-red-400' : 'text-purple-400'}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{r.title}</p>
          {isPast && !r.completed && (
            <span className="badge-red text-[10px] px-2 py-0.5 rounded-full">Overdue</span>
          )}
          {r.completed && (
            <span className="badge-green text-[10px] px-2 py-0.5 rounded-full">Done</span>
          )}
        </div>
        <p className="text-xs text-white/40 mt-0.5">Due: {formatDate(r.dueDate)}</p>
        {r.description && <p className="text-xs text-white/30 mt-1">{r.description}</p>}
      </div>
    </div>
  );
}

function HistoryRow({ h }: { h: MedicalHistory }) {
  return (
    <div className="flex items-start gap-3 p-3 glass rounded-xl hover:bg-white/05 transition-colors">
      <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm">{h.description}</p>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-xs text-white/40">{formatDate(h.date)}</p>
          {h.veterinarian && (
            <p className="text-xs text-white/30 flex items-center gap-1">
              <User size={10} /> {h.veterinarian}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="text-center py-8">
      <span className="text-3xl block mb-2">{icon}</span>
      <p className="text-sm text-white/35">{text}</p>
    </div>
  );
}

function ModalFooter({
  error, saving, onCancel, onSave,
}: { error: string; saving: boolean; onCancel: () => void; onSave: () => void; }) {
  return (
    <>
      {error && (
        <p className="text-red-400 text-sm glass border border-red-500/30 bg-red-500/10 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
      <div className="flex gap-3 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl glass border border-white/15 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="flex-1 btn-gradient py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {saving ? (
            <span className="relative z-10 flex items-center gap-2"><Spinner className="w-4 h-4" /> Saving...</span>
          ) : (
            <span className="relative z-10">Save</span>
          )}
        </button>
      </div>
    </>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Skeleton className="h-4 w-24" />
      <div className="glass rounded-2xl p-6">
        <div className="flex gap-5">
          <Skeleton className="w-20 h-20 rounded-3xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {Array(2).fill(0).map((_, i) => (
          <div key={i} className="glass rounded-2xl p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            {Array(3).fill(0).map((_, j) => <Skeleton key={j} className="h-14 rounded-xl" />)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Allow ReactNode type in JSX without explicit import issue
import type { ReactNode } from 'react';
