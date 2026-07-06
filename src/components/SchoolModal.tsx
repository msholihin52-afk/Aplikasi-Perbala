import React, { useState, useEffect } from 'react';
import { School, FileSpreadsheet } from 'lucide-react';
import { School as SchoolType } from '../types';

interface SchoolModalProps {
  showModal: boolean;
  onClose: () => void;
  editSchoolData: SchoolType | null;
  onSaveSchool: (sch: SchoolType) => void;
}

export const SchoolModal: React.FC<SchoolModalProps> = ({
  showModal,
  onClose,
  editSchoolData,
  onSaveSchool
}) => {
  const [npsn, setNpsn] = useState('');
  const [nama, setNama] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [jumlahSiswa, setJumlahSiswa] = useState<number | ''>('');
  const [paguPerSiswa, setPaguPerSiswa] = useState<number | ''>('');

  useEffect(() => {
    if (editSchoolData) {
      setNpsn(editSchoolData.npsn);
      setNama(editSchoolData.nama);
      setKecamatan(editSchoolData.kecamatan);
      setJumlahSiswa(editSchoolData.jumlah_siswa);
      setPaguPerSiswa(editSchoolData.pagu_per_siswa);
    } else {
      setNpsn('');
      setNama('');
      setKecamatan('');
      setJumlahSiswa('');
      setPaguPerSiswa('');
    }
  }, [editSchoolData, showModal]);

  if (!showModal) return null;

  const siswaNum = Number(jumlahSiswa) || 0;
  const paguPerSiswaNum = Number(paguPerSiswa) || 0;
  const paguT1 = (siswaNum * paguPerSiswaNum) / 2;
  const paguT2 = (siswaNum * paguPerSiswaNum) / 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSchool({
      npsn: npsn.trim(),
      nama: nama.trim(),
      kecamatan: kecamatan.trim(),
      jumlah_siswa: siswaNum,
      pagu_per_siswa: paguPerSiswaNum,
      pagu_t1: paguT1,
      pagu_t2: paguT2,
      status: 'Aktif'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <School className="w-5 h-5 text-purple-600" />
          Form Sekolah
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">NPSN</label>
            <input
              type="text"
              required
              value={npsn}
              onChange={e => setNpsn(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Nama Sekolah</label>
            <input
              type="text"
              required
              value={nama}
              onChange={e => setNama(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Kecamatan</label>
            <input
              type="text"
              required
              value={kecamatan}
              onChange={e => setKecamatan(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Jumlah Siswa</label>
            <input
              type="number"
              required
              value={jumlahSiswa}
              onChange={e => setJumlahSiswa(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Pagu per Siswa</label>
            <input
              type="number"
              required
              value={paguPerSiswa}
              onChange={e => setPaguPerSiswa(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-500 mb-1">Pagu Tahap 1</label>
              <input
                type="number"
                readOnly
                value={paguT1}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-600 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Pagu Tahap 2</label>
              <input
                type="number"
                readOnly
                value={paguT2}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-600 font-bold"
              />
            </div>
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

interface ImportSchoolModalProps {
  showModal: boolean;
  onClose: () => void;
  onImport: (tsvText: string) => void;
}

export const ImportSchoolModal: React.FC<ImportSchoolModalProps> = ({
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
          Impor Data Sekolah (.tsv)
        </h3>
        <p className="text-[11px] text-slate-500">
          Salin tabel dari Excel/Spreadsheet dan tempel ke area bawah dengan susunan kolom: <br />
          <b>NPSN | Nama Sekolah | Kecamatan | Jumlah Siswa | Pagu per Siswa</b>
        </p>
        <textarea
          rows={8}
          value={tsvText}
          onChange={e => setTsvText(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-mono text-xs focus:outline-none focus:border-teal-500"
          placeholder={`20310912\tSDN 1 Sejahtera\tKec. Barat\t100\t900000`}
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
