import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { School, User } from '../types';
import { MONTHS_LIST } from '../lib/data';

interface MonthlyPaguModalProps {
  showModal: boolean;
  onClose: () => void;
  schools: School[];
  currentUser: User;
  activeSchoolFilter: string;
  initialBulan?: string;
  initialPagu?: number;
  onSave: (sekolah: string, bulan: string, pagu: number) => void;
}

export const MonthlyPaguModal: React.FC<MonthlyPaguModalProps> = ({
  showModal,
  onClose,
  schools,
  currentUser,
  activeSchoolFilter,
  initialBulan = 'Januari',
  initialPagu = 0,
  onSave
}) => {
  const [sekolah, setSekolah] = useState('');
  const [bulan, setBulan] = useState('Januari');
  const [pagu, setPagu] = useState<number | ''>(0);

  useEffect(() => {
    if (showModal) {
      setBulan(initialBulan);
      setPagu(initialPagu || '');

      if (currentUser.role === 'Admin') {
        if (activeSchoolFilter !== 'SEMUA') {
          setSekolah(activeSchoolFilter);
        } else if (schools.length > 0) {
          setSekolah(schools[0].nama);
        }
      } else {
        setSekolah(currentUser.instansi);
      }
    }
  }, [showModal, initialBulan, initialPagu, currentUser, activeSchoolFilter, schools]);

  if (!showModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sekolah) return;
    onSave(sekolah, bulan, Number(pagu) || 0);
    onClose();
  };

  const isAdmin = currentUser.role === 'Admin';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          Atur Pagu Bulanan
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Sekolah</label>
            {isAdmin ? (
              <select
                value={sekolah}
                onChange={e => setSekolah(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {schools.map(sch => (
                  <option key={sch.npsn} value={sch.nama}>
                    {sch.nama}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                readOnly
                value={sekolah}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-600 font-bold"
              />
            )}
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Bulan</label>
            <select
              value={bulan}
              onChange={e => setBulan(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              {MONTHS_LIST.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Nominal Pagu (Rp)</label>
            <input
              type="number"
              required
              value={pagu}
              onChange={e => setPagu(e.target.value ? Number(e.target.value) : '')}
              placeholder="Contoh: 10000000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-purple-600 text-white font-bold rounded-xl text-sm hover:bg-purple-700 transition-colors cursor-pointer"
            >
              Simpan Pagu
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
