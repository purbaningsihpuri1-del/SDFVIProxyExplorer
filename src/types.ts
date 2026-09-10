export type PriorityCategory = 'Terendah' | 'Rendah' | 'Sedang' | 'Tinggi' | 'Sangat Tinggi';

export type PilotRegion = 'gunungkidul' | 'solok';

export interface KapanewonData {
  kapanewon: string;
  population_2024: number;
  ADK_2024: number;
  neglected_older_persons_2023: number;
  ADK_per_1000: number;
  neglected_older_persons_per_1000: number;
  normalized_ADK_score: number;
  normalized_older_person_score: number;
  L1_social_sensitivity: number;
  precipitation_2015: number;
  precipitation_2016_reference: number;
  precipitation_2019: number;
  precipitation_2024: number;
  mean_precipitation_benchmark: number;
  H_meteorological_hazard: number;
  maize_harvest_area_2023: number;
  cassava_harvest_area_2023: number;
  combined_harvest_area: number;
  harvest_area_per_1000_population: number;
  F_area_land_deficit_proxy: number;
  SDFVI_proxy: number;
  recalculated_SDFVI?: number;
  is_recalculated_match?: boolean;
  priority_category: PriorityCategory;
  rank: number;
}

export interface SolokKecamatanData {
  NAMOBJ: string;
  chirps_total_mm: number;
  S_i: number; // Social sensitivity: Women 60+ without formal education per 1,000 females
  sawah_total_ha: number; // Total rice paddy area (ha)
  H_i: number; // Hazard index: CHIRPS precipitation deficit (Jun-Oct 2023)
  E_i: number; // Exposure index: Rice paddy area per capita
  SDFVI_proxy: number; // Composite vulnerability score: (S_i + H_i + E_i) / 3
  rank: number;
  priority_category: PriorityCategory;
  population_approx?: number;
  female_population_approx?: number;
  women_60plus_no_edu?: number;
  elevation_masl?: number;
  dominant_rice_variety?: string;
  sub_basin?: string;
}

export interface BiocharKapanewonData {
  kapanewon: string;
  latitude: number;
  longitude: number;
  isHotspotKritis: boolean;
  deltaMmOptimistis: number; // mm
  equivalentVolumeML: number; // Megaliter (ML)
  konservatifWHC: number; // +5% WHC (mm)
  moderatWHC: number; // +15% WHC (mm)
  optimistisWHC: number; // +25% WHC (mm)
}

export interface ContextualData {
  kapanewon: string;
  geographic_zone: 'Karst upland' | 'Coastal' | 'Riverine' | 'Highland valley' | 'Mixed';
  geographic_zone_detail: string;
  population_scale: 'Small (<30k)' | 'Medium (30-50k)' | 'Large (>50k)';
  economic_specialization: 'Palawija dominant' | 'Rice/sawah dominant' | 'Tourism/services' | 'Mixed agriculture' | 'Other';
  economic_detail: string;
  dominant_hazard: 'Drought-prone' | 'Flood-prone' | 'Mixed hazards';
  dominant_hazard_detail: string;
  water_source_context: string;
}

export interface DataQualityReport {
  totalUnits: number;
  allPresent: boolean;
  missingValuesCount: number;
  duplicateCount: number;
  zeroDenominatorsCount: number;
  recalculationDiscrepancies: Array<{
    name: string;
    uploadedScore: number;
    recalculatedScore: number;
    diff: number;
  }>;
  status: 'valid' | 'warning' | 'error';
  provenance: string;
}

export interface ColumnMapping {
  kapanewon?: string;
  population_2024?: string;
  ADK_2024?: string;
  neglected_older_persons_2023?: string;
  ADK_per_1000?: string;
  neglected_older_persons_per_1000?: string;
  normalized_ADK_score?: string;
  normalized_older_person_score?: string;
  L1_social_sensitivity?: string;
  precipitation_2015?: string;
  precipitation_2016_reference?: string;
  precipitation_2019?: string;
  precipitation_2024?: string;
  mean_precipitation_benchmark?: string;
  H_meteorological_hazard?: string;
  maize_harvest_area_2023?: string;
  cassava_harvest_area_2023?: string;
  combined_harvest_area?: string;
  harvest_area_per_1000_population?: string;
  F_area_land_deficit_proxy?: string;
  SDFVI_proxy?: string;
  priority_category?: string;
  rank?: string;
}

export type ColorTheme = 'standard' | 'colorblind' | 'high-contrast';

export type ActiveTab = 
  | 'overview'
  | 'map'
  | 'charts'
  | 'context'
  | 'biochar'
  | 'quality'
  | 'action_research'
  | 'policy'
  | 'methodology'
  | 'roadmap';
