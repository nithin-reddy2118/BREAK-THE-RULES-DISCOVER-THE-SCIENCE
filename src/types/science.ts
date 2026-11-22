export type PageId =
  | 'home'
  | 'dashboard'
  | 'smart-learning'
  | 'explorer'
  | 'algorithm-explorer'
  | 'creator'
  | 'virtual-lab'
  | 'what-if'
  | 'detective'
  | 'safety'
  | 'trust-centre'
  | 'innovation-hub'
  | 'discoveries'
  | 'challenges'
  | 'my-learning'
  | 'achievements'
  | 'teacher-mode'
  | 'settings';

export type LanguageCode = 'en' | 'kn' | 'hi';

export type SafetyLevel = 'GREEN' | 'AMBER' | 'RED';

export type UserRole = 'student' | 'teacher';

export interface SafetyEvaluation {
  level: SafetyLevel;
  title: string;
  summary: string;
  reasons: string[];
  requiredActions: string[];
  safeVirtualAlternative: string;
  bypassAttemptDetected: boolean;
  unknownSubstanceDetected: boolean;
  disclaimer: string;
}

export interface ExperimentParameter {
  key: string;
  label: string;
  symbol: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  description: string;
  options?: { label: string; value: number }[];
}

export interface GraphPoint {
  x: number;
  y: number;
  secondaryY?: number;
  label?: string;
}

export interface GraphInterpretation {
  xAxisMeaning: string;
  yAxisMeaning: string;
  relationship: string;
  trend: string;
  slopeMeaning: string;
  conclusion: string;
  limitations: string;
}

export interface ExperimentCalculationResult {
  primaryValue: number;
  primaryLabel: string;
  primarySymbol: string;
  primaryUnit: string;
  secondaryMetrics: { label: string; symbol: string; value: number; unit: string }[];
  calculationSteps: string[];
  curvePoints: GraphPoint[];
  xAxisLabel: string;
  xAxisUnit: string;
  yAxisLabel: string;
  yAxisUnit: string;
  secondaryCurveLabel?: string;
  secondaryYAxisLabel?: string;
  secondaryYAxisUnit?: string;
  validityNote: string;
}

export interface PredictionOption {
  id: string;
  label: string;
  valueHint?: number;
}

export interface ExperimentDefinition {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  subject: string;
  principle: string;
  explanation: string;
  learningObjective: string;
  hypothesis: string;
  independentVariable: string;
  dependentVariable: string;
  controlledVariables: string[];
  formula: string;
  formulaDescription: string;
  unitsSummary: string;
  parameters: ExperimentParameter[];
  assumptions: string[];
  limitations: string[];
  validityRange: string;
  safetyLevel: SafetyLevel;
  safetyNote: string;
  references: { title: string; source: string; url: string }[];
  graphInterpretation: GraphInterpretation;
  predictionPrompt: string;
  predictionOptions: PredictionOption[];
  predictionExpectedHint: string;
  calculate: (params: Record<string, number>) => ExperimentCalculationResult;
}

export interface TrialRecord {
  id: string;
  experimentId: string;
  name: string;
  inputs: Record<string, number>;
  units: Record<string, string>;
  primaryOutput: {
    label: string;
    symbol: string;
    value: number;
    unit: string;
  };
  secondaryOutputs: { label: string; symbol: string; value: number; unit: string }[];
  timestamp: string;
  dataType: 'Deterministic Virtual Simulation';
  modelVersion: string;
  notes?: string;
  isExampleDemo?: boolean;
}

export interface PredictionSubmission {
  experimentId: string;
  mode: 'multiple-choice' | 'numerical' | 'written';
  selectedOptionId?: string;
  numericalValue?: number;
  writtenText?: string;
  confidence: 'Low' | 'Medium' | 'High';
  submittedAt: string;
}

export type CustomCalcTemplate =
  | 'linear_ratio'
  | 'inverse_proportion'
  | 'quadratic_growth'
  | 'exponential_decay'
  | 'logarithmic_scale';

export interface CustomExperimentDefinition {
  id: string;
  title: string;
  subject: string;
  department?: LabDepartmentId;
  learningObjective: string;
  scientificPrinciple: string;
  hypothesis: string;
  independentVariable: string;
  dependentVariable: string;
  controlledVariables: string[];
  formula: string;
  units: string;
  parameterRanges: {
    name: string;
    symbol: string;
    unit: string;
    min: number;
    max: number;
    defaultValue: number;
  }[];
  procedure: string[];
  predictionPrompt: string;
  expectedResult: string;
  graphRecommendation: string;
  assumptions: string[];
  limitations: string[];
  safetyClassification: SafetyLevel;
  safetyGuidance: string;
  calculationTemplate: CustomCalcTemplate;
  recommendedEquipmentIds?: string[];
  recommendedChemicalIds?: string[];
  roomOverviewNote?: string;
  matchedValidatedModelId?: string | null;
  hasValidatedModel?: boolean;
  sourceMode?: 'ai' | 'local-template';
  createdAt: string;
}

