import React from 'react';
import { 
  FileText, 
  Map as MapIcon, 
  BarChart3, 
  Table as TableIcon, 
  CheckCircle2, 
  HelpCircle, 
  Scale, 
  BookOpen, 
  Milestone, 
  Upload, 
  Download, 
  Share2, 
  Eye, 
  Droplets,
  FlaskConical,
  ChevronDown,
  Compass,
  Sparkles
} from 'lucide-react';
import { ActiveTab, ColorTheme, PilotRegion } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  onOpenUploadModal: () => void;
  onDownloadCSV: () => void;
  onShare: () => void;
  dataSourceLabel: string;
  currentPilot: PilotRegion;
  setCurrentPilot: (pilot: PilotRegion) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  colorTheme,
  setColorTheme,
  onOpenUploadModal,
  onDownloadCSV,
  onShare,
  dataSourceLabel,
  currentPilot,
  setCurrentPilot
}) => {
  const tabs = [
    { id: 'overview' as ActiveTab, label: 'Ringkasan', icon: FileText },
    { id: 'map' as ActiveTab, label: 'Peta Spasial', icon: MapIcon },
    { id: 'charts' as ActiveTab, label: 'Grafik Analisis', icon: BarChart3 },
    { 
      id: 'context' as ActiveTab, 
      label: currentPilot === 'gunungkidul' ? 'Karakteristik Kapanewon' : 'Karakteristik Kecamatan', 
      icon: TableIcon 
    },
    { id: 'biochar' as ActiveTab, label: 'Sensitivitas Biochar', icon: FlaskConical },
    { id: 'quality' as ActiveTab, label: 'Audit Mutu Data', icon: CheckCircle2 },
    { id: 'action_research' as ActiveTab, label: 'Riset Aksi Lapangan', icon: HelpCircle },
    { id: 'policy' as ActiveTab, label: 'Panduan Kebijakan', icon: Scale },
    { id: 'methodology' as ActiveTab, label: 'Metodologi & DICLIV', icon: BookOpen },
    { id: 'roadmap' as ActiveTab, label: 'Roadmap SEHATI', icon: Milestone },
  ];

  return (
    <header className="sticky top-0 z-30 apple-glass border-b border-black/[0.06] dark:border-white/[0.08] transition-all">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          
          {/* Brand & Subtitle (Apple Typography & High Contrast Badge) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0055D4] to-[#003882] text-white flex items-center justify-center font-extrabold text-sm tracking-wider shadow-sm shrink-0 apple-tap">
                SDFVI
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-lg sm:text-xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-none">
                    SDFVI–Proxy Explorer
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#15803D]/15 text-[#14532D] dark:text-[#4ADE80] border border-[#15803D]/30">
                    Dual Pilot v2026
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] mt-0.5 flex items-center gap-1.5 font-medium truncate max-w-xs sm:max-w-md md:max-w-xl">
                  <span>Inklusif Disabilitas & Responsif Gender (DICLIV Adaptation)</span>
                </p>
              </div>
            </div>

            {/* Mobile-only Pilot Switcher for immediate thumb reach */}
            <div className="md:hidden flex items-center bg-[#E2E8F0] dark:bg-[#27272A] p-1 rounded-full border border-black/10 dark:border-white/10">
              <button
                onClick={() => setCurrentPilot('gunungkidul')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  currentPilot === 'gunungkidul'
                    ? 'bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] shadow-xs'
                    : 'text-[#334155] dark:text-[#CBD5E1]'
                }`}
              >
                Gunungkidul
              </button>
              <button
                onClick={() => setCurrentPilot('solok')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  currentPilot === 'solok'
                    ? 'bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] shadow-xs'
                    : 'text-[#334155] dark:text-[#CBD5E1]'
                }`}
              >
                Solok
              </button>
            </div>
          </div>

          {/* Desktop Pilot Selector & Action Toolbar */}
          <div className="hidden md:flex flex-wrap items-center gap-2.5">
            
            {/* Apple HIG Segmented Control for Dual Pilot */}
            <div className="flex items-center bg-[#E2E8F0] dark:bg-[#27272A] p-1 rounded-full border border-black/10 dark:border-white/10 shadow-2xs">
              <button
                id="btn-pilot-gunungkidul"
                onClick={() => setCurrentPilot('gunungkidul')}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all apple-tap ${
                  currentPilot === 'gunungkidul'
                    ? 'bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] shadow-xs'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-white'
                }`}
                title="Gunungkidul (18 Kapanewon) - Disabilitas & Lansia, Karst Kekeringan"
              >
                Gunungkidul (18 Kapanewon)
              </button>

              <button
                id="btn-pilot-solok"
                onClick={() => setCurrentPilot('solok')}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all apple-tap ${
                  currentPilot === 'solok'
                    ? 'bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] shadow-xs'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-white'
                }`}
                title="Solok (14 Kecamatan) - Responsif Gender, Sawah Anak Daro"
              >
                Solok (14 Kecamatan)
              </button>
            </div>

            {/* Apple Color Palette Selector */}
            <div className="flex items-center gap-0.5 bg-[#E2E8F0] dark:bg-[#27272A] p-1 rounded-full border border-black/10 dark:border-white/10 text-xs">
              <button
                id="btn-theme-standard"
                onClick={() => setColorTheme('standard')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  colorTheme === 'standard'
                    ? 'bg-[#0F172A] dark:bg-white font-bold shadow-xs text-white dark:text-[#0F172A]'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#0F172A]'
                }`}
              >
                Standar
              </button>
              <button
                id="btn-theme-colorblind"
                onClick={() => setColorTheme('colorblind')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  colorTheme === 'colorblind'
                    ? 'bg-[#0055D4] text-white font-bold shadow-xs'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#0F172A]'
                }`}
              >
                Inklusif
              </button>
              <button
                id="btn-theme-high-contrast"
                onClick={() => setColorTheme('high-contrast')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  colorTheme === 'high-contrast'
                    ? 'bg-black dark:bg-white font-extrabold shadow-xs text-white dark:text-black border border-white dark:border-black'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#0F172A]'
                }`}
              >
                Kontras
              </button>
            </div>

            {/* CSV Actions with Apple pill aesthetics & WCAG Contrast */}
            <div className="flex items-center gap-2">
              <button
                id="btn-download-csv"
                onClick={onDownloadCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-bold bg-white dark:bg-[#27272A] text-[#0F172A] dark:text-white border-2 border-black/15 dark:border-white/20 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all shadow-2xs apple-tap"
                title={`Unduh dataset ${currentPilot === 'gunungkidul' ? 'gn_kidul_sdfvi_data.csv' : 'solok_sdfvi_data.csv'}`}
              >
                <Download className="w-4 h-4 text-[#0055D4] dark:text-[#60A5FA]" />
                <span>Ekspor CSV</span>
              </button>

              <button
                id="btn-upload-csv"
                onClick={onOpenUploadModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-bold bg-[#0055D4] text-white rounded-full hover:bg-[#00409A] transition-all shadow-2xs apple-tap border border-[#003882]"
                title="Unggah berkas CSV kustom"
              >
                <Upload className="w-4 h-4" />
                <span>Unggah</span>
              </button>

              <button
                id="btn-share-dashboard"
                onClick={onShare}
                className="inline-flex items-center justify-center w-9 h-9 text-sm font-bold bg-white dark:bg-[#27272A] text-[#0F172A] dark:text-white border-2 border-black/15 dark:border-white/20 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all shadow-2xs apple-tap"
                title="Bagikan dashboard"
              >
                <Share2 className="w-4 h-4 text-[#0F172A] dark:text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Primary Navigation Tabs - Apple Segmented Bar with Larger Accessible Fonts */}
        <nav className="flex space-x-1.5 overflow-x-auto pt-2.5 pb-1 mt-1 border-t border-black/[0.08] dark:border-white/[0.1] no-scrollbar scroll-smooth" aria-label="Navigasi Utama">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-bold rounded-full whitespace-nowrap transition-all apple-tap ${
                  isActive
                    ? 'bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] shadow-xs'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.1]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? (isActive ? 'text-white dark:text-[#0F172A]' : '') : 'text-[#475569] dark:text-[#94A3B8]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
