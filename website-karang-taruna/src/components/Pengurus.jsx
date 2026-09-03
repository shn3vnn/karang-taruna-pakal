const pengurusList = [
  { nama: "Ahmad Rifai", jabatan: "Ketua Karang Taruna", foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
  { nama: "Siti Rahma", jabatan: "Wakil Ketua", foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
  { nama: "Budi Santoso", jabatan: "Sekretaris", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
  { nama: "Dina Mariana", jabatan: "Bendahara", foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" }
];

export default function Pengurus() {
  return (
    <section id="pengurus" className="py-16 bg-[#F4F4F5] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Pengurus Organisasi</h2>
          <p className="text-slate-500 text-sm mt-1">Pemuda-pemudi aktif penggerak kegiatan di Pakal Residence.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {pengurusList.map((p, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 text-center hover:border-slate-400 transition">
              <img src={p.foto} alt={p.nama} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border border-slate-200" />
              <h4 className="font-bold text-slate-900 text-base">{p.nama}</h4>
              <p className="text-xs text-slate-500 font-medium mt-1">{p.jabatan}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}