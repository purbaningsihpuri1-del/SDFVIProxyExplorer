import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Award, 
  MapPin, 
  Search, 
  Filter, 
  ChevronRight, 
  Info, 
  Layers, 
  ArrowUpDown,
  Compass,
  Users,
  CloudRain,
  Wheat,
  Droplets,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { KapanewonData, SolokKecamatanData, PriorityCategory, ColorTheme, PilotRegion } from '../types';
import { PUBLISHED_SOLOK_DATA } from '../data/solokBaselineData';
import { getCategoryBadgeClasses, getCategoryHexColor } from '../utils/calculations';

interface OverviewSectionProps {
  data: KapanewonData[];
  colorTheme: ColorTheme;
  currentPilot: PilotRegion;
  onSwitchPilot: (pilot: PilotRegion) => void;
  onSelectKapanewon: (item: any) => void;
  onNavigateTab: (tab: any) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  data,
  colorTheme,
  currentPilot,
  onSwitchPilot,
  onSelectKapanewon,
  onNavigateTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'rank' | 'name' | 'sdfvi'>('rank');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Solok Data Source
  const solokList = PUBLISHED_SOLOK_DATA;

  // Gunungkidul aggregations
  const gkSorted = useMemo(() => [...data].sort((a, b) => b.SDFVI_proxy - a.SDFVI_proxy), [data]);
  const gkHighest = gkSorted[0];
  const gkLowest = gkSorted[gkSorted.length - 1];
  const gkCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'Sangat Tinggi': 0, 'Tinggi': 0, 'Sedang': 0, 'Rendah': 0, 'Terendah': 0 };
    data.forEach(d => { if (counts[d.priority_category] !== undefined) counts[d.priority_category]++; });
    return counts;
  }, [data]);

  // Solok aggregations
  const solokSorted = useMemo(() => [...solokList].sort((a, b) => b.SDFVI_proxy - a.SDFVI_proxy), [solokList]);
  const solokHighest = solokSorted[0];
  const solokLowest = solokSorted[solokSorted.length - 1];
  const solokCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'Sangat Tinggi': 0, 'Tinggi': 0, 'Sedang': 0, 'Rendah': 0, 'Terendah': 0 };
    solokList.forEach(d => { if (counts[d.priority_category] !== undefined) counts[d.priority_category]++; });
    return counts;
  }, [solokList]);

  // Active dataset metrics based on current pilot
  const isGunungkidul = currentPilot === 'gunungkidul';
  const totalUnits = isGunungkidul ? data.length : solokList.length;
  const highestScore = isGunungkidul ? gkHighest?.SDFVI_proxy : solokHighest?.SDFVI_proxy;
  const highestName = isGunungkidul ? gkHighest?.kapanewon : solokHighest?.NAMOBJ;
  const lowestScore = isGunungkidul ? gkLowest?.SDFVI_proxy : solokLowest?.SDFVI_proxy;
  const lowestName = isGunungkidul ? gkLowest?.kapanewon : solokLowest?.NAMOBJ;
  const activeCategoryCounts = isGunungkidul ? gkCategoryCounts : solokCategoryCounts;

  // Filtered and sorted data for current pilot
  const filteredGunungkidul = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.kapanewon.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.priority_category === categoryFilter;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortField === 'rank') return sortAsc ? a.rank - b.rank : b.rank - a.rank;
      if (sortField === 'name') return sortAsc ? a.kapanewon.localeCompare(b.kapanewon) : b.kapanewon.localeCompare(a.kapanewon);
      if (sortField === 'sdfvi') return sortAsc ? a.SDFVI_proxy - b.SDFVI_proxy : b.SDFVI_proxy - a.SDFVI_proxy;
      return 0;
    });
  }, [data, searchTerm, categoryFilter, sortField, sortAsc]);

  const filteredSolok = useMemo(() => {
    return solokList.filter(item => {
      const matchesSearch = item.NAMOBJ.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.priority_category === categoryFilter;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortField === 'rank') return sortAsc ? a.rank - b.rank : b.rank - a.rank;
      if (sortField === 'name') return sortAsc ? a.NAMOBJ.localeCompare(b.NAMOBJ) : b.NAMOBJ.localeCompare(a.NAMOBJ);
      if (sortField === 'sdfvi') return sortAsc ? a.SDFVI_proxy - b.SDFVI_proxy : b.SDFVI_proxy - a.SDFVI_proxy;
      return 0;
    });
  }, [solokList, searchTerm, categoryFilter, sortField, sortAsc]);

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Pilot Switcher Card in Overview (Apple HIG Card) */}
      <section 
        id="overview-pilot-selection-banner"
        className="apple-card p-5 sm:p-6 border-2 border-black/[0.08] dark:border-white/[0.12]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#0055D4]/15 text-[#00409A] dark:text-[#60A5FA] border border-[#0055D4]/25">
                PILIH WILAYAH PILOT
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
                Dua Pilot Eksplorasi Kerentanan Iklim Inklusif
              </h2>
            </div>
            <p className="text-sm text-[#334155] dark:text-[#CBD5E1] mt-1 font-medium">
              Pilih wilayah untuk memuat dataset sub-distrik, formula proksi komposit, dan citra satelit georeferensi.
            </p>
          </div>

          <div className="inline-flex items-center bg-[#E2E8F0] dark:bg-[#27272A] p-1.5 rounded-full border border-black/10 dark:border-white/10 shrink-0">
            <button
              id="btn-switch-gunungkidul"
              onClick={() => { onSwitchPilot('gunungkidul'); setSearchTerm(''); setCategoryFilter('all'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all apple-tap ${
                isGunungkidul
                  ? 'bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] shadow-xs'
                  : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-white'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isGunungkidul ? 'bg-[#15803D]' : 'bg-[#64748B]'}`} />
              <span>Gunungkidul (18)</span>
            </button>

            <button
              id="btn-switch-solok"
              onClick={() => { onSwitchPilot('solok'); setSearchTerm(''); setCategoryFilter('all'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all apple-tap ${
                !isGunungkidul
                  ? 'bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] shadow-xs'
                  : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-white'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${!isGunungkidul ? 'bg-[#0055D4]' : 'bg-[#64748B]'}`} />
              <span>Solok (14)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Relative Screening Principle Banner (Apple Callout Note with WCAG Contrast) */}
      <section 
        id="relative-screening-banner"
        aria-labelledby="banner-title"
        className="rounded-2xl border-2 border-[#C2410C]/30 bg-[#FFF7ED] dark:bg-[#431407]/40 p-5 text-[#431407] dark:text-[#FFEDD5] shadow-xs"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#C2410C] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 id="banner-title" className="text-sm sm:text-base font-extrabold text-[#7C2D12] dark:text-[#FED7AA]">
              Prinsip Metodologis: Skrining Relatif untuk Verifikasi Lapangan Partisipatif
            </h3>
            <p className="text-sm text-[#431407] dark:text-[#FFEDD5] leading-relaxed font-normal">
              {isGunungkidul ? (
                <>
                  Skor SDFVI–Proxy dihitung untuk <strong>18 kapanewon sebagai sensus spasial penuh</strong> di Kabupaten Gunungkidul. 
                  Hasil ini berfungsi sebagai <strong>indikator skrining relatif</strong> untuk menetapkan prioritas penyelidikan dan alokasi dukungan inklusi disabilitas (ADK [Anak Dengan Kedisabilitasan] & lansia terlantar), 
                  <strong> bukan vonis otomatis tanpa konfirmasi pamong kalurahan dan organisasi disabilitas</strong>.
                </>
              ) : (
                <>
                  Skor SDFVI–Proxy dihitung untuk <strong>14 kecamatan sebagai sensus spasial penuh</strong> di Kabupaten Solok. 
                  Hasil ini memotret interaksi antara <strong>sensitivitas gender ($S_i$: perempuan 60+ tanpa ijazah formal)</strong>, 
                  <strong> bahaya meteorologis ($H_i$: defisit CHIRPS kemarau 2023)</strong>, dan <strong>eksposur sentra sawah ($E_i$: ha per kapita)</strong>.
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Summary KPI Cards Grid (Apple HIG Bento Metric Cards with High Contrast) */}
      <section 
        id="overview-kpi-grid"
        aria-label="Statistik Kunci SDFVI-Proxy"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4"
      >
        {/* Card 1: Total Units */}
        <div className="apple-card p-4 sm:p-5 border-2 border-black/[0.08] dark:border-white/[0.12]">
          <div className="flex items-center justify-between text-[#334155] dark:text-[#CBD5E1] text-xs sm:text-sm font-bold">
            <span>Populasi Unit Spasial</span>
            <div className="w-8 h-8 rounded-xl bg-[#0055D4]/15 text-[#0055D4] dark:text-[#60A5FA] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
              {totalUnits}
            </span>
            <span className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] font-bold">
              {isGunungkidul ? 'Kapanewon' : 'Kecamatan'}
            </span>
          </div>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1.5 font-medium truncate">
            {isGunungkidul ? 'Sensus 100% 18 Kapanewon' : 'Sensus 100% 14 Kecamatan'}
          </p>
        </div>

        {/* Card 2: Highest Proxy */}
        <div 
          onClick={() => {
            const topItem = isGunungkidul ? gkHighest : solokHighest;
            if (topItem) onSelectKapanewon(topItem);
          }}
          className="apple-card p-4 sm:p-5 border-2 border-black/[0.08] dark:border-white/[0.12] hover:border-[#C2410C] cursor-pointer transition-all apple-tap"
        >
          <div className="flex items-center justify-between text-[#334155] dark:text-[#CBD5E1] text-xs sm:text-sm font-bold">
            <span>Skor Tertinggi</span>
            <div className="w-8 h-8 rounded-xl bg-[#C2410C]/15 text-[#C2410C] dark:text-[#FB923C] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
              {highestScore !== undefined ? highestScore.toFixed(4) : '-'}
            </span>
            <span className="text-sm font-extrabold text-[#C2410C] dark:text-[#FB923C] truncate max-w-[100px] sm:max-w-none">
              {highestName}
            </span>
          </div>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1.5 flex items-center justify-between font-medium">
            <span>Peringkat #1</span>
            <span className="text-[#0055D4] dark:text-[#60A5FA] font-bold">Profil →</span>
          </p>
        </div>

        {/* Card 3: Lowest Proxy */}
        <div 
          onClick={() => {
            const bottomItem = isGunungkidul ? gkLowest : solokLowest;
            if (bottomItem) onSelectKapanewon(bottomItem);
          }}
          className="apple-card p-4 sm:p-5 border-2 border-black/[0.08] dark:border-white/[0.12] hover:border-[#15803D] cursor-pointer transition-all apple-tap"
        >
          <div className="flex items-center justify-between text-[#334155] dark:text-[#CBD5E1] text-xs sm:text-sm font-bold">
            <span>Skor Terendah</span>
            <div className="w-8 h-8 rounded-xl bg-[#15803D]/15 text-[#15803D] dark:text-[#4ADE80] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
              {lowestScore !== undefined ? lowestScore.toFixed(4) : '-'}
            </span>
            <span className="text-sm font-extrabold text-[#15803D] dark:text-[#4ADE80] truncate max-w-[100px] sm:max-w-none">
              {lowestName}
            </span>
          </div>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1.5 flex items-center justify-between font-medium">
            <span>Peringkat #{totalUnits}</span>
            <span className="text-[#0055D4] dark:text-[#60A5FA] font-bold">Profil →</span>
          </p>
        </div>

        {/* Card 4: Category Distribution Summary */}
        <div className="apple-card p-4 sm:p-5 border-2 border-black/[0.08] dark:border-white/[0.12] col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#334155] dark:text-[#CBD5E1] text-xs sm:text-sm font-bold">
            <span>Distribusi Prioritas</span>
            <div className="w-8 h-8 rounded-xl bg-[#4338CA]/15 text-[#4338CA] dark:text-[#818CF8] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 grid grid-cols-4 gap-1.5 text-center">
            <div className="p-1.5 rounded-xl bg-[#C2410C]/15 border border-[#C2410C]/30">
              <div className="text-xs font-extrabold text-[#9A3412] dark:text-[#FDBA74]">Tinggi</div>
              <div className="text-base font-black text-[#9A3412] dark:text-[#FED7AA]">{activeCategoryCounts['Tinggi']}</div>
            </div>
            <div className="p-1.5 rounded-xl bg-[#CA8A04]/20 border border-[#CA8A04]/30">
              <div className="text-xs font-extrabold text-[#713F12] dark:text-[#FDE047]">Sedang</div>
              <div className="text-base font-black text-[#713F12] dark:text-[#FEF08A]">{activeCategoryCounts['Sedang']}</div>
            </div>
            <div className="p-1.5 rounded-xl bg-[#15803D]/15 border border-[#15803D]/30">
              <div className="text-xs font-extrabold text-[#14532D] dark:text-[#86EFAC]">Rendah</div>
              <div className="text-base font-black text-[#14532D] dark:text-[#BBF7D0]">{activeCategoryCounts['Rendah']}</div>
            </div>
            <div className="p-1.5 rounded-xl bg-[#0055D4]/15 border border-[#0055D4]/30">
              <div className="text-xs font-extrabold text-[#00409A] dark:text-[#93C5FD]">{isGunungkidul ? 'S.Tinggi' : 'Terendah'}</div>
              <div className="text-base font-black text-[#00409A] dark:text-[#BFDBFE]">
                {isGunungkidul ? activeCategoryCounts['Sangat Tinggi'] : activeCategoryCounts['Terendah']}
              </div>
            </div>
          </div>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-2 text-center font-medium truncate">
            {isGunungkidul ? '10 Kapanewon Prioritas Tinggi' : '3 Kecamatan Prioritas Tinggi'}
          </p>
        </div>
      </section>

      {/* Thematic Map & Biochar Teaser Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Thematic Map Teaser */}
        <section 
          id="overview-spatial-map-teaser"
          className="apple-card p-5 sm:p-6 bg-gradient-to-br from-[#0B0F19] to-[#1E293B] text-white border-2 border-slate-700 shadow-md flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#15803D] text-white border border-[#4ADE80]">
              <MapPin className="w-4 h-4 text-white" />
              <span>Peta Spasial Georeferensi Resmi</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
              {isGunungkidul 
                ? 'Peta Tematik Spasial SDFVI–Proxy Gunungkidul' 
                : 'Peta Spasial Tematik SDFVI–Proxy Solok (14 Kecamatan)'}
            </h3>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
              {isGunungkidul
                ? 'Eksplorasi batas poligon 18 kapanewon karst Gunungsewu dengan citra satelit, overlay kategori prioritas, dan pin hotspot interaktif.'
                : 'Eksplorasi 14 kecamatan di lereng Gunung Talang dan lembah danau kembar dengan data satelit CHIRPS kemarau 2023 dan sentra beras Solok.'}
            </p>
          </div>

          <div className="pt-5 flex items-center justify-between">
            <button
              id="btn-goto-spatial-map"
              onClick={() => onNavigateTab('map')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-extrabold bg-white text-[#0F172A] hover:bg-slate-100 transition-all apple-tap shadow-sm"
            >
              <span>Buka Peta Tematik</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-xs sm:text-sm text-slate-300 font-bold">
              {isGunungkidul ? '18 Kapanewon' : '14 Kecamatan'}
            </span>
          </div>
        </section>

        {/* Biochar Sensitivity / Context Teaser */}
        {isGunungkidul ? (
          <section 
            id="overview-biochar-teaser"
            className="apple-card p-5 sm:p-6 bg-gradient-to-br from-[#2D134F] to-[#170929] text-white border-2 border-purple-800 shadow-md flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#7E22CE] text-white border border-[#C084FC]">
                <Droplets className="w-4 h-4 text-white" />
                <span>Simulasi Solusi Berbasis Alam</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
                Sensitivitas Retensi Air Biochar (Benchmark 2019)
              </h3>
              <p className="text-sm sm:text-base text-purple-100 leading-relaxed font-medium">
                Simulasi kenaikan Water Holding Capacity (WHC) tanah karst melalui aplikasi biochar pirolisis limbah pertanian di 4 Hotspot Kritis: Ponjong, Panggang, Paliyan, Saptosari.
              </p>
            </div>

            <div className="pt-5 flex items-center justify-between">
              <button
                id="btn-goto-biochar"
                onClick={() => onNavigateTab('biochar')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-extrabold bg-white text-[#0F172A] hover:bg-slate-100 transition-all apple-tap shadow-sm"
              >
                <span>Buka Panel Biochar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-xs sm:text-sm text-purple-300 font-mono font-bold">
                +5% s/d +25% WHC
              </span>
            </div>
          </section>
        ) : (
          <section 
            id="overview-solok-context-teaser"
            className="apple-card p-5 sm:p-6 bg-gradient-to-br from-[#0B2545] to-[#041221] text-white border-2 border-blue-800 shadow-md flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#0055D4] text-white border border-[#60A5FA]">
                <Wheat className="w-4 h-4 text-white" />
                <span>Karakteristik Agraris & Gender</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
                Pertanian Padi Anak Daro & Sensitivitas Gender
              </h3>
              <p className="text-sm sm:text-base text-blue-100 leading-relaxed font-medium">
                Kombinasi data sawah irigasi/tadah hujan dengan kerentanan demografis perempuan lansia tanpa pendidikan formal yang menopang ketahanan pangan keluarga di Solok.
              </p>
            </div>

            <div className="pt-5 flex items-center justify-between">
              <button
                id="btn-goto-solok-context"
                onClick={() => onNavigateTab('context')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-extrabold bg-white text-[#0F172A] hover:bg-slate-100 transition-all apple-tap shadow-sm"
              >
                <span>Lihat Karakteristik</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-xs sm:text-sm text-blue-300 font-bold">
                Beras Solok (IG)
              </span>
            </div>
          </section>
        )}
      </div>

      {/* Interactive Ranked Table with Search & Filter */}
      <section 
        id="overview-ranked-table-section"
        aria-labelledby="ranked-table-heading"
        className="apple-card p-5 sm:p-7 border-2 border-black/[0.08] dark:border-white/[0.12]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b-2 border-black/[0.06] dark:border-white/[0.08]">
          <div>
            <h3 id="ranked-table-heading" className="text-lg sm:text-xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
              {isGunungkidul 
                ? 'Tabel Pemeringkatan 18 Kapanewon Gunungkidul' 
                : 'Tabel Pemeringkatan 14 Kecamatan Kabupaten Solok'}
            </h3>
            <p className="text-sm text-[#334155] dark:text-[#CBD5E1] mt-1 font-medium">
              {isGunungkidul
                ? 'Ketuk nama kapanewon untuk membuka rincian profil 3 komponen dan panduan pertanyaan lapangan'
                : 'Ketuk nama kecamatan untuk rincian indikator perempuan lansia, defisit CHIRPS 2023, dan sentra padi sawah'}
            </p>
          </div>

          {/* Controls: Search and Filter (Apple Pill Form Controls with Accessible Sizes) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#475569] dark:text-[#94A3B8]" />
              <input
                id="search-unit-input"
                type="text"
                placeholder={isGunungkidul ? "Cari kapanewon..." : "Cari kecamatan..."}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm font-semibold rounded-full border-2 border-black/15 dark:border-white/20 bg-[#E2E8F0]/60 dark:bg-[#27272A] text-[#0F172A] dark:text-white placeholder-[#64748B] dark:placeholder-[#94A3B8] focus:outline-hidden focus:ring-2 focus:ring-[#0055D4]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-sm">
              <select
                id="filter-category"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="py-2 px-4 text-sm font-bold rounded-full border-2 border-black/15 dark:border-white/20 bg-[#E2E8F0]/60 dark:bg-[#27272A] text-[#0F172A] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0055D4]"
              >
                <option value="all">Semua Kategori ({totalUnits})</option>
                <option value="Tinggi">Tinggi ({activeCategoryCounts['Tinggi']})</option>
                <option value="Sedang">Sedang ({activeCategoryCounts['Sedang']})</option>
                <option value="Rendah">Rendah ({activeCategoryCounts['Rendah']})</option>
                {!isGunungkidul && (
                  <option value="Terendah">Terendah ({activeCategoryCounts['Terendah']})</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* MOBILE-SPECIFIC APPLE HIG GROUPED CELL LIST (shown on phone, hidden on tablet/desktop) */}
        <div className="sm:hidden divide-y-2 divide-black/[0.06] dark:divide-white/[0.08] mt-3">
          {isGunungkidul ? (
            filteredGunungkidul.map((item) => {
              const badgeStyle = getCategoryBadgeClasses(item.priority_category, colorTheme);
              return (
                <div
                  key={item.kapanewon}
                  onClick={() => onSelectKapanewon(item)}
                  className="py-3.5 px-2 flex items-center justify-between active:bg-black/[0.05] dark:active:bg-white/[0.08] rounded-2xl transition-all cursor-pointer apple-tap"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-full bg-[#E2E8F0] dark:bg-[#27272A] text-[#0F172A] dark:text-white flex items-center justify-center font-extrabold text-sm border border-black/10 dark:border-white/10 shrink-0">
                      #{item.rank}
                    </span>
                    <div>
                      <div className="font-bold text-base text-[#0F172A] dark:text-white">
                        {item.kapanewon}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeStyle}`}>
                          {item.priority_category}
                        </span>
                        <span className="text-xs text-[#475569] dark:text-[#CBD5E1] font-semibold">
                          L1: {item.L1_social_sensitivity?.toFixed(2) ?? '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <div className="font-mono font-black text-base text-[#0F172A] dark:text-white">
                        {item.SDFVI_proxy?.toFixed(4) ?? '-'}
                      </div>
                      <div className="text-xs text-[#475569] dark:text-[#94A3B8] font-bold">Skor Proxy</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
                  </div>
                </div>
              );
            })
          ) : (
            filteredSolok.map((item) => {
              const badgeStyle = getCategoryBadgeClasses(item.priority_category, colorTheme);
              return (
                <div
                  key={item.NAMOBJ}
                  onClick={() => onSelectKapanewon(item)}
                  className="py-3.5 px-2 flex items-center justify-between active:bg-black/[0.05] dark:active:bg-white/[0.08] rounded-2xl transition-all cursor-pointer apple-tap"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-full bg-[#E2E8F0] dark:bg-[#27272A] text-[#0F172A] dark:text-white flex items-center justify-center font-extrabold text-sm border border-black/10 dark:border-white/10 shrink-0">
                      #{item.rank}
                    </span>
                    <div>
                      <div className="font-bold text-base text-[#0F172A] dark:text-white">
                        {item.NAMOBJ}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeStyle}`}>
                          {item.priority_category}
                        </span>
                        <span className="text-xs text-[#475569] dark:text-[#CBD5E1] font-semibold truncate max-w-[130px]">
                          {item.dominant_rice_variety}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <div className="font-mono font-black text-base text-[#0F172A] dark:text-white">
                        {item.SDFVI_proxy?.toFixed(4) ?? '-'}
                      </div>
                      <div className="text-xs text-[#475569] dark:text-[#94A3B8] font-bold">Skor Proxy</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* TABLE REPRESENTATION FOR TABLETS & DESKTOPS (sm:block) */}
        <div className="hidden sm:block overflow-x-auto mt-5">
          <table className="w-full text-left border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b-2 border-black/[0.1] dark:border-white/[0.12] text-[#0F172A] dark:text-white font-extrabold text-sm">
                <th scope="col" className="py-3 px-3.5 w-16 text-center cursor-pointer" onClick={() => { setSortField('rank'); setSortAsc(!sortAsc); }}>
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Rank</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#475569] dark:text-[#94A3B8]" />
                  </div>
                </th>
                <th scope="col" className="py-3 px-3.5 cursor-pointer" onClick={() => { setSortField('name'); setSortAsc(!sortAsc); }}>
                  <div className="flex items-center gap-1.5">
                    <span>{isGunungkidul ? 'Kapanewon' : 'Kecamatan'}</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#475569] dark:text-[#94A3B8]" />
                  </div>
                </th>
                <th scope="col" className="py-3 px-3.5 text-right cursor-pointer" onClick={() => { setSortField('sdfvi'); setSortAsc(!sortAsc); }}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>SDFVI–Proxy</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#475569] dark:text-[#94A3B8]" />
                  </div>
                </th>
                <th scope="col" className="py-3 px-3.5 text-center">Kategori Prioritas</th>
                
                {isGunungkidul ? (
                  <>
                    <th scope="col" className="py-3 px-3.5 text-right hidden md:table-cell" title="Sensitivitas Sosial: Anak Dengan Kedisabilitasan (ADK) & Lansia Terlantar">L1 (ADK & Lansia)</th>
                    <th scope="col" className="py-3 px-3.5 text-right hidden md:table-cell">H (Bahaya CHIRPS)</th>
                    <th scope="col" className="py-3 px-3.5 text-right hidden md:table-cell">F_area (Defisit Pangan)</th>
                  </>
                ) : (
                  <>
                    <th scope="col" className="py-3 px-3.5 text-right hidden md:table-cell">S_i (Gender 60+)</th>
                    <th scope="col" className="py-3 px-3.5 text-right hidden md:table-cell">H_i (CHIRPS 2023)</th>
                    <th scope="col" className="py-3 px-3.5 text-right hidden md:table-cell">E_i (Sawah Total ha)</th>
                  </>
                )}

                <th scope="col" className="py-3 px-3.5 text-center w-28">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.08]">
              {isGunungkidul ? (
                filteredGunungkidul.map((item) => {
                  const badgeStyle = getCategoryBadgeClasses(item.priority_category, colorTheme);
                  return (
                    <tr 
                      key={item.kapanewon}
                      className="hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors"
                    >
                      <td className="py-3.5 px-3.5 text-center font-black text-[#475569] dark:text-[#CBD5E1]">
                        #{item.rank}
                      </td>
                      <td className="py-3.5 px-3.5 font-bold text-[#0F172A] dark:text-white">
                        <button
                          onClick={() => onSelectKapanewon(item)}
                          className="hover:underline text-left text-[#0F172A] dark:text-white focus:outline-hidden rounded px-1 -mx-1"
                        >
                          {item.kapanewon}
                        </button>
                      </td>
                      <td className="py-3.5 px-3.5 text-right font-mono font-extrabold text-[#0F172A] dark:text-white text-base">
                        {item.SDFVI_proxy?.toFixed(4) ?? '-'}
                      </td>
                      <td className="py-3.5 px-3.5 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${badgeStyle}`}>
                          {item.priority_category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5 text-right font-mono text-[#334155] dark:text-[#CBD5E1] font-semibold hidden md:table-cell">
                        {item.L1_social_sensitivity?.toFixed(4) ?? '-'}
                      </td>
                      <td className="py-3.5 px-3.5 text-right font-mono text-[#334155] dark:text-[#CBD5E1] font-semibold hidden md:table-cell">
                        {item.H_meteorological_hazard?.toFixed(4) ?? '-'}
                      </td>
                      <td className="py-3.5 px-3.5 text-right font-mono text-[#334155] dark:text-[#CBD5E1] font-semibold hidden md:table-cell">
                        {item.F_area_land_deficit_proxy?.toFixed(4) ?? '-'}
                      </td>
                      <td className="py-3.5 px-3.5 text-center">
                        <button
                          id={`btn-view-${item.kapanewon.toLowerCase()}`}
                          onClick={() => onSelectKapanewon(item)}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00409A] dark:text-[#93C5FD] hover:underline px-3 py-1.5 rounded-full bg-[#0055D4]/15 hover:bg-[#0055D4]/25 transition-all apple-tap border border-[#0055D4]/25"
                          aria-label={`Buka profil lengkap Kapanewon ${item.kapanewon}`}
                        >
                          <span>Profil</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                filteredSolok.map((item) => {
                  const badgeStyle = getCategoryBadgeClasses(item.priority_category, colorTheme);
                  return (
                    <tr 
                      key={item.NAMOBJ}
                      className="hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors"
                    >
                      <td className="py-3.5 px-3.5 text-center font-black text-[#475569] dark:text-[#CBD5E1]">
                        #{item.rank}
                      </td>
                      <td className="py-3.5 px-3.5 font-bold text-[#0F172A] dark:text-white">
                        <button
                          onClick={() => onSelectKapanewon(item)}
                          className="hover:underline text-left text-[#0F172A] dark:text-white focus:outline-hidden rounded px-1 -mx-1"
                        >
                          {item.NAMOBJ}
                        </button>
                        <div className="text-xs text-[#475569] dark:text-[#CBD5E1] font-semibold">
                          {item.dominant_rice_variety}
                        </div>
                      </td>
                      <td className="py-3.5 px-3.5 text-right font-mono font-extrabold text-[#0F172A] dark:text-white text-base">
                        {item.SDFVI_proxy?.toFixed(4) ?? '-'}
                      </td>
                      <td className="py-3.5 px-3.5 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${badgeStyle}`}>
                          {item.priority_category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5 text-right font-mono text-[#334155] dark:text-[#CBD5E1] font-semibold hidden md:table-cell">
                        <span title={`Skor normalisasi S_i: ${item.S_i?.toFixed(4) ?? '-'}`}>{item.S_i?.toFixed(4) ?? '-'}</span>
                      </td>
                      <td className="py-3.5 px-3.5 text-right font-mono text-[#334155] dark:text-[#CBD5E1] font-semibold hidden md:table-cell">
                        <div>{item.H_i?.toFixed(4) ?? '-'}</div>
                        <div className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">{item.chirps_total_mm !== undefined ? `${item.chirps_total_mm.toFixed(1)} mm` : '-'}</div>
                      </td>
                      <td className="py-3.5 px-3.5 text-right font-mono text-[#334155] dark:text-[#CBD5E1] font-semibold hidden md:table-cell">
                        <div>{item.E_i?.toFixed(4) ?? '-'}</div>
                        <div className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">{item.sawah_total_ha !== undefined ? `${item.sawah_total_ha.toLocaleString('id-ID')} ha` : '-'}</div>
                      </td>
                      <td className="py-3.5 px-3.5 text-center">
                        <button
                          id={`btn-view-${item.NAMOBJ.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => onSelectKapanewon(item)}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00409A] dark:text-[#93C5FD] hover:underline px-3 py-1.5 rounded-full bg-[#0055D4]/15 hover:bg-[#0055D4]/25 transition-all apple-tap border border-[#0055D4]/25"
                          aria-label={`Buka profil lengkap Kecamatan ${item.NAMOBJ}`}
                        >
                          <span>Profil</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}

              {(isGunungkidul ? filteredGunungkidul.length : filteredSolok.length) === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#475569] dark:text-[#CBD5E1] font-bold text-base">
                    Tidak ditemukan unit wilayah dengan kriteria pencarian tersebut.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Quick Navigation */}
        <div className="mt-5 pt-4 border-t-2 border-black/[0.06] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-sm text-[#334155] dark:text-[#CBD5E1] font-semibold">
          <span>Menampilkan {isGunungkidul ? filteredGunungkidul.length : filteredSolok.length} dari {totalUnits} {isGunungkidul ? 'kapanewon' : 'kecamatan'}</span>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigateTab('map')} 
              className="text-[#0055D4] dark:text-[#60A5FA] hover:underline font-bold"
            >
              Lihat di Peta Spasial →
            </button>
            <button 
              onClick={() => onNavigateTab('charts')} 
              className="text-[#0055D4] dark:text-[#60A5FA] hover:underline font-bold"
            >
              Bandingkan Grafik Komponen →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
