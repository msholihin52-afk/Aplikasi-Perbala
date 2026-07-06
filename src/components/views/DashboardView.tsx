import React, { useState } from 'react';
import {
  Coins, Wallet, BarChart2, Hourglass, Building2, TrendingUp, Plus, RefreshCw, AlertCircle, AlarmClock, ArrowUpRight, Filter
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { School, User, Transaction, MonthlyPagu, TarikTunai, OrgConfig, KategoriBelanja } from '../../types';
import { formatRupiah, formatDateIndo, matchesActiveFilter, isSameSchool, MONTHS_LIST } from '../../lib/data';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardViewProps {
  currentUser: User;
  activeSchoolFilter: string;
  schools: School[];
  transactions: Transaction[];
  monthlyPagu: MonthlyPagu[];
  tarikTunaiList: TarikTunai[];
  orgConfig: OrgConfig;
  onOpenTransactionModal: () => void;
  onRefreshData: () => void;
  onSwitchTab: (tabId: string) => void;
  onChangeTxStatus: (id: string, status: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  activeSchoolFilter,
  schools,
  transactions,
  monthlyPagu,
  tarikTunaiList,
  orgConfig,
  onOpenTransactionModal,
  onRefreshData,
  onSwitchTab,
  onChangeTxStatus
}) => {
  const [filterCategory, setFilterCategory] = useState<'SEMUA' | KategoriBelanja>('SEMUA');

  const activeSchoolQuery = currentUser.role !== 'Admin' ? currentUser.instansi : activeSchoolFilter;

  // Filtered dataset
  const filteredSchools = schools.filter(s => matchesActiveFilter(s.nama, s.npsn, activeSchoolQuery));
  const filteredTransactions = transactions.filter(t => matchesActiveFilter(t.sekolah, '', activeSchoolQuery));

  // Compute total pagu from monthly pagu
  let totalTahap1Pagu = 0;
  let totalTahap2Pagu = 0;
  const bulanTahap1 = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];
  const bulanTahap2 = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  monthlyPagu.forEach(p => {
    if (matchesActiveFilter(p.sekolah, '', activeSchoolQuery)) {
      if (bulanTahap1.includes(p.bulan)) totalTahap1Pagu += p.pagu;
      else if (bulanTahap2.includes(p.bulan)) totalTahap2Pagu += p.pagu;
    }
  });

  const totalPaguGlobal = totalTahap1Pagu + totalTahap2Pagu;

  // Realisasi
  let realisasiT1 = 0;
  let realisasiT2 = 0;
  filteredTransactions.forEach(t => {
    if (t.status === 'Disetujui') {
      realisasiT1 += t.total_biaya;
    }
  });

  const totalTarikSelesai = tarikTunaiList
    .filter(t => matchesActiveFilter(t.sekolah, '', activeSchoolQuery) && (t.status === 'Selesai' || t.status === 'Disetujui'))
    .reduce((acc, curr) => acc + curr.nilai, 0);

  const totalSiplah = filteredTransactions
    .filter(t => t.kategori === 'SIPLAH' && t.status === 'Disetujui')
    .reduce((acc, curr) => acc + curr.total_biaya, 0);

  const totalRealisasiBar = realisasiT1 + totalTarikSelesai;
  const sisaPaguBersih = totalPaguGlobal - totalRealisasiBar - realisasiT2;

  const totalPercent = totalPaguGlobal > 0 ? (((totalRealisasiBar + totalSiplah) / totalPaguGlobal) * 50).toFixed(1) : '0.0';

  const t1Percent = totalTahap1Pagu > 0 ? ((totalRealisasiBar / totalTahap1Pagu) * 100).toFixed(1) : '0.0';
  const t2Percent = totalTahap2Pagu > 0 ? ((realisasiT2 / totalTahap2Pagu) * 100).toFixed(1) : '0.0';

  // Chart data
  const monthlyData = MONTHS_LIST.map(m => {
    return monthlyPagu
      .filter(p => p.bulan === m && matchesActiveFilter(p.sekolah, '', activeSchoolQuery))
      .reduce((acc, curr) => acc + curr.pagu, 0);
  });

  const chartData = {
    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'],
    datasets: [
      {
        label: 'Realisasi Bulanan',
        data: monthlyData,
        borderColor: '#a855f7',
        borderWidth: 2,
        backgroundColor: 'rgba(168, 85, 247, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#a855f7',
        pointRadius: 3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 9, weight: 700 as const } } },
      y: {
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: {
          color: '#64748b',
          font: { size: 9 },
          callback: (value: any) => 'Rp ' + (value / 1000000) + 'M'
        }
      }
    }
  };

  // Filtered transactions list for recent table
  let categoryFiltered = filteredTransactions;
  if (filterCategory !== 'SEMUA') {
    categoryFiltered = filteredTransactions.filter(t => t.kategori === filterCategory);
  }

  return (
    <div className="space-y-8">
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="absolute -right-3 -bottom-3 text-slate-100 opacity-80">
            <Coins className="w-24 h-24" />
          </div>
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">Total Pagu Anggaran</span>
            <h3 className="text-xl font-extrabold text-slate-800">{formatRupiah(totalPaguGlobal)}</h3>
            <span className="inline-block text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Tahap 1 + Tahap 2</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="absolute -right-3 -bottom-3 text-slate-100 opacity-80">
            <TrendingUp className="w-24 h-24" />
          </div>
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">Total Realisasi Belanja</span>
            <h3 className="text-xl font-extrabold text-teal-700">{formatRupiah(totalRealisasiBar)}</h3>
            <span className="text-[10px] text-teal-700 font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> <span>{totalPercent}%</span> Terpakai
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
            <BarChart2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="absolute -right-3 -bottom-3 text-slate-100 opacity-80">
            <Hourglass className="w-24 h-24" />
          </div>
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">Sisa Anggaran Tersedia</span>
            <h3 className="text-xl font-extrabold text-blue-600">{formatRupiah(sisaPaguBersih)}</h3>
            <span className="inline-block text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Selisih Pagu & Belanja</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <Hourglass className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="absolute -right-3 -bottom-3 text-slate-100 opacity-80">
            <Building2 className="w-24 h-24" />
          </div>
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">Jumlah Sekolah</span>
            <h3 className="text-2xl font-black text-slate-800">{filteredSchools.length} Sekolah</h3>
            <span className="inline-block text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Bergabung Sistem</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Chart + Progress Bars & Alokasi Pagu Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-sm">
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 tracking-wide mb-4">
              Visualisasi Realisasi Anggaran - {currentUser.role !== 'Admin' ? currentUser.instansi : (activeSchoolFilter === 'SEMUA' ? 'Semua Sekolah' : activeSchoolFilter)}
            </h4>
            <div className="mb-5">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-500 font-semibold">Tahap 1 (Bulan Januari - Juni)</span>
                <span className="text-slate-800 font-bold">{formatRupiah(totalRealisasiBar)} / {formatRupiah(totalTahap1Pagu)}</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Number(t1Percent))}%` }}></div>
              </div>
              <div className="text-right text-[10px] text-slate-500 mt-1">{t1Percent}% terealisasi</div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-500 font-semibold">Tahap 2 (Bulan Juli - Desember)</span>
                <span className="text-slate-800 font-bold">{formatRupiah(realisasiT2)} / {formatRupiah(totalTahap2Pagu)}</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Number(t2Percent))}%` }}></div>
              </div>
              <div className="text-right text-[10px] text-slate-500 mt-1">{t2Percent}% terealisasi</div>
            </div>
          </div>

          <div>
            <span className="block text-xs font-bold text-slate-400 mb-3">Grafik Alokasi Bulanan (Jan - Des)</span>
            <div className="h-44 w-full relative">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Informasi Alokasi Pagu */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-sm">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 tracking-wide mb-4">Informasi Alokasi Pagu (Sesuai Filter)</h3>

            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">Lembaga Terfilter:</span>
                </div>
                <span className="text-xs font-extrabold text-slate-800">{filteredSchools.length} Sekolah</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
                    <Coins className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">Total Pagu Aktif:</span>
                </div>
                <span className="text-xs font-extrabold text-teal-700">{formatRupiah(totalPaguGlobal)}</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span class="text-xs text-slate-500 font-semibold">Alokasi Tahap 1 (51.9%):</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-800">{formatRupiah(totalTahap1Pagu)}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[51.9%]"></div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span className="text-xs text-slate-500 font-semibold">Alokasi Tahap 2 (48.1%):</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-800">{formatRupiah(totalTahap2Pagu)}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[48.1%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="block text-[11px] font-bold text-amber-600 mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Informasi Dinas:
              </span>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                Pagu Tahap 1 & Tahap 2 terkunci secara otomatis berdasarkan akumulasi nominal Pagu Tiap Bulan sesuai filter sekolah aktif.
              </p>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl space-y-2.5">
              <span className="block text-[11px] font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
                <AlarmClock className="w-4 h-4" /> Batas Waktu Pelaporan
              </span>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-white p-2.5 rounded-lg border border-rose-100/60 shadow-sm">
                  <span className="text-slate-500 block mb-0.5 font-semibold">Sem. 1 / Tahap 1:</span>
                  <span className="text-slate-800 font-extrabold">{formatDateIndo(orgConfig.deadline_t1)}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-rose-100/60 shadow-sm">
                  <span className="text-slate-500 block mb-0.5 font-semibold">Sem. 2 / Tahap 2:</span>
                  <span className="text-slate-800 font-extrabold">{formatDateIndo(orgConfig.deadline_t2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table Section */}
      <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 tracking-wide">Aktivitas Transaksi Terbaru</h4>
            <p className="text-xs text-slate-500">Daftar transaksi pengadaan belanja barang dan modal</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenTransactionModal}
              className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs hover:bg-purple-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Transaksi Realisasi
            </button>
            <button
              onClick={onRefreshData}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex gap-2 flex-wrap items-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2">Filter Kategori:</span>
          {(['SEMUA', 'BUKU', 'ALAT', 'SIPLAH'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 text-xs rounded-full cursor-pointer ${
                filterCategory === cat
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-500 hover:text-slate-800 transition'
              }`}
            >
              {cat === 'SEMUA' ? 'Semua' : cat === 'SIPLAH' ? 'SIPLah' : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-[10px] font-extrabold uppercase tracking-widest">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Nama Barang / Belanja</th>
                <th className="py-4 px-6">Sekolah</th>
                <th className="py-4 px-6">Kategori</th>
                <th className="py-4 px-6 text-center">Jumlah</th>
                <th className="py-4 px-6 text-right">Total Biaya</th>
                <th className="py-4 px-6 text-center">Tanggal</th>
                <th className="py-4 px-6 text-center">Status</th>
                {currentUser.role === 'Admin' && <th className="py-4 px-6 text-center">Aksi Admin</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {categoryFiltered.length === 0 ? (
                <tr>
                  <td colSpan={currentUser.role === 'Admin' ? 9 : 8} className="text-center py-8 text-slate-500">
                    Tidak ada pengajuan transaksi.
                  </td>
                </tr>
              ) : (
                categoryFiltered.map(tx => {
                  let statusBadge = (
                    <span className="px-2 py-0.5 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded text-[10px] font-bold">
                      {tx.status}
                    </span>
                  );
                  if (tx.status.toLowerCase() === 'disetujui') {
                    statusBadge = (
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded text-[10px] font-bold">
                        Disetujui
                      </span>
                    );
                  } else if (tx.status.toLowerCase() === 'pending') {
                    statusBadge = (
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded text-[10px] font-bold">
                        Pending
                      </span>
                    );
                  }

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                      <td className="py-3 px-6 font-mono font-bold text-slate-500">{tx.id}</td>
                      <td className="py-3 px-6 font-semibold text-slate-800">{tx.nama_barang}</td>
                      <td className="py-3 px-6 text-slate-500">{tx.sekolah}</td>
                      <td className="py-3 px-6">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            tx.kategori === 'BUKU'
                              ? 'bg-purple-500/10 text-purple-600'
                              : tx.kategori === 'ALAT'
                              ? 'bg-cyan-500/10 text-cyan-600'
                              : 'bg-fuchsia-500/10 text-fuchsia-600'
                          }`}
                        >
                          {tx.kategori}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center text-slate-500">{tx.jumlah}</td>
                      <td className="py-3 px-6 text-right font-bold text-emerald-600">{formatRupiah(tx.total_biaya)}</td>
                      <td className="py-3 px-6 text-center text-slate-500">{tx.tanggal}</td>
                      <td className="py-3 px-6 text-center">{statusBadge}</td>
                      {currentUser.role === 'Admin' && (
                        <td className="py-3 px-6 text-center">
                          {tx.status.toLowerCase() === 'pending' ? (
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() => onChangeTxStatus(tx.id, 'Disetujui')}
                                className="px-2 py-1 bg-emerald-500 text-white rounded font-bold text-[9px] hover:bg-emerald-600 transition cursor-pointer"
                              >
                                Setujui
                              </button>
                              <button
                                onClick={() => onChangeTxStatus(tx.id, 'Ditolak')}
                                className="px-2 py-1 bg-rose-500 text-white rounded font-bold text-[9px] hover:bg-rose-600 transition cursor-pointer"
                              >
                                Tolak
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500">
          <div>
            Menampilkan <span className="text-slate-800 font-semibold">{categoryFiltered.length}</span> dari{' '}
            <span className="text-slate-800 font-semibold">{filteredTransactions.length}</span> Transaksi
          </div>
          <button
            onClick={() => onSwitchTab('belanja-modal-buku')}
            className="text-purple-600 font-extrabold hover:underline cursor-pointer"
          >
            Lihat Semua Transaksi
          </button>
        </div>
      </div>
    </div>
  );
};
