import React, { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { OrgConfig } from '../../types';

interface PengaturanViewProps {
  orgConfig: OrgConfig;
  onSaveOrgConfig: (cfg: OrgConfig) => void;
  onResetOrgConfig: () => void;
}

export const PengaturanView: React.FC<PengaturanViewProps> = ({
  orgConfig,
  onSaveOrgConfig,
  onResetOrgConfig
}) => {
  const [orgName, setOrgName] = useState('');
  const [logoPreset, setLogoPreset] = useState('preset-wallet');
  const [logoUrl, setLogoUrl] = useState('');
  const [deadlineT1, setDeadlineT1] = useState('2026-07-31');
  const [deadlineT2, setDeadlineT2] = useState('2027-01-31');

  useEffect(() => {
    setOrgName(orgConfig.org_name);
    setLogoPreset(orgConfig.logo_preset);
    setLogoUrl(orgConfig.logo_url);
    setDeadlineT1(orgConfig.deadline_t1);
    setDeadlineT2(orgConfig.deadline_t2);
  }, [orgConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveOrgConfig({
      org_name: orgName.trim(),
      logo_preset: logoPreset,
      logo_url: logoUrl.trim(),
      deadline_t1: deadlineT1,
      deadline_t2: deadlineT2
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-2">
          <Settings className="w-5 h-5 text-teal-700" />
          Pengaturan Profil Instansi & Organisasi
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Atur nama organisasi, batas waktu penyerapan, dan ikon/logo kustom Anda untuk personalisasi aplikasi PERBALA.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Nama Organisasi / Lembaga Dinas
            </label>
            <input
              type="text"
              required
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
              placeholder="Dinas Pendidikan Kab. Sejahtera"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Batas Waktu Tahap 1</label>
              <input
                type="date"
                required
                value={deadlineT1}
                onChange={e => setDeadlineT1(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Batas Waktu Tahap 2</label>
              <input
                type="date"
                required
                value={deadlineT2}
                onChange={e => setDeadlineT2(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Ikon / Logo Kustom (Pilih Preset atau Masukkan URL)
            </label>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <select
                value={logoPreset}
                onChange={e => setLogoPreset(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="preset-wallet">Ikon Dompet (Default)</option>
                <option value="preset-school">Ikon Gedung Sekolah</option>
                <option value="preset-landmark">Ikon Dinas / Landmark</option>
                <option value="custom-url">URL Gambar Mandiri</option>
              </select>
            </div>
            {logoPreset === 'custom-url' && (
              <input
                type="url"
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
                placeholder="https://domain.com/logo.png"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:outline-none focus:border-purple-500"
              />
            )}
          </div>

          <div className="pt-4 flex gap-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 text-white font-extrabold rounded-xl text-xs hover:bg-purple-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Simpan Setelan
            </button>
            <button
              type="button"
              onClick={onResetOrgConfig}
              className="px-4 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-xs hover:text-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Reset Default
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
