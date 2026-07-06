/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  User, School, MonthlyPagu, RABItem, Transaction, TarikTunai, OrgConfig,
  ToastState, ConfirmModalState, Role, KategoriBelanja
} from './types';
import {
  initialSchools, initialUsers, initialMonthlyPagu, initialRAB, initialTransactions,
  initialTarikTunai, defaultOrgConfig
} from './lib/data';

import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { ConfirmModal } from './components/ConfirmModal';

import { SchoolModal, ImportSchoolModal } from './components/SchoolModal';
import { UserModal, ImportUserModal } from './components/UserModal';
import { MonthlyPaguModal } from './components/MonthlyPaguModal';
import { RabModal } from './components/RabModal';
import { TarikTunaiModal } from './components/TarikTunaiModal';
import { TransactionModal } from './components/TransactionModal';
import { ApiConfigModal } from './components/ApiConfigModal';

import { DashboardView } from './components/views/DashboardView';
import { DataSekolahView } from './components/views/DataSekolahView';
import { DataAnggotaView } from './components/views/DataAnggotaView';
import { PaguAnggaranView } from './components/views/PaguAnggaranView';
import { PaguTiapBulanView } from './components/views/PaguTiapBulanView';
import { AnggaranView } from './components/views/AnggaranView';
import { BelanjaView } from './components/views/BelanjaView';
import { RekapSiplahView } from './components/views/RekapSiplahView';
import { TarikTunaiView } from './components/views/TarikTunaiView';
import { RekapModalView } from './components/views/RekapModalView';
import { ValidasiPaguView } from './components/views/ValidasiPaguView';
import { LaporanTahunanView } from './components/views/LaporanTahunanView';
import { PengaturanView } from './components/views/PengaturanView';

