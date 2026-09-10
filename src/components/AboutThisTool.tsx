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
      className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-5 sm:p-7 shadow-xs space-y-5 transition-all"
    >
      {/* Top Header per User Request */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-700 pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INDONESIA CLIMATE ADAPTATION DUAL PILOT</span>
          </div>

          <h1 id="dashboard-main-title" className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            SDFVI–Proxy Explorer — Dual Pilot: Gunungkidul & Solok
          </h1>

          <p className="subtitle text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-4xl leading-relaxed">
            Indonesia's first disability-inclusive AND gender-responsive climate vulnerability dashboard, 
            adapted from the global DICLIV framework (Chile, 2026).
          </p>

          {/* Quick Pilot Switcher Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-emerald-600" /> Tampilan Aktif:
            </span>
            <button
              id="about-toggle-pilot-gk"
              onClick={() => onSwitchPilot && onSwitchPilot('gunungkidul')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                currentPilot === 'gunungkidul'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              Gunungkidul (18 Kapanewon) • Inklusi Disabilitas
            </button>
            <button
              id="about-toggle-pilot-solok"
              onClick={() => onSwitchPilot && onSwitchPilot('solok')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                currentPilot === 'solok'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              Solok (14 Kecamatan) • Responsif Gender & Sawah
            </button>
          </div>
        </div>

        {/* Action Toggle for About This Tool */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            id="btn-toggle-about-tool"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 transition-colors border border-neutral-300 dark:border-neutral-600 shadow-2xs"
            aria-expanded={isExpanded}
            aria-controls="about-this-tool-content"
          >
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{isExpanded ? 'Tutup About This Tool' : 'Baca About This Tool'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Full Text as "About This Tool" */}
      {isExpanded && (
        <div id="about-this-tool-content" className="space-y-6 pt-1 animate-fade-in text-neutral-800 dark:text-neutral-200">
          {/* Header Banner for About This Tool */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-xs">
                i
              </span>
              <span>About This Tool (Tentang Alat Bantu Ini)</span>
            </h2>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                DICLIV (Chile, 2026)
              </span>
              <span className="px-2.5 py-1 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                SEHATI Indonesia
              </span>
              <span className="px-2.5 py-1 rounded-full font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300">
                Dual Pilot (Gunungkidul + Solok)
              </span>
            </div>
          </div>

          {/* Section 1: Inception & Global Framework */}
          <div className="p-4 sm:p-5 rounded-xl bg-neutral-50 dark:bg-neutral-700/30 border border-neutral-200 dark:border-neutral-700 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Quote className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                  1. Latar Belakang & Landasan Global: DICLIV Framework (Chile, 2026)
                </h3>
              </div>
              <a
                href="https://doi.org/10.3390/su18115645"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold shrink-0"
              >
                <span>Rotarou & Figueroa (2026) • DOI: 10.3390/su18115645</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              <strong>SDFVI–Proxy Explorer</strong> (<em>Sub-District Fast Vulnerability Index</em>) 
              adalah instrumen analisis spasial pertama di Indonesia yang mengadaptasi kerangka kerja global pionir 
              <strong> DICLIV</strong> (<em>Disability-Inclusive Climate Vulnerability Index</em>), yang dikembangkan oleh 
              Elena Rotarou dan Eugenio Figueroa B. (2026) di Chile dan dipublikasikan pada jurnal internasional <em>Sustainability</em>. 
              Kerangka DICLIV membuktikan bahwa perubahan iklim tidak berdampak secara netral: penyandang disabilitas dan perempuan marginal menanggung beban kerentanan sosial berlipat ganda saat krisis iklim terjadi.
            </p>
          </div>

          {/* Section 2: Two Complementary Pilot Contexts */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>2. Arsitektur Dua Pilot: Karst Jawa (Gunungkidul) & Dataran Tinggi Sumatera (Solok)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              
              {/* Pilot 1: Gunungkidul */}
              <div className={`p-4 sm:p-5 rounded-xl border transition-all ${
                currentPilot === 'gunungkidul' 
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700 ring-1 ring-emerald-500' 
                  : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    PILOT 1: Kabupaten Gunungkidul (18 Kapanewon)
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                    Inklusi Disabilitas
                  </span>
                </div>

                <div className="text-xs text-neutral-600 dark:text-neutral-300 space-y-1.5 leading-relaxed">
                  <p><strong>Lanskap & Konteks:</strong> Bentang alam karst Gunungsewu, krisis air permukaan, pertanian kering palawija (jagung & ubi kayu).</p>
                  <p><strong>Sensitivitas Sosial (L1):</strong> Anak Dalam Masalah Kesejahteraan Sosial (ADK) + Lansia Terlantar per 1.000 jiwa penduduk.</p>
                  <p><strong>Bahaya (H):</strong> Defisit presipitasi satelit CHIRPS (Juni–Oktober 2015, 2019, 2024).</p>
                  <p><strong>Eksposur (F_area):</strong> Defisit luas panen palawija kalori lokal per 1.000 penduduk.</p>
                  <p><strong>Formulasi:</strong> <code className="font-mono bg-neutral-100 dark:bg-neutral-700 px-1 rounded">(L1 + H + F_area) / 3</code></p>
                  <p><strong>Berkas Data:</strong> <code className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">gn_kidul_sdfvi_data.csv</code> (18 baris)</p>
                </div>
              </div>

              {/* Pilot 2: Solok */}
              <div className={`p-4 sm:p-5 rounded-xl border transition-all ${
                currentPilot === 'solok' 
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700 ring-1 ring-emerald-500' 
                  : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    PILOT 2: Kabupaten Solok (14 Kecamatan)
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-semibold">
                    Responsif Gender
                  </span>
                </div>

                <div className="text-xs text-neutral-600 dark:text-neutral-300 space-y-1.5 leading-relaxed">
                  <p><strong>Lanskap & Konteks:</strong> Dataran tinggi Bukit Barisan (380–1.400 mdpl), sentra beras premium <em>Beras Solok</em> (Anak Daro & Cisokan).</p>
                  <p><strong>Sensitivitas Sosial (S_i):</strong> Perempuan usia 60+ tanpa pendidikan formal per 1.000 penduduk perempuan (beban kerja pertanian & domestik).</p>
                  <p><strong>Bahaya (H_i):</strong> Defisit presipitasi satelit CHIRPS kemarau El Niño Juni–Oktober 2023.</p>
                  <p><strong>Eksposur (E_i):</strong> Luas sawah padi (ha) per kapita sebagai tulang punggung mata pencaharian.</p>
                  <p><strong>Formulasi:</strong> <code className="font-mono bg-neutral-100 dark:bg-neutral-700 px-1 rounded">(S_i + H_i + E_i) / 3</code></p>
                  <p><strong>Berkas Data:</strong> <code className="font-mono text-blue-700 dark:text-blue-400 font-semibold">solok_sdfvi_data.csv</code> (14 baris)</p>
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: Biochar Sensitivity Feature */}
          <div className="p-4 sm:p-5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-2.5">
            <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 font-bold text-sm">
              <Droplets className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>3. Integrasi Eksploratif: Analisis Sensitivitas Retensi Air Biochar (Gunungkidul Benchmark 2019)</span>
            </div>
            <p className="text-xs text-purple-950 dark:text-purple-200/90 leading-relaxed">
              Dashboard ini mengintegrasikan model sensitivitas potensi tambahan air efektif ekuivalen pada musim kering ekstrem 2019. 
              Melalui simulasi skenario peningkatan Water Holding Capacity (WHC) tanah berbasis biochar limbah pertanian (+5% Konservatif, +15% Moderat, +25% Optimistis), 
              dihasilkan peta estimasi kedalaman air efektif (delta mm) dan volume ekuivalen (ML) pada 4 Hotspot Kritis (Ponjong, Panggang, Paliyan, Saptosari) untuk mendukung perencanaan adaptasi berbasis alam (Nature-based Solutions).
            </p>
          </div>

          {/* Section 4: Human-in-the-Loop Governance Mandate */}
          <div className="p-4 sm:p-5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>4. Mandat Operasional: Human-in-the-Loop & Validasi Partisipatif</span>
            </div>
            <p className="text-xs text-amber-900/90 dark:text-amber-300/90 leading-relaxed">
              Skor SDFVI–Proxy di kedua pilot berfungsi sebagai <strong>alat bantu skrining makro (macro-screening heuristic)</strong> untuk mengarahkan alokasi sumber daya adaptasi iklim, 
              <strong> bukan pemicu otomatis keputusan bantuan tanpa verifikasi</strong>. Keputusan intervensi wajib diverifikasi melalui musyawarah lapangan bersama organisasi penyandang disabilitas (OPD/DPO), kelompok wanita tani (KWT), pemerintah nagari/kalurahan, dan dinas terkait.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
