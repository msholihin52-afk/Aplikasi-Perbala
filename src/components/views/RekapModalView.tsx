import React from 'react';
import { Transaction, User, MonthlyPagu, TarikTunai } from '../../types';
import { formatRupiah, matchesActiveFilter } from '../../lib/data';

interface RekapModalViewProps {
  transactions: Transaction[];
  monthlyPagu: MonthlyPagu[];
  tarikTunaiList: TarikTunai[];
  currentUser: User;
  activeSchoolFilter: string;
}

export const RekapModalView: React.FC<RekapModalViewProps> = ({
  transactions,
  monthlyPagu,
  tarikTunaiList,
  currentUser,
  activeSchoolFilter
}) => {
  const activeQuery = currentUser.role !== 'Admin' ? currentUser.instansi : activeSchoolFilter;

  const totalPagu = monthlyPagu
    .filter(p => matchesActiveFilter(p.sekolah, '', activeQuery))
    .reduce((acc, curr) => acc + curr.pagu, 0);

  const realModalBuku = transactions
    .filter(t => t.kategori === 'BUKU' && t.status === 'Disetujui' && matchesActiveFilter(t.sekolah, '', activeQuery))
    .reduce((acc, curr) => acc + curr.total_biaya, 0);

  const realModalAlat = transactions
    .filter(t => t.kategori === 'ALAT' && t.status === 'Disetujui' && matchesActiveFilter(t.sekolah, '', activeQuery))
    .reduce((acc, curr) => acc + curr.total_biaya, 0);

  const totalTarik = tarikTunaiList
    .filter(t => matchesActiveFilter(t.sekolah, '', activeQuery) && (t.status === 'Selesai' || t.status === 'Disetujui'))
    .reduce((acc, curr) => acc + curr.nilai, 0);

  const sisaPaguBersih = totalPagu - (realModalBuku + realModalAlat + totalTarik);
  const totalBase = Math.max(1, sisaPaguBersih);

  const pctBuku = ((realModalBuku / totalBase) * 100).toFixed(1);
  const pctAlat = ((realModalAlat / totalBase) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-2">Rekap Presentase Pembelanjaan</h3>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          Komparasi alokasi dana belanja modal buku dengan alat sekolah secara visual (Setelah dikurangi total tarik tunai dan habis pakai SIPLah).
        </p>
        <div className="space-y-6 text-sm">
          <div>
            <div className="flex justify-between mb-1.5 text-slate-600">
              <span className="font-semibold">Belanja Modal Buku</span>
              <span className="font-bold text-slate-800">
                {formatRupiah(realModalBuku)} ({pctBuku}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Number(pctBuku))}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1.5 text-slate-600">
              <span className="font-semibold">Belanja Modal Alat</span>
              <span className="font-bold text-slate-800">
                {formatRupiah(realModalAlat)} ({pctAlat}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Number(pctAlat))}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
