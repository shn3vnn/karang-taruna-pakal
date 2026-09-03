import { useState } from 'react';
import { Menu, X, UserPlus } from 'lucide-react';

export default function Navbar({ onOpenDaftar }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Visi & Misi', href: '#visi-misi' },
    { name: 'Agenda', href: '#agenda' },
    { name: 'UMKM Warga', href: '#umkm' },
    { name: 'Transparansi', href: '#transparansi' },
    { name: 'Pengurus', href: '#pengurus' },
    { name: 'Lokasi', href: '#lokasi' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <a href="#beranda" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              K
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-900 tracking-tight leading-none">
                KARANG TARUNA
              </span>
              <span className="block text-[10px] font-medium text-slate-500 tracking-wider uppercase mt-1">
                PAKAL RESIDENCE
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="hover:text-slate-900 transition-colors">
                {link.name}
              </a>
            ))}
          </div>

          {/* Button */}
          <div className="hidden md:flex">
            <button 
              onClick={onOpenDaftar} 
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2"
            >
              <UserPlus size={14} /> Bergabung
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-700">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 text-xs font-semibold">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="block py-2 text-slate-800">
              {link.name}
            </a>
          ))}
          <button 
            onClick={() => { setIsOpen(false); onOpenDaftar(); }} 
            className="w-full bg-slate-900 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 mt-2"
          >
            <UserPlus size={14} /> Bergabung Pemuda
          </button>
        </div>
      )}
    </nav>
  );
}