export default function App() {
  // Session & Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSchoolFilter, setActiveSchoolFilter] = useState('SEMUA');
  const [apiUrl, setApiUrl] = useState<string>(() => localStorage.getItem('perbala_api_url') || '');

  // Persistent / Mock Datasets
  const [schools, setSchools] = useState<School[]>(() => {
    const saved = localStorage.getItem('perbala_schools');
    return saved ? JSON.parse(saved) : initialSchools;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('perbala_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [monthlyPagu, setMonthlyPagu] = useState<MonthlyPagu[]>(() => {
    const saved = localStorage.getItem('perbala_monthly_pagu');
    return saved ? JSON.parse(saved) : initialMonthlyPagu;
  });

  const [rabList, setRabList] = useState<RABItem[]>(() => {
    const saved = localStorage.getItem('perbala_rab');
    return saved ? JSON.parse(saved) : initialRAB;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('perbala_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [tarikTunaiList, setTarikTunaiList] = useState<TarikTunai[]>(() => {
    const saved = localStorage.getItem('perbala_tarik_tunai');
    return saved ? JSON.parse(saved) : initialTarikTunai;
  });

  const [orgConfig, setOrgConfig] = useState<OrgConfig>(() => {
    const savedName = localStorage.getItem('perbala_org_name');
    if (savedName) {
      return {
        org_name: savedName,
        logo_preset: localStorage.getItem('perbala_logo_preset') || defaultOrgConfig.logo_preset,
        logo_url: localStorage.getItem('perbala_logo_url') || defaultOrgConfig.logo_url,
        deadline_t1: localStorage.getItem('perbala_deadline_t1') || defaultOrgConfig.deadline_t1,
        deadline_t2: localStorage.getItem('perbala_deadline_t2') || defaultOrgConfig.deadline_t2
      };
    }
    return defaultOrgConfig;
  });

  // UI Notifications & Modals state
  const [toast, setToast] = useState<ToastState>({ show: false, title: '', message: '', type: 'info' });
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({ show: false, title: '', message: '', onConfirm: null });

  // Form Modals State
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [editSchoolData, setEditSchoolData] = useState<School | null>(null);
  const [showImportSchoolModal, setShowImportSchoolModal] = useState(false);

  const [showUserModal, setShowUserModal] = useState(false);
  const [editUserData, setEditUserData] = useState<User | null>(null);
  const [showImportUserModal, setShowImportUserModal] = useState(false);

  const [showMonthlyPaguModal, setShowMonthlyPaguModal] = useState(false);
  const [monthlyPaguEditBulan, setMonthlyPaguEditBulan] = useState<string | undefined>();
  const [monthlyPaguEditVal, setMonthlyPaguEditVal] = useState<number | undefined>();

  const [showRabModal, setShowRabModal] = useState(false);
  const [editRabData, setEditRabData] = useState<RABItem | null>(null);
  const [defaultRabKategori, setDefaultRabKategori] = useState<KategoriBelanja>('BUKU');

  const [showTarikModal, setShowTarikModal] = useState(false);
  const [editTarikData, setEditTarikData] = useState<TarikTunai | null>(null);

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editTransactionData, setEditTransactionData] = useState<Transaction | null>(null);

  const [showApiConfigModal, setShowApiConfigModal] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('perbala_schools', JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    localStorage.setItem('perbala_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('perbala_monthly_pagu', JSON.stringify(monthlyPagu));
  }, [monthlyPagu]);

  useEffect(() => {
    localStorage.setItem('perbala_rab', JSON.stringify(rabList));
  }, [rabList]);

  useEffect(() => {
    localStorage.setItem('perbala_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('perbala_tarik_tunai', JSON.stringify(tarikTunaiList));
  }, [tarikTunaiList]);

  // Toast helper
  const showToast = useCallback((title: string, message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setToast({ show: true, title, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  // Confirm Modal helper
  const openConfirmModal = useCallback((title: string, message: string, onConfirmAction: () => void) => {
    setConfirmModal({
      show: true,
      title,
      message,
      onConfirm: () => {
        onConfirmAction();
        setConfirmModal(prev => ({ ...prev, show: false, onConfirm: null }));
      }
    });
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModal(prev => ({ ...prev, show: false, onConfirm: null }));
  }, []);

  // Log Activity API helper
  const saveActivity = useCallback(async (actionName: string, detail: string, status = 'Sukses') => {
    if (!apiUrl) return;
    try {
      await fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          action: 'logActivity',
          user: currentUser ? currentUser.nama : 'Guest',
          role: currentUser ? currentUser.role : 'Visitor',
          activityAction: actionName,
          detail: detail,
          status: status
        })
      });
    } catch (err) {
      console.error('Gagal mencatat log aktivitas sistem:', err);
    }
  }, [apiUrl, currentUser]);

  // Load database data from API if configured
  const loadDatabaseData = useCallback(() => {
    if (!apiUrl) return;
    fetch(apiUrl, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ action: 'getData' })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.schools) setSchools(data.schools);
          if (data.users) setUsers(data.users);
          if (data.monthly_pagu) setMonthlyPagu(data.monthly_pagu);
          if (data.rab) setRabList(data.rab);
          if (data.transactions) setTransactions(data.transactions);
          if (data.tarik_tunai) setTarikTunaiList(data.tarik_tunai);
          if (data.config) {
            setOrgConfig({
              org_name: data.config.org_name || defaultOrgConfig.org_name,
              logo_preset: data.config.logo_preset || defaultOrgConfig.logo_preset,
              logo_url: data.config.logo_url || defaultOrgConfig.logo_url,
              deadline_t1: data.config.deadline_t1 || defaultOrgConfig.deadline_t1,
              deadline_t2: data.config.deadline_t2 || defaultOrgConfig.deadline_t2
            });
          }
        }
      })
      .catch(err => {
        console.error('API Error:', err);
      });
  }, [apiUrl]);

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    if (user.role === 'Admin') {
      setActiveSchoolFilter('SEMUA');
    } else {
      setActiveSchoolFilter(user.instansi);
    }
    loadDatabaseData();
  };

  const handleLogout = () => {
    openConfirmModal("Keluar Aplikasi", "Apakah Anda yakin akan keluar?", () => {
      saveActivity("Logout Sesi", "User mengakhiri sesi penjelajahan dan keluar");
      setIsLoggedIn(false);
      showToast("Sesi Berakhir", "Sesi monitoring PERBALA ditutup dengan aman.", "info");
    });
  };

  const handleRoleSwitch = (newRole: Role) => {
    if (newRole === 'Admin') {
      const adminUsr = users.find(u => u.role === 'Admin') || initialUsers[0];
      setCurrentUser(adminUsr);
      setActiveSchoolFilter('SEMUA');
    } else {
      const memberUsr = users.find(u => u.role === 'Anggota') || initialUsers[2];
      setCurrentUser(memberUsr);
      setActiveSchoolFilter(memberUsr.instansi);
    }
    showToast("Peran Berubah", `Sekarang Anda menjelajah sebagai role ${newRole}`, "info");
  };

  // Tab switching handler
  const handleSwitchTab = (tabId: string) => {
    if (currentUser.role !== 'Admin' && ['pengaturan', 'data-sekolah', 'data-anggota'].includes(tabId)) {
      showToast("Akses Ditolak", "Halaman ini terproteksi khusus level hak akses Administrator.", "warning");
      return;
    }
    setActiveTab(tabId);
  };

  // CRUD Handlers
  // 1. School
  const handleSaveSchool = (schData: School) => {
    saveActivity("Simpan Sekolah", `Menyimpan data sekolah ${schData.nama}`);
    setSchools(prev => {
      const idx = prev.findIndex(s => s.npsn === schData.npsn);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = schData;
        return copy;
      }
      return [...prev, schData];
    });
    showToast("Sukses", `Data sekolah ${schData.nama} berhasil disimpan.`, "success");
  };

  const handleDeleteSchool = (npsn: string) => {
    const sch = schools.find(s => s.npsn === npsn);
    openConfirmModal("Hapus Sekolah", `Apakah Anda yakin ingin menghapus data sekolah "${sch?.nama || npsn}"?`, () => {
      saveActivity("Hapus Sekolah", `Menghapus sekolah ${sch?.nama || npsn}`);
      setSchools(prev => prev.filter(s => s.npsn !== npsn));
      showToast("Dihapus", "Data sekolah berhasil dihapus.", "info");
    });
  };

  const handleImportSchools = (tsvText: string) => {
    if (!tsvText.trim()) return showToast("Gagal", "Data impor kosong.", "warning");
    const lines = tsvText.split('\n');
    const parsed: School[] = [];
    lines.forEach(line => {
      const parts = line.trim().split(/\t/);
      if (parts.length >= 5) {
        const npsn = parts[0].trim();
        const nama = parts[1].trim();
        const kecamatan = parts[2].trim();
        const js = parseInt(parts[3]) || 0;
        const ps = parseFloat(parts[4]) || 0;
        const t1 = (js * ps) / 2;
        parsed.push({ npsn, nama, kecamatan, jumlah_siswa: js, pagu_per_siswa: ps, pagu_t1: t1, pagu_t2: t1, status: "Aktif" });
      }
    });

    if (parsed.length === 0) {
      return showToast("Error", "Format spreadsheet tidak sesuai (NPSN|Nama|Kecamatan|Siswa|Pagu)", "error");
    }

    setSchools(prev => {
      const copy = [...prev];
      parsed.forEach(sch => {
        const idx = copy.findIndex(s => s.npsn === sch.npsn);
        if (idx !== -1) copy[idx] = sch;
        else copy.push(sch);
      });
      return copy;
    });
    showToast("Impor Berhasil", `${parsed.length} data sekolah berhasil diimpor.`, "success");
  };

  // 2. User
  const handleSaveUser = (usrData: User) => {
    saveActivity("Simpan Pengguna", `Menyimpan data operator ${usrData.nama}`);
    setUsers(prev => {
      const idx = prev.findIndex(u => u.username === usrData.username);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = usrData;
        return copy;
      }
      return [...prev, usrData];
    });
    showToast("Sukses", `Data operator ${usrData.nama} berhasil disimpan.`, "success");
  };

  const handleDeleteUser = (username: string) => {
    if (username === 'admin') {
      return showToast("Dilarang", "Admin utama tidak boleh dihapus.", "error");
    }
    const usr = users.find(u => u.username === username);
    openConfirmModal("Hapus Akses", `Hapus operator "${usr?.nama || username}"?`, () => {
      saveActivity("Hapus Pengguna", `Menolak hak akses operator ${usr?.nama || username}`);
      setUsers(prev => prev.filter(u => u.username !== username));
      showToast("Dihapus", "Akses operator berhasil dihapus.", "info");
    });
  };

  const handleImportUsers = (tsvText: string) => {
    if (!tsvText.trim()) return showToast("Gagal", "Data impor kosong.", "warning");
    const lines = tsvText.split('\n');
    const parsed: User[] = [];
    lines.forEach(line => {
      const parts = line.trim().split(/\t/);
      if (parts.length >= 5) {
        parsed.push({
          nama: parts[0].trim(),
          username: parts[1].trim(),
          password: parts[2].trim(),
          role: (parts[3].trim() as Role) || 'Anggota',
          instansi: parts[4].trim(),
          status: 'Offline'
        });
      }
    });

    if (parsed.length === 0) {
      return showToast("Error", "Format salah (Nama|User|Pass|Role|Instansi)", "error");
    }

    setUsers(prev => {
      const copy = [...prev];
      parsed.forEach(usr => {
        const idx = copy.findIndex(u => u.username === usr.username);
        if (idx !== -1) copy[idx] = usr;
        else copy.push(usr);
      });
      return copy;
    });
    showToast("Impor Berhasil", `${parsed.length} operator berhasil diimpor.`, "success");
  };

  // 3. Monthly Pagu
  const handleSaveMonthlyPagu = (sekolah: string, bulan: string, pagu: number) => {
    saveActivity("Simpan Pagu Bulanan", `Menentukan pagu bulan ${bulan} sekolah ${sekolah}`);
    setMonthlyPagu(prev => {
      const idx = prev.findIndex(p => p.sekolah.toLowerCase() === sekolah.toLowerCase() && p.bulan === bulan);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { sekolah, bulan, pagu };
        return copy;
      }
      return [...prev, { sekolah, bulan, pagu }];
    });
    showToast("Sukses", `Pagu bulan ${bulan} tersimpan.`, "success");
  };

  const handleDeleteMonthlyPagu = (bulan: string) => {
    const targetSchool = currentUser.role !== 'Admin' ? currentUser.instansi : activeSchoolFilter;
    const schoolName = targetSchool === 'SEMUA' ? (schools[0]?.nama || '') : targetSchool;

    openConfirmModal("Hapus Pagu Bulanan", `Apakah Anda yakin ingin menghapus alokasi pagu bulanan ${bulan} untuk ${schoolName}?`, () => {
      saveActivity("Hapus Pagu Bulanan", `Menghapus pagu bulanan ${bulan} untuk ${schoolName}`);
      setMonthlyPagu(prev => prev.filter(p => !(p.sekolah.toLowerCase() === schoolName.toLowerCase() && p.bulan === bulan)));
      showToast("Dihapus", `Pagu bulan ${bulan} dihapus.`, "info");
    });
  };

  // 4. RAB
  const handleSaveRab = (rab: RABItem) => {
    saveActivity("Simpan RAB", `Menyimpan Rencana Anggaran ${rab.nama} (RAB)`);
    setRabList(prev => {
      const idx = prev.findIndex(r => r.id === rab.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = rab;
        return copy;
      }
      return [...prev, rab];
    });
    showToast("Sukses", `RAB ${rab.nama} berhasil disimpan.`, "success");
  };

  const handleDeleteRab = (id: string) => {
    openConfirmModal("Hapus RAB", `Hapus rencana anggaran ${id}?`, () => {
      saveActivity("Hapus RAB", `Menghapus rencana anggaran (RAB) ID ${id}`);
      setRabList(prev => prev.filter(r => r.id !== id));
      showToast("Dihapus", "RAB berhasil dihapus.", "info");
    });
  };

  // 5. Transaction Realisasi
  const handleSaveTransaction = (tx: Transaction) => {
    saveActivity("Tambah Transaksi Realisasi", `Mengajukan realisasi belanja ${tx.nama_barang} senilai Rp ${tx.total_biaya}`);
    setTransactions(prev => {
      const idx = prev.findIndex(t => t.id === tx.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = tx;
        return copy;
      }
      return [tx, ...prev];
    });
    showToast("Sukses", `Transaksi ${tx.nama_barang} tersimpan.`, "success");
  };

  const handleChangeTxStatus = (id: string, status: string) => {
    saveActivity("Ubah Status Transaksi", `Mengubah status transaksi ID ${id} menjadi ${status}`);
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    showToast("Status Diperbarui", `Transaksi ID ${id} diubah menjadi ${status}.`, "info");
  };

  const handleDeleteTransaction = (id: string) => {
    openConfirmModal("Hapus Realisasi", `Hapus transaksi realisasi belanja ${id}?`, () => {
      saveActivity("Hapus Realisasi", `Menghapus transaksi realisasi belanja ID ${id}`);
      setTransactions(prev => prev.filter(t => t.id !== id));
      showToast("Dihapus", "Transaksi berhasil dihapus.", "info");
    });
  };

  // 6. Tarik Tunai
  const handleSaveTarik = (item: TarikTunai) => {
    saveActivity("Simpan Tarik Tunai", `Mengajukan pencairan dana tunai ${item.nilai} bulan ${item.bulan}`);
    setTarikTunaiList(prev => {
      const idx = prev.findIndex(t => t.id === item.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = item;
        return copy;
      }
      return [item, ...prev];
    });
    showToast("Sukses", `Pengajuan tarik tunai bulan ${item.bulan} dikirim.`, "success");
  };

  const handleApproveTarik = (id: string) => {
    saveActivity("Verifikasi Tarik Tunai", `Menyetujui pencairan dana tunai ${id}`);
    setTarikTunaiList(prev => prev.map(t => t.id === id ? { ...t, status: 'Selesai', verifikator: currentUser.nama } : t));
    showToast("Pencairan Selesai", "Status penarikan dana berhasil diperbarui menjadi Selesai.", "success");
  };

  const handleDeleteTarik = (id: string) => {
    openConfirmModal("Hapus Penarikan", `Hapus transaksi penarikan ${id}?`, () => {
      saveActivity("Hapus Tarik Tunai", `Menghapus realisasi pencairan tunai ID ${id}`);
      setTarikTunaiList(prev => prev.filter(t => t.id !== id));
      showToast("Dihapus", "Transaksi penarikan dihapus.", "info");
    });
  };

  // 7. Org Config
  const handleSaveOrgConfig = (cfg: OrgConfig) => {
    setOrgConfig(cfg);
    localStorage.setItem('perbala_org_name', cfg.org_name);
    localStorage.setItem('perbala_logo_preset', cfg.logo_preset);
    localStorage.setItem('perbala_logo_url', cfg.logo_url);
    localStorage.setItem('perbala_deadline_t1', cfg.deadline_t1);
    localStorage.setItem('perbala_deadline_t2', cfg.deadline_t2);
    showToast("Berhasil Disimpan", "Pengaturan profil organisasi kustom Anda telah disimpan.", "success");
    setActiveTab('dashboard');
  };

  const handleResetOrgConfig = () => {
    setOrgConfig(defaultOrgConfig);
    localStorage.removeItem('perbala_org_name');
    localStorage.removeItem('perbala_logo_preset');
    localStorage.removeItem('perbala_logo_url');
    localStorage.removeItem('perbala_deadline_t1');
    localStorage.removeItem('perbala_deadline_t2');
    showToast("Berhasil Reset", "Pengaturan instansi dikembalikan ke default.", "info");
  };

  // Export CSV Helper
  const handleExportCsv = (type: string) => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (type === 'SIPLah') {
      csvContent += "No Transaksi,Nama Belanja Habis Pakai,Sekolah,ID RAB Terikat,Volume,Nilai Transaksi,Tanggal Bayar,Status\n";
      const activeQuery = currentUser.role !== 'Admin' ? currentUser.instansi : activeSchoolFilter;
      const filtered = transactions.filter(t => t.kategori === 'SIPLAH' && (activeQuery === 'SEMUA' || t.sekolah.toLowerCase() === activeQuery.toLowerCase()));
      filtered.forEach(item => {
        csvContent += `"${item.id}","${item.nama_barang}","${item.sekolah}","${item.rab_id || ''}","${item.jumlah}",${item.total_biaya},"${item.tanggal}","${item.status}"\n`;
      });
    } else if (type === 'Tarik-Tunai') {
      csvContent += "ID Tarik,Sekolah,Bulan Penyerapan,Pagu Bulanan,Nilai Realisasi,Status,Verifikator\n";
      const activeQuery = currentUser.role !== 'Admin' ? currentUser.instansi : activeSchoolFilter;
      const filtered = tarikTunaiList.filter(t => activeQuery === 'SEMUA' || t.sekolah.toLowerCase() === activeQuery.toLowerCase());
      filtered.forEach(item => {
        csvContent += `"${item.id}","${item.sekolah}","${item.bulan}",${item.pagu_bulanan},${item.nilai},"${item.status}","${item.verifikator}"\n`;
      });
    } else if (type === 'Laporan-Tahunan') {
      csvContent += "NPSN,Nama Sekolah,Pagu Tahunan,Realisasi Pengadaan + Tarik,Sisa Pagu Bersih,Status Laporan\n";
      const activeQuery = currentUser.role !== 'Admin' ? currentUser.instansi : activeSchoolFilter;
      const filtered = schools.filter(s => activeQuery === 'SEMUA' || s.nama.toLowerCase() === activeQuery.toLowerCase());
      filtered.forEach(sch => {
        const totalPagu = sch.pagu_t1 + sch.pagu_t2;
        const realizedTx = transactions.filter(t => t.sekolah.toLowerCase() === sch.nama.toLowerCase() && t.status === 'Disetujui').reduce((acc, curr) => acc + curr.total_biaya, 0);
        const realizedTarik = tarikTunaiList.filter(t => t.sekolah.toLowerCase() === sch.nama.toLowerCase() && (t.status === 'Selesai' || t.status === 'Disetujui')).reduce((acc, curr) => acc + curr.nilai, 0);
        const totalRealized = realizedTx + realizedTarik;
        const remaining = totalPagu - totalRealized;
        csvContent += `"${sch.npsn}","${sch.nama}",${totalPagu},${totalRealized},${remaining},"Terverifikasi"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PERBALA-${type}-2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    saveActivity("Unduh Laporan", `Mengekspor laporan kategori ${type} ke dalam format CSV`);
    showToast("Unduh Berhasil", `Berkas PERBALA-${type}-2026.csv berhasil diunduh.`, "success");
  };

  const pendingTarikCount = tarikTunaiList.filter(t => t.status === 'Pending').length;

  // Header Title & Subtitle helper
  const getHeaderTitles = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'DASHBOARD UTAMA', subtitle: orgConfig.org_name };
      case 'data-sekolah':
        return { title: 'DATA SEKOLAH', subtitle: 'Informasi Instansi & Pembagian Pagu Institusi' };
      case 'data-anggota':
        return { title: 'DATA OPERATOR & ANGGOTA', subtitle: 'Sistem Manajemen Akses dan Operator Sekolah' };
      case 'pagu-anggaran':
        return { title: 'PAGU ANGGARAN', subtitle: 'Konfigurasi Anggaran Utama & Target Alokasi Pagu' };
      case 'pagu-tiap-bulan':
        return { title: 'PAGU BULANAN SEKOLAH', subtitle: 'Rencana Distribusi Pagu Keuangan Bulanan' };
      case 'anggaran-modal-buku':
        return { title: 'RAB - MODAL BUKU', subtitle: 'Rencana Anggaran Belanja Rincian Khusus Buku' };
      case 'anggaran-modal-alat':
        return { title: 'RAB - MODAL ALAT', subtitle: 'Rencana Anggaran Belanja Rincian Khusus Alat/Aset' };
      case 'anggaran-habis-pakai':
        return { title: 'RAB - HABIS PAKAI', subtitle: 'Rencana Anggaran Belanja Barang Habis Pakai / ATK' };
      case 'belanja-modal-buku':
        return { title: 'BELANJA - MODAL BUKU', subtitle: 'Realisasi Pengadaan Belanja Khusus Buku Paket Sekolah' };
      case 'belanja-modal-alat':
        return { title: 'BELANJA - MODAL ALAT', subtitle: 'Realisasi Pengadaan Belanja Chromebook, Proyektor, & Sarana' };
      case 'belanja-habis-pakai':
        return { title: 'BELANJA - HABIS PAKAI', subtitle: 'Realisasi Pengeluaran Barang Operasional Habis Pakai' };
      case 'transaksi-tarik-tunai':
        return { title: 'TARIK TUNAI', subtitle: 'Laporan Pencairan Dana Tunai & Status Validasi' };
      case 'rekap-modal':
        return { title: 'REKAP MODAL', subtitle: 'Persentase Perbandingan Anggaran Buku vs Alat' };
      case 'rekap-habis-pakai':
        return { title: 'REKAP BELANJA SIPLAH', subtitle: 'Kompilasi Transaksi Pembayaran Habis Pakai Melalui SIPLah' };
      case 'validasi-pagu':
        return { title: 'VALIDASI PAGU', subtitle: 'Deteksi Keseimbangan Limit Anggaran Realisasi & Pagu' };
      case 'laporan-tahunan':
        return { title: 'LAPORAN TAHUNAN', subtitle: 'Kompilasi Neraca Akhir & Alokasi Dana Sekolah' };
      case 'pengaturan':
        return { title: 'PENGATURAN INSTANSI', subtitle: 'Ubah Nama Organisasi, Batas Waktu, & Logo Sistem Kustom' };
      default:
        return { title: 'DASHBOARD UTAMA', subtitle: orgConfig.org_name };
    }
  };

  const { title, subtitle } = getHeaderTitles();

  if (!isLoggedIn) {
    return (
      <>
        <Toast toast={toast} onClose={hideToast} />
        <LoginScreen
          orgConfig={orgConfig}
          users={users}
          onLoginSuccess={handleLoginSuccess}
          showToast={showToast}
          apiUrl={apiUrl}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative bg-slate-50 font-sans">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={hideToast} />

      {/* Confirmation Modal */}
      <ConfirmModal confirmModal={confirmModal} onClose={closeConfirmModal} />

      {/* Form Modals */}
      <SchoolModal
        showModal={showSchoolModal}
        onClose={() => setShowSchoolModal(false)}
        editSchoolData={editSchoolData}
        onSaveSchool={handleSaveSchool}
      />
      <ImportSchoolModal
        showModal={showImportSchoolModal}
        onClose={() => setShowImportSchoolModal(false)}
        onImport={handleImportSchools}
      />

      <UserModal
        showModal={showUserModal}
        onClose={() => setShowUserModal(false)}
        editUserData={editUserData}
        onSaveUser={handleSaveUser}
      />
      <ImportUserModal
        showModal={showImportUserModal}
        onClose={() => setShowImportUserModal(false)}
        onImport={handleImportUsers}
      />

      <MonthlyPaguModal
        showModal={showMonthlyPaguModal}
        onClose={() => setShowMonthlyPaguModal(false)}
        schools={schools}
        currentUser={currentUser}
        activeSchoolFilter={activeSchoolFilter}
        initialBulan={monthlyPaguEditBulan}
        initialPagu={monthlyPaguEditVal}
        onSave={handleSaveMonthlyPagu}
      />

      <RabModal
        showModal={showRabModal}
        onClose={() => setShowRabModal(false)}
        schools={schools}
        currentUser={currentUser}
        activeSchoolFilter={activeSchoolFilter}
        editRabData={editRabData}
        defaultKategori={defaultRabKategori}
        onSaveRab={handleSaveRab}
      />

      <TarikTunaiModal
        showModal={showTarikModal}
        onClose={() => setShowTarikModal(false)}
        schools={schools}
        currentUser={currentUser}
        activeSchoolFilter={activeSchoolFilter}
        monthlyPagu={monthlyPagu}
        tarikTunaiList={tarikTunaiList}
        editData={editTarikData}
        onSaveTarik={handleSaveTarik}
      />

      <TransactionModal
        showModal={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        schools={schools}
        currentUser={currentUser}
        activeSchoolFilter={activeSchoolFilter}
        rabList={rabList}
        transactionsList={transactions}
        editTransactionData={editTransactionData}
        onSaveTransaction={handleSaveTransaction}
      />

      <ApiConfigModal
        showModal={showApiConfigModal}
        onClose={() => setShowApiConfigModal(false)}
        currentApiUrl={apiUrl}
        onSaveApiUrl={url => {
          setApiUrl(url);
          localStorage.setItem('perbala_api_url', url);
          showToast('Konfigurasi Tersimpan', 'URL Google Apps Script diperbarui.', 'success');
          loadDatabaseData();
        }}
      />

      {/* Main Sidebar */}
      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        onSwitchTab={handleSwitchTab}
        onSwitchRole={handleRoleSwitch}
        onOpenApiModal={() => setShowApiConfigModal(true)}
        onLogout={handleLogout}
        pendingTarikCount={pendingTarikCount}
        orgConfig={orgConfig}
      />

      {/* Content Main Area */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-slate-50 min-w-0">
        <Header
          currentUser={currentUser}
          schools={schools}
          activeSchoolFilter={activeSchoolFilter}
          onFilterChange={setActiveSchoolFilter}
          title={title}
          subtitle={subtitle}
          onLogout={handleLogout}
        />

        <div className="p-6 md:p-8 space-y-8 flex-1">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentUser={currentUser}
              activeSchoolFilter={activeSchoolFilter}
              schools={schools}
              transactions={transactions}
              monthlyPagu={monthlyPagu}
              tarikTunaiList={tarikTunaiList}
              orgConfig={orgConfig}
              onOpenTransactionModal={() => {
                setEditTransactionData(null);
                setShowTransactionModal(true);
              }}
              onRefreshData={loadDatabaseData}
              onSwitchTab={handleSwitchTab}
              onChangeTxStatus={handleChangeTxStatus}
            />
          )}

          {activeTab === 'data-sekolah' && (
            <DataSekolahView
              schools={schools}
              currentUser={currentUser}
              activeSchoolFilter={activeSchoolFilter}
              onOpenSchoolModal={sch => {
                setEditSchoolData(sch || null);
                setShowSchoolModal(true);
              }}
              onOpenImportModal={() => setShowImportSchoolModal(true)}
              onDeleteSchool={handleDeleteSchool}
            />
          )}

          {activeTab === 'data-anggota' && (
            <DataAnggotaView
              users={users}
              currentUser={currentUser}
              activeSchoolFilter={activeSchoolFilter}
              onOpenUserModal={usr => {
                setEditUserData(usr || null);
                setShowUserModal(true);
              }}
              onOpenImportModal={() => setShowImportUserModal(true)}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {activeTab === 'pagu-anggaran' && (
            <PaguAnggaranView
              monthlyPagu={monthlyPagu}
              schools={schools}
              currentUser={currentUser}
              activeSchoolFilter={activeSchoolFilter}
              onSyncPagu={() => {
                showToast("Sinkronisasi Pagu", "Sinkronisasi pagu berhasil! Sesi Anda akan otomatis keluar demi keamanan.", "success");
                setTimeout(() => {
                  setIsLoggedIn(false);
                }, 1500);
              }}
            />
          )}

          {activeTab === 'pagu-tiap-bulan' && (
            <PaguTiapBulanView
              monthlyPagu={monthlyPagu}
              currentUser={currentUser}
              activeSchoolFilter={activeSchoolFilter}
              onOpenMonthlyPaguModal={(bulan, pagu) => {
                setMonthlyPaguEditBulan(bulan);
                setMonthlyPaguEditVal(pagu);
                setShowMonthlyPaguModal(true);
              }}
              onDeleteMonthlyPagu={handleDeleteMonthlyPagu}
            />
          )}

          {activeTab === 'anggaran-modal-buku' && (
            <AnggaranView
              kategori="BUKU"
              rabList={rabList}
              transactionsList={transactions}
              currentUser={currentUser}
              activeSchoolFilter={activeSchoolFilter}
              onOpenRabModal={rab => {
                setDefaultRabKategori('BUKU');
                setEditRabData(rab || null);
                setShowRabModal(true);
              }}
              onDeleteRab={handleDeleteRab}
            />
          )}

          {activeTab === 'anggaran-modal-alat' && (
            <AnggaranView
              kategori="ALAT"
              rabList={rabList}
              transactionsList={transactions}
              currentUser={currentUser}
              activeSchoolFilter={activeSchoolFilter}
              onOpenRabModal={rab => {
                setDefaultRabKategori('ALAT');
                setEditRabData(rab || null);
                setShowRabModal(true);
              }}
              onDeleteRab={handleDeleteRab}
            />
          )}

          {activeTab === 'anggaran-habis-pakai' && (
            <AnggaranView
              kategori="SIPLAH"
              rabList={rabList}
              transactionsList={transactions}
              currentUser={currentUser}
              activeSchoolFilter={activeSchoolFilter}
              onOpenRabModal={rab => {
                setDefaultRabKategori('SIPLAH');
                setEditRabData(rab || null);
                setShowRabModal(true);
              }}
              onDeleteRab={handleDeleteRab}
            />
          )}

          {activeTab === 'belanja-modal-buku' && (
            <BelanjaView
              kategori="BUKU"
              transactionsList={transactions}
              schools={schools}
              currentUser={currentUser}
              activeSchoolFilter={activeSchoolFilter}
              onOpenTransactionModal={tx => {
                setEditTransactionData(tx || null);
                setShowTransactionModal(true);
              }}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {activeTab === 'belanja-modal-alat' && (
            <BelanjaView
              kategori="ALAT"
              transactionsList={transactions}
              schools={schools}
              currentUser={currentUser}
              activeSchoolFilter={activeSchoolFilter}
              onOpenTransactionModal={tx => {
                setEditTransactionData(tx || null);
                setShowTransactionModal(true);
              }}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {activeTab === 'belanja-habis-pakai' && (
            <BelanjaView
              kategori="SIPLAH"
              transactionsList={transactions}
              schools={schools}
              currentUser={currentUser}
              activeSchoolFilter={activeSchoolFilter}
              onOpenTransactionModal={tx => {
                setEditTransactionData(tx || null);
                setShowTransactionModal(true);
              }}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {activeTab === 'transaksi-tarik-tunai' && (
            <TarikTunaiView
              tarikTunaiList={tarikTunaiList}
              currentUser={currentUser}
              activeSchoolFilter={activeSchoolFilter}
              onOpenTarikModal={item => {
                setEditTarikData(item || null);
                setShowTarikModal(true);
              }}
              onApproveTarik={handleApproveTarik}
              onDeleteTarik={handleDeleteTarik}
              onExportCsv={handleExportCsv}
            />
          )}

          {activeTab === 'rekap-modal' && (
            <RekapModalView
              transactions={transactions}
              monthlyPagu={monthlyPagu}
              tarikTunaiList={tarikTunaiList}
              currentUser={currentUser}
              activeSchoolFilter={activeSchoolFilter}
            />
          )}

          {activeTab === 'rekap-habis-pakai' && (
            <RekapSiplahView
              transactions={transactions}
              currentUser={currentUser}
              activeSchoolFilter={activeSchoolFilter}
              onExportCsv={handleExportCsv}
            />
          )}

          {activeTab === 'validasi-pagu' && (
            <ValidasiPaguView
              schools={schools}
              transactions={transactions}
              currentUser={currentUser}
              activeSchoolFilter={activeSchoolFilter}
            />
          )}

          {activeTab === 'laporan-tahunan' && (
            <LaporanTahunanView
              schools={schools}
              transactions={transactions}
              tarikTunaiList={tarikTunaiList}
              currentUser={currentUser}
              activeSchoolFilter={activeSchoolFilter}
              onExportCsv={handleExportCsv}
            />
          )}

          {activeTab === 'pengaturan' && (
            <PengaturanView
              orgConfig={orgConfig}
              onSaveOrgConfig={handleSaveOrgConfig}
              onResetOrgConfig={handleResetOrgConfig}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-auto py-6 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
          <p>© 2026 Laporan Monitoring PERBALA. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="mt-1 text-[10px]">
            Terkoneksi ke Google Sheets Database:{' '}
            <span className={apiUrl ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
              {apiUrl ? 'Koneksi Google Sheets Mandiri' : 'Mode Simulator (Offline)'}
            </span>
          </p>
        </footer>
      </main>
    </div>
  );
}
