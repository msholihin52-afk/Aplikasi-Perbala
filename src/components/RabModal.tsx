import React, { useState, useEffect } from 'react';
import { Clipboard } from 'lucide-react';
import { School, User, KategoriBelanja, RABItem } from '../types';

interface RabModalProps {
  showModal: boolean;
  onClose: () => void;
  schools: School[];
  currentUser: User;
  activeSchoolFilter: string;
  editRabData: RABItem | null;
  defaultKategori?: KategoriBelanja;
  onSaveRab: (rab: RABItem) => void;
}

export const RabModal: React.FC<RabModalProps> = ({
  showModal,
  onClose,
  schools,
  currentUser,
  activeSchoolFilter,
  editRabData,
  defaultKategori = 'BUKU',
  onSaveRab
}) => {
  const [sekolah, setSekolah] = useState('');
  const [kategori, setKategori] = useState<KategoriBelanja>('BUKU');
  const [nama, setNama] = useState('');
  const [alokasi, setAlokasi] = useState<number | ''>('');

  useEffect(() => {
    if (showModal) {
      if (editRabData) {
        setSekolah(editRabData.sekolah);
        setKategori(editRabData.kategori);
        setNama(editRabData.nama);
        setAlokasi(editRabData.alokasi);
      } else {
        setNama('');
        setAlokasi('');
        setKategori(defaultKategori);
        if (currentUser.role === 'Admin') {
          if (activeSchoolFilter !== 'SEMUA') {
            setSekolah(activeSchoolFilter);
          } else if (schools.length > 0) {
            setSekolah(schools[0].nama);
          }
        } else {
          setSekolah(currentUser.instansi);
        }
      }
    }
  }, [showModal, editRabData, defaultKategori, currentUser, activeSchoolFilter, schools]);

  if (!showModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sekolah || !nama.trim()) return;

    const rabId = editRabData
      ? editRabData.id
      : `RAB-${kategori.charAt(0)}${Math.floor(Math.random() * 90 + 10)}`;

    onSaveRab({
      id: rabId,
      nama: nama.trim(),
      sekolah,
      kategori,
      alokasi: Number(alokasi) || 0
    });
    onClose();
  };

  const isAdmin = currentUser.role === 'Admin';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Clipboard className="w-5 h-5 text-purple-600" />
          Rencana Anggaran Belanja (RAB)
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Sekolah</label>
            {isAdmin ? (
              <select
                value={sekolah}
                onChange={e => setSekolah(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {schools.map(sch => (
                  <option key={sch.npsn} value={sch.nama}>
                    {sch.nama}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                readOnly
                value={sekolah}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-600 font-bold"
              />
            )}
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Kategori</label>
            <select
              value={kategori}
              onChange={e => setKategori(e.target.value as KategoriBelanja)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="BUKU">BUKU</option>
              <option value="ALAT">ALAT</option>
              <option value="SIPLAH">SIPLAH / HABIS PAKAI</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Nama Item Anggaran</label>
            <input
              type="text"
              required
              value={nama}
              onChange={e => setNama(e.target.value)}
              placeholder="Contoh: Pembelian Laptop Inventaris"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Alokasi Anggaran (Rp)</label>
            <input
              type="number"
              required
              value={alokasi}
              onChange={e => setAlokasi(e.target.value ? Number(e.target.value) : '')}
              placeholder="Contoh: 15000000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-purple-600 text-white font-bold rounded-xl text-sm hover:bg-purple-700 transition-colors cursor-pointer"
            >
              Simpan RAB
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
