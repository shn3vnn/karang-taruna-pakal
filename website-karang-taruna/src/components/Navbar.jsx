import { useState } from 'react';
import { Menu, X } from 'lucide-react';

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
    <nav className="sticky top-0 z-40 bg-[#FAFAFA]/90 backdrop-blur-sm border-b border-[#E5E5E5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          
          <a href="#beranda" className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[#171717] text-white flex items-center justify-center font-mono text-xs font-bold">K</span>
            <span className="text-xs font-semibold tracking-tight text-[#171717]">PAKAL RESIDENCE</span>
          </a>

          <div className="hidden md:flex items-center gap-6 text-xs text-[#525252]">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="hover:text-[#171717] transition">{link.name}</a>
            ))}
          </div>

          <div className="hidden md:flex">
            <button onClick={onOpenDaftar} className="bg-[#171717] hover:bg-[#262626] text-white px-3.5 py-1.5 rounded text-xs font-medium transition">
              Bergabung
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 text-[#525252]">
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-[#E5E5E5] px-4 py-3 space-y-2 text-xs">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="block py-1 text-[#171717]">
              {link.name}
            </a>
          ))}
          <button onClick={() => { setIsOpen(false); onOpenDaftar(); }} className="w-full bg-[#171717] text-white py-2 rounded font-medium mt-2">
            Bergabung Pemuda
          </button>
        </div>
      )}
    </nav>
  );
}