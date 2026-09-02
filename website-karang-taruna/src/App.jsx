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
import { ArrowUpRight, MapPin, Send, UserPlus, X, ChevronDown, ShieldCheck, Target, Compass } from 'lucide-react';

const heroPhotos = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600"
];

const agendaList = [
  {
    id: 1,
    judul: "Kerja Bakti Masal & Penghijauan Lingkungan",
    kategori: "Lingkungan",
    tglHari: "10",
    tglBulan: "SEPT",
    tahun: "2026",
    jam: "07:00 WIB - Selesai",
    lokasi: "Lapangan Utama & Taman Blok A",
    deskripsiRingkas: "Pembersihan saluran air utama, penataan taman blok A, dan penanaman 50 bibit pohon buah.",
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
    kategori: "Olahraga",
    tglHari: "20",
    tglBulan: "SEPT",
    tahun: "2026",
    jam: "18:30 WIB - Selesai",
    lokasi: "Lapangan Serbaguna Perumahan",
    deskripsiRingkas: "Kompetisi ganda putra & putri warga perumahan memperebutkan Piala Bergilir Karang Taruna.",
    deskripsiLengkap: "Turnamen ramah terbuka untuk warga usia 15 tahun ke atas. Sistem pertandingan menggunakan piala bergilir Karang Taruna dengan hadiah menarik untuk Juara 1, 2, dan 3.",
    panitia: [
      { peran: "Ketua Pelaksana", nama: "Siti Rahma" },
      { peran: "Wasit Utama", nama: "Rizky Pratama" }
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
    <div className="min-h-screen bg-[#FAFAFA] text-[#171717] font-sans antialiased">
      
      {/* ANNOUNCEMENT BAR */}
      <div className="border-b border-[#E5E5E5] bg-[#F5F5F5] py-2 px-4 text-xs text-[#525252]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#171717]">PENGUMUMAN</span>
            <span className="text-[#A3A3A3]">/</span>
            <span>Kerja Bakti Masal dilaksanakan Minggu, 10 September 2026 jam 07:00 WIB.</span>
          </div>
          <span className="hidden sm:inline text-[#A3A3A3]">Pakal Residence, Surabaya</span>
        </div>
      </div>

      {/* NAVBAR */}
      <Navbar onOpenDaftar={() => setIsDaftarOpen(true)} />

      {/* HERO SECTION */}
      <section id="beranda" className="pt-12 pb-16 border-b border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-[#737373] block mb-3">
              [ 01 ] — PLATFORM KOMUNITAS PEMUDA
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717] max-w-3xl leading-[1.12]">
              Ruang gerak pemuda untuk perumahan yang aktif, transparan, dan saling bantu.
            </h1>
          </div>

          <p className="text-[#525252] text-sm sm:text-base max-w-2xl mb-8 leading-relaxed font-normal">
            Karang Taruna Pakal Residence adalah wadah kolaborasi generasi muda untuk mengelola kegiatan sosial, mempublikasikan kas terbuka, serta mempromosikan usaha warga lokal.
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            <a 
              href="#agenda" 
              className="bg-[#171717] hover:bg-[#262626] text-white px-5 py-2.5 rounded text-xs font-semibold tracking-wide transition flex items-center gap-2"
            >
              Lihat Agenda Kegiatan <ArrowUpRight size={14} />
            </a>
            <button 
              onClick={() => setIsDaftarOpen(true)} 
              className="bg-white hover:bg-[#F5F5F5] border border-[#D4D4D4] text-[#171717] px-5 py-2.5 rounded text-xs font-semibold tracking-wide transition flex items-center gap-2"
            >
              Gabung Pemuda <UserPlus size={14} />
            </button>
          </div>

          {/* Photo Grid Minimalis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-[#E5E5E5] bg-white p-2 rounded">
              <img src={heroPhotos[0]} alt="Kegiatan Pemuda 1" className="w-full h-56 sm:h-64 object-cover rounded-[2px]" />
              <div className="p-2 pt-3 flex justify-between items-center text-xs text-[#737373]">
                <span className="font-medium">Dokumentasi Kerja Bakti</span>
                <span className="font-mono">2026</span>
              </div>
            </div>
            <div className="border border-[#E5E5E5] bg-white p-2 rounded hidden sm:block">
              <img src={heroPhotos[1]} alt="Kegiatan Pemuda 2" className="w-full h-56 sm:h-64 object-cover rounded-[2px]" />
              <div className="p-2 pt-3 flex justify-between items-center text-xs text-[#737373]">
                <span className="font-medium">Kebersamaan Warga</span>
                <span className="font-mono">Pakal Residence</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION VISI & MISI */}
      <section id="visi-misi" className="py-16 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-[#737373] block mb-1">
              [ 02 ] — FONDASI ORGANISASI
            </span>
            <h2 className="text-2xl font-bold text-[#171717]">Visi & Misi Karang Taruna</h2>
          </div>

          <div className="grid md:grid-cols-12 gap-6 items-start">
            
            {/* Box Visi */}
            <div className="md:col-span-5 bg-[#FAFAFA] border border-[#E5E5E5] p-6 rounded relative">
              <div className="flex items-center gap-2 text-xs font-mono text-[#737373] uppercase mb-3">
                <Target size={15} className="text-[#171717]" />
                <span>Visi Utama</span>
              </div>
              <h3 className="text-lg font-bold text-[#171717] leading-snug mb-3">
                Mewujudkan Generasi Muda Pakal Residence yang Mandiri, Kreatif, Berkarakter, dan Kepedulian Sosial Tinggi.
              </h3>
              <p className="text-xs text-[#525252] leading-relaxed">
                Menjadi penggerak utama dalam menciptakan lingkungan perumahan yang aman, harmonis, serta mendukung kemajuan potensi seluruh pemuda dan warga.
              </p>
            </div>

            {/* List Misi */}
            <div className="md:col-span-7 bg-[#FAFAFA] border border-[#E5E5E5] p-6 rounded space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#737373] uppercase mb-1">
                <Compass size={15} className="text-[#171717]" />
                <span>Misi Pertumbuhan</span>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3 text-xs leading-relaxed border-b border-[#E5E5E5] pb-3">
                  <span className="font-mono font-bold text-[#171717]">01.</span>
                  <p className="text-[#525252]">
                    <strong className="text-[#171717]">Mempererat Silaturahmi:</strong> Menyelenggarakan kegiatan kebersamaan, keolahragaan, dan seni secara berkala antarwarga dan antar-RT.
                  </p>
                </div>

                <div className="flex gap-3 text-xs leading-relaxed border-b border-[#E5E5E5] pb-3">
                  <span className="font-mono font-bold text-[#171717]">02.</span>
                  <p className="text-[#525252]">
                    <strong className="text-[#171717]">Pemberdayaan Ekonomi Warga:</strong> Mendorong dan mempromosikan potensi UMKM lokal milik warga perumahan agar saling bertumbuh.
                  </p>
                </div>

                <div className="flex gap-3 text-xs leading-relaxed border-b border-[#E5E5E5] pb-3">
                  <span className="font-mono font-bold text-[#171717]">03.</span>
                  <p className="text-[#525252]">
                    <strong className="text-[#171717]">Aksi Lingkungan & Sosial:</strong> Aktif menjaga kebersihan, kelestarian lingkungan, serta tanggap bantuan sosial untuk warga yang membutuhkan.
                  </p>
                </div>

                <div className="flex gap-3 text-xs leading-relaxed">
                  <span className="font-mono font-bold text-[#171717]">04.</span>
                  <p className="text-[#525252]">
                    <strong className="text-[#171717]">Transparansi & Akuntabilitas:</strong> Mengelola kas dan informasi kegiatan secara terbuka yang dapat diakses oleh seluruh masyarakat perumahan.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FITUR RINGKAS */}
      <FiturWarga />

      {/* AGENDA & KEGIATAN */}
      <section id="agenda" className="py-16 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="flex justify-between items-end mb-8 border-b border-[#E5E5E5] pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#737373] block mb-1">
                [ 03 ] — JADWAL RUTIN
              </span>
              <h2 className="text-2xl font-bold text-[#171717]">Agenda Mendatang</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agendaList.map((item) => (
              <div key={item.id} className="border border-[#E5E5E5] bg-[#FAFAFA] p-6 rounded flex flex-col justify-between hover:border-[#171717] transition">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-mono text-[#737373] border border-[#E5E5E5] bg-white px-2 py-0.5 rounded">
                      {item.kategori}
                    </span>
                    <span className="text-xs font-mono text-[#171717]">
                      {item.tglHari} {item.tglBulan} {item.tahun}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#171717] mb-2">{item.judul}</h3>
                  <p className="text-xs text-[#525252] leading-relaxed mb-6">{item.deskripsiRingkas}</p>
                </div>

                <div className="pt-4 border-t border-[#E5E5E5] flex justify-between items-center text-xs">
                  <span className="text-[#737373] flex items-center gap-1">
                    <MapPin size={13} /> {item.lokasi}
                  </span>
                  <button 
                    onClick={() => setSelectedAgenda(item)}
                    className="font-semibold text-[#171717] hover:underline flex items-center gap-1"
                  >
                    Rincian & Ikut <ArrowUpRight size={13} />
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

      {/* FAQ */}
      <section className="py-16 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-8 text-center">
            <span className="text-xs font-mono uppercase tracking-wider text-[#737373] block mb-1">
              [ 04 ] — INFORMASI UMUM
            </span>
            <h2 className="text-2xl font-bold text-[#171717]">Pertanyaan Sering Diajukan</h2>
          </div>

          <div className="space-y-2">
            {faqList.map((faq, idx) => (
              <div key={idx} className="border border-[#E5E5E5] rounded bg-[#FAFAFA]">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left text-xs sm:text-sm font-semibold text-[#171717] flex justify-between items-center"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={16} className={`text-[#737373] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-[#525252] border-t border-[#E5E5E5] pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOKASI */}
      <section id="lokasi" className="py-16 border-b border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#737373]">PETA SEKRETARIAT</span>
              <h2 className="text-2xl font-bold text-[#171717]">Balai Warga Pakal</h2>
              <p className="text-xs text-[#525252] leading-relaxed">
                Pusat kegiatan dan balai serbaguna perumahan Pakal Residence, Surabaya.
              </p>
              <div className="text-xs text-[#171717] space-y-1 pt-2">
                <p>📍 Pakal Residence, Pakal, Surabaya</p>
                <p>🕒 Sabtu & Minggu (16:00 - 21:00 WIB)</p>
              </div>
            </div>
            <div className="md:col-span-7 h-64 border border-[#E5E5E5] rounded bg-white p-1">
              <iframe 
                title="Peta Lokasi"
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

      {/* FORM ASPIRASI */}
      <section id="kontak" className="py-16 bg-[#171717] text-white">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-[#A3A3A3] block mb-1">[ ASPIRASI WARGA ]</span>
            <h2 className="text-2xl font-bold">Suara & Masukan Warga</h2>
          </div>

          <form className="space-y-3" onSubmit={handleSubmitAspirasi}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input name="nama" type="text" required placeholder="Nama / Blok Rumah" className="bg-[#262626] border border-[#404040] rounded px-3 py-2 text-xs text-white placeholder-[#A3A3A3] focus:outline-none focus:border-white" />
              <input name="wa" type="text" placeholder="No. WhatsApp (Opsional)" className="bg-[#262626] border border-[#404040] rounded px-3 py-2 text-xs text-white placeholder-[#A3A3A3] focus:outline-none focus:border-white" />
            </div>
            <textarea name="pesan" required rows="3" placeholder="Tuliskan pesan atau saranmu..." className="w-full bg-[#262626] border border-[#404040] rounded px-3 py-2 text-xs text-white placeholder-[#A3A3A3] focus:outline-none focus:border-white"></textarea>
            <button type="submit" className="w-full bg-white hover:bg-[#E5E5E5] text-[#171717] font-semibold text-xs py-2.5 rounded transition flex items-center justify-center gap-2">
              Kirim Pesan <Send size={14} />
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0A0A0A] text-[#737373] py-6 text-center text-xs border-t border-[#262626]">
        <p>© 2026 Karang Taruna Pakal Residence • Surabaya.</p>
        <button 
          onClick={() => {
            const pass = prompt('Masukkan Kata Sandi Admin:');
            if (pass === 'adminperumahan') setIsAdminLoggedIn(true);
            else if (pass) alert('Kata sandi salah!');
          }} 
          className="text-[#525252] hover:text-[#A3A3A3] transition underline mt-2 flex items-center gap-1 mx-auto"
        >
          <ShieldCheck size={12} /> Akses Panel Admin
        </button>
      </footer>

      {/* MODAL AGENDA */}
      <AnimatePresence>
        {selectedAgenda && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-white rounded border border-[#E5E5E5] p-6 max-w-lg w-full relative">
              <button onClick={() => setSelectedAgenda(null)} className="absolute top-4 right-4 text-[#737373] hover:text-[#171717]"><X size={18}/></button>
              <span className="text-xs font-mono text-[#737373]">{selectedAgenda.kategori}</span>
              <h3 className="text-xl font-bold text-[#171717] mt-1 mb-2">{selectedAgenda.judul}</h3>
              <p className="text-xs text-[#525252] leading-relaxed mb-4">{selectedAgenda.deskripsiLengkap}</p>
              
              <div className="text-xs text-[#171717] bg-[#FAFAFA] p-3 rounded border border-[#E5E5E5] mb-4 space-y-1">
                <p>📅 {selectedAgenda.tglHari} {selectedAgenda.tglBulan} {selectedAgenda.tahun} ({selectedAgenda.jam})</p>
                <p>📍 {selectedAgenda.lokasi}</p>
              </div>

              <button onClick={() => handleDaftarKegiatan(selectedAgenda)} className="w-full bg-[#171717] hover:bg-[#262626] text-white font-semibold py-2 rounded text-xs transition mb-2">
                Daftar / Konfirmasi Kehadiran
              </button>
              <button onClick={() => setSelectedAgenda(null)} className="w-full bg-[#F5F5F5] text-[#525252] font-semibold py-2 rounded text-xs">
                Tutup
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL ANGGOTA */}
      <AnimatePresence>
        {isDaftarOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-white rounded border border-[#E5E5E5] p-6 max-w-md w-full relative">
              <button onClick={() => setIsDaftarOpen(false)} className="absolute top-4 right-4 text-[#737373] hover:text-[#171717]"><X size={18}/></button>
              <h3 className="text-lg font-bold text-[#171717] mb-1">Form Pendaftaran Anggota</h3>
              <p className="text-xs text-[#737373] mb-4">Khusus pemuda/i perumahan usia 15-30 tahun.</p>

              <form className="space-y-3" onSubmit={handleSubmitDaftar}>
                <input name="nama" type="text" required placeholder="Nama Lengkap" className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#171717]" />
                <input name="blok" type="text" required placeholder="Blok / Nomor Rumah" className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#171717]" />
                <input name="umur" type="number" required placeholder="Usia (Tahun)" className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#171717]" />
                <select name="minat" className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#171717]">
                  <option value="Humas & Medsos">Divisi Humas & Medsos</option>
                  <option value="Olahraga & Seni">Divisi Olahraga & Seni</option>
                  <option value="Lingkungan & Sosial">Divisi Lingkungan & Sosial</option>
                </select>
                <button type="submit" className="w-full bg-[#171717] text-white font-semibold py-2 rounded text-xs transition">
                  Kirim Pendaftaran
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL UMKM */}
      <AnimatePresence>
        {isDaftarUmkmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-white rounded border border-[#E5E5E5] p-6 max-w-md w-full relative">
              <button onClick={() => setIsDaftarUmkmOpen(false)} className="absolute top-4 right-4 text-[#737373] hover:text-[#171717]"><X size={18}/></button>
              <h3 className="text-lg font-bold text-[#171717] mb-1">Daftarkan Usaha UMKM</h3>
              <p className="text-xs text-[#737373] mb-4">Promosikan produk/jasa ke warga perumahan secara gratis.</p>

              <form className="space-y-3" onSubmit={handleSubmitDaftarUmkm}>
                <input name="nama" type="text" required placeholder="Nama Toko / Usaha" className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#171717]" />
                <select name="kategori" className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#171717]">
                  <option value="Kuliner">Kuliner</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Jasa">Jasa</option>
                </select>
                <input name="wa" type="text" required placeholder="No. WA Penjual (628...)" className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#171717]" />
                <textarea name="deskripsi" required rows="3" placeholder="Deskripsi singkat produk..." className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#171717]"></textarea>
                <input name="fotoFile" type="file" accept="image/*" className="w-full text-xs" />
                <button type="submit" className="w-full bg-[#171717] text-white font-semibold py-2 rounded text-xs transition">
                  Daftarkan Usaha
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}