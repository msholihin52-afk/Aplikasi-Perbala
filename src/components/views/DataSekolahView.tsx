import React from 'react';
import { FileSpreadsheet, Plus, Edit3, Trash2 } from 'lucide-react';
import { School, User } from '../../types';
import { formatRupiah, matchesActiveFilter } from '../../lib/data';

interface DataSekolahViewProps {
  schools: School[];
  currentUser: User;
  activeSchoolFilter: string;
  onOpenSchoolModal: (sch?: School) => void;
  onOpenImportModal: () => void;
  onDeleteSchool: (npsn: string) => void;
}

export const DataSekolahView: React.FC<DataSekolahViewProps> = ({
  schools,
  currentUser,
  activeSchoolFilter,
  onOpenSchoolModal,
  onOpenImportModal,
  onDeleteSchool
}) => {
  const isAdmin = currentUser.role === 'Admin';
  const activeQuery = currentUser.role !== 'Admin' ? currentUser.instansi : activeSchoolFilter;
  const filteredSchools = schools.filter(s => matchesActiveFilter(s.nama, s.npsn, activeQuery));

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Daftar Sekolah Terdaftar</h3>
            <p className="text-xs text-slate-500">Manajemen lembaga sekolah yang terintegrasi sistem PERBALA</p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={onOpenImportModal}
                className="px-3 py-2 bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-teal-100 transition cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Impor Sekolah
              </button>
              <button
                onClick={() => onOpenSchoolModal()}
                className="px-3 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-purple-700 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Hubungkan Sekolah Baru
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase">
                <th className="py-3 px-4">NPSN</th>
                <th className="py-3 px-4">Nama Sekolah</th>
                <th className="py-3 px-4">Kecamatan</th>
                <th className="py-3 px-4 text-center">Jumlah Siswa</th>
                <th className="py-3 px-4 text-right">Pagu/Siswa</th>
                <th className="py-3 px-4 text-right">Pagu Tahap 1</th>
                <th className="py-3 px-4 text-right">Pagu Tahap 2</th>
                <th className="py-3 px-4 text-right">Jumlah Total</th>
                <th className="py-3 px-4 text-center">Status</th>
                {isAdmin && <th className="py-3 px-4 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 10 : 9} className="text-center py-6 text-slate-500">
                    Tidak ada data sekolah terdaftar.
                  </td>
                </tr>
              ) : (
                filteredSchools.map(sch => {
                  const totalPagu = (sch.pagu_t1 || 0) + (sch.pagu_t2 || 0);
                  return (
                    <tr key={sch.npsn} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">{sch.npsn}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{sch.nama}</td>
                      <td className="py-3 px-4 text-slate-500">{sch.kecamatan}</td>
                      <td className="py-3 px-4 text-center text-slate-600">{sch.jumlah_siswa}</td>
                      <td className="py-3 px-4 text-right">{formatRupiah(sch.pagu_per_siswa)}</td>
                      <td className="py-3 px-4 text-right text-amber-700 font-bold">{formatRupiah(sch.pagu_t1)}</td>
                      <td className="py-3 px-4 text-right text-blue-600 font-bold">{formatRupiah(sch.pagu_t2)}</td>
                      <td className="py-3 px-4 text-right text-emerald-700 font-extrabold">{formatRupiah(totalPagu)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-600 rounded text-[10px] font-bold">
                          {sch.status}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => onOpenSchoolModal(sch)}
                              className="px-2 py-1 bg-amber-500 text-black font-bold text-[10px] rounded hover:bg-amber-600 transition flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => onDeleteSchool(sch.npsn)}
                              className="px-2 py-1 bg-rose-500 text-white font-bold text-[10px] rounded hover:bg-rose-600 transition flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" /> Hapus
                            </button>
                          </div>
                        </td>
                      )}
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
