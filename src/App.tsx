import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AboutThisTool } from './components/AboutThisTool';
import { OverviewSection } from './components/OverviewSection';
import { MapSection } from './components/MapSection';
import { ComparisonCharts } from './components/ComparisonCharts';
import { ContextualTable } from './components/ContextualTable';
import { BiocharSensitivityPanel } from './components/BiocharSensitivityPanel';
import { DataQualityPanel } from './components/DataQualityPanel';
import { ActionResearchPanel } from './components/ActionResearchPanel';
import { PolicyInterpretation } from './components/PolicyInterpretation';
import { MethodologyPage } from './components/MethodologyPage';
import { FutureRoadmap } from './components/FutureRoadmap';
import { KapanewonProfileModal } from './components/KapanewonProfileModal';
import { CsvUploadModal } from './components/CsvUploadModal';
import { PUBLISHED_BASELINE_DATA } from './data/baselineData';
import { PUBLISHED_SOLOK_DATA } from './data/solokBaselineData';
import { KapanewonData, ColorTheme, ActiveTab, PilotRegion } from './types';
import { exportDataToCsv, exportSolokDataToCsv } from './utils/csvParser';
import { 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles,
  FileText,
  MapPin,
  BarChart3,
  Table as TableIcon,
  MoreHorizontal,
  X,
  Compass,
  FlaskConical,
  Scale,
  BookOpen,
  Milestone,
  HelpCircle,
  Upload,
  Share2,
  Eye
} from 'lucide-react';

