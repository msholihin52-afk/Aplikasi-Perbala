import React from 'react';
import { Printer, Download } from 'lucide-react';
import { Transaction, User } from '../../types';
import { formatRupiah, matchesActiveFilter } from '../../lib/data';

interface RekapSiplahViewProps {
  transactions: Transaction[];
  currentUser: User;
  activeSchoolFilter: string;
  onExportCsv: (type: string) => void;
}

export const RekapSiplahView: React.FC<RekapSiplahViewProps> = ({
  transactions,
  currentUser,
  activeSchoolFilter,
  onExportCsv
}) => {
  const activeQuery = currentUser.role !== 'Admin' ? currentUser.instansi : activeSchoolFilter;
  const siplahTx = transactions.filter(
    t => t.kategori === 'SIPLAH' && matchesActiveFilter(t.sekolah, '', activeQuery)
  );

  const totalSiplah = siplahTx
    .filter(t => t.status === 'Disetujui')
    .reduce((acc, curr) => acc + curr.total_biaya, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/60 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-fuchsia-600 uppercase tracking-widest block">
              Total Belanja Habis Pakai SIPLah
            </span>
            <h4 className="text-2xl font-black text-slate-800 mt-1">{formatRupiah(totalSiplah)}</h4>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Berdasarkan akumulasi belanja habis pakai SIPLah terverifikasi.
            </p>
          </div>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">
              Jumlah Transaksi SIPLah
            </span>
            <h4 className="text-2xl font-black text-slate-800 mt-1">{siplahTx.length} Transaksi</h4>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div className="bg-fuchsia-500 h-full rounded-full w-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Rekapitulasi Belanja Habis Pakai SIPLah</h3>
            <p className="text-xs text-slate-500">
              Daftar transaksi pengadaan belanja barang operasional harian sekolah mitra SIPLah.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak Laporan
            </button>
            <button
              onClick={() => onExportCsv('SIPLah')}
              className="px-3 py-2 bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-teal-100 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Unduh Rekap SIPLah
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase">
                <th className="py-3 px-4">No Transaksi</th>
                <th className="py-3 px-4">Nama Belanja Habis Pakai</th>
                <th className="py-3 px-4">Sekolah</th>
                <th className="py-3 px-4">ID RAB Terikat</th>
                <th className="py-3 px-4 text-center">Jumlah Vol</th>
                <th className="py-3 px-4 text-right">Nilai Transaksi</th>
                <th className="py-3 px-4 text-center">Tanggal Bayar</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {siplahTx.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-500">
                    Tidak ada pengeluaran habis pakai SIPLah di penatausahaan.
                  </td>
                </tr>
              ) : (
                siplahTx.map(item => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-slate-500 font-bold">{item.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{item.nama_barang}</td>
                    <td className="py-3 px-4 text-slate-500">{item.sekolah}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{item.rab_id || '-'}</td>
                    <td className="py-3 px-4 text-center text-slate-500">{item.jumlah || '1'}</td>
                    <td className="py-3 px-4 text-right text-emerald-700 font-bold">{formatRupiah(item.total_biaya)}</td>
                    <td className="py-3 px-4 text-center text-slate-500">{item.tanggal}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
