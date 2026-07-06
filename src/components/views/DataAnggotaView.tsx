import React, { useState } from 'react';
import { FileSpreadsheet, Plus, Edit3, Trash2, Eye, EyeOff } from 'lucide-react';
import { User } from '../../types';
import { matchesActiveFilter } from '../../lib/data';

interface DataAnggotaViewProps {
  users: User[];
  currentUser: User;
  activeSchoolFilter: string;
  onOpenUserModal: (usr?: User) => void;
  onOpenImportModal: () => void;
  onDeleteUser: (username: string) => void;
}

export const DataAnggotaView: React.FC<DataAnggotaViewProps> = ({
  users,
  currentUser,
  activeSchoolFilter,
  onOpenUserModal,
  onOpenImportModal,
  onDeleteUser
}) => {
  const isAdmin = currentUser.role === 'Admin';
  const activeQuery = currentUser.role !== 'Admin' ? currentUser.instansi : activeSchoolFilter;

  // Track password visibility per username
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (username: string) => {
    setShowPasswordMap(prev => ({
      ...prev,
      [username]: !prev[username]
    }));
  };

  const filteredUsers = users.filter(u => {
    if (!isAdmin) return matchesActiveFilter(u.instansi, '', activeQuery);
    if (activeSchoolFilter === 'SEMUA') return true;
    return matchesActiveFilter(u.instansi, '', activeSchoolFilter) || u.role === 'Admin';
  });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Daftar Operator & Anggota</h3>
            <p className="text-xs text-slate-500">Manajemen hak akses pengguna aplikasi PERBALA</p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={onOpenImportModal}
                className="px-3 py-2 bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-teal-100 transition cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Impor Operator
              </button>
              <button
                onClick={() => onOpenUserModal()}
                className="px-3 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-purple-700 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Pengguna Baru
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase">
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Password</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4">Instansi/Sekolah</th>
                <th className="py-3 px-4 text-center">Status</th>
                {isAdmin && <th className="py-3 px-4 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="text-center py-6 text-slate-500">
                    Tidak ada operator terdaftar.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(usr => {
                  const isVisible = !!showPasswordMap[usr.username];
                  return (
                    <tr key={usr.username} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-800">{usr.nama}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{usr.username}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 font-mono text-slate-500 font-medium">
                          <span>{isVisible ? usr.password || '••••••••' : '••••••••'}</span>
                          <button
                            onClick={() => togglePasswordVisibility(usr.username)}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            usr.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {usr.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{usr.instansi}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-bold ${usr.status === 'Online' ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {usr.status || 'Offline'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => onOpenUserModal(usr)}
                              className="px-2 py-1 bg-amber-500 text-black font-bold text-[10px] rounded hover:bg-amber-600 transition flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => onDeleteUser(usr.username)}
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
