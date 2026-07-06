import React from 'react';
import { ArrowDownToLine, Download, Plus } from 'lucide-react';
import { TarikTunai, User } from '../../types';
import { formatRupiah, matchesActiveFilter } from '../../lib/data';

interface TarikTunaiViewProps {
  tarikTunaiList: TarikTunai[];
  currentUser: User;
  activeSchoolFilter: string;
  onOpenTarikModal: (item?: TarikTunai) => void;
  onApproveTarik: (id: string) => void;
  onDeleteTarik: (id: string) => void;
  onExportCsv: (type: string) => void;
}

export const TarikTunaiView: React.FC<TarikTunaiViewProps> = ({
  tarikTunaiList,
  currentUser,
  activeSchoolFilter,
  onOpenTarikModal,
  onApproveTarik,
  onDeleteTarik,
  onExportCsv
}) => {
  const isAdmin = currentUser.role === 'Admin';
  const activeQuery = currentUser.role !== 'Admin' ? currentUser.instansi : activeSchoolFilter;
  const filtered = tarikTunaiList.filter(t => matchesActiveFilter(t.sekolah, '', activeQuery));

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <ArrowDownToLine className="w-5 h-5 text-orange-600" />
              Validasi & Transaksi Tarik Tunai
            </h3>
            <p className="text-xs text-slate-500">
              Verifikasi pengajuan tarik tunai berdasarkan pagu bulanan sekolah terdaftar. Anggota dapat melakukan edit/hapus.
            </p>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <button
                onClick={() => onExportCsv('Tarik-Tunai')}
                className="px-3 py-2 bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-teal-100 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Unduh CSV
              </button>
            )}
            <button
              onClick={() => onOpenTarikModal()}
              className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Ajukan Tarik Tunai
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase">
                <th className="py-3 px-4">ID Tarik</th>
                <th className="py-3 px-4">Instansi</th>
                <th className="py-3 px-4">Bulan</th>
                <th className="py-3 px-4 text-right">Pagu Bulanan</th>
                <th className="py-3 px-4 text-right">Jumlah Tarik</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Verifikator</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-500">
                    Tidak ada transaksi tarik tunai.
                  </td>
                </tr>
              ) : (
                filtered.map(item => {
                  let statusBadge = (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold">
                      Proses
                    </span>
                  );
                  if (item.status === 'Selesai' || item.status === 'Disetujui') {
                    statusBadge = (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">
                        Lunas / Sesuai
                      </span>
                    );
                  }

                  return (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">{item.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{item.sekolah}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{item.bulan}</td>
                      <td className="py-3 px-4 text-right">{formatRupiah(item.pagu_bulanan)}</td>
                      <td className="py-3 px-4 text-right text-emerald-700 font-bold">{formatRupiah(item.nilai)}</td>
                      <td className="py-3 px-4 text-center">{statusBadge}</td>
                      <td className="py-3 px-4 text-center text-slate-500">{item.verifikator}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex gap-1 justify-center">
                          {isAdmin && item.status === 'Pending' && (
                            <button
                              onClick={() => onApproveTarik(item.id)}
                              className="px-2 py-1 bg-emerald-500 text-white font-bold text-[10px] rounded hover:bg-emerald-600 transition cursor-pointer"
                            >
                              Selesaikan
                            </button>
                          )}
                          <button
                            onClick={() => onOpenTarikModal(item)}
                            className="px-2 py-1 bg-amber-500 text-black font-bold text-[10px] rounded hover:bg-amber-600 transition cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteTarik(item.id)}
                            className="px-2 py-1 bg-rose-500 text-white font-bold text-[10px] rounded hover:bg-rose-600 transition cursor-pointer"
                          >
                            Hapus
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
