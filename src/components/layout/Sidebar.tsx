import React, { useEffect } from 'react';
import {
  Award,
  BookOpen,
  Compass,
  Cpu,
  FlaskConical,
  Globe2,
  GraduationCap,
  HelpCircle,
  Home,
  LayoutDashboard,
  Lightbulb,
  PlusCircle,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import { useLab } from '../../context/LabContext';
import type { PageId } from '../../types/science';

interface NavGroup {
  title: string;
  items: { id: PageId; label: string; icon: React.ComponentType<{ className?: string }> }[];
}

export function Sidebar() {
  const { activePage, navigate, sidebarOpen, setSidebarOpen, t } = useLab();

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen, setSidebarOpen]);

  const groups: NavGroup[] = [
    {
      title: 'Core Laboratory',
      items: [
        { id: 'home', label: t.nav.home, icon: Home },
        { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
        { id: 'virtual-lab', label: t.nav.virtualLab, icon: FlaskConical },
        { id: 'algorithm-explorer', label: t.nav.algorithmExplorer, icon: Cpu },
        { id: 'explorer', label: t.nav.explorer, icon: Compass },
        { id: 'creator', label: t.nav.creator, icon: PlusCircle },
      ],
    },
    {
      title: 'Inquiry & Safety',
      items: [
        { id: 'what-if', label: t.nav.whatIf, icon: Sparkles },
        { id: 'detective', label: t.nav.detective, icon: HelpCircle },
        { id: 'safety', label: t.nav.safety, icon: ShieldAlert },
        { id: 'trust-centre', label: t.nav.trustCentre, icon: ShieldCheck },
      ],
    },
    {
      title: 'Global Platform',
      items: [
        { id: 'innovation-hub', label: t.nav.innovationHub, icon: Lightbulb },
        { id: 'discoveries', label: t.nav.discoveries, icon: Globe2 },
        { id: 'challenges', label: t.nav.challenges, icon: Trophy },
      ],
    },
    {
      title: 'Progress & Administration',
      items: [
        { id: 'my-learning', label: t.nav.myLearning, icon: BookOpen },
        { id: 'achievements', label: t.nav.achievements, icon: Award },
        { id: 'teacher-mode', label: t.nav.teacherMode, icon: GraduationCap },
        { id: 'settings', label: t.nav.settings, icon: Settings },
      ],
    },
  ];

  const handleSelect = (id: PageId) => {
    navigate(id);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  if (!sidebarOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-xs lg:hidden"
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        aria-label="Platform sidebar navigation"
        className="fixed top-16 left-0 bottom-0 z-40 w-72 border-r border-slate-200 bg-white flex flex-col overflow-hidden shadow-lg"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/70">
          <span className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
            Platform Directory
          </span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {groups.map((group) => (
            <div key={group.title}>
              <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[42px] ${
                        active
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                          : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-transparent'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-700' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
