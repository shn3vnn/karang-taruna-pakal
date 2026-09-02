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
  Heart
} from 'lucide-react';

// Foto Kegiatan Asli Pemuda Warga
const heroPhotos = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600"
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
    deskripsiRingkas: "Pembersihan saluran air, penataan taman blok A, dan penanaman 50 bibit pohon buah.",
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
    const textKegiatan = encodeURIComponent(`Halo Kak ${agenda.panitia[0].nama}, saya berminat untuk mendaftar / berpartisipasi dalam kegiatan:\n\nNama Kegiatan: ${agenda.judul}\nTanggal: ${agenda.tglHari} ${agenda.tglBulan} ${agenda.tahun}\nLokasi: ${agenda.lokasi}\n\nMohon informasi petunjuk selanjutnya. Terima kasih!`);
    window.location.href = `whatsapp://send?phone=${agenda.waPJ}&text=${textKegiatan}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D312E] font-sans antialiased selection:bg-[#0F766E] selection:text-white">
      
      {/* BANNER PENGUMUMAN - SIMPLE & ORGANIK */}
      <div className="bg-[#0F766E] text-white text-xs sm:text-sm font-medium py-2 px-4 border-b border-[#0D645D]">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
          <Bell size={14} className="shrink-0 text-[#F59E0B]" />
          <span>
            <strong>Pengumuman:</strong> Kerja Bakti Masal dilaksanakan Minggu, 10 September 2026 jam 07:00 WIB.
          </span>
        </div>
      </div>

      {/* NAVBAR */}
      <Navbar onOpenDaftar={() => setIsDaftarOpen(true)} />

      {/* HERO SECTION - WARM EDITORIAL STYLE */}
      <section id="beranda" className="pt-10 pb-16 md:pt-20 md:pb-24 border-b border-[#E6E4DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            {/* Teks Hero */}
            <div className="md:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8F5F3] text-[#0F766E] rounded-md text-xs font-semibold border border-[#0F766E]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E]"></span>
                Komunitas Pemuda Pakal Residence • Surabaya
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1C1F1D] tracking-tight leading-[1.16]">
                Wadahnya Pemuda Buat <span className="italic font-serif text-[#0F766E] underline decoration-[#F59E0B]/50 decoration-wavy decoration-2">Berkarya & Saling Bantu</span>.
              </h1>

              <p className="text-[#525854] text-base sm:text-lg leading-relaxed max-w-xl">
                Karang Taruna hadir sebagai ruang kolaborasi generasi muda Pakal Residence untuk membuat kegiatan positif, memajukan usaha tetangga, dan menjaga kerukunan lingkungan.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a 
                  href="#agenda" 
                  className="inline-flex items-center gap-2 bg-[#0F766E] hover:bg-[#0D645D] text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all shadow-xs"
                >
                  Lihat Kegiatan <ArrowRight size={16} />
                </a>
                <button 
                  onClick={() => setIsDaftarOpen(true)} 
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#F2EFEA] border border-[#DCD9D4] text-[#1C1F1D] px-6 py-3 rounded-lg font-semibold text-sm transition-all"
                >
                  <UserPlus size={16} className="text-[#0F766E]" /> Gabung Pemuda
                </button>
              </div>

              {/* Value Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#E6E4DF] text-xs sm:text-sm text-[#525854]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#0F766E] shrink-0" />
                  <span>Kas Transparan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#0F766E] shrink-0" />
                  <span>Katalog UMKM Warga</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#0F766E] shrink-0" />
                  <span>Terbuka Untuk Pemuda</span>
                </div>
              </div>
            </div>

            {/* Photo Collage Showcase */}
            <div className="md:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                <div className="bg-white p-3 rounded-xl border border-[#E6E4DF] shadow-sm">
                  <img 
                    src={heroPhotos[0]} 
                    alt="Kebersamaan Pemuda Karang Taruna" 
                    className="w-full h-64 sm:h-80 object-cover rounded-lg" 
                  />
                  <div className="mt-3 flex items-center justify-between px-1">
                    <div>
                      <h4 className="font-bold text-[#1C1F1D] text-sm">Kegiatan Rutin Warga</h4>
                      <p className="text-xs text-[#737A75]">Pakal Residence, Surabaya</p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-[#E8F5F3] text-[#0F766E] text-xs font-bold rounded-md">
                      Aktif
                    </span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-lg border border-[#E6E4DF] shadow-sm flex items-center gap-3 hidden sm:flex">
                  <div className="w-8 h-8 rounded-md bg-[#F59E0B]/15 flex items-center justify-center text-[#D97706]">
                    <Heart size={18} />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#737A75]">Semangat Warga</div>
                    <div className="text-xs font-bold text-[#1C1F1D]">Guyub & Rukun</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FITUR KAS & STATISTIK WARGA */}
      <FiturWarga />

      {/* AGENDA & KEGIATAN */}
      <section id="agenda" className="py-16 sm:py-20 bg-white border-b border-[#E6E4DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-[#0F766E] font-bold text-xs uppercase tracking-wider bg-[#E8F5F3] px-2.5 py-1 rounded-md">
                Jadwal Kegiatan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1F1D] mt-2">Agenda Pemuda & Warga</h2>
            </div>
            <p className="text-[#737A75] text-sm max-w-md mt-2 md:mt-0">
              Ikuti berbagai kegiatan sosial, kebersihan, dan olahraga rutin di lingkungan perumahan kita.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agendaList.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#FAF8F5] rounded-xl border border-[#E6E4DF] p-6 flex flex-col justify-between hover:border-[#0F766E] transition-all"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    {/* Tiket Kalender Simple */}
                    <div className="bg-[#0F766E] text-white rounded-lg p-2.5 text-center min-w-[64px] shrink-0">
                      <span className="block text-2xl font-extrabold leading-none">{item.tglHari}</span>
                      <span className="block text-[10px] font-bold uppercase tracking-wider mt-1 text-[#CCFBF1]">{item.tglBulan}</span>
                    </div>

                    <div>
                      <span className="inline-block text-[11px] font-semibold px-2 py-0.5 bg-[#E8F5F3] text-[#0F766E] rounded-md mb-1">
                        {item.kategori}
                      </span>
                      <h3 className="text-lg font-bold text-[#1C1F1D] leading-snug">{item.judul}</h3>
                    </div>
                  </div>

                  <p className="text-[#525854] text-sm leading-relaxed mb-6">
                    {item.deskripsiRingkas}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E6E4DF] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#737A75]">
                    <MapPin size={15} className="text-[#0F766E]" />
                    <span>{item.lokasi}</span>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedAgenda(item)}
                    className="inline-flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#0D645D] text-white px-3.5 py-2 rounded-md text-xs font-semibold transition"
                  >
                    Detail & Ikut <Info size={14} />
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

      {/* STRUKTUR PENGURUS */}
      <Pengurus />

      {/* FAQ - TANYA JAWAB */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#E6E4DF]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#0F766E] font-bold text-xs uppercase tracking-wider bg-[#E8F5F3] px-2.5 py-1 rounded-md">
              Tanya Jawab
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1F1D] mt-2">Pertanyaan Sering Diajukan</h2>
          </div>

          <div className="space-y-3">
            {faqList.map((faq, idx) => (
              <div key={idx} className="border border-[#E6E4DF] rounded-lg overflow-hidden bg-[#FAF8F5]">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-[#1C1F1D] flex justify-between items-center text-sm sm:text-base hover:bg-[#F2EFEA] transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className={`text-[#0F766E] transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-[#525854] border-t border-[#E6E4DF] pt-3 leading-relaxed bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP / PETA SEKRETARIAT */}
      <section id="lokasi" className="py-16 sm:py-20 bg-[#FAF8F5] border-t border-[#E6E4DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-5 space-y-4">
              <span className="text-[#0F766E] font-bold text-xs uppercase tracking-wider bg-[#E8F5F3] px-2.5 py-1 rounded-md">
                Peta Lokasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1F1D]">Sekretariat Karang Taruna</h2>
              <p className="text-[#525854] text-sm leading-relaxed">
                Pusat kegiatan dan balai serbaguna warga perumahan Pakal Residence. Terbuka untuk diskusi, kegiatan rutin, atau koordinasi antarwarga.
              </p>
              
              <div className="pt-2 text-xs sm:text-sm text-[#1C1F1D] space-y-2.5">
                <div className="flex items-center gap-2.5 font-medium p-3 bg-white rounded-lg border border-[#E6E4DF]">
                  <MapPin size={18} className="text-[#0F766E] shrink-0" />
                  <span>Pakal Residence, Pakal, Surabaya</span>
                </div>
                <div className="flex items-center gap-2.5 font-medium p-3 bg-white rounded-lg border border-[#E6E4DF]">
                  <Clock size={18} className="text-[#0F766E] shrink-0" />
                  <span>Buka Setiap Sabtu & Minggu (16:00 - 21:00 WIB)</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 h-72 sm:h-80 rounded-xl overflow-hidden border border-[#E6E4DF] bg-white p-2">
              <iframe 
                title="Peta Lokasi Karang Taruna Pakal Residence"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15832.062823055416!2d112.6080!3d-7.2380!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f3f1e1a2b3c4%3A0x123456789abcdef!2sPakal%20Residence!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                className="rounded-lg"
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            </div>

          </div>
        </div>
      </section>

      {/* FORM ASPIRASI WARGA */}
      <section id="kontak" className="py-16 sm:py-20 bg-[#18181B] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-[#F59E0B] font-bold text-xs uppercase tracking-wider bg-[#F59E0B]/10 px-2.5 py-1 rounded-md border border-[#F59E0B]/20">
            Ruang Komunikasi
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 mt-2">Suara & Aspirasi Warga</h2>
          <p className="text-[#98A2B3] text-sm mb-8">
            Punya saran, aduan, atau ide kegiatan untuk Karang Taruna? Tuliskan pesanmu di bawah ini.
          </p>

          <form className="space-y-4 text-left bg-zinc-900 p-6 sm:p-8 rounded-xl border border-zinc-800" onSubmit={handleSubmitAspirasi}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Nama Lengkap / Blok</label>
                <input 
                  name="nama" 
                  type="text" 
                  required 
                  placeholder="Contoh: Budi (Blok A-12)" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0F766E]" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">No. WhatsApp (Opsional)</label>
                <input 
                  name="wa" 
                  type="text" 
                  placeholder="08123456789" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0F766E]" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Pesan Aspirasi / Ide Kegiatan</label>
              <textarea 
                name="pesan" 
                required 
                rows="4" 
                placeholder="Tuliskan saran atau ide kegiatanmu di sini..." 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0F766E]"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#0F766E] hover:bg-[#0D645D] text-white font-bold text-sm py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              Kirim Pesan Warga <Send size={16} />
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-950 text-zinc-500 py-8 text-center text-xs border-t border-zinc-900 flex flex-col items-center justify-center gap-2">
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
          className="text-zinc-500 hover:text-zinc-300 transition underline flex items-center gap-1 mt-1"
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
              className="bg-white rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-xl relative my-8"
            >
              <button onClick={() => setSelectedAgenda(null)} className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600">
                <X size={20}/>
              </button>
              
              <span className="text-xs font-bold px-2.5 py-1 bg-[#E8F5F3] text-[#0F766E] rounded-md">{selectedAgenda.kategori}</span>
              <h3 className="text-2xl font-extrabold text-[#1C1F1D] mt-3 mb-2">{selectedAgenda.judul}</h3>
              <p className="text-[#525854] text-sm leading-relaxed mb-4">{selectedAgenda.deskripsiLengkap}</p>
              
              <div className="space-y-1.5 text-xs text-[#1C1F1D] bg-[#FAF8F5] p-3.5 rounded-lg border border-[#E6E4DF] mb-4">
                <p><strong>📅 Waktu:</strong> {selectedAgenda.tglHari} {selectedAgenda.tglBulan} {selectedAgenda.tahun} ({selectedAgenda.jam})</p>
                <p><strong>📍 Lokasi:</strong> {selectedAgenda.lokasi}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-bold text-[#737A75] uppercase tracking-wider mb-2">Susunan Panitia Acara</h4>
                <div className="grid grid-cols-1 gap-1.5">
                  {selectedAgenda.panitia.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#F2EFEA] px-3 py-1.5 rounded-md text-xs">
                      <span className="text-[#737A75]">{p.peran}</span>
                      <span className="text-[#1C1F1D] font-bold">{p.nama}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => handleDaftarKegiatan(selectedAgenda)}
                  className="w-full bg-[#0F766E] hover:bg-[#0D645D] text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 text-xs"
                >
                  <UserCheck size={16} /> Daftar Peserta / Voluntir Acara Ini
                </button>
                <button 
                  onClick={() => setSelectedAgenda(null)} 
                  className="w-full bg-[#F2EFEA] text-[#525854] font-semibold py-2 rounded-lg text-xs hover:bg-[#E6E4DF] transition"
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
              className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full shadow-xl relative"
            >
              <button onClick={() => setIsDaftarOpen(false)} className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600">
                <X size={20}/>
              </button>
              <span className="text-[#0F766E] font-semibold text-xs uppercase tracking-wider">Gabung Pemuda</span>
              <h3 className="text-2xl font-extrabold text-[#1C1F1D] mt-1 mb-2">Form Pendaftaran Anggota</h3>
              <p className="text-[#737A75] text-xs mb-6">Khusus pemuda/i perumahan usia 15-30 tahun.</p>

              <form className="space-y-3" onSubmit={handleSubmitDaftar}>
                <input name="nama" type="text" required placeholder="Nama Lengkap" className="w-full bg-[#FAF8F5] border border-[#E6E4DF] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0F766E]" />
                <input name="blok" type="text" required placeholder="Blok / Nomor Rumah" className="w-full bg-[#FAF8F5] border border-[#E6E4DF] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0F766E]" />
                <input name="umur" type="number" required placeholder="Usia (Tahun)" className="w-full bg-[#FAF8F5] border border-[#E6E4DF] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0F766E]" />
                <select name="minat" className="w-full bg-[#FAF8F5] border border-[#E6E4DF] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0F766E]">
                  <option value="Humas & Medsos">Divisi Humas & Medsos</option>
                  <option value="Olahraga & Seni">Divisi Olahraga & Seni</option>
                  <option value="Lingkungan & Sosial">Divisi Lingkungan & Sosial</option>
                  <option value="Relawan Acara">Relawan Acara</option>
                </select>
                <button type="submit" className="w-full bg-[#0F766E] hover:bg-[#0D645D] text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm mt-2">
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
              className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full shadow-xl relative"
            >
              <button onClick={() => setIsDaftarUmkmOpen(false)} className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600">
                <X size={20}/>
              </button>
              <span className="text-[#0F766E] font-semibold text-xs uppercase tracking-wider">Ekonomi Warga</span>
              <h3 className="text-2xl font-extrabold text-[#1C1F1D] mt-1 mb-2">Form Pendaftaran UMKM</h3>
              <p className="text-[#737A75] text-xs mb-6">Promosikan produk / jasa kamu ke seluruh warga perumahan gratis.</p>

              <form className="space-y-3" onSubmit={handleSubmitDaftarUmkm}>
                <input name="nama" type="text" required placeholder="Nama Toko / Usaha" className="w-full bg-[#FAF8F5] border border-[#E6E4DF] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0F766E]" />
                <select name="kategori" className="w-full bg-[#FAF8F5] border border-[#E6E4DF] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0F766E]">
                  <option value="Kuliner">Kuliner</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Jasa">Jasa</option>
                </select>
                <input name="wa" type="text" required placeholder="No. WA Penjual (Contoh: 6281234...)" className="w-full bg-[#FAF8F5] border border-[#E6E4DF] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0F766E]" />
                <textarea name="deskripsi" required rows="3" placeholder="Deskripsi singkat produk/jasa..." className="w-full bg-[#FAF8F5] border border-[#E6E4DF] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0F766E]"></textarea>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#737A75]">Foto Produk / Usaha (Opsional):</label>
                  <input name="fotoFile" type="file" accept="image/*" className="w-full bg-[#FAF8F5] border border-[#E6E4DF] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0F766E]" />
                </div>
                
                <button type="submit" className="w-full bg-[#0F766E] hover:bg-[#0D645D] text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm mt-2">
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