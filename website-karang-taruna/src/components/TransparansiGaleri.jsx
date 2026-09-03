import { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const galeriPhotos = [
  { id: 1, judul: "Lomba 17 Agustus", tgl: "Agustus 2026", kat: "HUT RI", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600" },
  { id: 2, judul: "Kerja Bakti Blok B", tgl: "Juli 2026", kat: "Sosial", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600" },
  { id: 3, judul: "Malam Keakraban Pemuda", tgl: "Juni 2026", kat: "Sosial", img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600" },
  { id: 4, judul: "Laga Persahabatan Badminton", tgl: "Mei 2026", kat: "Olahraga", img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=600" }
];

export default function TransparansiGaleri() {
  const [filterGaleri, setFilterGaleri] = useState('Semua');

  const filteredGaleri = galeriPhotos.filter(p => filterGaleri === 'Semua' || p.kat === filterGaleri);

  return (
    <section id="transparansi" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Kas Digital Section */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Laporan Kas Digital</h2>
            <p className="text-slate-500 text-sm mt-1">Transparansi keuangan dan mutasi kas Karang Taruna secara terbuka.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#F4F4F5] p-6 rounded-3xl border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3">
                <span>TOTAL SALDO</span>
                <Wallet size={16} className="text-slate-900" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">Rp 2.000.000</div>
              <span className="text-[11px] text-slate-500 font-medium mt-2 block">Diupdate September 2026</span>
            </div>

            <div className="bg-[#F4F4F5] p-6 rounded-3xl border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3">
                <span>PEMASUKAN</span>
                <ArrowUpRight size={16} className="text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-600">+ Rp 2.000.000</div>
              <span className="text-[11px] text-slate-500 mt-2 block">Iuran warga & donatur</span>
            </div>

            <div className="bg-[#F4F4F5] p-6 rounded-3xl border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3">
                <span>PENGELUARAN</span>
                <ArrowDownRight size={16} className="text-rose-600" />
              </div>
              <div className="text-3xl font-extrabold text-rose-600">- Rp 0</div>
              <span className="text-[11px] text-slate-500 mt-2 block">Operasional & kegiatan</span>
            </div>
          </div>
        </div>

        {/* Galeri Dokumentasi */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dokumentasi Kegiatan</h2>
              <p className="text-slate-500 text-sm mt-1">Arsip foto keseruan acaramu bersama pemuda Pakal Residence.</p>
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {['Semua', 'Sosial', 'Olahraga', 'HUT RI'].map((f) => (
                <button 
                  key={f} 
                  onClick={() => setFilterGaleri(f)} 
                  className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    filterGaleri === f ? 'bg-slate-900 text-white' : 'bg-[#F4F4F5] text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGaleri.map((photo) => (
              <div key={photo.id} className="bg-[#F4F4F5] rounded-2xl border border-slate-200 overflow-hidden group">
                <div className="h-44 overflow-hidden relative">
                  <img src={photo.img} alt={photo.judul} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-bold rounded-full">
                    {photo.kat}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-slate-900 text-sm">{photo.judul}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{photo.tgl}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}