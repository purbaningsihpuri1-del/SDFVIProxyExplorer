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
import { Download, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';

export default function App() {
  const [currentPilot, setCurrentPilot] = useState<PilotRegion>('gunungkidul');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('standard');
  const [data, setData] = useState<KapanewonData[]>(PUBLISHED_BASELINE_DATA);
  const [dataSourceLabel, setDataSourceLabel] = useState<string>('Data Dasar Terpublikasi Peneliti (18 Kapanewon)');
  const [isBaseline, setIsBaseline] = useState<boolean>(true);
  const [shareToast, setShareToast] = useState<boolean>(false);
  
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

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-150 ${
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

      {/* Share Toast Notification */}
      {shareToast && (
        <div 
          role="status"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-emerald-800 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>Tautan aplikasi berhasil disalin ke papan klip!</span>
        </div>
      )}

      {/* Dataset Provenance Sub-Banner */}
      <aside 
        id="dataset-provenance-banner"
        aria-label="Informasi Sumber Data Aktif"
        className="bg-white dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700/80 px-4 sm:px-6 py-2.5 shadow-2xs"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              currentPilot === 'gunungkidul' 
                ? (isBaseline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500') 
                : 'bg-blue-500 animate-pulse'
            }`} />
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">Dataset Aktif:</span>
            <span className="font-bold text-neutral-900 dark:text-white">
              {currentPilot === 'gunungkidul' 
                ? (isBaseline ? 'DATASET 1: Gunungkidul Pilot (18 Kapanewon)' : dataSourceLabel) 
                : 'DATASET 2: Solok Pilot (14 Kecamatan)'}
            </span>
            <span className="hidden sm:inline text-neutral-400 dark:text-neutral-600">•</span>
            <span className="hidden sm:inline text-neutral-500 dark:text-neutral-400 font-medium">
              {currentPilot === 'gunungkidul' 
                ? 'Karst, Palawija & Inklusi Disabilitas (100% Sensus Spasial)' 
                : 'Dataran Tinggi, Beras Solok & Responsif Gender (100% Sensus Spasial)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentPilot === 'gunungkidul' && !isBaseline && (
              <button
                onClick={handleResetToBaseline}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-colors"
                title="Kembalikan ke data penelitian asli"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset ke Data Asli</span>
              </button>
            )}

            <button
              id="btn-export-csv"
              onClick={handleExportCsv}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-white shadow-2xs transition-colors ${
                currentPilot === 'gunungkidul' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-blue-700 hover:bg-blue-800'
              }`}
              title={currentPilot === 'gunungkidul' ? "Unduh gn_kidul_sdfvi_data.csv (18 baris)" : "Unduh solok_sdfvi_data.csv (14 baris)"}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV ({currentPilot === 'gunungkidul' ? 'gn_kidul_sdfvi_data.csv' : 'solok_sdfvi_data.csv'})</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
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
      <footer className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700/80 px-4 sm:px-6 py-6 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-semibold text-neutral-800 dark:text-neutral-200">
              SDFVI–Proxy Explorer — Dual Pilot: Gunungkidul & Solok (SEHATI / DICLIV Indonesia Adaptation)
            </p>
            <p className="text-[11px] leading-relaxed">
              Diadaptasi dari Disability-Inclusive Climate Vulnerability (DICLIV) Index (Rotarou & Figueroa, 2026, <em>Sustainability</em>, DOI: 10.3390/su18115645).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span>Gunungkidul (18 Kapanewon)</span>
            <span>•</span>
            <span>Solok (14 Kecamatan)</span>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('biochar')}
              className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
            >
              Simulasi Biochar
            </button>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('policy')}
              className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
            >
              Pedoman Kebijakan
            </button>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('methodology')}
              className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
            >
              Metodologi
            </button>
          </div>
        </div>
      </footer>

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
