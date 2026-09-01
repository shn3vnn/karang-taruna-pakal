import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const pengurusInti = [
  { id: 'p1', nama: "Ahmad Rifai", jabatan: "Ketua Karang Taruna", foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" },
  { id: 'p2', nama: "Siti Rahma", jabatan: "Wakil Ketua", foto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400" },
  { id: 'p3', nama: "Budi Santoso", jabatan: "Sekretaris", foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
  { id: 'p4', nama: "Dina Mariana", jabatan: "Bendahara", foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
];

export default function Pengurus() {
  const [anggotaAktif, setAnggotaAktif] = useState([]);

  useEffect(() => {
    const fetchAnggota = async () => {
      const { data, error } = await supabase
        .from('pendaftar')
        .select('*')
        .eq('status', 'Disetujui');

      if (!error && data) {
        setAnggotaAktif(data);
      }
    };

    fetchAnggota();
  }, []);

  return (
    <section id="profil" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#039088] font-semibold text-sm uppercase tracking-wider">Struktur Organisasi</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">Pengurus & Anggota Resmi</h2>
          <p className="text-slate-600 mt-4">Pemuda-pemudi yang mendedikasikan waktu dan tenaga untuk kemajuan lingkungan perumahan.</p>
        </div>

        {/* 1. Pengurus Inti */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {pengurusInti.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 text-center">
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-100">
                <img src={item.foto} alt={item.nama} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{item.nama}</h3>
              <p className="text-sm font-semibold text-[#039088] mt-0.5">{item.jabatan}</p>
            </div>
          ))}
        </div>

        {/* 2. Anggota Resmi dari Supabase */}
        {anggotaAktif.length > 0 && (
          <div className="mt-12 pt-12 border-t border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Anggota Aktif Terverifikasi</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {anggotaAktif.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-xs">
                  <div className="w-12 h-12 bg-[#E6F4F3] text-[#039088] font-bold rounded-full flex items-center justify-center mx-auto mb-2 text-lg">
                    {item.nama.charAt(0)}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 truncate">{item.nama}</h4>
                  <p className="text-[11px] text-slate-500">{item.blok}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold text-[10px] rounded-md">
                    {item.minat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}