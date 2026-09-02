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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#0F766E] selection:text-white">
      
      {/* 1. RUNNING BANNER ANNOUNCEMENT */}
      <div className="bg-[#0F766E] text-white text-xs sm:text-sm font-medium py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
          <Bell size={15} className="shrink-0 text-[#F59E0B] animate-pulse" />
          <span>
            <strong className="font-bold text-[#CCFBF1]">Pengumuman:</strong> Kerja Bakti Masal akan dilaksanakan Minggu, 10 September 2026 jam 07:00 WIB. Mari hadir bersama!
          </span>
        </div>
      </div>

      {/* 2. NAVBAR */}
      <Navbar onOpenDaftar={() => setIsDaftarOpen(true)} />

      {/* 3. HERO SECTION */}
      <section id="beranda" className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Teks Hero */}
            <div className="md:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#CCFBF1] text-[#0F766E] rounded-full text-xs sm:text-sm font-semibold border border-[#0F766E]/10">
                <Sparkles size={16} className="text-[#0F766E]" />
                <span>Komunitas Pemuda Resmi Pakal Residence</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.18]">
                Bersama Membangun Lingkungan yang <span className="text-[#0F766E]">Aktif, Solid,</span> & <span className="relative inline-block">
                  Harmonis
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-[#F59E0B]/30 rounded-full -z-10"></span>
                </span>
              </h1>

              <p className="text-[#475569] text-base sm:text-lg leading-relaxed max-w-2xl">
                Karang Taruna hadir sebagai wadah generasi muda Pakal Residence untuk berkolaborasi, berkarya, memajukan UMKM warga, dan menjaga keharmonisan lingkungan secara transparan.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="#agenda" 
                  className="inline-flex items-center gap-2 bg-[#0F766E] hover:bg-[#115E59] text-white px-6 py-3.5 rounded-[14px] font-semibold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Lihat Kegiatan <ArrowRight size={18} />
                </a>
                <button 
                  onClick={() => setIsDaftarOpen(true)} 
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] px-6 py-3.5 rounded-[14px] font-semibold text-sm sm:text-base transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                >
                  <UserPlus size={18} className="text-[#0F766E]" /> Gabung Pemuda
                </button>
              </div>

              {/* Badges / Value Props */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#E2E8F0] text-xs sm:text-sm font-medium text-[#475569]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#0F766E] shrink-0" />
                  <span>Transparansi Kas Digital</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#0F766E] shrink-0" />
                  <span>Katalog UMKM Warga</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#0F766E] shrink-0" />
                  <span>Terbuka Untuk Pemuda</span>
                </div>
              </div>
            </div>

            {/* Gambar Hero Presentation */}
            <div className="md:col-span-5 relative order-first md:order-last">
              <div className="relative mx-auto max-w-md md:max-w-none">
                <div className="bg-white p-3 sm:p-4 rounded-[24px] border border-[#E2E8F0] shadow-xl relative z-10">
                  <img 
                    src={heroPhotos[0]} 
                    alt="Kegiatan Karang Taruna" 
                    className="w-full h-64 sm:h-80 object-cover rounded-[18px]" 
                  />
                  <div className="mt-3 flex items-center justify-between px-2">
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
                <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white p-3 sm:p-4 rounded-[18px] border border-[#E2E8F0] shadow-lg flex items-center gap-3 z-20">
                  <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
                    <HeartHandshake size={22} />
                  </div>
                  <div>
                    <div className="text-xs text-[#64748B] font-medium">Semangat Warga</div>
                    <div className="text-sm font-extrabold text-[#0F172A]">Guyub & Rukun</div>
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
      <section id="agenda" className="py-16 sm:py-24 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[#0F766E] font-bold text-xs uppercase tracking-wider bg-[#CCFBF1] px-3 py-1 rounded-full">
                Jadwal Mendatang
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] mt-3">Agenda & Kegiatan Warga</h2>
            </div>
            <p className="text-[#64748B] text-sm sm:text-base max-w-md mt-2 md:mt-0">
              Ikuti berbagai kegiatan sosial, kebersihan, dan olahraga rutin di lingkungan perumahan kita.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {agendaList.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#F8FAFC] rounded-[24px] border border-[#E2E8F0] p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:border-[#0F766E]/40"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    {/* Date Card Presentation */}
                    <div className="bg-[#0F766E] text-white rounded-[16px] p-3 text-center min-w-[70px] shrink-0 shadow-sm">
                      <span className="block text-2xl font-black leading-none">{item.tglHari}</span>
                      <span className="block text-[10px] font-bold uppercase tracking-wider mt-1 text-[#CCFBF1]">{item.tglBulan}</span>
                    </div>

                    <div>
                      <span className="inline-block text-xs font-bold px-3 py-1 bg-[#CCFBF1] text-[#0F766E] rounded-full mb-1">
                        {item.kategori}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] leading-snug">{item.judul}</h3>
                    </div>
                  </div>

                  <p className="text-[#475569] text-sm sm:text-base leading-relaxed mb-6">
                    {item.deskripsiRingkas}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#64748B]">
                    <MapPin size={16} className="text-[#0F766E]" />
                    <span>{item.lokasi}</span>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedAgenda(item)}
                    className="inline-flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white px-4 py-2.5 rounded-[12px] text-xs font-bold transition shadow-sm"
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
      <section className="py-16 sm:py-24 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#0F766E] font-bold text-xs uppercase tracking-wider bg-[#CCFBF1] px-3 py-1 rounded-full">
              Tanya Jawab
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] mt-3">Pertanyaan Sering Diajukan</h2>
          </div>

          <div className="space-y-4">
            {faqList.map((faq, idx) => (
              <div key={idx} className="border border-[#E2E8F0] rounded-[18px] overflow-hidden bg-[#F8FAFC]">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-[#0F172A] flex justify-between items-center text-sm sm:text-base hover:bg-[#F1F5F9] transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={20} className={`text-[#0F766E] transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#475569] border-t border-[#E2E8F0]/60 pt-3 leading-relaxed bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. SECTION MAP / PETA SEKRETARIAT */}
      <section id="lokasi" className="py-16 sm:py-24 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-5 space-y-4">
              <span className="text-[#0F766E] font-bold text-xs uppercase tracking-wider bg-[#CCFBF1] px-3 py-1 rounded-full">
                Peta Lokasi
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A]">Sekretariat Karang Taruna</h2>
              <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
                Pusat kegiatan dan balai serbaguna warga perumahan Pakal Residence. Terbuka untuk diskusi, kegiatan rutin, atau koordinasi antarwarga.
              </p>
              
              <div className="pt-2 text-xs sm:text-sm text-[#0F172A] space-y-3">
                <div className="flex items-center gap-3 font-semibold p-3 bg-white rounded-[14px] border border-[#E2E8F0]">
                  <MapPin size={20} className="text-[#0F766E] shrink-0" />
                  <span>Pakal Residence, Pakal, Surabaya</span>
                </div>
                <div className="flex items-center gap-3 font-semibold p-3 bg-white rounded-[14px] border border-[#E2E8F0]">
                  <Clock size={20} className="text-[#0F766E] shrink-0" />
                  <span>Buka Setiap Sabtu & Minggu (16:00 - 21:00 WIB)</span>
                </div>
              </div>
            </div>

            {/* Container Map Redesign */}
            <div className="md:col-span-7 h-80 sm:h-96 rounded-[24px] overflow-hidden border border-[#E2E8F0] shadow-md bg-white p-2">
              <iframe 
                title="Peta Lokasi Karang Taruna Pakal Residence"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15832.062823055416!2d112.6080!3d-7.2380!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f3f1e1a2b3c4%3A0x123456789abcdef!2sPakal%20Residence!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                className="rounded-[18px]"
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            </div>

          </div>
        </div>
      </section>

      {/* 11. SECTION ASPIRASI WARGA */}
      <section id="kontak" className="py-16 sm:py-24 bg-[#0F172A] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-[#F59E0B] font-bold text-xs uppercase tracking-wider bg-[#F59E0B]/10 px-3 py-1 rounded-full border border-[#F59E0B]/20">
            Ruang Komunikasi
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 mt-3">Suara & Aspirasi Warga</h2>
          <p className="text-[#64748B] text-sm sm:text-base mb-8">
            Punya saran, aduan, atau ide kegiatan untuk Karang Taruna? Tuliskan pesanmu di bawah ini.
          </p>

          <form className="space-y-4 text-left bg-slate-800/50 p-6 sm:p-8 rounded-[24px] border border-slate-700/60" onSubmit={handleSubmitAspirasi}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Lengkap / Blok *</label>
                <input 
                  name="nama" 
                  type="text" 
                  required 
                  placeholder="Contoh: Budi (Blok A-12)" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-[12px] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0F766E]" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">No. WhatsApp (Opsional)</label>
                <input 
                  name="wa" 
                  type="text" 
                  placeholder="08123456789" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-[12px] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0F766E]" 
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
                className="w-full bg-slate-900 border border-slate-700 rounded-[12px] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0F766E]"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-base py-3.5 rounded-[12px] transition duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              Kirim Pesan Warga <Send size={18} />
            </button>
          </form>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="bg-slate-950 text-[#64748B] py-8 text-center text-xs sm:text-sm border-t border-slate-900 flex flex-col items-center justify-center gap-2">
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
          className="text-xs text-[#64748B] hover:text-slate-300 transition underline flex items-center gap-1 mt-1"
        >
          <ShieldCheck size={14} /> Akses Panel Admin Pengurus
        </button>
      </footer>

      {/* MODAL DETAIL AGENDA */}
      <AnimatePresence>
        {selectedAgenda && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-white rounded-[24px] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8"
            >
              <button onClick={() => setSelectedAgenda(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
                <X size={20}/>
              </button>
              
              <span className="text-xs font-bold px-3 py-1 bg-[#CCFBF1] text-[#0F766E] rounded-full">{selectedAgenda.kategori}</span>
              <h3 className="text-2xl font-extrabold text-[#0F172A] mt-3 mb-2">{selectedAgenda.judul}</h3>
              <p className="text-[#475569] text-sm leading-relaxed mb-4">{selectedAgenda.deskripsiLengkap}</p>
              
              <div className="space-y-2 text-xs sm:text-sm text-[#0F172A] bg-[#F8FAFC] p-4 rounded-[16px] border border-[#E2E8F0] mb-4">
                <p><strong>📅 Waktu:</strong> {selectedAgenda.tglHari} {selectedAgenda.tglBulan} {selectedAgenda.tahun} ({selectedAgenda.jam})</p>
                <p><strong>📍 Lokasi:</strong> {selectedAgenda.lokasi}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Susunan Panitia Acara</h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedAgenda.panitia.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#F1F5F9] px-3.5 py-2 rounded-[10px] text-xs sm:text-sm">
                      <span className="text-[#64748B] font-medium">{p.peran}</span>
                      <span className="text-[#0F172A] font-bold">{p.nama}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => handleDaftarKegiatan(selectedAgenda)}
                  className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-bold py-3.5 rounded-[12px] transition flex items-center justify-center gap-2 text-sm shadow-md"
                >
                  <UserCheck size={18} /> Daftar Peserta / Voluntir Acara Ini
                </button>
                <button 
                  onClick={() => setSelectedAgenda(null)} 
                  className="w-full bg-[#F1F5F9] text-[#475569] font-bold py-2.5 rounded-[12px] text-xs hover:bg-[#E2E8F0] transition"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-white rounded-[24px] p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              <button onClick={() => setIsDaftarOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
                <X size={20}/>
              </button>
              <span className="text-[#0F766E] font-semibold text-xs uppercase tracking-wider">Gabung Pemuda</span>
              <h3 className="text-2xl font-extrabold text-[#0F172A] mt-1 mb-2">Form Pendaftaran Anggota</h3>
              <p className="text-[#64748B] text-xs mb-6">Khusus pemuda/i perumahan usia 15-30 tahun.</p>

              <form className="space-y-3" onSubmit={handleSubmitDaftar}>
                <input name="nama" type="text" required placeholder="Nama Lengkap" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-[#0F766E]" />
                <input name="blok" type="text" required placeholder="Blok / Nomor Rumah" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-[#0F766E]" />
                <input name="umur" type="number" required placeholder="Usia (Tahun)" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-[#0F766E]" />
                <select name="minat" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-[#0F766E]">
                  <option value="Humas & Medsos">Divisi Humas & Medsos</option>
                  <option value="Olahraga & Seni">Divisi Olahraga & Seni</option>
                  <option value="Lingkungan & Sosial">Divisi Lingkungan & Sosial</option>
                  <option value="Relawan Acara">Relawan Acara</option>
                </select>
                <button type="submit" className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-bold py-3.5 rounded-[12px] transition flex items-center justify-center gap-2 text-sm shadow-md mt-2">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-white rounded-[24px] p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              <button onClick={() => setIsDaftarUmkmOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
                <X size={20}/>
              </button>
              <span className="text-[#0F766E] font-semibold text-xs uppercase tracking-wider">Ekonomi Warga</span>
              <h3 className="text-2xl font-extrabold text-[#0F172A] mt-1 mb-2">Form Pendaftaran UMKM</h3>
              <p className="text-[#64748B] text-xs mb-6">Promosikan produk / jasa kamu ke seluruh warga perumahan gratis.</p>

              <form className="space-y-3" onSubmit={handleSubmitDaftarUmkm}>
                <input name="nama" type="text" required placeholder="Nama Toko / Usaha" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-[#0F766E]" />
                <select name="kategori" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-[#0F766E]">
                  <option value="Kuliner">Kuliner</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Jasa">Jasa</option>
                </select>
                <input name="wa" type="text" required placeholder="No. WA Penjual (Contoh: 6281234...)" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-[#0F766E]" />
                <textarea name="deskripsi" required rows="3" placeholder="Deskripsi singkat produk/jasa..." className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-[#0F766E]"></textarea>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#64748B]">Foto Produk / Usaha (Opsional):</label>
                  <input name="fotoFile" type="file" accept="image/*" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-3 py-2 text-xs focus:outline-none focus:border-[#0F766E]" />
                </div>
                
                <button type="submit" className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-bold py-3.5 rounded-[12px] transition flex items-center justify-center gap-2 text-sm shadow-md mt-2">
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