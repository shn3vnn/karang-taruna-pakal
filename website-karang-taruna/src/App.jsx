import { useState, useEffect } from 'react';
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
  MapPin, 
  Send, 
  UserPlus, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  MessageSquare, 
  Search, 
  CheckCircle, 
  FileText, 
  Users 
} from 'lucide-react';

const heroPhotos = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800"
];

const agendaListStatic = [
  {
    id: 'default-1',
    judul: "Kerja Bakti Masal & Penghijauan",
    kategori: "Sosial & Lingkungan",
    tglHari: "10",
    tglBulan: "SEPT",
    tahun: "2026",
    jam: "07:00 WIB - Selesai",
    lokasi: "Lapangan Utama & Taman Blok A",
    deskripsiRingkas: "Pembersihan saluran air, penataan taman blok A, dan penanaman bibit pohon.",
    deskripsiLengkap: "Kegiatan gotong royong rutin untuk seluruh warga perumahan Pakal Residence. Diharapkan setiap rumah mengirimkan perwakilannya. Karang Taruna menyediakan konsumsi dan peralatan kebersihan pendukung.",
    panitia: [
      { peran: "Ketua Pelaksana", nama: "Budi Santoso" },
      { peran: "Koordinator Lapangan", nama: "Ahmad Rifai" },
      { peran: "Konsumsi & Logistik", nama: "Dina Mariana" }
    ],
    waPJ: "6285739439137",
    foto: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 'default-2',
    judul: "Turnamen Bulutangkis Antar RT",
    kategori: "Olahraga Warga",
    tglHari: "20",
    tglBulan: "SEPT",
    tahun: "2026",
    jam: "18:30 WIB - Selesai",
    lokasi: "Lapangan Serbaguna Perumahan",
    deskripsiRingkas: "Ajang silaturahmi ganda putra & putri memperebutkan Piala Bergilir.",
    deskripsiLengkap: "Turnamen ramah terbuka untuk warga usia 15 tahun ke atas. Sistem kompetisi santai untuk mempererat keakraban antar blok.",
    panitia: [
      { peran: "Ketua Pelaksana", nama: "Siti Rahma" },
      { peran: "Wasit Utama", nama: "Rizky Pratama" }
    ],
    waPJ: "6285739439137",
    foto: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=600"
  }
];

const faqList = [
  { q: "Siapa saja yang boleh bergabung menjadi anggota Karang Taruna?", a: "Seluruh pemuda dan pemudi warga perumahan Pakal Residence berusia 15 hingga 30 tahun dapat bergabung menjadi anggota aktif Karang Taruna." },
  { q: "Bagaimana cara mendaftarkan usaha saya ke Katalog UMKM Tetangga?", a: "Kamu bisa mendaftarkan usaha melalui tombol '+ Daftarkan Usaha' pada bagian Katalog UMKM secara gratis." },
  { q: "Apakah laporan keuangan kas Karang Taruna diupdate berkala?", a: "Ya, pencatatan kas masuk dan keluar selalu di-update setiap bulan dan terbuka secara transparan untuk seluruh warga." }
];

