import { useState } from 'react';
import Navbar from './components/Navbar';
import Pengurus from './components/Pengurus';
import FiturWarga from './components/FiturWarga';
import Umkm from './components/Umkm';
import TransparansiGaleri from './components/TransparansiGaleri';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabaseClient';
import { ArrowRight, CheckCircle, MapPin, Send, Calendar, UserPlus, X, Info, UserCheck, ChevronDown, Bell, Store, ShieldCheck } from 'lucide-react';

const heroImage = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000";

const agendaList = [
  {
    id: 1,
    judul: "Kerja Bakti Masal & Penghijauan",
    kategori: "Sosial Lingkungan",
    tanggal: "10 Sept 2026",
    jam: "07:00 WIB - Selesai",
    lokasi: "Lapangan Utama & Taman Blok A",
    deskripsiRingkas: "Pembersihan area fasilitas umum, perbaikan fasilitas lapangan, dan penanaman tanaman hias.",
    deskripsiLengkap: "Kegiatan gotong royong rutin untuk seluruh warga perumahan. Diharapkan setiap rumah mengirimkan perwakilannya. Karang Taruna akan menyediakan peralatan pembersihan serta konsumsi snack/minuman.",
    panitia: [
      { peran: "Ketua Pelaksana", nama: "Budi Santoso" },
      { peran: "Koordinator Lapangan", nama: "Ahmad Rifai" },
      { peran: "Konsumsi & Logistik", nama: "Dina Mariana" }
    ],
    waPJ: "6285739439137"
  },
  {
    id: 2,
    judul: "Turnamen Bulutangkis Antar RT",
    kategori: "Olahraga",
    tanggal: "20 Sept 2026",
    jam: "18:30 WIB - Selesai",
    lokasi: "Lapangan Serbaguna Perumahan",
    deskripsiRingkas: "Kompetisi ramah persahabatan ganda putra & putri antar warga perumahan.",
    deskripsiLengkap: "Turnamen bulutangkis terbuka untuk seluruh warga perumahan usia 15 tahun ke atas. Sistem pertandingan menggunakan piala bergilir Karang Taruna dengan hadiah menarik untuk Juara 1, 2, dan 3.",
    panitia: [
      { peran: "Ketua Pelaksana", nama: "Siti Rahma" },
      { peran: "Wasit & Pertandingan", nama: "Rizky Pratama" },
      { peran: "Pendaftaran & Bantuan", nama: "Dewi Lestari" }
    ],
    waPJ: "6285739439137"
  }
];

const faqList = [
  { q: "Siapa saja yang boleh bergabung menjadi anggota Karang Taruna?", a: "Seluruh pemuda dan pemudi warga perumahan berusia 15 hingga 30 tahun dapat bergabung menjadi anggota aktif Karang Taruna." },
  { q: "Bagaimana cara mendaftarkan usaha saya ke Katalog UMKM Tetangga?", a: "Kamu bisa menekan tombol '+ Daftarkan Usaha' di bagian Katalog UMKM untuk mengisi formulir pendaftaran secara gratis." },
  { q: "Apakah laporan keuangan kas Karang Taruna diupdate berkala?", a: "Ya, rekapitulasi kas masuk dan keluar selalu diperbarui setiap bulan dan dapat diakses secara terbuka melalui seksi Transparansi di website ini." }
];

