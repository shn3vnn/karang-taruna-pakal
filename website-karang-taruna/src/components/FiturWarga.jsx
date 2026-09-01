import { Store, Wallet, ArrowUpRight } from 'lucide-react';

export default function FiturWarga() {
  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          
          <div className="bg-[#E6F4F3] border border-[#039088]/20 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-[#039088] text-white rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <Store size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Dukungan UMKM Tetangga</h3>
              <p className="text-slate-600 leading-relaxed">
                Wadah promosi gratis usaha mikro milik warga perumahan. Mari saling mendukung perekonomian tetangga sendiri.
              </p>
            </div>
            <a href="#" className="inline-flex items-center gap-2 text-[#039088] font-bold mt-8 hover:underline">
              Lihat Katalog UMKM <ArrowUpRight size={18} />
            </a>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <Wallet size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Transparansi Kas Digital</h3>
              <p className="text-slate-600 leading-relaxed">
                Laporan keuangan kas Karang Taruna terbuka secara real-time untuk menjaga kepercayaan seluruh warga perumahan.
              </p>
            </div>
            <a href="#" className="inline-flex items-center gap-2 text-slate-900 font-bold mt-8 hover:underline">
              Cek Laporan Keuangan <ArrowUpRight size={18} />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}