export interface SavedReport {
  id: string;
  experimentId: string;
  experimentTitle: string;
  aim: string;
  hypothesis: string;
  trialsCount: number;
  latestResultSummary: string;
  analysisNotes: string;
  safetyLevel: SafetyLevel;
  createdAt: string;
}

export type InnovationStatus = 'draft' | 'pending_approval' | 'approved' | 'needs_revision';

export interface InnovationItem {
  id: string;
  title: string;
  category: string;
  anonymousAlias: string;
  problemSolved: string;
  scientificPrinciple: string;
  materialsAndDesign: string;
  virtualPrototypeNotes: string;
  challengeId?: string;
  drawingDataUrl?: string;
  status: InnovationStatus;
  teacherFeedback?: string;
  safetyLevel: SafetyLevel;
  createdAt: string;
  updatedAt: string;
}

export type DiscoveryVerificationStatus =
  | 'Verified Discovery'
  | 'Peer-Reviewed Research'
  | 'Validated Prototype'
  | 'Active Mission Observation';

export interface DiscoveryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  institution: string;
  status: DiscoveryVerificationStatus;
  summary: string;
  whyItMatters: string;
  concepts: string[];
  sourceName: string;
  sourceUrl: string;
}

export interface ChallengeItem {
  id: string;
  title: string;
  theme: string;
  summary: string;
  scientificFocus: string[];
  suggestedExperimentId: string;
  safetyLevel: SafetyLevel;
}

