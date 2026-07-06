import React from 'react';
import { Filter, Power } from 'lucide-react';
import { User, School } from '../types';

interface HeaderProps {
  currentUser: User;
  schools: School[];
  activeSchoolFilter: string;
  onFilterChange: (schoolName: string) => void;
  title: string;
  subtitle: string;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  schools,
  activeSchoolFilter,
  onFilterChange,
  title,
  subtitle,
  onLogout
}) => {
  const isAdmin = currentUser.role === 'Admin';
  const initials = currentUser.nama
    ? currentUser.nama.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "AD";

  return (
    <header className="h-20 px-8 border-b border-slate-200/60 flex items-center justify-between bg-white shrink-0">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider">{title}</h2>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>

        {isAdmin && (
          <div className="hidden lg:flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl ml-4">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-purple-600" /> Filter Instansi:
            </span>
            <select
              value={activeSchoolFilter}
              onChange={e => onFilterChange(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg py-1 px-2.5 text-slate-800 text-xs font-semibold focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="SEMUA">Semua Sekolah (Kolektif)</option>
              {schools.map(sch => (
                <option key={sch.npsn} value={sch.nama}>
                  {sch.nama}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs font-bold text-slate-800">{currentUser.nama}</span>
          <span className="text-[10px] text-purple-600 font-bold tracking-wider">
            {isAdmin ? 'AKSES PENUH' : 'AKSES ANGGOTA'}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-700 text-xs font-black border border-purple-500/20">
          {initials}
        </div>
        <button
          onClick={onLogout}
          title="Keluar dari sistem"
          className="flex items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-rose-500/15 border border-slate-200 hover:border-rose-500/30 text-slate-600 hover:text-rose-600 transition-all cursor-pointer"
        >
          <Power className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
