import React, { useState } from 'react';
import {
  Atom,
  Building2,
  Compass,
  Cpu,
  Dna,
  DoorOpen,
  FlaskConical,
  Leaf,
  Microscope,
  Mountain,
  Ruler,
  Search,
  Telescope,
} from 'lucide-react';
import { CHEMISTRY_CHEMICAL_VAULT } from '../../data/chemicals';
import { LAB_INSTRUMENTS, LAB_ROOMS } from '../../data/labEquipment';
import type { LabDepartmentId } from '../../types/science';

interface ScienceCampusLobbyProps {
  activeDepartment: LabDepartmentId;
  onEnterLab: (department: LabDepartmentId, autoExperimentId?: string) => void;
  onOpenBoilingAltitudeDemo: () => void;
}

const DEPT_ICONS: Record<LabDepartmentId, React.ComponentType<{ className?: string }>> = {
  chemistry: FlaskConical,
  physics: Atom,
  biology: Microscope,
  environmental: Leaf,
  engineering: Cpu,
  astronomy: Telescope,
  math: Ruler,
  biotechnology: Dna,
};

export function ScienceCampusLobby({
  activeDepartment,
  onEnterLab,
  onOpenBoilingAltitudeDemo,
}: ScienceCampusLobbyProps) {
  const [filterQuery, setFilterQuery] = useState('');
  const [hoveredWing, setHoveredWing] = useState<LabDepartmentId | null>(null);

  const visibleRooms = LAB_ROOMS.filter((room) => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return true;
    const roomTools = LAB_INSTRUMENTS.filter((i) => i.department === room.id);
    return (
      room.name.toLowerCase().includes(q) ||
      room.subtitle.toLowerCase().includes(q) ||
      room.wingCode.toLowerCase().includes(q) ||
      roomTools.some((t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)) ||
      (room.id === 'chemistry' && 'chemicals h2o nacl acid base'.includes(q))
    );
  });

  const focusedRoom =
    LAB_ROOMS.find((r) => r.id === (hoveredWing ?? activeDepartment)) ?? LAB_ROOMS[0];

  return (
    <div className="space-y-6">
      {/* Architectural Campus Atrium Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 space-y-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="text-xs font-semibold text-blue-700 flex items-center gap-2 tracking-wide uppercase">
              <Building2 className="w-4 h-4" />
              Virtual Science Campus · Central Hallway &amp; 8 Specialized Laboratory Wings
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              Walk into a Dedicated Science Laboratory
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every laboratory is an isolated physical room with its own benches, wall racks, storage cabinets, safety stations, and subject-specific apparatus. Chemistry chemicals stay exclusively inside the Chemistry Lab vault.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenBoilingAltitudeDemo}
              className="px-4 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 flex items-center gap-2 min-h-[44px] shadow-sm"
            >
              <Mountain className="w-4 h-4" />
              Sea Level vs Altitude Boiling Demo
            </button>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="search"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Find lab or instrument (e.g. DNA, pH, Prism)..."
                className="pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 w-64"
              />
            </div>
          </div>
        </div>

        {/* Interactive Architectural Campus Floorplan SVG */}
        <div className="grid lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-slate-600 mb-2 px-1">
              <span className="flex items-center gap-1.5 font-mono uppercase tracking-wider text-blue-700 font-semibold">
                <Compass className="w-3.5 h-3.5" />
                Campus Floorplan · Click Any Wing Door to Enter
              </span>
              <span className="font-mono tabular-nums text-slate-500">
                8 Rooms · {LAB_INSTRUMENTS.length} Instruments · {CHEMISTRY_CHEMICAL_VAULT.length} Chemistry Reagents
              </span>
            </div>

            <svg
              viewBox="0 0 820 340"
              className="w-full h-auto rounded-lg border border-slate-200 bg-white"
              role="img"
              aria-label="Interactive Virtual Science Campus architectural floorplan with 8 laboratory rooms"
            >
              <defs>
                <pattern id="campus-grid-light" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="820" height="340" fill="url(#campus-grid-light)" />

              {/* Central Atrium Corridor */}
              <rect x="28" y="138" width="764" height="64" rx="8" fill="#EFF6FF" stroke="#3B82F6" strokeOpacity="0.45" strokeWidth="1.5" />
              <text x="410" y="166" textAnchor="middle" fill="#1D4ED8" fontSize="11" fontWeight="bold" letterSpacing="2">
                CENTRAL SCIENCE CAMPUS CORRIDOR · SAFETY &amp; BRIEFING ATRIUM
              </text>
              <text x="410" y="184" textAnchor="middle" fill="#475569" fontSize="9.5">
                Select North Wings (C-101 to E-104) or South Wings (R-105 to BT-108)
              </text>

              {/* Top 4 Wing Rooms */}
              {LAB_ROOMS.slice(0, 4).map((room, idx) => {
                const x = 28 + idx * 194;
                const y = 18;
                const isActive = (hoveredWing ?? activeDepartment) === room.id;
                return (
                  <g
                    key={room.id}
                    onMouseEnter={() => setHoveredWing(room.id)}
                    onMouseLeave={() => setHoveredWing(null)}
                    onClick={() => onEnterLab(room.id, room.defaultExperimentId)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={x}
                      y={y}
                      width="180"
                      height="112"
                      rx="8"
                      fill={isActive ? '#F0F9FF' : '#F8FAFC'}
                      stroke={room.accentColor}
                      strokeWidth={isActive ? '2.4' : '1.4'}
                      strokeOpacity={isActive ? 1 : 0.75}
                    />
                    {/* Interior mini bench diagram */}
                    <rect x={x + 45} y={y + 52} width="90" height="24" rx="3" fill="#E2E8F0" stroke={room.accentColor} strokeOpacity="0.55" />
                    <rect x={x + 14} y={y + 18} width="16" height="66" rx="2" fill="#E2E8F0" />
                    <rect x={x + 150} y={y + 18} width="16" height="66" rx="2" fill="#E2E8F0" />
                    {/* Doorway connecting to corridor */}
                    <rect x={x + 70} y={y + 108} width="40" height="14" rx="2" fill={room.accentColor} />
                    <text x={x + 90} y={y + 24} textAnchor="middle" fill="#1E293B" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      {room.wingCode}
                    </text>
                    <text x={x + 90} y={y + 40} textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="bold">
                      {room.shortName}
                    </text>
                    <text x={x + 90} y={y + 98} textAnchor="middle" fill="#475569" fontSize="8.5">
                      {room.racks.length} Racks · {room.stations.length} Stations
                    </text>
                  </g>
                );
              })}

              {/* Bottom 4 Wing Rooms */}
              {LAB_ROOMS.slice(4, 8).map((room, idx) => {
                const x = 28 + idx * 194;
                const y = 210;
                const isActive = (hoveredWing ?? activeDepartment) === room.id;
                return (
                  <g
                    key={room.id}
                    onMouseEnter={() => setHoveredWing(room.id)}
                    onMouseLeave={() => setHoveredWing(null)}
                    onClick={() => onEnterLab(room.id, room.defaultExperimentId)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={x}
                      y={y}
                      width="180"
                      height="112"
                      rx="8"
                      fill={isActive ? '#F0F9FF' : '#F8FAFC'}
                      stroke={room.accentColor}
                      strokeWidth={isActive ? '2.4' : '1.4'}
                      strokeOpacity={isActive ? 1 : 0.75}
                    />
                    {/* Interior mini bench diagram */}
                    <rect x={x + 45} y={y + 44} width="90" height="24" rx="3" fill="#E2E8F0" stroke={room.accentColor} strokeOpacity="0.55" />
                    <rect x={x + 14} y={y + 24} width="16" height="66" rx="2" fill="#E2E8F0" />
                    <rect x={x + 150} y={y + 24} width="16" height="66" rx="2" fill="#E2E8F0" />
                    {/* Doorway connecting to corridor */}
                    <rect x={x + 70} y={y - 10} width="40" height="14" rx="2" fill={room.accentColor} />
                    <text x={x + 90} y={y + 28} textAnchor="middle" fill="#1E293B" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      {room.wingCode}
                    </text>
                    <text x={x + 90} y={y + 92} textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="bold">
                      {room.shortName}
                    </text>
                    <text x={x + 90} y={y + 104} textAnchor="middle" fill="#475569" fontSize="8.5">
                      {room.racks.length} Racks · {room.stations.length} Stations
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Right Preview Panel for Hovered / Active Wing */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-blue-700">{focusedRoom.wingCode}</span>
                <span className="text-slate-500">{focusedRoom.roomDimensionsLabel}</span>
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900">{focusedRoom.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{focusedRoom.subtitle}</p>

              <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
                <div className="font-semibold text-slate-900">Room Storage &amp; Safety Architecture:</div>
                <ul className="space-y-1 text-slate-600">
                  {focusedRoom.racks.map((rk) => (
                    <li key={rk.id} className="flex items-center justify-between">
                      <span>{rk.title}</span>
                      <span className="font-mono text-slate-900 font-semibold tabular-nums">{rk.instrumentIds.length}</span>
                    </li>
                  ))}
                  {focusedRoom.id === 'chemistry' && (
                    <li className="flex items-center justify-between text-emerald-700 font-semibold">
                      <span>Chemical &amp; Substance Vault</span>
                      <span className="font-mono tabular-nums">{CHEMISTRY_CHEMICAL_VAULT.length}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onEnterLab(focusedRoom.id, focusedRoom.defaultExperimentId)}
              className="w-full py-3 px-4 rounded-xl bg-blue-700 text-white text-sm font-bold hover:bg-blue-800 flex items-center justify-center gap-2 min-h-[46px] shadow-sm transition-colors"
            >
              <DoorOpen className="w-4 h-4" />
              Enter {focusedRoom.shortName}
            </button>
          </div>
        </div>
      </div>

      {/* 8 Dedicated Laboratory Wing Entrance Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {visibleRooms.map((room) => {
          const Icon = DEPT_ICONS[room.id];
          const toolCount = LAB_INSTRUMENTS.filter((i) => i.department === room.id).length;
          return (
            <div
              key={room.id}
              onMouseEnter={() => setHoveredWing(room.id)}
              className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between space-y-4 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs font-mono">
                  <span className="font-bold text-blue-700">{room.wingCode}</span>
                  <span className="text-slate-500 tabular-nums">
                    {toolCount} tools{room.id === 'chemistry' ? ` · ${CHEMISTRY_CHEMICAL_VAULT.length} chemicals` : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-200 flex items-center justify-center shrink-0"
                    style={{ color: room.accentColor }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-display font-bold text-slate-900 leading-snug">
                    {room.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{room.subtitle}</p>

                <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                  <strong className="text-slate-900">Stations:</strong>{' '}
                  {room.stations.map((s) => s.label).slice(0, 3).join(' · ')}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onEnterLab(room.id, room.defaultExperimentId)}
                className="w-full py-2.5 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 hover:border-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center gap-2 min-h-[44px] transition-colors"
              >
                <DoorOpen className="w-4 h-4" />
                Enter {room.shortName}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
