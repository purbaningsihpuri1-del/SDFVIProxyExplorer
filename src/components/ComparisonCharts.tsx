import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  ScatterChart, 
  Grid2X2, 
  Layers, 
  Table as TableIcon,
  Info,
  Compass,
  ArrowUpDown
} from 'lucide-react';
import { KapanewonData, SolokKecamatanData, ColorTheme, PilotRegion, PriorityCategory } from '../types';
import { PUBLISHED_SOLOK_DATA } from '../data/solokBaselineData';
import { getCategoryHexColor, getCategoryBadgeClasses } from '../utils/calculations';

interface ComparisonChartsProps {
  data: KapanewonData[];
  colorTheme: ColorTheme;
  currentPilot: PilotRegion;
  onSwitchPilot?: (pilot: PilotRegion) => void;
  onSelectKapanewon: (item: any) => void;
}

type ChartView = 'rank' | 'components' | 'scatter' | 'quadrant';

export const ComparisonCharts: React.FC<ComparisonChartsProps> = ({
  data,
  colorTheme,
  currentPilot,
  onSwitchPilot,
  onSelectKapanewon
}) => {
  const isGunungkidul = currentPilot === 'gunungkidul';
  const [activeChart, setActiveChart] = useState<ChartView>('rank');
  const [showTableAlternative, setShowTableAlternative] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<any | null>(null);

  const solokList = PUBLISHED_SOLOK_DATA;

  // Sorted items
  const gkSorted = useMemo(() => [...data].sort((a, b) => a.rank - b.rank), [data]);
  const solokSorted = useMemo(() => [...solokList].sort((a, b) => a.rank - b.rank), [solokList]);

  const activeSortedList = isGunungkidul ? gkSorted : solokSorted;

  return (
    <div className="space-y-6" id="comparison-charts-container">
      {/* Chart Selector & Accessibility Bar */}
      <div className="bg-white dark:bg-[#1E293B] border-2 border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] dark:text-white flex items-center gap-2.5 tracking-tight">
              <BarChart3 className="w-5 h-5 text-[#15803D] dark:text-[#4ADE80]" />
              <span>
                {isGunungkidul 
                  ? 'Grafik Komparatif Dimensi Kerentanan Gunungkidul' 
                  : 'Grafik Komparatif Dimensi Kerentanan Solok (14 Kecamatan)'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] mt-1.5 font-medium leading-relaxed">
              {isGunungkidul
                ? 'Analisis komparatif Sensitivitas Sosial (L1), Bahaya Meteorologis (H), dan Defisit Luas Panen (F_area).'
                : 'Analisis komparatif Sensitivitas Gender (S_i), Defisit CHIRPS 2023 (H_i), dan Eksposur Sawah Padi Anak Daro (E_i).'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Pilot Switcher */}
            {onSwitchPilot && (
              <div className="flex items-center bg-[#F1F5F9] dark:bg-[#0F172A] p-1 rounded-xl border border-black/10 dark:border-white/10 text-xs sm:text-sm font-bold mr-2">
                <button
                  onClick={() => onSwitchPilot('gunungkidul')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    isGunungkidul ? 'bg-[#15803D] text-white shadow-xs' : 'text-[#334155] dark:text-[#CBD5E1] hover:text-black dark:hover:text-white'
                  }`}
                >
                  Gunungkidul
                </button>
                <button
                  onClick={() => onSwitchPilot('solok')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    !isGunungkidul ? 'bg-[#0055D4] text-white shadow-xs' : 'text-[#334155] dark:text-[#CBD5E1] hover:text-black dark:hover:text-white'
                  }`}
                >
                  Solok
                </button>
              </div>
            )}

            {/* View Selector Buttons */}
            <div className="flex items-center bg-[#F1F5F9] dark:bg-[#0F172A] p-1 rounded-xl border border-black/10 dark:border-white/10 text-xs sm:text-sm font-bold">
              <button
                id="btn-chart-rank"
                onClick={() => setActiveChart('rank')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeChart === 'rank'
                    ? 'bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] font-extrabold shadow-xs'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:text-black dark:hover:text-white'
                }`}
              >
                Peringkat Indeks
              </button>
              <button
                id="btn-chart-components"
                onClick={() => setActiveChart('components')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeChart === 'components'
                    ? 'bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] font-extrabold shadow-xs'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:text-black dark:hover:text-white'
                }`}
              >
                3 Komponen
              </button>
              <button
                id="btn-chart-scatter"
                onClick={() => setActiveChart('scatter')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeChart === 'scatter'
                    ? 'bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] font-extrabold shadow-xs'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:text-black dark:hover:text-white'
                }`}
              >
                Diagram Sebar
              </button>
              <button
                id="btn-chart-quadrant"
                onClick={() => setActiveChart('quadrant')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeChart === 'quadrant'
                    ? 'bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] font-extrabold shadow-xs'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:text-black dark:hover:text-white'
                }`}
              >
                Kuadran Prioritas
              </button>
            </div>

            {/* Accessibility Toggle */}
            <button
              id="btn-chart-table-toggle"
              onClick={() => setShowTableAlternative(!showTableAlternative)}
              className={`p-2 rounded-xl border-2 text-xs font-bold transition-colors ${
                showTableAlternative
                  ? 'bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] border-transparent'
                  : 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-white border-black/15 dark:border-white/20 hover:bg-neutral-100'
              }`}
              title="Tampilkan data dalam format tabel aksesibel"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Chart Area */}
      <div className="bg-white dark:bg-[#1E293B] border-2 border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-5 sm:p-6 shadow-xs">
        
        {/* CHART 1: Ranked Bar Chart */}
        {activeChart === 'rank' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b-2 border-black/[0.08] dark:border-white/[0.12]">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] dark:text-white">
                  Distribusi Skor SDFVI–Proxy Terurut (Descending)
                </h3>
                <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] font-medium">
                  {isGunungkidul
                    ? 'Wonosari (0.7248) hingga Nglipar (0.3732) — Rentang terstandarisasi [0, 1]'
                    : 'Hiliran Gumanti (0.6715) hingga Danau Kembar (0.1834) — 14 Kecamatan Lengkap'}
                </p>
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#15803D] dark:text-[#4ADE80] bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-500/30">
                Formula: (Komponen 1 + Komponen 2 + Komponen 3) / 3
              </span>
            </div>

            {/* Responsive SVG Bar Chart */}
            <div className="pt-2">
              <svg viewBox="0 0 800 480" className="w-full h-auto">
                {/* Grid Lines */}
                {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((val) => {
                  const y = 410 - val * 360;
                  return (
                    <g key={val}>
                      <line x1="140" y1={y} x2="780" y2={y} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4,4" className="dark:stroke-neutral-700" />
                      <text x="130" y={y + 4} textAnchor="end" fontSize="12" fontWeight="bold" fill="#334155" className="dark:fill-[#CBD5E1]" fontFamily="monospace">
                        {val.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {/* Bars */}
                {activeSortedList.map((item, idx) => {
                  const total = activeSortedList.length;
                  const barWidth = Math.min(28, (620 / total) - 8);
                  const x = 150 + idx * (620 / total);
                  const score = Number(item.SDFVI_proxy ?? 0);
                  const barHeight = score * 360;
                  const y = 410 - barHeight;
                  const color = getCategoryHexColor(item.priority_category, colorTheme);
                  const isItemGK = 'kapanewon' in item;
                  const name = isItemGK ? (item as KapanewonData).kapanewon : (item as SolokKecamatanData).NAMOBJ;

                  return (
                    <g 
                      key={name}
                      className="cursor-pointer group"
                      onClick={() => onSelectKapanewon(item)}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        fill={color}
                        rx="5"
                        stroke="#0F172A"
                        strokeWidth="1"
                        className="transition-all hover:opacity-85"
                      />
                      
                      {/* Score label on top of bar */}
                      <text
                        x={x + barWidth / 2}
                        y={y - 8}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="800"
                        fill="#0F172A"
                        className="dark:fill-white font-mono"
                      >
                        {score.toFixed(3)}
                      </text>

                      {/* X-Axis Name (Rotated) */}
                      <text
                        x={x + barWidth / 2}
                        y="428"
                        textAnchor="start"
                        transform={`rotate(45, ${x + barWidth / 2}, 428)`}
                        fontSize="11"
                        fontWeight="700"
                        fill="#0F172A"
                        className="dark:fill-[#F1F5F9]"
                      >
                        {name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}

        {/* CHART 2: Stacked Components Chart */}
        {activeChart === 'components' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b-2 border-black/[0.08] dark:border-white/[0.12]">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] dark:text-white">
                  Dekomposisi Kontribusi 3 Komponen Penyusun Skor
                </h3>
                <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] font-medium">
                  {isGunungkidul
                    ? 'Sensitivitas Sosial (Ungu), Bahaya Meteorologis (Biru), dan Defisit Lahan Pangan (Oranye)'
                    : 'Sensitivitas Gender S_i (Ungu), Defisit CHIRPS H_i (Oranye-Merah), dan Sawah E_i (Hijau)'}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">
                <span className="flex items-center gap-1.5" title="Sensitivitas Sosial: Anak Dengan Kedisabilitasan (ADK) & Lansia Terlantar"><span className="w-3.5 h-3.5 rounded bg-purple-600 border border-black/20" /> {isGunungkidul ? 'L1 (ADK & Lansia)' : 'S_i (Gender)'}</span>
                <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-blue-600 border border-black/20" /> {isGunungkidul ? 'H (CHIRPS)' : 'H_i (CHIRPS)'}</span>
                <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-amber-500 border border-black/20" /> {isGunungkidul ? 'F_area' : 'E_i (Sawah)'}</span>
              </div>
            </div>

            {/* Stacked Bar Rows */}
            <div className="space-y-3 pt-2">
              {activeSortedList.map((item) => {
                const isItemGK = 'kapanewon' in item;
                const name = isItemGK ? (item as KapanewonData).kapanewon : (item as SolokKecamatanData).NAMOBJ;
                const c1 = Number((isItemGK ? (item as KapanewonData).L1_social_sensitivity : (item as SolokKecamatanData).S_i) ?? 0);
                const c2 = Number((isItemGK ? (item as KapanewonData).H_meteorological_hazard : (item as SolokKecamatanData).H_i) ?? 0);
                const c3 = Number((isItemGK ? (item as KapanewonData).F_area_land_deficit_proxy : (item as SolokKecamatanData).E_i) ?? 0);
                const sum = (c1 + c2 + c3) / 3;

                return (
                  <div 
                    key={name} 
                    className="flex items-center gap-3.5 text-xs sm:text-sm cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/30 p-2 rounded-xl transition-colors"
                    onClick={() => onSelectKapanewon(item)}
                  >
                    <div className="w-32 sm:w-40 font-bold text-[#0F172A] dark:text-white truncate shrink-0 flex items-center justify-between">
                      <span>{name}</span>
                      <span className="font-mono text-[#475569] dark:text-[#94A3B8] text-xs font-black">#{item.rank ?? '-'}</span>
                    </div>

                    <div className="flex-1 h-6 bg-[#E2E8F0] dark:bg-neutral-700 rounded-lg overflow-hidden flex shadow-inner border border-black/10 dark:border-white/10">
                      <div 
                        style={{ width: `${(c1 / 3) * 100}%` }} 
                        className="bg-purple-600 h-full" 
                        title={`${isGunungkidul ? 'L1' : 'S_i'}: ${c1.toFixed(4)}`} 
                      />
                      <div 
                        style={{ width: `${(c2 / 3) * 100}%` }} 
                        className="bg-blue-600 h-full" 
                        title={`${isGunungkidul ? 'H' : 'H_i'}: ${c2.toFixed(4)}`} 
                      />
                      <div 
                        style={{ width: `${(c3 / 3) * 100}%` }} 
                        className="bg-amber-500 h-full" 
                        title={`${isGunungkidul ? 'F_area' : 'E_i'}: ${c3.toFixed(4)}`} 
                      />
                    </div>

                    <div className="w-16 text-right font-mono font-black text-[#0F172A] dark:text-white shrink-0 text-sm">
                      {sum.toFixed(4)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CHART 3: Scatter Plot (Sensitivity vs Hazard) */}
        {activeChart === 'scatter' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b-2 border-black/[0.08] dark:border-white/[0.12]">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] dark:text-white">
                  Diagram Sebar: Sensitivitas Sosial vs Bahaya Meteorologis
                </h3>
                <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] font-medium">
                  {isGunungkidul
                    ? 'Sumbu X = Bahaya CHIRPS (H), Sumbu Y = Sensitivitas Sosial ADK [Anak Dengan Kedisabilitasan] & Lansia (L1), Ukuran Gelembung = Defisit Lahan (F_area)'
                    : 'Sumbu X = Defisit Presipitasi CHIRPS (H_i), Sumbu Y = Sensitivitas Gender (S_i), Ukuran = Luas Sawah (E_i)'}
                </p>
              </div>
            </div>

            <div className="relative pt-2">
              <svg viewBox="0 0 700 450" className="w-full h-auto">
                {/* Background quadrants */}
                <rect x="70" y="30" width="300" height="180" fill="#fef2f2" fillOpacity="0.4" className="dark:fill-rose-950/20" />
                <rect x="370" y="30" width="300" height="180" fill="#fff7ed" fillOpacity="0.5" className="dark:fill-amber-950/20" />
                <rect x="70" y="210" width="300" height="180" fill="#f0fdf4" fillOpacity="0.4" className="dark:fill-emerald-950/20" />
                <rect x="370" y="210" width="300" height="180" fill="#fefce8" fillOpacity="0.4" className="dark:fill-yellow-950/20" />

                {/* Axes */}
                <line x1="70" y1="390" x2="670" y2="390" stroke="#475569" strokeWidth="2" />
                <line x1="70" y1="30" x2="70" y2="390" stroke="#475569" strokeWidth="2" />

                {/* Median divider lines */}
                <line x1="370" y1="30" x2="370" y2="390" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" />
                <line x1="70" y1="210" x2="670" y2="210" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" />

                {/* Axis Labels */}
                <text x="370" y="425" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0F172A" className="dark:fill-white">
                  {isGunungkidul ? 'Bahaya Meteorologis CHIRPS (H) →' : 'Defisit Presipitasi CHIRPS (H_i) →'}
                </text>
                <text x="30" y="210" textAnchor="middle" transform="rotate(-90, 30, 210)" fontSize="12" fontWeight="800" fill="#0F172A" className="dark:fill-white">
                  {isGunungkidul ? 'Sensitivitas Sosial (L1) →' : 'Sensitivitas Gender (S_i) →'}
                </text>

                {/* Points */}
                {activeSortedList.map((item) => {
                  const hVal = isGunungkidul ? (item as KapanewonData).H_meteorological_hazard : (item as SolokKecamatanData).H_i;
                  const sVal = isGunungkidul ? (item as KapanewonData).L1_social_sensitivity : (item as SolokKecamatanData).S_i;
                  const eVal = isGunungkidul ? (item as KapanewonData).F_area_land_deficit_proxy : (item as SolokKecamatanData).E_i;
                  const name = isGunungkidul ? (item as KapanewonData).kapanewon : (item as SolokKecamatanData).NAMOBJ;

                  const cx = 70 + hVal * 600;
                  const cy = 390 - sVal * 360;
                  const r = 7 + eVal * 14;
                  const color = getCategoryHexColor(item.priority_category, colorTheme);

                  return (
                    <g 
                      key={name}
                      className="cursor-pointer group"
                      onClick={() => onSelectKapanewon(item)}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <circle
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill={color}
                        fillOpacity="0.9"
                        stroke="#0F172A"
                        strokeWidth="2"
                        className="transition-transform group-hover:scale-125 drop-shadow-md"
                      />
                      <text
                        x={cx}
                        y={cy - r - 6}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="800"
                        fill="#0F172A"
                        stroke="#FFFFFF"
                        strokeWidth="3"
                        paintOrder="stroke fill"
                        className="dark:stroke-[#0F172A] select-none pointer-events-none"
                      >
                        {name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}

        {/* CHART 4: Priority Quadrants */}
        {activeChart === 'quadrant' && (
          <div className="space-y-4">
            <div className="pb-3.5 border-b-2 border-black/[0.08] dark:border-white/[0.12]">
              <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] dark:text-white">
                Partisi Kuadran Prioritas Penyelidikan Lapangan
              </h3>
              <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] font-medium">
                Pengelompokan unit wilayah berdasarkan kategori urgensi verifikasi dan intervensi program perlindungan iklim.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {['Tinggi', 'Sedang', 'Rendah', 'Terendah'].map((cat) => {
                const itemsInCat = activeSortedList.filter(d => d.priority_category === cat);
                if (cat === 'Terendah' && itemsInCat.length === 0 && isGunungkidul) return null;

                return (
                  <div key={cat} className="p-4 rounded-2xl border-2 border-black/[0.08] dark:border-white/[0.12] bg-[#F8FAFC] dark:bg-[#0F172A]/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#0F172A] dark:text-white">
                        Kategori {cat}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A]">
                        {itemsInCat.length} Unit
                      </span>
                    </div>

                    <div className="space-y-2">
                      {itemsInCat.map(item => {
                        const isItemGK = 'kapanewon' in item;
                        const name = isItemGK ? (item as KapanewonData).kapanewon : (item as SolokKecamatanData).NAMOBJ;
                        return (
                          <div
                            key={name}
                            onClick={() => onSelectKapanewon(item)}
                            className="p-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-black/10 dark:border-white/10 text-xs sm:text-sm flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-colors shadow-2xs font-semibold"
                          >
                            <span className="text-[#0F172A] dark:text-white">{name}</span>
                            <span className="font-mono font-black text-[#0F172A] dark:text-white">
                              {item.SDFVI_proxy?.toFixed(4) ?? '-'}
                            </span>
                          </div>
                        );
                      })}
                      {itemsInCat.length === 0 && (
                        <div className="text-xs text-[#64748B] dark:text-[#94A3B8] italic py-2">
                          Tidak ada unit dalam kategori ini
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Accessible Data Table Alternative */}
      {showTableAlternative && (
        <div className="bg-white dark:bg-[#1E293B] border-2 border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-5 sm:p-6 shadow-xs">
          <h4 className="font-extrabold text-base text-[#0F172A] dark:text-white mb-3">
            Tabel Data Grafik Lengkap (Alternatif Aksesibilitas Pembaca Layar)
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-black/[0.08] dark:border-white/[0.12] bg-[#F1F5F9] dark:bg-[#0F172A] font-extrabold text-[#0F172A] dark:text-white">
                  <th className="py-2.5 px-3 text-center">Rank</th>
                  <th className="py-2.5 px-3">{isGunungkidul ? 'Kapanewon' : 'Kecamatan'}</th>
                  <th className="py-2.5 px-3 text-right">Skor SDFVI</th>
                  <th className="py-2.5 px-3 text-center">Kategori</th>
                  {isGunungkidul ? (
                    <>
                      <th className="py-2.5 px-3 text-right">L1 (Sensitivitas)</th>
                      <th className="py-2.5 px-3 text-right">H (Bahaya CHIRPS)</th>
                      <th className="py-2.5 px-3 text-right">F_area (Defisit Luas)</th>
                    </>
                  ) : (
                    <>
                      <th className="py-2.5 px-3 text-right">S_i (Gender 60+)</th>
                      <th className="py-2.5 px-3 text-right">H_i (CHIRPS 2023)</th>
                      <th className="py-2.5 px-3 text-right">E_i (Sawah Total ha)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.08]">
                {activeSortedList.map(item => {
                  const isItemGK = 'kapanewon' in item;
                  const name = isItemGK ? (item as KapanewonData).kapanewon : (item as SolokKecamatanData).NAMOBJ;
                  const c1 = Number((isItemGK ? (item as KapanewonData).L1_social_sensitivity : (item as SolokKecamatanData).S_i) ?? 0);
                  const c2 = Number((isItemGK ? (item as KapanewonData).H_meteorological_hazard : (item as SolokKecamatanData).H_i) ?? 0);
                  const c3 = Number((isItemGK ? (item as KapanewonData).F_area_land_deficit_proxy : (item as SolokKecamatanData).E_i) ?? 0);

                  return (
                    <tr key={name} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/30">
                      <td className="py-2.5 px-3 text-center font-black text-[#0F172A] dark:text-white">#{item.rank ?? '-'}</td>
                      <td className="py-2.5 px-3 font-bold text-[#0F172A] dark:text-white">{name}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-black text-[#0F172A] dark:text-white">{item.SDFVI_proxy?.toFixed(4) ?? '-'}</td>
                      <td className="py-2.5 px-3 text-center font-bold">{item.priority_category ?? '-'}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#334155] dark:text-[#CBD5E1] font-semibold">{c1.toFixed(4)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#334155] dark:text-[#CBD5E1] font-semibold">{c2.toFixed(4)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#334155] dark:text-[#CBD5E1] font-semibold">{c3.toFixed(4)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