export default function App() {
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [isDaftarOpen, setIsDaftarOpen] = useState(false);
  const [isDaftarUmkmOpen, setIsDaftarUmkmOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const noPengurus = "6285739439137";

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
      reader.onloadend = () => {
        processSave(reader.result);
      };
      reader.readAsDataURL(fileFoto);
    } else {
      processSave(null);
    }
  };

  const handleDaftarKegiatan = (agenda) => {
    const textKegiatan = encodeURIComponent(`Halo Kak ${agenda.panitia[0].nama}, saya berminat untuk mendaftar / berpartisipasi dalam kegiatan:\n\n📌 *${agenda.judul}*\n🗓 Tanggal: ${agenda.tanggal}\n📍 Lokasi: ${agenda.lokasi}\n\nMohon informasi petunjuk selanjutnya. Terima kasih!`);
    window.location.href = `whatsapp://send?phone=${agenda.waPJ}&text=${textKegiatan}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      
      {/* RUNNING BANNER */}
      <div className="bg-[#039088] text-white text-xs font-semibold py-2.5 px-4 flex items-center justify-center gap-2">
        <Bell size={14} className="animate-bounce" />
        <span><strong>Pengumuman:</strong> Kerja Bakti Akbar akan dilaksanakan Minggu, 10 September 2026 jam 07:00 WIB. Mari hadir bersama!</span>
      </div>

      {/* NAVBAR */}
      <Navbar onOpenDaftar={() => setIsDaftarOpen(true)} />

      {/* HERO SECTION */}
      <section id="beranda" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[#E6F4F3] text-[#039088] rounded-full text-sm font-semibold border border-[#039088]/10">
              <div className="w-2.5 h-2.5 bg-[#039088] rounded-full animate-pulse"></div>
              Komunitas Pemuda Resmi Perumahan
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Bersama Membangun Perumahan yang <span className="text-[#039088]">Lebih Aktif</span> dan <span className="wavy-underline">Solid</span>.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-600 text-lg leading-relaxed max-w-2xl">
              Karang Taruna hadir sebagai wadah bagi generasi muda untuk berkolaborasi, berkarya, dan memberikan kontribusi nyata bagi kemajuan dan kerukunan lingkungan.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-4 pt-2">
              <a href="#agenda" className="flex items-center gap-2 bg-[#039088] hover:bg-[#02756D] text-white px-8 py-4 rounded-xl font-bold text-base transition shadow-lg shadow-[#039088]/20">
                Lihat Kegiatan <ArrowRight size={18} />
              </a>
              <button onClick={() => setIsDaftarOpen(true)} className="flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 px-8 py-4 rounded-xl font-bold text-base transition shadow-sm">
                Gabung Pemuda <UserPlus size={18} className="text-[#039088]" />
              </button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-x-8 gap-y-4 pt-8 border-t border-slate-200 mt-8">
              {["Transparansi Kas Digital", "Dukungan UMKM Tetangga", "Terbuka untuk Seluruh Pemuda"].map((item, index) => (
                <div key={index} className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                  <CheckCircle size={18} className="text-[#039088]" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="md:col-span-5 relative order-first md:order-last">
            <div className="relative aspect-[5/4] bg-slate-200 rounded-[2.5rem] p-4 shadow-xl border border-slate-200">
              <img src={heroImage} alt="Kegiatan Pemuda" className="w-full h-full object-cover rounded-[2rem]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FITUR KAS & UMKM RINGKAS */}
      <FiturWarga />

      {/* AGENDA & KEGIATAN */}
      <section id="agenda" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-[#039088] font-semibold text-sm uppercase tracking-wider">Jadwal Mendatang</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Agenda & Kegiatan Warga</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {agendaList.map((item) => (
              <div key={item.id} className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold px-3.5 py-1.5 bg-[#E6F4F3] text-[#039088] rounded-full">{item.kategori}</span>
                    <span className="text-sm font-semibold text-slate-500 flex items-center gap-1"><Calendar size={14}/> {item.tanggal}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.judul}</h3>
                  <p className="text-slate-600 text-base leading-relaxed mb-6">{item.deskripsiRingkas}</p>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center text-sm font-medium text-slate-600 gap-2">
                    <MapPin size={18} className="text-[#039088]" /> {item.lokasi}
                  </div>
                  <button 
                    onClick={() => setSelectedAgenda(item)}
                    className="flex items-center gap-1 bg-[#039088] hover:bg-[#02756D] text-white px-4 py-2 rounded-xl font-bold text-xs transition"
                  >
                    Lihat Detail & Daftar <Info size={14} />
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

      {/* ACCORDION FAQ */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#039088] font-semibold text-sm uppercase tracking-wider">Tanya Jawab</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Pertanyaan Sering Diajukan</h2>
          </div>

          <div className="space-y-4">
            {faqList.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 flex justify-between items-center text-sm sm:text-base"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={20} className={`text-[#039088] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 border-t border-slate-200/60 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAPS & LOKASI SEKRETARIAT */}
      <section id="lokasi" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 space-y-4">
              <span className="text-[#039088] font-semibold text-sm uppercase tracking-wider">Peta Lokasi</span>
              <h2 className="text-3xl font-extrabold text-slate-900">Sekretariat Karang Taruna</h2>
              <p className="text-slate-600 leading-relaxed">
                Pusat kegiatan dan balai serbaguna warga perumahan Pakal Residence. Terbuka untuk diskusi, kegiatan rutin, atau koordinasi antarwarga.
              </p>
              <div className="pt-2 text-sm text-slate-700 space-y-2">
                <p className="flex items-center gap-2 font-semibold"><MapPin size={18} className="text-[#039088]" /> Pakal Residence, Pakal, Surabaya</p>
                <p className="flex items-center gap-2 font-semibold"><Calendar size={18} className="text-[#039088]" /> Buka Setiap Sabtu & Minggu (16:00 - 21:00 WIB)</p>
              </div>
            </div>
            
            <div className="md:col-span-7 h-80 rounded-3xl overflow-hidden border border-slate-200 shadow-md">
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

      {/* FORM ASPIRASI */}
      <section id="kontak" className="py-20 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-[#039088] font-semibold text-sm uppercase tracking-wider">Ruang Komunikasi</span>
          <h2 className="text-3xl font-extrabold mb-4 mt-1">Suara & Aspirasi Warga</h2>
          <p className="text-slate-400 text-lg mb-8">Punya saran, aduan, atau ide kegiatan untuk Karang Taruna? Tuliskan pesanmu di bawah ini.</p>
          <form className="space-y-4 text-left" onSubmit={handleSubmitAspirasi}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="nama" type="text" required placeholder="Nama Lengkap / Blok" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#039088]" />
              <input name="wa" type="text" placeholder="No. WhatsApp (Opsional)" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#039088]" />
            </div>
            <textarea name="pesan" required rows="4" placeholder="Tuliskan saran atau ide kegiatanmu..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#039088]"></textarea>
            <button type="submit" className="w-full bg-[#039088] hover:bg-[#02756D] font-bold text-lg py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-[#039088]/20">
              Kirim Pesan Warga <Send size={20} />
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-500 py-8 text-center text-sm border-t border-slate-900 flex flex-col items-center justify-center gap-2">
        <p>© 2026 Karang Taruna Pakal Residence.</p>
        <button 
          onClick={() => {
            const pass = prompt('Masukkan Kata Sandi Admin:');
            if (pass === 'adminperumahan') {
              window.location.href = '/admin';
            } else if (pass) {
              alert('Kata sandi salah!');
            }
          }} 
          className="text-xs text-slate-500 hover:text-slate-300 transition underline flex items-center gap-1"
        >
          <ShieldCheck size={14} /> Akses Panel Admin
        </button>
      </footer>

      {/* MODAL DETAIL AGENDA */}
      <AnimatePresence>
        {selectedAgenda && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8">
              <button onClick={() => setSelectedAgenda(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"><X size={24}/></button>
              
              <span className="text-xs font-bold px-3 py-1 bg-[#E6F4F3] text-[#039088] rounded-full">{selectedAgenda.kategori}</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-3 mb-2">{selectedAgenda.judul}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">{selectedAgenda.deskripsiLengkap}</p>
              
              <div className="space-y-2 text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
                <p><strong>📅 Waktu:</strong> {selectedAgenda.tanggal} ({selectedAgenda.jam})</p>
                <p><strong>📍 Lokasi:</strong> {selectedAgenda.lokasi}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Susunan Panitia Acara</h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedAgenda.panitia.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-100/80 px-3.5 py-2 rounded-xl text-xs sm:text-sm">
                      <span className="text-slate-500 font-medium">{p.peran}</span>
                      <span className="text-slate-900 font-bold">{p.nama}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => handleDaftarKegiatan(selectedAgenda)}
                  className="w-full bg-[#039088] hover:bg-[#02756D] text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md"
                >
                  <UserCheck size={18} /> Daftar Peserta / Voluntir Acara Ini
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setIsDaftarOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"><X size={24}/></button>
              <span className="text-[#039088] font-semibold text-xs uppercase tracking-wider">Gabung Pemuda</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1 mb-2">Form Pendaftaran Anggota</h3>
              <p className="text-slate-600 text-xs mb-6">Khusus pemuda/i perumahan usia 15-30 tahun.</p>

              <form className="space-y-3" onSubmit={handleSubmitDaftar}>
                <input name="nama" type="text" required placeholder="Nama Lengkap" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#039088]" />
                <input name="blok" type="text" required placeholder="Blok / Nomor Rumah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#039088]" />
                <input name="umur" type="number" required placeholder="Usia (Tahun)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#039088]" />
                <select name="minat" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#039088]">
                  <option value="Humas & Medsos">Divisi Humas & Medsos</option>
                  <option value="Olahraga & Seni">Divisi Olahraga & Seni</option>
                  <option value="Lingkungan & Sosial">Divisi Lingkungan & Sosial</option>
                  <option value="Relawan Acara">Relawan Acara</option>
                </select>
                <button type="submit" className="w-full bg-[#039088] hover:bg-[#02756D] text-[#FFFFFF] font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md mt-2">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setIsDaftarUmkmOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"><X size={24}/></button>
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
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Foto Produk / Usaha (Opsional):</label>
                  <input name="fotoFile" type="file" accept="image/*" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#039088]" />
                </div>
                
                <button type="submit" className="w-full bg-[#039088] hover:bg-[#02756D] text-[#FFFFFF] font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md mt-2">
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