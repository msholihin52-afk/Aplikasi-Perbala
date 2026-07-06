import React, { useState, useEffect } from 'react';
import { User as UserIcon, FileSpreadsheet } from 'lucide-react';
import { User, Role } from '../types';

interface UserModalProps {
  showModal: boolean;
  onClose: () => void;
  editUserData: User | null;
  onSaveUser: (usr: User) => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  showModal,
  onClose,
  editUserData,
  onSaveUser
}) => {
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('Anggota');
  const [instansi, setInstansi] = useState('');

  useEffect(() => {
    if (editUserData) {
      setNama(editUserData.nama);
      setUsername(editUserData.username);
      setPassword(editUserData.password || '');
      setRole(editUserData.role);
      setInstansi(editUserData.instansi);
    } else {
      setNama('');
      setUsername('');
      setPassword('');
      setRole('Anggota');
      setInstansi('');
    }
  }, [editUserData, showModal]);

  if (!showModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      nama: nama.trim(),
      username: username.trim(),
      password,
      role,
      instansi: instansi.trim(),
      status: 'Offline'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-purple-600" />
          Form Pengguna / Operator
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Nama Lengkap</label>
            <input
              type="text"
              required
              value={nama}
              onChange={e => setNama(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as Role)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="Admin">Admin</option>
              <option value="Anggota">Anggota</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Instansi / Penugasan Sekolah</label>
            <input
              type="text"
              required
              value={instansi}
              onChange={e => setInstansi(e.target.value)}
              placeholder="Contoh: SD NEGERI SEKARDOJA atau Dinas"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-purple-600 text-white font-bold rounded-xl text-sm hover:bg-purple-700 transition-colors cursor-pointer"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ImportUserModalProps {
  showModal: boolean;
  onClose: () => void;
  onImport: (tsvText: string) => void;
}

export const ImportUserModal: React.FC<ImportUserModalProps> = ({
  showModal,
  onClose,
  onImport
}) => {
  const [tsvText, setTsvText] = useState('');

  if (!showModal) return null;

  const handleImportClick = () => {
    onImport(tsvText);
    setTsvText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-teal-600" />
          Impor Operator & Anggota (.tsv)
        </h3>
        <p className="text-[11px] text-slate-500">
          Salin tabel dari Excel dan tempel ke area bawah dengan susunan kolom: <br />
          <b>Nama Lengkap | Username | Password | Role | Instansi/Sekolah</b>
        </p>
        <textarea
          rows={8}
          value={tsvText}
          onChange={e => setTsvText(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-mono text-xs focus:outline-none focus:border-teal-500"
          placeholder={`Budi Santoso\tbudi123\tpass123\tAnggota\tSDN 1 Sejahtera`}
        />
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleImportClick}
            className="flex-1 py-2 bg-teal-600 text-white font-extrabold rounded-xl text-sm hover:bg-teal-700 transition-colors cursor-pointer"
          >
            Impor Sekarang
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
