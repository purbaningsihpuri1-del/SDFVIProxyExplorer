import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  Users,
  Upload
} from 'lucide-react';
import { KapanewonData, SolokKecamatanData, ColorTheme, PriorityCategory, PilotRegion } from '../types';
import { GUNUNGKIDUL_OFFICIAL_GEOJSON } from '../data/sampleGunungkidulGeoJson';
import { SOLOK_OFFICIAL_GEOJSON } from '../data/sampleSolokGeoJson';
import { PUBLISHED_SOLOK_DATA } from '../data/solokBaselineData';
import { getCategoryHexColor, getCategoryBadgeClasses } from '../utils/calculations';
import gkThematicMapImg from '../assets/images/gunungkidul_thematic_map.jpg';
import solokThematicMapImg from '../assets/images/solok_thematic_map.jpg';

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

// Spatial Hotspot Coordinates for Solok Thematic Map (Calibrated to SUT2026 GIS Layout)
const SOLOK_HOTSPOTS = [
  { name: 'X Koto Diatas', leftPct: 21.0, topPct: 14.5 },
  { name: 'Junjung Sirih', leftPct: 11.5, topPct: 22.0 },
  { name: 'X Koto Singkarak', leftPct: 18.0, topPct: 22.5 },
  { name: 'Kubung', leftPct: 22.5, topPct: 34.0 },
  { name: 'Ix Koto Sungai Lasi', leftPct: 30.0, topPct: 33.5 },
  { name: 'Bukit Sundi', leftPct: 26.0, topPct: 46.0 },
  { name: 'Payung Sekaki', leftPct: 33.0, topPct: 48.0 },
  { name: 'Gunung Talang', leftPct: 19.5, topPct: 54.0 },
  { name: 'Lembang Jaya', leftPct: 27.5, topPct: 56.5 },
  { name: 'Tigo Lurah', leftPct: 50.0, topPct: 62.0 },
  { name: 'Danau Kembar', leftPct: 27.0, topPct: 66.0 },
  { name: 'Lembah Gumanti', leftPct: 33.0, topPct: 74.0 },
  { name: 'Hiliran Gumanti', leftPct: 41.5, topPct: 76.5 },
  { name: 'Pantai Cermin', leftPct: 39.0, topPct: 88.0 },
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
  const [mapLayerMode, setMapLayerMode] = useState<'satellite' | 'vector'>('satellite');
  const [solokMetricLayer, setSolokMetricLayer] = useState<'sdfvi' | 'chirps' | 'sawah' | 'gender'>('sdfvi');
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  
  // Interactive states
  const [hoveredUnit, setHoveredUnit] = useState<any | null>(null);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showPins, setShowPins] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Custom User Uploaded Solok Thematic Map (SUT 2026)
  const [customSolokMapImg, setCustomSolokMapImg] = useState<string | null>(() => {
    try {
      return localStorage.getItem('sdfvi_custom_solok_map_v1') || null;
    } catch {
      return null;
    }
  });
  const solokFileInputRef = useRef<HTMLInputElement>(null);

  const handleSolokImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const res = evt.target?.result as string;
      if (res) {
        setCustomSolokMapImg(res);
        try {
          localStorage.setItem('sdfvi_custom_solok_map_v1', res);
        } catch (err) {
          console.warn('Storage quota warning, keeping in active session state', err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetSolokImage = () => {
    setCustomSolokMapImg(null);
    try {
      localStorage.removeItem('sdfvi_custom_solok_map_v1');
    } catch {}
  };
  
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Clear hover state when switching pilots
  useEffect(() => {
    setHoveredUnit(null);
  }, [currentPilot]);

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
      <div className="bg-white dark:bg-[#1E293B] border-2 border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#15803D]/20 dark:bg-[#15803D]/30 text-[#14532D] dark:text-[#4ADE80] border border-[#15803D]/30">
                <MapIcon className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
                {isGunungkidul 
                  ? 'Peta Spasial Georeferensi Kapanewon Gunungkidul' 
                  : 'Peta Spasial Tematik Kecamatan Kabupaten Solok'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] mt-1.5 font-medium leading-relaxed">
              {isGunungkidul
                ? 'Visualisasi spasial 18 unit poligon administratif karst Gunungkidul dengan citra satelit dan pin hotspot.'
                : 'Visualisasi spasial 14 kecamatan Kabupaten Solok dengan peta citra satelit tematik, data curah hujan CHIRPS kemarau 2023, dan sentra padi sawah.'}
            </p>
          </div>

          {/* Pilot Switcher & View Mode Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Quick Pilot Switcher */}
            {onSwitchPilot && (
              <div className="flex items-center bg-[#F1F5F9] dark:bg-[#0F172A] p-1 rounded-xl border border-black/10 dark:border-white/10 text-xs sm:text-sm font-bold">
                <button
                  id="map-btn-gk"
                  onClick={() => onSwitchPilot('gunungkidul')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    isGunungkidul ? 'bg-[#15803D] text-white shadow-xs' : 'text-[#334155] dark:text-[#CBD5E1] hover:text-black dark:hover:text-white'
                  }`}
                >
                  Gunungkidul
                </button>
                <button
                  id="map-btn-solok"
                  onClick={() => onSwitchPilot('solok')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    !isGunungkidul ? 'bg-[#0055D4] text-white shadow-xs' : 'text-[#334155] dark:text-[#CBD5E1] hover:text-black dark:hover:text-white'
                  }`}
                >
                  Solok
                </button>
              </div>
            )}

            {/* Layer Mode: Satellite/Thematic Image vs Vector SVG (Available for both Gunungkidul & Solok) */}
            <div className="flex items-center bg-[#F1F5F9] dark:bg-[#0F172A] p-1 rounded-xl border border-black/10 dark:border-white/10 text-xs sm:text-sm font-bold">
              <button
                id="btn-layer-satellite"
                onClick={() => setMapLayerMode('satellite')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  mapLayerMode === 'satellite'
                    ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-white font-extrabold shadow-xs border border-black/10 dark:border-white/10'
                    : 'text-[#334155] dark:text-[#CBD5E1]'
                }`}
              >
                <Satellite className="w-4 h-4 text-[#15803D] dark:text-[#4ADE80]" />
                <span>Citra Spasial</span>
              </button>
              <button
                id="btn-layer-vector"
                onClick={() => setMapLayerMode('vector')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  mapLayerMode === 'vector'
                    ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-white font-extrabold shadow-xs border border-black/10 dark:border-white/10'
                    : 'text-[#334155] dark:text-[#CBD5E1]'
                }`}
              >
                <Layers className="w-4 h-4 text-[#0055D4] dark:text-[#60A5FA]" />
                <span>Vektor SVG</span>
              </button>
            </div>

            {/* Solok Metric Sub-layers when in Vector mode */}
            {!isGunungkidul && mapLayerMode === 'vector' && (
              <div className="flex items-center bg-[#F1F5F9] dark:bg-[#0F172A] p-1 rounded-xl border border-black/10 dark:border-white/10 text-xs sm:text-sm font-bold overflow-x-auto">
                <span className="text-xs text-[#475569] dark:text-[#94A3B8] px-2 font-extrabold uppercase">Metrik:</span>
                <button
                  id="btn-solok-layer-sdfvi"
                  onClick={() => setSolokMetricLayer('sdfvi')}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                    solokMetricLayer === 'sdfvi'
                      ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-white font-black shadow-xs border border-black/10 dark:border-white/10'
                      : 'text-[#334155] dark:text-[#CBD5E1]'
                  }`}
                >
                  SDFVI Proxy
                </button>
                <button
                  id="btn-solok-layer-chirps"
                  onClick={() => setSolokMetricLayer('chirps')}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                    solokMetricLayer === 'chirps'
                      ? 'bg-white dark:bg-[#1E293B] text-[#9A3412] dark:text-[#FDBA74] font-black shadow-xs border border-black/10 dark:border-white/10'
                      : 'text-[#334155] dark:text-[#CBD5E1]'
                  }`}
                >
                  Defisit CHIRPS
                </button>
                <button
                  id="btn-solok-layer-sawah"
                  onClick={() => setSolokMetricLayer('sawah')}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                    solokMetricLayer === 'sawah'
                      ? 'bg-white dark:bg-[#1E293B] text-[#15803D] dark:text-[#4ADE80] font-black shadow-xs border border-black/10 dark:border-white/10'
                      : 'text-[#334155] dark:text-[#CBD5E1]'
                  }`}
                >
                  Sawah (ha)
                </button>
                <button
                  id="btn-solok-layer-gender"
                  onClick={() => setSolokMetricLayer('gender')}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                    solokMetricLayer === 'gender'
                      ? 'bg-white dark:bg-[#1E293B] text-[#6B21A8] dark:text-[#D8B4FE] font-black shadow-xs border border-black/10 dark:border-white/10'
                      : 'text-[#334155] dark:text-[#CBD5E1]'
                  }`}
                >
                  Sensitivitas Gender
                </button>
              </div>
            )}

            {/* Toggle Table Accessibility Mode */}
            <div className="flex items-center bg-[#F1F5F9] dark:bg-[#0F172A] p-1 rounded-xl border border-black/10 dark:border-white/10 text-xs sm:text-sm font-bold">
              <button
                id="btn-view-map"
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  viewMode === 'map' ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-white font-black shadow-xs border border-black/10 dark:border-white/10' : 'text-[#334155] dark:text-[#CBD5E1]'
                }`}
                title="Tampilan Peta Grafis"
              >
                Peta
              </button>
              <button
                id="btn-view-table"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-white font-black shadow-xs border border-black/10 dark:border-white/10' : 'text-[#334155] dark:text-[#CBD5E1]'
                }`}
                title="Tampilan Tabel Aksesibel"
              >
                Tabel
              </button>
            </div>

            {/* Direct Solok Thematic Map Image Picker (SUT 2026) */}
            {!isGunungkidul && (
              <div className="flex items-center gap-1.5 bg-[#F1F5F9] dark:bg-[#0F172A] p-1 rounded-xl border border-black/10 dark:border-white/10">
                <input 
                  type="file" 
                  ref={solokFileInputRef} 
                  onChange={handleSolokImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                  id="solok-map-file-picker" 
                />
                <button
                  id="btn-upload-solok-map"
                  onClick={() => solokFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0055D4] text-white hover:bg-[#00409A] text-xs sm:text-sm font-bold transition-all shadow-xs"
                  title="Pilih dan pasang berkas gambar peta SDFVI Solok SUT 2026 langsung dari perangkat Anda"
                >
                  <Upload className="w-4 h-4" />
                  <span>{customSolokMapImg ? 'Ganti Peta SUT 2026' : 'Gunakan Peta Solok SUT 2026'}</span>
                </button>
                {customSolokMapImg && (
                  <button
                    onClick={handleResetSolokImage}
                    className="px-2 py-1.5 rounded-lg border border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold"
                    title="Kembalikan ke citra bawaan"
                  >
                    Reset
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Solok Custom Map Notice Banner */}
      {!isGunungkidul && (
        <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl p-3 flex items-start gap-2.5 text-xs text-sky-900 dark:text-sky-200">
          <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">
              {customSolokMapImg 
                ? 'Berkas Peta Solok SUT 2026 Anda sedang aktif ditampilkan.' 
                : 'Peta Tematik Spasial Solok SUT 2026:'}
            </p>
            <p className="text-sky-700 dark:text-sky-300 mt-0.5 leading-relaxed">
              {customSolokMapImg
                ? 'Peta berasal langsung dari berkas gambar yang Anda pasang. Anda dapat mengganti atau meresetnya sewaktu-waktu.'
                : 'Klik tombol "Gunakan Peta Solok SUT 2026" di atas untuk memasang berkas citra peta resmi Anda (JPG/PNG) langsung dari perangkat Anda, atau beralih ke tab "Vektor SVG" untuk analisis spasial 14 kecamatan.'}
            </p>
          </div>
        </div>
      )}

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
          <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-[#0F172A]/95 backdrop-blur-md px-3.5 py-2 rounded-xl border-2 border-white/20 text-xs sm:text-sm font-bold text-white shadow-xl">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={showLabels} 
                onChange={e => setShowLabels(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              <span>Tampilkan Label</span>
            </label>
            <span className="text-white/40">|</span>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={showPins} 
                onChange={e => setShowPins(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              <span>Pin Hotspot</span>
            </label>
          </div>

          {/* Visual Display Container */}
          <div 
            className="w-full h-full min-h-[580px] flex items-center justify-center p-4 overflow-auto"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
          >
            {mapLayerMode === 'satellite' ? (
              /* Satellite / Spatial Thematic Map with Interactive Pins (Gunungkidul & Solok) */
              <div className="relative max-w-4xl w-full mx-auto rounded-xl overflow-hidden shadow-2xl border-2 border-neutral-700 bg-neutral-950">
                {/* Active Custom User Map Badge */}
                {!isGunungkidul && customSolokMapImg && (
                  <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-[#0055D4] text-white text-[11px] font-black shadow-lg border border-white/40 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Peta Solok SUT 2026 Pengguna Aktif</span>
                  </div>
                )}

                <img 
                  src={isGunungkidul ? gkThematicMapImg : (customSolokMapImg || solokThematicMapImg)} 
                  alt={isGunungkidul 
                    ? "SDFVI–Proxy Peta Spasial Georeferensi Kapanewon Gunungkidul" 
                    : "SDFVI–Proxy Peta Tematik Spasial Citra Satelit Kecamatan Kabupaten Solok"} 
                  className="w-full h-auto block select-none"
                  referrerPolicy="no-referrer"
                />

                {/* Hotspot Pins Overlay */}
                {showPins && (isGunungkidul ? GK_HOTSPOTS : SOLOK_HOTSPOTS).map((pin) => {
                  const record = dataMap.get(pin.name.toLowerCase().trim());
                  if (!record) return null;
                  const unitName = isGunungkidul ? record.kapanewon : record.NAMOBJ;
                  const isHovered = hoveredUnit && (
                    isGunungkidul 
                      ? hoveredUnit.kapanewon === record.kapanewon 
                      : hoveredUnit.NAMOBJ === record.NAMOBJ
                  );
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
                        className={`flex items-center justify-center rounded-full transition-transform border-2 border-white shadow-xl ${
                          isHovered ? 'scale-130 ring-4 ring-yellow-400' : 'scale-100 hover:scale-120'
                        }`}
                        style={{ backgroundColor: badgeColor, width: '26px', height: '26px' }}
                      >
                        <span className="text-xs font-black text-white drop-shadow-sm">#{record.rank}</span>
                      </div>

                      {showLabels && (
                        <div className="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-[#0F172A]/95 text-white text-xs font-black pointer-events-none shadow-xl border border-white/40">
                          {unitName}
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
                <rect width={svgWidth} height={svgHeight} fill="#0F172A" rx="16" />

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
                        fillOpacity={isHovered ? 1 : 0.85}
                        stroke={isHovered ? '#ffffff' : '#0f172a'}
                        strokeWidth={isHovered ? 3 : 1.5}
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
                      stroke="#0F172A"
                      strokeWidth="3.5"
                      paintOrder="stroke fill"
                      fontSize={isGunungkidul ? "11px" : "10px"}
                      fontWeight="800"
                      className="pointer-events-none select-none tracking-tight"
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
            <div className="absolute bottom-4 left-4 z-20 max-w-sm w-full bg-[#0F172A]/95 backdrop-blur-md p-4 rounded-2xl border-2 border-white/20 text-white shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-base text-[#4ADE80]">
                  {isGunungkidul ? hoveredUnit.kapanewon : hoveredUnit.NAMOBJ}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-md font-extrabold bg-white text-[#0F172A] shadow-xs">
                  Rank #{hoveredUnit.rank}
                </span>
              </div>

              <div className="mt-2.5 space-y-1.5 text-xs sm:text-sm text-[#CBD5E1]">
                <div className="flex justify-between items-center">
                  <span className="text-[#94A3B8] font-bold">SDFVI–Proxy:</span>
                  <span className="font-mono font-black text-white text-sm sm:text-base">{hoveredUnit.SDFVI_proxy?.toFixed(4) ?? '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#94A3B8] font-bold">Kategori:</span>
                  <span className="font-bold text-amber-300">{hoveredUnit.priority_category ?? '-'}</span>
                </div>

                {isGunungkidul ? (
                  <>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#94A3B8]" title="Sensitivitas Sosial: Anak Dengan Kedisabilitasan (ADK) & Lansia Terlantar">L1 (ADK & Lansia):</span>
                      <span className="font-mono font-bold text-white">{hoveredUnit.L1_social_sensitivity?.toFixed(4) ?? '-'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#94A3B8]">H (CHIRPS Defisit):</span>
                      <span className="font-mono font-bold text-white">{hoveredUnit.H_meteorological_hazard?.toFixed(4) ?? '-'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#94A3B8]">F_area (Defisit Luas):</span>
                      <span className="font-mono font-bold text-white">{hoveredUnit.F_area_land_deficit_proxy?.toFixed(4) ?? '-'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#94A3B8]">S_i (Gender 60+):</span>
                      <span className="font-mono font-bold text-white">{hoveredUnit.S_i?.toFixed(4) ?? '-'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#94A3B8]">CHIRPS Kemarau 2023:</span>
                      <span className="font-mono font-bold text-white">{hoveredUnit.chirps_total_mm !== undefined ? `${hoveredUnit.chirps_total_mm.toFixed(1)} mm` : '-'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#94A3B8]">Luas Sawah:</span>
                      <span className="font-mono font-bold text-white">{hoveredUnit.sawah_total_ha !== undefined ? `${hoveredUnit.sawah_total_ha.toLocaleString('id-ID')} ha` : '-'}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-neutral-700 text-xs text-[#CBD5E1] flex items-center justify-between font-bold">
                <span>Klik untuk membuka profil penuh</span>
                <span className="text-[#4ADE80] font-black">Detail →</span>
              </div>
            </div>
          )}

          {/* Dynamic Map Legend Overlay (Bottom Right) */}
          <div className="absolute bottom-4 right-4 z-20 bg-[#0F172A]/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-white/20 text-xs sm:text-sm text-white shadow-2xl">
            <div className="font-extrabold text-xs text-slate-300 uppercase tracking-wider mb-2">
              {isGunungkidul && 'Prioritas Relatif SDFVI–Proxy'}
              {!isGunungkidul && (mapLayerMode === 'satellite' || solokMetricLayer === 'sdfvi') && 'SDFVI-Proxy Index (SUT 2026)'}
              {!isGunungkidul && mapLayerMode === 'vector' && solokMetricLayer === 'chirps' && 'Legenda Defisit Presipitasi'}
              {!isGunungkidul && mapLayerMode === 'vector' && solokMetricLayer === 'sawah' && 'Legenda Luas Sawah (ha)'}
              {!isGunungkidul && mapLayerMode === 'vector' && solokMetricLayer === 'gender' && 'Legenda Sensitivitas Gender'}
            </div>

            {isGunungkidul ? (
              <div className="space-y-1.5 text-xs font-bold">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded border border-white/50 shadow-xs" style={{ backgroundColor: getCategoryHexColor('Sangat Tinggi', colorTheme) }} />
                  <span>Sangat Tinggi (0.8000–1.0000)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded border border-white/50 shadow-xs" style={{ backgroundColor: getCategoryHexColor('Tinggi', colorTheme) }} />
                  <span>Tinggi (0.6000–0.7999)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded border border-white/50 shadow-xs" style={{ backgroundColor: getCategoryHexColor('Sedang', colorTheme) }} />
                  <span>Sedang (0.4000–0.5999)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded border border-white/50 shadow-xs" style={{ backgroundColor: getCategoryHexColor('Rendah', colorTheme) }} />
                  <span>Rendah (0.0000–0.3999)</span>
                </div>
              </div>
            ) : (mapLayerMode === 'satellite' || solokMetricLayer === 'sdfvi') ? (
              <div className="space-y-1.5 text-xs font-bold">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded border border-white/50 shadow-xs" style={{ backgroundColor: getCategoryHexColor('Sangat Tinggi', colorTheme) }} />
                  <span>Sangat tinggi — prioritas intervensi relatif</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded border border-white/50 shadow-xs" style={{ backgroundColor: getCategoryHexColor('Tinggi', colorTheme) }} />
                  <span>Tinggi — prioritas intervensi relatif</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded border border-white/50 shadow-xs" style={{ backgroundColor: getCategoryHexColor('Sedang', colorTheme) }} />
                  <span>Sedang — prioritas intervensi relatif</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded border border-white/50 shadow-xs" style={{ backgroundColor: getCategoryHexColor('Rendah', colorTheme) }} />
                  <span>Rendah — prioritas intervensi relatif</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded border border-white/50 shadow-xs" style={{ backgroundColor: getCategoryHexColor('Terendah', colorTheme) }} />
                  <span>Terendah — prioritas relatif</span>
                </div>
              </div>
            ) : solokMetricLayer === 'chirps' ? (
              <div className="space-y-1.5 text-xs font-bold">
                <div className="flex items-center gap-2.5"><span className="w-3.5 h-3.5 rounded border border-white/50 bg-red-700" /><span>Terkering (&lt; 500 mm / H_i &gt; 0.8)</span></div>
                <div className="flex items-center gap-2.5"><span className="w-3.5 h-3.5 rounded border border-white/50 bg-orange-600" /><span>Kering (500–600 mm)</span></div>
                <div className="flex items-center gap-2.5"><span className="w-3.5 h-3.5 rounded border border-white/50 bg-amber-500" /><span>Moderat (600–700 mm)</span></div>
                <div className="flex items-center gap-2.5"><span className="w-3.5 h-3.5 rounded border border-white/50 bg-blue-500" /><span>Relatif Basah (&gt; 700 mm)</span></div>
              </div>
            ) : solokMetricLayer === 'sawah' ? (
              <div className="space-y-1.5 text-xs font-bold">
                <div className="flex items-center gap-2.5"><span className="w-3.5 h-3.5 rounded border border-white/50 bg-emerald-800" /><span>Sangat Luas (&gt; 2.500 ha)</span></div>
                <div className="flex items-center gap-2.5"><span className="w-3.5 h-3.5 rounded border border-white/50 bg-emerald-600" /><span>Luas (1.200–2.500 ha)</span></div>
                <div className="flex items-center gap-2.5"><span className="w-3.5 h-3.5 rounded border border-white/50 bg-emerald-400" /><span>Sedang (500–1.200 ha)</span></div>
                <div className="flex items-center gap-2.5"><span className="w-3.5 h-3.5 rounded border border-white/50 bg-slate-400" /><span>Sempit (&lt; 500 ha)</span></div>
              </div>
            ) : (
              <div className="space-y-1.5 text-xs font-bold">
                <div className="flex items-center gap-2.5"><span className="w-3.5 h-3.5 rounded border border-white/50 bg-purple-700" /><span>Sensitivitas Tinggi (S_i &gt; 0.7)</span></div>
                <div className="flex items-center gap-2.5"><span className="w-3.5 h-3.5 rounded border border-white/50 bg-purple-500" /><span>Moderat (0.4–0.7)</span></div>
                <div className="flex items-center gap-2.5"><span className="w-3.5 h-3.5 rounded border border-white/50 bg-purple-300" /><span>Rendah (&lt; 0.4)</span></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Accessible Table Mode */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-[#1E293B] border-2 border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-5 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm sm:text-base">
              <thead>
                <tr className="border-b-2 border-black/[0.08] dark:border-white/[0.12] bg-[#F1F5F9] dark:bg-[#0F172A] font-extrabold text-[#0F172A] dark:text-white">
                  <th className="py-3.5 px-4 text-center w-20">Peringkat</th>
                  <th className="py-3.5 px-4">{isGunungkidul ? 'Kapanewon' : 'Kecamatan'}</th>
                  <th className="py-3.5 px-4 text-right">Skor SDFVI–Proxy</th>
                  <th className="py-3.5 px-4 text-center">Kategori Prioritas</th>
                  {isGunungkidul ? (
                    <>
                      <th className="py-3.5 px-4 text-right">L1 (Sensitivitas)</th>
                      <th className="py-3.5 px-4 text-right">H (Bahaya Met.)</th>
                      <th className="py-3.5 px-4 text-right">F_area (Defisit Luas)</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3.5 px-4 text-right">S_i (Gender 60+)</th>
                      <th className="py-3.5 px-4 text-right">H_i (CHIRPS 2023)</th>
                      <th className="py-3.5 px-4 text-right">E_i (Luas Sawah)</th>
                    </>
                  )}
                  <th className="py-3.5 px-4 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.08]">
                {isGunungkidul ? (
                  data.map(item => {
                    const badgeClass = getCategoryBadgeClasses(item.priority_category, colorTheme);
                    return (
                      <tr key={item.kapanewon} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="py-3 px-4 text-center font-black text-[#0F172A] dark:text-white">
                          #{item.rank}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#0F172A] dark:text-white">
                          {item.kapanewon}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-black text-[#0F172A] dark:text-white">
                          {item.SDFVI_proxy?.toFixed(4) ?? '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeClass}`}>
                            {item.priority_category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-[#334155] dark:text-[#CBD5E1]">
                          {item.L1_social_sensitivity?.toFixed(4) ?? '-'}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-[#334155] dark:text-[#CBD5E1]">
                          {item.H_meteorological_hazard?.toFixed(4) ?? '-'}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-[#334155] dark:text-[#CBD5E1]">
                          {item.F_area_land_deficit_proxy?.toFixed(4) ?? '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => onSelectKapanewon(item)}
                            className="text-xs sm:text-sm text-[#15803D] dark:text-[#4ADE80] font-black hover:underline"
                          >
                            Buka Profil →
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  solokList.map(item => {
                    const badgeClass = getCategoryBadgeClasses(item.priority_category, colorTheme);
                    return (
                      <tr key={item.NAMOBJ} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="py-3 px-4 text-center font-black text-[#0F172A] dark:text-white">
                          #{item.rank}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#0F172A] dark:text-white">
                          {item.NAMOBJ}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-black text-[#0F172A] dark:text-white">
                          {item.SDFVI_proxy?.toFixed(4) ?? '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeClass}`}>
                            {item.priority_category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-[#334155] dark:text-[#CBD5E1]">
                          {item.S_i?.toFixed(4) ?? '-'}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-[#334155] dark:text-[#CBD5E1]">
                          {item.H_i?.toFixed(4) ?? '-'}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-[#334155] dark:text-[#CBD5E1]">
                          {item.E_i?.toFixed(4) ?? '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => onSelectKapanewon(item)}
                            className="text-xs sm:text-sm text-[#0055D4] dark:text-[#60A5FA] font-black hover:underline"
                          >
                            Buka Profil →
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
