import { useState, useEffect } from 'react';
import { MessageCircle, Search, Store, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

const umkmDefault = [
  { id: 'def-1', nama: "Dapur Mama Maya", kategori: "Kuliner", deskripsi: "Menerima pesanan Nasi Kotak, Kue Basah, dan Snack Box untuk acara.", wa: "6281234567890", foto: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400" },
  { id: 'def-2', nama: "Laundry Kilat Blok C", kategori: "Jasa", deskripsi: "Cuci bersih, wangi, dan rapi. Antar jemput gratis khusus area perumahan.", wa: "6281234567890", foto: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&q=80&w=400" },
  { id: 'def-3', nama: "Kopi Seduh Tetangga", kategori: "Minuman", deskripsi: "Kopi susu kekinian dan aneka minuman segar. Buka setiap sore.", wa: "6281234567890", foto: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400" },
];

export default function Umkm() {
  const [filter, setFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [listUmkm, setListUmkm] = useState(umkmDefault);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ambil data UMKM dari Supabase
  const loadUmkmData = async () => {
    const { data, error } = await supabase
      .from('umkm')
      .select('*')
      .eq('status', 'Disetujui');

    if (!error && data) {
      setListUmkm([...umkmDefault, ...data]);
    }
  };

  useEffect(() => {
    loadUmkmData();
  }, []);

  // Submit UMKM ke Supabase
  const handleSubmitDaftarUmkm = (e) => {
    e.preventDefault();
    const nama = e.target.nama.value;
    const kategori = e.target.kategori.value;
    const wa = e.target.wa.value;
    const deskripsi = e.target.deskripsi.value;
    const fileFoto = e.target.fotoFile.files[0];

    const saveToSupabase = async (fotoUrl) => {
      const { error } = await supabase
        .from('umkm')
        .insert([
          {
            nama,
            kategori,
            wa,
            deskripsi,
            foto: fotoUrl || "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=400",
            status: 'Pending'
          }
        ]);

      if (error) {
        alert('Gagal pendaftaran: ' + error.message);
      } else {
        alert('Pendaftaran UMKM berhasil dikirim! Menunggu verifikasi admin.');
        setIsModalOpen(false);
        loadUmkmData();
      }
    };

    if (fileFoto) {
      const reader = new FileReader();
      reader.onloadend = () => {
        saveToSupabase(reader.result);
      };
      reader.readAsDataURL(fileFoto);
    } else {
      saveToSupabase(null);
    }
  };

  const filteredData = listUmkm.filter((item) => {
    const matchesCategory = filter === 'Semua' || item.kategori === filter;
    const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="umkm" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <span className="text-[#039088] font-semibold text-sm uppercase tracking-wider">Ekonomi Warga</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Katalog UMKM Tetangga</h2>
            <p className="text-slate-500 text-sm mt-1">Dukung usaha lokal warga perumahan kita sendiri.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
            <div className="relative flex-1 sm:w-60">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari UMKM atau produk..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#039088]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['Semua', 'Kuliner', 'Minuman', 'Jasa'].map((kat) => (
                <button
                  key={kat}
                  onClick={() => setFilter(kat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${filter === kat ? 'bg-[#039088] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {kat}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#E6F4F3] text-[#039088] hover:bg-[#039088] hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition border border-[#039088]/20 flex items-center justify-center gap-1.5"
            >
              + Daftarkan Usaha
            </button>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            Toko atau produk yang kamu cari tidak ditemukan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="h-48 overflow-hidden relative bg-slate-200">
                    <img src={item.foto || "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=400"} alt={item.nama} className="w-full h-full object-cover" />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#039088] text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                      {item.kategori}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.nama}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.deskripsi}</p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <a
                    href={`https://wa.me/${item.wa}?text=Halo%20${encodeURIComponent(item.nama)},%20saya%20warga%20perumahan%20melihat%20usaha%20Anda%20di%20website%20Karang%20Taruna.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#E6F4F3] hover:bg-[#039088] text-[#039088] hover:text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm"
                  >
                    <MessageCircle size={18} /> Hubungi Penjual
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }} 
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
                <X size={24}/>
              </button>
              
              <span className="text-[#039088] font-semibold text-xs uppercase tracking-wider">Ekonomi Warga</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1 mb-2">Form Pendaftaran UMKM</h3>
              <p className="text-slate-600 text-xs mb-6">Promosikan produk / jasa kamu ke seluruh warga perumahan gratis.</p>

              <form className="space-y-3" onSubmit={handleSubmitDaftarUmkm}>
                <input name="nama" type="text" required placeholder="Nama Toko / Usaha" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#039088]" />
                <select name="kategori" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#039088]">
                  <option value="Kuliner">Kuliner</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Jasa">Jasa</option>
                </select>
                <input name="wa" type="text" required placeholder="No. WA Penjual (Contoh: 6281234...)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#039088]" />
                <textarea name="deskripsi" required rows="3" placeholder="Deskripsi singkat produk/jasa..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#039088]"></textarea>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Unggah Foto Produk/Toko:</label>
                  <input 
                    name="fotoFile" 
                    type="file" 
                    accept="image/*" 
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#E6F4F3] file:text-[#039088] hover:file:bg-[#039088] hover:file:text-white file:transition cursor-pointer" 
                  />
                </div>
                
                <button type="submit" className="w-full bg-[#039088] hover:bg-[#02756D] text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md mt-2">
                  Daftarkan Usaha <Store size={16} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}