import React, { useState, useMemo } from 'react';
import { 
  Table as TableIcon, 
  Search, 
  Filter, 
  MapPin, 
  Info, 
  AlertCircle, 
  Building2, 
  Compass, 
  ChevronRight,
  Wheat,
  Mountain,
  Droplets
} from 'lucide-react';
import { KapanewonData, SolokKecamatanData, ColorTheme, PilotRegion, PriorityCategory } from '../types';
import { CONTEXTUAL_CHARACTERIZATION_DATA } from '../data/baselineData';
import { SOLOK_CONTEXTUAL_DATA, PUBLISHED_SOLOK_DATA } from '../data/solokBaselineData';
import { getCategoryBadgeClasses } from '../utils/calculations';

interface ContextualTableProps {
  data: KapanewonData[];
  colorTheme: ColorTheme;
  currentPilot: PilotRegion;
  onSwitchPilot?: (pilot: PilotRegion) => void;
  onSelectKapanewon: (item: any) => void;
}

export const ContextualTable: React.FC<ContextualTableProps> = ({
  data,
  colorTheme,
  currentPilot,
  onSwitchPilot,
  onSelectKapanewon
}) => {
  const isGunungkidul = currentPilot === 'gunungkidul';
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [econFilter, setEconFilter] = useState('all');
  const [hazardFilter, setHazardFilter] = useState('all');

  const solokList = PUBLISHED_SOLOK_DATA;

  // Enriched Gunungkidul Data
  const enrichedGKData = useMemo(() => {
    return data.map(item => {
      const ctx = CONTEXTUAL_CHARACTERIZATION_DATA[item.kapanewon] || {
        kapanewon: item.kapanewon,
        geographic_zone: 'Mixed',
        geographic_zone_detail: 'Zona peralihan Gunungkidul.',
        population_scale: 'Medium (30-50k)',
        economic_specialization: 'Mixed agriculture',
        economic_detail: 'Pertanian campuran.',
        dominant_hazard: 'Drought-prone',
        dominant_hazard_detail: 'Fluktuasi pasokan air.',
        water_source_context: 'PAH dan sumur bor.'
      };
      return {
        ...item,
        name: item.kapanewon,
        context: ctx
      };
    });
  }, [data]);

  // Enriched Solok Data
  const enrichedSolokData = useMemo(() => {
    return solokList.map(item => {
      const ctx = SOLOK_CONTEXTUAL_DATA[item.NAMOBJ] || {
        kapanewon: item.NAMOBJ,
        geographic_zone: 'Highland valley',
        geographic_zone_detail: 'Lembah dataran tinggi Bukit Barisan.',
        population_scale: 'Medium (30-50k)',
        economic_specialization: 'Rice/sawah dominant',
        economic_detail: 'Pertanian sawah padi Anak Daro.',
        dominant_hazard: 'Drought-prone',
        dominant_hazard_detail: 'Defisit curah hujan kemarau.',
        water_source_context: 'Irigasi gravitasi pegunungan.'
      };
      return {
        ...item,
        name: item.NAMOBJ,
        context: ctx
      };
    });
  }, [solokList]);

  const activeEnrichedData = isGunungkidul ? enrichedGKData : enrichedSolokData;

  const filtered = useMemo(() => {
    return activeEnrichedData.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.context.economic_detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.context.geographic_zone_detail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = zoneFilter === 'all' || d.context.geographic_zone === zoneFilter;
      const matchEcon = econFilter === 'all' || d.context.economic_specialization === econFilter;
      const matchHazard = hazardFilter === 'all' || d.context.dominant_hazard === hazardFilter;
      return matchSearch && matchZone && matchEcon && matchHazard;
    });
  }, [activeEnrichedData, searchTerm, zoneFilter, econFilter, hazardFilter]);

  const uniqueZones = useMemo(() => {
    return Array.from(new Set(activeEnrichedData.map(d => d.context.geographic_zone)));
  }, [activeEnrichedData]);

  const uniqueEcons = useMemo(() => {
    return Array.from(new Set(activeEnrichedData.map(d => d.context.economic_specialization)));
  }, [activeEnrichedData]);

  const uniqueHazards = useMemo(() => {
    return Array.from(new Set(activeEnrichedData.map(d => d.context.dominant_hazard)));
  }, [activeEnrichedData]);

  return (
    <div className="space-y-6" id="contextual-table-container">
      {/* Header & Controls */}
      <div className="bg-white dark:bg-[#1E293B] border-2 border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#15803D]/15 dark:bg-[#15803D]/30 text-[#14532D] dark:text-[#4ADE80]">
                <Compass className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
                {isGunungkidul
                  ? 'Tabel Karakterisasi Kontekstual 18 Kapanewon Gunungkidul'
                  : 'Tabel Karakterisasi Kontekstual 14 Kecamatan Kabupaten Solok'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] mt-1.5 font-medium leading-relaxed">
              {isGunungkidul
                ? 'Integrasi tipologi bentang alam karst (Zona Selatan/Tengah/Utara), spesialisasi palawija, dan sumber air.'
                : 'Integrasi lansia gender, sentra padi sawah beras Solok (Anak Daro/Cisokan), elevasi danau kembar/pegunungan, dan sub-DAS.'}
            </p>
          </div>

          {/* Quick Pilot Switcher */}
          {onSwitchPilot && (
            <div className="flex items-center bg-[#F1F5F9] dark:bg-[#0F172A] p-1 rounded-xl border border-black/10 dark:border-white/10 text-xs sm:text-sm font-bold">
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
        </div>

        {/* Filter Bar */}
        <div className="mt-4 pt-4 border-t-2 border-black/[0.08] dark:border-white/[0.12] flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#475569] dark:text-[#94A3B8]" />
            <input
              type="text"
              placeholder={isGunungkidul ? "Cari nama kapanewon atau konteks..." : "Cari nama kecamatan atau konteks..."}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border-2 border-black/15 dark:border-white/20 bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-[#15803D]"
            />
          </div>

          {/* Zone Filter */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <span className="text-[#334155] dark:text-[#CBD5E1] font-bold">Zona:</span>
            <select
              value={zoneFilter}
              onChange={e => setZoneFilter(e.target.value)}
              className="py-2 px-2.5 rounded-xl border-2 border-black/15 dark:border-white/20 bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-white text-xs sm:text-sm font-semibold"
            >
              <option value="all">Semua Zona</option>
              {uniqueZones.map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          {/* Economic Filter */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <span className="text-[#334155] dark:text-[#CBD5E1] font-bold">Ekonomi:</span>
            <select
              value={econFilter}
              onChange={e => setEconFilter(e.target.value)}
              className="py-2 px-2.5 rounded-xl border-2 border-black/15 dark:border-white/20 bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-white text-xs sm:text-sm font-semibold"
            >
              <option value="all">Semua Spesialisasi</option>
              {uniqueEcons.map(ec => (
                <option key={ec} value={ec}>{ec}</option>
              ))}
            </select>
          </div>

          {/* Hazard Filter */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <span className="text-[#334155] dark:text-[#CBD5E1] font-bold">Bahaya:</span>
            <select
              value={hazardFilter}
              onChange={e => setHazardFilter(e.target.value)}
              className="py-2 px-2.5 rounded-xl border-2 border-black/15 dark:border-white/20 bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-white text-xs sm:text-sm font-semibold"
            >
              <option value="all">Semua Profil Bahaya</option>
              {uniqueHazards.map(hz => (
                <option key={hz} value={hz}>{hz}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-[#1E293B] border-2 border-black/[0.08] dark:border-white/[0.12] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-black/[0.08] dark:border-white/[0.12] bg-[#F1F5F9] dark:bg-[#0F172A] font-extrabold text-[#0F172A] dark:text-white">
                <th className="py-3 px-3 w-16 text-center">Rank</th>
                <th className="py-3 px-4">{isGunungkidul ? 'Kapanewon' : 'Kecamatan'}</th>
                <th className="py-3 px-3 text-right">SDFVI</th>
                <th className="py-3 px-3 text-center">Prioritas</th>
                <th className="py-3 px-4">Zona Geografis & Tipologi</th>
                <th className="py-3 px-4">Spesialisasi Ekonomi Agraris</th>
                <th className="py-3 px-4">Karakteristik Sumber Air & Bahaya</th>
                <th className="py-3 px-3 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.08]">
              {filtered.map(item => {
                const badgeClass = getCategoryBadgeClasses(item.priority_category, colorTheme);
                return (
                  <tr key={item.name} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-700/30 transition-colors">
                    <td className="py-3 px-3 text-center font-black text-[#0F172A] dark:text-white">
                      #{item.rank}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0F172A] dark:text-white whitespace-nowrap">
                      <button
                        onClick={() => onSelectKapanewon(item)}
                        className="hover:underline text-left focus:outline-hidden"
                      >
                        {item.name}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-[#0F172A] dark:text-white">
                      {item.SDFVI_proxy?.toFixed(4) ?? '-'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${badgeClass}`}>
                        {item.priority_category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs sm:text-sm max-w-xs">
                      <div className="font-bold text-[#0F172A] dark:text-white">{item.context.geographic_zone}</div>
                      <div className="text-xs text-[#334155] dark:text-[#CBD5E1] mt-0.5 font-medium">{item.context.geographic_zone_detail}</div>
                    </td>
                    <td className="py-3 px-4 text-xs sm:text-sm max-w-xs">
                      <div className="font-bold text-[#0F172A] dark:text-white">{item.context.economic_specialization}</div>
                      <div className="text-xs text-[#334155] dark:text-[#CBD5E1] mt-0.5 font-medium">{item.context.economic_detail}</div>
                    </td>
                    <td className="py-3 px-4 text-xs sm:text-sm max-w-xs">
                      <div className="font-bold text-[#0F172A] dark:text-white">{item.context.dominant_hazard}</div>
                      <div className="text-xs text-[#334155] dark:text-[#CBD5E1] mt-0.5 font-medium">{item.context.water_source_context}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onSelectKapanewon(item)}
                        className="text-xs sm:text-sm text-[#15803D] dark:text-[#4ADE80] font-extrabold hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>Profil</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
