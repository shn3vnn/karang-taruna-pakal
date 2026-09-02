import { useState } from 'react';
import Navbar from './components/Navbar';
import Pengurus from './components/Pengurus';
import FiturWarga from './components/FiturWarga';
import Umkm from './components/Umkm';
import TransparansiGaleri from './components/TransparansiGaleri';
import Admin from './pages/Admin';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabaseClient';
import { BrowserRouter } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Send, 
  Calendar as CalendarIcon, 
  UserPlus, 
  X, 
  Info, 
  UserCheck, 
  ChevronDown, 
  Bell, 
  Store, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Users,
  Building2,
  HeartHandshake
} from 'lucide-react';

// Gambar Suasana Kegiatan
const heroPhotos = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600"
];

const agendaList = [
  {
    id: 1,
    judul: "Kerja Bakti Masal & Penghijauan Lingkungan",
    kategori: "Sosial & Lingkungan",
    tglHari: "10",
    tglBulan: "SEPT",
    tahun: "2026",
    jam: "07:00 WIB - Selesai",
    lokasi: "Lapangan Utama & Taman Blok A",
    deskripsiRingkas: "Pembersihan saluran air, perbaikan fasilitas umum, dan penanaman 50 bibit pohon buah.",
    deskripsiLengkap: "Kegiatan gotong royong rutin untuk seluruh warga perumahan Pakal Residence. Diharapkan setiap rumah mengirimkan perwakilannya. Karang Taruna menyediakan konsumsi dan peralatan kebersihan pendukung.",
    panitia: [
      { peran: "Ketua Pelaksana", nama: "Budi Santoso" },
      { peran: "Koordinator Lapangan", nama: "Ahmad Rifai" },
      { peran: "Konsumsi & Logistik", nama: "Dina Mariana" }
    ],
    waPJ: "6285739439137"
  },
  {
    id: 2,
    judul: "Turnamen Bulutangkis Persahabatan Antar RT",
    kategori: "Olahraga Warga",
    tglHari: "20",
    tglBulan: "SEPT",
    tahun: "2026",
    jam: "18:30 WIB - Selesai",
    lokasi: "Lapangan Serbaguna Perumahan",
    deskripsiRingkas: "Kompetisi ganda putra & putri warga perumahan memperebutkan Piala Bergilir Karang Taruna.",
    deskripsiLengkap: "Turnamen ramah terbuka untuk warga usia 15 tahun ke atas. Sistem pertandingan menggunakan piala bergilir Karang Taruna dengan hadiah menarik untuk Juara 1, 2, dan 3.",
    panitia: [
      { peran: "Ketua Pelaksana", nama: "Siti Rahma" },
      { peran: "Wasit Utama", nama: "Rizky Pratama" },
      { peran: "Pendaftaran & Bantuan", nama: "Dewi Lestari" }
    ],
    waPJ: "6285739439137"
  }
];

const faqList = [
  { q: "Siapa saja yang boleh bergabung menjadi anggota Karang Taruna?", a: "Seluruh pemuda dan pemudi warga perumahan Pakal Residence berusia 15 hingga 30 tahun dapat bergabung menjadi anggota aktif Karang Taruna." },
  { q: "Bagaimana cara mendaftarkan usaha saya ke Katalog UMKM Tetangga?", a: "Kamu bisa menekan tombol '+ Daftarkan Usaha' di bagian Katalog UMKM untuk mengisi formulir pendaftaran secara gratis." },
  { q: "Apakah laporan keuangan kas Karang Taruna diupdate berkala?", a: "Ya, rekapitulasi kas masuk dan keluar selalu diperbarui setiap bulan dan dapat diakses secara terbuka melalui seksi Transparansi di website ini." }
];

