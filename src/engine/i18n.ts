import type { LanguageCode } from '../types/science';

export interface TranslationBundle {
  appName: string;
  tagline: string;
  secondaryTagline: string;
  nav: {
    home: string;
    dashboard: string;
    explorer: string;
    algorithmExplorer: string;
    creator: string;
    virtualLab: string;
    whatIf: string;
    detective: string;
    safety: string;
    trustCentre: string;
    innovationHub: string;
    discoveries: string;
    challenges: string;
    myLearning: string;
    achievements: string;
    teacherMode: string;
    settings: string;
  };
  actions: {
    startExploring: string;
    exploreExperiments: string;
    discoverInnovations: string;
    runExperiment: string;
    reset: string;
    addTrial: string;
    exportCsv: string;
    exportPdf: string;
    saveReport: string;
    close: string;
  };
  tabs: {
    experiment: string;
    graphs: string;
    trials: string;
    report: string;
  };
  emptyStates: {
    noTrials: string;
    noInnovations: string;
    noReports: string;
  };
}

const EN: TranslationBundle = {
  appName: 'Break the Rules, Discover the Science',
  tagline: "Don't just learn scientific rules. Challenge, explore and discover them.",
  secondaryTagline: 'Ask anything. Test your prediction. See what changes. Understand why.',
  nav: {
    home: 'Home',
    dashboard: 'Student Dashboard',
    explorer: 'Science Explorer',
    algorithmExplorer: 'Algorithm Explorer',
    creator: 'Experiment Creator',
    virtualLab: 'Virtual Lab',
    whatIf: 'What If Studio',
    detective: 'Science Detective',
    safety: 'Safety Guardian',
    trustCentre: 'Scientific Trust Centre',
    innovationHub: 'Global Innovation Hub',
    discoveries: 'World Discoveries',
    challenges: 'Innovation Challenges',
    myLearning: 'My Learning',
    achievements: 'Achievements',
    teacherMode: 'Teacher Mode',
    settings: 'Settings',
  },
  actions: {
    startExploring: 'Start Exploring',
    exploreExperiments: 'Explore Experiments',
    discoverInnovations: 'Discover Innovations',
    runExperiment: 'Run Experiment',
    reset: 'Reset',
    addTrial: 'Add Trial',
    exportCsv: 'Export CSV',
    exportPdf: 'Download PDF Report',
    saveReport: 'Save Report',
    close: 'Close',
  },
  tabs: {
    experiment: 'Experiment',
    graphs: 'Graphs',
    trials: 'Trials',
    report: 'Report & Export',
  },
  emptyStates: {
    noTrials: 'No trials yet. Run your first trial to see your results.',
    noInnovations: 'No saved innovations yet. Start creating your first idea.',
    noReports: 'No reports yet. Complete an experiment to generate a report.',
  },
};

const KN: TranslationBundle = {
  appName: 'ನಿಯಮಗಳನ್ನು ಪ್ರಶ್ನಿಸಿ, ವಿಜ್ಞಾನವನ್ನು ಅನ್ವೇಷಿಸಿ',
  tagline: 'ವಿಜ್ಞಾನದ ನಿಯಮಗಳನ್ನು ಕೇವಲ ಕಂಠಪಾಠ ಮಾಡಬೇಡಿ. ಪ್ರಶ್ನಿಸಿ, ಪರೀಕ್ಷಿಸಿ ಮತ್ತು ಅನ್ವೇಷಿಸಿ.',
  secondaryTagline: 'ಏನನ್ನಾದರೂ ಕೇಳಿ. ನಿಮ್ಮ ಊಹೆಯನ್ನು ಪರೀಕ್ಷಿಸಿ. ಏನು ಬದಲಾಗುತ್ತದೆ ನೋಡಿ. ಕಾರಣವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.',
  nav: {
    home: 'ಮುಖಪುಟ',
    dashboard: 'ವಿದ್ಯಾರ್ಥಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    explorer: 'ವಿಜ್ಞಾನ ಅನ್ವೇಷಕ',
    algorithmExplorer: 'ಅಲ್ಗಾರಿದಮ್ ಅನ್ವೇಷಕ',
    creator: 'ಪ್ರಯೋಗ ರಚನೆಕಾರ',
    virtualLab: 'ವರ್ಚುವಲ್ ಪ್ರಯೋಗಾಲಯ',
    whatIf: 'ವಾಟ್ ಇಫ್ ಸ್ಟುಡಿಯೋ',
    detective: 'ವಿಜ್ಞಾನ ಪತ್ತೇದಾರ',
    safety: 'ಸುರಕ್ಷತಾ ರಕ್ಷಕ',
    trustCentre: 'ವೈಜ್ಞಾನಿಕ ವಿಶ್ವಾಸ ಕೇಂದ್ರ',
    innovationHub: 'ಜಾಗತಿಕ ನಾವೀನ್ಯತೆ ಕೇಂದ್ರ',
    discoveries: 'ವಿಶ್ವ ಆವಿಷ್ಕಾರಗಳು',
    challenges: 'ನಾವೀನ್ಯತೆ ಸವಾಲುಗಳು',
    myLearning: 'ನನ್ನ ಕಲಿಕೆ',
    achievements: 'ಸಾಧನೆಗಳು',
    teacherMode: 'ಶಿಕ್ಷಕರ ಮೋಡ್',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
  },
  actions: {
    startExploring: 'ಅನ್ವೇಷಣೆ ಪ್ರಾರಂಭಿಸಿ',
    exploreExperiments: 'ಪ್ರಯೋಗಗಳನ್ನು ನೋಡಿ',
    discoverInnovations: 'ನಾವೀನ್ಯತೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    runExperiment: 'ಪ್ರಯೋಗ ನಡೆಸಿ',
    reset: 'ಮರುಹೊಂದಿಸಿ',
    addTrial: 'ಟ್ರಯಲ್ ಸೇರಿಸಿ',
    exportCsv: 'CSV ರಫ್ತು',
    exportPdf: 'PDF ವರದಿ ಡೌನ್‌ಲೋಡ್',
    saveReport: 'ವರದಿ ಉಳಿಸಿ',
    close: 'ಮುಚ್ಚಿ',
  },
  tabs: {
    experiment: 'ಪ್ರಯೋಗ',
    graphs: 'ಗ್ರಾಫ್‌ಗಳು',
    trials: 'ಟ್ರಯಲ್‌ಗಳು',
    report: 'ವರದಿ ಮತ್ತು ರಫ್ತು',
  },
  emptyStates: {
    noTrials: 'ಇನ್ನೂ ಯಾವುದೇ ಟ್ರಯಲ್‌ಗಳಿಲ್ಲ. ನಿಮ್ಮ ಫಲಿತಾಂಶಗಳನ್ನು ನೋಡಲು ಮೊದಲ ಟ್ರಯಲ್ ನಡೆಸಿ.',
    noInnovations: 'ಇನ್ನೂ ಯಾವುದೇ ನಾವೀನ್ಯತೆಗಳನ್ನು ಉಳಿಸಲಾಗಿಲ್ಲ. ನಿಮ್ಮ ಮೊದಲ ಕಲ್ಪನೆಯನ್ನು ರಚಿಸಲು ಪ್ರಾರಂಭಿಸಿ.',
    noReports: 'ಇನ್ನೂ ಯಾವುದೇ ವರದಿಗಳಿಲ್ಲ. ವರದಿ ರಚಿಸಲು ಪ್ರಯೋಗವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.',
  },
};