export interface TeacherAssignment {
  id: string;
  title: string;
  experimentId: string;
  dueDate: string;
  instructions: string;
  assignedGroup: string;
  createdAt: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  points: number;
  criteriaText: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export type VisualFallbackType =
  | 'boiling'
  | 'pendulum'
  | 'photosynthesis'
  | 'circuit'
  | 'rainbow'
  | 'rocket'
  | 'microscope'
  | 'magnet'
  | 'heat-shield'
  | 'cooling'
  | 'general';

export interface ScienceVideoItem {
  id: string;
  title: string;
  creator: string;
  provider: 'NASA Video Library' | 'Wikimedia Commons';
  durationSeconds?: number;
  thumbnailUrl: string;
  playableUrl: string;
  sourceUrl: string;
  description: string;
  license: string;
}

export interface VideoEducationalBreakdown {
  whatIsHappening: string;
  conceptDemonstrated: string;
  whatToObserve: string[];
  whyItHappens: string;
  scientificLaws: string[];
  realWorldApplications: string[];
  demonstrationLimitations: string;
  classroomSafetyDistinction: string;
}

export interface ExplorerResponse {
  subject: string;
  conceptExplanation: string;
  scientificPrinciples: string[];
  suggestedExperimentId: string | null;
  suggestedExperimentReason: string;
  suggestedCreatorPrompt: string | null;
  variables: {
    independent: string[];
    dependent: string[];
    controlled: string[];
  };
  formulaHighlight: string;
  graphSuggestion: string;
  realWorldApplications: string[];
  uncertaintyAndLimitations: string;
  verifiableSources: { title: string; url: string }[];
  safetyClassification: SafetyLevel;
  safetyNote: string;
  videoSearchKeywords: string[];
  visualFallbackType: VisualFallbackType;
  videoBreakdown: VideoEducationalBreakdown;
  followUpQuestions: string[];
}

// --- Virtual Science Campus, 8 Lab Rooms, Chemical Vault, Connections & Curriculum Types ---

export type LabDepartmentId =
  | 'chemistry'
  | 'physics'
  | 'biology'
  | 'environmental'
  | 'engineering'
  | 'astronomy'
  | 'math'
  | 'biotechnology';

export type ChemicalCategory =
  | 'Element'
  | 'Compound'
  | 'Molecule'
  | 'Acid'
  | 'Base'
  | 'Salt'
  | 'Indicator'
  | 'Solution'
  | 'Solvent'
  | 'Educational Material';

export type ChemicalHazardClass =
  | 'Non-Hazardous'
  | 'Low Hazard (Virtual)'
  | 'Corrosive / Irritant (Virtual Only)'
  | 'Oxidizer / Flammable (Virtual Only)';

export interface ChemicalSubstance {
  id: string;
  name: string;
  commonName: string;
  iupacName: string;
  formula: string;
  symbol: string;
  category: ChemicalCategory;
  stateAtRoomTemp: 'Solid' | 'Liquid' | 'Gas' | 'Aqueous Solution';
  molarMassGmol: number;
  standardConcentrationOrPurity: string;
  units: string;
  educationalApplications: string[];
  compatibleExperiments: string[];
  hazardClass: ChemicalHazardClass;
  safetyLevel: SafetyLevel;
  safetyNote: string;
  bottleColor: string;
  bottleStyle: 'amber-glass' | 'clear-flask' | 'gas-cylinder' | 'reagent-dropper' | 'wide-mouth-jar';
}

export interface WorkbenchChemicalItem {
  instanceId: string;
  chemicalId: string;
  xPercent: number;
  yPercent: number;
  amount: number;
  unit: string;
}

export interface EquipmentConfigOption {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export type EquipmentVisualKind =
  | 'beaker'
  | 'heater'
  | 'thermometer'
  | 'barometer'
  | 'pendulum'
  | 'power-supply'
  | 'resistor'
  | 'meter'
  | 'light-source'
  | 'sensor'
  | 'microscope'
  | 'plant-chamber'
  | 'balance'
  | 'glassware'
  | 'volumetric'
  | 'burette'
  | 'funnel'
  | 'centrifuge'
  | 'safety-gear'
  | 'optics'
  | 'mechanics'
  | 'spring'
  | 'capacitor'
  | 'wave-gen'
  | 'telescope'
  | 'rocket'
  | 'robotics'
  | 'weather'
  | 'math-tool'
  | 'calculator'
  | 'dna-helix'
  | 'cell-model'
  | 'chemical-bottle';

export interface LabInstrument {
  id: string;
  name: string;
  category: string;
  department: LabDepartmentId;
  rackId: string;
  description: string;
  functionSummary: string;
  scientificPrinciple: string;
  units: string;
  configurations: EquipmentConfigOption[];
  compatibleWith: string[];
  incompatibleReason?: string;
  safetyLevel: SafetyLevel;
  supportedModels: string[];
  simulationLinked: boolean;
  visualKind: EquipmentVisualKind;
}

export interface EquipmentRack {
  id: string;
  department: LabDepartmentId;
  title: string;
  subtitle: string;
  zonePosition:
    | 'left-top'
    | 'left-bottom'
    | 'right-top'
    | 'right-bottom'
    | 'back-left'
    | 'back-right';
  instrumentIds: string[];
}

export interface RoomStation {
  id: string;
  label: string;
  zone: 'back' | 'left' | 'right' | 'safety';
  kind:
    | 'fume-hood'
    | 'wash-sink'
    | 'safety-shower'
    | 'fire-safety'
    | 'waste-bin'
    | 'wall-chart'
    | 'workstation'
    | 'chemical-cabinet'
    | 'storage-cupboard';
  description: string;
  targetRackId?: string;
  opensChemicalCabinet?: boolean;
}

export interface LabRoomDefinition {
  id: LabDepartmentId;
  wingCode: string;
  name: string;
  shortName: string;
  subtitle: string;
  roomDimensionsLabel: string;
  accentColor: string;
  floorAccent: string;
  wallTint: string;
  safetyZoneLabel: string;
  safetyZoneNote: string;
  defaultExperimentId: string;
  racks: EquipmentRack[];
  stations: RoomStation[];
}

export interface WorkbenchItem {
  instanceId: string;
  instrumentId: string;
  xPercent: number;
  yPercent: number;
  rotationDeg: number;
  config: Record<string, number>;
}

export interface WorkbenchConnection {
  id: string;
  fromInstanceId: string;
  toInstanceId: string;
  connectionType: 'thermal' | 'electrical' | 'optical' | 'measurement' | 'fluid' | 'mechanical';
  valid: boolean;
  note: string;
}

export interface SavedLabDesign {
  id: string;
  title: string;
  department: LabDepartmentId;
  experimentId: string;
  workbenchItems: WorkbenchItem[];
  chemicalItems?: WorkbenchChemicalItem[];
  connections: WorkbenchConnection[];
  parameters: Record<string, number>;
  notes: string;
  modelVersion: string;
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export type CurriculumBoard =
  | 'CBSE'
  | 'ICSE'
  | 'IGCSE'
  | 'State Board'
  | 'Senior Secondary'
  | 'University / B.Tech'
  | 'Biotechnology & Life Sci'
  | 'Advanced Science';

export type ModelImplementationTier = 'implemented' | 'guided' | 'conceptual' | 'planned';

export interface CurriculumExperimentEntry {
  id: string;
  title: string;
  board: CurriculumBoard;
  gradeLevel: string;
  subject: string;
  department: LabDepartmentId;
  chapter: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipmentIds: string[];
  chemicalIds?: string[];
  modelId: string | null;
  modelTier: ModelImplementationTier;
  safetyLevel: SafetyLevel;
  summary: string;
  referenceNote: string;
}
