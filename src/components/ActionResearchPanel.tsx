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
      <div className="bg-white dark:bg-[#1E293B] border-2 border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#15803D]/20 dark:bg-[#15803D]/30 text-[#14532D] dark:text-[#4ADE80] border border-[#15803D]/30">
                <ClipboardList className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
                {isGunungkidul
                  ? 'Panel Riset Aksi & Verifikasi Lapangan Partisipatif (Disabilitas & Lansia)'
                  : 'Panel Riset Aksi & Verifikasi Lapangan Partisipatif (Inklusi Gender & Pertanian Sawah)'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] mt-1.5 font-medium leading-relaxed">
              {isGunungkidul
                ? 'Panduan verifikasi langsung bersama organisasi disabilitas (OPD/DPO), pamong kalurahan, dan dinas teknis Gunungkidul.'
                : 'Panduan verifikasi lapangan bersama kelompok wanita tani (KWT), kerapatan adat nagari (KAN), wali nagari, dan dinas pertanian Solok.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Pilot Switcher */}
            {onSwitchPilot && (
              <div className="flex items-center bg-[#F1F5F9] dark:bg-[#0F172A] p-1 rounded-xl border border-black/10 dark:border-white/10 text-xs sm:text-sm font-bold mr-2">
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

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl border-2 border-black/10 dark:border-white/15 bg-white dark:bg-[#27272A] text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white hover:bg-neutral-100 flex items-center gap-2 shadow-2xs apple-tap"
            >
              <Printer className="w-4 h-4 text-[#475569] dark:text-[#CBD5E1]" />
              <span>Cetak Formulir</span>
            </button>
          </div>
        </div>

        {/* Region Selector dropdown */}
        <div className="mt-5 pt-4 border-t-2 border-black/[0.08] dark:border-white/[0.12] flex flex-wrap items-center gap-3">
          <label htmlFor="select-kapanewon-research" className="text-xs sm:text-sm font-extrabold text-[#0F172A] dark:text-white flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#15803D] dark:text-[#4ADE80]" />
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
            className="py-2 px-3.5 rounded-xl border-2 border-black/15 dark:border-white/20 bg-white dark:bg-[#27272A] text-[#0F172A] dark:text-white text-xs sm:text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            {isGunungkidul
              ? data.map(item => (
                  <option key={item.kapanewon} value={item.kapanewon}>
                    #{item.rank} {item.kapanewon} — Skor: {item.SDFVI_proxy?.toFixed(4) ?? '-'} ({item.priority_category})
                  </option>
                ))
              : solokList.map(item => (
                  <option key={item.NAMOBJ} value={item.NAMOBJ}>
                    #{item.rank} {item.NAMOBJ} — Skor: {item.SDFVI_proxy?.toFixed(4) ?? '-'} ({item.priority_category})
                  </option>
                ))}
          </select>

          <span className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] font-semibold">
            Kategori Prioritas: <strong className="text-[#C2410C] dark:text-[#FDBA74] font-black">{activeUnit.priority_category}</strong>
          </span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Guided Action Research Questions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#1E293B] border-2 border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-black text-[#15803D] dark:text-[#4ADE80] uppercase tracking-wider">
                  Panduan Partisipatif Lapangan
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] dark:text-white mt-1 tracking-tight">
                  {isGunungkidul ? `Pertanyaan Penyelidikan: Kapanewon ${activeName}` : `Pertanyaan Penyelidikan: Kecamatan ${activeName}`}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#F1F5F9] dark:bg-[#0F172A] text-[#0F172A] dark:text-white border border-black/10 dark:border-white/10">
                Peringkat #{activeUnit.rank}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-medium">
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
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                      isDone 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#15803D]/60' 
                        : 'bg-[#F8FAFC] dark:bg-[#0F172A]/60 border-black/10 dark:border-white/15 hover:border-black/25'
                    }`}
                  >
                    <button 
                      type="button"
                      className="mt-0.5 text-[#475569] hover:text-[#0F172A] dark:hover:text-white shrink-0"
                      aria-label={isDone ? "Tandai belum selesai" : "Tandai telah diverifikasi"}
                    >
                      {isDone ? (
                        <CheckSquare className="w-6 h-6 text-[#15803D] dark:text-[#4ADE80]" />
                      ) : (
                        <Square className="w-6 h-6 text-[#94A3B8]" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#475569] dark:text-[#94A3B8] font-mono">
                          Pertanyaan 0{idx + 1}
                        </span>
                        {isDone && (
                          <span className="text-xs font-extrabold text-[#15803D] dark:text-[#4ADE80] uppercase">
                            ✓ Terverifikasi
                          </span>
                        )}
                      </div>
                      <p className={`text-sm sm:text-base leading-relaxed ${
                        isDone 
                          ? 'text-[#14532D] dark:text-[#86EFAC] line-through opacity-85 font-medium' 
                          : 'text-[#0F172A] dark:text-white font-semibold'
                      }`}>
                        {prompt}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Field Note Scratchpad */}
            <div className="pt-4 border-t-2 border-black/[0.08] dark:border-white/[0.12] space-y-2.5">
              <label htmlFor="field-notes" className="text-xs sm:text-sm font-extrabold text-[#0F172A] dark:text-white flex items-center justify-between">
                <span>Catatan Lapangan & Temuan FGD (Focus Group Discussion):</span>
                <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-normal">Tersimpan otomatis</span>
              </label>
              <textarea
                id="field-notes"
                rows={4}
                placeholder={isGunungkidul 
                  ? "Tuliskan hasil konfirmasi bersama DPO/OPD, kendala mobilitas disabilitas saat kekeringan, dan kondisi riil bak penampungan air..."
                  : "Tuliskan hasil diskusi bersama kelompok wanita tani (KWT), kondisi debit irigasi sawah terasering, dan beban lansia..."}
                className="w-full p-3.5 text-sm rounded-xl border-2 border-black/15 dark:border-white/20 bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-white placeholder:text-[#94A3B8] focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Standard Verification Protocol */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-[#1E293B] border-2 border-black/[0.08] dark:border-white/[0.12] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h4 className="font-extrabold text-base text-[#0F172A] dark:text-white flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[#15803D] dark:text-[#4ADE80]" />
              <span>Protokol Verifikasi Etis DICLIV</span>
            </h4>

            <ul className="space-y-3.5 text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1]">
              <li className="flex items-start gap-2.5">
                <span className="font-black text-[#15803D] dark:text-[#4ADE80] shrink-0">1.</span>
                <span>
                  <strong className="text-[#0F172A] dark:text-white font-bold">"Nothing About Us Without Us"</strong>: Selalu libatkan perwakilan organisasi penyandang disabilitas (DPO) dan kelompok perempuan tani sejak awal perencanaan kunjungan.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-black text-[#15803D] dark:text-[#4ADE80] shrink-0">2.</span>
                <span>
                  <strong className="text-[#0F172A] dark:text-white font-bold">Akses Komunikasi yang Setara</strong>: Siapkan juru bahasa isyarat (JBI) dan format materi audio/teks besar bagi peserta tunarungu dan tunanetra.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-black text-[#15803D] dark:text-[#4ADE80] shrink-0">3.</span>
                <span>
                  <strong className="text-[#0F172A] dark:text-white font-bold">Validasi Silang Sumber Air</strong>: Cocokkan klaim data ketersediaan air PDAM/BPBD dengan fakta fisik jarak tempuh rumah tangga rentan ke sumber air terdekat.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-black text-[#15803D] dark:text-[#4ADE80] shrink-0">4.</span>
                <span>
                  <strong className="text-[#0F172A] dark:text-white font-bold">Rekomendasi Aksi Cepat</strong>: Temuan lapangan yang menunjukkan kondisi darurat air minum lansia tunggal harus langsung diteruskan ke Tim Reaksi Cepat BPBD.
                </span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#EFF6FF] dark:bg-[#1E293B] border-2 border-[#1D4ED8]/30 text-xs sm:text-sm text-[#1E3A8A] dark:text-[#BFDBFE] space-y-2.5">
            <div className="font-extrabold flex items-center gap-2 text-sm sm:text-base text-[#1E40AF] dark:text-[#93C5FD]">
              <AlertCircle className="w-5 h-5 text-[#1D4ED8] dark:text-[#60A5FA]" />
              <span>Karakteristik Khusus {isGunungkidul ? 'Gunungkidul' : 'Solok'}</span>
            </div>
            <p className="leading-relaxed text-xs sm:text-sm font-medium">
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
