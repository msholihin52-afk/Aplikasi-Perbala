import React from 'react';
import { Printer, Download } from 'lucide-react';
import { School, Transaction, TarikTunai, User } from '../../types';
import { formatRupiah, matchesActiveFilter, isSameSchool } from '../../lib/data';

interface LaporanTahunanViewProps {
  schools: School[];
  transactions: Transaction[];
  tarikTunaiList: TarikTunai[];
  currentUser: User;
  activeSchoolFilter: string;
  onExportCsv: (type: string) => void;
}

export const LaporanTahunanView: React.FC<LaporanTahunanViewProps> = ({
  schools,
  transactions,
  tarikTunaiList,
  currentUser,
  activeSchoolFilter,
  onExportCsv
}) => {
  const activeQuery = currentUser.role !== 'Admin' ? currentUser.instansi : activeSchoolFilter;
  const filteredSchools = schools.filter(s => matchesActiveFilter(s.nama, s.npsn, activeQuery));

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Laporan Laba/Rugi Tahunan Terintegrasi</h3>
            <p className="text-xs text-slate-500">
              Kompilasi rekapitulasi data keuangan seluruh sekolah se-Kabupaten tahun 2026.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Cetak Laporan
            </button>
            <button
              onClick={() => onExportCsv('Laporan-Tahunan')}
              className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs hover:bg-purple-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Ekspor Laporan (.CSV)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase">
                <th className="py-3 px-4">NPSN</th>
                <th className="py-3 px-4">Nama Sekolah</th>
                <th className="py-3 px-4 text-right">Pagu Tahunan</th>
                <th className="py-3 px-4 text-right">Realisasi Pengadaan + Tarik</th>
                <th className="py-3 px-4 text-right">Sisa Pagu Bersih</th>
                <th className="py-3 px-4 text-center">Status Laporan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-500">
                    Tidak ada data sekolah terfilter.
                  </td>
                </tr>
              ) : (
                filteredSchools.map(sch => {
                  const totalPagu = (sch.pagu_t1 || 0) + (sch.pagu_t2 || 0);
                  const realizedTransactions = transactions
                    .filter(t => isSameSchool(t.sekolah, sch.nama) && t.status === 'Disetujui')
                    .reduce((acc, curr) => acc + curr.total_biaya, 0);

                  const realizedTarik = tarikTunaiList
                    .filter(t => isSameSchool(t.sekolah, sch.nama) && (t.status === 'Selesai' || t.status === 'Disetujui'))
                    .reduce((acc, curr) => acc + curr.nilai, 0);

                  const totalRealized = realizedTransactions + realizedTarik;
                  const remaining = totalPagu - totalRealized;

                  return (
                    <tr key={sch.npsn} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">{sch.npsn}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{sch.nama}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-800">{formatRupiah(totalPagu)}</td>
                      <td className="py-3 px-4 text-right text-emerald-700 font-bold">{formatRupiah(totalRealized)}</td>
                      <td className="py-3 px-4 text-right text-blue-700 font-bold">{formatRupiah(remaining)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[9px] font-bold">
                          Terverifikasi
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
