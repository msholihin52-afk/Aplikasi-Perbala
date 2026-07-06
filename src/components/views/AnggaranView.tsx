import React from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { RABItem, Transaction, User, KategoriBelanja } from '../../types';
import { formatRupiah, matchesActiveFilter } from '../../lib/data';

interface AnggaranViewProps {
  kategori: KategoriBelanja;
  rabList: RABItem[];
  transactionsList: Transaction[];
  currentUser: User;
  activeSchoolFilter: string;
  onOpenRabModal: (rab?: RABItem) => void;
  onDeleteRab: (id: string) => void;
}

export const AnggaranView: React.FC<AnggaranViewProps> = ({
  kategori,
  rabList,
  transactionsList,
  currentUser,
  activeSchoolFilter,
  onOpenRabModal,
  onDeleteRab
}) => {
  const activeQuery = currentUser.role !== 'Admin' ? currentUser.instansi : activeSchoolFilter;
  const filteredRAB = rabList.filter(r => r.kategori === kategori && matchesActiveFilter(r.sekolah, '', activeQuery));

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Rencana Anggaran Belanja (RAB) - {kategori}
            </h3>
            <p className="text-xs text-slate-500">
              Daftar item belanja modal yang dianggarkan. Anggota dapat melakukan edit/hapus.
            </p>
          </div>
          <button
            onClick={() => onOpenRabModal()}
            className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-purple-700 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Item Anggaran (RAB)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">ID RAB</th>
                <th className="py-3 px-4">Nama Anggaran (RAB)</th>
                <th className="py-3 px-4">Sekolah</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-right">Alokasi Anggaran</th>
                <th className="py-3 px-4 text-right">Total Realisasi</th>
                <th className="py-3 px-4 text-right">Sisa Anggaran</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {filteredRAB.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-6 text-slate-500">
                    Belum ada item anggaran (RAB) direncanakan untuk kategori {kategori}.
                  </td>
                </tr>
              ) : (
                filteredRAB.map(rab => {
                  const matchedExpenditures = transactionsList.filter(
                    t => t.rab_id === rab.id && t.status === 'Disetujui'
                  );
                  const totalRealisasi = matchedExpenditures.reduce((acc, curr) => acc + (curr.total_biaya || 0), 0);
                  const sisaSaldo = rab.alokasi - totalRealisasi;

                  return (
                    <tr key={rab.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">{rab.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{rab.nama}</td>
                      <td className="py-3 px-4 text-slate-500">{rab.sekolah}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-bold">
                          {rab.kategori}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-800">{formatRupiah(rab.alokasi)}</td>
                      <td className="py-3 px-4 text-right font-bold text-amber-600">{formatRupiah(totalRealisasi)}</td>
                      <td className={`py-3 px-4 text-right font-bold ${sisaSaldo < 0 ? 'text-rose-600' : 'text-teal-700'}`}>
                        {formatRupiah(sisaSaldo)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {sisaSaldo < 0 ? (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px] font-bold">Overbudget</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">Aktif</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => onOpenRabModal(rab)}
                            className="px-2 py-1 bg-amber-500 text-black font-bold text-[10px] rounded hover:bg-amber-600 transition cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3 inline" /> Edit
                          </button>
                          <button
                            onClick={() => onDeleteRab(rab.id)}
                            className="px-2 py-1 bg-rose-500 text-white font-bold text-[10px] rounded hover:bg-rose-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3 inline" /> Hapus
                          </button>
                        </div>
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
