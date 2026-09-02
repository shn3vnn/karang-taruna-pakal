import { useState, useEffect } from 'react';
import { Search, Plus, MessageCircle } from 'lucide-react';

const defaultUmkm = [
  {
    id: 1,
    nama: "Dapur Mama Maya",
    kategori: "Kuliner",
    wa: "6285739439137",
    deskripsi: "Menerima pesanan Nasi Kotak, Kue Basah, dan Snack Box untuk acara warga.",
    foto: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600",
    status: "Approved"
  },
  {
    id: 2,
    nama: "Laundry Kilat Blok C",
    kategori: "Jasa",
    wa: "6285739439137",
    deskripsi: "Cuci bersih, wangi, dan rapi. Antar jemput gratis khusus area perumahan.",
    foto: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=600",
    status: "Approved"
  },
  {
    id: 3,
    nama: "Kopi Seduh Tetangga",
    kategori: "Minuman",
    wa: "6285739439137",
    deskripsi: "Kopi susu kekinian dan aneka minuman segar. Buka setiap sore.",
    foto: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600",
    status: "Approved"
  }
];

export default function Umkm({ onOpenDaftarUmkm }) {
  const [umkmList, setUmkmList] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('umkm_karta')) || [];
    const approvedSaved = saved.filter(item => item.status === 'Approved');
    setUmkmList([...defaultUmkm, ...approvedSaved]);
  }, []);

  const categories = ['Semua', 'Kuliner', 'Minuman', 'Jasa'];

  const filteredUmkm = umkmList.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(search.toLowerCase()) || 
                          item.deskripsi.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'Semua' || item.kategori === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <section id="umkm" className="py-16 sm:py-20 bg-[#FAF8F5] border-b border-[#E6E4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[#0F766E] font-bold text-xs uppercase tracking-wider bg-[#E8F5F3] px-2.5 py-1 rounded-md">
              Ekonomi Warga
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1F1D] mt-2">Katalog UMKM Tetangga</h2>
            <p className="text-[#737A75] text-sm mt-1">Dukung usaha lokal warga perumahan kita sendiri.</p>
          </div>

          <button 
            onClick={onOpenDaftarUmkm}
            className="inline-flex items-center gap-2 bg-white hover:bg-[#F2EFEA] border border-[#DCD9D4] text-[#1C1F1D] px-4 py-2.5 rounded-lg text-xs font-bold transition shadow-xs self-start md:self-auto"
          >
            <Plus size={16} className="text-[#0F766E]" /> Daftarkan Usaha
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737A75]" />
            <input 
              type="text" 
              placeholder="Cari UMKM atau produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-[#E6E4DF] rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm text-[#1C1F1D] focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeCategory === cat 
                    ? 'bg-[#0F766E] text-white' 
                    : 'bg-white text-[#525854] border border-[#E6E4DF] hover:bg-[#F2EFEA]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUmkm.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-[#E6E4DF] overflow-hidden flex flex-col justify-between hover:border-[#0F766E] transition">
              <div>
                <div className="relative h-48 bg-[#F2EFEA]">
                  <img src={item.foto} alt={item.nama} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-[#1C1F1D] text-[11px] font-bold rounded-md border border-[#E6E4DF]">
                    {item.kategori}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#1C1F1D] text-base mb-1.5">{item.nama}</h3>
                  <p className="text-xs text-[#525854] leading-relaxed">{item.deskripsi}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <a 
                  href={`whatsapp://send?phone=${item.wa}&text=${encodeURIComponent(`Halo ${item.nama}, saya warga Pakal Residence ingin bertanya produk/jasa.`)}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#E8F5F3] hover:bg-[#0F766E] text-[#0F766E] hover:text-white py-2.5 rounded-lg text-xs font-bold transition"
                >
                  <MessageCircle size={15} /> Hubungi Penjual
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}