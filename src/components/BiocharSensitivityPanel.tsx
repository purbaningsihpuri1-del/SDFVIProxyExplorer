import React, { useState, useMemo } from 'react';
import { 
  Droplets, 
  FlaskConical, 
  AlertTriangle, 
  Layers, 
  Info, 
  HelpCircle, 
  Maximize2, 
  TrendingUp,
  Sliders,
  Sparkles
} from 'lucide-react';
import { BIOCHAR_SENSITIVITY_DATA, BIOCHAR_DISCLAIMER_NOTE } from '../data/biocharData';
import { BiocharKapanewonData } from '../types';

interface BiocharSensitivityPanelProps {
  onSelectKapanewon?: (kapanewon: string) => void;
}

export const BiocharSensitivityPanel: React.FC<BiocharSensitivityPanelProps> = ({ onSelectKapanewon }) => {
  const [selectedUnit, setSelectedUnit] = useState<string>('Ponjong');
  const [customWHC, setCustomWHC] = useState<number>(25); // percentage increase
  const [activeScenario, setActiveScenario] = useState<'all' | 'konservatif' | 'moderat' | 'optimistis'>('all');

  const selectedData = useMemo(() => {
    return BIOCHAR_SENSITIVITY_DATA.find(d => d.kapanewon === selectedUnit) || BIOCHAR_SENSITIVITY_DATA[0];
  }, [selectedUnit]);

  // Sort by equivalent volume descending
  const sortedByVolume = useMemo(() => {
    return [...BIOCHAR_SENSITIVITY_DATA].sort((a, b) => b.equivalentVolumeML - a.equivalentVolumeML);
  }, []);

  // Filter 4 hotspots
  const hotspots = useMemo(() => {
    return BIOCHAR_SENSITIVITY_DATA.filter(d => d.isHotspotKritis);
  }, []);

  // Custom calculated value based on slider
  const customCalculatedMm = useMemo(() => {
    // 25% corresponds to deltaMmOptimistis
    const mm = selectedData?.deltaMmOptimistis ?? 0;
    return ((mm / 25) * customWHC).toFixed(2);
  }, [selectedData, customWHC]);

  const customCalculatedML = useMemo(() => {
    const ml = selectedData?.equivalentVolumeML ?? 0;
    return ((ml / 25) * customWHC).toFixed(1);
  }, [selectedData, customWHC]);

  return (
    <div className="space-y-6" id="biochar-sensitivity-panel">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-500/10 via-fuchsia-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                <FlaskConical className="w-3.5 h-3.5" /> Analisis Sensitivitas Eksploratif
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                CHIRPS Jun–Okt 2019 (El Niño)
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Potensi Tambahan Air Efektif Berbasis Presipitasi & Retensi Biochar
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
              Eksplorasi kenaikan kapasitas retensi air tanah (Water Holding Capacity / WHC) melalui skenario aplikasi biochar lokal untuk memitigasi defisit presipitasi di karst Gunungkidul.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 backdrop-blur-sm">
            <div className="text-right">
              <div className="text-xs text-slate-400">Pilih Kapanewon:</div>
              <select 
                id="biochar-kapanewon-select"
                value={selectedUnit}
                onChange={(e) => {
                  setSelectedUnit(e.target.value);
                  if (onSelectKapanewon) onSelectKapanewon(e.target.value);
                }}
                className="mt-0.5 bg-slate-900 text-white font-medium text-sm rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {sortedByVolume.map((item) => (
                  <option key={item.kapanewon} value={item.kapanewon}>
                    {item.kapanewon} {item.isHotspotKritis ? '★ Hotspot Kritis' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4 Hotspot Kritis Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          {hotspots.map((hs) => {
            const isSelected = selectedUnit === hs.kapanewon;
            return (
              <button
                key={hs.kapanewon}
                id={`hotspot-btn-${hs.kapanewon.toLowerCase()}`}
                onClick={() => setSelectedUnit(hs.kapanewon)}
                className={`p-3 rounded-xl text-left transition-all border ${
                  isSelected 
                    ? 'bg-fuchsia-950/40 border-fuchsia-500/80 shadow-lg shadow-fuchsia-950/30 ring-1 ring-fuchsia-500'
                    : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-fuchsia-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Hotspot Kritis
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-fuchsia-900/60 text-fuchsia-200 border border-fuchsia-800/60">
                    +25% WHC
                  </span>
                </div>
                <div className="text-base font-bold text-white mt-1">{hs.kapanewon}</div>
                <div className="flex items-baseline justify-between mt-1 text-xs">
                  <span className="text-slate-400">Tambahan Air:</span>
                  <span className="font-mono font-semibold text-fuchsia-300">+{hs.deltaMmOptimistis} mm</span>
                </div>
                <div className="flex items-baseline justify-between text-xs mt-0.5">
                  <span className="text-slate-400">Vol. Ekuivalen:</span>
                  <span className="font-mono font-semibold text-slate-200">{hs.equivalentVolumeML} ML</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Spatial Scatter Coordinates Map (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Sebaran Spasial Indeks Tambahan Air Efektif
                </h3>
                <p className="text-xs text-slate-500">
                  Berdasarkan Delta mm pada Skenario Optimistis 25% (Presipitasi CHIRPS 2019)
                </p>
              </div>
              <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                <Layers className="w-4 h-4" />
              </div>
            </div>

            {/* Custom SVG Spatial Coordinate Map (Matching Figure 1) */}
            <div className="relative w-full aspect-[1/1] bg-slate-950 rounded-xl p-4 my-3 border border-slate-800 overflow-hidden">
              {/* Lat/Long Grid Lines */}
              <div className="absolute inset-0 opacity-15 pointer-events-none grid grid-cols-4 grid-rows-4 divide-x divide-y divide-teal-500" />
              
              <div className="absolute top-2 left-3 text-[10px] text-teal-400/80 font-mono">
                110.40°E — 110.80°E
              </div>
              <div className="absolute bottom-2 right-3 text-[10px] text-teal-400/80 font-mono">
                -7.80°S — -8.20°S
              </div>

              {/* Scatter Points */}
              <svg className="w-full h-full" viewBox="110.38 -8.22 0.44 0.44">
                {/* Background coordinate axes subtle */}
                <line x1="110.4" y1="-8.0" x2="110.8" y2="-8.0" stroke="#334155" strokeWidth="0.001" strokeDasharray="0.005,0.005" />
                <line x1="110.6" y1="-7.8" x2="110.6" y2="-8.2" stroke="#334155" strokeWidth="0.001" strokeDasharray="0.005,0.005" />

                {BIOCHAR_SENSITIVITY_DATA.map((d) => {
                  const isSelected = selectedUnit === d.kapanewon;
                  const isHotspot = d.isHotspotKritis;
                  const circleRadius = isSelected ? 0.012 : isHotspot ? 0.009 : 0.007;

                  return (
                    <g 
                      key={d.kapanewon}
                      onClick={() => {
                        setSelectedUnit(d.kapanewon);
                        if (onSelectKapanewon) onSelectKapanewon(d.kapanewon);
                      }}
                      className="cursor-pointer transition-transform hover:scale-125"
                    >
                      {/* Halo ring for selected or hotspot */}
                      {(isSelected || isHotspot) && (
                        <circle
                          cx={d.longitude}
                          cy={d.latitude}
                          r={circleRadius * 1.8}
                          fill="none"
                          stroke={isHotspot ? "#ec4899" : "#14b8a6"}
                          strokeWidth="0.002"
                          opacity={isSelected ? 0.8 : 0.4}
                          className={isHotspot ? "animate-pulse" : ""}
                        />
                      )}
                      
                      {/* Main Node */}
                      <circle
                        cx={d.longitude}
                        cy={d.latitude}
                        r={circleRadius}
                        fill={isHotspot ? "#ec4899" : "#06b6d4"}
                        stroke="#ffffff"
                        strokeWidth="0.0015"
                      />

                      {/* Label */}
                      <text
                        x={d.longitude}
                        y={d.latitude - 0.01}
                        fontSize="0.011"
                        fontWeight={isSelected || isHotspot ? "bold" : "normal"}
                        textAnchor="middle"
                        fill={isSelected ? "#ffffff" : isHotspot ? "#f472b6" : "#a5f3fc"}
                        className="pointer-events-none select-none drop-shadow"
                      >
                        {d.kapanewon} ({(d.deltaMmOptimistis ?? 0).toFixed(1)})
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Floating Legend */}
              <div className="absolute bottom-2 left-3 bg-slate-900/90 border border-slate-800 rounded-lg p-2 text-[11px] space-y-1 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-pink-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block" />
                  <span className="font-semibold">Hotspot Kritis (4 Kapanewon)</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                  <span>Kapanewon Lainnya (14 Unit)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Slider */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-teal-600" />
                Simulasi Kenaikan WHC Biochar:
              </span>
              <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono font-bold">
                +{customWHC}% WHC
              </span>
            </div>
            
            <input 
              id="whc-slider"
              type="range"
              min="5"
              max="35"
              step="5"
              value={customWHC}
              onChange={(e) => setCustomWHC(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>5% (Konservatif)</span>
              <span>15% (Moderat)</span>
              <span>25% (Optimistis)</span>
              <span>35% (Maksimal)</span>
            </div>

            {/* Dynamic Results for Selected Unit */}
            <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Hasil Simulasi ({selectedData.kapanewon}):</span>
                <div className="text-xs font-medium text-slate-800">
                  Volume Tertahan: <span className="font-mono font-bold text-teal-700">{customCalculatedML} ML</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-extrabold text-teal-600 font-mono">
                  +{customCalculatedMm} mm
                </div>
                <span className="text-[10px] text-slate-400">kedalaman air efektif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Charts & Scenarios (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Chart 1: Volume Ekuivalen Tertahan (ML) Across 18 Kapanewon */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Volume Ekuivalen Berbasis Luas Administratif (ML)
                </h3>
                <p className="text-xs text-slate-500">
                  — Ilustratif, Bukan Estimasi Volume Intervensi Lapangan —
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                Peringkat 18 Kapanewon
              </span>
            </div>

            <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-2">
              {sortedByVolume.map((item, idx) => {
                const isSelected = selectedUnit === item.kapanewon;
                const maxVol = 571.7; // Ponjong is max
                const pct = (item.equivalentVolumeML / maxVol) * 100;

                return (
                  <div 
                    key={item.kapanewon}
                    id={`bar-volume-${item.kapanewon.toLowerCase()}`}
                    onClick={() => {
                      setSelectedUnit(item.kapanewon);
                      if (onSelectKapanewon) onSelectKapanewon(item.kapanewon);
                    }}
                    className={`flex items-center gap-3 p-1.5 rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-fuchsia-50 border border-fuchsia-200' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-6 text-xs text-slate-400 font-mono text-right">{idx + 1}</span>
                    <span className={`w-28 text-xs truncate ${item.isHotspotKritis ? 'font-bold text-fuchsia-700' : 'text-slate-700'}`}>
                      {item.kapanewon}
                      {item.isHotspotKritis && ' ★'}
                    </span>
                    
                    {/* Bar */}
                    <div className="flex-1 bg-slate-100 h-4 rounded-full overflow-hidden relative">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.isHotspotKritis 
                            ? 'bg-fuchsia-600' 
                            : isSelected 
                              ? 'bg-teal-500' 
                              : 'bg-slate-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <span className="w-16 text-xs font-mono font-semibold text-slate-900 text-right">
                      {(item.equivalentVolumeML ?? 0).toFixed(1)} ML
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: 3 Sensitivity Scenarios Comparison for 4 Critical Hotspots */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Tambahan Air Efektif Ekuivalen (mm)
                </h3>
                <p className="text-xs text-slate-500">
                  Perbandingan 3 Tingkat Sensitivitas Skenario Mitigasi Biochar pada 4 Hotspot Kritis
                </p>
              </div>

              {/* Scenario Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
                <button
                  onClick={() => setActiveScenario('all')}
                  className={`px-2 py-1 text-xs rounded font-medium ${
                    activeScenario === 'all' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setActiveScenario('konservatif')}
                  className={`px-2 py-1 text-xs rounded font-medium ${
                    activeScenario === 'konservatif' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  +5%
                </button>
                <button
                  onClick={() => setActiveScenario('moderat')}
                  className={`px-2 py-1 text-xs rounded font-medium ${
                    activeScenario === 'moderat' ? 'bg-white shadow-xs text-amber-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  +15%
                </button>
                <button
                  onClick={() => setActiveScenario('optimistis')}
                  className={`px-2 py-1 text-xs rounded font-medium ${
                    activeScenario === 'optimistis' ? 'bg-white shadow-xs text-fuchsia-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  +25%
                </button>
              </div>
            </div>

            {/* Hotspot Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hotspots.map((hs) => {
                const isSelected = selectedUnit === hs.kapanewon;
                return (
                  <div 
                    key={hs.kapanewon}
                    onClick={() => {
                      setSelectedUnit(hs.kapanewon);
                      if (onSelectKapanewon) onSelectKapanewon(hs.kapanewon);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-fuchsia-50/70 border-fuchsia-300 ring-1 ring-fuchsia-400' 
                        : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-fuchsia-600" />
                        {hs.kapanewon}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        {hs.equivalentVolumeML} ML
                      </span>
                    </div>

                    {/* Grouped Value Bars */}
                    <div className="space-y-1.5 text-xs">
                      {(activeScenario === 'all' || activeScenario === 'konservatif') && (
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-700 font-medium">Konservatif (+5% WHC):</span>
                          <span className="font-mono font-bold text-slate-800">+{hs.konservatifWHC} mm</span>
                        </div>
                      )}
                      {(activeScenario === 'all' || activeScenario === 'moderat') && (
                        <div className="flex items-center justify-between">
                          <span className="text-amber-700 font-medium">Moderat (+15% WHC):</span>
                          <span className="font-mono font-bold text-slate-800">+{hs.moderatWHC} mm</span>
                        </div>
                      )}
                      {(activeScenario === 'all' || activeScenario === 'optimistis') && (
                        <div className="flex items-center justify-between">
                          <span className="text-fuchsia-700 font-bold">Optimistis (+25% WHC):</span>
                          <span className="font-mono font-extrabold text-fuchsia-700">+{hs.optimistisWHC} mm</span>
                        </div>
                      )}
                    </div>

                    {/* Progress representation */}
                    <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden flex">
                      <div 
                        className="bg-emerald-500 h-full" 
                        style={{ width: `${(hs.konservatifWHC / hs.optimistisWHC) * 100}%` }} 
                        title={`Konservatif: ${hs.konservatifWHC} mm`}
                      />
                      <div 
                        className="bg-amber-500 h-full" 
                        style={{ width: `${((hs.moderatWHC - hs.konservatifWHC) / hs.optimistisWHC) * 100}%` }} 
                        title={`Moderat: ${hs.moderatWHC} mm`}
                      />
                      <div 
                        className="bg-fuchsia-600 h-full" 
                        style={{ width: `${((hs.optimistisWHC - hs.moderatWHC) / hs.optimistisWHC) * 100}%` }} 
                        title={`Optimistis: ${hs.optimistisWHC} mm`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Official Methodological Disclaimer / Footnote Box */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-bold">Catatan Metodologis & Batasan Analisis:</span> {BIOCHAR_DISCLAIMER_NOTE}
        </div>
      </div>
    </div>
  );
};