export default function App() {
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [isDaftarOpen, setIsDaftarOpen] = useState(false);
  const [isDaftarUmkmOpen, setIsDaftarUmkmOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const noPengurus = "6285739439137";

  // LOGIC ROUTING ADMIN UNTUK DIBUNGKUS BROWSERROUTER
  if (isAdminLoggedIn) {
    return (
      <BrowserRouter>
        <Admin onLogout={() => setIsAdminLoggedIn(false)} />
      </BrowserRouter>
    );
  }

  const handleSubmitAspirasi = (e) => {
    e.preventDefault();
    const nama = e.target.nama.value;
    const wa = e.target.wa.value;
    const pesan = e.target.pesan.value;
    const textPesan = encodeURIComponent(`Halo Admin Karang Taruna,\n\nSaya ingin menyampaikan aspirasi:\n- Nama / Blok: ${nama}\n- No. WA: ${wa || '-'}\n- Pesan: ${pesan}`);
    window.location.href = `whatsapp://send?phone=${noPengurus}&text=${textPesan}`;
  };

  const handleSubmitDaftar = async (e) => {
    e.preventDefault();
    const nama = e.target.nama.value;
    const blok = e.target.blok.value;
    const umur = Number(e.target.umur.value);
    const minat = e.target.minat.value;

    const { error } = await supabase
      .from('pendaftar')
      .insert([{ nama, blok, umur, minat, status: 'Pending' }]);

    if (error) {
      alert('Gagal mengirim pendaftaran: ' + error.message);
    } else {
      alert('Pendaftaran berhasil dikirim! Menunggu verifikasi admin.');
      setIsDaftarOpen(false);
    }
  };

  const handleSubmitDaftarUmkm = (e) => {
    e.preventDefault();
    const nama = e.target.nama.value;
    const kategori = e.target.kategori.value;
    const wa = e.target.wa.value;
    const deskripsi = e.target.deskripsi.value;
    const fileFoto = e.target.fotoFile.files[0];

    const processSave = (fotoUrl) => {
      const currentUmkm = JSON.parse(localStorage.getItem('umkm_karta')) || [];
      const newUmkm = {
        id: Date.now(),
        nama,
        kategori,
        wa,
        deskripsi,
        foto: fotoUrl || "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=400",
        status: 'Pending'
      };

      localStorage.setItem('umkm_karta', JSON.stringify([...currentUmkm, newUmkm]));
      alert('Pendaftaran UMKM berhasil dikirim! Menunggu verifikasi admin.');
      setIsDaftarUmkmOpen(false);
    };

    if (fileFoto) {
      const reader = new FileReader();
      reader.onloadend = () => processSave(reader.result);
      reader.readAsDataURL(fileFoto);
    } else {
      processSave(null);
    }
  };

  const handleDaftarKegiatan = (agenda) => {
    const textKegiatan = encodeURIComponent(`Halo Kak ${agenda.panitia[0].nama}, saya berminat untuk mendaftar / berpartisipasi dalam kegiatan:\n\n📌 *${agenda.judul}*\n🗓 Tanggal: ${agenda.tglHari} ${agenda.tglBulan} ${agenda.tahun}\n📍 Lokasi: ${agenda.lokasi}\n\nMohon informasi petunjuk selanjutnya. Terima kasih!`);
    window.location.href = `whatsapp://send?phone=${agenda.waPJ}&text=${textKegiatan}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-['Plus_Jakarta_Sans',_sans-serif] antialiased selection:bg-[#0F766E] selection:text-white">
      
      {/* 1. RUNNING BANNER ANNOUNCEMENT */}
      <div className="bg-[#0F766E] text-white text-xs sm:text-sm font-medium py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 text-center">
          <Bell size={15} className="shrink-0 text-[#F59E0B]" />
          <span className="leading-snug">
            <span className="font-bold text-[#CCFBF1]">Pengumuman —</span> Kerja Bakti Masal dilaksanakan Minggu, 10 September 2026 pukul 07:00 WIB. Mari hadir bersama.
          </span>
        </div>
      </div>

      {/* 2. NAVBAR */}
      <Navbar onOpenDaftar={() => setIsDaftarOpen(true)} />

      {/* 3. HERO SECTION */}
      <section id="beranda" className="relative pt-10 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Soft ambient accent, kept subtle per no-overdesign rule */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#CCFBF1] opacity-40 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Teks Hero */}
            <div className="md:col-span-7 space-y-7 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white text-[#0F766E] rounded-full text-xs sm:text-sm font-semibold border border-[#0F766E]/15 shadow-sm">
                <Sparkles size={15} />
                <span>Komunitas Pemuda Resmi Pakal Residence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
                Membangun lingkungan yang aktif, solid, dan harmonis — bersama.
              </h1>

              <p className="text-[#475569] text-base sm:text-lg leading-relaxed max-w-xl">
                Karang Taruna hadir sebagai wadah generasi muda Pakal Residence untuk berkolaborasi, berkarya, memajukan UMKM warga, dan menjaga keharmonisan lingkungan secara transparan.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-1">
                <a 
                  href="#agenda" 
                  className="inline-flex items-center gap-2 bg-[#0F766E] hover:bg-[#115E59] text-white px-6 py-3.5 rounded-[14px] font-semibold text-sm sm:text-base transition-colors duration-200 shadow-sm"
                >
                  Lihat Kegiatan <ArrowRight size={18} />
                </a>
                <button 
                  onClick={() => setIsDaftarOpen(true)} 
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] px-6 py-3.5 rounded-[14px] font-semibold text-sm sm:text-base transition-colors duration-200"
                >
                  <UserPlus size={18} className="text-[#0F766E]" /> Gabung Pemuda
                </button>
              </div>

              {/* Value Props */}
              <div className="flex flex-wrap gap-x-8 gap-y-3 pt-6 border-t border-[#E2E8F0] text-sm font-medium text-[#475569]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-[#0F766E] shrink-0" />
                  <span>Transparansi kas digital</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-[#0F766E] shrink-0" />
                  <span>Katalog UMKM warga</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-[#0F766E] shrink-0" />
                  <span>Terbuka untuk pemuda</span>
                </div>
              </div>
            </div>

            {/* Gambar Hero Presentation */}
            <div className="md:col-span-5 relative order-first md:order-last">
              <div className="relative mx-auto max-w-md md:max-w-none">
                <div className="bg-white p-3 rounded-[28px] border border-[#E2E8F0] shadow-lg relative z-10">
                  <img 
                    src={heroPhotos[0]} 
                    alt="Kegiatan Karang Taruna" 
                    className="w-full h-64 sm:h-[22rem] object-cover rounded-[20px]" 
                  />
                  <div className="mt-3 flex items-center justify-between px-2 pb-1">
                    <div>
                      <h4 className="font-bold text-[#0F172A] text-sm sm:text-base">Kegiatan Rutin Pemuda</h4>
                      <p className="text-xs text-[#64748B]">Pakal Residence, Surabaya</p>
                    </div>
                    <span className="px-3 py-1 bg-[#CCFBF1] text-[#0F766E] text-xs font-bold rounded-full">
                      Aktif
                    </span>
                  </div>
                </div>

                {/* Accent Floating Badge */}
                <div className="absolute -bottom-6 -left-4 sm:-left-7 bg-white p-3.5 rounded-[18px] border border-[#E2E8F0] shadow-md flex items-center gap-3 z-20">
                  <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
                    <HeartHandshake size={20} />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#64748B] font-medium">Semangat warga</div>
                    <div className="text-sm font-extrabold text-[#0F172A]">Guyub & rukun</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SECTION FITUR KAS & STATISTIK WARGA */}
      <FiturWarga />

      {/* 5. SECTION AGENDA & KEGIATAN */}
      <section id="agenda" className="py-20 sm:py-28 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <div className="space-y-3">
              <span className="text-[#0F766E] font-bold text-xs uppercase tracking-wider bg-[#CCFBF1] px-3 py-1 rounded-full">
                Jadwal mendatang
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">Agenda & kegiatan warga</h2>
            </div>
            <p className="text-[#64748B] text-sm sm:text-base max-w-md">
              Ikuti berbagai kegiatan sosial, kebersihan, dan olahraga rutin di lingkungan perumahan kita.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {agendaList.map((item) => (
              <div 
                key={item.id} 
                className="group bg-white rounded-[22px] border border-[#E2E8F0] p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4 mb-5">
                    {/* Date Card Presentation */}
                    <div className="bg-[#0F172A] text-white rounded-[14px] p-3 text-center min-w-[64px] shrink-0">
                      <span className="block text-xl font-black leading-none">{item.tglHari}</span>
                      <span className="block text-[10px] font-bold uppercase tracking-wider mt-1 text-[#CCFBF1]">{item.tglBulan}</span>
                    </div>

                    <div className="pt-0.5">
                      <span className="inline-block text-[11px] font-bold px-2.5 py-1 bg-[#CCFBF1] text-[#0F766E] rounded-full mb-2">
                        {item.kategori}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] leading-snug">{item.judul}</h3>
                    </div>
                  </div>

                  <p className="text-[#475569] text-sm sm:text-base leading-relaxed mb-6">
                    {item.deskripsiRingkas}
                  </p>
                </div>

                <div className="pt-5 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#64748B]">
                    <MapPin size={16} className="text-[#0F766E] shrink-0" />
                    <span>{item.lokasi}</span>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedAgenda(item)}
                    className="inline-flex items-center gap-1.5 bg-[#0F766E] group-hover:bg-[#115E59] text-white px-4 py-2.5 rounded-[12px] text-xs font-bold transition-colors"
                  >
                    Detail & Daftar <Info size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. SECTION KATALOG UMKM TETANGGA */}
      <Umkm onOpenDaftarUmkm={() => setIsDaftarUmkmOpen(true)} />

      {/* 7. SECTION TRANSPARANSI KAS & GALERI */}
      <TransparansiGaleri />

      {/* 8. SECTION STRUKTUR PENGURUS */}
      <Pengurus />

      {/* 9. SECTION FAQ - TANYA JAWAB */}
      <section className="py-20 sm:py-28 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-[#0F766E] font-bold text-xs uppercase tracking-wider bg-[#CCFBF1] px-3 py-1 rounded-full">
              Tanya jawab
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">Pertanyaan yang sering diajukan</h2>
          </div>

          <div className="space-y-3">
            {faqList.map((faq, idx) => (
              <div key={idx} className="border border-[#E2E8F0] rounded-[16px] overflow-hidden bg-[#F8FAFC]">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-[#0F172A] flex justify-between items-center gap-4 text-sm sm:text-base hover:bg-[#F1F5F9] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className={`text-[#0F766E] shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-[#475569] border-t border-[#E2E8F0] pt-4 leading-relaxed bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. SECTION MAP / PETA SEKRETARIAT */}
      <section id="lokasi" className="py-20 sm:py-28 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            <div className="md:col-span-5 space-y-5">
              <span className="text-[#0F766E] font-bold text-xs uppercase tracking-wider bg-[#CCFBF1] px-3 py-1 rounded-full">
                Peta lokasi
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">Sekretariat Karang Taruna</h2>
              <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
                Pusat kegiatan dan balai serbaguna warga perumahan Pakal Residence. Terbuka untuk diskusi, kegiatan rutin, atau koordinasi antarwarga.
              </p>
              
              <div className="pt-2 text-sm text-[#0F172A] space-y-3">
                <div className="flex items-center gap-3 font-semibold p-3.5 bg-white rounded-[14px] border border-[#E2E8F0]">
                  <MapPin size={18} className="text-[#0F766E] shrink-0" />
                  <span>Pakal Residence, Pakal, Surabaya</span>
                </div>
                <div className="flex items-center gap-3 font-semibold p-3.5 bg-white rounded-[14px] border border-[#E2E8F0]">
                  <Clock size={18} className="text-[#0F766E] shrink-0" />
                  <span>Buka setiap Sabtu & Minggu, 16.00–21.00 WIB</span>
                </div>
              </div>
            </div>

            {/* Container Map Redesign */}
            <div className="md:col-span-7 h-80 sm:h-[26rem] rounded-[24px] overflow-hidden border border-[#E2E8F0] shadow-sm bg-white p-2">
              <iframe 
                title="Peta Lokasi Karang Taruna Pakal Residence"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15832.062823055416!2d112.6080!3d-7.2380!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f3f1e1a2b3c4%3A0x123456789abcdef!2sPakal%20Residence!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                className="rounded-[16px]"
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            </div>

          </div>
        </div>
      </section>

      {/* 11. SECTION ASPIRASI WARGA */}
      <section id="kontak" className="py-20 sm:py-28 bg-[#0F172A] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-[#F59E0B] font-bold text-xs uppercase tracking-wider bg-[#F59E0B]/10 px-3 py-1 rounded-full border border-[#F59E0B]/20">
            Ruang komunikasi
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 mt-4">Suara & aspirasi warga</h2>
          <p className="text-[#94A3B8] text-sm sm:text-base mb-10">
            Punya saran, aduan, atau ide kegiatan untuk Karang Taruna? Tuliskan pesanmu di bawah ini.
          </p>

          <form className="space-y-4 text-left bg-white/[0.04] p-6 sm:p-8 rounded-[22px] border border-white/10" onSubmit={handleSubmitAspirasi}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Lengkap / Blok *</label>
                <input 
                  name="nama" 
                  type="text" 
                  required 
                  placeholder="Contoh: Budi (Blok A-12)" 
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-[12px] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/30 transition-colors" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">No. WhatsApp (Opsional)</label>
                <input 
                  name="wa" 
                  type="text" 
                  placeholder="08123456789" 
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-[12px] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/30 transition-colors" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pesan Aspirasi / Ide Kegiatan *</label>
              <textarea 
                name="pesan" 
                required 
                rows="4" 
                placeholder="Tuliskan saran atau ide kegiatanmu di sini..." 
                className="w-full bg-slate-900/60 border border-slate-700 rounded-[12px] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/30 transition-colors"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-base py-3.5 rounded-[12px] transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Kirim Pesan Warga <Send size={18} />
            </button>
          </form>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="bg-slate-950 text-[#64748B] py-9 text-center text-sm border-t border-slate-900 flex flex-col items-center justify-center gap-2.5">
        <p>© 2026 Karang Taruna Pakal Residence • Surabaya.</p>
        <button 
          onClick={() => {
            const pass = prompt('Masukkan Kata Sandi Admin:');
            if (pass === 'adminperumahan') {
              setIsAdminLoggedIn(true);
            } else if (pass) {
              alert('Kata sandi salah!');
            }
          }} 
          className="text-xs text-[#64748B] hover:text-slate-300 transition-colors underline underline-offset-2 flex items-center gap-1.5"
        >
          <ShieldCheck size={14} /> Akses Panel Admin Pengurus
        </button>
      </footer>

      {/* MODAL DETAIL AGENDA */}
      <AnimatePresence>
        {selectedAgenda && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 8 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.96, y: 8 }} 
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[24px] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8"
            >
              <button onClick={() => setSelectedAgenda(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20}/>
              </button>
              
              <span className="text-xs font-bold px-2.5 py-1 bg-[#CCFBF1] text-[#0F766E] rounded-full">{selectedAgenda.kategori}</span>
              <h3 className="text-2xl font-extrabold text-[#0F172A] mt-3 mb-2 pr-8">{selectedAgenda.judul}</h3>
              <p className="text-[#475569] text-sm leading-relaxed mb-5">{selectedAgenda.deskripsiLengkap}</p>
              
              <div className="space-y-2.5 text-sm text-[#0F172A] bg-[#F8FAFC] p-4 rounded-[16px] border border-[#E2E8F0] mb-5">
                <p className="flex items-start gap-2"><CalendarIcon size={16} className="text-[#0F766E] shrink-0 mt-0.5" /><span><strong>{selectedAgenda.tglHari} {selectedAgenda.tglBulan} {selectedAgenda.tahun}</strong> · {selectedAgenda.jam}</span></p>
                <p className="flex items-start gap-2"><MapPin size={16} className="text-[#0F766E] shrink-0 mt-0.5" /><span>{selectedAgenda.lokasi}</span></p>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2.5">Susunan panitia acara</h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedAgenda.panitia.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#F1F5F9] px-4 py-2.5 rounded-[10px] text-sm">
                      <span className="text-[#64748B] font-medium">{p.peran}</span>
                      <span className="text-[#0F172A] font-bold">{p.nama}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => handleDaftarKegiatan(selectedAgenda)}
                  className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-bold py-3.5 rounded-[12px] transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <UserCheck size={18} /> Daftar Peserta / Voluntir Acara Ini
                </button>
                <button 
                  onClick={() => setSelectedAgenda(null)} 
                  className="w-full bg-[#F1F5F9] text-[#475569] font-bold py-2.5 rounded-[12px] text-xs hover:bg-[#E2E8F0] transition-colors"
                >
                  Tutup
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DAFTAR ANGGOTA */}
      <AnimatePresence>
        {isDaftarOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 8 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.96, y: 8 }} 
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[24px] p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              <button onClick={() => setIsDaftarOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20}/>
              </button>
              <span className="text-[#0F766E] font-semibold text-xs uppercase tracking-wider">Gabung pemuda</span>
              <h3 className="text-2xl font-extrabold text-[#0F172A] mt-1 mb-2 pr-8">Form pendaftaran anggota</h3>
              <p className="text-[#64748B] text-xs mb-6">Khusus pemuda/i perumahan usia 15–30 tahun.</p>

              <form className="space-y-3" onSubmit={handleSubmitDaftar}>
                <input name="nama" type="text" required placeholder="Nama Lengkap" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-colors" />
                <input name="blok" type="text" required placeholder="Blok / Nomor Rumah" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-colors" />
                <input name="umur" type="number" required placeholder="Usia (Tahun)" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-colors" />
                <select name="minat" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-colors">
                  <option value="Humas & Medsos">Divisi Humas & Medsos</option>
                  <option value="Olahraga & Seni">Divisi Olahraga & Seni</option>
                  <option value="Lingkungan & Sosial">Divisi Lingkungan & Sosial</option>
                  <option value="Relawan Acara">Relawan Acara</option>
                </select>
                <button type="submit" className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-bold py-3.5 rounded-[12px] transition-colors flex items-center justify-center gap-2 text-sm mt-2">
                  Kirim Pendaftaran <UserPlus size={16} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DAFTAR UMKM WARGA */}
      <AnimatePresence>
        {isDaftarUmkmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 8 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.96, y: 8 }} 
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[24px] p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              <button onClick={() => setIsDaftarUmkmOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20}/>
              </button>
              <span className="text-[#0F766E] font-semibold text-xs uppercase tracking-wider">Ekonomi warga</span>
              <h3 className="text-2xl font-extrabold text-[#0F172A] mt-1 mb-2 pr-8">Form pendaftaran UMKM</h3>
              <p className="text-[#64748B] text-xs mb-6">Promosikan produk / jasa kamu ke seluruh warga perumahan, gratis.</p>

              <form className="space-y-3" onSubmit={handleSubmitDaftarUmkm}>
                <input name="nama" type="text" required placeholder="Nama Toko / Usaha" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-colors" />
                <select name="kategori" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-colors">
                  <option value="Kuliner">Kuliner</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Jasa">Jasa</option>
                </select>
                <input name="wa" type="text" required placeholder="No. WA Penjual (Contoh: 6281234...)" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-colors" />
                <textarea name="deskripsi" required rows="3" placeholder="Deskripsi singkat produk/jasa..." className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-colors"></textarea>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#64748B]">Foto Produk / Usaha (Opsional):</label>
                  <input name="fotoFile" type="file" accept="image/*" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-3 py-2.5 text-xs focus:outline-none focus:border-[#0F766E] transition-colors" />
                </div>
                
                <button type="submit" className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-bold py-3.5 rounded-[12px] transition-colors flex items-center justify-center gap-2 text-sm mt-2">
                  Daftarkan Usaha <Store size={16} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}