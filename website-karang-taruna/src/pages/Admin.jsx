import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Store, Calendar, CheckCircle, XCircle, ArrowLeft, Trash2, Plus, Lock, LogOut, Wallet } from 'lucide-react';
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
  const [kegiatanList, setKegiatanList] = useState([
    { id: 'k-1', judul: "Kerja Bakti Masal & Penghijauan", tanggal: "10 Sept 2026", lokasi: "Lapangan Utama & Taman Blok A" },
    { id: 'k-2', judul: "Turnamen Bulutangkis Antar RT", tanggal: "20 Sept 2026", lokasi: "Lapangan Serbaguna Perumahan" }
  ]);

  // Load Data dari Supabase Cloud
  const loadData = async () => {
    const resPendaftar = await supabase.from('pendaftar').select('*').order('id', { ascending: false });
    if (resPendaftar.data) setPendaftar(resPendaftar.data);

    const resUmkm = await supabase.from('umkm').select('*').order('id', { ascending: false });
    if (resUmkm.data) setUmkmList(resUmkm.data);

    const resKas = await supabase.from('kas').select('*').order('id', { ascending: false });
    if (resKas.data) setTransaksiKas(resKas.data);
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

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setPasswordInput('');
    if (onLogout) {
      onLogout(); // Kembali ke tampilan App.jsx
    }
  };

  const handleGoHome = (e) => {
    e.preventDefault();
    if (onLogout) {
      onLogout(); // Kembali ke tampilan App.jsx
    } else {
      window.location.href = '/';
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
            <button onClick={handleGoHome} className="w-full text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1">
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
          <button onClick={handleGoHome} className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 px-4 py-2 rounded-xl transition">
            <ArrowLeft size={16} /> Ke Web Utama
          </button>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 px-4 py-2 rounded-xl transition border border-rose-500/20">
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
                <form className="grid grid-cols-1 sm:grid-cols-3 gap-4" onSubmit={(e) => {
                  e.preventDefault();
                  setKegiatanList([...kegiatanList, { id: Date.now(), judul: e.target.judul.value, tanggal: e.target.tanggal.value, lokasi: e.target.lokasi.value }]);
                  e.target.reset();
                }}>
                  <input name="judul" required type="text" placeholder="Nama Kegiatan" className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm" />
                  <input name="tanggal" required type="text" placeholder="Tanggal" className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm" />
                  <input name="lokasi" required type="text" placeholder="Lokasi Kegiatan" className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm" />
                  <button type="submit" className="sm:col-span-3 bg-[#039088] text-white font-bold py-3 rounded-xl text-sm">Tambahkan Kegiatan</button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}