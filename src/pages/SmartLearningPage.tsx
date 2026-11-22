import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Cpu,
  Download,
  FileText,
  FlaskConical,
  GraduationCap,
  HelpCircle,
  Languages,
  Loader2,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { ConceptVideoPlayer } from '../components/smart/ConceptVideoPlayer';
import { ProcedureFirstExperimentView } from '../components/smart/ProcedureFirstExperimentView';
import { useLab } from '../context/LabContext';
import { buildDeterministicSmartLesson, buildSrtContent } from '../engine/smartLessonEngine';
import type {
  EducationLevel,
  EnvironmentCapabilities,
  LearningStyle,
  SmartLanguage,
  SmartLessonHistoryItem,
  SmartLessonPackage,
  SmartQuizAttempt,
  SmartSubject,
  VideoDurationPreset,
} from '../types/smartLearning';

const HISTORY_STORAGE_KEY = 'btr_smart_learning_history_v1';
const QUIZ_STORAGE_KEY = 'btr_smart_learning_quizzes_v1';

type StudioTab =
  | 'all'
  | 'mathematics'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'computer-science'
  | 'saved';

interface CuratedPrompt {
  label: string;
  query: string;
  subject: SmartSubject;
  lang?: SmartLanguage;
}

const CURATED_PROMPTS: CuratedPrompt[] = [
  {
    label: 'Pythagoras Theorem (a² + b² = c²)',
    query: 'Explain Pythagoras theorem step-by-step with a worked example',
    subject: 'mathematics',
  },
  {
    label: "Newton's Second Law (F = m·a)",
    query: "Explain Newton's second law F=ma with moving cart simulation",
    subject: 'physics',
  },
  {
    label: "Verify Ohm's Law (Practical)",
    query: "Verify Ohm's law circuit experiment with ammeter and voltmeter",
    subject: 'physics',
  },
  {
    label: 'Boiling Point & Altitude',
    query: 'Why does water boil at lower temperature on mountains?',
    subject: 'chemistry',
  },
  {
    label: 'Heating CuSO₄ in Test Tube',
    query: 'Heating aqueous Copper(II) Sulfate in a test tube practical experiment',
    subject: 'chemistry',
  },
  {
    label: 'Acid–Base Neutralisation',
    query: 'Acid-base neutralisation HCl + NaOH titration with indicator',
    subject: 'chemistry',
  },
  {
    label: 'Photosynthesis in Chloroplast',
    query: 'Explain photosynthesis inside plant chloroplasts with chemical equation',
    subject: 'biology',
  },
  {
    label: 'Binary Search (O(log n))',
    query: 'Binary Search algorithm step-by-step visualization',
    subject: 'computer-science',
  },
  {
    label: 'Merge Sort (Divide & Conquer)',
    query: 'Merge Sort sorting algorithm step-by-step trace',
    subject: 'computer-science',
  },
  {
    label: 'CPU Fetch-Decode-Execute',
    query: 'How a CPU fetch-decode-execute instruction cycle works',
    subject: 'computer-science',
  },
  {
    label: 'ಪೈಥಾಗೊರಸ್ ಪ್ರಮೇಯ (Kannada)',
    query: 'ಪೈಥಾಗೊರಸ್ ಪ್ರಮೇಯ (Pythagoras theorem) ಹಂತ ಹಂತವಾಗಿ ವಿವರಿಸಿ',
    subject: 'mathematics',
    lang: 'kn',
  },
  {
    label: 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ (Kannada)',
    query: 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ (Photosynthesis) ಪ್ರಕ್ರಿಯೆಯನ್ನು ವಿವರಿಸಿ',
    subject: 'biology',
    lang: 'kn',
  },
];