const HI: TranslationBundle = {
  appName: 'नियमों को चुनौती दें, विज्ञान खोजें',
  tagline: 'केवल वैज्ञानिक नियम रटें नहीं। उन्हें चुनौती दें, परखें और खोजें।',
  secondaryTagline: 'कुछ भी पूछें। अपना अनुमान परखें। देखें क्या बदलता है। कारण समझें।',
  nav: {
    home: 'होम',
    dashboard: 'छात्र डैशबोर्ड',
    explorer: 'विज्ञान एक्सप्लोरर',
    algorithmExplorer: 'एल्गोरिथम एक्सप्लोरर',
    creator: 'प्रयोग निर्माता',
    virtualLab: 'वर्चुअल लैब',
    whatIf: 'व्हाट इफ स्टूडियो',
    detective: 'साइंस डिटेक्टिव',
    safety: 'सुरक्षा गार्जियन',
    trustCentre: 'वैज्ञानिक ट्रस्ट केंद्र',
    innovationHub: 'वैश्विक नवाचार हब',
    discoveries: 'विश्व खोजें',
    challenges: 'नवाचार चुनौतियाँ',
    myLearning: 'मेरा सीखना',
    achievements: 'उपलब्धियाँ',
    teacherMode: 'शिक्षक मोड',
    settings: 'सेटिंग्स',
  },
  actions: {
    startExploring: 'खोज शुरू करें',
    exploreExperiments: 'प्रयोग देखें',
    discoverInnovations: 'नवाचार खोजें',
    runExperiment: 'प्रयोग चलाएं',
    reset: 'रीसेट करें',
    addTrial: 'ट्रायल जोड़ें',
    exportCsv: 'CSV निर्यात',
    exportPdf: 'PDF रिपोर्ट डाउनलोड',
    saveReport: 'रिपोर्ट सहेजें',
    close: 'बंद करें',
  },
  tabs: {
    experiment: 'प्रयोग',
    graphs: 'ग्राफ़',
    trials: 'ट्रायल्स',
    report: 'रिपोर्ट और निर्यात',
  },
  emptyStates: {
    noTrials: 'अभी तक कोई ट्रायल नहीं। अपने परिणाम देखने के लिए पहला ट्रायल चलाएं।',
    noInnovations: 'अभी तक कोई सहेजा गया नवाचार नहीं। अपना पहला विचार बनाना शुरू करें।',
    noReports: 'अभी तक कोई रिपोर्ट नहीं। रिपोर्ट बनाने के लिए एक प्रयोग पूरा करें।',
  },
};

const TRANSLATIONS: Record<LanguageCode, TranslationBundle> = {
  en: EN,
  kn: KN,
  hi: HI,
};

export function getTranslations(lang: LanguageCode): TranslationBundle {
  return TRANSLATIONS[lang] ?? EN;
}
