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
import { ArrowRight, CheckCircle2, MapPin, Send, Calendar as CalendarIcon, UserPlus, X, Info, UserCheck, ChevronDown, Megaphone, Store, ShieldCheck, Clock, Sparkles } from 'lucide-react';

// Foto-foto Asli Suasana Kegiatan Warga (Gaya Natural)
const heroPhotos = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600",
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
    deskripsiRingkas: "Pembersihan selokan utama, penataan taman blok A, dan penanaman 50 bibit pohon buah.",
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
    deskripsiRingkas: "Ajang silaturahmi ganda putra & putri warga perumahan memperebutkan Piala Bergilir.",
    deskripsiLengkap: "Turnamen ramah terbuka untuk warga usia 15 tahun ke atas. Sistem kompetisi santai untuk mempererat keakraban antar blok.",
    panitia: [
      { peran: "Ketua Pelaksana", nama: "Siti Rahma" },
      { peran: "Wasit Utama", nama: "Rizky Pratama" }
    ],
    waPJ: "6285739439137"
  }
];

const faqList = [
  { q: "Siapa saja yang bisa bergabung menjadi anggota Karang Taruna?", a: "Seluruh pemuda dan pemudi warga Pakal Residence berusia 15 hingga 30 tahun dapat bergabung sebagai anggota aktif." },
  { q: "Bagaimana cara mendaftarkan usaha saya ke Katalog UMKM Tetangga?", a: "Cukup tekan tombol '+ Daftarkan Usaha' di seksi Katalog UMKM untuk mengisi nama usaha, produk, dan nomor WhatsApp penjual secara gratis." },
  { q: "Apakah kas keuangan Karang Taruna diperbarui secara berkala?", a: "Ya, pencatatan kas masuk dan keluar di-update setiap bulan dan dapat dipantau secara transparan oleh seluruh warga di halaman ini." }
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
    const textPesan = encodeURIComponent(`Halo Pengurus Karang Taruna,\n\nSaya mau menyampaikan saran/aspirasi:\n- Nama / Blok: ${nama}\n- No. WA: ${wa || '-'}\n- Pesan: ${pesan}`);
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
      alert('Terima kasih! Pendaftaranmu sudah masuk dan akan dikonfirmasi pengurus.');
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
      alert('Pendaftaran UMKM berhasil! Pengurus akan meninjau sebelum ditampilkan di katalog.');
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
    const textKegiatan = encodeURIComponent(`Halo Kak ${agenda.panitia[0].nama}, saya mau mendaftar ikut kegiatan:\n\n📌 *${agenda.judul}*\n🗓 Tanggal: ${agenda.tglHari} ${agenda.tglBulan} ${agenda.tahun}\n📍 Lokasi: ${agenda.lokasi}\n\nMohon arahan selanjutnya. Terima kasih!`);
    window.location.href = `whatsapp://send?phone=${agenda.waPJ}&text=${textKegiatan}`;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E293B] font-sans selection:bg-[#1B4332] selection:text-white">
      
      {/* RUNNING BANNER - WARM TERRACOTTA */}
      <div className="bg-[#C85A32] text-white text-xs font-medium py-2.5 px-4 flex items-center justify-center gap-2 tracking-wide">
        <Megaphone size={14} className="shrink-0" />
        <span><strong>Kabar Warga:</strong> Kerja Bakti Masal diadakan Minggu, 10 September 2026 jam 07.00 WIB. Mari guyub bareng!</span>
      </div>

      {/* NAVBAR */}
      <Navbar onOpenDaftar={() => setIsDaftarOpen(true)} />

      {/* HERO SECTION - WARM EDITORIAL STYLE */}
      <section id="beranda" className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden border-b border-[#E2E8F0]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-12 items-center">
          
          {/* Kolom Teks / Branding */}
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#E8F0EC] text-[#1B4332] rounded-full text-xs font-semibold border border-[#1B4332]/10">
              <span className="w-2 h-2 rounded-full bg-[#1B4332] animate-pulse"></span>
              Karang Taruna Pakal Residence • Surabaya
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
              Ruang Gerak Pemuda untuk Perumahan yang <span className="italic font-serif text-[#1B4332] underline decoration-[#C85A32]/40 decoration-wavy decoration-2">Guyub & Aktif</span>.
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
              Wadahnya generasi muda Pakal Residence buat saling kenal, bikin kegiatan seru, bantu UMKM tetangga, dan jaga kerukunan lingkungan tempat tinggal kita bersama.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#agenda" className="flex items-center gap-2 bg-[#1B4332] hover:bg-[#122E22] text-white px-7 py-3.5 rounded-xl font-bold text-sm transition shadow-sm">
                Lihat Agenda Kegiatan <ArrowRight size={16} />
              </a>
              <button onClick={() => setIsDaftarOpen(true)} className="flex items-center gap-2 bg-white hover:bg-[#F1F5F9] border border-slate-300 text-slate-800 px-7 py-3.5 rounded-xl font-bold text-sm transition">
                Gabung Anggota <UserPlus size={16} className="text-[#1B4332]" />
              </button>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 mt-6 text-xs sm:text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#1B4332] shrink-0" /> Kas Transparan
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#1B4332] shrink-0" /> Katalog UMKM
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#1B4332] shrink-0" /> Terbuka & Guyub
              </div>
            </div>
          </div>

          {/* Kolom Foto Collage (Gaya Polaroid / Foto Asli) */}
          <div className="md:col-span-5 relative order-first md:order-last">
            <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
              
              {/* Photo 1 - Belakang */}
              <div className="absolute top-2 left-2 w-48 sm:w-56 bg-white p-3 rounded-2xl shadow-md border border-slate-200 -rotate-6 transition transform hover:rotate-0 duration-300">
                <img src={heroPhotos[1]} alt="Foto Pemuda 1" className="w-full h-36 sm:h-44 object-cover rounded-xl" />
                <p className="text-[11px] font-semibold text-slate-500 mt-2 text-center">Kerja Bakti Warga</p>
              </div>

              {/* Photo 2 - Depan Utama */}
              <div className="absolute bottom-2 right-2 w-52 sm:w-60 bg-white p-3 rounded-2xl shadow-xl border border-slate-200 rotate-3 z-10 transition transform hover:scale-105 duration-300">
                <img src={heroPhotos[0]} alt="Foto Pemuda 2" className="w-full h-40 sm:h-48 object-cover rounded-xl" />
                <div className="flex justify-between items-center mt-2 px-1">
                  <p className="text-xs font-bold text-slate-800">Kebersamaan Pemuda</p>
                  <span className="text-[10px] bg-[#E8F0EC] text-[#1B4332] font-bold px-2 py-0.5 rounded-md">Pakal</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* FITUR KAS & RINGKASAN */}
      <FiturWarga />

      {/* AGENDA & KEGIATAN - TIKET STYLE */}
      <section id="agenda" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[#C85A32] font-bold text-xs uppercase tracking-wider">Jadwal Mendatang</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Agenda & Kegiatan Warga</h2>
            </div>
            <p className="text-slate-500 text-sm max-w-md mt-2 md:mt-0">
              Seluruh kegiatan bersifat terbuka. Warga dan pemuda bisa langsung mendaftar atau hadir secara langsung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {agendaList.map((item) => (
              <div key={item.id} className="bg-[#FDFBF7] rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-[#1B4332] transition duration-200 shadow-sm">
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    {/* Kotak Tanggal Gaya Tiket Kalender */}
                    <div className="bg-[#1B4332] text-white rounded-xl p-3 text-center min-w-[70px] shrink-0">
                      <span className="block text-2xl font-black leading-none">{item.tglHari}</span>
                      <span className="block text-[10px] font-bold uppercase tracking-wider mt-1">{item.tglBulan}</span>
                    </div>

                    <div>
                      <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 bg-[#E8F0EC] text-[#1B4332] rounded-md mb-1.5">
                        {item.kategori}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 leading-snug">{item.judul}</h3>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6 pl-1">
                    {item.deskripsiRingkas}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                    <MapPin size={15} className="text-[#C85A32]" /> {item.lokasi}
                  </div>
                  <button 
                    onClick={() => setSelectedAgenda(item)}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-[#1B4332] text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                  >
                    Rincian & Ikut <Info size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* KATALOG UMKM */}
      <Umkm onOpenDaftarUmkm={() => setIsDaftarUmkmOpen(true)} />

      {/* TRANSPARANSI & GALERI */}
      <TransparansiGaleri />

      {/* STRUKTUR PENGURUS */}
      <Pengurus />

      {/* FAQ - TANYA JAWAB */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#1B4332] font-bold text-xs uppercase tracking-wider">Pertanyaan umum</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Seputar Karang Taruna</h2>
          </div>

          <div className="space-y-3">
            {faqList.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-[#FDFBF7]">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-slate-900 flex justify-between items-center text-sm sm:text-base"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className={`text-[#1B4332] transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 border-t border-slate-200/60 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PETA & LOKASI SEKRETARIAT */}
      <section id="lokasi" className="py-16 sm:py-20 bg-[#FDFBF7] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span> Buka Sabtu & Minggu
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">Sekretariat Karang Taruna</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pusat kegiatan, diskusi, dan balai warga Karang Taruna Pakal Residence. Terbuka untuk koordinasi atau sekadar kumpul pemuda.
              </p>
              
              <div className="pt-2 text-xs sm:text-sm text-slate-700 space-y-2.5">
                <p className="flex items-center gap-2 font-semibold"><MapPin size={16} className="text-[#1B4332]" /> Pakal Residence, Pakal, Pakal, Surabaya</p>
                <p className="flex items-center gap-2 font-semibold"><Clock size={16} className="text-[#1B4332]" /> Sabtu & Minggu (16:00 - 21:00 WIB)</p>
              </div>
            </div>

            <div className="md:col-span-7 h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-300 shadow-sm">
              <iframe 
                title="Peta Lokasi Karang Taruna Pakal Residence"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15832.062823055416!2d112.6080!3d-7.2380!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f3f1e1a2b3c4%3A0x123456789abcdef!2sPakal%20Residence!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            </div>

          </div>
        </div>
      </section>

      {/* FORM ASPIRASI WARGA */}
      <section id="kontak" className="py-16 sm:py-20 bg-[#0F172A] text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <span className="text-[#C85A32] font-bold text-xs uppercase tracking-wider">Aspirasi & masukan</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 mt-1">Suara Warga Pakal Residence</h2>
          <p className="text-slate-400 text-sm mb-8">Punya ide acara, saran kebersihan, atau usulan kegiatan pemuda? Tuliskan di bawah ini.</p>
          
          <form className="space-y-3.5 text-left" onSubmit={handleSubmitAspirasi}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <input name="nama" type="text" required placeholder="Nama / Blok Rumah" className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#1B4332]" />
              <input name="wa" type="text" placeholder="No. WhatsApp (Opsional)" className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#1B4332]" />
            </div>
            <textarea name="pesan" required rows="4" placeholder="Tuliskan saran atau masukanmu..." className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#1B4332]"></textarea>
            <button type="submit" className="w-full bg-[#1B4332] hover:bg-[#122E22] font-bold text-sm py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm">
              Kirim Pesan Warga <Send size={16} />
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0B0F19] text-slate-500 py-8 text-center text-xs border-t border-slate-800/80 flex flex-col items-center justify-center gap-2">
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
          className="text-slate-500 hover:text-slate-300 transition underline flex items-center gap-1"
        >
          <ShieldCheck size={14} /> Akses Panel Admin Pengurus
        </button>
      </footer>

      {/* MODAL DETAIL AGENDA */}
      <AnimatePresence>
        {selectedAgenda && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8">
              <button onClick={() => setSelectedAgenda(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"><X size={20}/></button>
              
              <span className="text-[11px] font-bold px-2.5 py-1 bg-[#E8F0EC] text-[#1B4332] rounded-md">{selectedAgenda.kategori}</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-2">{selectedAgenda.judul}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">{selectedAgenda.deskripsiLengkap}</p>
              
              <div className="space-y-1.5 text-xs text-slate-700 bg-[#FDFBF7] p-3.5 rounded-xl border border-slate-200 mb-4">
                <p><strong>📅 Waktu:</strong> {selectedAgenda.tglHari} {selectedAgenda.tglBulan} {selectedAgenda.tahun} ({selectedAgenda.jam})</p>
                <p><strong>📍 Lokasi:</strong> {selectedAgenda.lokasi}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Penanggung Jawab Acara</h4>
                <div className="grid grid-cols-1 gap-1.5">
                  {selectedAgenda.panitia.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg text-xs">
                      <span className="text-slate-500">{p.peran}</span>
                      <span className="text-slate-900 font-bold">{p.nama}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => handleDaftarKegiatan(selectedAgenda)}
                  className="w-full bg-[#1B4332] hover:bg-[#122E22] text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-sm"
                >
                  <UserCheck size={16} /> Daftar / Konfirmasi Kehadiran
                </button>
                <button 
                  onClick={() => setSelectedAgenda(null)} 
                  className="w-full bg-slate-100 text-slate-600 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-200 transition"
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setIsDaftarOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"><X size={20}/></button>
              <span className="text-[#1B4332] font-bold text-xs uppercase tracking-wider">Pemuda Pakal</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5 mb-1">Form Pendaftaran Anggota</h3>
              <p className="text-slate-500 text-xs mb-5">Khusus warga/pemuda perumahan usia 15-30 tahun.</p>

              <form className="space-y-3" onSubmit={handleSubmitDaftar}>
                <input name="nama" type="text" required placeholder="Nama Lengkap" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#1B4332]" />
                <input name="blok" type="text" required placeholder="Blok / Nomor Rumah (Contoh: A-12)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#1B4332]" />
                <input name="umur" type="number" required placeholder="Usia (Tahun)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#1B4332]" />
                <select name="minat" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#1B4332]">
                  <option value="Humas & Medsos">Divisi Humas & Media</option>
                  <option value="Olahraga & Seni">Divisi Olahraga & Seni</option>
                  <option value="Lingkungan & Sosial">Divisi Lingkungan & Sosial</option>
                  <option value="Relawan Acara">Relawan Acara Kegiatan</option>
                </select>
                <button type="submit" className="w-full bg-[#1B4332] hover:bg-[#122E22] text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-sm mt-1">
                  Kirim Pendaftaran <UserPlus size={15} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DAFTAR UMKM */}
      <AnimatePresence>
        {isDaftarUmkmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setIsDaftarUmkmOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"><X size={20}/></button>
              <span className="text-[#1B4332] font-bold text-xs uppercase tracking-wider">Ekonomi Warga</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5 mb-1">Pendaftaran Katalog UMKM</h3>
              <p className="text-slate-500 text-xs mb-5">Promosikan jualan/jasa kamu ke warga perumahan secara gratis.</p>

              <form className="space-y-3" onSubmit={handleSubmitDaftarUmkm}>
                <input name="nama" type="text" required placeholder="Nama Toko / Usaha" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#1B4332]" />
                <select name="kategori" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#1B4332]">
                  <option value="Kuliner">Kuliner / Makanan</option>
                  <option value="Minuman">Minuman / Kopi</option>
                  <option value="Jasa">Jasa & Keahlian</option>
                </select>
                <input name="wa" type="text" required placeholder="No. WA Penjual (Contoh: 6281234...)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#1B4332]" />
                <textarea name="deskripsi" required rows="3" placeholder="Deskripsi singkat produk atau jasa..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#1B4332]"></textarea>
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Foto Produk / Toko (Opsional):</label>
                  <input name="fotoFile" type="file" accept="image/*" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#1B4332]" />
                </div>
                
                <button type="submit" className="w-full bg-[#1B4332] hover:bg-[#122E22] text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-sm mt-1">
                  Daftarkan Usaha <Store size={15} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}