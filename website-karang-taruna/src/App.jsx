import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FiturWarga from './components/FiturWarga';
import Umkm from './components/Umkm';
import TransparansiGaleri from './components/TransparansiGaleri';
import Pengurus from './components/Pengurus';
import Admin from './pages/Admin';
import { supabase } from './supabaseClient';
import { 
  Users, 
  MapPin, 
  Calendar, 
  X, 
  Send, 
  ChevronDown, 
  ArrowRight, 
  CheckCircle, 
  MessageCircle, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

const heroPhotos = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1200"
];

const stats = [
  { angka: "150+", label: "Pemuda Terdaftar" },
  { angka: "12+", label: "Program / Tahun" },
  { angka: "100%", label: "Kas Transparan" },
  { angka: "20+", label: "UMKM Terdaftar" }
];

const agenda = [
  { id: 1, judul: "Kerja Bakti Masal & Penghijauan", tgl: "10 SEPT 2026", lokasi: "Lapangan Utama & Taman Blok A", img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800" },
  { id: 2, judul: "Turnamen Bulutangkis Antar RT", tgl: "20 SEPT 2026", lokasi: "Lapangan Serbaguna Perumahan", img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800" }
];

const faqs = [
  { q: "Siapa saja yang boleh bergabung dengan Karang Taruna?", a: "Seluruh pemuda dan pemudi warga Pakal Residence berusia 15 hingga 30 tahun." },
  { q: "Apakah mendaftarkan UMKM di website ini dipungut biaya?", a: "Sama sekali tidak (100% Gratis). Ini adalah program pemberdayaan ekonomi dari pengurus untuk warga." },
  { q: "Bagaimana cara mengecek laporan saldo kas keuangan?", a: "Laporan kas dapat dilihat secara terbuka pada seksi Transparansi Kas di website ini, diupdate secara berkala oleh Bendahara." },
  { q: "Bagaimana jika saya ingin mengajukan usulan acara baru?", a: "Kamu bisa menghubungi pengurus via tombol WhatsApp Aspirasi di bagian paling bawah website." }
];

export default function App() {
  const [isAdminPage, setIsAdminPage] = useState(false);
  const [isDaftarOpen, setIsDaftarOpen] = useState(false);
  const [isDaftarUmkmOpen, setIsDaftarUmkmOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#adminperumahan') {
        setIsAdminPage(true);
      } else {
        setIsAdminPage(false);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Submit Pendaftaran Anggota Baru ke Supabase
  const handleSubmitDaftarAnggota = async (e) => {
    e.preventDefault();
    const nama = e.target.nama.value;
    const blok = e.target.blok.value;
    const umur = Number(e.target.umur.value);
    const minat = e.target.minat.value;

    const { error } = await supabase.from('pendaftar').insert([
      { nama, blok, umur, minat, status: 'Pending' }
    ]);

    if (error) {
      alert('Gagal mengirim pendaftaran: ' + error.message);
    } else {
      alert('Pendaftaran berhasil terkirim! Silakan tunggu verifikasi admin.');
      setIsDaftarOpen(false);
    }
  };

  // Submit Pendaftaran UMKM ke Supabase
  const handleSubmitDaftarUmkm = async (e) => {
    e.preventDefault();
    const nama = e.target.nama.value;
    const kategori = e.target.kategori.value;
    const wa = e.target.wa.value;
    const deskripsi = e.target.deskripsi.value;
    const fileFoto = e.target.fotoFile.files[0];

    const saveToSupabase = async (fotoUrl) => {
      const newUmkm = {
        nama,
        kategori,
        wa,
        deskripsi,
        foto: fotoUrl || "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=400",
        status: 'Pending'
      };

      const { error } = await supabase.from('umkm').insert([newUmkm]);

      if (error) {
        alert('Gagal mengirim pendaftaran UMKM: ' + error.message);
      } else {
        alert('Pendaftaran UMKM berhasil dikirim! Menunggu verifikasi admin.');
        setIsDaftarUmkmOpen(false);
      }
    };

    if (fileFoto) {
      const reader = new FileReader();
      reader.onloadend = () => saveToSupabase(reader.result);
      reader.readAsDataURL(fileFoto);
    } else {
      await saveToSupabase(null);
    }
  };

  if (isAdminPage) {
    return <Admin onLogout={() => { window.location.hash = ''; setIsAdminPage(false); }} />;
  }

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      
      {/* NAVBAR */}
      <Navbar onOpenDaftar={() => setIsDaftarOpen(true)} />

      {/* HERO BANNER - MODERN CORPORATE OVERLAY */}
      <section id="beranda" className="pt-6 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative min-h-[480px] sm:min-h-[520px] rounded-3xl overflow-hidden bg-slate-900 flex items-center p-8 sm:p-14 border border-slate-200 shadow-xs">
          <img 
            src={heroPhotos[0]} 
            alt="Pemuda Pakal Residence" 
            className="absolute inset-0 w-full h-full object-cover opacity-35" 
          />
          <div className="relative z-10 max-w-2xl text-white">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold mb-6">
              <Sparkles size={14} className="text-amber-400" /> Official Website Warga
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Gerakan Pemuda Pakal Residence
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-8 max-w-xl font-normal">
              Wadahnya generasi muda untuk berkolaborasi, mengelola kegiatan sosial, mempublikasikan kas terbuka, serta memberdayakan ekonomi warga perumahan.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setIsDaftarOpen(true)}
                className="bg-white hover:bg-slate-100 text-slate-900 px-7 py-3.5 rounded-full text-xs font-bold transition flex items-center gap-2 shadow-sm"
              >
                Gabung Anggota <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TENTANG & STATS */}
      <section id="tentang" className="py-12 bg-[#F4F4F5] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-6 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Tentang Karang Taruna
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Karang Taruna Pakal Residence berdiri sebagai sarana pengembangan generasi muda yang berkarakter, mandiri, dan berjiwa sosial. Kami secara aktif menyelenggarakan kegiatan gotong royong, olahraga, keagamaan, serta menjadi wadah promosi UMKM lokal perumahan.
              </p>
            </div>
            
            <div className="md:col-span-6 grid grid-cols-2 gap-4">
              {stats.map((st, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200">
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{st.angka}</div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">{st.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DUA KARTU PILAR LAYANAN WARGA */}
      <FiturWarga />

      {/* SEKSI VISI & MISI */}
      <section id="visi-misi" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase block mb-1">Pilar Organisasi</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Visi & Misi Kami</h2>
            <p className="text-slate-500 text-sm mt-1">Arah gerak dan komitmen Karang Taruna Pakal Residence untuk kemajuan perumahan.</p>
          </div>

          <div className="grid md:grid-cols-12 gap-10 items-stretch">
            
            {/* Foto Kiri Melengkung (Teks Rata Tengah / Perfectly Centered) */}
            <div className="md:col-span-5 min-h-[380px] rounded-3xl overflow-hidden bg-slate-900 relative border border-slate-200">
              <img 
                src={heroPhotos[1]} 
                alt="Kebersamaan Karang Taruna Pakal Residence" 
                className="w-full h-full object-cover opacity-60" 
              />
              {/* Overlay Gelap Rata Tengah */}
              <div className="absolute inset-0 bg-slate-950/40 p-8 flex flex-col justify-center items-center text-center text-white">
                <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-400 mb-2 px-3 py-1 bg-emerald-950/50 rounded-full border border-emerald-500/30">
                  Visi Utama
                </span>
                <p className="text-lg sm:text-xl font-bold leading-relaxed max-w-sm">
                  "Mewujudkan Generasi Muda Pakal Residence yang Mandiri, Solid, Kreatif, dan Bermanfaat bagi Lingkungan Warga."
                </p>
              </div>
            </div>

            {/* List Kanan Berikon Lingkaran Hitam (Misi Organisasi) */}
            <div className="md:col-span-7 flex flex-col justify-center space-y-6">
              
              <div className="flex gap-4 items-start pb-5 border-b border-slate-200">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  01
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Mempererat Silaturahmi & Solidaritas Pemuda</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    Membangun wadah komunikasi yang positif dan inklusif bagi seluruh pemuda/i di setiap blok perumahan Pakal Residence.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start pb-5 border-b border-slate-200">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  02
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Pemberdayaan Ekonomi & UMKM Lokal</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    Mendukung perkembangan usaha mikro milik warga perumahan melalui media promosi digital yang terintegrasi dan gratis.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start pb-5 border-b border-slate-200">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  03
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Transparansi Keuangan & Tata Kelola Organisasi</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    Menjaga kepercayaan warga dengan menyajikan laporan mutasi kas secara terbuka, akuntabel, dan dapat diakses kapan saja.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  04
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Kepedulian Sosial & Tanggap Lingkungan</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    Menggalakkan aksi gotong royong rutin, kegiatan olahraga warga, serta penanganan masalah sosial di lingkungan perumahan.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* AGENDA & KEGIATAN */}
      <section id="agenda" className="py-16 bg-[#F4F4F5] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Agenda & Kegiatan</h2>
            <p className="text-slate-500 text-sm mt-1">Jadwal program kerja dan kegiatan rutin warga mendatang.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {agenda.map((ag) => (
              <div key={ag.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-slate-400 transition">
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  <img src={ag.img} alt={ag.judul} className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-bold rounded-full">
                    {ag.tgl}
                  </span>
                </div>
                <div className="p-6 flex justify-between items-end">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{ag.judul}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin size={13} /> {ag.lokasi}
                    </p>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 hover:bg-slate-800 transition">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KATALOG UMKM TETANGGA */}
      <Umkm onOpenDaftarUmkm={() => setIsDaftarUmkmOpen(true)} />

      {/* TRANSPARANSI KAS & GALERI */}
      <TransparansiGaleri />

      {/* PENGURUS & ANGGOTA TERVERIFIKASI */}
      <Pengurus />

      {/* FAQ / PERTANYAAN UMUM */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Pertanyaan Umum</h2>
            <p className="text-slate-500 text-sm mt-1">Informasi penting seputar partisipasi warga dan karang taruna.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#F4F4F5] rounded-2xl border border-slate-200 overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 text-sm flex justify-between items-center gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOKASI & FOOTER */}
      <footer id="lokasi" className="bg-slate-900 text-white pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
            
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-slate-900 flex items-center justify-center font-bold text-sm">
                  K
                </div>
                <div>
                  <span className="block text-sm font-bold tracking-tight">KARANG TARUNA</span>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider">PAKAL RESIDENCE</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Wadah resmi pemuda perumahan Pakal Residence untuk memajukan lingkungan, transparan dalam keuangan, dan saling mendukung UMKM tetangga.
              </p>
            </div>

            <div className="md:col-span-3 space-y-2 text-xs text-slate-400">
              <h4 className="font-bold text-white text-sm mb-3">Navigasi Cepat</h4>
              <a href="#beranda" className="block hover:text-white">Beranda</a>
              <a href="#visi-misi" className="block hover:text-white">Visi & Misi</a>
              <a href="#agenda" className="block hover:text-white">Agenda Kegiatan</a>
              <a href="#umkm" className="block hover:text-white">Katalog UMKM</a>
              <a href="#transparansi" className="block hover:text-white">Laporan Kas</a>
            </div>

            <div className="md:col-span-4 space-y-3">
              <h4 className="font-bold text-white text-sm mb-3">Aspirasi & Sekretariat</h4>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <MapPin size={14} className="shrink-0" /> Balai RW Pakal Residence, Surabaya, Jawa Timur
              </p>
              <a 
                href="https://wa.me/6285739439137?text=Halo%20Pengurus%20Karang%20Taruna%20Pakal%20Residence,%20saya%20ingin%20menyampaikan%20aspirasi."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition mt-2"
              >
                <MessageCircle size={15} /> Kirim WhatsApp Aspirasi
              </a>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 gap-4">
            <p>© 2026 Karang Taruna Pakal Residence. All rights reserved.</p>
            <a href="#adminperumahan" className="hover:text-slate-300 transition">
              Portal Khusus Admin
            </a>
          </div>
        </div>
      </footer>

      {/* MODAL 1: DAFTAR ANGGOTA PEMUDA */}
      {isDaftarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setIsDaftarOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">Gabung Pemuda Karang Taruna</h3>
            <p className="text-xs text-slate-500 mb-6">Isi formulir untuk mendaftar sebagai anggota resmi.</p>

            <form onSubmit={handleSubmitDaftarAnggota} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Lengkap</label>
                <input name="nama" required type="text" placeholder="Contoh: Ahmad Rizky" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-slate-900" />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Blok Rumah</label>
                <input name="blok" required type="text" placeholder="Contoh: Blok C No 12" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-slate-900" />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Usia (Tahun)</label>
                <input name="umur" required type="number" placeholder="Contoh: 19" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-slate-900" />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Minat / Keahlian</label>
                <select name="minat" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-slate-900">
                  <option value="Humas & Medsos">Humas & Medsos</option>
                  <option value="Olahraga & Seni">Olahraga & Seni</option>
                  <option value="Kewirausahaan">Kewirausahaan</option>
                  <option value="Keagamaan & Sosial">Keagamaan & Sosial</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-full text-xs transition flex items-center justify-center gap-2 mt-2">
                <Send size={14} /> Kirim Pendaftaran Anggota
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DAFTAR KATALOG UMKM */}
      {isDaftarUmkmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setIsDaftarUmkmOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">Daftarkan Usaha Tetangga</h3>
            <p className="text-xs text-slate-500 mb-6">Promosi gratis untuk UMKM milik warga perumahan.</p>

            <form onSubmit={handleSubmitDaftarUmkm} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Usaha / Produk</label>
                <input name="nama" required type="text" placeholder="Contoh: Dapur Mbak Ani" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-slate-900" />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Kategori</label>
                <select name="kategori" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-slate-900">
                  <option value="Kuliner">Kuliner</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Jasa">Jasa</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Nomor WhatsApp (Aktif)</label>
                <input name="wa" required type="text" placeholder="Contoh: 628123456789" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-slate-900" />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Deskripsi Singkat</label>
                <textarea name="deskripsi" required rows={2} placeholder="Jelaskan produk atau jasa yang ditawarkan..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-slate-900" />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Foto Produk / Banner (Opsional)</label>
                <input name="fotoFile" type="file" accept="image/*" className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-100 file:text-slate-900 file:font-bold hover:file:bg-slate-200 cursor-pointer" />
              </div>

              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-full text-xs transition flex items-center justify-center gap-2 mt-2">
                <Send size={14} /> Kirimkan Usaha ke Supabase
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}