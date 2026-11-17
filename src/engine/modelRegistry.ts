import { EXPERIMENTS, getDefaultParams } from './experiments';
import { getRecommendedKitForExperiment } from '../data/labEquipment';
import type { ExperimentDefinition, LabDepartmentId, SafetyLevel } from '../types/science';

export interface ScientificModelEntry {
  modelId: string;
  version: string;
  department: LabDepartmentId;
  subject: string;
  name: string;
  requiredEquipmentIds: string[];
  inputVariables: { key: string; label: string; unit: string; min: number; max: number }[];
  outputVariable: { label: string; symbol: string; unit: string };
  formula: string;
  assumptions: string[];
  limitations: string[];
  safetyClassification: SafetyLevel;
  experiment: ExperimentDefinition;
}

export const MODEL_REGISTRY: ScientificModelEntry[] = EXPERIMENTS.map((exp) => {
  const kit = getRecommendedKitForExperiment(exp.id);
  const sampleOut = exp.calculate(getDefaultParams(exp));
  return {
    modelId: exp.id,
    version: 'v1.2-validated',
    department: kit.department,
    subject: exp.subject,
    name: exp.title,
    requiredEquipmentIds: kit.instrumentIds,
    inputVariables: exp.parameters.map((p) => ({
      key: p.key,
      label: p.label,
      unit: p.unit,
      min: p.min,
      max: p.max,
    })),
    outputVariable: {
      label: sampleOut.primaryLabel,
      symbol: sampleOut.primarySymbol,
      unit: sampleOut.primaryUnit,
    },
    formula: exp.formula,
    assumptions: exp.assumptions,
    limitations: exp.limitations,
    safetyClassification: exp.safetyLevel,
    experiment: exp,
  };
});

export interface ModelSelfTestResult {
  modelId: string;
  name: string;
  passed: boolean;
  detail: string;
}

export function runModelRegistrySelfTests(): ModelSelfTestResult[] {
  const results: ModelSelfTestResult[] = [];

  for (const entry of MODEL_REGISTRY) {
    const defaults = getDefaultParams(entry.experiment);
    const calc = entry.experiment.calculate(defaults);
    const validNumber = Number.isFinite(calc.primaryValue) && calc.curvePoints.length >= 3;
    results.push({
      modelId: entry.modelId,
      name: entry.name,
      passed: validNumber,
      detail: validNumber
        ? `Default ${calc.primarySymbol} = ${calc.primaryValue} ${calc.primaryUnit} (${calc.curvePoints.length} curve pts)`
        : 'Invalid numerical result or empty curve.',
    });
  }

  // Specific physical invariants
  const bpSea = EXPERIMENTS[0].calculate({ pressure: 101.325 }).primaryValue;
  const bpMtn = EXPERIMENTS[0].calculate({ pressure: 50 }).primaryValue;
  results.push({
    modelId: 'boiling-point-invariant',
    name: 'Boiling Point decreases at low pressure',
    passed: bpSea === 100 && bpMtn < 85 && bpMtn > 75,
    detail: `101.325 kPa → ${bpSea} °C; 50 kPa → ${bpMtn} °C`,
  });

  const pend1m = EXPERIMENTS.find((e) => e.id === 'pendulum-period')!.calculate({
    length: 1.0,
    gravity: 9.81,
  }).primaryValue;
  results.push({
    modelId: 'pendulum-invariant',
    name: '1.00 m Earth pendulum period ≈ 2.006 s',
    passed: Math.abs(pend1m - 2.006) < 0.02,
    detail: `Calculated T = ${pend1m} s`,
  });

  const ohm5v10r = EXPERIMENTS.find((e) => e.id === 'voltage-current')!.calculate({
    voltage: 5,
    resistance: 10,
  }).primaryValue;
  results.push({
    modelId: 'ohm-invariant',
    name: 'Ohm’s Law 5 V / 10 Ω = 0.5 A',
    passed: Math.abs(ohm5v10r - 0.5) < 0.001,
    detail: `Calculated I = ${ohm5v10r} A`,
  });

  return results;
}
