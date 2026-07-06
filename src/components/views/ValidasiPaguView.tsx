import React from 'react';
import { School, Transaction, User } from '../../types';
import { formatRupiah, matchesActiveFilter, isSameSchool } from '../../lib/data';

interface ValidasiPaguViewProps {
  schools: School[];
  transactions: Transaction[];
  currentUser: User;
  activeSchoolFilter: string;
}

export const ValidasiPaguView: React.FC<ValidasiPaguViewProps> = ({
  schools,
  transactions,
  currentUser,
  activeSchoolFilter
}) => {
  const activeQuery = currentUser.role !== 'Admin' ? currentUser.instansi : activeSchoolFilter;
  const filteredSchools = schools.filter(s => matchesActiveFilter(s.nama, s.npsn, activeQuery));

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-2">Validasi Batas Pengeluaran VS Pagu Lembaga</h3>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          Deteksi instan dan otomatis dari sistem untuk memantau apakah ada sekolah yang melebihi batas pagu (telah disinkronkan dengan total tarik tunai dan habis pakai SIPLah).
        </p>

        <div className="space-y-4">
          {filteredSchools.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">Tidak ada data sekolah terfilter.</p>
          ) : (
            filteredSchools.map(sch => {
              const totalPagu = (sch.pagu_t1 || 0) + (sch.pagu_t2 || 0);
              const realized = transactions
                .filter(t => isSameSchool(t.sekolah, sch.nama) && t.status === 'Disetujui')
                .reduce((acc, curr) => acc + curr.total_biaya, 0);

              const pct = totalPagu > 0 ? ((realized / totalPagu) * 100).toFixed(1) : '0.0';
              const isOver = realized > totalPagu;

              return (
                <div
                  key={sch.npsn}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                    isOver ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200/60 shadow-sm'
                  }`}
                >
                  <div className="flex-1 w-full space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-800 text-xs">{sch.nama}</h4>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isOver ? 'bg-rose-600' : 'bg-purple-600'}`}
                        style={{ width: `${Math.min(Number(pct), 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Realisasi: {formatRupiah(realized)}</span>
                      <span>Pagu Limit: {formatRupiah(totalPagu)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {isOver ? (
                      <span className="px-3 py-1 bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-lg text-[10px]">
                        Overbudget!
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold rounded-lg text-[10px]">
                        Aman ({pct}%)
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
