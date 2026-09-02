const pengurusList = [
  { nama: "Ahmad Rifai", jabatan: "Ketua Karang Taruna", foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
  { nama: "Siti Rahma", jabatan: "Wakil Ketua", foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
  { nama: "Budi Santoso", jabatan: "Sekretaris", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
  { nama: "Dina Mariana", jabatan: "Bendahara", foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" }
];

export default function Pengurus() {
  return (
    <section id="pengurus" className="py-16 sm:py-20 bg-[#FAF8F5] border-b border-[#E6E4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#0F766E] font-bold text-xs uppercase tracking-wider bg-[#E8F5F3] px-2.5 py-1 rounded-md">
            Struktur Organisasi
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1F1D] mt-2">Pengurus & Anggota Resmi</h2>
          <p className="text-[#737A75] text-sm mt-1">Pemuda-pemudi aktif yang mengabdi untuk lingkungan Pakal Residence.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {pengurusList.map((p, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-[#E6E4DF] text-center hover:border-[#0F766E] transition">
              <img src={p.foto} alt={p.nama} className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover mx-auto mb-3" />
              <h4 className="font-bold text-[#1C1F1D] text-sm sm:text-base">{p.nama}</h4>
              <p className="text-xs text-[#0F766E] font-semibold mt-0.5">{p.jabatan}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}