const pengurusList = [
  { nama: "Ahmad Rifai", jabatan: "Ketua Karang Taruna", foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
  { nama: "Siti Rahma", jabatan: "Wakil Ketua", foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
  { nama: "Budi Santoso", jabatan: "Sekretaris", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
  { nama: "Dina Mariana", jabatan: "Bendahara", foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" }
];

export default function Pengurus() {
  return (
    <section id="pengurus" className="py-16 border-b border-[#E5E5E5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-[#737373] block mb-1">
            [ 06 ] — Pengurus
          </span>
          <h2 className="text-2xl font-medium text-[#171717]">Struktur Organisasi</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {pengurusList.map((p, idx) => (
            <div key={idx} className="bg-white p-3 border border-[#E5E5E5] rounded text-center">
              <img src={p.foto} alt={p.nama} className="w-20 h-20 rounded-full object-cover mx-auto mb-2" />
              <h4 className="font-medium text-xs text-[#171717]">{p.nama}</h4>
              <p className="text-[11px] text-[#737373]">{p.jabatan}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}