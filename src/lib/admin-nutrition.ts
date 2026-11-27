import {TODAY} from "./model";
import {addDays,dateLabel} from "./studio-workflows";
import { initialMembers, type AdminMember } from './admin-demo';

export type NutritionDay = { date: string; meals: number; complete: boolean; calories: number; protein: number };
export type NutritionProfile = { memberId: string; sharedWithGym: boolean; calorieTarget: number | null; proteinTarget: number | null; days: NutritionDay[] };
export const nutritionPeriods = [
  { id: 'current', label: `${dateLabel(addDays(TODAY,-6))}–${dateLabel(TODAY,true)}`, start: addDays(TODAY,-6), end: TODAY },
  { id: 'previous', label: `${dateLabel(addDays(TODAY,-13))}–${dateLabel(addDays(TODAY,-7),true)}`, start: addDays(TODAY,-13), end: addDays(TODAY,-7) },
] as const;
export type NutritionPeriod = typeof nutritionPeriods[number];
// Synthetic daily summaries only. Unshared profiles contain no intake or targets.
// New owner-created members have no profile until they explicitly share one.
export const initialNutrition: NutritionProfile[] = initialMembers.map((member, index) => {
  const sharedWithGym = index % 6 !== 0;
  const calorieTarget = sharedWithGym && index % 11 !== 0 ? 1800 + index % 5 * 150 : null;
  const proteinTarget = calorieTarget ? 90 + index % 4 * 15 : null;
  return {
    memberId: member.id, sharedWithGym, calorieTarget, proteinTarget,
    days: !sharedWithGym ? [] : Array.from({ length: 14 }, (_, day) => {
      const complete = (index + day) % 5 !== 0;
      return { date: addDays(TODAY,day-13), meals: complete ? 3 + index % 2 : 1,
        complete, calories: Math.round((calorieTarget ?? 2000) * (complete ? .82 + (index + day) % 7 * .055 : .35)),
        protein: Math.round((proteinTarget ?? 100) * (complete ? (index % 4 === 0 ? .62 : .85 + day % 4 * .09) : .3)) };
    }).filter((_, day) => index % 7 === 0 ? day % 6 === 0 : (index + day) % 6 !== 0),
  };
});
export type NutritionRow = {
  member: AdminMember; shared: boolean; loggedDays: number; completeDays: number;
  calories: number | null; protein: number | null; calorieTarget: number | null; proteinTarget: number | null;
  reason: string | null; reviewKey: string; reviewed: boolean;
};
export function summarizeNutrition(members: AdminMember[], profiles: NutritionProfile[], period: NutritionPeriod, reviewed: string[]) {
  const active = members.filter(member => member.status === 'Active' || member.status === 'Expiring');
  const dates = Array.from({ length: 7 }, (_, i) => addDays(period.start,i));
  const average = (numbers: number[]) => numbers.length ? Math.round(numbers.reduce((sum, n) => sum + n, 0) / numbers.length) : null;
  const profileMap = new Map(profiles.map(profile => [profile.memberId, profile]));
  const rows: NutritionRow[] = active.map(member => {
    const profile = profileMap.get(member.id), shared = !!profile?.sharedWithGym;
    const days = shared ? profile!.days.filter(day => day.date >= period.start && day.date <= period.end && day.meals > 0) : [];
    const complete = days.filter(day => day.complete);
    const calories = average(complete.map(day => day.calories)), protein = average(complete.map(day => day.protein));
    const calorieTarget = shared ? profile?.calorieTarget ?? null : null, proteinTarget = shared ? profile?.proteinTarget ?? null : null;
    const reason = !shared ? null : days.length < 3 ? 'Few meal logs this week' : !complete.length ? 'No complete-day logs' : !calorieTarget || !proteinTarget ? 'Nutrition targets not assigned' : protein! < proteinTarget * .8 ? 'Protein logs below assigned target' : calories! > calorieTarget * 1.1 || calories! < calorieTarget * .9 ? 'Calories outside assigned plan range' : null;
    const reviewKey = `${period.id}:${member.id}`;
    return { member, shared, loggedDays: days.length, completeDays: complete.length, calories, protein, calorieTarget, proteinTarget, reason, reviewKey, reviewed: reviewed.includes(reviewKey) };
  });
  const sharedRows = rows.filter(row => row.shared);
  const completeRecords = sharedRows.flatMap(row => profileMap.get(row.member.id)!.days.filter(day => dates.includes(day.date) && day.complete && day.meals > 0).map(day => ({ ...day, proteinTarget: row.proteinTarget })));
  const daily = dates.map(date => ({ date, logged: sharedRows.filter(row => profileMap.get(row.member.id)!.days.some(day => day.date === date && day.meals > 0)).length }));
  return {
    rows, active: active.length, shared: sharedRows.length, logging: sharedRows.filter(row => row.loggedDays > 0).length,
    averageCalories: average(completeRecords.map(day => day.calories)),
    proteinPercent: average(completeRecords.filter(day => day.proteinTarget != null).map(day => day.protein / day.proteinTarget! * 100)),
    completeDays: completeRecords.length, proteinDays: completeRecords.filter(day => day.proteinTarget != null).length,
    pending: sharedRows.filter(row => row.reason && !row.reviewed).length, daily,
  };
}
