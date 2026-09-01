import { useState, useEffect } from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

const defaultTransaksi = [
  { id: 't-1', tgl: '2026-08-01', jenis: 'masuk', keterangan: 'Iuran Bulanan Warga Blok A-D', nominal: 1500000 },
  { id: 't-2', tgl: '2026-08-05', jenis: 'keluar', keterangan: 'Pembelian Cat & Peralatan Kerja Bakti', nominal: 450000 },
  { id: 't-3', tgl: '2026-08-12', jenis: 'keluar', keterangan: 'Konsumsi Rapat Panitia Turnamen', nominal: 300000 },
];

const galeriFoto = [
  { id: 1, judul: "Lomba 17 Agustus", tgl: "Agustus 2026", kategori: "HUT RI", url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600" },
  { id: 2, judul: "Kerja Bakti Blok B", tgl: "Juli 2026", kategori: "Sosial", url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=600" },
  { id: 3, judul: "Malam Keakraban Pemuda", tgl: "Juni 2026", kategori: "Sosial", url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=600" },
  { id: 4, judul: "Laga Persahabatan Badminton", tgl: "Mei 2026", kategori: "Olahraga", url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=600" },
];

export default function TransparansiGaleri() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [katGaleri, setKatGaleri] = useState('Semua');
  const [showRincian, setShowRincian] = useState(false);

  useEffect(() => {
    const fetchKas = async () => {
      const { data, error } = await supabase
        .from('kas')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data && data.length > 0) {
        setTransaksiList(data);
      } else {
        setTransaksiList(defaultTransaksi);
      }
    };

    fetchKas();
  }, []);

  const totalMasuk = transaksiList.filter(t => t.jenis === 'masuk').reduce((acc, curr) => acc + Number(curr.nominal), 0);
  const totalKeluar = transaksiList.filter(t => t.jenis === 'keluar').reduce((acc, curr) => acc + Number(curr.nominal), 0);
  const saldoAkhir = totalMasuk - totalKeluar;

  const filteredGaleri = katGaleri === 'Semua' ? galeriFoto : galeriFoto.filter(f => f.kategori === katGaleri);

  return (
    <div className="bg-slate-50 border-t border-slate-200">
      
      <section id="transparansi" className="py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <span className="text-[#039088] font-semibold text-sm uppercase tracking-wider">Keterbukaan Informasi</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Laporan Kas Digital</h2>
            <p className="text-slate-600 text-sm mt-2">Klik kartu di bawah ini untuk melihat rincian mutasi kas secara lengkap.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            <div 
              onClick={() => setShowRincian(true)}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer relative group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Total Saldo Kas</span>
                <div className="p-2 bg-[#E6F4F3] text-[#039088] rounded-xl"><Wallet size={20} /></div>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900">Rp {saldoAkhir.toLocaleString('id-ID')}</h3>
              <p className="text-xs text-[#039088] font-bold mt-2 flex items-center gap-1">
                <Eye size={14} /> Klik untuk lihat rincian
              </p>
            </div>

            <div 
              onClick={() => setShowRincian(true)}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Total Pemasukan</span>
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl"><ArrowDownRight size={20} /></div>
              </div>
              <h3 className="text-3xl font-extrabold text-emerald-700">+ Rp {totalMasuk.toLocaleString('id-ID')}</h3>
              <p className="text-xs text-slate-500 mt-2">Iuran warga & donatur</p>
            </div>

            <div 
              onClick={() => setShowRincian(true)}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Total Pengeluaran</span>
                <div className="p-2 bg-rose-100 text-rose-700 rounded-xl"><ArrowUpRight size={20} /></div>
              </div>
              <h3 className="text-3xl font-extrabold text-rose-700">- Rp {totalKeluar.toLocaleString('id-ID')}</h3>
              <p className="text-xs text-slate-500 mt-2">Peralatan & operasional</p>
            </div>

          </div>
        </div>
      </section>

      <section id="galeri" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <span className="text-[#039088] font-semibold text-sm uppercase tracking-wider">Dokumentasi</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Galeri Kegiatan</h2>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['Semua', 'Sosial', 'Olahraga', 'HUT RI'].map((kat) => (
                <button
                  key={kat}
                  onClick={() => setKatGaleri(kat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${katGaleri === kat ? 'bg-[#039088] text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                >
                  {kat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredGaleri.map((foto) => (
              <div key={foto.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm group">
                <div className="h-60 overflow-hidden relative">
                  <img src={foto.url} alt={foto.judul} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#039088] rounded-md mb-1 inline-block">{foto.kategori}</span>
                    <h4 className="text-sm font-bold">{foto.judul}</h4>
                    <p className="text-[11px] text-slate-300">{foto.tgl}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showRincian && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8 max-h-[85vh] flex flex-col">
              <button onClick={() => setShowRincian(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"><X size={24}/></button>
              
              <span className="text-xs font-bold px-3 py-1 bg-[#E6F4F3] text-[#039088] rounded-full w-fit">Transparansi Publik</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2 mb-1">Rincian Transaksi Kas Karang Taruna</h3>
              <p className="text-slate-500 text-xs mb-6">Mutasi kas lengkap real-time verified oleh Pengurus.</p>

              <div className="overflow-y-auto flex-1 pr-1">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0">
                    <tr>
                      <th className="p-3 rounded-l-xl">Tanggal</th>
                      <th className="p-3">Keterangan</th>
                      <th className="p-3 text-right rounded-r-xl">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transaksiList.map((item) => (
                      <tr key={item.id}>
                        <td className="p-3 text-slate-500 text-xs">{item.tgl}</td>
                        <td className="p-3 font-medium text-slate-800">{item.keterangan}</td>
                        <td className={`p-3 text-right font-bold ${item.jenis === 'masuk' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {item.jenis === 'masuk' ? '+' : '-'} Rp {Number(item.nominal).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t border-slate-200 mt-4 flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                <span className="text-xs font-bold text-slate-600">Saldo Akhir Kas saat ini:</span>
                <span className="text-lg font-extrabold text-[#039088]">Rp {saldoAkhir.toLocaleString('id-ID')}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}