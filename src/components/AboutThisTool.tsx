import React, { useState } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  CloudRain, 
  Wheat, 
  Scale, 
  AlertTriangle, 
  MapPin, 
  Quote, 
  Sparkles, 
  Layers, 
  Compass,
  HeartHandshake,
  Droplets
} from 'lucide-react';
import { PilotRegion } from '../types';

interface AboutThisToolProps {
  defaultExpanded?: boolean;
  currentPilot?: PilotRegion;
  onSwitchPilot?: (pilot: PilotRegion) => void;
}

export const AboutThisTool: React.FC<AboutThisToolProps> = ({ 
  defaultExpanded = true,
  currentPilot = 'gunungkidul',
  onSwitchPilot
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  return (
    <section 
      id="dashboard-header-intro" 
      aria-labelledby="dashboard-main-title"
      className="apple-card p-5 sm:p-7 md:p-8 space-y-5 sm:space-y-6 transition-all border-2 border-black/[0.08] dark:border-white/[0.12]"
    >
      {/* Top Header per User Request (Apple HIG Large Title & Card Header) */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 sm:gap-5 border-b-2 border-black/[0.06] dark:border-white/[0.08] pb-5 sm:pb-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-[#0055D4]/15 text-[#00409A] dark:text-[#60A5FA] border border-[#0055D4]/25">
            <Sparkles className="w-4 h-4 text-[#0055D4] dark:text-[#60A5FA]" />
            <span>INDONESIA CLIMATE ADAPTATION DUAL PILOT</span>
          </div>

          <h1 id="dashboard-main-title" className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight">
            SDFVI–Proxy Explorer — Dual Pilot: Gunungkidul & Solok
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#334155] dark:text-[#E2E8F0] max-w-4xl leading-relaxed font-normal">
            Dasbor kerentanan iklim inklusif disabilitas dan responsif gender pertama di Indonesia, 
            diadaptasi dari kerangka kerja global DICLIV (Chile, 2026).
          </p>

          {/* Quick Pilot Switcher Bar (Apple HIG Segmented Control with WCAG Contrast) */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <span className="text-sm font-bold text-[#1E293B] dark:text-[#F1F5F9] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#0055D4]" /> Wilayah Aktif:
            </span>
            <div className="inline-flex items-center bg-[#E2E8F0] dark:bg-[#27272A] p-1.5 rounded-full text-sm border border-black/10 dark:border-white/10">
              <button
                id="about-toggle-pilot-gk"
                onClick={() => onSwitchPilot && onSwitchPilot('gunungkidul')}
                className={`px-4 py-1.5 text-sm font-bold rounded-full transition-all apple-tap ${
                  currentPilot === 'gunungkidul'
                    ? 'bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] shadow-sm'
                    : 'text-[#334155] dark:text-[#E2E8F0] hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                Gunungkidul (18 Kapanewon)
              </button>
              <button
                id="about-toggle-pilot-solok"
                onClick={() => onSwitchPilot && onSwitchPilot('solok')}
                className={`px-4 py-1.5 text-sm font-bold rounded-full transition-all apple-tap ${
                  currentPilot === 'solok'
                    ? 'bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] shadow-sm'
                    : 'text-[#334155] dark:text-[#E2E8F0] hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                Solok (14 Kecamatan)
              </button>
            </div>
          </div>
        </div>

        {/* Action Toggle for About This Tool (Apple Button) */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            id="btn-toggle-about-tool"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold bg-[#E2E8F0] dark:bg-[#27272A] hover:bg-[#CBD5E1] dark:hover:bg-[#3F3F46] text-[#0F172A] dark:text-white transition-all apple-tap border border-black/10 dark:border-white/15 shadow-2xs"
            aria-expanded={isExpanded}
            aria-controls="about-this-tool-content"
          >
            <BookOpen className="w-4 h-4 text-[#0055D4] dark:text-[#60A5FA]" />
            <span>{isExpanded ? 'Tutup Detail Alat' : 'Buka Detail Alat'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Full Text as "About This Tool" */}
      {isExpanded && (
        <div id="about-this-tool-content" className="space-y-6 pt-1 animate-fade-in text-[#1E293B] dark:text-[#F1F5F9]">
          {/* Header Banner for About This Tool */}
          <div className="flex items-center justify-between flex-wrap gap-2.5">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0F172A] dark:text-white flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] font-extrabold text-sm shadow-xs">
                i
              </span>
              <span>About This Tool (Tentang Alat Bantu Ini)</span>
            </h2>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="px-3 py-1 rounded-full font-bold bg-blue-100 dark:bg-blue-950 text-[#00409A] dark:text-blue-200 border border-blue-300 dark:border-blue-800">
                DICLIV (Chile, 2026)
              </span>
              <span className="px-3 py-1 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-[#14532D] dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
                SEHATI Indonesia
              </span>
              <span className="px-3 py-1 rounded-full font-bold bg-purple-100 dark:bg-purple-950 text-[#581C87] dark:text-purple-200 border border-purple-300 dark:border-purple-800">
                Dual Pilot (Gunungkidul + Solok)
              </span>
            </div>
          </div>

          {/* Section 1: Inception & Global Framework */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1E1E24] border-2 border-[#CBD5E1] dark:border-[#334155] space-y-3 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Quote className="w-6 h-6 text-[#15803D] shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
                  1. Latar Belakang & Landasan Global: DICLIV Framework (Chile, 2026)
                </h3>
              </div>
              <a
                href="https://doi.org/10.3390/su18115645"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#15803D] dark:text-[#4ADE80] hover:underline font-bold shrink-0"
              >
                <span>Rotarou & Figueroa (2026) • DOI: 10.3390/su18115645</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="space-y-3.5 text-sm sm:text-base text-[#1E293B] dark:text-[#F1F5F9] leading-relaxed">
              <p>
                Pengembangan <strong>SDFVI–Proxy Explorer</strong> berakar dari kebutuhan empiris mendesak di tingkat lokal Indonesia untuk memetakan kerentanan secara inklusif. Di tengah proses pengembangan tersebut, ditemukan kerangka global pionir <strong>DICLIV</strong> (<em>Disability-Inclusive Climate Vulnerability Index</em>) yang dikembangkan oleh Elena Rotarou dan Eugenio Figueroa B. (2026) di Chile dan dipublikasikan pada jurnal <em>Sustainability</em> (DOI: <a href="https://doi.org/10.3390/su18115645" target="_blank" rel="noopener noreferrer" className="text-[#15803D] dark:text-[#4ADE80] font-semibold underline underline-offset-2">10.3390/su18115645</a>).
              </p>
              <p>
                Keselarasan metodologis ini memperkuat validitas konseptual bahwa perubahan iklim tidak berdampak secara netral: penyandang disabilitas dan kelompok rentan menanggung beban risiko berlipat ganda. Melalui adaptasi dan pengembangan lanjutan (<em>upgrade</em>) pada konteks sub-distrik di Indonesia (Gunungkidul dan Solok), SDFVI–Proxy hadir sebagai instrumen skrining spasial yang menjembatani standar riset global dengan kebutuhan aksi nyata di lapangan.
              </p>
              <p>
                Meskipun dashboard ini memiliki fitur komprehensif, setiap modul dirancang untuk menjawab kebutuhan spesifik: dari skrining kerentanan (D1-D4), simulasi biochar (mitigasi kekeringan), hingga audit <em>governance</em> (KND/Komdis Perda tracking). <em>Future iterations</em> akan mengintegrasikan D5 (<em>Cultural Vulnerability Index</em>) untuk menangkap kerentanan <em>livelihoods</em> adat (mis. penenun Sasak), selaras dengan framework UNESCO <em>Intangible Cultural Heritage safeguarding</em>.
              </p>
            </div>
          </div>

          {/* Section 2: Two Complementary Pilot Contexts */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#15803D]" />
              <span>2. Arsitektur Dua Pilot: Karst Jawa (Gunungkidul) & Dataran Tinggi Sumatera (Solok)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              
              {/* Pilot 1: Gunungkidul */}
              <div className={`p-5 sm:p-6 rounded-2xl border-2 transition-all ${
                currentPilot === 'gunungkidul' 
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-[#15803D] ring-2 ring-[#15803D]/30' 
                  : 'bg-white dark:bg-[#1E1E24] border-[#CBD5E1] dark:border-[#334155]'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-base text-[#0F172A] dark:text-white flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#15803D]" />
                    PILOT 1: Kabupaten Gunungkidul (18 Kapanewon)
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-200 dark:bg-emerald-900 text-[#14532D] dark:text-emerald-200 font-bold border border-emerald-400">
                    Inklusi Disabilitas
                  </span>
                </div>

                <div className="text-sm sm:text-base text-[#1E293B] dark:text-[#F1F5F9] space-y-2 leading-relaxed">
                  <p><strong>Lanskap & Konteks:</strong> Bentang alam karst Gunungsewu, krisis air permukaan, pertanian kering palawija (jagung & ubi kayu).</p>
                  <p><strong>Sensitivitas Sosial (L1):</strong> Anak Dengan Kedisabilitasan (ADK) + Lansia Terlantar per 1.000 jiwa penduduk.</p>
                  <p><strong>Bahaya (H):</strong> Defisit presipitasi satelit CHIRPS (Juni–Oktober 2015, 2019, 2024).</p>
                  <p><strong>Eksposur (F_area):</strong> Defisit luas panen palawija kalori lokal per 1.000 penduduk.</p>
                  <p><strong>Formulasi:</strong> <code className="font-mono bg-[#E2E8F0] dark:bg-[#334155] text-[#0F172A] dark:text-white px-1.5 py-0.5 rounded font-bold">(L1 + H + F_area) / 3</code></p>
                  <p><strong>Berkas Data:</strong> <code className="font-mono text-[#15803D] dark:text-emerald-400 font-bold">gn_kidul_sdfvi_data.csv</code> (18 baris)</p>
                </div>
              </div>

              {/* Pilot 2: Solok */}
              <div className={`p-5 sm:p-6 rounded-2xl border-2 transition-all ${
                currentPilot === 'solok' 
                  ? 'bg-blue-50/90 dark:bg-blue-950/40 border-[#0055D4] ring-2 ring-[#0055D4]/30' 
                  : 'bg-white dark:bg-[#1E1E24] border-[#CBD5E1] dark:border-[#334155]'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-base text-[#0F172A] dark:text-white flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#0055D4]" />
                    PILOT 2: Kabupaten Solok (14 Kecamatan)
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-200 dark:bg-blue-900 text-[#00409A] dark:text-blue-200 font-bold border border-blue-400">
                    Responsif Gender
                  </span>
                </div>

                <div className="text-sm sm:text-base text-[#1E293B] dark:text-[#F1F5F9] space-y-2 leading-relaxed">
                  <p><strong>Lanskap & Konteks:</strong> Dataran tinggi Bukit Barisan (380–1.400 mdpl), sentra beras premium <em>Beras Solok</em> (Anak Daro & Cisokan).</p>
                  <p><strong>Sensitivitas Sosial (S_i):</strong> Perempuan usia 60+ tanpa pendidikan formal per 1.000 penduduk perempuan (beban kerja pertanian & domestik).</p>
                  <p><strong>Bahaya (H_i):</strong> Defisit presipitasi satelit CHIRPS kemarau El Niño Juni–Oktober 2023.</p>
                  <p><strong>Eksposur (E_i):</strong> Luas sawah padi (ha) per kapita sebagai tulang punggung mata pencaharian.</p>
                  <p><strong>Formulasi:</strong> <code className="font-mono bg-[#E2E8F0] dark:bg-[#334155] text-[#0F172A] dark:text-white px-1.5 py-0.5 rounded font-bold">(S_i + H_i + E_i) / 3</code></p>
                  <p><strong>Berkas Data:</strong> <code className="font-mono text-[#0055D4] dark:text-blue-400 font-bold">solok_sdfvi_data.csv</code> (14 baris)</p>
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: Biochar Sensitivity Feature */}
          <div className="p-5 sm:p-6 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-300 dark:border-purple-800 space-y-2.5">
            <div className="flex items-center gap-2 text-[#581C87] dark:text-purple-200 font-bold text-base sm:text-lg">
              <Droplets className="w-5 h-5 text-[#7E22CE] dark:text-purple-400" />
              <span>3. Integrasi Eksploratif: Analisis Sensitivitas Retensi Air Biochar (Gunungkidul Benchmark 2019)</span>
            </div>
            <p className="text-sm sm:text-base text-[#3B0764] dark:text-[#E9D5FF] leading-relaxed">
              Dashboard ini mengintegrasikan model sensitivitas potensi tambahan air efektif ekuivalen pada musim kering ekstrem 2019. 
              Melalui simulasi skenario peningkatan Water Holding Capacity (WHC) tanah berbasis biochar limbah pertanian (+5% Konservatif, +15% Moderat, +25% Optimistis), 
              dihasilkan peta estimasi kedalaman air efektif (delta mm) dan volume ekuivalen (ML) pada 4 Hotspot Kritis (Ponjong, Panggang, Paliyan, Saptosari) untuk mendukung perencanaan adaptasi berbasis alam (Nature-based Solutions).
            </p>
          </div>

          {/* Section 4: Human-in-the-Loop Governance Mandate */}
          <div className="p-5 sm:p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 space-y-2.5">
            <div className="flex items-center gap-2 text-[#78350F] dark:text-amber-200 font-bold text-base sm:text-lg">
              <AlertTriangle className="w-5 h-5 text-[#B45309]" />
              <span>4. Mandat Operasional: Human-in-the-Loop & Validasi Partisipatif</span>
            </div>
            <p className="text-sm sm:text-base text-[#451A03] dark:text-[#FEF3C7] leading-relaxed">
              Skor SDFVI–Proxy di kedua pilot berfungsi sebagai <strong>alat bantu skrining makro (macro-screening heuristic)</strong> untuk mengarahkan alokasi sumber daya adaptasi iklim, 
              <strong> bukan pemicu otomatis keputusan bantuan tanpa verifikasi</strong>. Keputusan intervensi wajib diverifikasi melalui musyawarah lapangan bersama organisasi penyandang disabilitas (OPD/DPO), kelompok wanita tani (KWT), pemerintah nagari/kalurahan, dan dinas terkait.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
