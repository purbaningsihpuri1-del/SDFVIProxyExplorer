import React from 'react';
import { 
  Scale, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  FileText, 
  Building, 
  Users, 
  AlertTriangle 
} from 'lucide-react';

export const PolicyInterpretation: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
              Pedoman Interpretasi Kebijakan & Batasan Empiris Pilot
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
              Panduan normatif bagi perencana Bappeda, BPBD, Dinas Sosial, Komnas Disabilitas, dan pemangku kepentingan daerah.
            </p>
          </div>
        </div>
      </div>

      {/* 5 Core Mandatory Policy Lexicons Grid */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
          5 Frasa Kunci Metodologis yang Wajib Dipegang Teguh
        </h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Dalam menyusun laporan, rekomendasi anggaran, atau materi advokasi, pengguna aplikasi diwajibkan menggunakan terminologi yang sesuai dengan koridor ilmiah:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Lexicon 1 */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">1</span>
              <span>"Prioritas Relatif untuk Verifikasi"</span>
            </div>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Urutan peringkat (1 sampai 18) menunjukkan urgensi kapanewon mana yang perlu diprioritaskan terlebih dahulu untuk verifikasi kebutuhan di lapangan, 
              bukan vonis absolut bahwa wilayah lain aman dari krisis.
            </p>
          </div>

          {/* Lexicon 2 */}
          <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/40 dark:bg-sky-950/20 space-y-2">
            <div className="flex items-center gap-2 text-sky-900 dark:text-sky-300 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px]">2</span>
              <span>"Indikator Skrining Makro-Spasial"</span>
            </div>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              SDFVI–Proxy bekerja sebagai alat penyaring awal (screening tool) pada level kapanewon untuk menyaring sinyal kerentanan gabungan sosial-iklim-lahan 
              sebelum tim intervensi diterjunkan.
            </p>
          </div>

          {/* Lexicon 3 */}
          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-2">
            <div className="flex items-center gap-2 text-rose-900 dark:text-rose-300 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">3</span>
              <span>"Bukan Prediksi Dampak Individual"</span>
            </div>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Tingginya skor suatu kapanewon tidak dapat diasumsikan bahwa setiap penyandang disabilitas di wilayah tersebut otomatis terdampak parah. 
              Kondisi riil bergantung pada jejaring keluarga dan modal sosial mikro.
            </p>
          </div>

          {/* Lexicon 4 */}
          <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 space-y-2">
            <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px]">4</span>
              <span>"Bukan Keputusan Otomatis (Algorithmic Decision-Making)"</span>
            </div>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Indeks ini dilarang dijadikan satu-satunya dasar algoritma untuk menghentikan, memotong, atau mengalihkan alokasi anggaran tanpa musyawarah tatap muka bersama komunitas setempat.
            </p>
          </div>

          {/* Lexicon 5 */}
          <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">5</span>
              <span>"Bukan Bukti Bahwa Kekeringan Menyebabkan Suatu Dampak Tertentu (No Unsubstantiated Causal Claims)"</span>
            </div>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              SDFVI–Proxy mengukur ko-eksistensi spasial antara bahaya meteorologis, sensitivitas demografis, dan rasio luas panen. 
              Data ini tidak membuktikan hubungan kausalitas sepihak (seperti klaim bahwa defisit hujan langsung memicu kekurangan gizi disabilitas) tanpa riset kausal mendalam.
            </p>
          </div>
        </div>
      </div>

      {/* Do's and Don'ts for Policy Makers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* DO */}
        <div className="bg-white dark:bg-neutral-800 border border-emerald-200 dark:border-emerald-900/60 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Praktik Terbaik (Yang Dianjurkan)</span>
          </div>
          <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Menggunakan hasil pemeringkatan untuk mengarahkan rute dropping air BPBD ke kalurahan yang memiliki konsentrasi lansia dan disabilitas tinggi.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Mengintegrasikan data ADK (Anak Dengan Kedisabilitasan) dan lansia terlantar ke dalam sistem peringatan dini kekeringan tingkat kabupaten.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Melakukan audit aksesibilitas fisik sarana penampungan air hujan (PAH) komunal di wilayah prioritas Tinggi.</span>
            </li>
          </ul>
        </div>

        {/* DON'T */}
        <div className="bg-white dark:bg-neutral-800 border border-rose-200 dark:border-rose-900/60 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-sm">
            <XCircle className="w-5 h-5" />
            <span>Praktik Dilarang (Misinterpretasi)</span>
          </div>
          <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span>Menyebut skor H sebagai "kelembaban tanah", "ketersediaan air tanah", atau "dampak kekeringan riil".</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span>Menyebut F_area sebagai "produksi pangan", "produktivitas lahan", "ketahanan pangan rumah tangga", atau "defisit pangan aktual".</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span>Mengurangi anggaran bantuan sosial untuk wilayah kategori Sedang atau Rendah dengan asumsi sepihak bahwa mereka tidak membutuhkan bantuan.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
