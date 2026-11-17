import type {
  CustomCalcTemplate,
  CustomExperimentDefinition,
  ExperimentCalculationResult,
  ExperimentDefinition,
  GraphPoint,
} from '../types/science';

// Validated Water Saturation Pressure vs Boiling Temperature Dataset (IAPWS-IF97 reference points)
// Range: 10 kPa to 500 kPa — strictly no extrapolation outside this validated table.
const WATER_SATURATION_TABLE: { pKpa: number; tempC: number }[] = [
  { pKpa: 10.0, tempC: 45.81 },
  { pKpa: 15.0, tempC: 53.97 },
  { pKpa: 20.0, tempC: 60.06 },
  { pKpa: 25.0, tempC: 64.97 },
  { pKpa: 30.0, tempC: 69.10 },
  { pKpa: 40.0, tempC: 75.87 },
  { pKpa: 50.0, tempC: 81.33 },
  { pKpa: 60.0, tempC: 85.94 },
  { pKpa: 70.0, tempC: 89.95 },
  { pKpa: 80.0, tempC: 93.50 },
  { pKpa: 90.0, tempC: 96.71 },
  { pKpa: 100.0, tempC: 99.62 },
  { pKpa: 101.325, tempC: 100.00 },
  { pKpa: 110.0, tempC: 102.31 },
  { pKpa: 125.0, tempC: 105.99 },
  { pKpa: 150.0, tempC: 111.37 },
  { pKpa: 175.0, tempC: 116.06 },
  { pKpa: 200.0, tempC: 120.23 },
  { pKpa: 250.0, tempC: 127.43 },
  { pKpa: 300.0, tempC: 133.55 },
  { pKpa: 350.0, tempC: 138.88 },
  { pKpa: 400.0, tempC: 143.63 },
  { pKpa: 450.0, tempC: 147.93 },
  { pKpa: 500.0, tempC: 151.86 },
];

export function interpolateWaterBoilingPoint(pressureKpa: number): number {
  const clamped = Math.min(500, Math.max(10, pressureKpa));
  for (let i = 0; i < WATER_SATURATION_TABLE.length - 1; i++) {
    const a = WATER_SATURATION_TABLE[i];
    const b = WATER_SATURATION_TABLE[i + 1];
    if (clamped >= a.pKpa && clamped <= b.pKpa) {
      // Logarithmic pressure interpolation mirrors Clausius-Clapeyron smoothness between close nodes
      const lnP = Math.log(clamped);
      const lnA = Math.log(a.pKpa);
      const lnB = Math.log(b.pKpa);
      const t = (lnP - lnA) / (lnB - lnA);
      return Number((a.tempC + t * (b.tempC - a.tempC)).toFixed(2));
    }
  }
  return WATER_SATURATION_TABLE[WATER_SATURATION_TABLE.length - 1].tempC;
}

const roundTo = (n: number, decimals = 3): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
};

