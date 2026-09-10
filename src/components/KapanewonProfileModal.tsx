import React from 'react';
import { 
  X, 
  MapPin, 
  Activity, 
  CloudRain, 
  Wheat, 
  AlertTriangle, 
  Users, 
  Layers, 
  HelpCircle,
  FileCheck,
  ChevronRight,
  Printer,
  Sparkles,
  Mountain,
  Droplets
} from 'lucide-react';
import { KapanewonData, SolokKecamatanData, ColorTheme, PilotRegion } from '../types';
import { CONTEXTUAL_CHARACTERIZATION_DATA } from '../data/baselineData';
import { SOLOK_CONTEXTUAL_DATA } from '../data/solokBaselineData';
import { getCategoryBadgeClasses, getCategoryHexColor } from '../utils/calculations';

interface KapanewonProfileModalProps {
  selectedUnit: any | null;
  colorTheme: ColorTheme;
  currentPilot: PilotRegion;
  onClose: () => void;
  onOpenActionResearch?: (item: any) => void;
}

export const KapanewonProfileModal: React.FC<KapanewonProfileModalProps> = ({
  selectedUnit,
  colorTheme,
  currentPilot,
  onClose,
  onOpenActionResearch
}) => {
  if (!selectedUnit) return null;

  const isGunungkidul = currentPilot === 'gunungkidul' || selectedUnit.kapanewon !== undefined;
  const unitName = isGunungkidul ? selectedUnit.kapanewon : selectedUnit.NAMOBJ;

  const context = isGunungkidul
    ? (CONTEXTUAL_CHARACTERIZATION_DATA[unitName] || {
        kapanewon: unitName,
        geographic_zone: 'Karst Mixed',
        geographic_zone_detail: 'Kawasan peralihan Gunungkidul.',
        population_scale: 'Medium (30-50k)',
        economic_specialization: 'Palawija & tegalan',
        economic_detail: 'Pertanian jagung dan singkong.',
        dominant_hazard: 'Drought-prone',
        dominant_hazard_detail: 'Fluktuasi pasokan air musiman.',
        water_source_context: 'PAH dan sumur.'
      })
    : (SOLOK_CONTEXTUAL_DATA[unitName] || {
        kapanewon: unitName,
        geographic_zone: 'Highland valley',
        geographic_zone_detail: 'Kawasan lembah perbukitan Bukit Barisan.',
        population_scale: 'Medium (30-50k)',
        economic_specialization: 'Rice/sawah dominant',
        economic_detail: 'Sawah beririgasi dan tadah hujan beras Solok.',
        dominant_hazard: 'Drought-prone',
        dominant_hazard_detail: 'Defisit curah hujan kemarau 2023.',
        water_source_context: 'Irigasi gravitasi dan mata air.'
      });

  const badgeClass = getCategoryBadgeClasses(selectedUnit.priority_category, colorTheme);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-profile-title"
    >
      <div 
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col my-auto"
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-5 sm:px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base ${
              isGunungkidul 
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' 
                : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
            }`}>
              #{selectedUnit.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="modal-profile-title" className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                  {isGunungkidul ? `Kapanewon ${unitName}` : `Kecamatan ${unitName}`}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}>
                  {selectedUnit.priority_category}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {isGunungkidul
                  ? 'Pilot 1: Karst Gunungkidul (Sensus 18 Kapanewon)'
                  : 'Pilot 2: Dataran Tinggi Solok (Sensus 14 Kecamatan)'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Tutup jendela profil"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          
          {/* Main Score Banner */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Indeks Gabungan SDFVI–Proxy
              </span>
              <div className="text-3xl font-extrabold text-neutral-900 dark:text-white font-mono mt-1">
                {selectedUnit.SDFVI_proxy.toFixed(4)}
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                Peringkat #{selectedUnit.rank} dari {isGunungkidul ? '18 kapanewon' : '14 kecamatan'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Lembar</span>
              </button>
              {onOpenActionResearch && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenActionResearch(selectedUnit);
                  }}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg text-white shadow-xs flex items-center gap-1.5 ${
                    isGunungkidul ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Panduan Lapangan</span>
                </button>
              )}
            </div>
          </div>

          {/* 3 Component Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {isGunungkidul ? (
              <>
                {/* GK Component 1: L1 */}
                <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20 space-y-1">
                  <div className="flex items-center justify-between text-purple-700 dark:text-purple-400 text-xs font-bold">
                    <span>L1: Sensitivitas Sosial</span>
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-purple-900 dark:text-purple-200">
                    {selectedUnit.L1_social_sensitivity.toFixed(4)}
                  </div>
                  <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80">
                    ADK: {selectedUnit.adk_per_1000.toFixed(2)} / 1k • Lansia: {selectedUnit.neglected_elderly_per_1000.toFixed(2)} / 1k
                  </p>
                </div>

                {/* GK Component 2: H */}
                <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 space-y-1">
                  <div className="flex items-center justify-between text-blue-700 dark:text-blue-400 text-xs font-bold">
                    <span>H: Bahaya CHIRPS</span>
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-blue-900 dark:text-blue-200">
                    {selectedUnit.H_meteorological_hazard.toFixed(4)}
                  </div>
                  <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80">
                    Defisit Presipitasi Gabungan Kemarau 2015, 2019, 2024
                  </p>
                </div>

                {/* GK Component 3: F_area */}
                <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 space-y-1">
                  <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 text-xs font-bold">
                    <span>F_area: Defisit Lahan</span>
                    <Wheat className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-amber-900 dark:text-amber-200">
                    {selectedUnit.F_area_land_deficit_proxy.toFixed(4)}
                  </div>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                    Jagung + Singkong: {selectedUnit.harvested_area_per_capita.toFixed(4)} ha/kapita
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Solok Component 1: S_i */}
                <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20 space-y-1">
                  <div className="flex items-center justify-between text-purple-700 dark:text-purple-400 text-xs font-bold">
                    <span>S_i: Sensitivitas Gender</span>
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-purple-900 dark:text-purple-200">
                    {selectedUnit.S_i.toFixed(4)}
                  </div>
                  <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80">
                    Perempuan 60+ tanpa ijazah: ~{selectedUnit.women_60plus_no_edu} jiwa
                  </p>
                </div>

                {/* Solok Component 2: H_i */}
                <div className="p-3.5 rounded-xl border border-orange-200 dark:border-orange-900/50 bg-orange-50/50 dark:bg-orange-950/20 space-y-1">
                  <div className="flex items-center justify-between text-orange-700 dark:text-orange-400 text-xs font-bold">
                    <span>H_i: CHIRPS Kemarau 2023</span>
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-orange-900 dark:text-orange-200">
                    {selectedUnit.H_i.toFixed(4)}
                  </div>
                  <p className="text-[11px] text-orange-800/80 dark:text-orange-300/80">
                    Presipitasi: {selectedUnit.chirps_total_mm.toFixed(1)} mm (Jun-Okt 2023)
                  </p>
                </div>

                {/* Solok Component 3: E_i */}
                <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-1">
                  <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                    <span>E_i: Eksposur Sawah</span>
                    <Wheat className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-emerald-900 dark:text-emerald-200">
                    {selectedUnit.E_i.toFixed(4)}
                  </div>
                  <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                    Luas Sawah: {selectedUnit.sawah_total_ha.toLocaleString('id-ID')} ha
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Contextual Geographic Characterization */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-3">
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Profil Kontekstual & Lanskap</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 font-medium">Zona Geografis:</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                  {context.geographic_zone}
                </p>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  {context.geographic_zone_detail}
                </p>
              </div>

              <div>
                <span className="text-neutral-500 font-medium">Spesialisasi Agraris & Ekonomi:</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                  {context.economic_specialization}
                </p>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  {context.economic_detail}
                </p>
              </div>

              <div>
                <span className="text-neutral-500 font-medium">Profil Bahaya & Sumber Air:</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                  {context.dominant_hazard}
                </p>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  {context.water_source_context}
                </p>
              </div>

              <div>
                <span className="text-neutral-500 font-medium">
                  {isGunungkidul ? 'Estimasi Populasi:' : 'Karakteristik Pertanian & Elevasi:'}
                </span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                  {isGunungkidul ? context.population_scale : `${selectedUnit.dominant_rice_variety} (${selectedUnit.elevation_masl} mdpl)`}
                </p>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  {isGunungkidul ? 'Kepadatan penduduk sedang-tinggi' : `Sub-DAS: ${selectedUnit.sub_basin}`}
                </p>
              </div>
            </div>
          </div>

          {/* Action Research Guiding Questions */}
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
            <h4 className="font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Pertanyaan Kunci Verifikasi Lapangan (Action Research)</span>
            </h4>
            <p className="text-xs text-amber-900/90 dark:text-amber-300/90 leading-relaxed">
              {isGunungkidul ? (
                <>
                  Apakah penyandang disabilitas fisik, sensorik, dan lansia terlantar di Kapanewon {unitName} memiliki akses fisik yang memadai ke telaga, PAH komunal, atau tangki dropping air BPBD selama puncak kemarau?
                </>
              ) : (
                <>
                  Bagaimana pembagian beban kerja perempuan lansia (60+) di Kecamatan {unitName} dalam mengelola irigasi sawah terasering saat pasokan air kemarau menyusut drastis? Apakah terdapat skema perlindungan sosial khusus?
                </>
              )}
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-neutral-50 dark:bg-neutral-800/80 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>DICLIV Framework 2026 Adaptasi Indonesia</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 font-semibold text-neutral-800 dark:text-neutral-100 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