export default function App() {
  const [currentPilot, setCurrentPilot] = useState<PilotRegion>('gunungkidul');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('standard');
  const [data, setData] = useState<KapanewonData[]>(PUBLISHED_BASELINE_DATA);
  const [dataSourceLabel, setDataSourceLabel] = useState<string>('Data Dasar Terpublikasi Peneliti (18 Kapanewon)');
  const [isBaseline, setIsBaseline] = useState<boolean>(true);
  const [shareToast, setShareToast] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Modals state
  const [selectedKapanewon, setSelectedKapanewon] = useState<any | null>(null);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);

  // Switch pilot handler
  const handleSwitchPilot = (pilot: PilotRegion) => {
    setCurrentPilot(pilot);
    if (pilot === 'gunungkidul') {
      setDataSourceLabel(isBaseline ? 'Data Dasar Terpublikasi Peneliti (18 Kapanewon)' : 'Data Kustom Gunungkidul');
    } else {
      setDataSourceLabel('Data Resmi Solok Pilot (14 Kecamatan - SUT2026 / CHIRPS 2023)');
    }
  };

  // Apply custom uploaded CSV data (Gunungkidul)
  const handleApplyCustomData = (newData: KapanewonData[], label: string) => {
    setData(newData);
    setDataSourceLabel(label);
    setIsBaseline(false);
  };

  // Reset to original published baseline
  const handleResetToBaseline = () => {
    setData(PUBLISHED_BASELINE_DATA);
    setDataSourceLabel('Data Dasar Terpublikasi Peneliti (18 Kapanewon)');
    setIsBaseline(true);
  };

  // Handle Export CSV
  const handleExportCsv = () => {
    if (currentPilot === 'gunungkidul') {
      exportDataToCsv(data, 'gn_kidul_sdfvi_data.csv');
    } else {
      exportSolokDataToCsv(PUBLISHED_SOLOK_DATA, 'solok_sdfvi_data.csv');
    }
  };

  // Handle Share URL
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    }
  };

  const isMoreTabActive = ['biochar', 'quality', 'action_research', 'policy', 'methodology', 'roadmap'].includes(activeTab);

  return (
    <div className={`min-h-screen bg-[#F8F9FA] dark:bg-[#000000] text-[#1C1C1E] dark:text-[#F2F2F7] flex flex-col font-sans transition-colors duration-150 ${
      colorTheme === 'high-contrast' ? 'contrast-125' : ''
    }`}>
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        colorTheme={colorTheme}
        setColorTheme={setColorTheme}
        onOpenUploadModal={() => setIsCsvModalOpen(true)}
        onDownloadCSV={handleExportCsv}
        onShare={handleShare}
        dataSourceLabel={dataSourceLabel}
        currentPilot={currentPilot}
        setCurrentPilot={handleSwitchPilot}
      />

      {/* Share Toast Notification (Apple Floating Capsule) */}
      {shareToast && (
        <div 
          role="status"
          className="fixed top-20 right-4 sm:right-6 z-50 flex items-center gap-2 apple-glass text-[#1C1C1E] dark:text-white px-4 py-2.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-xs font-semibold animate-fade-in border border-black/[0.08] dark:border-white/[0.1]"
        >
          <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
          <span>Tautan berhasil disalin ke papan klip</span>
        </div>
      )}

      {/* Dataset Provenance Sub-Banner (Apple Status Strip) */}
      <aside 
        id="dataset-provenance-banner"
        aria-label="Informasi Sumber Data Aktif"
        className="bg-white/60 dark:bg-[#1C1C1E]/60 backdrop-blur-md border-b border-black/[0.04] dark:border-white/[0.06] px-4 sm:px-6 py-2"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${
              currentPilot === 'gunungkidul' 
                ? (isBaseline ? 'bg-[#34C759] ring-2 ring-[#34C759]/20' : 'bg-[#FF9500]') 
                : 'bg-[#007AFF] ring-2 ring-[#007AFF]/20'
            }`} />
            <span className="text-[#8E8E93] dark:text-[#98989D] font-medium text-[11px] sm:text-xs">Dataset:</span>
            <span className="font-semibold text-[#1C1C1E] dark:text-white text-[11px] sm:text-xs">
              {currentPilot === 'gunungkidul' 
                ? (isBaseline ? 'Gunungkidul Pilot (18 Kapanewon)' : dataSourceLabel) 
                : 'Solok Pilot (14 Kecamatan)'}
            </span>
            <span className="hidden sm:inline text-[#8E8E93]">•</span>
            <span className="hidden sm:inline text-[#8E8E93] dark:text-[#98989D] text-[11px]">
              {currentPilot === 'gunungkidul' 
                ? 'Karst, Palawija & Inklusi Disabilitas (100% Sensus Spasial)' 
                : 'Dataran Tinggi, Beras Solok & Responsif Gender (100% Sensus Spasial)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentPilot === 'gunungkidul' && !isBaseline && (
              <button
                onClick={handleResetToBaseline}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#767680]/12 text-[#1C1C1E] dark:text-white hover:bg-[#767680]/20 transition-all apple-tap"
                title="Kembalikan ke data penelitian asli"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset ke Data Asli</span>
              </button>
            )}

            <button
              id="btn-export-csv"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-[#007AFF] bg-[#007AFF]/10 hover:bg-[#007AFF]/15 transition-all apple-tap"
              title={currentPilot === 'gunungkidul' ? "Unduh gn_kidul_sdfvi_data.csv" : "Unduh solok_sdfvi_data.csv"}
            >
              <Download className="w-3 h-3" />
              <span>Unduh CSV</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container - Adjusted with mobile bottom pad so bar never overlaps */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6 pb-28 md:pb-12">
        
        {/* At top of dashboard: Title, Subtitle, and Full Text as About This Tool */}
        <AboutThisTool 
          defaultExpanded={true} 
          currentPilot={currentPilot}
          onSwitchPilot={handleSwitchPilot}
        />

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <OverviewSection
            data={data}
            colorTheme={colorTheme}
            currentPilot={currentPilot}
            onSwitchPilot={handleSwitchPilot}
            onSelectKapanewon={setSelectedKapanewon}
            onNavigateTab={(tab) => setActiveTab(tab as ActiveTab)}
          />
        )}

        {/* Tab 2: Map */}
        {activeTab === 'map' && (
          <MapSection
            data={data}
            colorTheme={colorTheme}
            currentPilot={currentPilot}
            onSwitchPilot={handleSwitchPilot}
            onSelectKapanewon={setSelectedKapanewon}
          />
        )}

        {/* Tab 3: Comparison Charts */}
        {activeTab === 'charts' && (
          <ComparisonCharts
            data={data}
            colorTheme={colorTheme}
            currentPilot={currentPilot}
            onSwitchPilot={handleSwitchPilot}
            onSelectKapanewon={setSelectedKapanewon}
          />
        )}

        {/* Tab 4: Contextual Table */}
        {activeTab === 'context' && (
          <ContextualTable
            data={data}
            colorTheme={colorTheme}
            currentPilot={currentPilot}
            onSwitchPilot={handleSwitchPilot}
            onSelectKapanewon={setSelectedKapanewon}
          />
        )}

        {/* Tab 5: Biochar Sensitivity Simulator */}
        {activeTab === 'biochar' && (
          <BiocharSensitivityPanel
            currentPilot={currentPilot}
            onSwitchPilot={handleSwitchPilot}
          />
        )}

        {/* Tab 6: Data Quality Panel */}
        {activeTab === 'quality' && (
          <DataQualityPanel
            data={data}
            provenanceLabel={dataSourceLabel}
            onRunAudit={() => {}}
          />
        )}

        {/* Tab 7: Action-Research Panel */}
        {activeTab === 'action_research' && (
          <ActionResearchPanel
            data={data}
            selectedKapanewon={selectedKapanewon}
            currentPilot={currentPilot}
            onSwitchPilot={handleSwitchPilot}
            onSelectKapanewon={setSelectedKapanewon}
          />
        )}

        {/* Tab 8: Policy Interpretation */}
        {activeTab === 'policy' && (
          <PolicyInterpretation />
        )}

        {/* Tab 9: Methodology */}
        {activeTab === 'methodology' && (
          <MethodologyPage />
        )}

        {/* Tab 10: Future Roadmap */}
        {activeTab === 'roadmap' && (
          <FutureRoadmap />
        )}
      </main>

      {/* Persistent Accessible Footer */}
      <footer className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-md border-t border-black/[0.06] dark:border-white/[0.08] px-4 sm:px-6 py-6 text-xs text-[#8E8E93] dark:text-[#98989D] mb-14 md:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-semibold text-[#1C1C1E] dark:text-[#F2F2F7]">
              SDFVI–Proxy Explorer — Dual Pilot: Gunungkidul & Solok (SEHATI / DICLIV Indonesia Adaptation)
            </p>
            <p className="text-[11px] leading-relaxed text-[#8E8E93]">
              Diadaptasi dari Disability-Inclusive Climate Vulnerability (DICLIV) Index (Rotarou & Figueroa, 2026, <em>Sustainability</em>, DOI: 10.3390/su18115645).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <span>Gunungkidul (18 Kapanewon)</span>
            <span>•</span>
            <span>Solok (14 Kecamatan)</span>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('biochar')}
              className="text-[#007AFF] hover:underline font-semibold"
            >
              Simulasi Biochar
            </button>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('policy')}
              className="text-[#007AFF] hover:underline font-semibold"
            >
              Pedoman Kebijakan
            </button>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('methodology')}
              className="text-[#007AFF] hover:underline font-semibold"
            >
              Metodologi
            </button>
          </div>
        </div>
      </footer>

      {/* APPLE iOS BOTTOM TAB BAR FOR MOBILE PHONES */}
      <nav 
        aria-label="Navigasi Utama Ponsel"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 apple-glass border-t border-black/[0.08] dark:border-white/[0.08] pb-safe flex items-center justify-around px-1 py-1.5 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
      >
        {/* Tab 1: Ringkasan */}
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center justify-center flex-1 min-h-[44px] py-1 transition-all apple-tap ${
            activeTab === 'overview' 
              ? 'text-[#007AFF] font-semibold' 
              : 'text-[#8E8E93] dark:text-[#98989D]'
          }`}
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Ringkasan</span>
        </button>

        {/* Tab 2: Peta Spasial */}
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center flex-1 min-h-[44px] py-1 transition-all apple-tap ${
            activeTab === 'map' 
              ? 'text-[#007AFF] font-semibold' 
              : 'text-[#8E8E93] dark:text-[#98989D]'
          }`}
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Peta</span>
        </button>

        {/* Tab 3: Grafik */}
        <button
          onClick={() => setActiveTab('charts')}
          className={`flex flex-col items-center justify-center flex-1 min-h-[44px] py-1 transition-all apple-tap ${
            activeTab === 'charts' 
              ? 'text-[#007AFF] font-semibold' 
              : 'text-[#8E8E93] dark:text-[#98989D]'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Grafik</span>
        </button>

        {/* Tab 4: Karakteristik */}
        <button
          onClick={() => setActiveTab('context')}
          className={`flex flex-col items-center justify-center flex-1 min-h-[44px] py-1 transition-all apple-tap ${
            activeTab === 'context' 
              ? 'text-[#007AFF] font-semibold' 
              : 'text-[#8E8E93] dark:text-[#98989D]'
          }`}
        >
          <TableIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Karakter</span>
        </button>

        {/* Tab 5: Menu Lainnya (iOS Action Sheet trigger) */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`flex flex-col items-center justify-center flex-1 min-h-[44px] py-1 transition-all apple-tap ${
            isMoreTabActive 
              ? 'text-[#007AFF] font-semibold' 
              : 'text-[#8E8E93] dark:text-[#98989D]'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Lainnya</span>
        </button>
      </nav>

      {/* APPLE iOS ACTION SHEET / BOTTOM DRAWER FOR MOBILE */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="bg-white dark:bg-[#1C1C1E] rounded-t-[28px] border-t border-black/[0.08] dark:border-white/[0.1] shadow-2xl p-4 sm:p-5 max-h-[85vh] overflow-y-auto pb-safe space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Apple Sheet Drag Grabber */}
            <div className="w-10 h-1 rounded-full bg-[#767680]/30 dark:bg-[#767680]/50 mx-auto" />

            <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-[#1C1C1E] dark:text-white">
                  Menu & Modul Tambahan
                </h3>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-[#767680]/12 dark:bg-[#767680]/24 flex items-center justify-center text-[#8E8E93] apple-tap"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-tools Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setActiveTab('biochar'); setIsMobileMenuOpen(false); }}
                className={`p-3 rounded-2xl flex items-center gap-2.5 text-left border transition-all apple-tap ${
                  activeTab === 'biochar'
                    ? 'bg-[#34C759]/15 border-[#34C759]/30 text-[#248A3D] dark:text-[#30D158] font-semibold'
                    : 'bg-[#F2F2F7] dark:bg-[#2C2C2E] border-transparent text-[#1C1C1E] dark:text-[#F2F2F7]'
                }`}
              >
                <FlaskConical className="w-4 h-4 text-[#34C759] shrink-0" />
                <span className="text-xs font-medium">Sensitivitas Biochar</span>
              </button>

              <button
                onClick={() => { setActiveTab('quality'); setIsMobileMenuOpen(false); }}
                className={`p-3 rounded-2xl flex items-center gap-2.5 text-left border transition-all apple-tap ${
                  activeTab === 'quality'
                    ? 'bg-[#007AFF]/15 border-[#007AFF]/30 text-[#007AFF] font-semibold'
                    : 'bg-[#F2F2F7] dark:bg-[#2C2C2E] border-transparent text-[#1C1C1E] dark:text-[#F2F2F7]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-[#007AFF] shrink-0" />
                <span className="text-xs font-medium">Audit Mutu Data</span>
              </button>

              <button
                onClick={() => { setActiveTab('action_research'); setIsMobileMenuOpen(false); }}
                className={`p-3 rounded-2xl flex items-center gap-2.5 text-left border transition-all apple-tap ${
                  activeTab === 'action_research'
                    ? 'bg-[#AF52DE]/15 border-[#AF52DE]/30 text-[#AF52DE] font-semibold'
                    : 'bg-[#F2F2F7] dark:bg-[#2C2C2E] border-transparent text-[#1C1C1E] dark:text-[#F2F2F7]'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-[#AF52DE] shrink-0" />
                <span className="text-xs font-medium">Riset Aksi Lapangan</span>
              </button>

              <button
                onClick={() => { setActiveTab('policy'); setIsMobileMenuOpen(false); }}
                className={`p-3 rounded-2xl flex items-center gap-2.5 text-left border transition-all apple-tap ${
                  activeTab === 'policy'
                    ? 'bg-[#FF9500]/15 border-[#FF9500]/30 text-[#FF9500] font-semibold'
                    : 'bg-[#F2F2F7] dark:bg-[#2C2C2E] border-transparent text-[#1C1C1E] dark:text-[#F2F2F7]'
                }`}
              >
                <Scale className="w-4 h-4 text-[#FF9500] shrink-0" />
                <span className="text-xs font-medium">Panduan Kebijakan</span>
              </button>

              <button
                onClick={() => { setActiveTab('methodology'); setIsMobileMenuOpen(false); }}
                className={`p-3 rounded-2xl flex items-center gap-2.5 text-left border transition-all apple-tap ${
                  activeTab === 'methodology'
                    ? 'bg-[#5856D6]/15 border-[#5856D6]/30 text-[#5856D6] font-semibold'
                    : 'bg-[#F2F2F7] dark:bg-[#2C2C2E] border-transparent text-[#1C1C1E] dark:text-[#F2F2F7]'
                }`}
              >
                <BookOpen className="w-4 h-4 text-[#5856D6] shrink-0" />
                <span className="text-xs font-medium">Metodologi & DICLIV</span>
              </button>

              <button
                onClick={() => { setActiveTab('roadmap'); setIsMobileMenuOpen(false); }}
                className={`p-3 rounded-2xl flex items-center gap-2.5 text-left border transition-all apple-tap ${
                  activeTab === 'roadmap'
                    ? 'bg-[#007AFF]/15 border-[#007AFF]/30 text-[#007AFF] font-semibold'
                    : 'bg-[#F2F2F7] dark:bg-[#2C2C2E] border-transparent text-[#1C1C1E] dark:text-[#F2F2F7]'
                }`}
              >
                <Milestone className="w-4 h-4 text-[#007AFF] shrink-0" />
                <span className="text-xs font-medium">Roadmap SEHATI</span>
              </button>
            </div>

            {/* Settings & Fast Actions */}
            <div className="space-y-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#8E8E93] px-1">
                <span>PILIH WILAYAH PILOT</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { handleSwitchPilot('gunungkidul'); setIsMobileMenuOpen(false); }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all apple-tap ${
                    currentPilot === 'gunungkidul'
                      ? 'bg-[#007AFF] text-white shadow-xs'
                      : 'bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-[#F2F2F7]'
                  }`}
                >
                  Gunungkidul
                </button>
                <button
                  onClick={() => { handleSwitchPilot('solok'); setIsMobileMenuOpen(false); }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all apple-tap ${
                    currentPilot === 'solok'
                      ? 'bg-[#007AFF] text-white shadow-xs'
                      : 'bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-[#F2F2F7]'
                  }`}
                >
                  Solok
                </button>
              </div>

              {/* Data & Sharing Actions */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  onClick={() => { handleExportCsv(); setIsMobileMenuOpen(false); }}
                  className="p-2.5 rounded-xl bg-[#F2F2F7] dark:bg-[#2C2C2E] text-xs font-semibold flex flex-col items-center gap-1 apple-tap"
                >
                  <Download className="w-4 h-4 text-[#007AFF]" />
                  <span>Ekspor CSV</span>
                </button>

                <button
                  onClick={() => { setIsCsvModalOpen(true); setIsMobileMenuOpen(false); }}
                  className="p-2.5 rounded-xl bg-[#F2F2F7] dark:bg-[#2C2C2E] text-xs font-semibold flex flex-col items-center gap-1 apple-tap"
                >
                  <Upload className="w-4 h-4 text-[#34C759]" />
                  <span>Unggah CSV</span>
                </button>

                <button
                  onClick={() => { handleShare(); setIsMobileMenuOpen(false); }}
                  className="p-2.5 rounded-xl bg-[#F2F2F7] dark:bg-[#2C2C2E] text-xs font-semibold flex flex-col items-center gap-1 apple-tap"
                >
                  <Share2 className="w-4 h-4 text-[#AF52DE]" />
                  <span>Bagikan</span>
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 rounded-2xl bg-[#767680]/12 dark:bg-[#767680]/24 text-[#1C1C1E] dark:text-white font-semibold text-sm apple-tap"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Region Profile Modal */}
      {selectedKapanewon && (
        <KapanewonProfileModal
          selectedUnit={selectedKapanewon}
          colorTheme={colorTheme}
          currentPilot={currentPilot}
          onClose={() => setSelectedKapanewon(null)}
          onOpenActionResearch={(unit) => {
            setSelectedKapanewon(unit);
            setActiveTab('action_research');
          }}
        />
      )}

      {/* CSV Upload & Mapping Modal */}
      <CsvUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onApplyData={handleApplyCustomData}
        onResetToBaseline={handleResetToBaseline}
        currentIsBaseline={isBaseline}
      />
    </div>
  );
}
