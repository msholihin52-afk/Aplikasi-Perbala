import React, { useState, useEffect } from 'react';
import { ArrowDownToLine } from 'lucide-react';
import { School, User, TarikTunai, MonthlyPagu } from '../types';
import { formatRupiah, isSameSchool, MONTHS_LIST } from '../lib/data';

interface TarikTunaiModalProps {
  showModal: boolean;
  onClose: () => void;
  schools: School[];
  currentUser: User;
  activeSchoolFilter: string;
  monthlyPagu: MonthlyPagu[];
  tarikTunaiList: TarikTunai[];
  editData: TarikTunai | null;
  onSaveTarik: (item: TarikTunai) => void;
}

export const TarikTunaiModal: React.FC<TarikTunaiModalProps> = ({
  showModal,
  onClose,
  schools,
  currentUser,
  activeSchoolFilter,
  monthlyPagu,
  tarikTunaiList,
  editData,
  onSaveTarik
}) => {
  const [sekolah, setSekolah] = useState('');
  const [bulan, setBulan] = useState('');
  const [nilaiTarik, setNilaiTarik] = useState<number | ''>('');

  useEffect(() => {
    if (showModal) {
      let targetSch = currentUser.role !== 'Admin' ? currentUser.instansi : activeSchoolFilter;
      if (targetSch === 'SEMUA' && schools.length > 0) {
        targetSch = schools[0].nama;
      }
      setSekolah(targetSch);

      if (editData) {
        setBulan(editData.bulan);
        setNilaiTarik(editData.nilai);
      } else {
        setBulan('');
        setNilaiTarik('');
      }
    }
  }, [showModal, editData, currentUser, activeSchoolFilter, schools]);

  if (!showModal) return null;

  // Compute carry over pagu for selected month & school
  const calculateCarryOverPagu = (targetBulan: string, schoolName: string): number => {
    const targetIdx = MONTHS_LIST.indexOf(targetBulan);
    if (targetIdx === -1) return 0;

    let currentCarryOver = 0;
    for (let i = 0; i <= targetIdx; i++) {
      const bln = MONTHS_LIST[i];
      const matchedPagu = monthlyPagu.find(p => isSameSchool(p.sekolah, schoolName) && p.bulan === bln);
      const paguBulanan = matchedPagu ? matchedPagu.pagu : 0;

      if (i === targetIdx) {
        return paguBulanan + currentCarryOver;
      }
      const totalTarikSelesai = tarikTunaiList
        .filter(t => isSameSchool(t.sekolah, schoolName) && t.bulan === bln && (t.status === 'Selesai' || t.status === 'Disetujui'))
        .reduce((acc, curr) => acc + curr.nilai, 0);

      currentCarryOver = paguBulanan - totalTarikSelesai;
    }
    return 0;
  };

  const currentPaguBulanan = bulan ? calculateCarryOverPagu(bulan, sekolah) : 0;

  const totalTarikSelesaiGlobal = tarikTunaiList
    .filter(t => isSameSchool(t.sekolah, sekolah) && (t.status === 'Selesai' || t.status === 'Disetujui'))
    .reduce((acc, curr) => acc + curr.nilai, 0);

  const approvedMonths = tarikTunaiList
    .filter(t => isSameSchool(t.sekolah, sekolah) && (t.status === 'Selesai' || t.status === 'Disetujui'))
    .map(t => t.bulan);

  const tarikNum = Number(nilaiTarik) || 0;
  const isOver = tarikNum > currentPaguBulanan;
  const selisih = Math.abs(currentPaguBulanan - tarikNum);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sekolah || !bulan || tarikNum <= 0) return;

    const trkId = editData ? editData.id : `TRK-${Math.floor(Math.random() * 90 + 10)}`;

    onSaveTarik({
      id: trkId,
      sekolah,
      bulan,
      pagu_bulanan: currentPaguBulanan,
      nilai: tarikNum,
      status: 'Pending',
      verifikator: '-'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <ArrowDownToLine className="w-5 h-5 text-orange-600" />
          Pengajuan Tarik Tunai
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Sekolah Pemohon</label>
            <input
              type="text"
              readOnly
              value={sekolah}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Bulan Penyerapan</label>
            <select
              required
              value={bulan}
              onChange={e => setBulan(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="" disabled>-- Pilih Bulan --</option>
              {MONTHS_LIST.map(m => {
                const isLocked = approvedMonths.includes(m) && editData?.bulan !== m;
                return (
                  <option key={m} value={m} disabled={isLocked} className={isLocked ? "text-rose-400 font-semibold" : ""}>
                    {m} {isLocked ? '(Telah Disetujui - Terkunci)' : ''}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Pagu Bulanan Tersedia</label>
              <input
                type="text"
                readOnly
                value={formatRupiah(currentPaguBulanan)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-600 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Sisa Kuota Pagu (Carry Over)</label>
              <div className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-teal-700 font-bold">
                {formatRupiah(currentPaguBulanan)}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Total Realisasi Tarik Selesai</label>
            <div className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-amber-700 font-bold">
              {formatRupiah(totalTarikSelesaiGlobal)}
            </div>
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Jumlah Yang Ingin Ditarik (Rp)</label>
            <input
              type="number"
              required
              value={nilaiTarik}
              onChange={e => setNilaiTarik(e.target.value ? Number(e.target.value) : '')}
              placeholder="Masukkan nominal"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>

          {bulan && tarikNum > 0 && (
            <div
              className={`p-4 rounded-xl border border-dashed text-xs ${
                isOver ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'
              }`}
            >
              <span className={`font-black uppercase tracking-wider block ${isOver ? 'text-rose-700' : 'text-emerald-700'}`}>
                {isOver ? 'KELEBIHAN PENARIKAN (OVERBUDGET!)' : 'SESUAI PAGU (AMAN)'}
              </span>
              <p className="text-slate-600 mt-1">
                {isOver
                  ? `Nominal pengajuan tarik tunai melebihi sisa pagu bulanan tersedia sebesar ${formatRupiah(selisih)}.`
                  : `Sisa kuota pagu ditarik setelah pengajuan ini adalah ${formatRupiah(selisih)}.`}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-orange-600 text-white font-extrabold rounded-xl text-sm hover:bg-orange-700 transition-colors cursor-pointer"
            >
              Kirim Pengajuan
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
