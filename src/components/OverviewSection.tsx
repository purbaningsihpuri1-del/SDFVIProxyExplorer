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
    <div className="space-y-6">
      
      {/* Pilot Switcher Card in Overview */}
      <section 
        id="overview-pilot-selection-banner"
        className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-4 sm:p-5 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                PILIH WILAYAH PILOT
              </span>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Dua Pilot Eksplorasi Kerentanan Iklim Inklusif (DICLIV Indonesia)
              </h2>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
              Pilih wilayah untuk memuat dataset sub-distrik, formula proksi komposit, dan citra satelit georeferensi.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-switch-gunungkidul"
              onClick={() => { onSwitchPilot('gunungkidul'); setSearchTerm(''); setCategoryFilter('all'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isGunungkidul
                  ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400'
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Gunungkidul (18 Kapanewon)</span>
            </button>

            <button
              id="btn-switch-solok"
              onClick={() => { onSwitchPilot('solok'); setSearchTerm(''); setCategoryFilter('all'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                !isGunungkidul
                  ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400'
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Solok (14 Kecamatan)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Relative Screening Principle Banner */}
      <section 
        id="relative-screening-banner"
        aria-labelledby="banner-title"
        className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/90 dark:bg-amber-950/40 p-4 sm:p-5 text-neutral-900 dark:text-neutral-100 shadow-xs"
      >
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-300 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 id="banner-title" className="text-sm sm:text-base font-bold text-amber-900 dark:text-amber-200">
              Prinsip Metodologis: Skrining Relatif untuk Verifikasi Lapangan Partisipatif
            </h3>
            <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-300/90 leading-relaxed">
              {isGunungkidul ? (
                <>
                  Skor SDFVI–Proxy dihitung untuk <strong>18 kapanewon sebagai sensus spasial penuh</strong> di Kabupaten Gunungkidul. 
                  Hasil ini berfungsi sebagai <strong>indikator skrining relatif</strong> untuk menetapkan prioritas penyelidikan dan alokasi dukungan inklusi disabilitas (ADK & lansia), 
                  <strong> bukan pemicu otomatis vonis kerentanan tanpa konfirmasi pamong kalurahan dan organisasi disabilitas</strong>.
                </>
              ) : (
                <>
                  Skor SDFVI–Proxy dihitung untuk <strong>14 kecamatan sebagai sensus spasial penuh</strong> di Kabupaten Solok. 
                  Hasil ini memotret interaksi antara <strong>sensitivitas gender ($S_i$: perempuan 60+ tanpa ijazah formal)</strong>, 
                  <strong> bahaya meteorologis ($H_i$: defisit CHIRPS kemarau 2023)</strong>, dan <strong>eksposur sentra sawah ($E_i$: ha per kapita)</strong> 
                  untuk mengarahkan program perlindungan sosial dan irigasi padi sawah Anak Daro.
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Summary KPI Cards Grid */}
      <section 
        id="overview-kpi-grid"
        aria-label="Statistik Kunci SDFVI-Proxy"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Card 1: Total Units */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Populasi Unit Spasial</span>
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
              {totalUnits}
            </span>
            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              {isGunungkidul ? 'Kapanewon (100% Lengkap)' : 'Kecamatan (100% Lengkap)'}
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            {isGunungkidul ? 'Sensus 18 Kapanewon Pemkab Gunungkidul' : 'Sensus 14 Kecamatan Pemkab Solok'}
          </p>
        </div>

        {/* Card 2: Highest Proxy */}
        <div 
          onClick={() => {
            const topItem = isGunungkidul ? gkHighest : solokHighest;
            if (topItem) onSelectKapanewon(topItem);
          }}
          className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 shadow-xs hover:border-orange-500 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Skor SDFVI–Proxy Tertinggi</span>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
              {highestScore !== undefined ? highestScore.toFixed(4) : '-'}
            </span>
            <span className="text-xs font-bold text-orange-600">
              {highestName}
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center justify-between">
            <span>Peringkat #1 • Prioritas Utama</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">Lihat profil →</span>
          </p>
        </div>

        {/* Card 3: Lowest Proxy */}
        <div 
          onClick={() => {
            const bottomItem = isGunungkidul ? gkLowest : solokLowest;
            if (bottomItem) onSelectKapanewon(bottomItem);
          }}
          className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 shadow-xs hover:border-emerald-500 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Skor SDFVI–Proxy Terendah</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
              {lowestScore !== undefined ? lowestScore.toFixed(4) : '-'}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              {lowestName}
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center justify-between">
            <span>Peringkat #{totalUnits} • Paling Rendah</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">Lihat profil →</span>
          </p>
        </div>

        {/* Card 4: Category Distribution Summary */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Distribusi Prioritas</span>
            <Layers className="w-4 h-4 text-neutral-600" />
          </div>
          <div className="mt-2 grid grid-cols-4 gap-1 text-center">
            <div className="p-1 rounded bg-orange-50 dark:bg-orange-950/40">
              <div className="text-[10px] font-bold text-orange-600">Tinggi</div>
              <div className="text-sm font-bold text-orange-700 dark:text-orange-300">{activeCategoryCounts['Tinggi']}</div>
            </div>
            <div className="p-1 rounded bg-amber-50 dark:bg-amber-950/40">
              <div className="text-[10px] font-bold text-amber-600">Sedang</div>
              <div className="text-sm font-bold text-amber-700 dark:text-amber-300">{activeCategoryCounts['Sedang']}</div>
            </div>
            <div className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/40">
              <div className="text-[10px] font-bold text-emerald-600">Rendah</div>
              <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{activeCategoryCounts['Rendah']}</div>
            </div>
            <div className="p-1 rounded bg-blue-50 dark:bg-blue-950/40">
              <div className="text-[10px] font-bold text-blue-600">{isGunungkidul ? 'S.Tinggi' : 'Terendah'}</div>
              <div className="text-sm font-bold text-blue-700 dark:text-blue-300">
                {isGunungkidul ? activeCategoryCounts['Sangat Tinggi'] : activeCategoryCounts['Terendah']}
              </div>
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1.5 text-center">
            {isGunungkidul 
              ? '10 Kapanewon masuk prioritas verifikasi Tinggi' 
              : '3 Kecamatan Prioritas Tinggi (Hiliran Gumanti, Pantai Cermin, Gn. Talang)'}
          </p>
        </div>
      </section>

      {/* Thematic Map & Biochar Teaser Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Thematic Map Teaser */}
        <section 
          id="overview-spatial-map-teaser"
          className="bg-neutral-900 text-white border border-neutral-700 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <MapPin className="w-3.5 h-3.5" />
              <span>Peta Spasial Georeferensi Resmi</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
              {isGunungkidul 
                ? 'Peta Tematik Spasial SDFVI–Proxy Gunungkidul' 
                : 'Peta Spasial Tematik SDFVI–Proxy Solok (14 Kecamatan)'}
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {isGunungkidul
                ? 'Eksplorasi batas poligon 18 kapanewon karst Gunungsewu dengan citra satelit, overlay kategori prioritas, dan pin hotspot interaktif.'
                : 'Eksplorasi 14 kecamatan di lereng Gunung Talang dan lembah danau kembar dengan data satelit CHIRPS kemarau 2023 dan sentra beras Solok.'}
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              id="btn-goto-spatial-map"
              onClick={() => onNavigateTab('map')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs transition-colors"
            >
              <span>Buka Peta Tematik Lengkap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-neutral-400">
              {isGunungkidul ? '18 Kapanewon' : '14 Kecamatan'}
            </span>
          </div>
        </section>

        {/* Biochar Sensitivity / Context Teaser */}
        {isGunungkidul ? (
          <section 
            id="overview-biochar-teaser"
            className="bg-purple-950 text-white border border-purple-800/80 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Droplets className="w-3.5 h-3.5" />
                <span>Simulasi Solusi Berbasis Alam</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                Sensitivitas Retensi Air Biochar (Benchmark 2019)
              </h3>
              <p className="text-xs text-purple-200 leading-relaxed">
                Simulasi kenaikan Water Holding Capacity (WHC) tanah karst melalui aplikasi biochar pirolisis limbah pertanian di 4 Hotspot Kritis: Ponjong, Panggang, Paliyan, Saptosari.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                id="btn-goto-biochar"
                onClick={() => onNavigateTab('biochar')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-2xs transition-colors"
              >
                <span>Buka Panel Biochar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] text-purple-300 font-mono">
                +5% s/d +25% WHC
              </span>
            </div>
          </section>
        ) : (
          <section 
            id="overview-solok-context-teaser"
            className="bg-blue-950 text-white border border-blue-800/80 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <Wheat className="w-3.5 h-3.5" />
                <span>Karakteristik Agraris & Gender</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                Pertanian Padi Anak Daro & Sensitivitas Gender
              </h3>
              <p className="text-xs text-blue-200 leading-relaxed">
                Kombinasi data sawah irigasi/tadah hujan dengan kerentanan demografis perempuan lansia tanpa pendidikan formal yang menopang ketahanan pangan keluarga di Solok.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                id="btn-goto-solok-context"
                onClick={() => onNavigateTab('context')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-2xs transition-colors"
              >
                <span>Lihat Karakteristik Kecamatan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] text-blue-300">
                Beras Solok (Indikasi Geografis)
              </span>
            </div>
          </section>
        )}
      </div>

      {/* Interactive Ranked Table with Search & Filter */}
      <section 
        id="overview-ranked-table-section"
        aria-labelledby="ranked-table-heading"
        className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 sm:p-6 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-700">
          <div>
            <h3 id="ranked-table-heading" className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
              {isGunungkidul 
                ? 'Tabel Pemeringkatan Lengkap 18 Kapanewon Gunungkidul' 
                : 'Tabel Pemeringkatan Lengkap 14 Kecamatan Kabupaten Solok'}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {isGunungkidul
                ? 'Klik nama kapanewon untuk membuka rincian profil 3 komponen dan panduan pertanyaan lapangan'
                : 'Klik nama kecamatan untuk rincian indikator perempuan lansia, defisit CHIRPS 2023, dan sentra padi sawah'}
            </p>
          </div>

          {/* Controls: Search and Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                id="search-unit-input"
                type="text"
                placeholder={isGunungkidul ? "Cari kapanewon..." : "Cari kecamatan..."}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-neutral-400" />
              <select
                id="filter-category"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="py-1.5 px-2.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-hidden"
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

        {/* Table representation */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700/40 text-neutral-600 dark:text-neutral-300 font-semibold">
                <th scope="col" className="py-2.5 px-3 w-16 text-center cursor-pointer" onClick={() => { setSortField('rank'); setSortAsc(!sortAsc); }}>
                  <div className="flex items-center justify-center gap-1">
                    <span>Rank</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th scope="col" className="py-2.5 px-3 cursor-pointer" onClick={() => { setSortField('name'); setSortAsc(!sortAsc); }}>
                  <div className="flex items-center gap-1">
                    <span>{isGunungkidul ? 'Kapanewon' : 'Kecamatan'}</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th scope="col" className="py-2.5 px-3 text-right cursor-pointer" onClick={() => { setSortField('sdfvi'); setSortAsc(!sortAsc); }}>
                  <div className="flex items-center justify-end gap-1">
                    <span>SDFVI–Proxy</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th scope="col" className="py-2.5 px-3 text-center">Kategori Prioritas</th>
                
                {isGunungkidul ? (
                  <>
                    <th scope="col" className="py-2.5 px-3 text-right hidden md:table-cell">L1 (Sensitivitas ADK)</th>
                    <th scope="col" className="py-2.5 px-3 text-right hidden md:table-cell">H (Bahaya CHIRPS)</th>
                    <th scope="col" className="py-2.5 px-3 text-right hidden md:table-cell">F_area (Defisit Pangan)</th>
                  </>
                ) : (
                  <>
                    <th scope="col" className="py-2.5 px-3 text-right hidden md:table-cell">S_i (Gender 60+)</th>
                    <th scope="col" className="py-2.5 px-3 text-right hidden md:table-cell">H_i (CHIRPS 2023)</th>
                    <th scope="col" className="py-2.5 px-3 text-right hidden md:table-cell">E_i (Sawah Total ha)</th>
                  </>
                )}

                <th scope="col" className="py-2.5 px-3 text-center w-24">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/60">
              {isGunungkidul ? (
                filteredGunungkidul.map((item) => {
                  const badgeStyle = getCategoryBadgeClasses(item.priority_category, colorTheme);
                  return (
                    <tr 
                      key={item.kapanewon}
                      className="hover:bg-neutral-50/80 dark:hover:bg-neutral-700/30 transition-colors"
                    >
                      <td className="py-3 px-3 text-center font-bold text-neutral-700 dark:text-neutral-300">
                        #{item.rank}
                      </td>
                      <td className="py-3 px-3 font-semibold text-neutral-900 dark:text-white">
                        <button
                          onClick={() => onSelectKapanewon(item)}
                          className="hover:underline text-left text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 rounded px-1 -mx-1"
                        >
                          {item.kapanewon}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900 dark:text-white">
                        {item.SDFVI_proxy.toFixed(4)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${badgeStyle}`}>
                          {item.priority_category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-neutral-600 dark:text-neutral-400 hidden md:table-cell">
                        {item.L1_social_sensitivity.toFixed(4)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-neutral-600 dark:text-neutral-400 hidden md:table-cell">
                        {item.H_meteorological_hazard.toFixed(4)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-neutral-600 dark:text-neutral-400 hidden md:table-cell">
                        {item.F_area_land_deficit_proxy.toFixed(4)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          id={`btn-view-${item.kapanewon.toLowerCase()}`}
                          onClick={() => onSelectKapanewon(item)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 hover:underline px-2 py-1 rounded transition-colors"
                          aria-label={`Buka profil lengkap Kapanewon ${item.kapanewon}`}
                        >
                          <span>Profil</span>
                          <ChevronRight className="w-3.5 h-3.5" />
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
                      className="hover:bg-neutral-50/80 dark:hover:bg-neutral-700/30 transition-colors"
                    >
                      <td className="py-3 px-3 text-center font-bold text-neutral-700 dark:text-neutral-300">
                        #{item.rank}
                      </td>
                      <td className="py-3 px-3 font-semibold text-neutral-900 dark:text-white">
                        <button
                          onClick={() => onSelectKapanewon(item)}
                          className="hover:underline text-left text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 rounded px-1 -mx-1"
                        >
                          {item.NAMOBJ}
                        </button>
                        <div className="text-[11px] text-neutral-500 font-normal">
                          {item.dominant_rice_variety}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900 dark:text-white">
                        {item.SDFVI_proxy.toFixed(4)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${badgeStyle}`}>
                          {item.priority_category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-neutral-600 dark:text-neutral-400 hidden md:table-cell">
                        <span title={`Skor normalisasi S_i: ${item.S_i.toFixed(4)}`}>{item.S_i.toFixed(4)}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-neutral-600 dark:text-neutral-400 hidden md:table-cell">
                        <div>{item.H_i.toFixed(4)}</div>
                        <div className="text-[10px] text-neutral-400">{item.chirps_total_mm.toFixed(1)} mm</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-neutral-600 dark:text-neutral-400 hidden md:table-cell">
                        <div>{item.E_i.toFixed(4)}</div>
                        <div className="text-[10px] text-neutral-400">{item.sawah_total_ha.toLocaleString('id-ID')} ha</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          id={`btn-view-${item.NAMOBJ.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => onSelectKapanewon(item)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-400 hover:text-blue-900 hover:underline px-2 py-1 rounded transition-colors"
                          aria-label={`Buka profil lengkap Kecamatan ${item.NAMOBJ}`}
                        >
                          <span>Profil</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}

              {(isGunungkidul ? filteredGunungkidul.length : filteredSolok.length) === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500 dark:text-neutral-400">
                    Tidak ditemukan unit wilayah dengan kriteria pencarian tersebut.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Quick Navigation */}
        <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <span>Menampilkan {isGunungkidul ? filteredGunungkidul.length : filteredSolok.length} dari {totalUnits} {isGunungkidul ? 'kapanewon' : 'kecamatan'}</span>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigateTab('map')} 
              className="text-emerald-700 dark:text-emerald-400 hover:underline font-medium"
            >
              Lihat di Peta Spasial →
            </button>
            <button 
              onClick={() => onNavigateTab('charts')} 
              className="text-emerald-700 dark:text-emerald-400 hover:underline font-medium"
            >
              Bandingkan Grafik Komponen →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