function loadHistory(): SmartLessonHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadQuizAttempts(): SmartQuizAttempt[] {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function SmartLearningPage() {
  const { language: appLanguage, navigate, recordSafetyCheck } = useLab();

  const [capabilities, setCapabilities] = useState<EnvironmentCapabilities | null>(null);
  const [studioTab, setStudioTab] = useState<StudioTab>('all');
  const [topicQuery, setTopicQuery] = useState<string>(
    'Explain Pythagoras theorem step-by-step with a worked example'
  );
  const [lessonLang, setLessonLang] = useState<SmartLanguage>(
    appLanguage === 'kn' ? 'kn' : 'en'
  );
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('classes-8-10');
  const [learningStyle, setLearningStyle] = useState<LearningStyle>('visual');
  const [durationPreset, setDurationPreset] = useState<VideoDurationPreset>('standard');

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [safetyBlock, setSafetyBlock] = useState<{
    title: string;
    summary: string;
    reasons: string[];
    safeVirtualAlternative: string;
  } | null>(null);

  const [activeLesson, setActiveLesson] = useState<SmartLessonPackage | null>(() =>
    buildDeterministicSmartLesson({
      topicQuery: 'Explain Pythagoras theorem step-by-step with a worked example',
      language: appLanguage === 'kn' ? 'kn' : 'en',
      educationLevel: 'classes-8-10',
      learningStyle: 'visual',
      durationPreset: 'standard',
    })
  );

  // Interactive Canvas Parameter State
  const [paramA, setParamA] = useState(3);
  const [paramB, setParamB] = useState(4);
  const [forceN, setForceN] = useState(12);
  const [massKg, setMassKg] = useState(3);
  const [voltageV, setVoltageV] = useState(12);
  const [resistanceOhm, setResistanceOhm] = useState(4);
  const [arrayInputText, setArrayInputText] = useState('4, 11, 18, 25, 33, 42, 57, 68, 84');
  const [targetInputVal, setTargetInputVal] = useState(42);

  // Quiz & Script Section State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  // Local History & Quiz Scores
  const [history, setHistory] = useState<SmartLessonHistoryItem[]>(loadHistory);
  const [quizAttempts, setQuizAttempts] = useState<SmartQuizAttempt[]>(loadQuizAttempts);

  const videoSectionRef = useRef<HTMLDivElement | null>(null);
  const quizSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/api/smart-learning/capabilities')
      .then((r) => r.json())
      .then((data: EnvironmentCapabilities) => setCapabilities(data))
      .catch(() => setCapabilities(null));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, 30)));
    } catch {
      // Ignore storage quota issues silently
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizAttempts.slice(0, 40)));
    } catch {
      // Ignore storage quota issues silently
    }
  }, [quizAttempts]);

  const syncInteractiveDefaults = (pkg: SmartLessonPackage) => {
    const d = pkg.interactiveDefaults;
    if (d.a !== undefined) setParamA(d.a);
    if (d.b !== undefined) setParamB(d.b);
    if (d.forceN !== undefined) setForceN(d.forceN);
    if (d.massKg !== undefined) setMassKg(d.massKg);
    if (d.voltageV !== undefined) setVoltageV(d.voltageV);
    if (d.resistanceOhm !== undefined) setResistanceOhm(d.resistanceOhm);
    if (d.arrayValues && d.arrayValues.length > 0) setArrayInputText(d.arrayValues.join(', '));
    if (d.targetValue !== undefined) setTargetInputVal(d.targetValue);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const upsertHistory = (pkg: SmartLessonPackage, markSaved?: boolean) => {
    setHistory((prev) => {
      const existing = prev.find((h) => h.lesson.id === pkg.id);
      if (existing) {
        return prev.map((h) =>
          h.lesson.id === pkg.id
            ? {
                ...h,
                lesson: pkg,
                saved: markSaved !== undefined ? markSaved : h.saved,
                lastViewedAt: new Date().toISOString(),
              }
            : h
        );
      }
      const next: SmartLessonHistoryItem = {
        id: pkg.id,
        lesson: pkg,
        saved: Boolean(markSaved),
        lastViewedAt: new Date().toISOString(),
      };
      return [next, ...prev].slice(0, 25);
    });
  };

  const generateLesson = async (
    overrideQuery?: string,
    overrideLang?: SmartLanguage,
    overrideStyle?: LearningStyle
  ) => {
    const q = (overrideQuery ?? topicQuery).trim();
    const lang = overrideLang ?? lessonLang;
    const style = overrideStyle ?? learningStyle;

    if (!q) {
      setErrorMsg('Please enter a STEM topic, formula, theorem, experiment, or algorithm to generate a lesson.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setAiNotice(null);
    setSafetyBlock(null);

    try {
      const preferredSubject =
        studioTab !== 'all' && studioTab !== 'saved' ? studioTab : 'auto';
      const resp = await fetch('/api/smart-learning/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicQuery: q,
          language: lang,
          educationLevel,
          learningStyle: style,
          durationPreset,
          preferredSubject,
        }),
      });
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data?.error || 'Could not generate lesson right now.');
      }

      if (data.blockedBySafety && data.safety) {
        recordSafetyCheck(q, 'RED');
        setSafetyBlock({
          title: data.safety.title,
          summary: data.safety.summary,
          reasons: data.safety.reasons || [],
          safeVirtualAlternative: data.safety.safeVirtualAlternative || '',
        });
        return;
      }

      if (data.lesson) {
        const pkg = data.lesson as SmartLessonPackage;
        setActiveLesson(pkg);
        syncInteractiveDefaults(pkg);
        upsertHistory(pkg);
        recordSafetyCheck(q, pkg.safetyClassification);
        if (data.aiWarning) {
          setAiNotice(data.aiWarning);
        }
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? `${err.message} Loading our verified local STEM lesson generator instead.`
          : 'Network error while generating lesson.'
      );
      // Graceful deterministic client-side fallback so user never hits a dead end
      const local = buildDeterministicSmartLesson({
        topicQuery: q,
        language: lang,
        educationLevel,
        learningStyle: style,
        durationPreset,
      });
      setActiveLesson(local);
      syncInteractiveDefaults(local);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyInteractiveParamsToLesson = () => {
    if (!activeLesson) return;
    const parsedArr = arrayInputText
      .split(/[,\s;]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n));

    const updated = buildDeterministicSmartLesson({
      topicQuery: activeLesson.topicQuery,
      language: activeLesson.language,
      educationLevel: activeLesson.educationLevel,
      learningStyle: activeLesson.learningStyle,
      durationPreset: activeLesson.durationPreset,
      customParams: {
        a: paramA,
        b: paramB,
        forceN,
        massKg,
        voltageV,
        resistanceOhm,
        arrayValues: parsedArr.length >= 3 ? parsedArr.slice(0, 12) : undefined,
        targetValue: targetInputVal,
      },
    });
    setActiveLesson(updated);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleToggleSaveLesson = () => {
    if (!activeLesson) return;
    const existing = history.find((h) => h.lesson.id === activeLesson.id);
    const nextSaved = !(existing?.saved ?? false);
    upsertHistory(activeLesson, nextSaved);
  };

  const isCurrentLessonSaved = useMemo(() => {
    if (!activeLesson) return false;
    return history.some((h) => h.lesson.id === activeLesson.id && h.saved);
  }, [activeLesson, history]);

  const handleDownloadSrt = () => {
    if (!activeLesson) return;
    const srt = buildSrtContent(activeLesson.subtitleSegments);
    const blob = new Blob([srt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeLesson.topicTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleQuizSubmit = () => {
    if (!activeLesson) return;
    let score = 0;
    activeLesson.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) score += 1;
    });
    setQuizSubmitted(true);
    setQuizAttempts((prev) => [
      {
        id: `qa-${Date.now()}`,
        lessonId: activeLesson.id,
        topicTitle: activeLesson.topicTitle,
        subject: activeLesson.subject,
        language: activeLesson.language,
        score,
        total: activeLesson.quiz.length,
        completedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setHistory((prev) =>
      prev.map((h) =>
        h.lesson.id === activeLesson.id
          ? { ...h, bestQuizScore: Math.max(h.bestQuizScore ?? 0, score) }
          : h
      )
    );
  };

  const visiblePrompts = useMemo(() => {
    if (studioTab === 'all' || studioTab === 'saved') return CURATED_PROMPTS;
    return CURATED_PROMPTS.filter((p) => p.subject === studioTab);
  }, [studioTab]);

  const savedHistoryItems = useMemo(
    () => history.filter((h) => h.saved || studioTab === 'saved'),
    [history, studioTab]
  );

  const quizScore = useMemo(() => {
    if (!activeLesson) return 0;
    return activeLesson.quiz.reduce(
      (sum, q) => sum + (quizAnswers[q.id] === q.correctIndex ? 1 : 0),
      0
    );
  }, [activeLesson, quizAnswers]);

  const studioTabs: { id: StudioTab; label: string }[] = [
    { id: 'all', label: 'All STEM' },
    { id: 'mathematics', label: 'Mathematics' },
    { id: 'physics', label: 'Physics' },
    { id: 'chemistry', label: 'Chemistry' },
    { id: 'biology', label: 'Biology' },
    { id: 'computer-science', label: 'CS & Algorithms' },
    { id: 'saved', label: `Saved Library (${history.filter((h) => h.saved).length})` },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Studio Header */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-blue-700 tracking-wide">
              AI Smart Learning · Interactive Concept Studio &amp; Bilingual STEM Theater
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight [text-wrap:balance]">
              Visual Concept Explanations, Worked Proofs &amp; Practical Labs
            </h1>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              Ask any Mathematics, Physics, Chemistry, Biology, or Computer Science concept in English or ಕನ್ನಡ. Every lesson grounds equations and laboratory observations in our deterministic STEM engine, renders interactive step-by-step animations, and compiles real H.264 MP4 videos via FFmpeg.
            </p>
          </div>
          {capabilities && (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 space-y-1 shadow-sm max-w-xs">
              <div className="font-semibold text-slate-900">Runtime Pipeline Capabilities</div>
              <div className="flex items-center gap-2">
                <span>Animation:</span>
                <span className="font-mono text-emerald-700 font-semibold">Canvas 2D Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <span>MP4 Export:</span>
                <span
                  className={`font-mono font-semibold ${
                    capabilities.ffmpegInstalled ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {capabilities.ffmpegInstalled ? 'FFmpeg H.264 Ready' : 'FFmpeg Not Detected'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Voice &amp; AI:</span>
                <span
                  className={`font-mono font-semibold ${
                    capabilities.geminiConfigured ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {capabilities.geminiConfigured ? 'Gemini API Active' : 'Verified Local Mode'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Subject Studio Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 w-fit max-w-full overflow-x-auto">
          {studioTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStudioTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                studioTab === tab.id
                  ? 'bg-white text-blue-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Saved Library View */}
      {studioTab === 'saved' ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-bold text-slate-900">
              Saved Smart Learning Lessons &amp; Recent Quiz Scores
            </h2>
            <span className="text-xs text-slate-500 tabular-nums">
              {history.length} recent · {quizAttempts.length} quiz attempts
            </span>
          </div>
          {savedHistoryItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-semibold text-slate-900">No saved lessons yet</div>
              <p className="text-xs text-slate-600">
                Generate any lesson and click &ldquo;Save Lesson&rdquo; to bookmark it here with your quiz scores.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedHistoryItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between gap-3 shadow-sm"
                >
                  <div className="space-y-1.5">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span className="capitalize font-medium text-blue-700">{item.lesson.subject}</span>
                      <span>·</span>
                      <span>{item.lesson.language === 'kn' ? 'ಕನ್ನಡ' : 'English'}</span>
                      {item.bestQuizScore !== undefined && (
                        <>
                          <span>·</span>
                          <span className="font-mono text-emerald-700 tabular-nums">
                            Best Quiz {item.bestQuizScore}/{item.lesson.quiz.length}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-base font-display font-bold text-slate-900 leading-snug">
                      {item.lesson.topicTitle}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {item.lesson.topicIntroduction}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveLesson(item.lesson);
                        setTopicQuery(item.lesson.topicQuery);
                        setLessonLang(item.lesson.language);
                        syncInteractiveDefaults(item.lesson);
                        setStudioTab('all');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Open Lesson
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setHistory((prev) => prev.filter((h) => h.id !== item.id))
                      }
                      aria-label="Remove lesson from history"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Lesson Generator Controls Card */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                generateLesson();
              }}
              className="space-y-4"
            >
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="smart-topic-input" className="text-xs font-semibold text-slate-700 block mb-1.5">
                    STEM Topic, Formula, Practical Experiment, or Algorithm
                  </label>
                  <input
                    id="smart-topic-input"
                    type="text"
                    value={topicQuery}
                    onChange={(e) => setTopicQuery(e.target.value)}
                    placeholder="e.g., Pythagoras theorem, Ohm's law circuit, Heating CuSO4, Binary Search, ಅಥವಾ ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full md:w-auto px-6 py-3 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-50 flex items-center justify-center gap-2 min-h-[46px] whitespace-nowrap shrink-0"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Building Lesson...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Visual Lesson
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Studio Parameters Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Language
                  </label>
                  <div className="flex p-0.5 rounded-lg bg-slate-100 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setLessonLang('en')}
                      className={`flex-1 py-1.5 rounded-md text-xs font-medium ${
                        lessonLang === 'en' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-slate-600'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setLessonLang('kn')}
                      className={`flex-1 py-1.5 rounded-md text-xs font-medium ${
                        lessonLang === 'kn' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-slate-600'
                      }`}
                    >
                      ಕನ್ನಡ (Kannada)
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="smart-level-select" className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Student Level
                  </label>
                  <select
                    id="smart-level-select"
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 min-h-[38px]"
                  >
                    <option value="classes-5-7">Classes 5–7 (Foundational)</option>
                    <option value="classes-8-10">Classes 8–10 (High School)</option>
                    <option value="classes-11-12">Classes 11–12 (Senior Secondary)</option>
                    <option value="undergraduate">Undergraduate STEM</option>
                    <option value="engineering">Engineering &amp; Systems</option>
                    <option value="advanced">Advanced Research</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="smart-style-select" className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Explanation Style
                  </label>
                  <select
                    id="smart-style-select"
                    value={learningStyle}
                    onChange={(e) => setLearningStyle(e.target.value as LearningStyle)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 min-h-[38px]"
                  >
                    <option value="visual">Visual-First Animation</option>
                    <option value="simple">Simple Intuitive</option>
                    <option value="detailed">Detailed Quantitative</option>
                    <option value="practical">Procedure-First Lab Practical</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="smart-duration-select" className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Animation Pacing
                  </label>
                  <select
                    id="smart-duration-select"
                    value={durationPreset}
                    onChange={(e) => setDurationPreset(e.target.value as VideoDurationPreset)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 min-h-[38px]"
                  >
                    <option value="short">Short (~15s quick concept)</option>
                    <option value="standard">Standard (~25s balanced)</option>
                    <option value="detailed">Detailed (~35s deep steps)</option>
                  </select>
                </div>
              </div>
            </form>

            {/* Quick Example Chips */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-semibold text-slate-500">
                Try a verified STEM module:
              </div>
              <div className="flex flex-wrap gap-2">
                {visiblePrompts.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      const nextLang = p.lang ?? lessonLang;
                      setTopicQuery(p.query);
                      if (p.lang) setLessonLang(p.lang);
                      generateLesson(p.query, nextLang);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50/50 transition-colors whitespace-nowrap shrink-0"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Safety Guardian Block Banner */}
          {safetyBlock && (
            <section className="rounded-2xl border border-rose-300 bg-rose-50 p-5 space-y-3">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-6 h-6 text-rose-700 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-rose-800 uppercase">
                    Safety Guardian Block · Educational Protection Active
                  </div>
                  <h2 className="text-lg font-display font-bold text-slate-900">
                    {safetyBlock.title}
                  </h2>
                  <p className="text-sm text-slate-700">{safetyBlock.summary}</p>
                  {safetyBlock.reasons.length > 0 && (
                    <ul className="list-disc pl-5 text-xs text-rose-900 space-y-0.5">
                      {safetyBlock.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  )}
                  {safetyBlock.safeVirtualAlternative && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTopicQuery(safetyBlock.safeVirtualAlternative);
                          generateLesson(safetyBlock.safeVirtualAlternative);
                        }}
                        className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800"
                      >
                        Explore Safe Alternative: {safetyBlock.safeVirtualAlternative}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Error / Fallback Notice */}
          {(errorMsg || aiNotice) && (
            <div
              className={`rounded-xl border px-4 py-3 text-xs flex items-center justify-between gap-3 ${
                errorMsg
                  ? 'border-rose-200 bg-rose-50 text-rose-800'
                  : 'border-amber-200 bg-amber-50 text-amber-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {errorMsg || aiNotice}
              </span>
              {errorMsg && (
                <button
                  type="button"
                  onClick={() => generateLesson()}
                  className="font-semibold underline shrink-0"
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {/* Active Lesson Workspace */}
          {activeLesson && (
            <div className="space-y-8">
              {/* Lesson Title & Unboxed Metadata Strip */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-blue-700 capitalize">
                        {activeLesson.subject.replace('-', ' ')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{activeLesson.learningMode.replace('-', ' ')}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeLesson.language === 'kn' ? 'ಕನ್ನಡ' : 'English'}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {activeLesson.sourceMode === 'ai-grounded'
                          ? `AI Grounded (${activeLesson.modelUsed || 'Gemini'})`
                          : 'Deterministic Verified Model'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          activeLesson.safetyClassification === 'GREEN'
                            ? 'text-emerald-700 font-semibold'
                            : 'text-amber-700 font-semibold'
                        }
                      >
                        Safety: {activeLesson.safetyClassification}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight [text-wrap:balance]">
                      {activeLesson.topicTitle}
                    </h2>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {activeLesson.topicIntroduction}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleSaveLesson}
                      className={`px-3.5 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 min-h-[40px] ${
                        isCurrentLessonSaved
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-blue-400'
                      }`}
                    >
                      {isCurrentLessonSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                      {isCurrentLessonSaved ? 'Saved' : 'Save Lesson'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadSrt}
                      className="px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs font-medium hover:text-slate-950 flex items-center gap-1.5 min-h-[40px]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download .SRT
                    </button>
                  </div>
                </div>
                <div className="text-xs text-slate-500 border-t border-slate-100 pt-3">
                  {activeLesson.validationNote}
                </div>
              </div>

              {/* Animated Visual Theater + Live Interactive Sandbox Sliders */}
              <div ref={videoSectionRef} className="grid lg:grid-cols-12 gap-6 items-start">
                <div
                  className={
                    activeLesson.interactiveDefaults.kind !== 'none'
                      ? 'lg:col-span-8'
                      : 'lg:col-span-12'
                  }
                >
                  <ConceptVideoPlayer
                    lesson={activeLesson}
                    capabilities={capabilities}
                    interactiveParams={{
                      a: paramA,
                      b: paramB,
                      forceN,
                      massKg,
                      voltageV,
                      resistanceOhm,
                    }}
                    onLanguageSwitch={(lang) => {
                      setLessonLang(lang);
                      generateLesson(activeLesson.topicQuery, lang);
                    }}
                    onMp4Generated={(mp4Url, durationSec) => {
                      setHistory((prev) =>
                        prev.map((h) =>
                          h.lesson.id === activeLesson.id
                            ? {
                                ...h,
                                renderedMp4Url: mp4Url,
                                renderedVideoDurationSec: durationSec,
                              }
                            : h
                        )
                      );
                    }}
                  />
                </div>

                {/* Live Interactive Simulation Controls */}
                {activeLesson.interactiveDefaults.kind !== 'none' && (
                  <aside className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-blue-700">
                        Live Parameter Controls
                      </div>
                      <h3 className="text-base font-display font-bold text-slate-900">
                        Modify Values &amp; Watch Animation React
                      </h3>
                      <p className="text-xs text-slate-600">
                        Drag any slider to update the visual geometry and formulas inside the video frame immediately.
                      </p>
                    </div>

                    {activeLesson.interactiveDefaults.kind === 'pythagoras' && (
                      <div className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-700 font-medium">Base (a)</span>
                            <span className="font-mono font-bold text-blue-700 tabular-nums">
                              {paramA} cm
                            </span>
                          </div>
                          <input
                            type="range"
                            aria-label="Triangle base a"
                            min={1}
                            max={12}
                            step={1}
                            value={paramA}
                            onChange={(e) => setParamA(Number(e.target.value))}
                            className="w-full accent-blue-700 cursor-pointer"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-700 font-medium">Height (b)</span>
                            <span className="font-mono font-bold text-emerald-700 tabular-nums">
                              {paramB} cm
                            </span>
                          </div>
                          <input
                            type="range"
                            aria-label="Triangle height b"
                            min={1}
                            max={12}
                            step={1}
                            value={paramB}
                            onChange={(e) => setParamB(Number(e.target.value))}
                            className="w-full accent-emerald-700 cursor-pointer"
                          />
                        </div>
                        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 font-mono tabular-nums space-y-1">
                          <div>a² + b² = {paramA * paramA} + {paramB * paramB} = {paramA * paramA + paramB * paramB}</div>
                          <div className="font-bold text-slate-900">
                            c = √{paramA * paramA + paramB * paramB} ={' '}
                            {Math.sqrt(paramA * paramA + paramB * paramB).toFixed(2)} cm
                          </div>
                        </div>
                      </div>
                    )}

                    {activeLesson.interactiveDefaults.kind === 'newtons-law' && (
                      <div className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-700 font-medium">Net Force (F)</span>
                            <span className="font-mono font-bold text-blue-700 tabular-nums">
                              {forceN} N
                            </span>
                          </div>
                          <input
                            type="range"
                            aria-label="Net Force in Newtons"
                            min={2}
                            max={60}
                            step={1}
                            value={forceN}
                            onChange={(e) => setForceN(Number(e.target.value))}
                            className="w-full accent-blue-700 cursor-pointer"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-700 font-medium">Mass (m)</span>
                            <span className="font-mono font-bold text-emerald-700 tabular-nums">
                              {massKg} kg
                            </span>
                          </div>
                          <input
                            type="range"
                            aria-label="Mass in kilograms"
                            min={1}
                            max={20}
                            step={1}
                            value={massKg}
                            onChange={(e) => setMassKg(Number(e.target.value))}
                            className="w-full accent-emerald-700 cursor-pointer"
                          />
                        </div>
                        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 font-mono tabular-nums font-bold text-slate-900">
                          a = F / m = {forceN} / {massKg} = {(forceN / massKg).toFixed(2)} m/s²
                        </div>
                      </div>
                    )}

                    {activeLesson.interactiveDefaults.kind === 'ohms-law' && (
                      <div className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-700 font-medium">Voltage (V)</span>
                            <span className="font-mono font-bold text-blue-700 tabular-nums">
                              {voltageV} V
                            </span>
                          </div>
                          <input
                            type="range"
                            aria-label="Voltage in Volts"
                            min={1}
                            max={24}
                            step={1}
                            value={voltageV}
                            onChange={(e) => setVoltageV(Number(e.target.value))}
                            className="w-full accent-blue-700 cursor-pointer"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-700 font-medium">Resistance (R)</span>
                            <span className="font-mono font-bold text-emerald-700 tabular-nums">
                              {resistanceOhm} Ω
                            </span>
                          </div>
                          <input
                            type="range"
                            aria-label="Resistance in Ohms"
                            min={1}
                            max={40}
                            step={1}
                            value={resistanceOhm}
                            onChange={(e) => setResistanceOhm(Number(e.target.value))}
                            className="w-full accent-emerald-700 cursor-pointer"
                          />
                        </div>
                        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 font-mono tabular-nums font-bold text-slate-900">
                          I = V / R = {voltageV} / {resistanceOhm} = {(voltageV / resistanceOhm).toFixed(2)} A
                        </div>
                      </div>
                    )}

                    {(activeLesson.interactiveDefaults.kind === 'binary-search' ||
                      activeLesson.interactiveDefaults.kind === 'sorting') && (
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="font-medium text-slate-700 block mb-1">
                            Input Array (comma-separated numbers)
                          </label>
                          <input
                            type="text"
                            value={arrayInputText}
                            onChange={(e) => setArrayInputText(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-mono text-xs text-slate-900"
                          />
                        </div>
                        {activeLesson.interactiveDefaults.kind === 'binary-search' && (
                          <div>
                            <label className="font-medium text-slate-700 block mb-1">
                              Search Target Value
                            </label>
                            <input
                              type="number"
                              value={targetInputVal}
                              onChange={(e) => setTargetInputVal(Number(e.target.value))}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-mono text-xs text-slate-900"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {activeLesson.interactiveDefaults.kind === 'boiling' ? (
                      <button
                        type="button"
                        onClick={() => navigate('virtual-lab', { experimentId: 'boiling-point' })}
                        className="w-full px-4 py-2.5 rounded-lg bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 flex items-center justify-center gap-1.5"
                      >
                        <FlaskConical className="w-4 h-4" />
                        Open Boiling Point Lab Simulation
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyInteractiveParamsToLesson}
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Re-sync Worked Examples &amp; Scenes
                      </button>
                    )}
                  </aside>
                )}
              </div>

              {/* Procedure-First Practical Workflow (when topic is an experiment) */}
              {activeLesson.experimentPrep && (
                <ProcedureFirstExperimentView
                  prep={activeLesson.experimentPrep}
                  onJumpToDemo={() =>
                    videoSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
                  }
                  onJumpToQuiz={() =>
                    quizSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
                  }
                />
              )}

              {/* Structured 15-Section Educational Curriculum Grid */}
              <section className="grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
                  <div className="text-xs font-semibold text-blue-700">
                    01–02 · Formal Meaning &amp; Definition
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {activeLesson.meaningAndDefinition}
                  </p>
                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-xs font-semibold text-slate-900 mb-1">
                      03 · Why This Concept Matters
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {activeLesson.whyConceptMatters}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
                  <div className="text-xs font-semibold text-blue-700">
                    04–05 · Scientific Principle &amp; Formulas
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {activeLesson.scientificOrMathPrinciple}
                  </p>
                  <div className="space-y-1.5 pt-1">
                    {activeLesson.formulasAndEquations.map((eq, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-slate-900 text-sky-200 px-3 py-2 font-mono text-xs"
                      >
                        {eq}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Key Terms & Step-by-Step Explanation */}
              <section className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
                  <div className="text-xs font-semibold text-blue-700">
                    06 · Important Terms &amp; Definitions
                  </div>
                  <dl className="divide-y divide-slate-100">
                    {activeLesson.importantTerms.map((item, idx) => (
                      <div key={idx} className="py-2.5 first:pt-0 last:pb-0">
                        <dt className="text-xs font-bold text-slate-900">{item.term}</dt>
                        <dd className="text-xs text-slate-600 mt-0.5">{item.definition}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
                  <div className="text-xs font-semibold text-blue-700">
                    07 · Step-by-Step Logical Breakdown
                  </div>
                  <ol className="space-y-2 text-sm text-slate-800">
                    {activeLesson.stepByStepExplanation.map((step, idx) => (
                      <li key={idx} className="rounded-lg bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </section>

              {/* Worked Examples */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-sm">
                <div className="text-xs font-semibold text-blue-700">
                  08 · Worked Examples (Exact Quantitative Derivation)
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {activeLesson.workedExamples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5"
                    >
                      <h3 className="text-sm font-display font-bold text-slate-900">{ex.title}</h3>
                      <div className="text-xs font-mono text-blue-800 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                        Given: {ex.given}
                      </div>
                      <ol className="list-decimal pl-4 space-y-1 text-xs font-mono text-slate-700">
                        {ex.steps.map((s, sIdx) => (
                          <li key={sIdx}>{s}</li>
                        ))}
                      </ol>
                      <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                        {ex.finalAnswer}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Computer Science Complexity & Pseudocode (if algorithm lesson) */}
              {activeLesson.complexityInfo && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs font-semibold text-blue-700 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4" />
                      Asymptotic Complexity &amp; Reference Pseudocode
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('algorithm-explorer')}
                      className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
                    >
                      Open Full Algorithm Explorer <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                      <div className="text-slate-500">Best Time</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {activeLesson.complexityInfo.timeBest}
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                      <div className="text-slate-500">Average Time</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {activeLesson.complexityInfo.timeAverage}
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                      <div className="text-slate-500">Worst Time</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {activeLesson.complexityInfo.timeWorst}
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                      <div className="text-slate-500">Auxiliary Space</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">
                        {activeLesson.complexityInfo.space}
                      </div>
                    </div>
                  </div>
                  <pre className="rounded-xl bg-slate-900 text-slate-100 p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                    {activeLesson.complexityInfo.pseudocode.join('\n')}
                  </pre>
                </section>
              )}

              {/* Real-Life Applications & Common Mistakes */}
              <section className="grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2.5 shadow-sm">
                  <div className="text-xs font-semibold text-emerald-700">
                    09 · Real-Life Engineering &amp; Scientific Applications
                  </div>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700 leading-relaxed">
                    {activeLesson.realLifeApplications.map((app, idx) => (
                      <li key={idx}>{app}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2.5 shadow-sm">
                  <div className="text-xs font-semibold text-amber-700">
                    10 · Common Mistakes &amp; Misconceptions to Avoid
                  </div>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700 leading-relaxed">
                    {activeLesson.commonMistakes.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Narration Transcript & Scene Breakdown */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-700" />
                    11–13 · Visual Demonstration Plan, Scene Script &amp; Subtitles
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTranscript((s) => !s)}
                    className="text-xs font-semibold text-blue-700 hover:underline"
                  >
                    {showTranscript ? 'Hide Scene Script' : 'Show Full Narration & Scene Table'}
                  </button>
                </div>
                <p className="text-xs text-slate-600">{activeLesson.visualDemonstrationPlan}</p>
                {showTranscript && (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-800 leading-relaxed">
                      <strong>Full Narration Script:</strong> {activeLesson.narrationScript}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                      {activeLesson.scenes.map((sc) => (
                        <div key={sc.id} className="rounded-lg border border-slate-200 p-3 space-y-1">
                          <div className="font-semibold text-slate-900">
                            {sc.sceneNumber}. {sc.title}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {sc.durationSec}s · {sc.visualKind}
                          </div>
                          <p className="text-slate-600">{sc.narrationText}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* 14. Interactive 5-Question Assessment Quiz */}
              <section
                ref={quizSectionRef}
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="text-xs font-semibold text-blue-700 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4" />
                      14 · Knowledge Check Quiz ({activeLesson.quiz.length} Questions)
                    </div>
                    <h3 className="text-lg font-display font-bold text-slate-900 mt-0.5">
                      Test Your Understanding
                    </h3>
                  </div>
                  {quizSubmitted && (
                    <div className="text-sm font-mono font-bold text-emerald-700 tabular-nums">
                      Score: {quizScore} / {activeLesson.quiz.length}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {activeLesson.quiz.map((q, qIdx) => {
                    const selected = quizAnswers[q.id];
                    return (
                      <div
                        key={q.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5"
                      >
                        <div className="text-sm font-semibold text-slate-900">
                          {qIdx + 1}. {q.question}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isPicked = selected === optIdx;
                            const isCorrect = q.correctIndex === optIdx;
                            let btnStyle =
                              'border-slate-200 bg-white text-slate-700 hover:border-blue-400';
                            if (quizSubmitted) {
                              if (isCorrect) {
                                btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                              } else if (isPicked && !isCorrect) {
                                btnStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                              }
                            } else if (isPicked) {
                              btnStyle = 'border-blue-600 bg-blue-50 text-blue-900 font-semibold';
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() =>
                                  setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                                }
                                className={`text-left px-3.5 py-2.5 rounded-lg border text-xs transition-colors ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {quizSubmitted && (
                          <div className="text-xs text-slate-700 pt-1 flex items-start gap-1.5">
                            <CheckCircle2
                              className={`w-4 h-4 shrink-0 mt-0.5 ${
                                selected === q.correctIndex ? 'text-emerald-600' : 'text-amber-600'
                              }`}
                            />
                            <span>{q.explanation}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  {!quizSubmitted ? (
                    <button
                      type="button"
                      disabled={Object.keys(quizAnswers).length < activeLesson.quiz.length}
                      onClick={handleQuizSubmit}
                      className="px-5 py-2.5 rounded-lg bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 disabled:opacity-45"
                    >
                      Submit Answers ({Object.keys(quizAnswers).length}/{activeLesson.quiz.length})
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setQuizAnswers({});
                        setQuizSubmitted(false);
                      }}
                      className="px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                    >
                      Retake Quiz
                    </button>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => navigate('virtual-lab')}
                      className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 hover:border-blue-400 flex items-center gap-1.5"
                    >
                      <FlaskConical className="w-3.5 h-3.5 text-blue-700" />
                      Virtual Lab
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('explorer')}
                      className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 hover:border-blue-400 flex items-center gap-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                      Science Explorer
                    </button>
                  </div>
                </div>
              </section>

              {/* 15. Further Exploration */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2.5 shadow-sm">
                <div className="text-xs font-semibold text-blue-700 flex items-center gap-1.5">
                  <Languages className="w-4 h-4" />
                  15 · Further Exploration &amp; Challenge Prompts
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeLesson.furtherExploration.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setTopicQuery(item);
                        generateLesson(item);
                      }}
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 hover:border-blue-400 hover:text-blue-700 text-left"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}
        </>
      )}
    </div>
  );
}