export const EXPERIMENTS: ExperimentDefinition[] = [
  {
    id: 'boiling-point',
    number: 1,
    title: 'Boiling Point vs External Pressure',
    shortTitle: 'Boiling Point vs Pressure',
    subject: 'Physics & Thermodynamics',
    principle:
      'A liquid boils when its saturation vapour pressure equals the surrounding external pressure.',
    explanation:
      'At sea level (101.325 kPa), pure water boils at 100.00 °C. On high mountains where atmospheric pressure drops, water molecules escape into vapour at lower temperatures. Inside a sealed pressure vessel above 101.325 kPa, water must reach a higher temperature before its vapour pressure matches the external load.',
    learningObjective:
      'Determine how external pressure changes the boiling temperature of pure water using a validated saturation-pressure dataset.',
    hypothesis:
      'Decreasing external pressure lowers the boiling point of water, while increasing external pressure raises it nonlinearly.',
    independentVariable: 'External Pressure (P) in kPa',
    dependentVariable: 'Boiling Temperature (Tb) in °C',
    controlledVariables: ['Substance (pure H₂O)', 'Atmospheric gas composition', 'Zero dissolved solutes'],
    formula: 'P_sat(T_b) = P_ext (Clausius–Clapeyron / IAPWS-IF97 Saturation Table)',
    formulaDescription:
      'Uses validated IAPWS-IF97 saturation pressure nodes from 10 kPa to 500 kPa with Clausius–Clapeyron log-pressure interpolation.',
    unitsSummary: 'Pressure: kPa · Boiling Temperature: °C · Altitude Estimate: m',
    parameters: [
      {
        key: 'pressure',
        label: 'External Pressure',
        symbol: 'P',
        unit: 'kPa',
        min: 10,
        max: 500,
        step: 0.5,
        defaultValue: 101.325,
        description: 'Surrounding atmospheric or chamber pressure (validated range: 10–500 kPa).',
      },
    ],
    assumptions: [
      'Pure distilled water with zero dissolved salts or impurities.',
      'Thermodynamic equilibrium at the liquid-vapour interface.',
      'No superheating or nucleation delay in the container.',
    ],
    limitations: [
      'Strictly valid only between 10 kPa and 500 kPa; does not extrapolate outside this range.',
      'Does not model dissolved solutes (boiling-point elevation) or altitude temperature lapse rates.',
    ],
    validityRange: '10.0 kPa ≤ P ≤ 500.0 kPa (45.81 °C to 151.86 °C)',
    safetyLevel: 'AMBER',
    safetyNote:
      'Virtual model only. Pressurized vessels and boiling liquids pose burn and rupture risks in physical labs and require teacher supervision.',
    references: [
      {
        title: 'NIST Chemistry WebBook — Water Saturation Properties',
        source: 'NIST Standard Reference Database',
        url: 'https://webbook.nist.gov/chemistry/fluid/',
      },
      {
        title: 'IAPWS-IF97 Industrial Formulation for Water and Steam',
        source: 'International Association for the Properties of Water and Steam',
        url: 'https://iapws.org/relguide/IF97-Rev.html',
      },
    ],
    graphInterpretation: {
      xAxisMeaning: 'External Pressure (kPa) applied above the water surface.',
      yAxisMeaning: 'Equilibrium Boiling Temperature (°C) of pure water.',
      relationship: 'Monotonic nonlinear positive relationship (concave upward curve).',
      trend: 'Boiling point rises steeply at low pressures (10–100 kPa) and flattens slightly at higher pressures.',
      slopeMeaning: 'dT/dP indicates sensitivity of boiling temperature to pressure changes (larger at lower pressures).',
      conclusion: 'Water does not have a single fixed boiling point of 100 °C—it depends directly on external pressure.',
      limitations: 'Valid strictly within 10–500 kPa for pure water.',
    },
    predictionPrompt: 'If external pressure drops to 50 kPa (roughly 5,500 m elevation), what happens to the boiling point?',
    predictionOptions: [
      { id: 'bp-1', label: 'It drops near 81 °C', valueHint: 81.33 },
      { id: 'bp-2', label: 'It stays at 100 °C', valueHint: 100 },
      { id: 'bp-3', label: 'It rises above 120 °C', valueHint: 120 },
    ],
    predictionExpectedHint: 'At 50 kPa, water boils at approximately 81.33 °C.',
    calculate: (params) => {
      const p = Math.min(500, Math.max(10, params.pressure ?? 101.325));
      const tb = interpolateWaterBoilingPoint(p);
      const tbK = roundTo(tb + 273.15, 2);
      const approxAltM = p <= 101.325 ? Math.round(44330 * (1 - Math.pow(p / 101.325, 0.1903))) : 0;
      const curvePoints: GraphPoint[] = WATER_SATURATION_TABLE.map((pt) => ({
        x: pt.pKpa,
        y: pt.tempC,
        label: `${pt.pKpa} kPa → ${pt.tempC} °C`,
      }));
      return {
        primaryValue: tb,
        primaryLabel: 'Boiling Temperature',
        primarySymbol: 'T_b',
        primaryUnit: '°C',
        secondaryMetrics: [
          { label: 'Absolute Temperature', symbol: 'T_K', value: tbK, unit: 'K' },
          { label: 'Equivalent Altitude', symbol: 'h', value: approxAltM, unit: 'm' },
          { label: 'Delta vs Sea Level', symbol: 'ΔT', value: roundTo(tb - 100, 2), unit: '°C' },
        ],
        calculationSteps: [
          `1. Clamp input pressure within validated range [10, 500] kPa: P = ${p} kPa.`,
          `2. Locate bracketing IAPWS-IF97 saturation nodes around P = ${p} kPa.`,
          `3. Apply Clausius–Clapeyron log-pressure interpolation between bounding saturation points.`,
          `4. Result: T_b = ${tb} °C (${tbK} K).`,
        ],
        curvePoints,
        xAxisLabel: 'External Pressure',
        xAxisUnit: 'kPa',
        yAxisLabel: 'Boiling Temperature',
        yAxisUnit: '°C',
        validityNote: 'Validated IAPWS-IF97 lookup range: 10 kPa – 500 kPa (no extrapolation).',
      };
    },
  },
  {
    id: 'acid-ph',
    number: 2,
    title: 'Acid Concentration vs pH',
    shortTitle: 'Acid Concentration vs pH',
    subject: 'Chemistry',
    principle: 'For an idealised strong monoprotic acid, pH equals the negative base-10 logarithm of hydronium concentration: pH = −log₁₀([H⁺]).',
    explanation:
      'The pH scale is logarithmic: every 10-fold dilution of a strong monoprotic acid increases pH by 1 unit. This virtual module explores idealised aqueous dissociation without physical chemical exposure.',
    learningObjective:
      'Observe the logarithmic relationship between molar acid concentration and pH in an idealised strong monoprotic acid.',
    hypothesis: 'Increasing [H⁺] by a factor of 10 decreases pH by exactly 1.00 unit.',
    independentVariable: 'Molar Concentration ([H⁺]) in mol/L',
    dependentVariable: 'pH (dimensionless)',
    controlledVariables: ['Temperature (25 °C / 298.15 K)', 'Complete monoprotic dissociation', 'Ideal activity coefficient γ = 1'],
    formula: 'pH = -log₁₀([H⁺])',
    formulaDescription: 'Idealised strong monoprotic acid model assuming complete dissociation and unit activity coefficient.',
    unitsSummary: 'Concentration: mol/L (M) · pH: dimensionless',
    parameters: [
      {
        key: 'concentration',
        label: 'Acid Concentration [H⁺]',
        symbol: '[H⁺]',
        unit: 'mol/L',
        min: 0.0001,
        max: 1.0,
        step: 0.0001,
        defaultValue: 0.001,
        description: 'Idealised molar concentration (0.0001 to 1.0000 mol/L).',
        options: [
          { label: '0.0001 mol/L (10⁻⁴ M)', value: 0.0001 },
          { label: '0.001 mol/L (10⁻³ M)', value: 0.001 },
          { label: '0.01 mol/L (10⁻² M)', value: 0.01 },
          { label: '0.1 mol/L (10⁻¹ M)', value: 0.1 },
          { label: '1.0 mol/L (1 M)', value: 1.0 },
        ],
      },
    ],
    assumptions: [
      'Complete 100% dissociation (strong monoprotic acid assumption).',
      'Activity coefficient equals 1 (concentrated ionic interactions neglected).',
      'Water auto-ionization (10⁻⁷ mol/L) is negligible within the 10⁻⁴ to 1.0 mol/L range.',
    ],
    limitations: [
      'Real concentrated acids (>0.1 mol/L) deviate due to ionic activity coefficients (Debye–Hückel).',
      'Weak acids require Ka equilibrium calculations, not this strong-acid equation.',
      'Virtual model only — never handle concentrated acids outside certified supervision.',
    ],
    validityRange: '0.0001 mol/L ≤ [H⁺] ≤ 1.0 mol/L at 25 °C',
    safetyLevel: 'AMBER',
    safetyNote:
      'Virtual chemistry simulation only. No physical acid handling or dilution instructions are provided.',
    references: [
      {
        title: 'IUPAC Compendium of Chemical Terminology — Definition of pH',
        source: 'IUPAC Gold Book',
        url: 'https://goldbook.iupac.org/terms/view/P04524',
      },
    ],
    graphInterpretation: {
      xAxisMeaning: 'Molar Concentration [H⁺] (mol/L).',
      yAxisMeaning: 'Idealised pH value (0 to 4 in this concentration band).',
      relationship: 'Logarithmic inverse relationship.',
      trend: 'pH drops rapidly as concentration grows from 0.0001 to 0.05 mol/L, then changes more gradually.',
      slopeMeaning: 'Each decade (×10) increase in [H⁺] shifts pH down by 1.00 unit.',
      conclusion: 'pH compresses orders-of-magnitude changes in hydrogen ion concentration into a compact linear scale.',
      limitations: 'Activity effects cause real high-concentration measurements to differ slightly from ideal −log₁₀([H⁺]).',
    },
    predictionPrompt: 'At a concentration of 0.001 mol/L (10⁻³ M), what is the idealised pH?',
    predictionOptions: [
      { id: 'ph-1', label: 'pH = 1.00', valueHint: 1 },
      { id: 'ph-2', label: 'pH = 3.00', valueHint: 3 },
      { id: 'ph-3', label: 'pH = 7.00', valueHint: 7 },
    ],
    predictionExpectedHint: '−log₁₀(0.001) = −log₁₀(10⁻³) = 3.00.',
    calculate: (params) => {
      const c = Math.min(1.0, Math.max(0.0001, params.concentration ?? 0.001));
      const ph = roundTo(-Math.log10(c), 3);
      const poh = roundTo(14 - ph, 3);
      const sampleConcs = [0.0001, 0.0005, 0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.25, 0.5, 1.0];
      const curvePoints: GraphPoint[] = sampleConcs.map((conc) => ({
        x: conc,
        y: roundTo(-Math.log10(conc), 3),
      }));
      return {
        primaryValue: ph,
        primaryLabel: 'Idealised pH',
        primarySymbol: 'pH',
        primaryUnit: 'pH units',
        secondaryMetrics: [
          { label: 'Idealised pOH (25 °C)', symbol: 'pOH', value: poh, unit: 'units' },
          { label: 'Hydronium Concentration', symbol: '[H⁺]', value: c, unit: 'mol/L' },
        ],
        calculationSteps: [
          `1. Input concentration: [H⁺] = ${c} mol/L.`,
          `2. Compute base-10 logarithm: log₁₀(${c}) = ${roundTo(Math.log10(c), 4)}.`,
          `3. Apply pH = −log₁₀([H⁺]) = ${ph}.`,
        ],
        curvePoints,
        xAxisLabel: 'Concentration [H⁺]',
        xAxisUnit: 'mol/L',
        yAxisLabel: 'Idealised pH',
        yAxisUnit: 'pH',
        validityNote: 'Idealised strong monoprotic model; valid 10⁻⁴ to 1.0 mol/L at 25 °C.',
      };
    },
  },
  {
    id: 'reaction-rate',
    number: 3,
    title: 'Temperature vs Reaction Rate (Arrhenius)',
    shortTitle: 'Temp vs Reaction Rate',
    subject: 'Chemistry & Kinetics',
    principle: 'Rate constant k grows exponentially with temperature according to the Arrhenius equation: k = A × exp(−Ea / RT).',
    explanation:
      'Higher temperature increases the fraction of colliding molecules whose kinetic energy exceeds the activation barrier Ea. Using a reference temperature of 293.15 K (20 °C), you can observe how quickly relative reaction rate rises.',
    learningObjective:
      'Model how temperature and activation energy govern relative chemical reaction rates via the Arrhenius equation.',
    hypothesis: 'Raising temperature or lowering activation energy increases the rate constant exponentially.',
    independentVariable: 'Temperature (T) in Kelvin',
    dependentVariable: 'Relative Reaction Rate (k / k_ref)',
    controlledVariables: ['Gas constant R = 8.3145 J/(mol·K)', 'Reference temperature T_ref = 293.15 K', 'Constant reactant concentrations'],
    formula: 'k = A · exp(−Eₐ / (R·T))',
    formulaDescription: 'Arrhenius rate law with universal gas constant R = 8.31446 J/(mol·K).',
    unitsSummary: 'Temperature: K · Activation Energy: kJ/mol · Relative Rate: × (dimensionless)',
    parameters: [
      {
        key: 'temperature',
        label: 'Reaction Temperature',
        symbol: 'T',
        unit: 'K',
        min: 273.15,
        max: 373.15,
        step: 1,
        defaultValue: 303.15,
        description: 'Reaction temperature in Kelvin (273.15 K = 0 °C to 373.15 K = 100 °C).',
      },
      {
        key: 'ea',
        label: 'Activation Energy',
        symbol: 'Eₐ',
        unit: 'kJ/mol',
        min: 20,
        max: 100,
        step: 1,
        defaultValue: 50,
        description: 'Minimum energy barrier required for reaction (default 50 kJ/mol).',
      },
      {
        key: 'tRef',
        label: 'Reference Temperature',
        symbol: 'T_ref',
        unit: 'K',
        min: 273.15,
        max: 333.15,
        step: 1,
        defaultValue: 293.15,
        description: 'Baseline temperature for relative rate comparison (default 293.15 K).',
      },
    ],
    assumptions: [
      'Activation energy Ea and pre-exponential factor A are temperature-independent over 273–373 K.',
      'Single elementary barrier governs the observed reaction rate.',
      'Concentrations remain constant when comparing rate constants.',
    ],
    limitations: [
      'Enzymatic reactions denature at high temperatures and deviate from Arrhenius.',
      'Diffusion-limited or multi-step mechanisms show non-Arrhenius curvature.',
    ],
    validityRange: '273.15 K ≤ T ≤ 373.15 K, 20 ≤ Ea ≤ 100 kJ/mol',
    safetyLevel: 'GREEN',
    safetyNote: 'Safe mathematical kinetics model with no physical heating hazards.',
    references: [
      {
        title: 'IUPAC Gold Book — Arrhenius Equation',
        source: 'International Union of Pure and Applied Chemistry',
        url: 'https://goldbook.iupac.org/terms/view/A00446',
      },
    ],
    graphInterpretation: {
      xAxisMeaning: 'Temperature T in Kelvin (K).',
      yAxisMeaning: 'Relative Reaction Rate compared to T_ref (dimensionless ratio k/k_ref).',
      relationship: 'Exponential positive growth.',
      trend: 'With Ea = 50 kJ/mol near room temperature, a +10 K rise roughly doubles the reaction rate.',
      slopeMeaning: 'Steeper upward curvature indicates higher activation energy Ea.',
      conclusion: 'Small increases in thermal energy dramatically multiply the population of molecules surpassing Ea.',
      limitations: 'Assumes constant Ea and no phase change or catalyst degradation.',
    },
    predictionPrompt: 'With Ea = 50 kJ/mol and T_ref = 293.15 K, roughly what happens when T rises by 10 K to 303.15 K?',
    predictionOptions: [
      { id: 'rr-1', label: 'Relative rate stays near 1.0×', valueHint: 1 },
      { id: 'rr-2', label: 'Relative rate nearly doubles (~1.99×)', valueHint: 1.99 },
      { id: 'rr-3', label: 'Relative rate increases 10×', valueHint: 10 },
    ],
    predictionExpectedHint: 'At 303.15 K with Ea = 50 kJ/mol, k / k_ref ≈ 1.97×.',
    calculate: (params) => {
      const R = 8.314462618;
      const T = Math.min(373.15, Math.max(273.15, params.temperature ?? 303.15));
      const eaKj = Math.min(100, Math.max(20, params.ea ?? 50));
      const tRef = Math.min(333.15, Math.max(273.15, params.tRef ?? 293.15));
      const eaJ = eaKj * 1000;
      const A = 1e10;
      const k = A * Math.exp(-eaJ / (R * T));
      const kRef = A * Math.exp(-eaJ / (R * tRef));
      const relativeRate = roundTo(k / kRef, 3);
      const curvePoints: GraphPoint[] = [];
      for (let temp = 273.15; temp <= 373.15; temp += 5) {
        const kt = A * Math.exp(-eaJ / (R * temp));
        curvePoints.push({
          x: roundTo(temp, 2),
          y: roundTo(kt / kRef, 3),
        });
      }
      return {
        primaryValue: relativeRate,
        primaryLabel: 'Relative Reaction Rate',
        primarySymbol: 'k/k₀',
        primaryUnit: '× baseline',
        secondaryMetrics: [
          { label: 'Temperature (°C)', symbol: 'T_°C', value: roundTo(T - 273.15, 2), unit: '°C' },
          { label: 'Rate Constant (A=10¹⁰)', symbol: 'k', value: Number(k.toPrecision(4)), unit: 's⁻¹' },
        ],
        calculationSteps: [
          `1. Convert Eₐ = ${eaKj} kJ/mol = ${eaJ} J/mol; R = 8.3145 J/(mol·K).`,
          `2. Compute exponent at T = ${T} K: −Eₐ/(R·T) = ${roundTo(-eaJ / (R * T), 4)}.`,
          `3. Compute exponent at T_ref = ${tRef} K: −Eₐ/(R·T_ref) = ${roundTo(-eaJ / (R * tRef), 4)}.`,
          `4. Relative rate k / k_ref = exp(−Eₐ/R · (1/T − 1/T_ref)) = ${relativeRate}×.`,
        ],
        curvePoints,
        xAxisLabel: 'Temperature',
        xAxisUnit: 'K',
        yAxisLabel: 'Relative Reaction Rate',
        yAxisUnit: '×',
        validityNote: 'Arrhenius single-barrier kinetics valid from 273.15 K to 373.15 K.',
      };
    },
  },
  {
    id: 'pendulum-period',
    number: 4,
    title: 'Pendulum Length vs Time Period',
    shortTitle: 'Pendulum Length vs Period',
    subject: 'Physics & Mechanics',
    principle: 'For small oscillations, a simple pendulum’s period depends only on length and gravitational acceleration: T = 2π√(L/g).',
    explanation:
      'Surprisingly, mass does not appear in the simple pendulum period formula. Increasing length L makes the swing slower, while stronger gravity g pulls the bob back faster. You can plot both T vs L and T² vs L in the Graphs tab.',
    learningObjective:
      'Verify the square-root dependence of pendulum period on length and inspect the linear relationship between L and T².',
    hypothesis: 'Quadrupling pendulum length doubles the time period, and T² is directly proportional to L.',
    independentVariable: 'Pendulum Length (L) in m',
    dependentVariable: 'Time Period (T) in s',
    controlledVariables: ['Small release angle (< 15°)', 'Point-mass bob approximation', 'Zero air drag or pivot friction'],
    formula: 'T = 2π √(L / g)',
    formulaDescription: 'Small-angle simple harmonic oscillation formula.',
    unitsSummary: 'Length: m · Gravity: m/s² · Period: s · Period²: s²',
    parameters: [
      {
        key: 'length',
        label: 'Pendulum Length',
        symbol: 'L',
        unit: 'm',
        min: 0.1,
        max: 5.0,
        step: 0.05,
        defaultValue: 1.0,
        description: 'Distance from pivot to center of mass (0.1 to 5.0 m).',
      },
      {
        key: 'gravity',
        label: 'Gravitational Acceleration',
        symbol: 'g',
        unit: 'm/s²',
        min: 1.62,
        max: 24.79,
        step: 0.01,
        defaultValue: 9.81,
        description: 'Local gravity (Earth 9.81, Moon 1.62, Mars 3.72, Jupiter 24.79 m/s²).',
        options: [
          { label: 'Earth (9.81 m/s²)', value: 9.81 },
          { label: 'Moon (1.62 m/s²)', value: 1.62 },
          { label: 'Mars (3.72 m/s²)', value: 3.72 },
          { label: 'Jupiter (24.79 m/s²)', value: 24.79 },
        ],
      },
    ],
    assumptions: [
      'Small oscillation amplitude (θ < 15°) so sin(θ) ≈ θ.',
      'Massless, inextensible string and point-mass bob.',
      'No air resistance or pivot damping.',
    ],
    limitations: [
      'Large swing angles require elliptic integral corrections (period becomes longer).',
      'Extended rigid rods behave as physical pendulums requiring moment of inertia.',
    ],
    validityRange: '0.1 m ≤ L ≤ 5.0 m, 1.62 ≤ g ≤ 24.79 m/s², θ < 15°',
    safetyLevel: 'GREEN',
    safetyNote: 'Safe classical mechanics simulation.',
    references: [
      {
        title: 'OpenStax University Physics — The Simple Pendulum',
        source: 'OpenStax / Rice University',
        url: 'https://openstax.org/books/university-physics-volume-1/pages/15-4-pendulums',
      },
    ],
    graphInterpretation: {
      xAxisMeaning: 'Pendulum Length L (m).',
      yAxisMeaning: 'Oscillation Time Period T (s), or T² (s²) when secondary curve is toggled.',
      relationship: 'Square-root curve for T vs L; straight line through origin for T² vs L.',
      trend: 'Increasing L slows the swing; slope of T² vs L equals 4π²/g.',
      slopeMeaning: 'From the slope of T² vs L, one can experimentally measure local gravity g = 4π² / slope.',
      conclusion: 'Time period scales with √L and inversely with √g, independent of bob mass.',
      limitations: 'Breaks down for large angles (> 15°) or heavy strings.',
    },
    predictionPrompt: 'For a 1.00 m pendulum on Earth (g = 9.81 m/s²), what is the period of one full swing?',
    predictionOptions: [
      { id: 'pp-1', label: '1.00 second', valueHint: 1.0 },
      { id: 'pp-2', label: '2.01 seconds', valueHint: 2.01 },
      { id: 'pp-3', label: '6.28 seconds', valueHint: 6.28 },
    ],
    predictionExpectedHint: 'T = 2π√(1 / 9.81) ≈ 2.006 s ≈ 2.01 s.',
    calculate: (params) => {
      const L = Math.min(5.0, Math.max(0.1, params.length ?? 1.0));
      const g = Math.min(24.79, Math.max(1.62, params.gravity ?? 9.81));
      const T = roundTo(2 * Math.PI * Math.sqrt(L / g), 3);
      const tSquared = roundTo(T * T, 3);
      const freq = roundTo(1 / T, 3);
      const curvePoints: GraphPoint[] = [];
      for (let len = 0.2; len <= 5.01; len += 0.3) {
        const lVal = roundTo(len, 2);
        const tVal = roundTo(2 * Math.PI * Math.sqrt(lVal / g), 3);
        curvePoints.push({
          x: lVal,
          y: tVal,
          secondaryY: roundTo(tVal * tVal, 3),
        });
      }
      return {
        primaryValue: T,
        primaryLabel: 'Time Period',
        primarySymbol: 'T',
        primaryUnit: 's',
        secondaryMetrics: [
          { label: 'Period Squared', symbol: 'T²', value: tSquared, unit: 's²' },
          { label: 'Frequency', symbol: 'f', value: freq, unit: 'Hz' },
        ],
        calculationSteps: [
          `1. Input Length L = ${L} m, Gravity g = ${g} m/s².`,
          `2. Ratio L / g = ${roundTo(L / g, 4)} s².`,
          `3. Square root √(L / g) = ${roundTo(Math.sqrt(L / g), 4)} s.`,
          `4. T = 2π × ${roundTo(Math.sqrt(L / g), 4)} = ${T} s (T² = ${tSquared} s²).`,
        ],
        curvePoints,
        xAxisLabel: 'Pendulum Length',
        xAxisUnit: 'm',
        yAxisLabel: 'Time Period (T)',
        yAxisUnit: 's',
        secondaryCurveLabel: 'Length vs Period² (T²)',
        secondaryYAxisLabel: 'Period Squared (T²)',
        secondaryYAxisUnit: 's²',
        validityNote: 'Small-angle approximation (θ < 15°), frictionless ideal pendulum.',
      };
    },
  },
  {
    id: 'force-acceleration',
    number: 5,
    title: 'Force vs Acceleration (Newton’s 2nd Law)',
    shortTitle: 'Force vs Acceleration',
    subject: 'Physics & Dynamics',
    principle: 'Net force equals mass times acceleration: F = m·a, so a = F / m.',
    explanation:
      'For a constant mass, acceleration increases linearly with net applied force. Increasing mass increases inertia, reducing acceleration for the same applied force.',
    learningObjective:
      'Verify the direct proportionality between net force and acceleration and inverse proportionality with mass.',
    hypothesis: 'Doubling net force doubles acceleration when mass is held constant.',
    independentVariable: 'Net Force (F) in N',
    dependentVariable: 'Acceleration (a) in m/s²',
    controlledVariables: ['Constant inertial mass m', 'Frictionless surface', 'Non-relativistic speeds'],
    formula: 'a = F / m',
    formulaDescription: 'Newton’s Second Law of Motion for constant non-relativistic mass.',
    unitsSummary: 'Force: N · Mass: kg · Acceleration: m/s²',
    parameters: [
      {
        key: 'force',
        label: 'Net Applied Force',
        symbol: 'F',
        unit: 'N',
        min: 0,
        max: 100,
        step: 0.5,
        defaultValue: 5,
        description: 'Net unbalanced force acting on the object (0 to 100 N).',
      },
      {
        key: 'mass',
        label: 'Object Mass',
        symbol: 'm',
        unit: 'kg',
        min: 0.2,
        max: 50,
        step: 0.2,
        defaultValue: 1,
        description: 'Inertial mass of the body (0.2 to 50 kg).',
      },
    ],
    assumptions: [
      'Constant inertial mass (no mass loss such as rocket fuel burn).',
      'Zero opposing friction or aerodynamic drag.',
      'Velocities far below the speed of light.',
    ],
    limitations: [
      'Real surfaces introduce static and kinetic friction reducing net force.',
      'Variable-mass systems require F = d(mv)/dt.',
    ],
    validityRange: '0 ≤ F ≤ 100 N, 0.2 ≤ m ≤ 50 kg',
    safetyLevel: 'GREEN',
    safetyNote: 'Safe classical dynamics simulation.',
    references: [
      {
        title: 'OpenStax University Physics — Newton’s Second Law',
        source: 'OpenStax / Rice University',
        url: 'https://openstax.org/books/university-physics-volume-1/pages/5-3-newtons-second-law',
      },
    ],
    graphInterpretation: {
      xAxisMeaning: 'Net Force F (Newtons).',
      yAxisMeaning: 'Resulting Acceleration a (m/s²).',
      relationship: 'Direct linear proportion passing through (0, 0).',
      trend: 'Every 1 N increase adds 1/m m/s² of acceleration.',
      slopeMeaning: 'The slope da/dF equals 1/m (inverse mass).',
      conclusion: 'Acceleration is directly proportional to net force and inversely proportional to mass.',
      limitations: 'Assumes no friction and constant mass.',
    },
    predictionPrompt: 'If a 5 N net force acts on a 1 kg block on a frictionless track, what is its acceleration?',
    predictionOptions: [
      { id: 'fa-1', label: '0.2 m/s²', valueHint: 0.2 },
      { id: 'fa-2', label: '5.0 m/s²', valueHint: 5.0 },
      { id: 'fa-3', label: '9.81 m/s²', valueHint: 9.81 },
    ],
    predictionExpectedHint: 'a = F / m = 5 N / 1 kg = 5.00 m/s².',
    calculate: (params) => {
      const F = Math.min(100, Math.max(0, params.force ?? 5));
      const m = Math.min(50, Math.max(0.2, params.mass ?? 1));
      const a = roundTo(F / m, 3);
      const vAfter5s = roundTo(a * 5, 2);
      const curvePoints: GraphPoint[] = [];
      for (let fVal = 0; fVal <= 100; fVal += 10) {
        curvePoints.push({
          x: fVal,
          y: roundTo(fVal / m, 3),
        });
      }
      return {
        primaryValue: a,
        primaryLabel: 'Acceleration',
        primarySymbol: 'a',
        primaryUnit: 'm/s²',
        secondaryMetrics: [
          { label: 'Speed after 5 s (v₀=0)', symbol: 'v₅', value: vAfter5s, unit: 'm/s' },
          { label: 'Inverse Mass (Slope)', symbol: '1/m', value: roundTo(1 / m, 3), unit: 'kg⁻¹' },
        ],
        calculationSteps: [
          `1. Input Net Force F = ${F} N, Mass m = ${m} kg.`,
          `2. Apply Newton’s Second Law: a = F / m = ${F} / ${m} = ${a} m/s².`,
          `3. From rest over 5 s: v = a·t = ${vAfter5s} m/s.`,
        ],
        curvePoints,
        xAxisLabel: 'Net Force',
        xAxisUnit: 'N',
        yAxisLabel: 'Acceleration',
        yAxisUnit: 'm/s²',
        validityNote: 'Constant mass, zero friction, classical non-relativistic regime.',
      };
    },
  },
  {
    id: 'voltage-current',
    number: 6,
    title: 'Voltage vs Current (Ohm’s Law)',
    shortTitle: 'Voltage vs Current',
    subject: 'Physics & Circuits',
    principle: 'Across an ohmic conductor at constant temperature, current is proportional to voltage: V = I·R, so I = V / R.',
    explanation:
      'Ohm’s Law connects electrical potential difference (Voltage), current flow (Amperes), and opposition to flow (Resistance). This virtual DC circuit caps voltage safely at 24 V.',
    learningObjective:
      'Examine the linear V–I characteristic of an ohmic resistor in a safe low-voltage DC circuit.',
    hypothesis: 'Increasing DC voltage increases current linearly, while doubling resistance halves the current.',
    independentVariable: 'DC Voltage (V) in Volts',
    dependentVariable: 'Electric Current (I) in Amperes',
    controlledVariables: ['Ohmic resistance R', 'Constant conductor temperature', 'Low-voltage DC only'],
    formula: 'V = I · R  (I = V / R)',
    formulaDescription: 'Ohmic conductor linear relationship in safe low-voltage DC regime.',
    unitsSummary: 'Voltage: V · Resistance: Ω · Current: A · Power: W',
    parameters: [
      {
        key: 'voltage',
        label: 'DC Supply Voltage',
        symbol: 'V',
        unit: 'V',
        min: 0,
        max: 24,
        step: 0.5,
        defaultValue: 5,
        description: 'Safe low-voltage DC supply (0 to 24 V).',
      },
      {
        key: 'resistance',
        label: 'Resistor Value',
        symbol: 'R',
        unit: 'Ω',
        min: 1,
        max: 1000,
        step: 1,
        defaultValue: 10,
        description: 'Ohmic resistance in Ohms (1 to 1000 Ω).',
      },
    ],
    assumptions: [
      'Ideal ohmic resistor whose resistance does not drift with heating.',
      'Zero internal resistance in the DC power source and connecting wires.',
      'Steady-state DC operation.',
    ],
    limitations: [
      'Non-ohmic components (diodes, filament bulbs) do not follow a constant R.',
      'High currents can overheat real physical resistors if power rating is exceeded.',
      'Never connect experiments to mains AC electricity.',
    ],
    validityRange: '0 ≤ V ≤ 24 V DC, 1 ≤ R ≤ 1000 Ω',
    safetyLevel: 'AMBER',
    safetyNote:
      'Low-voltage DC virtual simulation only (max 24 V). Never experiment with mains AC outlets.',
    references: [
      {
        title: 'OpenStax University Physics — Ohm’s Law',
        source: 'OpenStax / Rice University',
        url: 'https://openstax.org/books/university-physics-volume-2/pages/9-4-ohms-law',
      },
    ],
    graphInterpretation: {
      xAxisMeaning: 'Applied DC Voltage V (Volts).',
      yAxisMeaning: 'Circuit Current I (Amperes).',
      relationship: 'Linear direct proportion through the origin.',
      trend: 'Higher resistance produces a shallower I vs V line.',
      slopeMeaning: 'The slope dI/dV equals conductance G = 1/R (Siemens).',
      conclusion: 'For an ohmic resistor at constant temperature, V/I remains constant and equals R.',
      limitations: 'Fails for semiconductors, LEDs, or overheated wires.',
    },
    predictionPrompt: 'With a 5 V DC supply across a 10 Ω resistor, what current flows?',
    predictionOptions: [
      { id: 'vc-1', label: '0.50 A', valueHint: 0.5 },
      { id: 'vc-2', label: '2.00 A', valueHint: 2.0 },
      { id: 'vc-3', label: '50.0 A', valueHint: 50.0 },
    ],
    predictionExpectedHint: 'I = V / R = 5 V / 10 Ω = 0.50 A.',
    calculate: (params) => {
      const V = Math.min(24, Math.max(0, params.voltage ?? 5));
      const R = Math.min(1000, Math.max(1, params.resistance ?? 10));
      const I = roundTo(V / R, 4);
      const P = roundTo(V * I, 3);
      const curvePoints: GraphPoint[] = [];
      for (let v = 0; v <= 24; v += 2) {
        curvePoints.push({
          x: v,
          y: roundTo(v / R, 4),
        });
      }
      return {
        primaryValue: I,
        primaryLabel: 'Electric Current',
        primarySymbol: 'I',
        primaryUnit: 'A',
        secondaryMetrics: [
          { label: 'Electrical Power', symbol: 'P', value: P, unit: 'W' },
          { label: 'Conductance', symbol: 'G', value: roundTo(1 / R, 4), unit: 'S' },
        ],
        calculationSteps: [
          `1. Input DC Voltage V = ${V} V, Resistance R = ${R} Ω.`,
          `2. Compute Current: I = V / R = ${V} / ${R} = ${I} A.`,
          `3. Compute Power dissipated: P = V · I = ${P} W.`,
        ],
        curvePoints,
        xAxisLabel: 'DC Voltage',
        xAxisUnit: 'V',
        yAxisLabel: 'Current',
        yAxisUnit: 'A',
        validityNote: 'Safe low-voltage DC ohmic model (0–24 V); excludes self-heating drift.',
      };
    },
  },
  {
    id: 'mass-volume-density',
    number: 7,
    title: 'Mass vs Volume and Density',
    shortTitle: 'Mass, Volume & Density',
    subject: 'Physics & Materials',
    principle: 'Density is an intensive property relating mass and volume: ρ = m / V, so m = ρ · V.',
    explanation:
      'While mass and volume both depend on sample size, their ratio—density—stays characteristic of a pure homogeneous material at a given temperature and pressure.',
    learningObjective:
      'Determine how mass scales linearly with volume and identify materials by the slope of Mass vs Volume.',
    hypothesis: 'For a homogeneous material, mass increases linearly with volume and the slope m/V equals density ρ.',
    independentVariable: 'Sample Volume (V) in cm³',
    dependentVariable: 'Mass (m) in g',
    controlledVariables: ['Material purity', 'Reference temperature (4 °C for water, 20 °C for solids)', 'Zero internal air voids'],
    formula: 'ρ = m / V  ⇒  m = ρ · V',
    formulaDescription: 'Linear mass-volume relation for uniform density materials.',
    unitsSummary: 'Density: g/cm³ · Volume: cm³ · Mass: g',
    parameters: [
      {
        key: 'density',
        label: 'Material Density',
        symbol: 'ρ',
        unit: 'g/cm³',
        min: 0.2,
        max: 19.3,
        step: 0.01,
        defaultValue: 1.0,
        description: 'Material density (Water ≈ 1.00 g/cm³ near 4 °C).',
        options: [
          { label: 'Pure Water (1.00 g/cm³ near 4°C)', value: 1.0 },
          { label: 'Ice (0.917 g/cm³)', value: 0.917 },
          { label: 'Ethanol (0.789 g/cm³)', value: 0.789 },
          { label: 'Aluminum (2.70 g/cm³)', value: 2.7 },
          { label: 'Iron (7.87 g/cm³)', value: 7.87 },
          { label: 'Copper (8.96 g/cm³)', value: 8.96 },
        ],
      },
      {
        key: 'volume',
        label: 'Sample Volume',
        symbol: 'V',
        unit: 'cm³',
        min: 5,
        max: 500,
        step: 5,
        defaultValue: 50,
        description: 'Volume of the sample (5 to 500 cm³).',
      },
    ],
    assumptions: [
      'Uniform homogeneous sample with zero air pockets or cavities.',
      'Constant temperature and atmospheric pressure (thermal expansion neglected).',
    ],
    limitations: [
      'Gases and porous materials vary strongly with pressure and compaction.',
      'Water density peaks near 4 °C (~1.000 g/cm³) and decreases slightly at warmer room temperatures (~0.997 g/cm³ at 25 °C).',
    ],
    validityRange: '5 ≤ V ≤ 500 cm³, 0.2 ≤ ρ ≤ 19.3 g/cm³',
    safetyLevel: 'GREEN',
    safetyNote: 'Safe material property and measurement simulation.',
    references: [
      {
        title: 'NIST — Properties of Water and Common Solids',
        source: 'National Institute of Standards and Technology',
        url: 'https://www.nist.gov/',
      },
    ],
    graphInterpretation: {
      xAxisMeaning: 'Sample Volume V (cm³).',
      yAxisMeaning: 'Calculated Mass m (grams).',
      relationship: 'Direct linear relationship passing through the origin.',
      trend: 'Denser materials produce steeper lines.',
      slopeMeaning: 'The slope dm/dV equals the material density ρ in g/cm³.',
      conclusion: 'Mass and volume are extensive properties, whereas their ratio ρ is an intensive material signature.',
      limitations: 'Temperature fluctuations alter density via thermal expansion.',
    },
    predictionPrompt: 'What is the mass of 50 cm³ of pure water near 4 °C (ρ ≈ 1.00 g/cm³)?',
    predictionOptions: [
      { id: 'mv-1', label: '25.0 g', valueHint: 25 },
      { id: 'mv-2', label: '50.0 g', valueHint: 50 },
      { id: 'mv-3', label: '100.0 g', valueHint: 100 },
    ],
    predictionExpectedHint: 'm = ρ × V = 1.00 g/cm³ × 50 cm³ = 50.0 g.',
    calculate: (params) => {
      const rho = Math.min(19.3, Math.max(0.2, params.density ?? 1.0));
      const V = Math.min(500, Math.max(5, params.volume ?? 50));
      const m = roundTo(rho * V, 2);
      const densityKgM3 = roundTo(rho * 1000, 1);
      const curvePoints: GraphPoint[] = [];
      for (let vol = 0; vol <= 500; vol += 50) {
        curvePoints.push({
          x: vol,
          y: roundTo(rho * vol, 2),
        });
      }
      return {
        primaryValue: m,
        primaryLabel: 'Sample Mass',
        primarySymbol: 'm',
        primaryUnit: 'g',
        secondaryMetrics: [
          { label: 'SI Density', symbol: 'ρ_SI', value: densityKgM3, unit: 'kg/m³' },
          { label: 'Buoyancy in Water', symbol: 'ρ/ρ_w', value: roundTo(rho / 1.0, 3), unit: 'specific gravity' },
        ],
        calculationSteps: [
          `1. Input Material Density ρ = ${rho} g/cm³, Volume V = ${V} cm³.`,
          `2. Compute Mass: m = ρ · V = ${rho} × ${V} = ${m} g.`,
          `3. Specific gravity relative to water (1.0 g/cm³): ${roundTo(rho, 3)}.`,
        ],
        curvePoints,
        xAxisLabel: 'Volume',
        xAxisUnit: 'cm³',
        yAxisLabel: 'Mass',
        yAxisUnit: 'g',
        validityNote: 'Homogeneous non-porous sample at reference temperature.',
      };
    },
  },
  {
    id: 'light-distance',
    number: 8,
    title: 'Distance vs Light Intensity',
    shortTitle: 'Distance vs Light Intensity',
    subject: 'Physics & Optics',
    principle: 'Light from an isotropic point source spreads across spherical shells of area 4πr², so intensity obeys the inverse-square law: I ∝ 1/r².',
    explanation:
      'Doubling the distance from a small point light source spreads the same energy over 4 times the area, reducing relative intensity to 25%.',
    learningObjective:
      'Quantify how relative irradiance drops with the square of distance from an ideal point source.',
    hypothesis: 'Doubling observation distance reduces light intensity to one-quarter (25%) of its value.',
    independentVariable: 'Observation Distance (r) in m',
    dependentVariable: 'Relative Light Intensity (I) in %',
    controlledVariables: ['Reference distance r₀ = 1 m', 'Reference intensity I₀ = 100%', 'Zero scattering or absorption'],
    formula: 'I = I₀ · (r₀ / r)²',
    formulaDescription: 'Geometric inverse-square attenuation for an isotropic point source in vacuum/clear air.',
    unitsSummary: 'Distance: m · Relative Intensity: %',
    parameters: [
      {
        key: 'distance',
        label: 'Observation Distance',
        symbol: 'r',
        unit: 'm',
        min: 0.5,
        max: 10,
        step: 0.1,
        defaultValue: 2.0,
        description: 'Distance from point source to sensor (0.5 to 10.0 m).',
      },
      {
        key: 'refDistance',
        label: 'Reference Distance',
        symbol: 'r₀',
        unit: 'm',
        min: 0.5,
        max: 2.0,
        step: 0.1,
        defaultValue: 1.0,
        description: 'Baseline calibration distance where intensity is 100% (default 1.0 m).',
      },
    ],
    assumptions: [
      'Ideal point light source emitting uniformly in all directions.',
      'No atmospheric absorption, haze, or wall reflections.',
      'Sensor surface oriented perpendicular to incoming rays.',
    ],
    limitations: [
      'Collimated lasers and large area panels do not obey simple 1/r² at short distances.',
      'Indoor wall reflections add ambient light above the inverse-square prediction.',
    ],
    validityRange: '0.5 m ≤ r ≤ 10.0 m (far-field point source)',
    safetyLevel: 'GREEN',
    safetyNote: 'Safe optical geometry simulation.',
    references: [
      {
        title: 'NASA — Inverse Square Law of Light',
        source: 'NASA Imagine the Universe',
        url: 'https://imagine.gsfc.nasa.gov/science/toolbox/emspectrum1.html',
      },
    ],
    graphInterpretation: {
      xAxisMeaning: 'Distance r from the light source (m).',
      yAxisMeaning: 'Relative Intensity I (%) compared to I₀ = 100% at r₀.',
      relationship: 'Inverse-square decay (I ∝ 1/r²).',
      trend: 'Intensity falls rapidly between 0.5 m and 3 m, then approaches zero asymptotically.',
      slopeMeaning: 'Steep negative slope near the source reflects rapid geometric spreading of light energy.',
      conclusion: 'Light intensity decreases as the square of distance because spherical surface area grows as r².',
      limitations: 'Requires point-like source and zero stray reflections.',
    },
    predictionPrompt: 'At r₀ = 1 m (100% intensity), what is the relative intensity at r = 2 m?',
    predictionOptions: [
      { id: 'li-1', label: '50%', valueHint: 50 },
      { id: 'li-2', label: '25%', valueHint: 25 },
      { id: 'li-3', label: '12.5%', valueHint: 12.5 },
    ],
    predictionExpectedHint: 'I = 100% × (1 / 2)² = 25.00%.',
    calculate: (params) => {
      const r = Math.min(10, Math.max(0.5, params.distance ?? 2.0));
      const r0 = Math.min(2.0, Math.max(0.5, params.refDistance ?? 1.0));
      const i0 = 100;
      const intensity = roundTo(i0 * Math.pow(r0 / r, 2), 2);
      const curvePoints: GraphPoint[] = [];
      for (let dist = 0.5; dist <= 10.01; dist += 0.5) {
        const dVal = roundTo(dist, 2);
        curvePoints.push({
          x: dVal,
          y: roundTo(i0 * Math.pow(r0 / dVal, 2), 2),
        });
      }
      return {
        primaryValue: intensity,
        primaryLabel: 'Relative Intensity',
        primarySymbol: 'I',
        primaryUnit: '%',
        secondaryMetrics: [
          { label: 'Inverse Square Factor', symbol: '(r₀/r)²', value: roundTo(Math.pow(r0 / r, 2), 4), unit: 'ratio' },
          { label: 'Spread Area Multiplier', symbol: '(r/r₀)²', value: roundTo(Math.pow(r / r0, 2), 2), unit: '× area' },
        ],
        calculationSteps: [
          `1. Reference I₀ = 100% at r₀ = ${r0} m; Observation r = ${r} m.`,
          `2. Compute ratio r₀ / r = ${roundTo(r0 / r, 4)}.`,
          `3. Square the ratio: (r₀ / r)² = ${roundTo(Math.pow(r0 / r, 2), 4)}.`,
          `4. I = 100% × ${roundTo(Math.pow(r0 / r, 2), 4)} = ${intensity}%.`,
        ],
        curvePoints,
        xAxisLabel: 'Distance',
        xAxisUnit: 'm',
        yAxisLabel: 'Relative Intensity',
        yAxisUnit: '%',
        validityNote: 'Point source with negligible reflections or scattering.',
      };
    },
  },
  {
    id: 'photosynthesis-rate',
    number: 9,
    title: 'Light Intensity vs Photosynthesis',
    shortTitle: 'Light vs Photosynthesis',
    subject: 'Biology & Ecology',
    principle: 'Under saturating irradiance, modelled photosynthetic rate follows a rectangular hyperbola: P = P_max · I / (K + I).',
    explanation:
      'At low light, photosynthesis rises almost linearly with photon flux. As light approaches and exceeds the half-saturation constant K, Calvin cycle enzymes and CO₂ diffusion limit further acceleration until rate plateaus near P_max.',
    learningObjective:
      'Explore light-saturation kinetics in photosynthesis and identify limiting factors beyond light intensity.',
    hypothesis: 'Photosynthesis increases with light at first, reaches half of P_max when I = K, and then saturates.',
    independentVariable: 'Light Intensity (I) in µmol/m²/s',
    dependentVariable: 'Modelled Photosynthesis Rate (P) in relative units',
    controlledVariables: ['Maximum capacity P_max', 'Half-saturation constant K', 'Ambient CO₂ and optimal leaf temperature'],
    formula: 'P = P_max · I / (K + I)',
    formulaDescription: 'Michaelis–Menten / rectangular hyperbolic light-response curve.',
    unitsSummary: 'Light Intensity (PAR): µmol/m²/s · Rate P: relative units',
    parameters: [
      {
        key: 'intensity',
        label: 'Light Intensity (PAR)',
        symbol: 'I',
        unit: 'µmol/m²/s',
        min: 0,
        max: 2000,
        step: 25,
        defaultValue: 200,
        description: 'Photosynthetically active photon flux density (0 to 2000 µmol/m²/s).',
      },
      {
        key: 'pMax',
        label: 'Maximum Rate (P_max)',
        symbol: 'P_max',
        unit: 'rel. units',
        min: 2,
        max: 30,
        step: 1,
        defaultValue: 10,
        description: 'Asymptotic biochemical capacity (default 10 relative units).',
      },
      {
        key: 'kHalf',
        label: 'Half-Saturation Constant (K)',
        symbol: 'K',
        unit: 'µmol/m²/s',
        min: 50,
        max: 600,
        step: 25,
        defaultValue: 200,
        description: 'Light level yielding 50% of P_max (default 200 µmol/m²/s).',
      },
    ],
    assumptions: [
      'Gross photosynthesis starts at zero in darkness (basal dark respiration not subtracted).',
      'CO₂ supply, water availability, and temperature remain non-limiting and constant.',
      'No photoinhibition damage at high irradiance.',
    ],
    limitations: [
      'Real leaves experience photorespiration, dark respiration (light compensation point), and photoinhibition under extreme sunlight.',
      'Changing temperature or CO₂ concentration alters both P_max and K.',
    ],
    validityRange: '0 ≤ I ≤ 2000 µmol/m²/s, simplified hyperbolic biological model',
    safetyLevel: 'GREEN',
    safetyNote: 'Safe plant physiology simulation.',
    references: [
      {
        title: 'Khan Academy / Campbell Biology — Factors Affecting Photosynthesis',
        source: 'Open Educational Biology Reference',
        url: 'https://www.khanacademy.org/science/biology/photosynthesis-in-plants',
      },
    ],
    graphInterpretation: {
      xAxisMeaning: 'Photosynthetically Active Light Intensity I (µmol/m²/s).',
      yAxisMeaning: 'Modelled Photosynthesis Rate P (relative units).',
      relationship: 'Saturating rectangular hyperbola.',
      trend: 'Steep linear climb when I ≪ K, passing through P_max/2 at I = K, then flattening toward P_max.',
      slopeMeaning: 'Initial slope P_max/K reflects photosynthetic quantum efficiency at low light.',
      conclusion: 'Light stops being the limiting factor once photosystems saturate; CO₂ or enzyme kinetics then cap the rate.',
      limitations: 'Omits dark respiration offset and extreme-light photoinhibition.',
    },
    predictionPrompt: 'When P_max = 10, K = 200 µmol/m²/s, and I = 200 µmol/m²/s, what is the modelled rate P?',
    predictionOptions: [
      { id: 'phrate-1', label: '2.5 relative units', valueHint: 2.5 },
      { id: 'phrate-2', label: '5.0 relative units', valueHint: 5.0 },
      { id: 'phrate-3', label: '10.0 relative units', valueHint: 10.0 },
    ],
    predictionExpectedHint: 'When I = K, P = P_max × K / (2K) = P_max / 2 = 5.00 relative units.',
    calculate: (params) => {
      const I = Math.min(2000, Math.max(0, params.intensity ?? 200));
      const pMax = Math.min(30, Math.max(2, params.pMax ?? 10));
      const K = Math.min(600, Math.max(50, params.kHalf ?? 200));
      const P = roundTo((pMax * I) / (K + I), 3);
      const pctMax = roundTo((P / pMax) * 100, 1);
      const curvePoints: GraphPoint[] = [];
      for (let light = 0; light <= 2000; light += 100) {
        curvePoints.push({
          x: light,
          y: roundTo((pMax * light) / (K + light), 3),
        });
      }
      return {
        primaryValue: P,
        primaryLabel: 'Photosynthesis Rate',
        primarySymbol: 'P',
        primaryUnit: 'rel. units',
        secondaryMetrics: [
          { label: 'Capacity Reached', symbol: 'P/P_max', value: pctMax, unit: '%' },
          { label: 'Half-Saturation Light', symbol: 'K', value: K, unit: 'µmol/m²/s' },
        ],
        calculationSteps: [
          `1. Input Light I = ${I} µmol/m²/s, P_max = ${pMax}, K = ${K} µmol/m²/s.`,
          `2. Denominator K + I = ${K + I} µmol/m²/s.`,
          `3. P = (${pMax} × ${I}) / ${K + I} = ${P} relative units (${pctMax}% of P_max).`,
        ],
        curvePoints,
        xAxisLabel: 'Light Intensity (PAR)',
        xAxisUnit: 'µmol/m²/s',
        yAxisLabel: 'Photosynthesis Rate',
        yAxisUnit: 'rel. units',
        validityNote: 'Simplified Michaelis–Menten response; omits respiration & photoinhibition.',
      };
    },
  },
  {
    id: 'newtons-cooling',
    number: 10,
    title: 'Newton’s Law of Cooling',
    shortTitle: 'Newton’s Law of Cooling',
    subject: 'Physics & Heat Transfer',
    principle: 'An object cools at a rate proportional to its temperature difference with the surroundings: T(t) = T_a + (T₀ − T_a)·exp(−k·t).',
    explanation:
      'A hot cup of water cools fastest right after being poured because (T₀ − T_a) is largest. As its temperature approaches room temperature T_a, the temperature gap shrinks and cooling slows exponentially.',
    learningObjective:
      'Model exponential thermal equilibration toward ambient temperature and compute instantaneous temperature over time.',
    hypothesis: 'The temperature difference (T − T_a) decays exponentially with time constant 1/k.',
    independentVariable: 'Elapsed Time (t) in minutes',
    dependentVariable: 'Object Temperature T(t) in °C',
    controlledVariables: ['Ambient temperature T_a', 'Initial temperature T₀', 'Constant convective cooling coefficient k'],
    formula: 'T(t) = Tₐ + (T₀ − Tₐ) · exp(−k · t)',
    formulaDescription: 'Lumped-capacitance exponential cooling toward constant ambient temperature T_a.',
    unitsSummary: 'Temperature: °C · Time: min · Cooling Constant k: min⁻¹',
    parameters: [
      {
        key: 't0',
        label: 'Initial Temperature',
        symbol: 'T₀',
        unit: '°C',
        min: 30,
        max: 100,
        step: 1,
        defaultValue: 80,
        description: 'Starting temperature of the object (30 to 100 °C).',
      },
      {
        key: 'ta',
        label: 'Ambient Temperature',
        symbol: 'Tₐ',
        unit: '°C',
        min: 0,
        max: 40,
        step: 1,
        defaultValue: 25,
        description: 'Surrounding room temperature (0 to 40 °C).',
      },
      {
        key: 'k',
        label: 'Cooling Constant',
        symbol: 'k',
        unit: 'min⁻¹',
        min: 0.01,
        max: 0.25,
        step: 0.005,
        defaultValue: 0.05,
        description: 'Lumped heat-transfer constant (default 0.05 min⁻¹).',
      },
      {
        key: 'time',
        label: 'Elapsed Time',
        symbol: 't',
        unit: 'min',
        min: 0,
        max: 120,
        step: 1,
        defaultValue: 20,
        description: 'Time elapsed since t = 0 (0 to 120 min).',
      },
    ],
    assumptions: [
      'Uniform internal temperature throughout the object (low Biot number).',
      'Constant surrounding air temperature T_a.',
      'Heat transfer coefficient k stays constant (convection dominates over radiation/evaporation).',
    ],
    limitations: [
      'Rapid evaporation or strong radiant cooling (Stefan–Boltzmann T⁴) alters k at high temperatures.',
      'Phase changes (freezing/condensation) pause temperature drop while latent heat releases.',
    ],
    validityRange: '0 ≤ t ≤ 120 min, 0 ≤ T_a ≤ 40 °C, 30 ≤ T₀ ≤ 100 °C',
    safetyLevel: 'GREEN',
    safetyNote: 'Safe mathematical thermal decay simulation.',
    references: [
      {
        title: 'OpenStax Calculus / Physics — Newton’s Law of Cooling',
        source: 'OpenStax',
        url: 'https://openstax.org/books/calculus-volume-2/pages/4-3-separable-equations',
      },
    ],
    graphInterpretation: {
      xAxisMeaning: 'Elapsed Time t (minutes).',
      yAxisMeaning: 'Object Temperature T(t) in °C.',
      relationship: 'Exponential decay asymptotically approaching ambient temperature T_a.',
      trend: 'Fastest drop in early minutes; flattens as T(t) nears T_a.',
      slopeMeaning: 'Instantaneous slope dT/dt = −k(T − T_a) equals the cooling rate in °C/min.',
      conclusion: 'Thermal equilibrium is approached exponentially, governed by the cooling constant k.',
      limitations: 'Assumes constant k and negligible evaporative cooling.',
    },
    predictionPrompt: 'Starting at 80 °C in a 25 °C room with k = 0.05 min⁻¹, what is T after 20 minutes?',
    predictionOptions: [
      { id: 'nc-1', label: '25.0 °C (room temp)', valueHint: 25 },
      { id: 'nc-2', label: '45.2 °C', valueHint: 45.23 },
      { id: 'nc-3', label: '60.0 °C', valueHint: 60 },
    ],
    predictionExpectedHint: 'T(20) = 25 + (80 − 25)·exp(−1) = 25 + 55 × 0.3679 ≈ 45.23 °C.',
    calculate: (params) => {
      const t0 = Math.min(100, Math.max(30, params.t0 ?? 80));
      const ta = Math.min(40, Math.max(0, params.ta ?? 25));
      const k = Math.min(0.25, Math.max(0.01, params.k ?? 0.05));
      const time = Math.min(120, Math.max(0, params.time ?? 20));
      const temp = roundTo(ta + (t0 - ta) * Math.exp(-k * time), 2);
      const halfLife = roundTo(Math.LN2 / k, 1);
      const coolingRate = roundTo(-k * (temp - ta), 3);
      const curvePoints: GraphPoint[] = [];
      for (let t = 0; t <= 120; t += 5) {
        curvePoints.push({
          x: t,
          y: roundTo(ta + (t0 - ta) * Math.exp(-k * t), 2),
        });
      }
      return {
        primaryValue: temp,
        primaryLabel: 'Temperature T(t)',
        primarySymbol: 'T(t)',
        primaryUnit: '°C',
        secondaryMetrics: [
          { label: 'Instantaneous Cooling Rate', symbol: 'dT/dt', value: coolingRate, unit: '°C/min' },
          { label: 'Thermal Half-Time', symbol: 't½', value: halfLife, unit: 'min' },
        ],
        calculationSteps: [
          `1. Excess temperature at t = 0: ΔT₀ = T₀ − Tₐ = ${t0} − ${ta} = ${roundTo(t0 - ta, 2)} °C.`,
          `2. Decay factor at t = ${time} min: exp(−${k} × ${time}) = ${roundTo(Math.exp(-k * time), 4)}.`,
          `3. T(${time}) = ${ta} + ${roundTo(t0 - ta, 2)} × ${roundTo(Math.exp(-k * time), 4)} = ${temp} °C.`,
        ],
        curvePoints,
        xAxisLabel: 'Elapsed Time',
        xAxisUnit: 'min',
        yAxisLabel: 'Temperature',
        yAxisUnit: '°C',
        validityNote: 'Lumped-capacitance model with constant ambient temperature and negligible evaporation.',
      };
    },
  },
];

