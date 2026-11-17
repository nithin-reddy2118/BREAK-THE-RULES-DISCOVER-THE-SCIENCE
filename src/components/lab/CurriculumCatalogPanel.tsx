import React, { useMemo, useState } from 'react';
import { BookOpen, FlaskConical, Info, Layers, Search } from 'lucide-react';
import {
  CURRICULUM_BOARDS,
  CURRICULUM_EXPERIMENT_CATALOG,
} from '../../data/experimentCatalog';
import { getChemicalById } from '../../data/chemicals';
import { getInstrumentById, getLabRoomById } from '../../data/labEquipment';
import type {
  CurriculumExperimentEntry,
  ModelImplementationTier,
} from '../../types/science';

interface CurriculumCatalogPanelProps {
  onLaunchEntry: (entry: CurriculumExperimentEntry) => void;
}

const TIER_LABELS: Record<ModelImplementationTier, { label: string; colorClass: string }> = {
  implemented: {
    label: '1. Validated Interactive Model',
    colorClass: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  },
  guided: {
    label: '2. Guided Workbench + Model',
    colorClass: 'border-blue-200 bg-blue-50 text-blue-800',
  },
  conceptual: {
    label: '3. Conceptual Workbench Only',
    colorClass: 'border-amber-200 bg-amber-50 text-amber-800',
  },
  planned: {
    label: '4. Planned Future Solver',
    colorClass: 'border-slate-200 bg-slate-100 text-slate-700',
  },
};

export function CurriculumCatalogPanel({ onLaunchEntry }: CurriculumCatalogPanelProps) {
  const [board, setBoard] = useState<string>('All');
  const [tier, setTier] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CURRICULUM_EXPERIMENT_CATALOG.filter((item) => {
      const boardOk = board === 'All' || item.board === board;
      const tierOk = tier === 'All' || item.modelTier === tier;
      const qOk =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.chapter.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q);
      return boardOk && tierOk && qOk;
    });
  }, [board, tier, search]);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-blue-700 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Expandable Curriculum Catalog · Transparent Implementation Tiers
            </div>
            <h2 className="text-xl font-display font-bold text-slate-900 mt-1">
              School &amp; University Syllabus Experiments
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Organized by common syllabus themes across CBSE, ICSE, IGCSE, State Boards, Senior Secondary, Biotechnology, and B.Tech labs. Each entry explicitly states whether it has a validated numerical solver, guided workbench setup, conceptual equipment assembly, or planned future solver (no unverified claims of official board endorsement).
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chapter, topic, board..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
            />
          </div>
        </div>

        {/* Board Filter */}
        <div className="flex flex-wrap gap-2">
          {CURRICULUM_BOARDS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBoard(b)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                board === b
                  ? 'bg-blue-700 text-white border-blue-700 font-semibold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Tier Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 text-xs">
          <span className="text-slate-600 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            Implementation Tier:
          </span>
          {(
            [
              { id: 'All', label: 'All Tiers' },
              { id: 'implemented', label: 'Validated Model' },
              { id: 'guided', label: 'Guided Workbench' },
              { id: 'conceptual', label: 'Conceptual Assembly' },
              { id: 'planned', label: 'Planned Solver' },
            ] as const
          ).map((tOpt) => (
            <button
              key={tOpt.id}
              type="button"
              onClick={() => setTier(tOpt.id)}
              className={`px-2.5 py-1 rounded border ${
                tier === tOpt.id
                  ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tOpt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
          No syllabus entries match your current filter.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((entry) => {
            const tierMeta = TIER_LABELS[entry.modelTier];
            const equipmentNames = entry.equipmentIds
              .map((id) => getInstrumentById(id)?.name ?? id)
              .slice(0, 4);
            const chemicalNames = (entry.chemicalIds ?? [])
              .map((id) => {
                const chem = getChemicalById(id);
                return chem ? `${chem.name} (${chem.formula})` : id;
              })
              .slice(0, 4);
            const roomMeta = getLabRoomById(entry.department);

            return (
              <div
                key={entry.id}
                className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-blue-700">
                      {entry.board} · {entry.gradeLevel} · {entry.subject}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded border text-[11px] font-semibold ${tierMeta.colorClass}`}
                    >
                      {tierMeta.label}
                    </span>
                  </div>

                  <h3 className="text-base font-display font-bold text-slate-900">{entry.title}</h3>
                  <div className="text-xs text-slate-600">
                    <strong className="text-slate-800">Chapter:</strong> {entry.chapter} ·{' '}
                    <strong className="text-slate-800">Difficulty:</strong> {entry.difficulty}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{entry.summary}</p>

                  <div className="text-xs text-slate-800">
                    <span className="text-slate-500">Required Equipment:</span>{' '}
                    {equipmentNames.join(', ')}
                  </div>

                  {chemicalNames.length > 0 && (
                    <div className="text-xs text-emerald-800">
                      <span className="text-slate-500">Virtual Substances:</span>{' '}
                      {chemicalNames.join(', ')}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-600 flex items-start gap-1.5 bg-slate-50 rounded-lg p-2.5 border border-slate-200">
                    <Info className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                    <span>{entry.referenceNote}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wide font-mono">
                    {roomMeta.wingCode} · {roomMeta.shortName}
                  </span>
                  <button
                    type="button"
                    onClick={() => onLaunchEntry(entry)}
                    className="px-3.5 py-2 rounded-lg bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 flex items-center gap-1.5 min-h-[38px]"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    {entry.modelTier === 'planned'
                      ? 'Inspect Workbench Setup'
                      : 'Assemble in Lab Room'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
