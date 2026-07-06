import React from 'react';
import {
  Wallet, School, Building2, LayoutDashboard, Users, Coins, CalendarRange, BookOpen, Wrench, ShoppingCart,
  BookMarked, Cpu, PackageOpen, ArrowDownToLine, CheckSquare, PieChart, ClipboardList, Scale, FileText, Settings,
  Database, LogOut
} from 'lucide-react';
import { User, Role, OrgConfig } from '../types';

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  onSwitchTab: (tabId: string) => void;
  onSwitchRole: (role: Role) => void;
  onOpenApiModal: () => void;
  onLogout: () => void;
  pendingTarikCount: number;
  orgConfig: OrgConfig;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeTab,
  onSwitchTab,
  onSwitchRole,
  onOpenApiModal,
  onLogout,
  pendingTarikCount,
  orgConfig
}) => {
  const isAdmin = currentUser.role === 'Admin';

  const renderLogo = () => {
    if (orgConfig.logo_preset === 'custom-url' && orgConfig.logo_url) {
      return <img src={orgConfig.logo_url} className="w-full h-full object-cover rounded-lg" alt="Logo" />;
    }
    if (orgConfig.logo_preset === 'preset-school') {
      return <School className="w-5 h-5" />;
    }
    if (orgConfig.logo_preset === 'preset-landmark') {
      return <Building2 className="w-5 h-5" />;
    }
    return <Wallet className="w-5 h-5" />;
  };

  const getNavBtnClass = (tabId: string, isDashboard = false) => {
    const isActive = activeTab === tabId;
    if (isDashboard) {
      return isActive
        ? "nav-btn w-full flex items-center gap-3 px-4 py-3 bg-purple-600 text-white rounded-xl text-sm font-black shadow-lg shadow-purple-500/30 transition-all text-left cursor-pointer"
        : "nav-btn w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl text-sm font-bold transition-all text-left cursor-pointer";
    }
    return isActive
      ? "nav-btn w-full flex items-center justify-between px-4 py-2 text-xs bg-purple-600 text-white rounded-lg font-black shadow-md shadow-purple-500/25 transition text-left cursor-pointer"
      : "nav-btn w-full flex items-center justify-between px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-lg transition text-left cursor-pointer";
  };

  const initials = currentUser.nama
    ? currentUser.nama.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "AD";

  return (
    <aside className="w-full md:w-64 bg-[#1e1b4b] border-r border-white/5 flex flex-col shrink-0 min-h-screen text-slate-300">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20 text-white shrink-0 overflow-hidden p-0.5">
          {renderLogo()}
        </div>
        <div>
          <h1 className="font-black text-sm tracking-widest text-white leading-tight">MONITORING PERBALA</h1>
          <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block">SISTEM BOSP</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div>
          <button
            onClick={() => onSwitchTab('dashboard')}
            className={getNavBtnClass('dashboard', true)}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>DASHBOARD</span>
          </button>
        </div>

        {isAdmin && (
          <div>
            <span className="block px-4 text-[10px] font-black text-purple-300 uppercase tracking-widest mb-2">MASTER DATA</span>
            <div className="space-y-1">
              <button onClick={() => onSwitchTab('data-sekolah')} className={getNavBtnClass('data-sekolah')}>
                <span className="flex items-center gap-3">
                  <School className="w-4 h-4" /> DATA SEKOLAH
                </span>
              </button>
              <button onClick={() => onSwitchTab('data-anggota')} className={getNavBtnClass('data-anggota')}>
                <span className="flex items-center gap-3">
                  <Users className="w-4 h-4" /> DATA ANGGOTA / OPERATOR
                </span>
              </button>
            </div>
          </div>
        )}

        <div>
          <span className="block px-4 text-[10px] font-black text-purple-300 uppercase tracking-widest mb-2">PENGANGGARAN</span>
          <div className="space-y-1">
            <button onClick={() => onSwitchTab('pagu-anggaran')} className={getNavBtnClass('pagu-anggaran')}>
              <span className="flex items-center gap-3">
                <Coins className="w-4 h-4" /> PAGU ANGGARAN
              </span>
            </button>
            <button onClick={() => onSwitchTab('pagu-tiap-bulan')} className={getNavBtnClass('pagu-tiap-bulan')}>
              <span className="flex items-center gap-3">
                <CalendarRange className="w-4 h-4" /> PAGU TIAP BULAN
              </span>
            </button>
            <button onClick={() => onSwitchTab('anggaran-modal-buku')} className={getNavBtnClass('anggaran-modal-buku')}>
              <span className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" /> ANGGARAN MODAL BUKU
              </span>
            </button>
            <button onClick={() => onSwitchTab('anggaran-modal-alat')} className={getNavBtnClass('anggaran-modal-alat')}>
              <span className="flex items-center gap-3">
                <Wrench className="w-4 h-4" /> ANGGARAN MODAL ALAT
              </span>
            </button>
            <button onClick={() => onSwitchTab('anggaran-habis-pakai')} className={getNavBtnClass('anggaran-habis-pakai')}>
              <span className="flex items-center gap-3">
                <ShoppingCart className="w-4 h-4" /> ANGGARAN HABIS PAKAI
              </span>
            </button>
          </div>
        </div>

        <div>
          <span className="block px-4 text-[10px] font-black text-purple-300 uppercase tracking-widest mb-2">PENATAUSAHAAN</span>
          <div className="space-y-1">
            <button onClick={() => onSwitchTab('belanja-modal-buku')} className={getNavBtnClass('belanja-modal-buku')}>
              <span className="flex items-center gap-3">
                <BookMarked className="w-4 h-4" /> BELANJA MODAL BUKU
              </span>
            </button>
            <button onClick={() => onSwitchTab('belanja-modal-alat')} className={getNavBtnClass('belanja-modal-alat')}>
              <span className="flex items-center gap-3">
                <Cpu className="w-4 h-4" /> BELANJA MODAL ALAT
              </span>
            </button>
            <button onClick={() => onSwitchTab('belanja-habis-pakai')} className={getNavBtnClass('belanja-habis-pakai')}>
              <span className="flex items-center gap-3">
                <PackageOpen className="w-4 h-4" /> BELANJA HABIS PAKAI
              </span>
            </button>
            <button onClick={() => onSwitchTab('transaksi-tarik-tunai')} className={getNavBtnClass('transaksi-tarik-tunai')}>
              <span className="flex items-center gap-3">
                <ArrowDownToLine className="w-4 h-4" /> TRANSAKSI TARIK TUNAI
              </span>
            </button>
            {isAdmin && (
              <button onClick={() => onSwitchTab('transaksi-tarik-tunai')} className={getNavBtnClass('validasi-tarik')}>
                <span className="flex items-center gap-3">
                  <CheckSquare className="w-4 h-4 text-orange-500" /> VALIDASI TARIK TUNAI
                </span>
                <span className="bg-orange-500/20 text-orange-400 font-bold text-[10px] px-2 py-0.5 rounded-full">
                  {pendingTarikCount}
                </span>
              </button>
            )}
          </div>
        </div>

        <div>
          <span className="block px-4 text-[10px] font-black text-purple-300 uppercase tracking-widest mb-2">REKAP LAPORAN</span>
          <div className="space-y-1">
            <button onClick={() => onSwitchTab('rekap-modal')} className={getNavBtnClass('rekap-modal')}>
              <span className="flex items-center gap-3">
                <PieChart className="w-4 h-4" /> REKAP MODAL BUKU & ALAT (%)
              </span>
            </button>
            <button onClick={() => onSwitchTab('rekap-habis-pakai')} className={getNavBtnClass('rekap-habis-pakai')}>
              <span className="flex items-center gap-3">
                <ClipboardList className="w-4 h-4" /> REKAP HABIS PAKAI SIPLAH
              </span>
            </button>
            <button onClick={() => onSwitchTab('validasi-pagu')} className={getNavBtnClass('validasi-pagu')}>
              <span className="flex items-center gap-3">
                <Scale className="w-4 h-4" /> VALIDASI PENGELUARAN VS PAGU
              </span>
            </button>
            <button onClick={() => onSwitchTab('laporan-tahunan')} className={getNavBtnClass('laporan-tahunan')}>
              <span className="flex items-center gap-3">
                <FileText className="w-4 h-4" /> LAPORAN TAHUNAN
              </span>
            </button>
          </div>
        </div>

        {/* ROLE SIMULATOR */}
        {isAdmin && (
          <div className="pt-4 border-t border-white/5">
            <span className="block px-4 text-[10px] font-black text-purple-300 uppercase tracking-widest mb-2">ROLE SIMULATOR</span>
            <div className="bg-black/25 p-1.5 rounded-xl flex gap-1 border border-white/5">
              <button
                onClick={() => onSwitchRole('Admin')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                  currentUser.role === 'Admin'
                    ? 'text-white bg-purple-600 shadow-inner'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => onSwitchRole('Anggota')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                  currentUser.role === 'Anggota'
                    ? 'text-white bg-teal-600 shadow-inner'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                Anggota
              </button>
            </div>
          </div>
        )}

        {/* SISTEM & CONFIG (ONLY VISIBLE BY ADMIN) */}
        {isAdmin && (
          <div className="pt-4 border-t border-white/5 space-y-1">
            <span className="block px-4 text-[10px] font-black text-purple-300 uppercase tracking-widest mb-2">SISTEM & CONFIG</span>
            <button onClick={() => onSwitchTab('pengaturan')} className={getNavBtnClass('pengaturan')}>
              <span className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-purple-300" /> PENGATURAN INSTANSI
              </span>
            </button>
            <button
              onClick={onOpenApiModal}
              className="w-full flex items-center gap-3 px-4 py-2 text-xs text-purple-300 hover:text-white hover:bg-white/[0.02] rounded-lg transition text-left cursor-pointer"
            >
              <Database className="w-4 h-4" /> CONFIG SPREADSHEET
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/15 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-600/30 text-purple-200 flex items-center justify-center font-bold text-sm border border-purple-500/30">
            {initials}
          </div>
          <div className="overflow-hidden">
            <span className="block text-xs font-bold text-white truncate">{currentUser.nama}</span>
            <span className="inline-block px-2 py-0.5 bg-purple-600/30 text-[9px] text-purple-200 font-extrabold rounded">
              {currentUser.role === 'Admin' ? 'AKSES PENUH' : 'AKSES ANGGOTA'}
            </span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full py-2 bg-rose-500/10 hover:bg-rose-600 hover:text-white border border-rose-500/20 text-rose-300 font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>KELUAR / LOGOUT</span>
        </button>
      </div>
    </aside>
  );
};
