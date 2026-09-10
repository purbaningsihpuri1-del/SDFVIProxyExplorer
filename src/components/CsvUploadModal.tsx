import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  FileSpreadsheet, 
  Check, 
  AlertTriangle, 
  Download, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { KapanewonData, ColumnMapping } from '../types';
import { 
  parseCsvString, 
  autoDetectMapping, 
  convertParsedRowsToKapanewonData, 
  exportDataToCsv 
} from '../utils/csvParser';
import { auditDataQuality } from '../utils/calculations';

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyData: (newData: KapanewonData[], label: string) => void;
  onResetToBaseline: () => void;
  currentIsBaseline: boolean;
}

export const CsvUploadModal: React.FC<CsvUploadModalProps> = ({
  isOpen,
  onClose,
  onApplyData,
  onResetToBaseline,
  currentIsBaseline
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({
    kapanewon: '',
    L1_social_sensitivity: '',
    H_meteorological_hazard: '',
    F_area_land_deficit_proxy: '',
    SDFVI_proxy: '',
    population_2024: '',
    ADK_2024: '',
    neglected_older_persons_2023: ''
  });
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<KapanewonData[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setErrorMsg(null);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      try {
        const { headers, rows } = parseCsvString(text);
        if (headers.length === 0 || rows.length === 0) {
          setErrorMsg('Berkas CSV kosong atau tidak memiliki baris data yang valid.');
          return;
        }
        setCsvHeaders(headers);
        setCsvRows(rows);

        // Auto-detect mappings
        const detected = autoDetectMapping(headers);
        setMapping(detected);
        setStep('mapping');
      } catch (err) {
        setErrorMsg('Gagal memproses berkas CSV. Pastikan format tabel teks standar dipisahkan koma.');
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleProceedToPreview = () => {
    if (!mapping.kapanewon) {
      setErrorMsg('Kolom nama Kapanewon wajib dipetakan!');
      return;
    }
    try {
      const processed = convertParsedRowsToKapanewonData(csvHeaders, csvRows, mapping);
      if (processed.length === 0) {
        setErrorMsg('Tidak ada data yang berhasil diproses.');
        return;
      }
      setPreviewData(processed);
      setStep('preview');
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses pemetaan.');
    }
  };

  const handleConfirmApply = () => {
    const label = `Data Alternatif Pengguna (${file?.name || 'CSV Terunggah'})`;
    onApplyData(previewData, label);
    onClose();
  };

  const handleExportSampleTemplate = () => {
    // Generate a clean sample CSV template
    const sampleCsv = `kapanewon,population_2024,ADK_2024,older_persons_2023,L1_social_sensitivity,H_meteorological_hazard,F_area_land_deficit_proxy,SDFVI_proxy
Wonosari,90820,380,240,0.7812,0.6124,0.7808,0.7248
Playen,62140,290,195,0.7420,0.5980,0.8338,0.7246
Paliyan,33520,180,110,0.6890,0.6540,0.7915,0.7115
Semanu,60120,240,165,0.6510,0.6230,0.8250,0.6997
Tanjungsari,29450,115,85,0.6210,0.6890,0.7840,0.6980
Purwosari,21340,95,65,0.5980,0.7120,0.7710,0.6937
Patuk,34560,140,95,0.5740,0.6410,0.8140,0.6763
Panggang,29870,120,80,0.5630,0.7240,0.7210,0.6693
Karangmojo,56400,210,140,0.5420,0.5890,0.8520,0.6610
Ngawen,35210,135,90,0.5210,0.6010,0.8290,0.6503
Rongkop,29120,105,75,0.4890,0.8576,0.3373,0.5613
Tepus,36540,125,85,0.4780,0.7920,0.4130,0.5610
Saptosari,39870,145,100,0.4650,0.7450,0.4520,0.5540
Ponjong,55430,190,130,0.4510,0.6320,0.5480,0.5437
Gedangsari,38900,130,85,0.4120,0.5820,0.6210,0.5383
Girisubo,25430,85,60,0.3950,0.8763,0.2023,0.4912
Semin,57890,160,110,0.3540,0.4120,0.1970,0.3210
Nglipar,33410,95,65,0.2980,0.3870,0.1325,0.2725`;

    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'template_sdfvi_gunungkidul.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="csv-modal-title"
    >
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col my-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-5 sm:px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 id="csv-modal-title" className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Kelola Sumber Data & Unggah CSV Alternatif
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Peta Kolom, Rekalkulasi Mandiri, dan Validasi Integritas Data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Active Dataset Status Box */}
          <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block font-medium">Dataset Aktif Saat Ini:</span>
              <span className="text-xs font-bold text-neutral-900 dark:text-white">
                {currentIsBaseline ? "Data Dasar Terpublikasi Peneliti (Published Baseline)" : "Data Alternatif Unggahan Pengguna"}
              </span>
            </div>

            {!currentIsBaseline && (
              <button
                onClick={() => {
                  onResetToBaseline();
                  onClose();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Kembalikan ke Data Dasar</span>
              </button>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Upload */}
          {step === 'upload' && (
            <div className="space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-emerald-500 rounded-xl p-8 text-center cursor-pointer transition-colors space-y-3 bg-neutral-50/50 dark:bg-neutral-800/20"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900 dark:text-white">
                    Klik untuk memilih berkas CSV atau seret berkas ke sini
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Mendukung berkas CSV dengan data 18 kapanewon Gunungkidul
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 pt-2">
                <span>Memerlukan format standar?</span>
                <button
                  onClick={handleExportSampleTemplate}
                  className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Contoh Template CSV</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Column Mapping */}
          {step === 'mapping' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  Petakan Kolom Berkas ({file?.name})
                </span>
                <button
                  onClick={() => setStep('upload')}
                  className="text-xs text-neutral-500 hover:text-neutral-900 underline"
                >
                  Ganti Berkas
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Kapanewon name */}
                <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block">
                    Nama Kapanewon <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={mapping.kapanewon}
                    onChange={e => setMapping({ ...mapping, kapanewon: e.target.value })}
                    className="w-full p-1.5 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-xs"
                  >
                    <option value="">-- Pilih Kolom --</option>
                    {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                {/* SDFVI Proxy */}
                <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block">
                    Skor SDFVI–Proxy (Opsional)
                  </label>
                  <select
                    value={mapping.SDFVI_proxy || ''}
                    onChange={e => setMapping({ ...mapping, SDFVI_proxy: e.target.value })}
                    className="w-full p-1.5 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-xs"
                  >
                    <option value="">-- Otomatis Rekalkulasi --</option>
                    {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                {/* L1 */}
                <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block">
                    L1: Sensitivitas Sosial
                  </label>
                  <select
                    value={mapping.L1_social_sensitivity || ''}
                    onChange={e => setMapping({ ...mapping, L1_social_sensitivity: e.target.value })}
                    className="w-full p-1.5 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-xs"
                  >
                    <option value="">-- Pilih Kolom --</option>
                    {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                {/* H */}
                <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block">
                    H: Bahaya Meteorologis
                  </label>
                  <select
                    value={mapping.H_meteorological_hazard || ''}
                    onChange={e => setMapping({ ...mapping, H_meteorological_hazard: e.target.value })}
                    className="w-full p-1.5 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-xs"
                  >
                    <option value="">-- Pilih Kolom --</option>
                    {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                {/* F_area */}
                <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 space-y-1 sm:col-span-2">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block">
                    F_area: Proksi Defisit Luas Panen Palawija
                  </label>
                  <select
                    value={mapping.F_area_land_deficit_proxy || ''}
                    onChange={e => setMapping({ ...mapping, F_area_land_deficit_proxy: e.target.value })}
                    className="w-full p-1.5 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-xs"
                  >
                    <option value="">-- Pilih Kolom --</option>
                    {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setStep('upload')}
                  className="px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700"
                >
                  Kembali
                </button>
                <button
                  id="btn-proceed-preview"
                  onClick={handleProceedToPreview}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800"
                >
                  <span>Pratinjau Data & Audit Mutu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Preview & Audit Validation */}
          {step === 'preview' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
                <span>Berhasil memproses {previewData.length} kapanewon dari berkas CSV.</span>
                <span className="font-bold">Audit Otomatis Berjalan</span>
              </div>

              <div className="max-h-52 overflow-y-auto border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-100 dark:bg-neutral-800 sticky top-0 font-semibold">
                    <tr>
                      <th className="p-2">Rank</th>
                      <th className="p-2">Kapanewon</th>
                      <th className="p-2 text-right">SDFVI–Proxy</th>
                      <th className="p-2 text-center">Kategori</th>
                      <th className="p-2 text-right">L1</th>
                      <th className="p-2 text-right">H</th>
                      <th className="p-2 text-right">F_area</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {previewData.map(p => (
                      <tr key={p.kapanewon}>
                        <td className="p-2 font-bold">#{p.rank}</td>
                        <td className="p-2 font-semibold">{p.kapanewon}</td>
                        <td className="p-2 text-right font-mono font-bold">{p.SDFVI_proxy.toFixed(4)}</td>
                        <td className="p-2 text-center">{p.priority_category}</td>
                        <td className="p-2 text-right font-mono">{p.L1_social_sensitivity.toFixed(4)}</td>
                        <td className="p-2 text-right font-mono">{p.H_meteorological_hazard.toFixed(4)}</td>
                        <td className="p-2 text-right font-mono">{p.F_area_land_deficit_proxy.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep('mapping')}
                  className="px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700"
                >
                  Ubah Pemetaan
                </button>
                <button
                  id="btn-confirm-apply"
                  onClick={handleConfirmApply}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Terapkan Dataset ke Dashboard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