export default function App() {
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [isDaftarOpen, setIsDaftarOpen] = useState(false);
  const [isDaftarUmkmOpen, setIsDaftarUmkmOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // --- INTEGRASI KEGIATAN SUPABASE ---
  const [agendas, setAgendas] = useState(agendaListStatic);

  useEffect(() => {
    fetchKegiatan();
  }, []);

  const fetchKegiatan = async () => {
    const { data, error } = await supabase
      .from('kegiatan')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data && data.length > 0) {
      const formattedData = data.map((item) => {
        const parts = item.tanggal ? item.tanggal.split(' ') : [];
        return {
          id: item.id,
          judul: item.judul,
          kategori: "Kegiatan Warga",
          tglHari: parts[0] || "10",
          tglBulan: parts[1] || "SEPT",
          tahun: parts[2] || "2026",
          jam: "Sesuai Jadwal",
          lokasi: item.lokasi,
          deskripsiRingkas: "Kegiatan rutin Karang Taruna Pakal Residence.",
          deskripsiLengkap: `Mari meramaikan acara ${item.judul} yang dilaksanakan di ${item.lokasi}.`,
          panitia: [{ peran: "Pengurus", nama: "Admin Karang Taruna" }],
          waPJ: "6285739439137",
          foto: item.foto || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600"
        };
      });
      setAgendas([...formattedData, ...agendaListStatic]);
    }
  };
  // ------------------------------------

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

  const handleDaftarKegiatan = (agenda) => {
    const textKegiatan = encodeURIComponent(`Halo Kak ${agenda.panitia[0].nama}, saya berminat untuk mendaftar / berpartisipasi dalam kegiatan:\n\nNama Kegiatan: ${agenda.judul}\nTanggal: ${agenda.tglHari} ${agenda.tglBulan} ${agenda.tahun}\nLokasi: ${agenda.lokasi}\n\nMohon informasi petunjuk selanjutnya. Terima kasih!`);
    window.location.href = `whatsapp://send?phone=${agenda.waPJ}&text=${textKegiatan}`;
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-[#18181B] font-sans antialiased">
      
      {/* NAVBAR */}
      <Navbar onOpenDaftar={() => setIsDaftarOpen(true)} />

      {/* HERO SECTION */}
      <section id="beranda" className="pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="relative rounded-3xl overflow-hidden min-h-[420px] sm:min-h-[500px] flex items-end p-8 sm:p-14 bg-slate-900 border border-slate-200">
            <img 
              src={heroPhotos[0]} 
              alt="Karang Taruna Pakal Residence" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

            <div className="relative z-10 max-w-2xl text-white space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12]">
                Gerakan Pemuda Pakal Residence
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                Wadahnya generasi muda untuk berkolaborasi, mengelola kegiatan sosial, mempublikasikan kas terbuka, serta memberdayakan ekonomi warga perumahan.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => setIsDaftarOpen(true)}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 px-7 py-3.5 rounded-full font-bold text-sm transition shadow-sm"
                >
                  Gabung Anggota <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ABOUT US & STATS SECTION */}
      <section id="tentang" className="py-12 bg-[#F4F4F5] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid md:grid-cols-12 gap-10 items-start">
            
            <div className="md:col-span-6 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Tentang Karang Taruna
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed max-w-lg">
                Karang Taruna Pakal Residence berdiri sebagai sarana pengembangan generasi muda yang berkarakter, mandiri, dan berjiwa sosial. Kami secara aktif menyelenggarakan kegiatan gotong royong, olahraga, keagamaan, serta menjadi wadah promosi UMKM lokal perumahan.
              </p>
            </div>

            <div className="md:col-span-6 grid grid-cols-2 gap-8">
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">150+</div>
                <p className="text-xs text-slate-500 font-medium mt-1">Pemuda Terdaftar</p>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">12+</div>
                <p className="text-xs text-slate-500 font-medium mt-1">Program / Tahun</p>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">100%</div>
                <p className="text-xs text-slate-500 font-medium mt-1">Kas Transparan</p>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">20+</div>
                <p className="text-xs text-slate-500 font-medium mt-1">UMKM Terdaftar</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FITUR KAS & SUMMARY */}
      <FiturWarga />

      {/* AGENDA KEGIATAN (MENGGUNAKAN DATA SUPABASE) */}
      <section id="agenda" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Agenda & Kegiatan</h2>
            <p className="text-slate-500 text-sm mt-1">Jadwal program kerja dan kegiatan rutin warga mendatang.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {agendas.map((item) => (
              <div key={item.id} className="group">
                <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mb-4">
                  <img src={item.foto} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-bold rounded-full border border-slate-200">
                    {item.tglHari} {item.tglBulan} {item.tahun}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{item.judul}</h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin size={13} /> {item.lokasi}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedAgenda(item)}
                    className="p-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition"
                  >
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

      {/* SEKSI VISI & MISI */}
      <section id="visi-misi" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase block mb-1">Pilar Organisasi</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Visi & Misi Kami</h2>
            <p className="text-slate-500 text-sm mt-1">Arah gerak dan komitmen Karang Taruna Pakal Residence untuk kemajuan perumahan.</p>
          </div>

          <div className="grid md:grid-cols-12 gap-10 items-stretch">
            
            {/* Foto Kiri Melengkung */}
            <div className="md:col-span-5 min-h-[380px] rounded-3xl overflow-hidden bg-slate-900 relative border border-slate-200">
              <img 
                src={heroPhotos[1]} 
                alt="Kebersamaan Karang Taruna Pakal Residence" 
                className="w-full h-full object-cover opacity-60" 
              />
              <div className="absolute inset-0 bg-slate-950/40 p-8 flex flex-col justify-center items-center text-center text-white">
                <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-400 mb-2 px-3 py-1 bg-emerald-950/50 rounded-full border border-emerald-500/30">
                  Visi Utama
                </span>
                <p className="text-lg sm:text-xl font-bold leading-relaxed max-w-sm">
                  "Mewujudkan Generasi Muda Pakal Residence yang Mandiri, Solid, Kreatif, dan Bermanfaat bagi Lingkungan Warga."
                </p>
              </div>
            </div>

            {/* List Kanan (Misi Organisasi) */}
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

      {/* STRUKTUR PENGURUS */}
      <Pengurus />

      {/* FAQ */}
      <section className="py-16 bg-[#F4F4F5] border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Pertanyaan Umum</h2>
          </div>

          <div className="space-y-3">
            {faqList.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 flex justify-between items-center text-sm"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className={`text-slate-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP SEKRETARIAT */}
      <section id="lokasi" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 space-y-3">
              <h2 className="text-3xl font-bold text-slate-900">Sekretariat Karang Taruna</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pusat kegiatan, koordinasi, dan balai serbaguna warga perumahan Pakal Residence, Surabaya.
              </p>
              <div className="text-xs text-slate-800 space-y-1 pt-2 font-medium">
                <p>📍 Pakal Residence, Pakal, Surabaya</p>
                <p>🕒 Sabtu & Minggu (16:00 - 21:00 WIB)</p>
              </div>
            </div>
            <div className="md:col-span-7 h-72 border border-slate-200 rounded-3xl overflow-hidden bg-slate-100">
              <iframe 
                title="Peta Lokasi Sekretariat"
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
      <section id="kontak" className="py-16 bg-slate-950 text-white">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Suara & Masukan Warga</h2>
            <p className="text-slate-400 text-xs mt-2">Punya ide acara atau saran kebersihan? Tuliskan pesanmu di bawah ini.</p>
          </div>

          <form className="space-y-3" onSubmit={handleSubmitAspirasi}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input name="nama" type="text" required placeholder="Nama / Blok Rumah" className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white" />
              <input name="wa" type="text" placeholder="No. WhatsApp (Opsional)" className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white" />
            </div>
            <textarea name="pesan" required rows="3" placeholder="Tuliskan saran atau masukanmu..." className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white"></textarea>
            <button type="submit" className="w-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs py-3.5 rounded-full transition flex items-center justify-center gap-2">
              Kirim Pesan Warga <Send size={15} />
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-500 py-8 text-center text-xs border-t border-slate-900">
        <p>© 2026 Karang Taruna Pakal Residence • Surabaya.</p>
        <button 
          onClick={() => {
            const pass = prompt('Masukkan Kata Sandi Admin:');
            if (pass === 'adminperumahan') setIsAdminLoggedIn(true);
            else if (pass) alert('Kata sandi salah!');
          }} 
          className="text-slate-500 hover:text-slate-300 transition underline mt-2 flex items-center gap-1 mx-auto"
        >
          <ShieldCheck size={14} /> Akses Panel Admin
        </button>
      </footer>

      {/* MODAL AGENDA */}
      <AnimatePresence>
        {selectedAgenda && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full relative">
              <button onClick={() => setSelectedAgenda(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"><X size={20}/></button>
              <span className="text-xs font-bold text-slate-500">{selectedAgenda.kategori}</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 mb-2">{selectedAgenda.judul}</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">{selectedAgenda.deskripsiLengkap}</p>
              
              <div className="text-xs text-slate-800 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 space-y-1 font-medium">
                <p>📅 {selectedAgenda.tglHari} {selectedAgenda.tglBulan} {selectedAgenda.tahun} ({selectedAgenda.jam})</p>
                <p>📍 {selectedAgenda.lokasi}</p>
              </div>

              <button onClick={() => handleDaftarKegiatan(selectedAgenda)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-full text-xs transition mb-2">
                Daftar Peserta Acara
              </button>
              <button onClick={() => setSelectedAgenda(null)} className="w-full bg-slate-100 text-slate-600 font-bold py-3 rounded-full text-xs">
                Tutup
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL ANGGOTA */}
      <AnimatePresence>
        {isDaftarOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full relative">
              <button onClick={() => setIsDaftarOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"><X size={20}/></button>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">Form Pendaftaran Anggota</h3>
              <p className="text-xs text-slate-500 mb-5">Khusus pemuda/i perumahan usia 15-30 tahun.</p>

              <form className="space-y-3" onSubmit={handleSubmitDaftar}>
                <input name="nama" type="text" required placeholder="Nama Lengkap" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-slate-900" />
                <input name="blok" type="text" required placeholder="Blok / Nomor Rumah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-slate-900" />
                <input name="umur" type="number" required placeholder="Usia (Tahun)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-slate-900" />
                <select name="minat" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-slate-900">
                  <option value="Humas & Medsos">Divisi Humas & Medsos</option>
                  <option value="Olahraga & Seni">Divisi Olahraga & Seni</option>
                  <option value="Lingkungan & Sosial">Divisi Lingkungan & Sosial</option>
                </select>
                <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-full text-xs transition mt-2">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full relative">
              <button onClick={() => setIsDaftarUmkmOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"><X size={20}/></button>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">Daftarkan Usaha UMKM</h3>
              <p className="text-xs text-slate-500 mb-5">Promosikan produk/jasa ke warga perumahan secara gratis.</p>

              <form className="space-y-3" onSubmit={handleSubmitDaftarUmkm}>
                <input name="nama" type="text" required placeholder="Nama Toko / Usaha" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-slate-900" />
                <select name="kategori" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-slate-900">
                  <option value="Kuliner">Kuliner</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Jasa">Jasa</option>
                </select>
                <input name="wa" type="text" required placeholder="No. WA Penjual (628...)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-slate-900" />
                <textarea name="deskripsi" required rows="3" placeholder="Deskripsi singkat produk..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-slate-900"></textarea>
                <input name="fotoFile" type="file" accept="image/*" className="w-full text-xs" />
                <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-full text-xs transition mt-2">
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