export function getExperimentById(id: string): ExperimentDefinition {
  return EXPERIMENTS.find((e) => e.id === id) ?? EXPERIMENTS[0];
}

export function getDefaultParams(exp: ExperimentDefinition): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of exp.parameters) {
    out[p.key] = p.defaultValue;
  }
  return out;
}

export function calculateCustomExperiment(
  def: CustomExperimentDefinition,
  xValue: number,
  scaleFactor = 1
): ExperimentCalculationResult {
  const firstParam = def.parameterRanges[0] ?? {
    name: 'Input Parameter',
    symbol: 'x',
    unit: 'units',
    min: 1,
    max: 100,
    defaultValue: 10,
  };
  const clampedX = Math.min(firstParam.max, Math.max(firstParam.min, xValue));

  const computeY = (x: number, template: CustomCalcTemplate): number => {
    switch (template) {
      case 'inverse_proportion':
        return roundTo((100 * scaleFactor) / Math.max(x, 0.001), 3);
      case 'quadratic_growth':
        return roundTo(0.1 * scaleFactor * x * x, 3);
      case 'exponential_decay':
        return roundTo(100 * scaleFactor * Math.exp(-0.05 * x), 3);
      case 'logarithmic_scale':
        return roundTo(scaleFactor * Math.log10(Math.max(x, 0.0001) + 1) * 10, 3);
      case 'linear_ratio':
      default:
        return roundTo(x * scaleFactor * 1.5, 3);
    }
  };

  const y = computeY(clampedX, def.calculationTemplate);
  const stepsCount = 12;
  const span = firstParam.max - firstParam.min || 10;
  const curvePoints: GraphPoint[] = [];
  for (let i = 0; i <= stepsCount; i++) {
    const px = roundTo(firstParam.min + (span * i) / stepsCount, 3);
    curvePoints.push({ x: px, y: computeY(px, def.calculationTemplate) });
  }

  return {
    primaryValue: y,
    primaryLabel: def.dependentVariable,
    primarySymbol: 'y',
    primaryUnit: def.units.split('·')[0]?.trim() || 'units',
    secondaryMetrics: [
      { label: 'Scale Factor', symbol: 'k', value: scaleFactor, unit: '×' },
    ],
    calculationSteps: [
      `1. Deterministic template: ${def.calculationTemplate.replace('_', ' ')}.`,
      `2. Input ${firstParam.symbol} = ${clampedX} ${firstParam.unit}.`,
      `3. Evaluated output = ${y}.`,
    ],
    curvePoints,
    xAxisLabel: firstParam.name,
    xAxisUnit: firstParam.unit,
    yAxisLabel: def.dependentVariable,
    yAxisUnit: def.units.split('·')[0]?.trim() || 'units',
    validityNote: `Deterministic template (${def.calculationTemplate}) bounded to [${firstParam.min}, ${firstParam.max}] ${firstParam.unit}.`,
  };
}
