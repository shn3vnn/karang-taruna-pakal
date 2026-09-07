import React, { useState } from 'react';
import { Image, Calendar, Tag } from 'lucide-react';

const galeriFoto = [
  {
    id: 1,
    judul: "Turnamen & Olahraga Pemuda",
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
    judul: "Malam Kebersamaan & Guyub Warga",
    kategori: "Sosial",
    tanggal: "Agustus 2026",
    src: "/kegiatan-4.jpg",
    deskripsi: "Acara kumpul dan nonton bersama seluruh warga perumahan Pakal Residence."
  }
];

export default function TransparansiGaleri() {
  const [activePhoto, setActivePhoto] = useState(null);

  return (
    <section id="galeri" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Galeri */}
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

        {/* Grid Foto Galeri */}
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

      {/* Lightbox / Modal Preview Foto Full Size */}
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
  );
}