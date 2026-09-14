import { KapanewonData, ColumnMapping } from '../types';
import { PUBLISHED_BASELINE_DATA } from '../data/baselineData';
import { getPriorityCategory, recalculateSDFVI } from './calculations';

export function parseCSVString(csvContent: string): { headers: string[]; rows: string[][] } {
  // Normalize newline characters
  const lines = csvContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const filteredLines = lines.map(line => line.trim()).filter(line => line.length > 0);

  if (filteredLines.length === 0) {
    return { headers: [], rows: [] };
  }

  // Detect delimiter: check comma vs semicolon vs tab in the first line
  const firstLine = filteredLines[0];
  let delimiter = ',';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  if (semicolonCount > commaCount && semicolonCount > tabCount) {
    delimiter = ';';
  } else if (tabCount > commaCount && tabCount > semicolonCount) {
    delimiter = '\t';
  }

  const parseLine = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values.map(v => v.replace(/^"|"$/g, '').trim());
  };

  const headers = parseLine(filteredLines[0]);
  const rows = filteredLines.slice(1).map(line => parseLine(line)).filter(r => r.length > 0 && r.some(c => c.length > 0));

  return { headers, rows };
}

export function autoDetectColumnMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {};

  const clean = (s: string) => s.toLowerCase().replace(/[\s\-_–—.]/g, '');

  headers.forEach(h => {
    const c = clean(h);

    if (c.includes('kapanewon') || c.includes('kecamatan') || c.includes('wilayah') || c.includes('subdistrict') || c === 'nama' || c === 'name') {
      if (!mapping.kapanewon) mapping.kapanewon = h;
    } else if (c.includes('sdfvi') || c.includes('proxy') || c.includes('skor') || c.includes('index') || c.includes('indeks')) {
      if (!mapping.SDFVI_proxy) mapping.SDFVI_proxy = h;
    } else if (c.includes('pop') || c.includes('penduduk')) {
      if (!mapping.population_2024) mapping.population_2024 = h;
    } else if (c.includes('adk') && !c.includes('per1000') && !c.includes('norm') && !c.includes('score')) {
      if (!mapping.ADK_2024) mapping.ADK_2024 = h;
    } else if ((c.includes('lansia') || c.includes('older') || c.includes('terlantar')) && !c.includes('per1000') && !c.includes('norm')) {
      if (!mapping.neglected_older_persons_2023) mapping.neglected_older_persons_2023 = h;
    } else if (c.includes('l1') || c.includes('social') || c.includes('sensitiv')) {
      if (!mapping.L1_social_sensitivity) mapping.L1_social_sensitivity = h;
    } else if (c.includes('2015')) {
      if (!mapping.precipitation_2015) mapping.precipitation_2015 = h;
    } else if (c.includes('2016')) {
      if (!mapping.precipitation_2016_reference) mapping.precipitation_2016_reference = h;
    } else if (c.includes('2019')) {
      if (!mapping.precipitation_2019) mapping.precipitation_2019 = h;
    } else if (c.includes('2024') && (c.includes('precip') || c.includes('curah') || c.includes('hujan'))) {
      if (!mapping.precipitation_2024) mapping.precipitation_2024 = h;
    } else if ((c === 'h' || c.includes('hazard') || c.includes('bahaya')) && !c.includes('mean')) {
      if (!mapping.H_meteorological_hazard) mapping.H_meteorological_hazard = h;
    } else if (c.includes('jagung') || c.includes('maize')) {
      if (!mapping.maize_harvest_area_2023) mapping.maize_harvest_area_2023 = h;
    } else if (c.includes('ubi') || c.includes('cassava') || c.includes('singkong')) {
      if (!mapping.cassava_harvest_area_2023) mapping.cassava_harvest_area_2023 = h;
    } else if (c.includes('farea') || c.includes('f_area') || (c.includes('defisit') && c.includes('lahan'))) {
      if (!mapping.F_area_land_deficit_proxy) mapping.F_area_land_deficit_proxy = h;
    } else if (c.includes('kategori') || c.includes('category') || c.includes('priority')) {
      if (!mapping.priority_category) mapping.priority_category = h;
    } else if (c.includes('rank') || c.includes('peringkat')) {
      if (!mapping.rank) mapping.rank = h;
    }
  });

  return mapping;
}

