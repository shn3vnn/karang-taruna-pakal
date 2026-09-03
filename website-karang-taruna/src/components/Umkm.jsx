import { useState, useEffect } from 'react';
import { Search, Plus, MessageCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

const defaultUmkm = [
  { id: 1, nama: "Dapur Mama Maya", kategori: "Kuliner", wa: "6285739439137", deskripsi: "Menerima pesanan Nasi Kotak, Kue Basah, dan Snack Box untuk acara warga.", foto: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600", status: "Approved" },
  { id: 2, nama: "Laundry Kilat Blok C", kategori: "Jasa", wa: "6285739439137", deskripsi: "Cuci bersih, wangi, dan rapi. Antar jemput gratis khusus area perumahan.", foto: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=600", status: "Approved" },
  { id: 3, nama: "Kopi Seduh Tetangga", kategori: "Minuman", wa: "6285739439137", deskripsi: "Kopi susu kekinian dan aneka minuman segar. Buka setiap sore.", foto: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600", status: "Approved" }
];

export default function Umkm({ onOpenDaftarUmkm }) {
  const [umkmList, setUmkmList] = useState(defaultUmkm);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    fetchApprovedUmkm();
  }, []);

  const fetchApprovedUmkm = async () => {
    // Ambil data dari Supabase
    const { data: supabaseData, error } = await supabase
      .from('umkm')
      .select('*')
      .eq('status', 'Approved');

    // Ambil juga dari LocalStorage (jika ada simpanan lokal)
    const localData = JSON.parse(localStorage.getItem('umkm_karta')) || [];
    const approvedLocal = localData.filter(i => i.status === 'Approved');

    if (!error && supabaseData && supabaseData.length > 0) {
      setUmkmList([...defaultUmkm, ...supabaseData, ...approvedLocal]);
    } else if (approvedLocal.length > 0) {
      setUmkmList([...defaultUmkm, ...approvedLocal]);
    }
  };

  const categories = ['Semua', 'Kuliner', 'Minuman', 'Jasa'];

  const filteredUmkm = umkmList.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(search.toLowerCase()) || item.deskripsi.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'Semua' || item.kategori === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <section id="umkm" className="py-16 bg-[#F4F4F5] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Katalog UMKM Tetangga</h2>
            <p className="text-slate-500 text-sm mt-1">Dukung dan larisi usaha lokal milik warga perumahan kita.</p>
          </div>

          <button 
            onClick={onOpenDaftarUmkm} 
            className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-900 px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            <Plus size={15} /> Daftarkan Usaha
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari UMKM atau produk..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900" 
            />
          </div>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition ${
                  activeCategory === cat ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUmkm.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-slate-400 transition">
              <div>
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img src={item.foto} alt={item.nama} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-bold rounded-full border border-slate-200">
                    {item.kategori}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{item.nama}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.deskripsi}</p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <a 
                  href={`whatsapp://send?phone=${item.wa}&text=${encodeURIComponent(`Halo ${item.nama}, saya warga Pakal Residence ingin bertanya tentang produk/jasa.`)}`}
                  className="w-full bg-slate-100 hover:bg-slate-900 text-slate-900 hover:text-white py-3 rounded-full text-xs font-bold transition flex items-center justify-center gap-2"
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