import React, { useState, useMemo, useRef } from 'react';
import { 
  Map as MapIcon, 
  Info, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Check, 
  AlertTriangle,
  Table as TableIcon,
  Satellite,
  Maximize2,
  Minimize2,
  Download,
  MapPin,
  Eye,
  Filter,
  Compass,
  Droplets,
  Wheat,
  Users
} from 'lucide-react';
import { KapanewonData, SolokKecamatanData, ColorTheme, PriorityCategory, PilotRegion } from '../types';
import { GUNUNGKIDUL_OFFICIAL_GEOJSON } from '../data/sampleGunungkidulGeoJson';
import { SOLOK_OFFICIAL_GEOJSON } from '../data/sampleSolokGeoJson';
import { PUBLISHED_SOLOK_DATA } from '../data/solokBaselineData';
import { getCategoryHexColor, getCategoryBadgeClasses } from '../utils/calculations';
import thematicMapImg from '../assets/images/gunungkidul_thematic_map.jpg';

interface MapSectionProps {
  data: KapanewonData[];
  colorTheme: ColorTheme;
  currentPilot: PilotRegion;
  onSwitchPilot?: (pilot: PilotRegion) => void;
  onSelectKapanewon: (item: any) => void;
}

// Spatial Hotspot Coordinates for Gunungkidul Thematic Satellite Map
const GK_HOTSPOTS = [
  { name: 'Wonosari', leftPct: 50.5, topPct: 49.0 },
  { name: 'Playen', leftPct: 43.5, topPct: 41.5 },
  { name: 'Paliyan', leftPct: 42.5, topPct: 54.0 },
  { name: 'Semanu', leftPct: 57.5, topPct: 57.0 },
  { name: 'Tanjungsari', leftPct: 48.5, topPct: 74.0 },
  { name: 'Purwosari', leftPct: 28.5, topPct: 57.0 },
  { name: 'Patuk', leftPct: 42.5, topPct: 28.0 },
  { name: 'Panggang', leftPct: 36.5, topPct: 66.0 },
  { name: 'Karangmojo', leftPct: 58.0, topPct: 43.0 },
  { name: 'Ngawen', leftPct: 60.5, topPct: 15.0 },
  { name: 'Rongkop', leftPct: 64.5, topPct: 67.0 },
  { name: 'Tepus', leftPct: 56.5, topPct: 77.0 },
  { name: 'Saptosari', leftPct: 41.5, topPct: 73.0 },
  { name: 'Ponjong', leftPct: 65.5, topPct: 47.0 },
  { name: 'Gedangsari', leftPct: 51.5, topPct: 19.0 },
  { name: 'Girisubo', leftPct: 70.5, topPct: 82.0 },
  { name: 'Semin', leftPct: 66.5, topPct: 24.0 },
  { name: 'Nglipar', leftPct: 54.5, topPct: 28.0 },
];

