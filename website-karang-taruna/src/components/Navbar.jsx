import { useState } from 'react';
import { Menu, X, UserPlus } from 'lucide-react';

export default function Navbar({ onOpenDaftar }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Agenda', href: '#agenda' },
    { name: 'UMKM Warga', href: '#umkm' },
    { name: 'Transparansi', href: '#transparansi' },
    { name: 'Pengurus', href: '#pengurus' },
    { name: 'Lokasi', href: '#lokasi' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E6E4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <a href="#beranda" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-[#0F766E] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              K
            </div>
            <div>
              <span className="block text-sm font-extrabold text-[#1C1F1D] tracking-tight leading-none group-hover:text-[#0F766E] transition">
                KARANG TARUNA
              </span>
              <span className="block text-[10px] font-bold text-[#737A75] tracking-wider uppercase mt-0.5">
                PAKAL RESIDENCE
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#525854]">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="hover:text-[#0F766E] transition-colors py-1"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={onOpenDaftar}
              className="inline-flex items-center gap-2 bg-[#0F766E] hover:bg-[#0D645D] text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-xs"
            >
              <UserPlus size={14} /> Bergabung
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-[#525854] hover:bg-[#F2EFEA]"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-[#E6E4DF] px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-[#2D312E] hover:bg-[#FAF8F5]"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => { setIsOpen(false); onOpenDaftar(); }}
            className="w-full mt-2 bg-[#0F766E] text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2"
          >
            <UserPlus size={14} /> Bergabung Pemuda
          </button>
        </div>
      )}
    </nav>
  );
}