export function parseNumberIndonesian(val: string | undefined): number {
  if (!val) return 0;
  // If string contains comma as decimal separator (e.g., "0,7248" or "1.234,56")
  let clean = val.replace(/\s+/g, '');
  if (clean.includes(',') && clean.includes('.')) {
    // Indonesian format: dots are thousands, comma is decimal
    if (clean.indexOf('.') < clean.indexOf(',')) {
      clean = clean.replace(/\./g, '').replace(',', '.');
    } else {
      // English format: commas are thousands, dot is decimal
      clean = clean.replace(/,/g, '');
    }
  } else if (clean.includes(',')) {
    clean = clean.replace(',', '.');
  }
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export function convertParsedRowsToKapanewonData(
  headers: string[],
  rows: string[][],
  mapping: ColumnMapping
): KapanewonData[] {
  const getIndex = (mappedColName?: string): number => {
    if (!mappedColName) return -1;
    return headers.indexOf(mappedColName);
  };

  const kapanewonIdx = getIndex(mapping.kapanewon);
  const sdfviIdx = getIndex(mapping.SDFVI_proxy);
  const popIdx = getIndex(mapping.population_2024);
  const adkIdx = getIndex(mapping.ADK_2024);
  const olderIdx = getIndex(mapping.neglected_older_persons_2023);
  const l1Idx = getIndex(mapping.L1_social_sensitivity);
  const p15Idx = getIndex(mapping.precipitation_2015);
  const p16Idx = getIndex(mapping.precipitation_2016_reference);
  const p19Idx = getIndex(mapping.precipitation_2019);
  const p24Idx = getIndex(mapping.precipitation_2024);
  const hIdx = getIndex(mapping.H_meteorological_hazard);
  const maizeIdx = getIndex(mapping.maize_harvest_area_2023);
  const cassavaIdx = getIndex(mapping.cassava_harvest_area_2023);
  const fAreaIdx = getIndex(mapping.F_area_land_deficit_proxy);
  const rankIdx = getIndex(mapping.rank);

  const baselineMap = new Map(PUBLISHED_BASELINE_DATA.map(b => [b.kapanewon.toLowerCase(), b]));

  const result: KapanewonData[] = rows.map((row, rowIdx) => {
    const rawName = kapanewonIdx >= 0 ? (row[kapanewonIdx] || `Kapanewon ${rowIdx + 1}`) : `Kapanewon ${rowIdx + 1}`;
    const name = rawName.trim();
    const baseline = baselineMap.get(name.toLowerCase());

    const uploadedScore = sdfviIdx >= 0 ? parseNumberIndonesian(row[sdfviIdx]) : (baseline ? baseline.SDFVI_proxy : 0);

    const population = popIdx >= 0 ? parseNumberIndonesian(row[popIdx]) : (baseline ? baseline.population_2024 : 35000);
    const adk = adkIdx >= 0 ? parseNumberIndonesian(row[adkIdx]) : (baseline ? baseline.ADK_2024 : 60);
    const older = olderIdx >= 0 ? parseNumberIndonesian(row[olderIdx]) : (baseline ? baseline.neglected_older_persons_2023 : 110);
    const p15 = p15Idx >= 0 ? parseNumberIndonesian(row[p15Idx]) : (baseline ? baseline.precipitation_2015 : 110);
    const p16 = p16Idx >= 0 ? parseNumberIndonesian(row[p16Idx]) : (baseline ? baseline.precipitation_2016_reference : 280);
    const p19 = p19Idx >= 0 ? parseNumberIndonesian(row[p19Idx]) : (baseline ? baseline.precipitation_2019 : 98);
    const p24 = p24Idx >= 0 ? parseNumberIndonesian(row[p24Idx]) : (baseline ? baseline.precipitation_2024 : 106);
    const maize = maizeIdx >= 0 ? parseNumberIndonesian(row[maizeIdx]) : (baseline ? baseline.maize_harvest_area_2023 : 2500);
    const cassava = cassavaIdx >= 0 ? parseNumberIndonesian(row[cassavaIdx]) : (baseline ? baseline.cassava_harvest_area_2023 : 2000);

    const l1 = l1Idx >= 0 ? parseNumberIndonesian(row[l1Idx]) : (baseline ? baseline.L1_social_sensitivity : 0.5);
    const h = hIdx >= 0 ? parseNumberIndonesian(row[hIdx]) : (baseline ? baseline.H_meteorological_hazard : 0.5);
    const fArea = fAreaIdx >= 0 ? parseNumberIndonesian(row[fAreaIdx]) : (baseline ? baseline.F_area_land_deficit_proxy : 0.5);

    const category = getPriorityCategory(uploadedScore);

    return {
      kapanewon: name,
      population_2024: population,
      ADK_2024: adk,
      neglected_older_persons_2023: older,
      ADK_per_1000: baseline ? baseline.ADK_per_1000 : (adk / population) * 1000,
      neglected_older_persons_per_1000: baseline ? baseline.neglected_older_persons_per_1000 : (older / population) * 1000,
      normalized_ADK_score: baseline ? baseline.normalized_ADK_score : 0.5,
      normalized_older_person_score: baseline ? baseline.normalized_older_person_score : 0.5,
      L1_social_sensitivity: l1,
      precipitation_2015: p15,
      precipitation_2016_reference: p16,
      precipitation_2019: p19,
      precipitation_2024: p24,
      mean_precipitation_benchmark: (p15 + p19 + p24) / 3,
      H_meteorological_hazard: h,
      maize_harvest_area_2023: maize,
      cassava_harvest_area_2023: cassava,
      combined_harvest_area: maize + cassava,
      harvest_area_per_1000_population: ((maize + cassava) / population) * 1000,
      F_area_land_deficit_proxy: fArea,
      SDFVI_proxy: uploadedScore,
      recalculated_SDFVI: uploadedScore,
      is_recalculated_match: true,
      priority_category: category,
      rank: rankIdx >= 0 ? Math.round(parseNumberIndonesian(row[rankIdx])) : rowIdx + 1
    };
  });

  return recalculateSDFVI(result);
}

export function exportDataToCSV(data: KapanewonData[]): string {
  const headers = [
    "kapanewon",
    "rank",
    "priority_category",
    "SDFVI_proxy",
    "L1_social_sensitivity",
    "H_meteorological_hazard",
    "F_area_land_deficit_proxy",
    "population_2024",
    "ADK_2024",
    "neglected_older_persons_2023",
    "ADK_per_1000",
    "neglected_older_persons_per_1000",
    "normalized_ADK_score",
    "normalized_older_person_score",
    "precipitation_2015",
    "precipitation_2016_reference",
    "precipitation_2019",
    "precipitation_2024",
    "mean_precipitation_benchmark",
    "maize_harvest_area_2023",
    "cassava_harvest_area_2023",
    "combined_harvest_area",
    "harvest_area_per_1000_population"
  ];

  const escapeCSV = (val: string | number) => {
    const s = String(val);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const rows = data.map(d => [
    escapeCSV(d.kapanewon),
    d.rank ?? '',
    escapeCSV(d.priority_category ?? ''),
    d.SDFVI_proxy !== undefined ? d.SDFVI_proxy.toFixed(4) : '',
    d.L1_social_sensitivity !== undefined ? d.L1_social_sensitivity.toFixed(4) : '',
    d.H_meteorological_hazard !== undefined ? d.H_meteorological_hazard.toFixed(4) : '',
    d.F_area_land_deficit_proxy !== undefined ? d.F_area_land_deficit_proxy.toFixed(4) : '',
    d.population_2024 ?? '',
    d.ADK_2024 ?? '',
    d.neglected_older_persons_2023 ?? '',
    d.ADK_per_1000 !== undefined ? d.ADK_per_1000.toFixed(3) : '',
    d.neglected_older_persons_per_1000 !== undefined ? d.neglected_older_persons_per_1000.toFixed(3) : '',
    d.normalized_ADK_score !== undefined ? d.normalized_ADK_score.toFixed(4) : '',
    d.normalized_older_person_score !== undefined ? d.normalized_older_person_score.toFixed(4) : '',
    d.precipitation_2015 !== undefined ? d.precipitation_2015.toFixed(1) : '',
    d.precipitation_2016_reference !== undefined ? d.precipitation_2016_reference.toFixed(1) : '',
    d.precipitation_2019 !== undefined ? d.precipitation_2019.toFixed(1) : '',
    d.precipitation_2024 !== undefined ? d.precipitation_2024.toFixed(1) : '',
    d.mean_precipitation_benchmark !== undefined ? d.mean_precipitation_benchmark.toFixed(2) : '',
    d.maize_harvest_area_2023 ?? '',
    d.cassava_harvest_area_2023 ?? '',
    d.combined_harvest_area ?? '',
    d.harvest_area_per_1000_population !== undefined ? d.harvest_area_per_1000_population.toFixed(3) : ''
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}

// Aliases and convenience methods for UI components
export const parseCsvString = parseCSVString;
export const autoDetectMapping = autoDetectColumnMapping;

export function processCsvWithMapping(
  rows: Record<string, string>[] | string[][],
  mapping: ColumnMapping
): KapanewonData[] {
  if (Array.isArray(rows) && rows.length > 0 && Array.isArray(rows[0])) {
    const headers = Object.values(mapping).filter(Boolean) as string[];
    return convertParsedRowsToKapanewonData(headers, rows as string[][], mapping);
  }

  // If rows are Record<string, string>[]
  const recordRows = rows as Record<string, string>[];
  const headers = Object.keys(recordRows[0] || {});
  const arrayRows = recordRows.map(r => headers.map(h => r[h] || ''));
  return convertParsedRowsToKapanewonData(headers, arrayRows, mapping);
}

export function exportDataToCsv(data: KapanewonData[], filename: string = 'gn_kidul_sdfvi_data.csv'): void {
  const csvContent = exportDataToCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSolokDataToCsv(solokData: any[], filename: string = 'solok_sdfvi_data.csv'): void {
  const headers = [
    'rank',
    'NAMOBJ',
    'SDFVI_proxy',
    'priority_category',
    'S_i',
    'H_i',
    'E_i',
    'chirps_total_mm',
    'sawah_total_ha',
    'women_60plus_no_edu',
    'elevation_masl',
    'dominant_rice_variety',
    'sub_basin'
  ];

  const rows = solokData.map(d => [
    d.rank ?? '',
    `"${d.NAMOBJ}"`,
    d.SDFVI_proxy !== undefined ? d.SDFVI_proxy.toFixed(4) : '',
    `"${d.priority_category ?? ''}"`,
    d.S_i !== undefined ? d.S_i.toFixed(4) : '',
    d.H_i !== undefined ? d.H_i.toFixed(4) : '',
    d.E_i !== undefined ? d.E_i.toFixed(4) : '',
    d.chirps_total_mm !== undefined ? d.chirps_total_mm.toFixed(2) : '',
    d.sawah_total_ha !== undefined ? d.sawah_total_ha.toFixed(2) : '',
    d.women_60plus_no_edu ?? '',
    d.elevation_masl ?? '',
    `"${d.dominant_rice_variety ?? ''}"`,
    `"${d.sub_basin ?? ''}"`
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

