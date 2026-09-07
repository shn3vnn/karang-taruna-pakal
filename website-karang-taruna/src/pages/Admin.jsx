import { useState, useEffect } from 'react';
import { Users, Store, Calendar, CheckCircle, XCircle, ArrowLeft, Trash2, Plus, Lock, LogOut, Wallet, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Admin({ onLogout }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const ADMIN_PASSWORD = "adminperumahan";

  const [activeTab, setActiveTab] = useState('pendaftaran');
  const [pendaftar, setPendaftar] = useState([]);
  const [umkmList, setUmkmList] = useState([]);
  const [transaksiKas, setTransaksiKas] = useState([]);
  const [kegiatanList, setKegiatanList] = useState([]);

  // State Kelola Galeri
  const [galeriList, setGaleriList] = useState([]);
  const [uploadingGaleri, setUploadingGaleri] = useState(false);
  const [selectedGaleriFile, setSelectedGaleriFile] = useState(null);

  // Load Data dari Supabase Cloud
  const loadData = async () => {
    const resPendaftar = await supabase.from('pendaftar').select('*').order('id', { ascending: false });
    if (resPendaftar.data) setPendaftar(resPendaftar.data);

    const resUmkm = await supabase.from('umkm').select('*').order('id', { ascending: false });
    if (resUmkm.data) setUmkmList(resUmkm.data);

    const resKas = await supabase.from('kas').select('*').order('id', { ascending: false });
    if (resKas.data) setTransaksiKas(resKas.data);

    const resKegiatan = await supabase.from('kegiatan').select('*').order('id', { ascending: false });
    if (resKegiatan.data) setKegiatanList(resKegiatan.data);

    const resGaleri = await supabase.from('galeri').select('*').order('id', { ascending: false });
    if (resGaleri.data) setGaleriList(resGaleri.data);
  };

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('admin_authenticated');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
    loadData();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  // FUNGSI KELUAR & NAVIGASI KEMBALI KE WEB UTAMA
  const handleExitAdmin = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setPasswordInput('');
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  // --- KAS DIGITAL ---
  const handleAddTransaksi = async (e) => {
    e.preventDefault();
    const tgl = e.target.tgl.value;
    const jenis = e.target.jenis.value;
    const keterangan = e.target.keterangan.value;
    const nominal = Number(e.target.nominal.value);

    const { error } = await supabase.from('kas').insert([{ tgl, jenis, keterangan, nominal }]);
    if (!error) {
      loadData();
      e.target.reset();
    }
  };

  const handleDeleteTransaksi = async (id) => {
    await supabase.from('kas').delete().eq('id', id);
    loadData();
  };

  // --- APPROVAL ANGGOTA ---
  const handleApproveAnggota = async (id) => {
    await supabase.from('pendaftar').update({ status: 'Disetujui' }).eq('id', id);
    loadData();
  };

  const handleRejectAnggota = async (id) => {
    await supabase.from('pendaftar').update({ status: 'Ditolak' }).eq('id', id);
    loadData();
  };

  const handleDeleteAnggota = async (id) => {
    await supabase.from('pendaftar').delete().eq('id', id);
    loadData();
  };

  // --- APPROVAL UMKM ---
  const handleApproveUmkm = async (id) => {
    await supabase.from('umkm').update({ status: 'Disetujui' }).eq('id', id);
    loadData();
  };

  const handleRejectUmkm = async (id) => {
    await supabase.from('umkm').update({ status: 'Ditolak' }).eq('id', id);
    loadData();
  };

  const handleDeleteUmkm = async (id) => {
    await supabase.from('umkm').delete().eq('id', id);
    loadData();
  };

  // --- KELOLA KEGIATAN SUPABASE ---
  const handleAddKegiatan = async (e) => {
    e.preventDefault();
    const judul = e.target.judul.value;
    const tanggal = e.target.tanggal.value;
    const lokasi = e.target.lokasi.value;

    const { error } = await supabase.from('kegiatan').insert([
      { 
        judul, 
        tanggal, 
        lokasi,
        foto: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600"
      }
    ]);

    if (error) {
      alert('Gagal menambah kegiatan: ' + error.message);
    } else {
      loadData();
      e.target.reset();
    }
  };

  const handleDeleteKegiatan = async (id) => {
    await supabase.from('kegiatan').delete().eq('id', id);
    loadData();
  };

  // --- KELOLA GALERI FOTO ---
  const handleAddGaleri = async (e) => {
    e.preventDefault();
    const judul = e.target.judul.value;
    const kategori = e.target.kategori.value;
    const tanggal = e.target.tanggal.value;
    const deskripsi = e.target.deskripsi.value;
    let urlInput = e.target.url_foto ? e.target.url_foto.value : '';

    setUploadingGaleri(true);

    try {
      let finalSrc = urlInput;

      // Upload file jika ada yang dipilih
      if (selectedGaleriFile) {
        const fileExt = selectedGaleriFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `galeri/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('kegiatan')
          .upload(filePath, selectedGaleriFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('kegiatan')
          .getPublicUrl(filePath);

        finalSrc = publicUrlData.publicUrl;
      }

      if (!finalSrc) {
        alert('Harap unggah file foto atau masukkan URL gambar!');
        setUploadingGaleri(false);
        return;
      }

      const { error } = await supabase.from('galeri').insert([
        {
          judul,
          kategori,
          tanggal: tanggal || 'Terbaru',
          deskripsi,
          src: finalSrc
        }
      ]);

      if (error) {
        alert('Gagal menambah galeri: ' + error.message);
      } else {
        loadData();
        e.target.reset();
        setSelectedGaleriFile(null);
      }
    } catch (err) {
      alert('Terjadi kesalahan: ' + (err.message || err));
    } finally {
      setUploadingGaleri(false);
    }
  };

  const handleDeleteGaleri = async (id) => {
    await supabase.from('galeri').delete().eq('id', id);
    loadData();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="w-14 h-14 bg-[#E6F4F3] text-[#039088] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={28} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Login Admin</h2>
          <p className="text-slate-500 text-xs mt-1 mb-6">Area khusus pengurus Karang Taruna.</p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi Admin</label>
              <input 
                type="password" 
                required 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Masukkan kata sandi..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#039088]"
              />
            </div>

            {loginError && <p className="text-xs font-bold text-rose-500">Kata sandi salah!</p>}

            <button type="submit" className="w-full bg-[#039088] hover:bg-[#02756D] text-white font-bold py-3.5 rounded-xl transition text-sm shadow-md">
              Masuk Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <button onClick={handleExitAdmin} className="w-full text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1">
              <ArrowLeft size={14} /> Kembali ke Website Utama
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      
      <header className="bg-slate-900 text-white py-4 px-6 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#039088] rounded-xl flex items-center justify-center font-bold">K</div>
          <div>
            <h1 className="text-base font-bold leading-tight">Dashboard Admin</h1>
            <p className="text-xs text-slate-400">Karang Taruna Perumahan</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleExitAdmin} className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 px-4 py-2 rounded-xl transition">
            <ArrowLeft size={16} /> Ke Web Utama
          </button>
          <button onClick={handleExitAdmin} className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 px-4 py-2 rounded-xl transition border border-rose-500/20">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-12 gap-8">
        
        <div className="md:col-span-3 space-y-2">
          <button onClick={() => setActiveTab('pendaftaran')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition ${activeTab === 'pendaftaran' ? 'bg-[#039088] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-200'}`}>
            <Users size={18} /> Persetujuan Anggota
          </button>

          <button onClick={() => setActiveTab('umkm')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition ${activeTab === 'umkm' ? 'bg-[#039088] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-200'}`}>
            <Store size={18} /> Persetujuan UMKM
          </button>

          <button onClick={() => setActiveTab('kas')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition ${activeTab === 'kas' ? 'bg-[#039088] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-200'}`}>
            <Wallet size={18} /> Kelola Kas Digital
          </button>

          <button onClick={() => setActiveTab('kegiatan')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition ${activeTab === 'kegiatan' ? 'bg-[#039088] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-200'}`}>
            <Calendar size={18} /> Kelola Kegiatan
          </button>

          <button onClick={() => setActiveTab('galeri')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition ${activeTab === 'galeri' ? 'bg-[#039088] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-200'}`}>
            <ImageIcon size={18} /> Kelola Galeri Foto
          </button>
        </div>

        <div className="md:col-span-9">
          
          {/* TAB 1: KELOLA KAS DIGITAL */}
          {activeTab === 'kas' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Catat Transaksi Kas Baru</h3>
                <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" onSubmit={handleAddTransaksi}>
                  <input name="tgl" type="date" required className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs" />
                  <select name="jenis" className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs">
                    <option value="masuk">Pemasukan (+)</option>
                    <option value="keluar">Pengeluaran (-)</option>
                  </select>
                  <input name="nominal" type="number" required placeholder="Nominal (Rp)" className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs" />
                  <input name="keterangan" type="text" required placeholder="Keterangan transaksi" className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs" />
                  
                  <button type="submit" className="sm:col-span-2 lg:col-span-4 bg-[#039088] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md">
                    <Plus size={16} /> Simpan Transaksi Kas ke Supabase
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Riwayat Mutasi Kas</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Tanggal</th>
                        <th className="p-3">Jenis</th>
                        <th className="p-3">Keterangan</th>
                        <th className="p-3">Nominal</th>
                        <th className="p-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transaksiKas.map((t) => (
                        <tr key={t.id}>
                          <td className="p-3 text-slate-500">{t.tgl}</td>
                          <td className="p-3 font-bold">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] ${t.jenis === 'masuk' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                              {t.jenis.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3">{t.keterangan}</td>
                          <td className="p-3 font-bold">Rp {Number(t.nominal).toLocaleString('id-ID')}</td>
                          <td className="p-3 text-center">
                            <button onClick={() => handleDeleteTransaksi(t.id)} className="text-slate-400 hover:text-rose-600 transition"><Trash2 size={16}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSETUJUAN ANGGOTA */}
          {activeTab === 'pendaftaran' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Persetujuan Pendaftaran Anggota</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Nama</th>
                      <th className="p-3">Blok</th>
                      <th className="p-3">Usia</th>
                      <th className="p-3">Minat</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendaftar.map((p) => (
                      <tr key={p.id}>
                        <td className="p-3 font-bold">{p.nama}</td>
                        <td className="p-3 text-slate-600">{p.blok}</td>
                        <td className="p-3 text-slate-600">{p.umur} thn</td>
                        <td className="p-3 text-slate-600">{p.minat}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700' : p.status === 'Ditolak' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 flex justify-center gap-2">
                          {p.status === 'Pending' ? (
                            <>
                              <button onClick={() => handleApproveAnggota(p.id)} className="p-1.5 bg-emerald-500 text-white rounded-lg"><CheckCircle size={16}/></button>
                              <button onClick={() => handleRejectAnggota(p.id)} className="p-1.5 bg-rose-500 text-white rounded-lg"><XCircle size={16}/></button>
                            </>
                          ) : (
                            <button onClick={() => handleDeleteAnggota(p.id)} className="p-1.5 text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PERSETUJUAN UMKM */}
          {activeTab === 'umkm' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Persetujuan Pendaftaran UMKM</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Foto</th>
                      <th className="p-3">Nama Usaha</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">WhatsApp</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {umkmList.map((u) => (
                      <tr key={u.id}>
                        <td className="p-3">
                          <img src={u.foto} alt={u.nama} className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                        </td>
                        <td className="p-3 font-bold">{u.nama}</td>
                        <td className="p-3 text-slate-600">{u.kategori}</td>
                        <td className="p-3 text-slate-600">{u.wa}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700' : u.status === 'Ditolak' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3 flex justify-center gap-2">
                          {u.status === 'Pending' ? (
                            <>
                              <button onClick={() => handleApproveUmkm(u.id)} className="p-1.5 bg-emerald-500 text-white rounded-lg"><CheckCircle size={16}/></button>
                              <button onClick={() => handleRejectUmkm(u.id)} className="p-1.5 bg-rose-500 text-white rounded-lg"><XCircle size={16}/></button>
                            </>
                          ) : (
                            <button onClick={() => handleDeleteUmkm(u.id)} className="p-1.5 text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: KELOLA KEGIATAN */}
          {activeTab === 'kegiatan' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Tambah Kegiatan Acara Baru</h3>
                <form className="grid grid-cols-1 sm:grid-cols-3 gap-4" onSubmit={handleAddKegiatan}>
                  <input name="judul" required type="text" placeholder="Nama Kegiatan" className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm" />
                  <input name="tanggal" required type="text" placeholder="Tanggal (Contoh: 10 Sept 2026)" className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm" />
                  <input name="lokasi" required type="text" placeholder="Lokasi Kegiatan" className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm" />
                  <button type="submit" className="sm:col-span-3 bg-[#039088] text-white font-bold py-3 rounded-xl text-sm shadow-md">
                    Tambahkan Kegiatan ke Supabase
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Daftar Kegiatan Terdaftar</h3>
                <div className="space-y-3">
                  {kegiatanList.length === 0 ? (
                    <p className="text-xs text-slate-400">Belum ada kegiatan yang tersimpan di database.</p>
                  ) : (
                    kegiatanList.map((k) => (
                      <div key={k.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{k.judul}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{k.tanggal} • {k.lokasi}</p>
                        </div>
                        <button onClick={() => handleDeleteKegiatan(k.id)} className="text-slate-400 hover:text-rose-600 transition p-1.5">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KELOLA GALERI FOTO */}
          {activeTab === 'galeri' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Tambah Foto Galeri Kegiatan</h3>
                <form className="space-y-4 text-xs sm:text-sm" onSubmit={handleAddGaleri}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input name="judul" required type="text" placeholder="Judul Kegiatan / Foto" className="bg-slate-50 border border-slate-200 p-3 rounded-xl" />
                    <select name="kategori" className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                      <option value="Olahraga">Olahraga</option>
                      <option value="Organisasi">Organisasi</option>
                      <option value="Edukasi">Edukasi</option>
                      <option value="Sosial">Sosial</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input name="tanggal" type="text" placeholder="Tanggal / Bulan (Contoh: Agustus 2026)" className="bg-slate-50 border border-slate-200 p-3 rounded-xl" />
                    <div>
                      <label className="block text-[11px] text-slate-500 font-semibold mb-1">Pilih File Foto (Upload Storage):</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setSelectedGaleriFile(e.target.files[0])}
                        className="w-full text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#E6F4F3] file:text-[#039088] hover:file:bg-[#d5eee8] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <input name="url_foto" type="url" placeholder="Atau masukkan URL Gambar langsung (https://...)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs" />
                  </div>

                  <div>
                    <textarea name="deskripsi" rows="2" placeholder="Deskripsi singkat mengenai foto kegiatan ini..." className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs"></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={uploadingGaleri}
                    className="w-full bg-[#039088] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md disabled:opacity-50"
                  >
                    {uploadingGaleri ? (
                      <>
                        <Loader2 className="animate-spin" size={16} /> Mengunggah Gambar...
                      </>
                    ) : (
                      <>
                        <Upload size={16} /> Simpan foto ke Galeri Supabase
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Daftar Foto Galeri Terdaftar</h3>
                {galeriList.length === 0 ? (
                  <p className="text-xs text-slate-400">Belum ada foto yang tersimpan di galeri database.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galeriList.map((g) => (
                      <div key={g.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex flex-col justify-between">
                        <div className="h-36 bg-slate-900 relative">
                          <img src={g.src} alt={g.judul} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 text-slate-900 font-bold text-[10px] rounded-md">
                            {g.kategori}
                          </span>
                        </div>
                        <div className="p-3.5 flex-grow flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{g.judul}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{g.deskripsi || '-'}</p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200 text-[10px]">
                            <span className="text-slate-400 font-medium">{g.tanggal}</span>
                            <button onClick={() => handleDeleteGaleri(g.id)} className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1">
                              <Trash2 size={13} /> Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}