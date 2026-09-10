import React, { useState } from 'react';
import { 
  ClipboardList, 
  Users, 
  Droplet, 
  HeartHandshake, 
  ShoppingBag, 
  CheckSquare, 
  Square, 
  Printer, 
  HelpCircle,
  FileSpreadsheet,
  AlertCircle,
  Wheat,
  MapPin
} from 'lucide-react';
import { KapanewonData, SolokKecamatanData, PilotRegion } from '../types';
import { FIELD_VERIFICATION_PROMPTS } from '../data/baselineData';
import { SOLOK_FIELD_RESEARCH_QUESTIONS, PUBLISHED_SOLOK_DATA } from '../data/solokBaselineData';

interface ActionResearchPanelProps {
  data: KapanewonData[];
  selectedKapanewon: any | null;
  currentPilot: PilotRegion;
  onSwitchPilot?: (pilot: PilotRegion) => void;
  onSelectKapanewon: (item: any) => void;
}

export const ActionResearchPanel: React.FC<ActionResearchPanelProps> = ({
  data,
  selectedKapanewon,
  currentPilot,
  onSwitchPilot,
  onSelectKapanewon
}) => {
  const isGunungkidul = currentPilot === 'gunungkidul';
  const solokList = PUBLISHED_SOLOK_DATA;

  // Active unit based on pilot
  const activeUnit = selectedKapanewon || (isGunungkidul ? data[0] : solokList[0]);
  const activeName = isGunungkidul 
    ? (activeUnit.kapanewon || data[0].kapanewon) 
    : (activeUnit.NAMOBJ || solokList[0].NAMOBJ);

  const prompts = isGunungkidul
    ? (FIELD_VERIFICATION_PROMPTS[activeName] || [
        `Verifikasi aksesibilitas distribusi bantuan air bersih ke rumah tangga disabilitas di Kapanewon ${activeName}.`,
        `Tinjau kecukupan cadangan pangan palawija lokal di tingkat kalurahan.`,
        `Evaluasi jangkauan pendataan bansos disabilitas Dinas Sosial setempat.`
      ])
    : (SOLOK_FIELD_RESEARCH_QUESTIONS[activeName] || [
        `Verifikasi ketersediaan air irigasi sawah terasering saat musim kemarau bagi perempuan lansia penggarap di Kecamatan ${activeName}.`,
        `Kaji beban kerja ganda perempuan lansia dalam mengangkut air bersih dan pengelolaan panen padi beras Solok.`,
        `Evaluasi keterjangkauan bantuan sosial adaptif kekeringan di nagari-nagari terpencil.`
      ]);

  // Checklist state for field verification
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCompletedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6" id="action-research-container">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                <ClipboardList className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                {isGunungkidul
                  ? 'Panel Riset Aksi & Verifikasi Lapangan Partisipatif (Disabilitas & Lansia)'
                  : 'Panel Riset Aksi & Verifikasi Lapangan Partisipatif (Inklusi Gender & Pertanian Sawah)'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {isGunungkidul
                ? 'Panduan verifikasi langsung bersama organisasi disabilitas (OPD/DPO), pamong kalurahan, dan dinas teknis Gunungkidul.'
                : 'Panduan verifikasi lapangan bersama kelompok wanita tani (KWT), kerapatan adat nagari (KAN), wali nagari, dan dinas pertanian Solok.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Pilot Switcher */}
            {onSwitchPilot && (
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-700 p-1 rounded-lg text-xs font-semibold mr-2">
                <button
                  onClick={() => onSwitchPilot('gunungkidul')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    isGunungkidul ? 'bg-emerald-600 text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Gunungkidul
                </button>
                <button
                  onClick={() => onSwitchPilot('solok')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    !isGunungkidul ? 'bg-blue-600 text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Solok
                </button>
              </div>
            )}

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Formulir</span>
            </button>
          </div>
        </div>

        {/* Region Selector dropdown */}
        <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap items-center gap-3">
          <label htmlFor="select-kapanewon-research" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pilih Unit Wilayah:</span>
          </label>

          <select
            id="select-kapanewon-research"
            value={activeName}
            onChange={(e) => {
              const selected = isGunungkidul
                ? data.find(d => d.kapanewon === e.target.value)
                : solokList.find(d => d.NAMOBJ === e.target.value);
              if (selected) onSelectKapanewon(selected);
            }}
            className="py-1.5 px-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            {isGunungkidul
              ? data.map(item => (
                  <option key={item.kapanewon} value={item.kapanewon}>
                    #{item.rank} {item.kapanewon} — Skor: {item.SDFVI_proxy.toFixed(4)} ({item.priority_category})
                  </option>
                ))
              : solokList.map(item => (
                  <option key={item.NAMOBJ} value={item.NAMOBJ}>
                    #{item.rank} {item.NAMOBJ} — Skor: {item.SDFVI_proxy.toFixed(4)} ({item.priority_category})
                  </option>
                ))}
          </select>

          <span className="text-xs text-neutral-500">
            Kategori Prioritas: <strong className="text-orange-600">{activeUnit.priority_category}</strong>
          </span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Guided Action Research Questions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Panduan Partisipatif Lapangan
                </span>
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mt-0.5">
                  {isGunungkidul ? `Pertanyaan Penyelidikan: Kapanewon ${activeName}` : `Pertanyaan Penyelidikan: Kecamatan ${activeName}`}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                Peringkat #{activeUnit.rank}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Daftar pertanyaan ini dirancang untuk memvalidasi temuan skoring proksi algoritma dengan realitas hidup kelompok paling terdampak di lapangan:
            </p>

            {/* Questions List */}
            <div className="space-y-3 pt-1">
              {prompts.map((prompt, idx) => {
                const key = `${activeName}-q-${idx}`;
                const isDone = !!completedItems[key];

                return (
                  <div 
                    key={key}
                    onClick={() => toggleCheck(key)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isDone 
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800' 
                        : 'bg-neutral-50 dark:bg-neutral-750/40 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <button 
                      type="button"
                      className="mt-0.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white shrink-0"
                      aria-label={isDone ? "Tandai belum selesai" : "Tandai telah diverifikasi"}
                    >
                      {isDone ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-neutral-400" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 font-mono">
                          Pertanyaan 0{idx + 1}
                        </span>
                        {isDone && (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                            ✓ Terverifikasi
                          </span>
                        )}
                      </div>
                      <p className={`text-xs sm:text-sm leading-relaxed ${
                        isDone 
                          ? 'text-emerald-900 dark:text-emerald-200 line-through opacity-80' 
                          : 'text-neutral-800 dark:text-neutral-200 font-medium'
                      }`}>
                        {prompt}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Field Note Scratchpad */}
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
              <label htmlFor="field-notes" className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                <span>Catatan Lapangan & Temuan FGD (Focus Group Discussion):</span>
                <span className="text-[11px] text-neutral-400 font-normal">Tersimpan otomatis</span>
              </label>
              <textarea
                id="field-notes"
                rows={4}
                placeholder={isGunungkidul 
                  ? "Tuliskan hasil konfirmasi bersama DPO/OPD, kendala mobilitas disabilitas saat kekeringan, dan kondisi riil bak penampungan air..."
                  : "Tuliskan hasil diskusi bersama kelompok wanita tani (KWT), kondisi debit irigasi sawah terasering, dan beban lansia..."}
                className="w-full p-3 text-xs rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Standard Verification Protocol */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              <span>Protokol Verifikasi Etis DICLIV</span>
            </h4>

            <ul className="space-y-3 text-xs text-neutral-600 dark:text-neutral-300">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 shrink-0">1.</span>
                <span>
                  <strong>"Nothing About Us Without Us"</strong>: Selalu libatkan perwakilan organisasi penyandang disabilitas (DPO) dan kelompok perempuan tani sejak awal perencanaan kunjungan.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 shrink-0">2.</span>
                <span>
                  <strong>Akses Komunikasi yang Setara</strong>: Siapkan juru bahasa isyarat (JBI) dan format materi audio/teks besar bagi peserta tunarungu dan tunanetra.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 shrink-0">3.</span>
                <span>
                  <strong>Validasi Silang Sumber Air</strong>: Cocokkan klaim data ketersediaan air PDAM/BPBD dengan fakta fisik jarak tempuh rumah tangga rentan ke sumber air terdekat.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 shrink-0">4.</span>
                <span>
                  <strong>Rekomendasi Aksi Cepat</strong>: Temuan lapangan yang menunjukkan kondisi darurat air minum lansia tunggal harus langsung diteruskan ke Tim Reaksi Cepat BPBD.
                </span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span>Karakteristik Khusus {isGunungkidul ? 'Gunungkidul' : 'Solok'}</span>
            </div>
            <p className="leading-relaxed text-[11px] text-blue-900/90 dark:text-blue-300/90">
              {isGunungkidul
                ? 'Tipologi karst Gunungsewu menciptakan disparitas air tanah yang ekstrim antara zona cekungan telaga dan tebing kapur. Rumah tangga di lereng atas memerlukan biaya pembelian tangki air swasta yang membebani lansia miskin.'
                : 'Topografi lembah Bukit Barisan di Solok mengharuskan pemeliharaan saluran irigasi tradisional (bandar). Jika debit menyusut, terjadi persaingan air antara petak sawah hulu dan hilir yang sering merugikan buruh tani perempuan lansia.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
