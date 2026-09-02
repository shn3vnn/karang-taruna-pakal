import { useState } from 'react';

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
    <section id="transparansi" className="py-16 border-b border-[#E5E5E5] bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* KAS */}
        <div className="mb-12">
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-[#737373] block mb-1">
              [ 05 ] — Keterbukaan
            </span>
            <h2 className="text-2xl font-medium text-[#171717]">Laporan Kas Digital</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FAFAFA] p-5 border border-[#E5E5E5] rounded">
              <span className="text-xs text-[#737373] block mb-1">TOTAL SALDO</span>
              <div className="text-xl font-medium text-[#171717]">Rp 2.000.000</div>
            </div>
            <div className="bg-[#FAFAFA] p-5 border border-[#E5E5E5] rounded">
              <span className="text-xs text-[#737373] block mb-1">PEMASUKAN</span>
              <div className="text-xl font-medium text-[#171717]">+ Rp 2.000.000</div>
            </div>
            <div className="bg-[#FAFAFA] p-5 border border-[#E5E5E5] rounded">
              <span className="text-xs text-[#737373] block mb-1">PENGELUARAN</span>
              <div className="text-xl font-medium text-[#171717]">- Rp 0</div>
            </div>
          </div>
        </div>

        {/* GALERI */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <h3 className="text-lg font-medium text-[#171717]">Dokumentasi Kegiatan</h3>
            <div className="flex gap-1">
              {['Semua', 'Sosial', 'Olahraga', 'HUT RI'].map((f) => (
                <button 
                  key={f} 
                  onClick={() => setFilterGaleri(f)} 
                  className={`px-2.5 py-1 rounded text-xs ${filterGaleri === f ? 'bg-[#171717] text-white' : 'bg-[#FAFAFA] text-[#525252] border border-[#E5E5E5]'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredGaleri.map((photo) => (
              <div key={photo.id} className="border border-[#E5E5E5] rounded overflow-hidden bg-[#FAFAFA]">
                <img src={photo.img} alt={photo.judul} className="w-full h-36 object-cover" />
                <div className="p-3">
                  <span className="text-[10px] font-mono text-[#737373]">{photo.kat}</span>
                  <h4 className="font-medium text-xs text-[#171717] mt-0.5">{photo.judul}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}