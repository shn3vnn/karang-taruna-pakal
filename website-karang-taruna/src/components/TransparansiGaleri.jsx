import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, Wallet, Image, FileText } from 'lucide-react';
import { supabase } from '../supabaseClient';

const galeriFoto = [
  {
    id: 1,
    judul: "Turnamen & Olahraga Pemuda",
    kategori: "Olahraga",
    tanggal: "Agustus 2026",
    src: "/galeri/kegiatan-1.jpg",
    deskripsi: "Aktivitas olahraga rutin dan persiapan lomba pemuda di lapangan perumahan."
  },
  {
    id: 2,
    judul: "Forum Diskusi & Brainstorming",
    kategori: "Organisasi",
    tanggal: "Agustus 2026",
    src: "/galeri/kegiatan-2.jpg",
    deskripsi: "Sesi diskusi kelompok pemuda untuk merancang program kerja Karang Taruna."
  },
  {
    id: 3,
    judul: "Pelatihan Leadership & Pemuda",
    kategori: "Edukasi",
    tanggal: "Agustus 2026",
    src: "/galeri/kegiatan-3.jpg",
    deskripsi: "Penyampaian materi kepemimpinan dan pengembangan karakter organisasi."
  },
  {
    id: 4,
    judul: "Malam Kebersamaan & Guyub Warga",
    kategori: "Sosial",
    tanggal: "Agustus 2026",
    src: "/galeri/kegiatan-4.jpg",
    deskripsi: "Acara kumpul dan nonton bersama seluruh warga perumahan Pakal Residence."
  }
];

export default function TransparansiGaleri() {
  const [activePhoto, setActivePhoto] = useState(null);
  const [kasList, setKasList] = useState([]);
  const [loadingKas, setLoadingKas] = useState(true);

  // Fetch Data Mutasi Kas dari Supabase
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
    .filter(item => item.tipe === 'masuk')
    .reduce((acc, curr) => acc + Number(curr.jumlah || 0), 0);

  const totalPengeluaran = kasList
    .filter(item => item.tipe === 'keluar')
    .reduce((acc, curr) => acc + Number(curr.jumlah || 0), 0);

  const saldoAkhir = totalPemasukan - totalPengeluaran;

  return (
    <div id="transparansi" className="bg-white border-b border-slate-200">
      
      {/* SEKSI 1: TRANSPARANSI KAS DIGITAL */}
      <section className="py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10">
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

            <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Pemasukan</span>
                <TrendingUp className="text-emerald-600" size={20} />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                Rp {totalPemasukan.toLocaleString('id-ID')}
              </div>
              <p className="text-[11px] text-emerald-600 font-medium mt-2">Iuran warga & donasi</p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-3xl">
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
          <div className="bg-slate-50 rounded-3xl border border-slate-200/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-white">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText size={16} /> Riwayat Transaksi Kas Terakhir
              </h3>
              <span className="text-xs text-slate-400 font-medium">{kasList.length} Transaksi Tercatat</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Tanggal</th>
                    <th className="px-6 py-3">Keterangan</th>
                    <th className="px-6 py-3">Tipe</th>
                    <th className="px-6 py-3 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 text-slate-700">
                  {loadingKas ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-400">Memuat data kas...</td>
                    </tr>
                  ) : kasList.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-400">Belum ada catatan transaksi kas.</td>
                    </tr>
                  ) : (
                    kasList.map((item) => (
                      <tr key={item.id} className="hover:bg-white/80 transition">
                        <td className="px-6 py-3.5 font-medium whitespace-nowrap">{item.tanggal || '-'}</td>
                        <td className="px-6 py-3.5 font-semibold text-slate-900">{item.keterangan}</td>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                            item.tipe === 'masuk' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {item.tipe === 'masuk' ? 'Pemasukan' : 'Pengeluaran'}
                          </span>
                        </td>
                        <td className={`px-6 py-3.5 text-right font-bold whitespace-nowrap ${
                          item.tipe === 'masuk' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {item.tipe === 'masuk' ? '+' : '-'} Rp {Number(item.jumlah).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* SEKSI 2: GALERI KEGIATAN WARGA */}
      <section id="galeri" className="py-16">
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