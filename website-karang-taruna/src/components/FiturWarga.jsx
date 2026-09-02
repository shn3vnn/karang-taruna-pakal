import { Store, Wallet, ArrowUpRight } from 'lucide-react';

export default function FiturWarga() {
  return (
    <section className="py-12 bg-[#FAF8F5] border-b border-[#E6E4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Card UMKM */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E6E4DF] flex flex-col justify-between hover:border-[#0F766E] transition">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#E8F5F3] text-[#0F766E] flex items-center justify-center mb-4">
                <Store size={20} />
              </div>
              <h3 className="text-xl font-bold text-[#1C1F1D] mb-2">
                Dukungan UMKM Tetangga
              </h3>
              <p className="text-sm text-[#525854] leading-relaxed mb-6">
                Wadah promosi gratis usaha mikro milik warga perumahan. Mari saling mendukung perekonomian tetangga sendiri.
              </p>
            </div>

            <a 
              href="#umkm" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:underline"
            >
              Lihat Katalog UMKM <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Card Kas Digital */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E6E4DF] flex flex-col justify-between hover:border-[#0F766E] transition">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#E8F5F3] text-[#0F766E] flex items-center justify-center mb-4">
                <Wallet size={20} />
              </div>
              <h3 className="text-xl font-bold text-[#1C1F1D] mb-2">
                Transparansi Kas Digital
              </h3>
              <p className="text-sm text-[#525854] leading-relaxed mb-6">
                Laporan keuangan kas Karang Taruna terbuka secara real-time untuk menjaga kepercayaan seluruh warga perumahan.
              </p>
            </div>

            <a 
              href="#transparansi" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:underline"
            >
              Cek Laporan Keuangan <ArrowUpRight size={14} />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}