import { TODAY } from "./model";

export type BodyCompositionScan = {
  id: string;
  date: string;
  source: "sample" | "manual" | "inbody";
  deviceModel?: string;
  weightKg: number;
  bodyFatPercent: number;
  skeletalMuscleMassKg: number | null;
  totalBodyWaterLitres?: number | null;
  basalMetabolicRateKcal?: number | null;
};

export function latestCompositionScan(scans: BodyCompositionScan[], date: string) {
  return [...scans].reverse().filter(scan => scan.date <= date)
    .sort((a,b) => b.date.localeCompare(a.date))[0] ?? null;
}

export function compositionError(weight: number, fat: number, muscle: number | null) {
  if (!Number.isFinite(weight) || weight <= 0 || weight > 700) return "Enter a weight between 0 and 700 kg.";
  if (!Number.isFinite(fat) || fat < 0 || fat > 100) return "Enter a body fat percentage between 0 and 100.";
  if (muscle !== null && (!Number.isFinite(muscle) || muscle < 0 || muscle > weight*(1-fat/100)+.1)) return "Skeletal muscle mass cannot exceed fat-free mass. Check the values on your report.";
  return "";
}

/** Illustrative scans only: two actual sample dates, rather than daily generated measurements. */
export function sampleCompositionScans(): BodyCompositionScan[] {
  const before = (days: number) => {
    const date = new Date(`${TODAY}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate()-days);
    return date.toISOString().slice(0,10);
  };
  return [
    { id: "sample-composition-previous", date: before(16), source: "sample", weightKg: 72.8, bodyFatPercent: 22.4, skeletalMuscleMassKg: 32.1, totalBodyWaterLitres: 42.5, basalMetabolicRateKcal: 1630 },
    { id: "sample-composition-latest", date: before(2), source: "sample", weightKg: 72, bodyFatPercent: 20.6, skeletalMuscleMassKg: 32.7, totalBodyWaterLitres: 43, basalMetabolicRateKcal: 1652 },
  ];
}
