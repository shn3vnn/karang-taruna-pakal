import { useState } from 'react';
import { Menu, X, UserPlus } from 'lucide-react';

export default function Navbar({ onOpenDaftar }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#039088] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
              K
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 block leading-tight">KARANG TARUNA</span>
              <span className="text-xs text-[#039088] font-semibold tracking-wider uppercase">Pakal Residence</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 font-medium text-slate-600">
            <a href="#beranda" className="hover:text-[#039088] transition">Beranda</a>
            <a href="#agenda" className="hover:text-[#039088] transition">Agenda</a>
            <a href="#umkm" className="hover:text-[#039088] transition">UMKM Warga</a>
            <a href="#transparansi" className="hover:text-[#039088] transition">Transparansi</a>
            <a href="#profil" className="hover:text-[#039088] transition">Pengurus</a>
            <a href="#lokasi" className="hover:text-[#039088] transition">Lokasi</a>
          </div>

          {/* Tombol Bergabung Header */}
          <div className="hidden md:block">
            <button 
              onClick={onOpenDaftar}
              className="flex items-center gap-2 bg-[#039088] hover:bg-[#02756D] text-white px-5 py-2.5 rounded-full font-bold text-sm transition shadow-lg shadow-[#039088]/20"
            >
              <UserPlus size={16} /> Bergabung
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-700">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <a href="#beranda" onClick={() => setIsOpen(false)} className="block text-slate-600 font-medium py-2">Beranda</a>
          <a href="#agenda" onClick={() => setIsOpen(false)} className="block text-slate-600 font-medium py-2">Agenda</a>
          <a href="#umkm" onClick={() => setIsOpen(false)} className="block text-slate-600 font-medium py-2">UMKM Warga</a>
          <a href="#transparansi" onClick={() => setIsOpen(false)} className="block text-slate-600 font-medium py-2">Transparansi</a>
          <a href="#profil" onClick={() => setIsOpen(false)} className="block text-slate-600 font-medium py-2">Pengurus</a>
          <a href="#lokasi" onClick={() => setIsOpen(false)} className="block text-slate-600 font-medium py-2">Lokasi</a>
          <button 
            onClick={() => { setIsOpen(false); onOpenDaftar(); }}
            className="w-full flex items-center justify-center gap-2 bg-[#039088] text-white py-3 rounded-xl font-bold"
          >
            <UserPlus size={18} /> Bergabung Pemuda
          </button>
        </div>
      )}
    </nav>
  );
}