import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

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
    <section id="transparansi" className="py-16 sm:py-20 bg-white border-b border-[#E6E4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* KAS DIGITAL SECTION */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[#0F766E] font-bold text-xs uppercase tracking-wider bg-[#E8F5F3] px-2.5 py-1 rounded-md">
              Keterbukaan Informasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1F1D] mt-2">Laporan Kas Digital</h2>
            <p className="text-[#737A75] text-sm mt-1">Rekapitulasi iuran dan keuangan rutin transparansi Karang Taruna.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#FAF8F5] p-6 rounded-xl border border-[#E6E4DF]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#737A75] mb-2">
                <span>TOTAL SALDO KAS</span>
                <Wallet size={16} className="text-[#0F766E]" />
              </div>
              <div className="text-2xl font-extrabold text-[#1C1F1D]">Rp 2.000.000</div>
              <span className="text-[11px] text-[#0F766E] font-medium mt-1 block">Diupdate September 2026</span>
            </div>

            <div className="bg-[#FAF8F5] p-6 rounded-xl border border-[#E6E4DF]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#737A75] mb-2">
                <span>TOTAL PEMASUKAN</span>
                <ArrowUpRight size={16} className="text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-600">+ Rp 2.000.000</div>
              <span className="text-[11px] text-[#737A75] mt-1 block">Iuran warga & donatur</span>
            </div>

            <div className="bg-[#FAF8F5] p-6 rounded-xl border border-[#E6E4DF]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#737A75] mb-2">
                <span>TOTAL PENGELUARAN</span>
                <ArrowDownRight size={16} className="text-rose-600" />
              </div>
              <div className="text-2xl font-extrabold text-rose-600">- Rp 0</div>
              <span className="text-[11px] text-[#737A75] mt-1 block">Operasional & kegiatan</span>
            </div>
          </div>
        </div>

        {/* GALERI KEGIATAN SECTION */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[#0F766E] font-bold text-xs uppercase tracking-wider bg-[#E8F5F3] px-2.5 py-1 rounded-md">
                Dokumentasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1F1D] mt-2">Galeri Kegiatan</h2>
            </div>

            <div className="flex gap-1.5 overflow-x-auto">
              {['Semua', 'Sosial', 'Olahraga', 'HUT RI'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterGaleri(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    filterGaleri === f 
                      ? 'bg-[#0F766E] text-white' 
                      : 'bg-[#FAF8F5] text-[#525854] border border-[#E6E4DF]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredGaleri.map((photo) => (
              <div key={photo.id} className="relative group rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E6E4DF] aspect-4/3">
                <img src={photo.img} alt={photo.judul} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-bold bg-[#0F766E] px-2 py-0.5 rounded-md self-start mb-1">{photo.kat}</span>
                  <h4 className="font-bold text-sm leading-tight">{photo.judul}</h4>
                  <span className="text-[11px] text-zinc-300">{photo.tgl}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}