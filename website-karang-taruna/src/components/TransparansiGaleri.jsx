import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, Wallet, FileText } from 'lucide-react';
import { supabase } from '../supabaseClient';

const galeriFoto = [
  {
    id: 1,
    judul: "Lomba 17 Agustus 2026",
    kategori: "Olahraga",
    tanggal: "Agustus 2026",
    src: "/kegiatan-1.jpg",
    deskripsi: "Aktivitas olahraga rutin dan persiapan lomba pemuda di lapangan perumahan."
  },
  {
    id: 2,
    judul: "Forum Diskusi & Brainstorming",
    kategori: "Organisasi",
    tanggal: "Agustus 2026",
    src: "/kegiatan-2.jpeg",
    deskripsi: "Sesi diskusi kelompok pemuda untuk merancang program kerja Karang Taruna."
  },
  {
    id: 3,
    judul: "Pelatihan Leadership & Pemuda",
    kategori: "Edukasi",
    tanggal: "Agustus 2026",
    src: "/kegiatan-3.jpeg",
    deskripsi: "Penyampaian materi kepemimpinan dan pengembangan karakter organisasi."
  },
  {
    id: 4,
    judul: "Malam Tirakatan Warga",
    kategori: "Sosial",
    tanggal: "Agustus 2026",
    src: "/kegiatan-4.jpg",
    deskripsi: "Acara kumpul dan nonton bersama seluruh warga perumahan Pakal Residence."
  }
];

// Helper dideklarasikan di luar komponen agar bebas error scope
const parseNominal = (item) => {
  if (!item) return 0;
  const rawVal = item.jumlah ?? item.nominal ?? item.total ?? 0;
  const parsed = typeof rawVal === 'number' ? rawVal : parseFloat(String(rawVal).replace(/[^0-9.-]+/g, ""));
  return isNaN(parsed) ? 0 : parsed;
};

const isPemasukan = (tipe) => {
  const val = String(tipe || '').toLowerCase().trim();
  return val === 'masuk' || val === 'pemasukan' || val === 'in';
};

const isPengeluaran = (tipe) => {
  const val = String(tipe || '').toLowerCase().trim();
  return val === 'keluar' || val === 'pengeluaran' || val === 'out';
};

export default function TransparansiGaleri() {
  const [activePhoto, setActivePhoto] = useState(null);
  const [kasList, setKasList] = useState([]);
  const [loadingKas, setLoadingKas] = useState(true);

  useEffect(() => {
    fetchKas();
  }, []);

  const fetchKas = async () => {
    setLoadingKas(true);
    const { data, error } = await supabase
      .from('kas')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data) {
      setKasList(data);
    }
    setLoadingKas(false);
  };

  // Kalkulasi Total Saldo
  const totalPemasukan = kasList
    .filter(item => isPemasukan(item.tipe))
    .reduce((acc, curr) => acc + parseNominal(curr), 0);

  const totalPengeluaran = kasList
    .filter(item => isPengeluaran(item.tipe))
    .reduce((acc, curr) => acc + parseNominal(curr), 0);

  const saldoAkhir = totalPemasukan - totalPengeluaran;

  return (
    <div id="transparansi" className="bg-[#F4F4F5] border-b border-slate-200 pt-12">
      
      {/* SEKSI 1: TRANSPARANSI KAS DIGITAL */}
      <section className="py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase block mb-1">
              Akuntabilitas
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Transparansi Kas Digital
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Laporan pemasukan dan pengeluaran dana kas Karang Taruna Pakal Residence secara terbuka.
            </p>
          </div>

          {/* Card Summary Saldo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Saldo Kas</span>
                <Wallet className="text-emerald-400" size={20} />
              </div>
              <div className="text-3xl font-extrabold tracking-tight">
                Rp {saldoAkhir.toLocaleString('id-ID')}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Update otomatis dari sistem</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Pemasukan</span>
                <TrendingUp className="text-emerald-600" size={20} />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                Rp {totalPemasukan.toLocaleString('id-ID')}
              </div>
              <p className="text-[11px] text-emerald-600 font-medium mt-2">Iuran warga & donasi</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Pengeluaran</span>
                <TrendingDown className="text-rose-600" size={20} />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                Rp {totalPengeluaran.toLocaleString('id-ID')}
              </div>
              <p className="text-[11px] text-rose-600 font-medium mt-2">Kegiatan & operasional</p>
            </div>
          </div>

          {/* Tabel Mutasi Kas Terakhir */}
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText size={16} /> Riwayat Transaksi Kas Terakhir
              </h3>
              <span className="text-xs text-slate-400 font-medium">{kasList.length} Transaksi Tercatat</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Tanggal</th>
                    <th className="px-6 py-3">Keterangan</th>
                    <th className="px-6 py-3">Tipe</th>
                    <th className="px-6 py-3 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loadingKas ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-400">Memuat data kas...</td>
                    </tr>
                  ) : kasList.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-400">Belum ada catatan transaksi kas.</td>
                    </tr>
                  ) : (
                    kasList.map((item) => {
                      const nominal = parseNominal(item);
                      const masuk = isPemasukan(item.tipe);

                      return (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-3.5 font-medium whitespace-nowrap text-slate-500">{item.tanggal || '-'}</td>
                          <td className="px-6 py-3.5 font-semibold text-slate-900">{item.keterangan}</td>
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                              masuk 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {masuk ? 'Pemasukan' : 'Pengeluaran'}
                            </span>
                          </td>
                          <td className={`px-6 py-3.5 text-right font-bold whitespace-nowrap ${
                            masuk ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                            {masuk ? '+' : '-'} Rp {nominal.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* SEKSI 2: GALERI KEGIATAN WARGA */}
      <section id="galeri" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase block mb-1">
                Dokumentasi
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Galeri Kegiatan Warga
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Momen kebersamaan, aksi sosial, dan dinamika kegiatan Karang Taruna Pakal Residence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galeriFoto.map((item) => (
              <div 
                key={item.id}
                onClick={() => setActivePhoto(item)}
                className="group cursor-pointer bg-slate-50 rounded-3xl overflow-hidden border border-slate-200/80 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden bg-slate-900">
                  <img 
                    src={item.src} 
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition"></div>
                  <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-bold rounded-full border border-slate-200">
                    {item.kategori}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition line-clamp-1">
                    {item.judul}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.deskripsi}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mt-4">
                    <Calendar size={13} />
                    <span>{item.tanggal}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Modal Lightbox Foto */}
        {activePhoto && (
          <div 
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActivePhoto(null)}
          >
            <div 
              className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-80 sm:h-96 bg-slate-900">
                <img 
                  src={activePhoto.src} 
                  alt={activePhoto.judul} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  {activePhoto.kategori}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {activePhoto.judul}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mt-2">
                  {activePhoto.deskripsi}
                </p>
                <button 
                  onClick={() => setActivePhoto(null)}
                  className="mt-5 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-full text-xs transition"
                >
                  Tutup Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}