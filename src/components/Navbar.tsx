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
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 shadow-xs">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Brand & Subtitle */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs tracking-wider shadow-xs">
                SDFVI
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
                SDFVI–Proxy Explorer — Dual Pilot: Gunungkidul & Solok
              </h1>
            </div>
            <p className="subtitle text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5 flex flex-wrap items-center gap-1.5">
              <span>Indonesia's first disability-inclusive AND gender-responsive climate vulnerability dashboard, adapted from the global DICLIV framework (Chile, 2026).</span>
              <span className="text-neutral-400">•</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {dataSourceLabel}
              </span>
            </p>
          </div>

          {/* Pilot Selector & Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* DUAL PILOT DROPDOWN TOGGLE */}
            <div className="flex items-center bg-emerald-50 dark:bg-emerald-950/40 p-1 rounded-xl border border-emerald-300 dark:border-emerald-800 shadow-xs">
              <span className="text-emerald-800 dark:text-emerald-300 px-2 text-xs font-semibold flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" /> Pilot:
              </span>
              
              <button
                id="btn-pilot-gunungkidul"
                onClick={() => setCurrentPilot('gunungkidul')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentPilot === 'gunungkidul'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                }`}
                title="Gunungkidul (18 Kapanewon) - Disabilitas & Lansia, Karst Kekeringan"
              >
                Gunungkidul (18 Kapanewon)
              </button>

              <button
                id="btn-pilot-solok"
                onClick={() => setCurrentPilot('solok')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentPilot === 'solok'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                }`}
                title="Solok (14 Kecamatan) - Responsif Gender, Sawah Anak Daro"
              >
                Solok (14 Kecamatan)
              </button>
            </div>

            {/* Color Palette Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs">
              <span className="text-neutral-500 dark:text-neutral-400 pl-1.5 pr-0.5 flex items-center gap-1 font-medium text-[11px]">
                <Eye className="w-3 h-3" /> Tema:
              </span>
              <button
                id="btn-theme-standard"
                onClick={() => setColorTheme('standard')}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  colorTheme === 'standard'
                    ? 'bg-white dark:bg-neutral-700 font-semibold shadow-xs text-neutral-900 dark:text-neutral-100'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Standar
              </button>
              <button
                id="btn-theme-colorblind"
                onClick={() => setColorTheme('colorblind')}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  colorTheme === 'colorblind'
                    ? 'bg-white dark:bg-neutral-700 font-semibold shadow-xs text-sky-800 dark:text-sky-300'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Buta Warna
              </button>
              <button
                id="btn-theme-high-contrast"
                onClick={() => setColorTheme('high-contrast')}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  colorTheme === 'high-contrast'
                    ? 'bg-white dark:bg-neutral-700 font-bold shadow-xs text-black dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Kontras
              </button>
            </div>

            {/* CSV Download & Upload */}
            <div className="flex items-center gap-1.5">
              <button
                id="btn-download-csv"
                onClick={onDownloadCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors shadow-xs"
                title={`Unduh dataset ${currentPilot === 'gunungkidul' ? 'gn_kidul_sdfvi_data.csv' : 'solok_sdfvi_data.csv'}`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh CSV</span>
              </button>

              <button
                id="btn-upload-csv"
                onClick={onOpenUploadModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-xs"
                title="Unggah berkas CSV kustom"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Unggah</span>
              </button>

              <button
                id="btn-share-dashboard"
                onClick={onShare}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700 rounded-lg hover:bg-slate-200 transition-colors shadow-xs"
                title="Bagikan dashboard"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-1.5 overflow-x-auto pt-2.5 pb-1 border-t border-neutral-200/60 dark:border-neutral-800/60 mt-2.5 scrollbar-none" aria-label="Navigasi Utama">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
