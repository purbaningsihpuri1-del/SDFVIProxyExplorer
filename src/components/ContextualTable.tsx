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
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                <Compass className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                {isGunungkidul
                  ? 'Tabel Karakterisasi Kontekstual 18 Kapanewon Gunungkidul'
                  : 'Tabel Karakterisasi Kontekstual 14 Kecamatan Kabupaten Solok'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {isGunungkidul
                ? 'Integrasi tipologi bentang alam karst (Zona Selatan/Tengah/Utara), spesialisasi palawija, dan sumber air.'
                : 'Integrasi lansia gender, sentra padi sawah beras Solok (Anak Daro/Cisokan), elevasi danau kembar/pegunungan, dan sub-DAS.'}
            </p>
          </div>

          {/* Quick Pilot Switcher */}
          {onSwitchPilot && (
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-700 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => onSwitchPilot('gunungkidul')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  isGunungkidul ? 'bg-emerald-600 text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-300'
                }`}
              >
                Gunungkidul
              </button>
              <button
                onClick={() => onSwitchPilot('solok')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  !isGunungkidul ? 'bg-blue-600 text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-300'
                }`}
              >
                Solok
              </button>
            </div>
          )}
        </div>

        {/* Filter Bar */}
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder={isGunungkidul ? "Cari nama kapanewon atau konteks..." : "Cari nama kecamatan atau konteks..."}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>

          {/* Zone Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-neutral-500 font-medium">Zona:</span>
            <select
              value={zoneFilter}
              onChange={e => setZoneFilter(e.target.value)}
              className="py-1.5 px-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-xs"
            >
              <option value="all">Semua Zona</option>
              {uniqueZones.map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          {/* Economic Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-neutral-500 font-medium">Ekonomi:</span>
            <select
              value={econFilter}
              onChange={e => setEconFilter(e.target.value)}
              className="py-1.5 px-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-xs"
            >
              <option value="all">Semua Spesialisasi</option>
              {uniqueEcons.map(ec => (
                <option key={ec} value={ec}>{ec}</option>
              ))}
            </select>
          </div>

          {/* Hazard Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-neutral-500 font-medium">Bahaya:</span>
            <select
              value={hazardFilter}
              onChange={e => setHazardFilter(e.target.value)}
              className="py-1.5 px-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-xs"
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
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700/40 font-semibold text-neutral-600 dark:text-neutral-300">
                <th className="py-3 px-3 w-14 text-center">Rank</th>
                <th className="py-3 px-4">{isGunungkidul ? 'Kapanewon' : 'Kecamatan'}</th>
                <th className="py-3 px-3 text-right">SDFVI</th>
                <th className="py-3 px-3 text-center">Prioritas</th>
                <th className="py-3 px-4">Zona Geografis & Tipologi</th>
                <th className="py-3 px-4">Spesialisasi Ekonomi Agraris</th>
                <th className="py-3 px-4">Karakteristik Sumber Air & Bahaya</th>
                <th className="py-3 px-3 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/60">
              {filtered.map(item => {
                const badgeClass = getCategoryBadgeClasses(item.priority_category, colorTheme);
                return (
                  <tr key={item.name} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-700/30 transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-neutral-700 dark:text-neutral-300">
                      #{item.rank}
                    </td>
                    <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
                      <button
                        onClick={() => onSelectKapanewon(item)}
                        className="hover:underline text-left focus:outline-hidden"
                      >
                        {item.name}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900 dark:text-white">
                      {item.SDFVI_proxy.toFixed(4)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${badgeClass}`}>
                        {item.priority_category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-700 dark:text-neutral-300 max-w-xs">
                      <div className="font-semibold text-neutral-900 dark:text-white">{item.context.geographic_zone}</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">{item.context.geographic_zone_detail}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-700 dark:text-neutral-300 max-w-xs">
                      <div className="font-semibold text-neutral-900 dark:text-white">{item.context.economic_specialization}</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">{item.context.economic_detail}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-700 dark:text-neutral-300 max-w-xs">
                      <div className="font-semibold text-neutral-900 dark:text-white">{item.context.dominant_hazard}</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">{item.context.water_source_context}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onSelectKapanewon(item)}
                        className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>Profil</span>
                        <ChevronRight className="w-3.5 h-3.5" />
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
