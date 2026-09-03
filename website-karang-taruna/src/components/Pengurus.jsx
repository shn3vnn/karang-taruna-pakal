import { useState, useEffect } from 'react';
import { UserCheck, ShieldCheck } from 'lucide-react';
import { supabase } from '../supabaseClient';

const pengurusStruktural = [
  { nama: "Ahmad Rifai", jabatan: "Ketua Karang Taruna", foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
  { nama: "Siti Rahma", jabatan: "Wakil Ketua", foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
  { nama: "Budi Santoso", jabatan: "Sekretaris", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
  { nama: "Dina Mariana", jabatan: "Bendahara", foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" }
];

export default function Pengurus() {
  const [anggotaAktif, setAnggotaAktif] = useState([]);

  useEffect(() => {
    fetchAnggotaDisetujui();
  }, []);

  const fetchAnggotaDisetujui = async () => {
    // Ambil data pendaftar dari Supabase yang sudah Disetujui / Approved
    const { data, error } = await supabase
      .from('pendaftar')
      .select('*');

    if (!error && data) {
      const approved = data.filter(item => item.status === 'Disetujui' || item.status === 'Approved');
      setAnggotaAktif(approved);
    }
  };

  return (
    <section id="pengurus" className="py-16 bg-[#F4F4F5] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* STRUKTUR PENGURUS UTAMA */}
        <div>
          <div className="mb-10 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Pengurus Inti Organisasi</h2>
            <p className="text-slate-500 text-sm mt-1">Pemuda-pemudi aktif penggerak kegiatan di Pakal Residence.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {pengurusStruktural.map((p, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 text-center hover:border-slate-400 transition">
                <img src={p.foto} alt={p.nama} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border border-slate-200" />
                <h4 className="font-bold text-slate-900 text-base">{p.nama}</h4>
                <p className="text-xs text-slate-500 font-medium mt-1">{p.jabatan}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DAFTAR ANGGOTA PEMUDA TERVERIFIKASI */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <UserCheck size={22} className="text-emerald-600" /> Anggota Pemuda Terverifikasi
              </h3>
              <p className="text-slate-500 text-xs mt-1">Daftar pemuda perumahan yang telah resmi bergabung melalui verifikasi admin.</p>
            </div>
            <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold">
              {anggotaAktif.length} Anggota
            </span>
          </div>

          {anggotaAktif.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center">
              <p className="text-xs text-slate-500 font-medium">Belum ada anggota baru yang disetujui. Pendaftaran anggota baru akan muncul di sini setelah diverifikasi Admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {anggotaAktif.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center hover:border-slate-400 transition">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.nama}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Blok: <span className="font-semibold text-slate-700">{item.blok}</span> • {item.umur} Thn
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {item.minat}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}