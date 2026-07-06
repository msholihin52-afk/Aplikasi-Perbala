import React from 'react';
import { Coins, RefreshCw, ShieldCheck } from 'lucide-react';
import { MonthlyPagu, School, User } from '../../types';
import { formatRupiah, matchesActiveFilter } from '../../lib/data';

interface PaguAnggaranViewProps {
  monthlyPagu: MonthlyPagu[];
  schools: School[];
  currentUser: User;
  activeSchoolFilter: string;
  onSyncPagu: () => void;
}

export const PaguAnggaranView: React.FC<PaguAnggaranViewProps> = ({
  monthlyPagu,
  schools,
  currentUser,
  activeSchoolFilter,
  onSyncPagu
}) => {
  const activeQuery = currentUser.role !== 'Admin' ? currentUser.instansi : activeSchoolFilter;

  const bulanTahap1 = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];
  const bulanTahap2 = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  let totalTahap1 = 0;
  let totalTahap2 = 0;

  monthlyPagu.forEach(p => {
    if (matchesActiveFilter(p.sekolah, '', activeQuery)) {
      if (bulanTahap1.includes(p.bulan)) totalTahap1 += p.pagu;
      else if (bulanTahap2.includes(p.bulan)) totalTahap2 += p.pagu;
    }
  });

  const combinedTotal = totalTahap1 + totalTahap2;
  const filteredSchools = schools.filter(s => matchesActiveFilter(s.nama, s.npsn, activeQuery));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Coins className="text-amber-600 w-5 h-5" /> Atur Pagu Anggaran Utama
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Total pagu dihitung otomatis dari total pagu bulanan (terkunci).
          </p>

          <form onSubmit={e => { e.preventDefault(); onSyncPagu(); }} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Total Pagu Anggaran (Rp) - Terkunci Otomatis
              </label>
              <input
                type="text"
                readOnly
                disabled
                value={formatRupiah(combinedTotal)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-700 text-xs font-bold cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Total Pagu Tahap 1 (Bulan Jan-Jun)
              </label>
              <input
                type="text"
                readOnly
                disabled
                value={formatRupiah(totalTahap1)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-700 text-xs font-bold cursor-not-allowed"
              />
              <p className="text-[10px] text-amber-600 mt-1 font-semibold">
                *(Nilai terkunci. Jika salah, silakan sesuaikan nominal pada menu Pagu Tiap Bulan.)*
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Total Pagu Tahap 2 (Bulan Jul-Des)
              </label>
              <input
                type="text"
                readOnly
                disabled
                value={formatRupiah(totalTahap2)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-700 text-xs font-bold cursor-not-allowed"
              />
              <p className="text-[10px] text-amber-600 mt-1 font-semibold">
                *(Nilai terkunci. Jika salah, silakan sesuaikan nominal pada menu Pagu Tiap Bulan.)*
              </p>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition flex justify-center items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Simpan & Sinkronkan Pagu (Otomatis Keluar Sesi)</span>
            </button>
          </form>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-2">Informasi Alokasi Pagu (Sesuai Filter)</h3>
            <p className="text-xs text-slate-500 mb-6">Analisis kuota operasional bulanan sekolah yang sedang disaring.</p>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Total Lembaga Terfilter:</span>
                <span className="text-slate-800 font-bold">{filteredSchools.length} Sekolah</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Total Kuota Pagu Aktif:</span>
                <span className="text-amber-700 font-bold">{formatRupiah(combinedTotal)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Pagu Alokasi Tahap 1:</span>
                <span className="text-emerald-700 font-bold">{formatRupiah(totalTahap1)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Pagu Alokasi Tahap 2:</span>
                <span className="text-blue-700 font-bold">{formatRupiah(totalTahap2)}</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
            <span className="block text-[10px] text-slate-500 uppercase font-black">Status Keamanan Anggaran</span>
            <span className="text-xs text-emerald-700 font-extrabold flex items-center justify-center gap-1 mt-1">
              <ShieldCheck className="w-4 h-4" /> Sinkronisasi Spreadsheet Aktif
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
