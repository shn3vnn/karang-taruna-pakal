import { ArrowUpRight } from 'lucide-react';

export default function FiturWarga() {
  return (
    <section className="py-12 border-b border-[#E5E5E5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-4">
          
          <div className="bg-white p-6 border border-[#E5E5E5] rounded flex flex-col justify-between hover:border-[#171717] transition">
            <div>
              <span className="text-[11px] font-mono text-[#737373] uppercase block mb-2">[ EKONOMI LOKAL ]</span>
              <h3 className="text-lg font-medium text-[#171717] mb-2">Dukungan UMKM Tetangga</h3>
              <p className="text-xs text-[#525252] leading-relaxed mb-6">
                Promosi gratis untuk usaha mikro warga perumahan. Mari berbelanja dan saling mendukung tetangga sendiri.
              </p>
            </div>
            <a href="#umkm" className="text-xs font-medium text-[#171717] hover:underline flex items-center gap-1">
              Lihat Katalog UMKM <ArrowUpRight size={13} />
            </a>
          </div>

          <div className="bg-white p-6 border border-[#E5E5E5] rounded flex flex-col justify-between hover:border-[#171717] transition">
            <div>
              <span className="text-[11px] font-mono text-[#737373] uppercase block mb-2">[ KETERBUKAAN ]</span>
              <h3 className="text-lg font-medium text-[#171717] mb-2">Transparansi Kas Digital</h3>
              <p className="text-xs text-[#525252] leading-relaxed mb-6">
                Catatan mutasi kas masuk dan keluar di-update setiap bulan secara terbuka untuk seluruh warga.
              </p>
            </div>
            <a href="#transparansi" className="text-xs font-medium text-[#171717] hover:underline flex items-center gap-1">
              Cek Laporan Keuangan <ArrowUpRight size={13} />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}