export type Role = 'Admin' | 'Anggota';
export type KategoriBelanja = 'BUKU' | 'ALAT' | 'SIPLAH';

export interface User {
  nama: string;
  username: string;
  password?: string;
  role: Role;
  instansi: string;
  status?: string;
}

export interface School {
  npsn: string;
  nama: string;
  kecamatan: string;
  jumlah_siswa: number;
  pagu_per_siswa: number;
  pagu_t1: number;
  pagu_t2: number;
  status: string;
}

export interface MonthlyPagu {
  sekolah: string;
  bulan: string;
  pagu: number;
}

export interface RABItem {
  id: string;
  nama: string;
  sekolah: string;
  kategori: KategoriBelanja;
  alokasi: number;
}

export interface Transaction {
  id: string;
  rab_id?: string;
  nama_barang: string;
  sekolah: string;
  npsn?: string;
  kategori: KategoriBelanja;
  jumlah: string;
  total_biaya: number;
  tanggal: string;
  status: 'Disetujui' | 'Pending' | 'Ditolak' | string;
}

export interface TarikTunai {
  id: string;
  sekolah: string;
  bulan: string;
  pagu_bulanan: number;
  nilai: number;
  status: 'Selesai' | 'Pending' | 'Disetujui' | string;
  verifikator: string;
  kode?: string;
}

export interface OrgConfig {
  org_name: string;
  logo_preset: string;
  logo_url: string;
  deadline_t1: string;
  deadline_t2: string;
}

export interface ToastState {
  show: boolean;
  title: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export interface ConfirmModalState {
  show: boolean;
  title: string;
  message: string;
  onConfirm: (() => void) | null;
}
