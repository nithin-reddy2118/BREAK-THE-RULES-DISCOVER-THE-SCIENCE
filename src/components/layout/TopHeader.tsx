import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Globe, Menu, Search, User, X } from 'lucide-react';
import { useLab } from '../../context/LabContext';
import { EXPERIMENTS } from '../../engine/experiments';
import { ALGORITHM_REGISTRY } from '../../data/algorithmRegistry';
import { WORLD_DISCOVERIES } from '../../data/discoveries';
import { INNOVATION_CHALLENGES } from '../../data/challenges';
import type { LanguageCode, PageId } from '../../types/science';
import { Modal } from '../ui/Modal';

export function TopHeader() {
  const {
    activePage,
    navigate,
    sidebarOpen,
    setSidebarOpen,
    language,
    setLanguage,
    t,
    role,
    setRole,
    demoMode,
    setDemoMode,
  } = useLab();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOutsideClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLangMenuOpen(false);
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutsideClick);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onOutsideClick);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const algoMatches = ALGORITHM_REGISTRY.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.formula.toLowerCase().includes(q)
    ).map((a) => ({
      type: 'Algorithm',
      title: a.name,
      subtitle: `${a.category} · ${a.timeComplexity.average}`,
      onSelect: () => {
        navigate('algorithm-explorer');
        setSearchOpen(false);
      },
    }));

    const expMatches = EXPERIMENTS.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        e.formula.toLowerCase().includes(q)
    ).map((e) => ({
      type: 'Experiment',
      title: e.title,
      subtitle: `${e.subject} · ${e.formula}`,
      onSelect: () => {
        navigate('virtual-lab', { experimentId: e.id });
        setSearchOpen(false);
      },
    }));

    const discMatches = WORLD_DISCOVERIES.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.institution.toLowerCase().includes(q)
    ).map((d) => ({
      type: 'Discovery',
      title: d.title,
      subtitle: `${d.category} · ${d.institution}`,
      onSelect: () => {
        navigate('discoveries');
        setSearchOpen(false);
      },
    }));

    const chalMatches = INNOVATION_CHALLENGES.filter(
      (c) => c.title.toLowerCase().includes(q) || c.theme.toLowerCase().includes(q)
    ).map((c) => ({
      type: 'Challenge',
      title: c.title,
      subtitle: c.theme,
      onSelect: () => {
        navigate('challenges');
        setSearchOpen(false);
      },
    }));

    return [...algoMatches, ...expMatches, ...discMatches, ...chalMatches].slice(0, 12);
  }, [searchQuery, navigate]);

  const topNavLinks: { id: PageId; label: string }[] = [
    { id: 'home', label: t.nav.home },
    { id: 'smart-learning', label: t.nav.smartLearning },
    { id: 'virtual-lab', label: t.nav.virtualLab },
    { id: 'algorithm-explorer', label: t.nav.algorithmExplorer },
    { id: 'explorer', label: t.nav.explorer },
  ];

  const langLabels: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Menu toggle + Single-line Brand Wordmark */}
          <div className="flex items-center gap-3 min-w-0 shrink-0">
            <button
              type="button"
              onClick={() => setSidebarOpen((s) => !s)}
              aria-label={sidebarOpen ? 'Close navigation sidebar' : 'Open navigation sidebar'}
              aria-expanded={sidebarOpen}
              className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-blue-600/40 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => navigate('home')}
              className="text-left font-display font-bold text-base sm:text-lg tracking-tight text-slate-900 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0"
            >
              Break the Rules
            </button>
          </div>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Primary navigation">
            {topNavLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => navigate(link.id)}
                  className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                    isActive
                      ? 'text-blue-700 border-blue-700 font-semibold'
                      : 'text-slate-600 border-transparent hover:text-slate-950'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Search, Language Dropdown, Role Menu */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search platform"
              className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-blue-600/40 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>

            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => {
                  setLangMenuOpen((o) => !o);
                  setProfileMenuOpen(false);
                }}
                aria-expanded={langMenuOpen}
                aria-label="Select language"
                className="px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:text-slate-950 flex items-center gap-1.5 min-h-[40px] whitespace-nowrap shrink-0"
              >
                <Globe className="w-4 h-4 text-blue-700" />
                <span className="uppercase">{language}</span>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg py-1.5 z-40">
                  {langLabels.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setLanguage(item.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-slate-50 ${
                        language === item.code ? 'text-blue-700 font-semibold' : 'text-slate-800'
                      }`}
                    >
                      <span>{item.label}</span>
                      {language === item.code && <span className="text-xs">Active</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen((o) => !o);
                  setLangMenuOpen(false);
                }}
                aria-expanded={profileMenuOpen}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 hover:border-blue-600/40 flex items-center gap-2 min-h-[40px] whitespace-nowrap shrink-0"
              >
                <User className="w-4 h-4 text-blue-700" />
                <span>{role === 'teacher' ? 'Teacher' : 'Student'}</span>
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-lg p-2 z-40 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <div className="text-xs font-semibold text-slate-900">
                      {role === 'teacher' ? 'Teacher Mode Active' : 'Student Researcher'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {demoMode ? 'Viewing Example Demo Data' : 'Personal Local Workspace'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigate('dashboard');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:text-slate-950 hover:bg-slate-50"
                  >
                    {t.nav.dashboard}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigate('my-learning');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:text-slate-950 hover:bg-slate-50"
                  >
                    {t.nav.myLearning}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole(role === 'student' ? 'teacher' : 'student');
                      setProfileMenuOpen(false);
                      if (role === 'student') navigate('teacher-mode');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-blue-700 font-medium hover:bg-blue-50"
                  >
                    Switch to {role === 'student' ? 'Teacher Mode' : 'Student View'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDemoMode(!demoMode);
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-amber-700 font-medium hover:bg-amber-50"
                  >
                    {demoMode ? 'Disable Example Demo Data' : 'Preview Example Student Data'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <Modal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Search Algorithms, Experiments, Discoveries & Challenges"
      >
        <div className="space-y-4">
          <input
            type="search"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type an algorithm, formula, or discovery (e.g. Dijkstra, Linear Regression, Pendulum, pH)..."
            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:border-blue-600 outline-none"
          />
          {!searchQuery.trim() ? (
            <p className="text-xs text-slate-500">
              Search across 22 executable algorithms, Virtual Lab experiments, World Discoveries, and Innovation Challenges.
            </p>
          ) : searchResults.length === 0 ? (
            <p className="text-sm text-slate-600">
              No matching records found for &ldquo;{searchQuery}&rdquo;. Try asking in Science Explorer.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {searchResults.map((r, idx) => (
                <button
                  key={`${r.type}-${idx}`}
                  type="button"
                  onClick={r.onSelect}
                  className="w-full text-left py-3 px-2 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-900">{r.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{r.subtitle}</div>
                  </div>
                  <span className="text-xs font-semibold text-blue-700 shrink-0">{r.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
