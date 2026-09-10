import React from 'react';
import { 
  Milestone, 
  Layers, 
  Compass, 
  Users2, 
  FileCheck2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';

export const FutureRoadmap: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            <Milestone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
              Peta Jalan Pengembangan (Future Roadmap): Transformasi Proksi Menuju SEHATI Penuh
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
              Rencana Strategis Transisi dari SDFVI–Proxy 3-Indikator Menuju Full DICLIV Framework (29 Indikator Komprehensif)
            </p>
          </div>
        </div>
      </div>

      {/* Roadmap Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stage 1 */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                Fase 1 (Selesai)
              </span>
              <span className="text-xs font-mono text-neutral-400">2024-2025</span>
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              Pilot SDFVI–Proxy Gunungkidul
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Memanfaatkan 3 proksi data administratif makro (ADK/Lansia, CHIRPS kemarau, dan luas panen palawija BPS) pada 18 kapanewon.
            </p>
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Terpublikasi & Tervalidasi</span>
          </div>
        </div>

        {/* Stage 2 */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300">
                Fase 2 (Jangka Pendek)
              </span>
              <span className="text-xs font-mono text-neutral-400">2025-2026</span>
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              Dimensi Kapasitas Adaptif (AC)
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Mengintegrasikan data kapasitas adaptif kalurahan: jangkauan jaringan perpipaan PDAM/PAMSIMAS, kepesertaan jaminan kesehatan PBI, dan ketersediaan relawan tanggap bencana desa (DESTANA).
            </p>
          </div>
          <div className="text-[11px] text-sky-700 dark:text-sky-400 font-medium flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Pengembangan Metrik AC</span>
          </div>
        </div>

        {/* Stage 3 */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300">
                Fase 3 (Jangka Menengah)
              </span>
              <span className="text-xs font-mono text-neutral-400">2026-2027</span>
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              Survei Rumah Tangga & Data Primer
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Pelaksanaan survei mikro berbasis DPO untuk mengukur pengeluaran riil air tangki per keluarga, kepemilikan alat bantu adaptif iklim, serta akses informasi cuaca format braille/audio.
            </p>
          </div>
          <div className="text-[11px] text-indigo-700 dark:text-indigo-400 font-medium flex items-center gap-1">
            <Users2 className="w-3.5 h-3.5" />
            <span>Kolaborasi DPO & Kalurahan</span>
          </div>
        </div>

        {/* Stage 4 */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300">
                Fase 4 (Penuh)
              </span>
              <span className="text-xs font-mono text-neutral-400">2027+</span>
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              Full SEHATI (29 Indikator DICLIV)
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Adopsi penuh arsitektur DICLIV versi Indonesia dengan 29 indikator lengkap di seluruh kabupaten/kota se-DIY dan replikasi nasional bersama Komnas Disabilitas dan Bappenas.
            </p>
          </div>
          <div className="text-[11px] text-purple-700 dark:text-purple-400 font-medium flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Skala Nasional Indonesia</span>
          </div>
        </div>
      </div>

      {/* Comparison: Proxy vs Full DICLIV Suite */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
          Perbandingan: SDFVI–Proxy Saat Ini vs Suite Lengkap 29 Indikator DICLIV
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-700/30 border border-neutral-200 dark:border-neutral-700 space-y-2">
            <span className="font-bold text-neutral-800 dark:text-neutral-200 block text-xs">
              SDFVI–Proxy Gunungkidul (Kondisi Saat Ini)
            </span>
            <ul className="space-y-1.5 text-neutral-600 dark:text-neutral-300">
              <li>• <strong>Cakupan Dimensi:</strong> Sensitivitas (L1), Bahaya (H), dan Proksi Defisit Lahan (F_area).</li>
              <li>• <strong>Indikator:</strong> 3 proksi terstandardisasi.</li>
              <li>• <strong>Level Agregasi:</strong> Makro kapanewon (18 unit).</li>
              <li>• <strong>Kapasitas Adaptif:</strong> Belum dimasukkan (proksi defisit lahan digunakan sebagai bobot penyeimbang).</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
            <span className="font-bold text-emerald-900 dark:text-emerald-200 block text-xs">
              SEHATI Penuh / DICLIV Suite (Target Masa Depan)
            </span>
            <ul className="space-y-1.5 text-emerald-950 dark:text-emerald-300">
              <li>• <strong>Cakupan Dimensi:</strong> Paparan (Exposure), Sensitivitas (Sensitivity), dan Kapasitas Adaptif (Adaptive Capacity).</li>
              <li>• <strong>Indikator:</strong> 29 variabel multi-sektor (infrastruktur air, kesehatan, jaringan sosial, ekonomi mikro, dsb).</li>
              <li>• <strong>Level Agregasi:</strong> Multi-skala (Kalurahan / Pedukuhan / Rumah Tangga).</li>
              <li>• <strong>Partisipasi:</strong> Evaluasi partisipatif mandiri oleh organisasi disabilitas di setiap daerah.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
