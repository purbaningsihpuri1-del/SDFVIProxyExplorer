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
      <div className="bg-white dark:bg-[#1E293B] border-2 border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#15803D]/15 dark:bg-[#15803D]/30 text-[#14532D] dark:text-[#4ADE80]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
              Metodologi Penelitian: Landasan Ilmiah, Formulasi, & Batasan Proksi
            </h2>
            <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] mt-1 font-medium leading-relaxed">
              Adaptasi Konseptual Framework DICLIV (Chile, 2026) Menuju Operasionalisasi SEHATI di Tingkat Kapanewon & Kecamatan
            </p>
          </div>
        </div>
      </div>

      {/* Global Context: DICLIV Index Chile 2026 */}
      <div className="bg-white dark:bg-[#1E293B] border-2 border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-black/[0.08] dark:border-white/[0.12] pb-3.5 gap-2">
          <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] dark:text-white flex items-center gap-2">
            <Quote className="w-5 h-5 text-[#15803D] dark:text-[#4ADE80]" />
            <span>Konteks Global: Disability-Inclusive Climate Vulnerability (DICLIV) Index</span>
          </h3>
          <a
            href="https://doi.org/10.3390/su18115645"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#15803D] dark:text-[#4ADE80] hover:underline font-extrabold"
          >
            <span>Rotarou & Figueroa (2026) DOI: 10.3390/su18115645</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-medium">
          <p>
            <strong className="text-[#0F172A] dark:text-white">1. Pelopor Global Indeks Iklim Inklusif Disabilitas:</strong> DICLIV (Rotarou & Figueroa, 2026, jurnal <em>Sustainability</em>) 
            merupakan indeks kerentanan iklim inklusif disabilitas pertama di tingkat sub-nasional secara global. 
            Studi ini mencakup 16 wilayah administratif di Chile dengan 29 indikator empiris yang terbagi ke dalam 3 dimensi utama kerentanan iklim IPCC.
          </p>
          <p>
            <strong className="text-[#0F172A] dark:text-white">2. Inspirasi Adaptasi Indonesia (SEHATI):</strong> Peneliti terinspirasi oleh kerangka kerja DICLIV dan mengadaptasinya 
            ke dalam konteks desentralisasi sub-distrik di Indonesia dengan nama <strong className="text-[#0F172A] dark:text-white">SEHATI</strong> 
            (<em>Sistem Evaluasi Kerentanan Iklim Inklusif Disabilitas</em>), yang dioperasionalkan bagi pemerintah daerah dan Komisi Nasional Disabilitas (Komnas Disabilitas).
          </p>
          <p>
            <strong className="text-[#0F172A] dark:text-white">3. Implementasi Pilot SDFVI–Proxy Gunungkidul & Solok:</strong> Pilot ini merupakan operasionalisasi empiris formulasi proksi 
            dari SEHATI (SDFVI–Proxy), memanfaatkan data administratif sub-distrik yang tersedia di mana 29 indikator lengkap DICLIV belum seluruhnya tercatat 
            dalam statistik rutin wilayah tingkat kecamatan.
          </p>
        </div>
      </div>

      {/* Scope of the Pilot: 18 Kapanewon Population */}
      <div className="bg-white dark:bg-[#1E293B] border-2 border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
        <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-[#15803D] dark:text-[#4ADE80]" />
          <span>Lingkup Pilot: Populasi Lengkap Wilayah (Sensus Spasial, Bukan Sampel Statistik)</span>
        </h3>
        <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-medium">
          Penelitian ini menelaah <strong className="text-[#0F172A] dark:text-white">seluruh 18 kapanewon di Gunungkidul dan 14 kecamatan di Solok sebagai populasi wilayah lengkap</strong>, 
          bukan sampel acak. Oleh karena itu:
        </p>
        <ul className="list-disc pl-5 text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] space-y-1.5 font-medium">
          <li>Normalisasi min–max dihitung atas rentang nilai minimum dan maksimum dari seluruh unit populasi tersebut.</li>
          <li>Skor yang dihasilkan bersifat komparatif internal di antara wilayah dalam satu kabupaten.</li>
          <li>Uji signifikansi sampel tidak diberlakukan karena seluruh unit populasi teramati.</li>
        </ul>
      </div>

      {/* Exact Mathematical Formulations */}
      <div className="bg-white dark:bg-[#1E293B] border-2 border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] dark:text-white flex items-center gap-2">
          <Binary className="w-5 h-5 text-[#15803D] dark:text-[#4ADE80]" />
          <span>Formulasi Matematis Baku SDFVI–Proxy</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Formula L1 */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border-2 border-black/[0.08] dark:border-white/[0.12] space-y-2">
            <span className="font-extrabold text-xs sm:text-sm text-[#6B21A8] dark:text-[#D8B4FE]">1. Sensitivitas Sosial (L1 / S_i)</span>
            <div className="p-3 rounded-xl bg-white dark:bg-[#1E293B] font-mono text-xs sm:text-sm font-bold border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-white">
              L1 = (normalized_ADK + normalized_older_persons) / 2
            </div>
            <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] font-medium leading-relaxed">
              Rasio ADK (Anak Dengan Kedisabilitasan) per 1.000 jiwa dan Rasio Lansia Terlantar per 1.000 jiwa (Gunungkidul) atau Populasi Perempuan Lansia 60+ (Solok), dinormalisasi min–max (0 sampai 1).
            </p>
          </div>

          {/* Formula H */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border-2 border-black/[0.08] dark:border-white/[0.12] space-y-2">
            <span className="font-extrabold text-xs sm:text-sm text-[#00409A] dark:text-[#93C5FD]">2. Bahaya Meteorologis (H / H_i)</span>
            <div className="p-3 rounded-xl bg-white dark:bg-[#1E293B] font-mono text-xs sm:text-sm font-bold border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-white">
              H = 1 - ((mean_precip - min_precip) / (max_precip - min_precip))
            </div>
            <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] font-medium leading-relaxed">
              Inversi min–max presipitasi satelit CHIRPS (Juni–Oktober). Nilai H makin mendekati 1 menandakan kekeringan makin parah.
            </p>
          </div>

          {/* Formula F_area */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border-2 border-black/[0.08] dark:border-white/[0.12] space-y-2">
            <span className="font-extrabold text-xs sm:text-sm text-[#9A3412] dark:text-[#FDBA74]">3. Defisit Pangan / Eksposur Lahan (F_area / E_i)</span>
            <div className="p-3 rounded-xl bg-white dark:bg-[#1E293B] font-mono text-xs sm:text-sm font-bold border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-white">
              F_area = 1 - ((harvest_ratio - min_ratio) / (max_ratio - min_ratio))
            </div>
            <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] font-medium leading-relaxed">
              Total luas panen jagung + ubi kayu 2023 per 1.000 penduduk (Gunungkidul) atau total luas sawah padi Anak Daro (Solok).
            </p>
          </div>

          {/* Formula Final */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border-2 border-black/[0.08] dark:border-white/[0.12] space-y-2">
            <span className="font-extrabold text-xs sm:text-sm text-[#14532D] dark:text-[#4ADE80]">4. Indeks Komposit Akhir (SDFVI–Proxy)</span>
            <div className="p-3 rounded-xl bg-white dark:bg-[#1E293B] font-mono text-xs sm:text-sm font-bold border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-white">
              SDFVI_proxy = (K1 + K2 + K3) / 3
            </div>
            <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] font-medium leading-relaxed">
              Rata-rata tidak berbobot (equal-weighting) dari ketiga komponen terstandardisasi. Kategori: &ge;0.80 Sangat Tinggi, 0.60–0.79 Tinggi, 0.40–0.59 Sedang, &lt;0.40 Rendah.
            </p>
          </div>
        </div>
      </div>

      {/* Explicit Rule on 2016 Wet-Year Reference */}
      <div className="bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 border-2 border-[#1E40AF]/30 dark:border-[#3B82F6]/30 rounded-2xl p-5 sm:p-6 shadow-xs space-y-2 text-[#0F172A] dark:text-white">
        <div className="flex items-center gap-2.5 text-[#1E3A8A] dark:text-[#93C5FD] font-extrabold text-sm sm:text-base">
          <CloudRain className="w-5 h-5 text-[#0055D4]" />
          <span>Kaidah Baku: Data Presipitasi 2016 Sebagai Referensi Tahun Basah (Eksklusif)</span>
        </div>
        <p className="text-xs sm:text-sm text-[#1E3A8A] dark:text-[#BFDBFE] leading-relaxed font-medium">
          Tahun 2016 merupakan periode anomali La Niña basah (presipitasi Juni–Oktober tercatat rata-rata 336.5 mm di Gunungkidul). 
          Oleh karena itu, <strong className="text-[#0F172A] dark:text-white font-black">data 2016 berfungsi secara ketat sebagai acuan temporal tahun basah (wet-year temporal reference) 
          dan DILARANG dimasukkan ke dalam penghitungan skor dasar H (baseline hazard score)</strong>. 
          Skor H murni dihitung dari rata-rata tahun kemarau representatif (2015, 2019, 2024).
        </p>
      </div>

      {/* Explicit Proxy Limitations */}
      <div className="bg-[#FFF1F2] dark:bg-[#4C0519]/40 border-2 border-[#E11D48]/30 dark:border-[#FB7185]/30 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2.5 text-[#9F1239] dark:text-[#FECDD3] font-extrabold text-sm sm:text-base">
          <AlertOctagon className="w-5 h-5 text-[#E11D48]" />
          <span>Batasan Proksi Eksplisit (Dilarang Diklaim Secara Keliru)</span>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-[#881337] dark:text-[#FFE4E6]">
          <div className="p-3.5 rounded-xl bg-white/90 dark:bg-[#1E293B]/90 border border-[#E11D48]/20">
            <strong className="text-[#9F1239] dark:text-[#FDA4AF] text-sm">1. Batasan Indikator H (Meteorological Hazard):</strong>
            <p className="mt-1 text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] font-medium leading-relaxed">
              DILARANG menyebut skor H sebagai <em>kelembaban tanah (soil moisture)</em>, <em>ketersediaan air tanah (groundwater availability)</em>, 
              <em>akses air bersih rumah tangga</em>, <em>kegagalan panen</em>, ataupun <em>dampak kekeringan langsung</em>. 
              H murni mengukur anomali defisit curah hujan satelit CHIRPS.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/90 dark:bg-[#1E293B]/90 border border-[#E11D48]/20">
            <strong className="text-[#9F1239] dark:text-[#FDA4AF] text-sm">2. Batasan Indikator F_area (Land Deficit Proxy):</strong>
            <p className="mt-1 text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] font-medium leading-relaxed">
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
