import React from 'react';
import { Calendar, Plus, Edit3, Trash2 } from 'lucide-react';
import { MonthlyPagu, User } from '../../types';
import { formatRupiah, matchesActiveFilter, MONTHS_LIST } from '../../lib/data';

interface PaguTiapBulanViewProps {
  monthlyPagu: MonthlyPagu[];
  currentUser: User;
  activeSchoolFilter: string;
  onOpenMonthlyPaguModal: (bulan?: string, pagu?: number) => void;
  onDeleteMonthlyPagu: (bulan: string) => void;
}

export const PaguTiapBulanView: React.FC<PaguTiapBulanViewProps> = ({
  monthlyPagu,
  currentUser,
  activeSchoolFilter,
  onOpenMonthlyPaguModal,
  onDeleteMonthlyPagu
}) => {
  const activeQuery = currentUser.role !== 'Admin' ? currentUser.instansi : activeSchoolFilter;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Alokasi Distribusi Anggaran Bulanan (Jan - Des)
            </h3>
            <p className="text-xs text-slate-500">
              Rencana penyerapan pagu dana operasional sekolah setiap bulannya. Dilengkapi aksi edit/hapus.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onOpenMonthlyPaguModal()}
              className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-purple-700 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah / Edit Pagu Bulanan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MONTHS_LIST.map(m => {
            const filteredPagu = monthlyPagu.filter(p => p.bulan === m && matchesActiveFilter(p.sekolah, '', activeQuery));
            const totalNominal = filteredPagu.reduce((acc, curr) => acc + curr.pagu, 0);

            return (
              <div
                key={m}
                className="p-4 bg-white border border-slate-200/60 rounded-xl text-center space-y-1 relative overflow-hidden flex flex-col justify-between shadow-sm"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-600"></div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">{m}</span>
                  <h4 className="text-xs font-black text-slate-800">{formatRupiah(totalNominal)}</h4>
                  <span className="text-[9px] text-slate-500 block">{filteredPagu.length} Lembaga</span>
                </div>
                <div className="flex gap-1 justify-center mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onOpenMonthlyPaguModal(m, totalNominal)}
                    className="px-2 py-1 bg-amber-500 text-black font-bold text-[9px] rounded flex items-center gap-1 hover:bg-amber-600 transition cursor-pointer"
                  >
                    <Edit3 className="w-2.5 h-2.5" /> Edit
                  </button>
                  <button
                    onClick={() => onDeleteMonthlyPagu(m)}
                    className="px-2 py-1 bg-rose-500 text-white font-bold text-[9px] rounded flex items-center gap-1 hover:bg-rose-600 transition cursor-pointer"
                  >
                    <Trash2 className="w-2.5 h-2.5" /> Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