export const MapSection: React.FC<MapSectionProps> = ({
  data,
  colorTheme,
  currentPilot,
  onSwitchPilot,
  onSelectKapanewon,
}) => {
  const isGunungkidul = currentPilot === 'gunungkidul';

  // View modes
  const [mapLayerMode, setMapLayerMode] = useState<'satellite' | 'vector'>(isGunungkidul ? 'satellite' : 'vector');
  const [solokMetricLayer, setSolokMetricLayer] = useState<'sdfvi' | 'chirps' | 'sawah' | 'gender'>('sdfvi');
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  
  // Interactive states
  const [hoveredUnit, setHoveredUnit] = useState<any | null>(null);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showPins, setShowPins] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Active GeoJSON & Data map
  const activeGeoJson = isGunungkidul ? GUNUNGKIDUL_OFFICIAL_GEOJSON : SOLOK_OFFICIAL_GEOJSON;
  const solokList = PUBLISHED_SOLOK_DATA;

  const dataMap = useMemo(() => {
    const map = new Map<string, any>();
    if (isGunungkidul) {
      data.forEach(d => map.set(d.kapanewon.toLowerCase().trim(), d));
    } else {
      solokList.forEach(d => map.set(d.NAMOBJ.toLowerCase().trim(), d));
    }
    return map;
  }, [data, solokList, isGunungkidul]);

  // Compute SVG bounding box
  const bounds = useMemo(() => {
    if (!activeGeoJson || !activeGeoJson.features) return null;
    let minLon = Infinity;
    let maxLon = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    activeGeoJson.features.forEach((feature: any) => {
      const geom = feature.geometry;
      if (!geom) return;

      const processCoords = (coords: any[]) => {
        if (typeof coords[0] === 'number') {
          const lon = coords[0];
          const lat = coords[1];
          if (lon < minLon) minLon = lon;
          if (lon > maxLon) maxLon = lon;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
        } else {
          coords.forEach(c => processCoords(c));
        }
      };

      processCoords(geom.coordinates);
    });

    if (minLon === Infinity) return null;
    return { minLon, maxLon, minLat, maxLat };
  }, [activeGeoJson]);

  const svgWidth = 720;
  const svgHeight = 540;
  const padding = 36;

  const project = (lon: number, lat: number) => {
    if (!bounds) return [0, 0];
    const lonSpan = bounds.maxLon - bounds.minLon || 1;
    const latSpan = bounds.maxLat - bounds.minLat || 1;

    const availableWidth = svgWidth - padding * 2;
    const availableHeight = svgHeight - padding * 2;
    const scale = Math.min(availableWidth / lonSpan, availableHeight / latSpan);

    const x = padding + (lon - bounds.minLon) * scale + (availableWidth - lonSpan * scale) / 2;
    const y = padding + (bounds.maxLat - lat) * scale + (availableHeight - latSpan * scale) / 2;

    return [x, y];
  };

  const buildPath = (coordinates: any, geomType: string): string => {
    if (geomType === 'Polygon') {
      return coordinates.map((ring: number[][]) => {
        return ring.map((pt, i) => {
          const [px, py] = project(pt[0], pt[1]);
          return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`;
        }).join(' ') + ' Z';
      }).join(' ');
    } else if (geomType === 'MultiPolygon') {
      return coordinates.map((poly: any) => {
        return poly.map((ring: number[][]) => {
          return ring.map((pt, i) => {
            const [px, py] = project(pt[0], pt[1]);
            return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`;
          }).join(' ') + ' Z';
        }).join(' ');
      }).join(' ');
    }
    return '';
  };

  // Helper for Solok custom metric coloring
  const getSolokColor = (item: SolokKecamatanData): string => {
    if (solokMetricLayer === 'sdfvi') {
      return getCategoryHexColor(item.priority_category, colorTheme);
    }
    if (solokMetricLayer === 'chirps') {
      // H_i higher is drier (more hazard) -> deep orange to red
      const h = item.H_i;
      if (h >= 0.8) return '#b91c1c'; // Red 700
      if (h >= 0.5) return '#ea580c'; // Orange 600
      if (h >= 0.25) return '#f59e0b'; // Amber 500
      return '#3b82f6'; // Blue 500 (more rain)
    }
    if (solokMetricLayer === 'sawah') {
      // E_i higher is more sawah exposure -> emerald green to teal
      const e = item.E_i;
      if (e >= 0.7) return '#047857'; // Emerald 700
      if (e >= 0.4) return '#059669'; // Emerald 600
      if (e >= 0.15) return '#10b981'; // Emerald 500
      return '#94a3b8'; // Slate 400 (minimal sawah)
    }
    if (solokMetricLayer === 'gender') {
      // S_i higher is more women 60+ without formal edu -> purple
      const s = item.S_i;
      if (s >= 0.7) return '#7e22ce'; // Purple 700
      if (s >= 0.4) return '#a855f7'; // Purple 500
      if (s >= 0.15) return '#c084fc'; // Purple 400
      return '#e2e8f0'; // Slate 200
    }
    return getCategoryHexColor(item.priority_category, colorTheme);
  };

  return (
    <div className="space-y-6" id="map-section-container">
      {/* Top Map Controls Header */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                <MapIcon className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                {isGunungkidul 
                  ? 'Peta Spasial Georeferensi Kapanewon Gunungkidul' 
                  : 'Peta Spasial Tematik Kecamatan Kabupaten Solok'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {isGunungkidul
                ? 'Visualisasi spasial 18 unit poligon administratif karst Gunungkidul dengan citra satelit dan pin hotspot.'
                : 'Visualisasi 14 kecamatan di lembah Bukit Barisan dengan data curah hujan satelit CHIRPS kemarau 2023 dan sentra padi sawah.'}
            </p>
          </div>

          {/* Pilot Switcher & View Mode Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Quick Pilot Switcher */}
            {onSwitchPilot && (
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-700 p-1 rounded-lg text-xs font-semibold">
                <button
                  id="map-btn-gk"
                  onClick={() => onSwitchPilot('gunungkidul')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    isGunungkidul ? 'bg-emerald-600 text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Gunungkidul
                </button>
                <button
                  id="map-btn-solok"
                  onClick={() => onSwitchPilot('solok')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    !isGunungkidul ? 'bg-blue-600 text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Solok
                </button>
              </div>
            )}

            {/* Layer Mode: Satellite vs Vector (Gunungkidul) or Metric Layers (Solok) */}
            {isGunungkidul ? (
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-700 p-1 rounded-lg text-xs font-medium">
                <button
                  id="btn-layer-satellite"
                  onClick={() => setMapLayerMode('satellite')}
                  className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${
                    mapLayerMode === 'satellite'
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <Satellite className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Citra Satelit</span>
                </button>
                <button
                  id="btn-layer-vector"
                  onClick={() => setMapLayerMode('vector')}
                  className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${
                    mapLayerMode === 'vector'
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>Vektor SVG</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-700 p-1 rounded-lg text-xs font-medium overflow-x-auto">
                <span className="text-[11px] text-neutral-500 px-1 font-semibold">Layer:</span>
                <button
                  id="btn-solok-layer-sdfvi"
                  onClick={() => setSolokMetricLayer('sdfvi')}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    solokMetricLayer === 'sdfvi'
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  SDFVI Proxy
                </button>
                <button
                  id="btn-solok-layer-chirps"
                  onClick={() => setSolokMetricLayer('chirps')}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    solokMetricLayer === 'chirps'
                      ? 'bg-white dark:bg-neutral-800 text-orange-700 dark:text-orange-400 font-bold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Defisit CHIRPS
                </button>
                <button
                  id="btn-solok-layer-sawah"
                  onClick={() => setSolokMetricLayer('sawah')}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    solokMetricLayer === 'sawah'
                      ? 'bg-white dark:bg-neutral-800 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Sawah (ha)
                </button>
                <button
                  id="btn-solok-layer-gender"
                  onClick={() => setSolokMetricLayer('gender')}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    solokMetricLayer === 'gender'
                      ? 'bg-white dark:bg-neutral-800 text-purple-700 dark:text-purple-400 font-bold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Sensitivitas Gender
                </button>
              </div>
            )}

            {/* Toggle Table Accessibility Mode */}
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-700 p-1 rounded-lg text-xs font-medium">
              <button
                id="btn-view-map"
                onClick={() => setViewMode('map')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  viewMode === 'map' ? 'bg-white dark:bg-neutral-800 font-semibold shadow-xs' : 'text-neutral-600'
                }`}
                title="Tampilan Peta Grafis"
              >
                Peta
              </button>
              <button
                id="btn-view-table"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  viewMode === 'table' ? 'bg-white dark:bg-neutral-800 font-semibold shadow-xs' : 'text-neutral-600'
                }`}
                title="Tampilan Tabel Aksesibel"
              >
                Tabel
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Map Viewport */}
      {viewMode === 'map' && (
        <div 
          ref={mapContainerRef}
          className={`relative bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-xl transition-all ${
            isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full min-h-[580px]'
          }`}
        >
          {/* Zoom & Fullscreen Controls Overlay */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-neutral-900/80 backdrop-blur-md p-1.5 rounded-xl border border-neutral-700 shadow-md">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
              className="p-1.5 rounded text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Perbesar Peta"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
              className="p-1.5 rounded text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Perkecil Peta"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors border-t border-neutral-700"
              title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Toggle Pins & Labels Overlay */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-neutral-700 text-xs text-neutral-300 shadow-md">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showLabels} 
                onChange={e => setShowLabels(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>Label</span>
            </label>
            <span className="text-neutral-600">|</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showPins} 
                onChange={e => setShowPins(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>Hotspot Pin</span>
            </label>
          </div>

          {/* Visual Display Container */}
          <div 
            className="w-full h-full min-h-[580px] flex items-center justify-center p-4 overflow-auto"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
          >
            {isGunungkidul && mapLayerMode === 'satellite' ? (
              /* Gunungkidul Satellite Thematic Map with Interactive Pins */
              <div className="relative max-w-4xl w-full mx-auto rounded-xl overflow-hidden shadow-2xl border border-neutral-700 bg-neutral-950">
                <img 
                  src={thematicMapImg} 
                  alt="SDFVI–Proxy Peta Spasial Georeferensi Kapanewon Gunungkidul" 
                  className="w-full h-auto block select-none"
                  referrerPolicy="no-referrer"
                />

                {/* Hotspot Pins Overlay */}
                {showPins && GK_HOTSPOTS.map((pin) => {
                  const record = dataMap.get(pin.name.toLowerCase().trim());
                  if (!record) return null;
                  const isHovered = hoveredUnit?.kapanewon === record.kapanewon;
                  const badgeColor = getCategoryHexColor(record.priority_category, colorTheme);

                  return (
                    <div
                      key={pin.name}
                      style={{ left: `${pin.leftPct}%`, top: `${pin.topPct}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
                      onClick={() => onSelectKapanewon(record)}
                      onMouseEnter={() => setHoveredUnit(record)}
                      onMouseLeave={() => setHoveredUnit(null)}
                    >
                      <div 
                        className={`flex items-center justify-center rounded-full transition-transform ${
                          isHovered ? 'scale-130 shadow-lg ring-3 ring-white' : 'scale-100 hover:scale-120'
                        }`}
                        style={{ backgroundColor: badgeColor, width: '22px', height: '22px' }}
                      >
                        <span className="text-[10px] font-bold text-white">#{record.rank}</span>
                      </div>

                      {showLabels && (
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-neutral-900/90 text-white text-[10px] font-semibold pointer-events-none shadow-md border border-neutral-700">
                          {record.kapanewon}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Vector SVG Choropleth for Gunungkidul or Solok */
              <svg 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                className="w-full max-w-2xl h-auto drop-shadow-xl"
              >
                <defs>
                  <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
                  </filter>
                </defs>

                {/* Background Water / Border Outline */}
                <rect width={svgWidth} height={svgHeight} fill="#111827" rx="16" />

                {/* Polygons */}
                {activeGeoJson.features.map((feature: any, idx: number) => {
                  const unitName = isGunungkidul 
                    ? (feature.properties.kapanewon || feature.properties.NAMOBJ || '') 
                    : (feature.properties.NAMOBJ || '');
                  const record = dataMap.get(unitName.toLowerCase().trim());
                  
                  let fillColor = '#374151';
                  if (record) {
                    if (isGunungkidul) {
                      fillColor = getCategoryHexColor(record.priority_category, colorTheme);
                    } else {
                      fillColor = getSolokColor(record);
                    }
                  }

                  const pathStr = buildPath(feature.geometry.coordinates, feature.geometry.type);
                  const isHovered = isGunungkidul 
                    ? hoveredUnit?.kapanewon === unitName 
                    : hoveredUnit?.NAMOBJ === unitName;

                  return (
                    <g key={unitName || idx} className="cursor-pointer">
                      <path
                        d={pathStr}
                        fill={fillColor}
                        fillOpacity={isHovered ? 0.95 : 0.75}
                        stroke={isHovered ? '#ffffff' : '#1f2937'}
                        strokeWidth={isHovered ? 2.5 : 1.2}
                        filter={isHovered ? "url(#map-glow)" : undefined}
                        onClick={() => record && onSelectKapanewon(record)}
                        onMouseEnter={() => setHoveredUnit(record)}
                        onMouseLeave={() => setHoveredUnit(null)}
                        className="transition-all duration-150"
                      />
                    </g>
                  );
                })}

                {/* Polygon Labels */}
                {showLabels && activeGeoJson.features.map((feature: any) => {
                  const unitName = isGunungkidul 
                    ? (feature.properties.kapanewon || feature.properties.NAMOBJ || '') 
                    : (feature.properties.NAMOBJ || '');
                  const record = dataMap.get(unitName.toLowerCase().trim());
                  
                  // Compute center of feature for label
                  let centerLon = 0, centerLat = 0, ptCount = 0;
                  const addPoints = (coords: any[]) => {
                    if (typeof coords[0] === 'number') {
                      centerLon += coords[0];
                      centerLat += coords[1];
                      ptCount++;
                    } else {
                      coords.forEach(c => addPoints(c));
                    }
                  };
                  addPoints(feature.geometry.coordinates);
                  if (ptCount === 0) return null;
                  const [cx, cy] = project(centerLon / ptCount, centerLat / ptCount);

                  return (
                    <text
                      key={`lbl-${unitName}`}
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffffff"
                      fontSize={isGunungkidul ? "9px" : "8px"}
                      fontWeight="bold"
                      className="pointer-events-none select-none drop-shadow-md"
                    >
                      {unitName}
                    </text>
                  );
                })}
              </svg>
            )}
          </div>

          {/* Interactive Hover Tooltip Overlay (Bottom Left) */}
          {hoveredUnit && (
            <div className="absolute bottom-4 left-4 z-20 max-w-xs w-full bg-neutral-900/95 backdrop-blur-md p-3.5 rounded-xl border border-neutral-700 text-white shadow-xl animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-400">
                  {isGunungkidul ? hoveredUnit.kapanewon : hoveredUnit.NAMOBJ}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-neutral-800 text-white border border-neutral-700">
                  Rank #{hoveredUnit.rank}
                </span>
              </div>

              <div className="mt-2 space-y-1 text-xs text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-400">SDFVI–Proxy:</span>
                  <span className="font-mono font-bold text-white">{hoveredUnit.SDFVI_proxy.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Kategori:</span>
                  <span className="font-semibold text-orange-400">{hoveredUnit.priority_category}</span>
                </div>

                {isGunungkidul ? (
                  <>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-neutral-400">L1 (ADK & Lansia):</span>
                      <span className="font-mono">{hoveredUnit.L1_social_sensitivity.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-neutral-400">H (CHIRPS Defisit):</span>
                      <span className="font-mono">{hoveredUnit.H_meteorological_hazard.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-neutral-400">F_area (Defisit Luas):</span>
                      <span className="font-mono">{hoveredUnit.F_area_land_deficit_proxy.toFixed(4)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-neutral-400">S_i (Gender 60+):</span>
                      <span className="font-mono">{hoveredUnit.S_i.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-neutral-400">CHIRPS Kemarau 2023:</span>
                      <span className="font-mono">{hoveredUnit.chirps_total_mm.toFixed(1)} mm</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-neutral-400">Luas Sawah:</span>
                      <span className="font-mono">{hoveredUnit.sawah_total_ha.toLocaleString('id-ID')} ha</span>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-2.5 pt-2 border-t border-neutral-700/80 text-[10px] text-neutral-400 flex items-center justify-between">
                <span>Klik untuk membuka profil penuh</span>
                <span className="text-emerald-400">Detail →</span>
              </div>
            </div>
          )}

          {/* Dynamic Map Legend Overlay (Bottom Right) */}
          <div className="absolute bottom-4 right-4 z-20 bg-neutral-900/90 backdrop-blur-md p-3 rounded-xl border border-neutral-700 text-xs text-white shadow-xl">
            <div className="font-semibold text-[11px] text-neutral-400 mb-1.5">
              {isGunungkidul && 'Prioritas Relatif SDFVI–Proxy'}
              {!isGunungkidul && solokMetricLayer === 'sdfvi' && 'Legenda SDFVI Proxy Solok'}
              {!isGunungkidul && solokMetricLayer === 'chirps' && 'Legenda Defisit Presipitasi'}
              {!isGunungkidul && solokMetricLayer === 'sawah' && 'Legenda Luas Sawah (ha)'}
              {!isGunungkidul && solokMetricLayer === 'gender' && 'Legenda Sensitivitas Gender'}
            </div>

            {isGunungkidul ? (
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded shadow-xs" style={{ backgroundColor: getCategoryHexColor('Sangat Tinggi', colorTheme) }} />
                  <span>Sangat Tinggi (0.8000–1.0000)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded shadow-xs" style={{ backgroundColor: getCategoryHexColor('Tinggi', colorTheme) }} />
                  <span>Tinggi (0.6000–0.7999)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded shadow-xs border border-amber-300/40" style={{ backgroundColor: getCategoryHexColor('Sedang', colorTheme) }} />
                  <span>Sedang (0.4000–0.5999)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded shadow-xs" style={{ backgroundColor: getCategoryHexColor('Rendah', colorTheme) }} />
                  <span>Rendah (0.0000–0.3999)</span>
                </div>
              </div>
            ) : solokMetricLayer === 'sdfvi' ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded" style={{ backgroundColor: getCategoryHexColor('Tinggi', colorTheme) }} />
                  <span>Tinggi (Prioritas Utama)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded" style={{ backgroundColor: getCategoryHexColor('Sedang', colorTheme) }} />
                  <span>Sedang (Prioritas Menengah)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded" style={{ backgroundColor: getCategoryHexColor('Rendah', colorTheme) }} />
                  <span>Rendah (Prioritas Dasar)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded" style={{ backgroundColor: getCategoryHexColor('Terendah', colorTheme) }} />
                  <span>Terendah</span>
                </div>
              </div>
            ) : solokMetricLayer === 'chirps' ? (
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-700" /><span>Terkering (&lt; 500 mm / H_i &gt; 0.8)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-orange-600" /><span>Kering (500–600 mm)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500" /><span>Moderat (600–700 mm)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-500" /><span>Relatif Basah (&gt; 700 mm)</span></div>
              </div>
            ) : solokMetricLayer === 'sawah' ? (
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-800" /><span>Sangat Luas (&gt; 2.500 ha)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-600" /><span>Luas (1.200–2.500 ha)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-400" /><span>Sedang (500–1.200 ha)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-slate-400" /><span>Sempit (&lt; 500 ha)</span></div>
              </div>
            ) : (
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-700" /><span>Sensitivitas Tinggi (S_i &gt; 0.7)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-500" /><span>Moderat (0.4–0.7)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-300" /><span>Rendah (&lt; 0.4)</span></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Accessible Table Mode */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700/40 font-semibold text-neutral-600 dark:text-neutral-300">
                  <th className="py-2.5 px-3 text-center w-16">Peringkat</th>
                  <th className="py-2.5 px-3">{isGunungkidul ? 'Kapanewon' : 'Kecamatan'}</th>
                  <th className="py-2.5 px-3 text-right">Skor SDFVI–Proxy</th>
                  <th className="py-2.5 px-3 text-center">Kategori Prioritas</th>
                  {isGunungkidul ? (
                    <>
                      <th className="py-2.5 px-3 text-right">L1 (Sensitivitas)</th>
                      <th className="py-2.5 px-3 text-right">H (Bahaya Met.)</th>
                      <th className="py-2.5 px-3 text-right">F_area (Defisit Luas)</th>
                    </>
                  ) : (
                    <>
                      <th className="py-2.5 px-3 text-right">S_i (Gender 60+)</th>
                      <th className="py-2.5 px-3 text-right">H_i (CHIRPS 2023)</th>
                      <th className="py-2.5 px-3 text-right">E_i (Luas Sawah)</th>
                    </>
                  )}
                  <th className="py-2.5 px-3 text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/60">
                {isGunungkidul ? (
                  data.map(item => {
                    const badgeClass = getCategoryBadgeClasses(item.priority_category, colorTheme);
                    return (
                      <tr key={item.kapanewon} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/30">
                        <td className="py-2.5 px-3 text-center font-bold text-neutral-700 dark:text-neutral-300">
                          #{item.rank}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-white">
                          {item.kapanewon}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold">
                          {item.SDFVI_proxy.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}>
                            {item.priority_category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-neutral-600 dark:text-neutral-400">
                          {item.L1_social_sensitivity.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-neutral-600 dark:text-neutral-400">
                          {item.H_meteorological_hazard.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-neutral-600 dark:text-neutral-400">
                          {item.F_area_land_deficit_proxy.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => onSelectKapanewon(item)}
                            className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                          >
                            Rincian
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  solokList.map(item => {
                    const badgeClass = getCategoryBadgeClasses(item.priority_category, colorTheme);
                    return (
                      <tr key={item.NAMOBJ} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/30">
                        <td className="py-2.5 px-3 text-center font-bold text-neutral-700 dark:text-neutral-300">
                          #{item.rank}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-white">
                          {item.NAMOBJ}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold">
                          {item.SDFVI_proxy.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}>
                            {item.priority_category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-neutral-600 dark:text-neutral-400">
                          {item.S_i.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-neutral-600 dark:text-neutral-400">
                          {item.H_i.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-neutral-600 dark:text-neutral-400">
                          {item.E_i.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => onSelectKapanewon(item)}
                            className="text-xs text-blue-700 dark:text-blue-400 font-semibold hover:underline"
                          >
                            Rincian
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
