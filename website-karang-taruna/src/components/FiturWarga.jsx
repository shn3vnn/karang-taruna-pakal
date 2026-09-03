import { ArrowUpRight, Store, Wallet } from 'lucide-react';

export default function FiturWarga() {
  return (
    <section className="py-12 bg-[#F4F4F5] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          
          <div className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-col justify-between hover:border-slate-400 transition">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mb-5">
                <Store size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Dukungan UMKM Tetangga</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-8">
                Promosi gratis untuk usaha mikro warga perumahan. Mari berbelanja dan saling mendukung perekonomian tetangga sendiri.
              </p>
            </div>
            <a href="#umkm" className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:underline">
              Lihat Katalog UMKM <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-col justify-between hover:border-slate-400 transition">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mb-5">
                <Wallet size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Transparansi Kas Digital</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-8">
                Catatan mutasi kas masuk dan keluar di-update secara berkala dan transparan untuk menjaga kejelasan keuangan organisasi.
              </p>
            </div>
            <a href="#transparansi" className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:underline">
              Cek Laporan Keuangan <ArrowUpRight size={14} />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}