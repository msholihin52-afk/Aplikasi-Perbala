import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { School, User, KategoriBelanja, RABItem, Transaction } from '../types';
import { formatRupiah, isSameSchool } from '../lib/data';

interface TransactionModalProps {
  showModal: boolean;
  onClose: () => void;
  schools: School[];
  currentUser: User;
  activeSchoolFilter: string;
  rabList: RABItem[];
  transactionsList: Transaction[];
  editTransactionData: Transaction | null;
  onSaveTransaction: (tx: Transaction) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  showModal,
  onClose,
  schools,
  currentUser,
  activeSchoolFilter,
  rabList,
  transactionsList,
  editTransactionData,
  onSaveTransaction
}) => {
  const [sekolah, setSekolah] = useState('');
  const [kategori, setKategori] = useState<KategoriBelanja>('BUKU');
  const [rabId, setRabId] = useState('');
  const [namaBarang, setNamaBarang] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [totalBiaya, setTotalBiaya] = useState<number | ''>('');
  const [tanggal, setTanggal] = useState('');

  useEffect(() => {
    if (showModal) {
      if (editTransactionData) {
        setSekolah(editTransactionData.sekolah);
        setKategori(editTransactionData.kategori);
        setRabId(editTransactionData.rab_id || '');
        setNamaBarang(editTransactionData.nama_barang);
        setJumlah(editTransactionData.jumlah);
        setTotalBiaya(editTransactionData.total_biaya);
        setTanggal(editTransactionData.tanggal);
      } else {
        let defaultSch = currentUser.role !== 'Admin' ? currentUser.instansi : activeSchoolFilter;
        if (defaultSch === 'SEMUA' && schools.length > 0) {
          defaultSch = schools[0].nama;
        }
        setSekolah(defaultSch);
        setKategori('BUKU');
        setRabId('');
        setNamaBarang('');
        setJumlah('');
        setTotalBiaya('');
        setTanggal(new Date().toISOString().split('T')[0]);
      }
    }
  }, [showModal, editTransactionData, currentUser, activeSchoolFilter, schools]);

  if (!showModal) return null;

  // Filter RAB list by selected school & category
  const filteredRAB = rabList.filter(r => isSameSchool(r.sekolah, sekolah) && r.kategori === kategori);

  // Calculate selected RAB item alokasi & sisa
  const selectedRAB = rabList.find(r => r.id === rabId);
  let rabAlokasi = 0;
  let rabSpent = 0;
  let rabSisa = 0;

  if (selectedRAB) {
    rabAlokasi = selectedRAB.alokasi;
    rabSpent = transactionsList
      .filter(t => t.rab_id === selectedRAB.id && t.status === 'Disetujui' && t.id !== editTransactionData?.id)
      .reduce((acc, curr) => acc + curr.total_biaya, 0);
    rabSisa = rabAlokasi - rabSpent;
  }

  const biayaNum = Number(totalBiaya) || 0;
  const isOverRab = selectedRAB ? biayaNum > rabSisa : false;

  const handleRabSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setRabId(selectedId);
    const item = rabList.find(r => r.id === selectedId);
    if (item && !namaBarang) {
      setNamaBarang(`Realisasi ${item.nama}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sekolah || !namaBarang.trim() || !rabId || biayaNum <= 0) return;

    const schObj = schools.find(s => isSameSchool(s.nama, sekolah));
    const txId = editTransactionData ? editTransactionData.id : `B${Math.floor(Math.random() * 90 + 10)}`;

    onSaveTransaction({
      id: txId,
      rab_id: rabId,
      nama_barang: namaBarang.trim(),
      sekolah,
      npsn: schObj ? schObj.npsn : '-',
      kategori,
      jumlah: jumlah.trim() || '1 Pcs',
      total_biaya: biayaNum,
      tanggal: tanggal || new Date().toISOString().split('T')[0],
      status: 'Disetujui'
    });
    onClose();
  };

  const isAdmin = currentUser.role === 'Admin';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-purple-600" />
          Realisasi Transaksi Baru
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Sekolah Pembayar</label>
            {isAdmin ? (
              <select
                value={sekolah}
                onChange={e => {
                  setSekolah(e.target.value);
                  setRabId('');
                }}
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
            <label className="block text-slate-600 mb-1 font-semibold">Kategori Belanja</label>
            <select
              value={kategori}
              onChange={e => {
                setKategori(e.target.value as KategoriBelanja);
                setRabId('');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="BUKU">BUKU</option>
              <option value="ALAT">ALAT</option>
              <option value="SIPLAH">SIPLAH / HABIS PAKAI</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Pilih Referensi RAB</label>
            <select
              required
              value={rabId}
              onChange={handleRabSelect}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="" disabled>-- Pilih Referensi RAB --</option>
              {filteredRAB.map(r => (
                <option key={r.id} value={r.id}>
                  [{r.id}] {r.nama}
                </option>
              ))}
            </select>
          </div>

          {selectedRAB && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Alokasi Anggaran RAB:</span>
                <span className="text-slate-800 font-bold">{formatRupiah(rabAlokasi)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sisa Saldo Tersedia:</span>
                <span className="text-teal-700 font-bold">{formatRupiah(rabSisa)}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Nama Belanja / Barang</label>
            <input
              type="text"
              required
              value={namaBarang}
              onChange={e => setNamaBarang(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Volume / Jumlah</label>
            <input
              type="text"
              required
              value={jumlah}
              onChange={e => setJumlah(e.target.value)}
              placeholder="Contoh: 15 Pcs atau 2 Rim"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Total Biaya Realisasi (Rp)</label>
            <input
              type="number"
              required
              value={totalBiaya}
              onChange={e => setTotalBiaya(e.target.value ? Number(e.target.value) : '')}
              placeholder="Contoh: 2500000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500"
            />
            {isOverRab && (
              <p className="text-rose-600 font-bold mt-1 text-[10px]">
                Peringatan: Total biaya melebihi sisa alokasi RAB ({formatRupiah(rabSisa)})!
              </p>
            )}
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Tanggal Transaksi</label>
            <input
              type="date"
              required
              value={tanggal}
              onChange={e => setTanggal(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-purple-600 text-white font-bold rounded-xl text-sm hover:bg-purple-700 transition-colors cursor-pointer"
            >
              Simpan Transaksi
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
