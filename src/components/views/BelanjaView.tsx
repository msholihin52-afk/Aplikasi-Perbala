import React from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { Transaction, School, User, KategoriBelanja } from '../../types';
import { formatRupiah, matchesActiveFilter, isSameSchool } from '../../lib/data';

interface BelanjaViewProps {
  kategori: KategoriBelanja;
  transactionsList: Transaction[];
  schools: School[];
  currentUser: User;
  activeSchoolFilter: string;
  onOpenTransactionModal: (tx?: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const BelanjaView: React.FC<BelanjaViewProps> = ({
  kategori,
  transactionsList,
  schools,
  currentUser,
  activeSchoolFilter,
  onOpenTransactionModal,
  onDeleteTransaction
}) => {
  const activeQuery = currentUser.role !== 'Admin' ? currentUser.instansi : activeSchoolFilter;
  const filteredTransactions = transactionsList.filter(
    t => t.kategori === kategori && matchesActiveFilter(t.sekolah, '', activeQuery)
  );

  // Total school pagu for active filter
  let totalPagu = 0;
  if (activeQuery === 'SEMUA') {
    totalPagu = schools.reduce((acc, curr) => acc + (curr.pagu_t1 || 0) + (curr.pagu_t2 || 0), 0);
  } else {
    const found = schools.find(s => isSameSchool(s.nama, activeQuery) || isSameSchool(s.npsn, activeQuery));
    if (found) totalPagu = (found.pagu_t1 || 0) + (found.pagu_t2 || 0);
  }

  const totalSpent = filteredTransactions.reduce((acc, curr) => acc + (curr.total_biaya || 0), 0);
  const remainingBudget = totalPagu - totalSpent;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 relative overflow-hidden shadow-sm">
          <span className="block text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">Total Pagu Sekolah</span>
          <h3 className="text-xl font-extrabold text-slate-800">{formatRupiah(totalPagu)}</h3>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">Seluruh Alokasi Anggaran Sekolah</p>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 relative overflow-hidden shadow-sm">
          <span className="block text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">Total Belanja Kategori Ini</span>
          <h3 className="text-xl font-extrabold text-amber-700">{formatRupiah(totalSpent)}</h3>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">Realisasi Pengeluaran Terverifikasi</p>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 relative overflow-hidden shadow-sm">
          <span className="block text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">Sisa Anggaran Belanja</span>
          <h3 className={`text-xl font-extrabold ${remainingBudget < 0 ? 'text-rose-600' : 'text-teal-700'}`}>
            {formatRupiah(remainingBudget)}
          </h3>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">Batas Saldo Belanja Tersedia</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Rincian Belanja Realisasi - {kategori}
            </h3>
            <p className="text-xs text-slate-500">
              Seluruh berkas transaksi pengadaan yang terealisasi dari penganggaran (RAB). Anggota dapat melakukan edit/hapus.
            </p>
          </div>
          <button
            onClick={() => onOpenTransactionModal()}
            className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs hover:bg-purple-700 transition cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Tambah Transaksi Realisasi
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Nama Belanja</th>
                <th className="py-3 px-4">Sekolah</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Terikat RAB</th>
                <th className="py-3 px-4 text-center">Volume / Jumlah</th>
                <th className="py-3 px-4 text-right">Total Anggaran</th>
                <th className="py-3 px-4 text-center">Tanggal</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-6 text-slate-500">
                    Belum ada transaksi kategori {kategori}.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => (
                  <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">{tx.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{tx.nama_barang}</td>
                    <td className="py-3 px-4 text-slate-500">{tx.sekolah}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-bold">
                        {tx.kategori}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{tx.rab_id || '-'}</td>
                    <td className="py-3 px-4 text-center text-slate-500">{tx.jumlah}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">{formatRupiah(tx.total_biaya)}</td>
                    <td className="py-3 px-4 text-center text-slate-500">{tx.tanggal}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => onOpenTransactionModal(tx)}
                          className="px-2 py-1 bg-amber-500 text-black font-bold text-[10px] rounded hover:bg-amber-600 transition cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3 inline" /> Edit
                        </button>
                        <button
                          onClick={() => onDeleteTransaction(tx.id)}
                          className="px-2 py-1 bg-rose-500 text-white font-bold text-[10px] rounded hover:bg-rose-600 transition cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3 inline" /> Hapus
                        </button>
                      </div>
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
