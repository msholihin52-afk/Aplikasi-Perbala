import React, { useState } from 'react';
import { Wallet, School, Building2, User as UserIcon, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { OrgConfig, User } from '../types';

interface LoginScreenProps {
  orgConfig: OrgConfig;
  users: User[];
  onLoginSuccess: (user: User) => void;
  showToast: (title: string, message: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
  apiUrl: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  orgConfig,
  users,
  onLoginSuccess,
  showToast,
  apiUrl
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      showToast('Login Gagal', 'Mohon isi username dan password.', 'error');
      return;
    }

    setIsLoading(true);

    if (apiUrl) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({ action: 'login', username: username.trim(), password })
        });
        const data = await response.json();
        setIsLoading(false);

        if (data.success && data.user) {
          showToast('Sukses Login', `Selamat datang kembali, ${data.user.nama}!`, 'success');
          onLoginSuccess(data.user);
        } else {
          showToast('Login Gagal', data.message || 'Username atau Password salah!', 'error');
        }
      } catch (err) {
        setIsLoading(false);
        showToast('Gagal Terhubung API', 'Mengalihkan ke database offline.', 'warning');
        doOfflineLogin(username.trim(), password);
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
        doOfflineLogin(username.trim(), password);
      }, 400);
    }
  };

  const doOfflineLogin = (userStr: string, passStr: string) => {
    const foundUser = users.find(
      u => u.username.toLowerCase() === userStr.toLowerCase() && u.password === passStr
    );

    if (foundUser) {
      showToast('Sukses Login', `Selamat datang kembali, ${foundUser.nama}!`, 'success');
      onLoginSuccess({ ...foundUser, status: 'Online' });
    } else {
      showToast('Login Gagal', 'Username atau Password salah!', 'error');
    }
  };

  const renderLogo = () => {
    if (orgConfig.logo_preset === 'custom-url' && orgConfig.logo_url) {
      return <img src={orgConfig.logo_url} className="w-full h-full object-cover rounded-xl" alt="Logo Organisasi" />;
    }
    if (orgConfig.logo_preset === 'preset-school') {
      return <School className="w-8 h-8" />;
    }
    if (orgConfig.logo_preset === 'preset-landmark') {
      return <Building2 className="w-8 h-8" />;
    }
    return <Wallet className="w-8 h-8" />;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative bg-slate-50">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 shadow-lg shadow-purple-500/30 mb-4 text-white overflow-hidden p-1">
            {renderLogo()}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-wide">MONITORING PERBALA</h2>
          <p className="text-sm text-slate-500 mt-1">{orgConfig.org_name}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
            SISTEM BANTUAN OPERASIONAL SATUAN PENDIDIKAN (BOSP)
          </span>
        </div>

        <form onSubmit={handleLoginSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-12 text-slate-800 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded bg-slate-50 border-slate-200 text-purple-600 focus:ring-0 w-4 h-4" />
              <span className="text-xs text-slate-500">Ingat Saya</span>
            </label>
            <button
              type="button"
              onClick={() => showToast('Akses Akun Demo', "Gunakan 'admin' (pass: 'admin123') atau 'rusnoto.prasasti@gmail.com' (pass: 'Sekardoja123') untuk masuk.", 'info')}
              className="text-xs text-purple-600 hover:underline font-semibold cursor-pointer"
            >
              Butuh bantuan akun?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>Masuk Sistem</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
