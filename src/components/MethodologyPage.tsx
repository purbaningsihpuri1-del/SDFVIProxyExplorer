import React from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Quote, 
  Binary, 
  AlertOctagon, 
  ShieldAlert, 
  CloudRain, 
  Wheat, 
  Users, 
  Info 
} from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
              Metodologi Penelitian: Landasan Ilmiah, Formulasi, & Batasan Proksi
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
              Adaptasi Konseptual Framework DICLIV (Chile, 2026) Menuju Operasionalisasi SEHATI di Tingkat Kapanewon
            </p>
          </div>
        </div>
      </div>

      {/* Global Context: DICLIV Index Chile 2026 */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 pb-3">
          <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Quote className="w-4 h-4 text-emerald-600" />
            <span>Konteks Global: Disability-Inclusive Climate Vulnerability (DICLIV) Index</span>
          </h3>
          <a
            href="https://doi.org/10.3390/su18115645"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
          >
            <span>Rotarou & Figueroa (2026) DOI: 10.3390/su18115645</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          <p>
            <strong>1. Pelopor Global Indeks Iklim Inklusif Disabilitas:</strong> DICLIV (Rotarou & Figueroa, 2026, jurnal <em>Sustainability</em>) 
            merupakan indeks kerentanan iklim inklusif disabilitas pertama di tingkat sub-nasional secara global. 
            Studi ini mencakup 16 wilayah administratif di Chile dengan 29 indikator empiris yang terbagi ke dalam 3 dimensi utama kerentanan iklim IPCC.
          </p>
          <p>
            <strong>2. Inspirasi Adaptasi Indonesia (SEHATI):</strong> Peneliti terinspirasi oleh kerangka kerja DICLIV dan mengadaptasinya 
            ke dalam konteks desentralisasi sub-distrik di Indonesia dengan nama <strong>SEHATI</strong> 
            (<em>Sistem Evaluasi Kerentanan Iklim Inklusif Disabilitas</em>), yang dioperasionalkan bagi pemerintah daerah dan Komisi Nasional Disabilitas (Komnas Disabilitas).
          </p>
          <p>
            <strong>3. Implementasi Pilot SDFVI–Proxy Gunungkidul:</strong> Pilot Gunungkidul ini merupakan operasionalisasi empiris formulasi proksi 
            dari SEHATI (SDFVI–Proxy), memanfaatkan data administratif sub-distrik yang tersedia di mana 29 indikator lengkap DICLIV belum seluruhnya tercatat 
            dalam statistik rutin kapanewon.
          </p>
        </div>
      </div>

      {/* Scope of the Pilot: 18 Kapanewon Population */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 sm:p-6 shadow-xs space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Lingkup Pilot: Populasi Lengkap 18 Kapanewon (Bukan Sampel Statistik)</span>
        </h3>
        <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          Penelitian ini menelaah <strong>seluruh 18 kapanewon di Kabupaten Gunungkidul sebagai populasi wilayah lengkap (sensus spasial)</strong>, 
          bukan sampel acak. Oleh karena itu:
        </p>
        <ul className="list-disc pl-5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 space-y-1">
          <li>Normalisasi min–max dihitung atas rentang nilai minimum dan maksimum dari ke-18 unit tersebut.</li>
          <li>Skor yang dihasilkan bersifat komparatif internal di antara kapanewon Gunungkidul.</li>
          <li>Uji signifikansi sampel tidak diberlakukan karena seluruh unit populasi teramati.</li>
        </ul>
      </div>

      {/* Exact Mathematical Formulations */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Binary className="w-4 h-4 text-emerald-600" />
          <span>Formulasi Matematis Baku SDFVI–Proxy</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Formula L1 */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-700/30 border border-neutral-200 dark:border-neutral-700 space-y-2">
            <span className="font-bold text-xs text-indigo-700 dark:text-indigo-400">1. Sensitivitas Sosial (L1)</span>
            <div className="p-2.5 rounded bg-white dark:bg-neutral-800 font-mono text-xs border border-neutral-200 dark:border-neutral-700">
              L1 = (normalized_ADK + normalized_older_persons) / 2
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
              Rasio ADK (Anak dengan Kedisabilitasan / Ragam Disabilitas) per 1.000 jiwa dan Rasio Lansia Terlantar per 1.000 jiwa, dinormalisasi min–max (0 sampai 1).
            </p>
          </div>

          {/* Formula H */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-700/30 border border-neutral-200 dark:border-neutral-700 space-y-2">
            <span className="font-bold text-xs text-sky-700 dark:text-sky-400">2. Bahaya Meteorologis (H)</span>
            <div className="p-2.5 rounded bg-white dark:bg-neutral-800 font-mono text-xs border border-neutral-200 dark:border-neutral-700">
              H = 1 - ((mean_precip - min_precip) / (max_precip - min_precip))
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
              Inversi min–max presipitasi satelit CHIRPS (Juni–Oktober rata-rata tahun kemarau 2015, 2019, 2024). Nilai H makin mendekati 1 menandakan kekeringan makin parah.
            </p>
          </div>

          {/* Formula F_area */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-700/30 border border-neutral-200 dark:border-neutral-700 space-y-2">
            <span className="font-bold text-xs text-amber-700 dark:text-amber-400">3. Proksi Defisit Luas Panen (F_area)</span>
            <div className="p-2.5 rounded bg-white dark:bg-neutral-800 font-mono text-xs border border-neutral-200 dark:border-neutral-700">
              F_area = 1 - ((harvest_ratio - min_ratio) / (max_ratio - min_ratio))
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
              Total luas panen jagung + ubi kayu 2023 per 1.000 penduduk, dinormalisasi terbalik. Nilai F_area tinggi menunjukkan defisit luas lahan panen palawija per kapita.
            </p>
          </div>

          {/* Formula Final */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-700/30 border border-neutral-200 dark:border-neutral-700 space-y-2">
            <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400">4. Indeks Komposit Akhir (SDFVI–Proxy)</span>
            <div className="p-2.5 rounded bg-white dark:bg-neutral-800 font-mono text-xs border border-neutral-200 dark:border-neutral-700">
              SDFVI_proxy = (L1 + H + F_area) / 3
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
              Rata-rata tidak berbobot (equal-weighting) dari ketiga komponen yang telah terstandardisasi. Kategori: &ge;0.80 Sangat Tinggi, 0.60–0.79 Tinggi, 0.40–0.59 Sedang, &lt;0.40 Rendah.
            </p>
          </div>
        </div>
      </div>

      {/* Explicit Rule on 2016 Wet-Year Reference */}
      <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800 rounded-xl p-5 sm:p-6 shadow-xs space-y-2 text-neutral-900 dark:text-neutral-100">
        <div className="flex items-center gap-2 text-sky-900 dark:text-sky-300 font-bold text-sm">
          <CloudRain className="w-5 h-5" />
          <span>Kaidah Baku: Data Presipitasi 2016 Sebagai Referensi Tahun Basah (Eksklusif)</span>
        </div>
        <p className="text-xs sm:text-sm text-sky-900/90 dark:text-sky-300/90 leading-relaxed">
          Tahun 2016 merupakan periode anomali La Niña basah (presipitasi Juni–Oktober tercatat rata-rata 336.5 mm di Gunungkidul). 
          Oleh karena itu, <strong>data 2016 berfungsi secara ketat sebagai acuan temporal tahun basah (wet-year temporal reference) 
          dan DILARANG dimasukkan ke dalam penghitungan skor dasar H (baseline hazard score)</strong>. 
          Skor H murni dihitung dari rata-rata tahun kemarau representatif (2015, 2019, 2024).
        </p>
      </div>

      {/* Explicit Proxy Limitations */}
      <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-900 rounded-xl p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-rose-900 dark:text-rose-300 font-bold text-sm">
          <AlertOctagon className="w-5 h-5 text-rose-600" />
          <span>Batasan Proksi Eksplisit (Dilarang Diklaim Secara Keliru)</span>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-rose-950 dark:text-rose-200">
          <div className="p-3 rounded-lg bg-white/80 dark:bg-neutral-900/80 border border-rose-200 dark:border-rose-900">
            <strong>1. Batasan Indikator H (Meteorological Hazard):</strong>
            <p className="mt-1 text-xs text-neutral-700 dark:text-neutral-300">
              DILARANG menyebut skor H sebagai <em>kelembaban tanah (soil moisture)</em>, <em>ketersediaan air tanah (groundwater availability)</em>, 
              <em>akses air bersih rumah tangga</em>, <em>kegagalan panen</em>, ataupun <em>dampak kekeringan langsung</em>. 
              H murni mengukur anomali defisit curah hujan satelit CHIRPS.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white/80 dark:bg-neutral-900/80 border border-rose-200 dark:border-rose-900">
            <strong>2. Batasan Indikator F_area (Land Deficit Proxy):</strong>
            <p className="mt-1 text-xs text-neutral-700 dark:text-neutral-300">
              DILARANG menyebut F_area sebagai <em>produksi pangan riil</em>, <em>produktivitas lahan (ton/ha)</em>, 
              <em>ketahanan pangan rumah tangga</em>, <em>konsumsi kalori/gizi</em>, ataupun <em>defisit pangan aktual</em>. 
              F_area adalah proksi defisit basis luasan panen palawija per 1.000 penduduk wilayah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
