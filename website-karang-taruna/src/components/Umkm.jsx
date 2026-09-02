import { useState, useEffect } from 'react';
import { Search, Plus, MessageCircle } from 'lucide-react';

const defaultUmkm = [
  { id: 1, nama: "Dapur Mama Maya", kategori: "Kuliner", wa: "6285739439137", deskripsi: "Menerima pesanan Nasi Kotak, Kue Basah, dan Snack Box untuk acara warga.", foto: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600", status: "Approved" },
  { id: 2, nama: "Laundry Kilat Blok C", kategori: "Jasa", wa: "6285739439137", deskripsi: "Cuci bersih, wangi, dan rapi. Antar jemput gratis khusus area perumahan.", foto: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=600", status: "Approved" },
  { id: 3, nama: "Kopi Seduh Tetangga", kategori: "Minuman", wa: "6285739439137", deskripsi: "Kopi susu kekinian dan aneka minuman segar. Buka setiap sore.", foto: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600", status: "Approved" }
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
    const matchesSearch = item.nama.toLowerCase().includes(search.toLowerCase()) || item.deskripsi.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'Semua' || item.kategori === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <section id="umkm" className="py-16 border-b border-[#E5E5E5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-[#E5E5E5] pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#737373] block mb-1">
              [ 04 ] — Usaha Lokal
            </span>
            <h2 className="text-2xl font-medium text-[#171717]">Katalog UMKM Tetangga</h2>
          </div>

          <button onClick={onOpenDaftarUmkm} className="bg-white border border-[#D4D4D4] hover:bg-[#F5F5F5] text-[#171717] px-3.5 py-1.5 rounded text-xs font-medium transition flex items-center gap-1.5 self-start sm:self-auto">
            <Plus size={14} /> Daftarkan Usaha
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
            <input 
              type="text" 
              placeholder="Cari UMKM..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full bg-white border border-[#E5E5E5] rounded pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#171717]" 
            />
          </div>
          <div className="flex gap-1">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                className={`px-3 py-1.5 rounded text-xs transition ${activeCategory === cat ? 'bg-[#171717] text-white' : 'bg-white text-[#525252] border border-[#E5E5E5]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUmkm.map((item) => (
            <div key={item.id} className="bg-white rounded border border-[#E5E5E5] overflow-hidden flex flex-col justify-between hover:border-[#171717] transition">
              <div>
                <img src={item.foto} alt={item.nama} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <span className="text-[10px] font-mono text-[#737373] border border-[#E5E5E5] px-1.5 py-0.5 rounded">{item.kategori}</span>
                  <h3 className="font-medium text-[#171717] text-sm mt-2 mb-1">{item.nama}</h3>
                  <p className="text-xs text-[#525252] leading-relaxed">{item.deskripsi}</p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <a 
                  href={`whatsapp://send?phone=${item.wa}&text=${encodeURIComponent(`Halo ${item.nama}, saya warga Pakal Residence ingin bertanya produk/jasa.`)}`}
                  className="w-full bg-[#F5F5F5] hover:bg-[#E5E5E5] text-[#171717] py-2 rounded text-xs font-medium transition flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={13} /> Hubungi Penjual
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}