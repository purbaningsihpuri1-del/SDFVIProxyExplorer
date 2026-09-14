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

  const isGunungkidul = Boolean(
    selectedUnit && (selectedUnit.kapanewon !== undefined || (currentPilot === 'gunungkidul' && selectedUnit.NAMOBJ === undefined))
  );
  const unitName = isGunungkidul ? (selectedUnit.kapanewon ?? 'Kapanewon') : (selectedUnit.NAMOBJ ?? 'Kecamatan');

  // Defensive metric extraction for Gunungkidul
  const gkADKPer1000 = Number(selectedUnit.ADK_per_1000 ?? selectedUnit.adk_per_1000 ?? 0);
  const gkNeglectedElderlyPer1000 = Number(selectedUnit.neglected_older_persons_per_1000 ?? selectedUnit.neglected_elderly_per_1000 ?? 0);
  const gkHarvestAreaPer1000 = Number(selectedUnit.harvest_area_per_1000_population ?? selectedUnit.harvested_area_per_capita ?? 0);
  const gkL1Social = Number(selectedUnit.L1_social_sensitivity ?? 0);
  const gkHHazard = Number(selectedUnit.H_meteorological_hazard ?? 0);
  const gkFArea = Number(selectedUnit.F_area_land_deficit_proxy ?? 0);

  // Defensive metric extraction for Solok
  const solokSi = Number(selectedUnit.S_i ?? 0);
  const solokHi = Number(selectedUnit.H_i ?? 0);
  const solokEi = Number(selectedUnit.E_i ?? 0);
  const solokChirps = Number(selectedUnit.chirps_total_mm ?? 0);
  const solokSawah = Number(selectedUnit.sawah_total_ha ?? 0);
  const solokWomen60 = Number(selectedUnit.women_60plus_no_edu ?? 0);
  const solokElevation = Number(selectedUnit.elevation_masl ?? 0);
  const solokRiceVariety = selectedUnit.dominant_rice_variety ?? 'Beras Solok';
  const solokSubBasin = selectedUnit.sub_basin ?? '-';

  // Overall SDFVI score
  const sdfviScore = Number(selectedUnit.SDFVI_proxy ?? 0);

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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-profile-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white dark:bg-[#1C1C1E] border-t sm:border border-black/[0.08] dark:border-white/[0.12] rounded-t-[28px] sm:rounded-3xl max-w-2xl w-full max-h-[90vh] sm:max-h-[88vh] overflow-y-auto shadow-2xl flex flex-col my-0 sm:my-auto pb-safe"
      >
        {/* iOS Pull Bar on Mobile */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.2 rounded-full bg-[#767680]/30" />
        </div>

        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-xl px-5 sm:px-6 py-4 border-b-2 border-black/[0.08] dark:border-white/[0.12] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-base tracking-tight shadow-xs ${
              isGunungkidul 
                ? 'bg-[#15803D]/20 text-[#14532D] dark:text-[#4ADE80] border border-[#15803D]/30' 
                : 'bg-[#0055D4]/20 text-[#00409A] dark:text-[#60A5FA] border border-[#0055D4]/30'
            }`}>
              #{selectedUnit.rank}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 id="modal-profile-title" className="text-lg sm:text-xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
                  {isGunungkidul ? `Kapanewon ${unitName}` : `Kecamatan ${unitName}`}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeClass}`}>
                  {selectedUnit.priority_category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] mt-0.5 font-medium">
                {isGunungkidul
                  ? 'Pilot 1: Karst Gunungkidul (Sensus 18 Kapanewon)'
                  : 'Pilot 2: Dataran Tinggi Solok (Sensus 14 Kecamatan)'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#E2E8F0] dark:bg-[#334155] text-[#0F172A] dark:text-white flex items-center justify-center hover:bg-[#CBD5E1] dark:hover:bg-[#475569] transition-all apple-tap border border-black/10 dark:border-white/10"
            aria-label="Tutup jendela profil"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-5 sm:space-y-6">
          
          {/* Main Score Banner */}
          <div className="p-5 rounded-2xl bg-[#F1F5F9] dark:bg-[#1E293B] border-2 border-black/[0.08] dark:border-white/[0.12] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-[#475569] dark:text-[#CBD5E1] uppercase tracking-wider">
                Indeks Gabungan SDFVI–Proxy
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white font-mono mt-1 tracking-tight">
                {sdfviScore.toFixed(4)}
              </div>
              <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] mt-1 font-semibold">
                Peringkat #{selectedUnit.rank ?? '-'} dari {isGunungkidul ? '18 kapanewon' : '14 kecamatan'}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs sm:text-sm font-bold rounded-full border-2 border-black/15 dark:border-white/20 bg-white dark:bg-[#27272A] text-[#0F172A] dark:text-white shadow-2xs hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 apple-tap"
              >
                <Printer className="w-4 h-4 text-[#475569] dark:text-[#CBD5E1]" />
                <span>Cetak Profil</span>
              </button>
              {onOpenActionResearch && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenActionResearch(selectedUnit);
                  }}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full text-white shadow-xs flex items-center gap-2 apple-tap ${
                    isGunungkidul 
                      ? 'bg-[#15803D] hover:bg-[#166534] border border-[#14532D]' 
                      : 'bg-[#0055D4] hover:bg-[#00409A] border border-[#003882]'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Panduan Riset Aksi</span>
                </button>
              )}
            </div>
          </div>

          {/* 3 Component Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {isGunungkidul ? (
              <>
                {/* GK Component 1: L1 */}
                <div className="p-4 rounded-2xl bg-[#7E22CE]/10 dark:bg-[#7E22CE]/20 border border-[#7E22CE]/30 space-y-1.5">
                  <div className="flex items-center justify-between text-[#6B21A8] dark:text-[#D8B4FE] text-xs sm:text-sm font-extrabold">
                    <span>L1: Sensitivitas Sosial</span>
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-[#0F172A] dark:text-white">
                    {gkL1Social.toFixed(4)}
                  </div>
                  <p className="text-xs text-[#334155] dark:text-[#CBD5E1] font-medium leading-tight" title="ADK: Anak Dengan Kedisabilitasan">
                    ADK (Anak Dengan Kedisabilitasan): {gkADKPer1000.toFixed(2)}/1k • Lansia: {gkNeglectedElderlyPer1000.toFixed(2)}/1k
                  </p>
                </div>

                {/* GK Component 2: H */}
                <div className="p-4 rounded-2xl bg-[#0055D4]/10 dark:bg-[#0055D4]/20 border border-[#0055D4]/30 space-y-1.5">
                  <div className="flex items-center justify-between text-[#00409A] dark:text-[#93C5FD] text-xs sm:text-sm font-extrabold">
                    <span>H: Bahaya CHIRPS</span>
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-[#0F172A] dark:text-white">
                    {gkHHazard.toFixed(4)}
                  </div>
                  <p className="text-xs text-[#334155] dark:text-[#CBD5E1] font-medium leading-tight">
                    Defisit Presipitasi Kemarau 2015, 2019, 2024
                  </p>
                </div>

                {/* GK Component 3: F_area */}
                <div className="p-4 rounded-2xl bg-[#C2410C]/10 dark:bg-[#C2410C]/20 border border-[#C2410C]/30 space-y-1.5">
                  <div className="flex items-center justify-between text-[#9A3412] dark:text-[#FDBA74] text-xs sm:text-sm font-extrabold">
                    <span>F_area: Defisit Lahan</span>
                    <Wheat className="w-4 h-4" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-[#0F172A] dark:text-white">
                    {gkFArea.toFixed(4)}
                  </div>
                  <p className="text-xs text-[#334155] dark:text-[#CBD5E1] font-medium leading-tight">
                    Panen Pangan: {gkHarvestAreaPer1000.toFixed(3)} ha/1k jiwa
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Solok Component 1: S_i */}
                <div className="p-4 rounded-2xl bg-[#7E22CE]/10 dark:bg-[#7E22CE]/20 border border-[#7E22CE]/30 space-y-1.5">
                  <div className="flex items-center justify-between text-[#6B21A8] dark:text-[#D8B4FE] text-xs sm:text-sm font-extrabold">
                    <span>S_i: Sensitivitas Gender</span>
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-[#0F172A] dark:text-white">
                    {solokSi.toFixed(4)}
                  </div>
                  <p className="text-xs text-[#334155] dark:text-[#CBD5E1] font-medium leading-tight">
                    Perempuan 60+ tanpa ijazah: ~{solokWomen60.toLocaleString('id-ID')} jiwa
                  </p>
                </div>

                {/* Solok Component 2: H_i */}
                <div className="p-4 rounded-2xl bg-[#C2410C]/10 dark:bg-[#C2410C]/20 border border-[#C2410C]/30 space-y-1.5">
                  <div className="flex items-center justify-between text-[#9A3412] dark:text-[#FDBA74] text-xs sm:text-sm font-extrabold">
                    <span>H_i: CHIRPS 2023</span>
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-[#0F172A] dark:text-white">
                    {solokHi.toFixed(4)}
                  </div>
                  <p className="text-xs text-[#334155] dark:text-[#CBD5E1] font-medium leading-tight">
                    Presipitasi: {solokChirps.toFixed(1)} mm (Jun-Okt 2023)
                  </p>
                </div>

                {/* Solok Component 3: E_i */}
                <div className="p-4 rounded-2xl bg-[#15803D]/10 dark:bg-[#15803D]/20 border border-[#15803D]/30 space-y-1.5">
                  <div className="flex items-center justify-between text-[#14532D] dark:text-[#86EFAC] text-xs sm:text-sm font-extrabold">
                    <span>E_i: Eksposur Sawah</span>
                    <Wheat className="w-4 h-4" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-[#0F172A] dark:text-white">
                    {solokEi.toFixed(4)}
                  </div>
                  <p className="text-xs text-[#334155] dark:text-[#CBD5E1] font-medium leading-tight">
                    Luas Sawah: {solokSawah.toLocaleString('id-ID')} ha
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Contextual Geographic Characterization */}
          <div className="p-5 rounded-2xl border-2 border-black/[0.08] dark:border-white/[0.12] bg-[#F8FAFC] dark:bg-[#1E293B]/60 space-y-3.5">
            <h4 className="font-extrabold text-sm sm:text-base text-[#0F172A] dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#15803D] dark:text-[#4ADE80]" />
              <span>Profil Kontekstual & Lanskap</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-[#475569] dark:text-[#94A3B8] font-bold">Zona Geografis:</span>
                <p className="font-bold text-[#0F172A] dark:text-white mt-0.5 text-sm sm:text-base">
                  {context.geographic_zone}
                </p>
                <p className="text-[#334155] dark:text-[#CBD5E1] text-xs sm:text-sm mt-0.5">
                  {context.geographic_zone_detail}
                </p>
              </div>

              <div>
                <span className="text-[#475569] dark:text-[#94A3B8] font-bold">Spesialisasi Agraris & Ekonomi:</span>
                <p className="font-bold text-[#0F172A] dark:text-white mt-0.5 text-sm sm:text-base">
                  {context.economic_specialization}
                </p>
                <p className="text-[#334155] dark:text-[#CBD5E1] text-xs sm:text-sm mt-0.5">
                  {context.economic_detail}
                </p>
              </div>

              <div>
                <span className="text-[#475569] dark:text-[#94A3B8] font-bold">Profil Bahaya & Sumber Air:</span>
                <p className="font-bold text-[#0F172A] dark:text-white mt-0.5 text-sm sm:text-base">
                  {context.dominant_hazard}
                </p>
                <p className="text-[#334155] dark:text-[#CBD5E1] text-xs sm:text-sm mt-0.5">
                  {context.water_source_context}
                </p>
              </div>

              <div>
                <span className="text-[#475569] dark:text-[#94A3B8] font-bold">
                  {isGunungkidul ? 'Estimasi Populasi:' : 'Karakteristik Pertanian & Elevasi:'}
                </span>
                <p className="font-bold text-[#0F172A] dark:text-white mt-0.5 text-sm sm:text-base">
                  {isGunungkidul ? context.population_scale : `${solokRiceVariety} (${solokElevation} mdpl)`}
                </p>
                <p className="text-[#334155] dark:text-[#CBD5E1] text-xs sm:text-sm mt-0.5">
                  {isGunungkidul ? 'Kepadatan penduduk sedang-tinggi' : `Sub-DAS: ${solokSubBasin}`}
                </p>
              </div>
            </div>
          </div>

          {/* Action Research Guiding Questions */}
          <div className="p-5 rounded-2xl bg-[#FFF7ED] dark:bg-[#431407]/40 border-2 border-[#C2410C]/30 space-y-2">
            <h4 className="font-extrabold text-sm sm:text-base text-[#7C2D12] dark:text-[#FED7AA] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#C2410C]" />
              <span>Pertanyaan Kunci Verifikasi Lapangan (Action Research)</span>
            </h4>
            <p className="text-sm text-[#431407] dark:text-[#FFEDD5] leading-relaxed font-normal">
              {isGunungkidul ? (
                <>
                  Apakah penyandang disabilitas fisik, sensorik, dan lansia terlantar di Kapanewon <strong>{unitName}</strong> memiliki akses fisik yang memadai ke telaga, PAH komunal, atau tangki dropping air BPBD selama puncak kemarau?
                </>
              ) : (
                <>
                  Bagaimana pembagian beban kerja perempuan lansia (60+) di Kecamatan <strong>{unitName}</strong> dalam mengelola irigasi sawah terasering saat pasokan air kemarau menyusut drastis? Apakah terdapat skema perlindungan sosial khusus?
                </>
              )}
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-[#F1F5F9] dark:bg-[#1E293B] border-t-2 border-black/[0.08] dark:border-white/[0.12] flex items-center justify-between text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] font-semibold">
          <span>DICLIV Framework 2026 Adaptasi Indonesia</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#0F172A] dark:bg-white hover:bg-black dark:hover:bg-slate-200 font-bold text-white dark:text-[#0F172A] transition-all apple-tap shadow-xs"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
