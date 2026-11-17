import React from 'react';
import {
  ArrowRight,
  Compass,
  Cpu,
  FlaskConical,
  Globe2,
  Lightbulb,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useLab } from '../context/LabContext';
import { EXPERIMENTS } from '../engine/experiments';
import { WORLD_DISCOVERIES } from '../data/discoveries';
import { SEED_PUBLIC_INNOVATIONS } from '../data/seedCommunity';

export function HomePage() {
  const { navigate, t, trialsByExperiment } = useLab();

  const featuredExperiments = [EXPERIMENTS[0], EXPERIMENTS[3], EXPERIMENTS[9]];
  const latestDiscoveries = WORLD_DISCOVERIES.slice(0, 3);
  const completedCount = Object.values(trialsByExperiment).filter((arr) => arr.length > 0).length;

  const categories = [
    {
      title: 'Algorithm Explorer & ML Lab',
      summary: 'Step-by-step execution across sorting, graphs, DP, regression, neural nets & real UCI datasets.',
      image: '/src/assets/images/algorithm_explorer_preview_1794918901251.jpg',
      action: () => navigate('algorithm-explorer'),
    },
    {
      title: 'Physics & Chemistry Campus',
      summary: '8 physical laboratory wings, 120 realistic instruments, 30 chemicals & live boiling simulations.',
      image: '/src/assets/images/category_physics_astronomy_1794902299199.jpg',
      action: () => navigate('virtual-lab', { experimentId: 'pendulum-period' }),
    },
    {
      title: 'Biology & Student Innovation Hub',
      summary: 'Photosynthesis saturation, pH kinetics, and teacher-reviewed global engineering prototypes.',
      image: '/src/assets/images/category_chemistry_biology_1794902300539.jpg',
      action: () => navigate('innovation-hub'),
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="pt-4 lg:pt-8">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            <div className="text-xs font-semibold text-blue-700 tracking-wide uppercase">
              Universal Science &amp; Algorithm Laboratory · Safe Inquiry Platform
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-slate-900 leading-[1.12] [text-wrap:balance]">
              {t.appName}
            </h1>
            <p className="text-lg text-slate-700 leading-relaxed max-w-xl">
              {t.tagline}
            </p>
            <p className="text-sm text-slate-600 max-w-xl">
              {t.secondaryTagline}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('algorithm-explorer')}
                className="px-5 py-3 rounded-lg bg-blue-700 text-white font-semibold text-sm hover:bg-blue-800 transition-colors flex items-center gap-2 min-h-[44px] shadow-sm"
              >
                <Cpu className="w-4 h-4" />
                {t.nav.algorithmExplorer}
              </button>
              <button
                type="button"
                onClick={() => navigate('virtual-lab')}
                className="px-5 py-3 rounded-lg bg-white border border-slate-200 text-slate-900 font-semibold text-sm hover:border-blue-400 hover:bg-blue-50/50 transition-colors flex items-center gap-2 min-h-[44px] shadow-sm"
              >
                <FlaskConical className="w-4 h-4 text-blue-700" />
                {t.actions.exploreExperiments}
              </button>
              <button
                type="button"
                onClick={() => navigate('explorer')}
                className="px-5 py-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium text-sm hover:text-slate-900 hover:bg-slate-200/70 transition-colors flex items-center gap-2 min-h-[44px]"
              >
                <Compass className="w-4 h-4 text-teal-600" />
                {t.actions.startExploring}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[300px] rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              <img
                src="/src/assets/images/hero_light_science_lab_1794918901049.jpg"
                alt="Bright sunlit university virtual science laboratory with glassware, microscope, and interactive digital monitor"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900/80 via-slate-900/35 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-100">
                <span className="font-semibold text-white">8 Campus Lab Rooms · 22 Interactive Algorithms</span>
                <span>Deterministic Physics · Real UCI Datasets</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platforms Preview */}
      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900">Explore Core Workspaces</h2>
            <p className="text-sm text-slate-600 mt-1">
              Jump directly into interactive algorithms, physical campus labs, or verified student engineering prototypes.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.title}
              type="button"
              onClick={cat.action}
              className="group text-left rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-blue-300 hover:shadow-md transition-all flex flex-col"
            >
              <div className="h-44 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                <img
                  src={cat.image}
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{cat.summary}</p>
                </div>
                <div className="text-xs font-semibold text-blue-700 flex items-center gap-1">
                  Open workspace <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Experiments */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900">Featured Virtual Experiments</h2>
            <p className="text-sm text-slate-600 mt-1">
              Test predictions, save up to 10 trials, and inspect graphs built from deterministic equations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('virtual-lab')}
            className="text-sm font-semibold text-blue-700 hover:underline flex items-center gap-1"
          >
            View all 10 experiments <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredExperiments.map((exp) => (
            <div
              key={exp.id}
              className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-2">
                <div className="text-xs text-slate-500">
                  Experiment {exp.number} · {exp.subject}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{exp.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-2">{exp.principle}</p>
                <div className="pt-2 font-mono text-xs text-blue-700 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100">
                  {exp.formula}
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate('virtual-lab', { experimentId: exp.id })}
                  className="text-sm font-semibold text-blue-700 hover:underline"
                >
                  Launch Experiment →
                </button>
                <button
                  type="button"
                  onClick={() => navigate('what-if', { whatIfExpId: exp.id })}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  What If
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Verified Discoveries + Innovation Hub Preview */}
      <section className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-blue-700" />
              Latest Verified Discoveries
            </h2>
            <button
              type="button"
              onClick={() => navigate('discoveries')}
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              Explore all →
            </button>
          </div>
          <div className="space-y-3">
            {latestDiscoveries.map((d) => (
              <div
                key={d.id}
                className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="text-xs text-slate-500">
                    {d.category} · {d.status} · {d.date}
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{d.title}</div>
                  <div className="text-xs text-slate-600">{d.institution}</div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('discoveries')}
                  className="text-xs font-semibold text-blue-700 shrink-0 hover:underline"
                >
                  Read &amp; Explain →
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-teal-600" />
              Global Innovation Hub
            </h2>
            <button
              type="button"
              onClick={() => navigate('innovation-hub')}
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              Open Hub →
            </button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
            <p className="text-sm text-slate-600">
              Students design safe inventions backed by real scientific models. All public showcases require teacher review and protect student privacy.
            </p>
            <div className="space-y-2.5">
              {SEED_PUBLIC_INNOVATIONS.slice(0, 2).map((inn) => (
                <div key={inn.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs text-emerald-700 font-medium">
                    Approved Showcase · {inn.anonymousAlias}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">{inn.title}</div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => navigate('innovation-hub')}
              className="w-full py-2.5 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors"
            >
              Build an Innovation Idea
            </button>
          </div>
        </div>
      </section>

      {/* Safety Guardian & Learning Journey Previews */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <ShieldAlert className="w-4 h-4" />
              Student Safety Guardian
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900">
              Conservative GREEN · AMBER · RED Protection
            </h3>
            <p className="text-sm text-slate-600">
              Blocks hazardous mixtures, unknown substances, and mains electricity instructions automatically—while offering safe virtual lab alternatives.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('safety')}
            className="self-start px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 hover:border-blue-400 hover:text-blue-700 transition-colors"
          >
            Inspect Safety Rules
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-blue-700">Your Learning Journey</div>
            <h3 className="text-lg font-display font-bold text-slate-900">
              {completedCount > 0
                ? `${completedCount} of 10 Virtual Lab experiments have recorded trials`
                : 'Start your first experiment to track genuine progress'}
            </h3>
            <p className="text-sm text-slate-600">
              Track predictions, trials, lab reports, and earned achievements without fabricated scores.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="self-start px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 hover:border-blue-400 hover:text-blue-700 transition-colors"
          >
            Open Student Dashboard
          </button>
        </div>
      </section>
    </div>
  );
}
