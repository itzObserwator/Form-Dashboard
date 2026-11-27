import type { MemberWorkspaceState } from "./studio-workflows";
import type { BodyCompositionScan } from "./body-composition";

export type SetCompletions = Record<string, boolean[]>;
export type SetEntry = { reps: string; weight: string };
export type Exercise = { id: string; name: string; sets: SetEntry[] };
export type Cardio = {
  id: string;
  type: string;
  time: string;
  distance: string;
  calories: string;
};
export type Workout = {
  muscle: string;
  warmup: string;
  cooldown: string;
  notes: string;
  exercises: Exercise[];
  cardio: Cardio[];
  start: string;
  finish: string;
  total: string;
  satisfaction: number;
  version: number;
  savedAt?: string;
  planVersion?: number;
  planSnapshot?: Workout;
  templateId?: string;
  templateName?: string;
};
export type Habit = {
  id: string;
  name: string;
  marks: string[];
  kind?: "build" | "break";
};
export type OnboardingDraft = {
  wearable?: "whoop" | "none";
  step: number;
  goals: string[];
  accepted: boolean;
  dayOne: boolean;
  target: string;
  weight: Omit<WeightEntry, "id">;
  habits: Habit[];
  name: string;
  height: string;
  goal: string;
};
export type WeightEntry = {
  source?: "photo" | "manual";
  afterBathroom?: boolean;
  id: string;
  date: string;
  weight: string;
  gain: string;
  loss: string;
  notes: string;
};
export type Food = {
  id: string;
  product: string;
  serving: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
};
export type Nutrition = {
  metrics: Record<string, string>;
  water: number;
  meals: Record<string, Food[]>;
};
export type Member = {
  id: string;
  name: string;
  initials: string;
  description: string;
};
export const members: Member[] = [
  {
    id: "alex",
    name: "Arjun Sharma",
    initials: "AS",
    description: "Strength program · joined October",
  },
  {
    id: "jamie",
    name: "Meera Iyer",
    initials: "MI",
    description: "General fitness · joined November",
  },
  {
    id: "sam",
    name: "Rohan Patel",
    initials: "RP",
    description: "Strength program · joined September",
  },
];
export type WorkoutTemplate = {
  id: string;
  name: string;
  workout: Workout;
  updatedAt: string;
};
export type SmartBottleProvider = "hidratespark-pro-2" | "larq-purevis-2" | "other";
export type Store = {
  studio?: MemberWorkspaceState;
  sampleData?: boolean;
  onboarded: boolean;
  account?: { email: string };
  onboardingDraft?: OnboardingDraft;
  challengeAccepted?: boolean;
  wearablePreference?: "whoop" | "none";
  smartWaterBottle?: { name: string; brand: string; provider?: SmartBottleProvider; status: "pending" };
  month: string;
  goalsByMonth: Record<string, string[]>;
  profile: Record<string, string>;
  habits: Habit[];
  planner: Record<string, string>;
  challenge: number[];
  challengeTarget: string;
  challengeNote: string;
  weights: WeightEntry[];
  bodyCompositionScans?: BodyCompositionScan[];
  measurements: Record<string, Record<string, string>>;
  baselineMeasurements?: Record<string, string>;
  resultDates: { now: string; previous: string };
  before: string;
  after: string;
  reviews: Record<string, Record<string, string>>;
  nutrition: Record<string, Nutrition>;
  plans: Record<string, Workout>;
  logs: Record<string, Workout>;
  setCompletions?: Record<string, SetCompletions>;
  workoutLibrary?: WorkoutTemplate[];
};
export const measurements = [
  "Neck",
  "Shoulders",
  "Chest",
  "Bicep",
  "Waist",
  "Hip",
  "Thigh",
  "Calf",
  "Weight",
  "Body Fat %",
];
export const meals = ["Breakfast", "Lunch", "Dinner", "Supplements/Snacks"];
export const uid = () => {
  // randomUUID requires HTTPS (or localhost); getRandomValues also works on LAN HTTP.
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4),
    hex.slice(4, 6),
    hex.slice(6, 8),
    hex.slice(8, 10),
    hex.slice(10),
  ]
    .map((part) => part.join(""))
    .join("-");
};
export const dateKey = (d = new Date()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
export const TODAY = dateKey();
export const makeExercise = (name = ""): Exercise => ({
  id: uid(),
  name,
  sets: Array.from({ length: 6 }, () => ({ reps: "", weight: "" })),
});
export const emptyWorkout = (): Workout => ({
  muscle: "",
  warmup: "",
  cooldown: "",
  notes: "",
  exercises: [],
  cardio: [],
  start: "",
  finish: "",
  total: "",
  satisfaction: 50,
  version: 0,
});
export const emptyNutrition = (): Nutrition => ({
  metrics: {},
  water: 0,
  meals: Object.fromEntries(meals.map((m) => [m, []])),
});
export function initialStore(): Store {
  const month = TODAY.slice(0, 7);
  const exercise = (
    id: string,
    name: string,
    reps: string,
    weight: string,
  ): Exercise => ({
    id,
    name,
    sets: Array.from({ length: 6 }, (_, i) => ({
      reps: i < 3 ? reps : "",
      weight: i < 3 ? weight : "",
    })),
  });
  const plan: Workout = {
    ...emptyWorkout(),
    muscle: "Upper body strength",
    warmup: "5 min rowing, arm circles & band pull-aparts",
    cooldown: "5 min upper-body stretches",
    notes:
      "Control the lowering phase. Rest 90 seconds between sets. Quality over quantity.",
    exercises: [
      exercise("e1", "Barbell bench press", "10", "40"),
      exercise("e2", "Seated cable row", "12", "35"),
      exercise("e3", "Dumbbell shoulder press", "10", "12"),
      exercise("e4", "Lat pulldown", "12", "40"),
    ],
    cardio: [
      {
        id: "c1",
        type: "Incline walk",
        time: "10",
        distance: "0.8",
        calories: "65",
      },
    ],
    version: 1,
    savedAt: TODAY,
  };
  const store: Store = {
    sampleData: true,
    onboarded: false,
    month,
    goalsByMonth: {
      [month]: [
        "Train 4 days a week",
        "Bench press 50 kg",
        "Sleep 7+ hours on weekdays",
        "Walk 8,000 steps a day",
      ],
    },
    profile: {
      Name: "Arjun Sharma",
      "Starting weight (kg)": "72.5",
      "Height (cm)": "175",
      "My Goal": "Maintain weight",
    },
    habits: [
      {
        id: "h1",
        name: "Move for 30 minutes",
        marks: [`${month}-15`, `${month}-16`, TODAY],
      },
      {
        id: "h2",
        name: "Sleep for 8 hours",
        marks: [`${month}-15`, `${month}-16`],
      },
      {
        id: "h3",
        name: "Eat a protein-rich breakfast",
        marks: [`${month}-16`, TODAY],
      },
      { id: "h4", name: "Read for 10 minutes", marks: [`${month}-15`] },
    ],
    planner: { [TODAY]: "Upper body · focus on good form" },
    challenge: Array.from({ length: 17 }, (_, i) => i + 1),
    challengeTarget: "Walk 8,000 steps every day.",
    challengeNote: "Evening walks after work.",
    weights: [
      {
        id: "w1",
        date: `${month}-01`,
        weight: "72.5",
        gain: "0",
        loss: "0",
        notes: "Starting this month feeling focused.",
      },
      {
        id: "w2",
        date: `${month}-10`,
        weight: "72.2",
        gain: "0",
        loss: "0.3",
        notes: "Keeping things consistent.",
      },
    ],
    measurements: {
      [month]: {
        Neck: "36",
        Shoulders: "112",
        Chest: "96",
        Bicep: "32",
        Waist: "79",
        Hip: "94",
        Thigh: "54",
        Calf: "36",
        Weight: "72.2",
        "Body Fat %": "18",
      },
    },
    resultDates: { now: TODAY, previous: "" },
    before: "",
    after: "",
    reviews: {},
    nutrition: {
      [TODAY]: {
        metrics: {
          "Weight (kg)": "72.2",
          "Sleep (hours)": "7.5",
          Steps: "6840",
        },
        water: 2,
        meals: {
          Breakfast: [
            {
              id: "f1",
              product: "Greek yogurt with oats",
              serving: "250 g",
              calories: "320",
              protein: "24",
              carbs: "42",
              fat: "6",
            },
          ],
          Lunch: [],
          Dinner: [],
          "Supplements/Snacks": [],
        },
      },
      [`jamie:${TODAY}`]: {
        metrics: {
          "Weight (kg)": "58.4",
          "Sleep (hours)": "8",
          Steps: "9200",
        },
        water: 3,
        meals: {
          Breakfast: [
            {
              id: "f2",
              product: "Poha with roasted peanuts",
              serving: "200 g",
              calories: "280",
              protein: "8",
              carbs: "48",
              fat: "7",
            },
          ],
          Lunch: [
            {
              id: "f3",
              product: "Paneer wrap & salad",
              serving: "1 wrap",
              calories: "410",
              protein: "22",
              carbs: "35",
              fat: "18",
            },
          ],
          Dinner: [],
          "Supplements/Snacks": [],
        },
      },
      [`sam:${TODAY}`]: {
        metrics: {
          "Weight (kg)": "81.0",
          "Sleep (hours)": "7",
          Steps: "7500",
        },
        water: 2,
        meals: {
          Breakfast: [
            {
              id: "f4",
              product: "Omelette with multigrain toast",
              serving: "3 eggs + 2 slices",
              calories: "390",
              protein: "28",
              carbs: "30",
              fat: "14",
            },
          ],
          Lunch: [],
          Dinner: [],
          "Supplements/Snacks": [],
        },
      },
    },
    plans: { [`alex:${TODAY}`]: plan },
    logs: {},
    setCompletions: {},
    workoutLibrary: [],
  };
  // Illustrative records stay in memory and are isolated from new member journals.
  const [year, monthNumber] = month.split("-").map(Number);
  const previousMonth = `${monthNumber === 1 ? year - 1 : year}-${String(monthNumber === 1 ? 12 : monthNumber - 1).padStart(2, "0")}`;
  store.baselineMeasurements = { Neck: "36.5", Shoulders: "110", Chest: "94", Bicep: "31", Waist: "82", Hip: "95", Thigh: "53", Calf: "35", Weight: "73.4", "Body Fat %": "19.2" };
  store.measurements[previousMonth] = { Neck: "36.2", Shoulders: "111", Chest: "95", Bicep: "31.5", Waist: "80.5", Hip: "94.5", Thigh: "53.5", Calf: "35.5", Weight: "72.8", "Body Fat %": "18.6" };
  store.resultDates.previous = `${previousMonth}-20`;
  store.before = "Sample baseline: building a consistent routine and improving strength.";
  store.after = "Sample progress: stronger lifts, a steadier routine and improved sleep.";
  store.reviews[month] = {
    "What were the biggest wins?": "Completed four training sessions a week and added 5 kg to my bench press.",
    "What areas were lacking and why?": "Late work nights made sleep less consistent. Meal prep slipped on busy days.",
    "How will I improve next month and how?": "Prepare lunches on Sunday, set a 10:30 pm wind-down reminder and keep evening walks short and consistent.",
  };
  store.workoutLibrary = [
    { id: "sample-upper", name: "Upper body strength", workout: structuredClone(plan), updatedAt: TODAY },
    { id: "sample-lower", name: "Lower body strength", workout: { ...structuredClone(plan), muscle: "Lower body strength", exercises: [exercise("lower-1", "Barbell back squat", "8", "60"), exercise("lower-2", "Romanian deadlift", "10", "45"), exercise("lower-3", "Leg press", "12", "100")] }, updatedAt: TODAY },
  ];
  const todayNumber = Number(TODAY.slice(-2));
  for (let day = 1; day <= todayNumber; day++) {
    const key = `${month}-${String(day).padStart(2, "0")}`;
    store.weights.push({ id: `sample-weight-${day}`, date: key, weight: (72.7 - day * .025).toFixed(1), gain: "", loss: day === 1 ? "" : "0.1", notes: day % 7 === 0 ? "Weekly check-in: keeping the routine consistent." : "Morning sample reading" });
    store.nutrition[key] = {
      metrics: { "Weight (kg)": (72.7 - day * .025).toFixed(1), "Waist (cm)": "79", "Sleep (hours)": (7.1 + day % 5 * .2).toFixed(1), Steps: String(7200 + day % 7 * 420), "Body Fat (%)": "18" },
      water: 2.25,
      meals: {
        Breakfast: [{ id: `${key}-breakfast`, product: "Greek yogurt, oats & banana", serving: "1 bowl", calories: "420", protein: "28", carbs: "58", fat: "9" }],
        Lunch: [{ id: `${key}-lunch`, product: "Paneer rice bowl with vegetables", serving: "1 bowl", calories: "610", protein: "32", carbs: "76", fat: "19" }],
        Dinner: [{ id: `${key}-dinner`, product: "Grilled chicken, roti & salad", serving: "1 plate", calories: "540", protein: "42", carbs: "48", fat: "18" }],
        "Supplements/Snacks": [{ id: `${key}-snack`, product: "Whey protein & almonds", serving: "1 shake + 15 g", calories: "240", protein: "28", carbs: "10", fat: "10" }],
      },
    };
    const isTraining = day % 3 !== 0;
    store.planner[key] = isTraining ? (day % 2 ? "Upper body strength · 7:00 am" : "Lower body strength · 7:00 am") : "Active recovery · evening walk & mobility";
    store.habits.forEach((habit, index) => { if ((day + index) % 4 !== 0 && !habit.marks.includes(key)) habit.marks.push(key); });
    if (isTraining || key === TODAY) {
      const workout = structuredClone(store.workoutLibrary[day % 2 ? 0 : 1].workout);
      store.plans[`alex:${key}`] = workout;
      if (key !== TODAY) store.logs[`alex:${key}`] = { ...structuredClone(workout), start: "07:00", finish: "07:55", total: "55", satisfaction: 80 + day % 4 * 5, planVersion: 1, planSnapshot: structuredClone(workout), notes: "Sample session: completed the planned sets with controlled form." };
    }
  }
  store.plans[`jamie:${TODAY}`] = structuredClone(plan);
  store.plans[`sam:${TODAY}`] = structuredClone(store.workoutLibrary[1].workout);
  return store;
}
export function formatDate(
  date: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  },
) {
  return new Date(date + "T12:00:00").toLocaleDateString("en-US", options);
}
export function monthLabel(month: string) {
  return new Date(month + "-01T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
export function daysInMonth(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}
export function totalNutrition(n: Nutrition) {
  return Object.values(n.meals)
    .flat()
    .reduce(
      (a, f) => ({
        calories: a.calories + (Number(f.calories) || 0),
        protein: a.protein + (Number(f.protein) || 0),
        carbs: a.carbs + (Number(f.carbs) || 0),
        fat: a.fat + (Number(f.fat) || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
}

export function monthlyGoals(data: Store): string[] {
  return data.goalsByMonth[data.month] || ["", "", "", ""];
}
export function restoreStore(value: unknown): Store {
  const data = value as Store & { goals?: string[] };
  if (!data || !data.profile || !Array.isArray(data.habits) || !data.month)
    throw new Error("Invalid journal");
  if (!data.goalsByMonth)
    data.goalsByMonth = { [data.month]: data.goals || ["", "", "", ""] };
  delete data.goals;
  if (data.profile.Name === "Alex Morgan") data.profile.Name = "Arjun Sharma";
  const demoGoals: Record<string, string> = {
    "Build a consistent training routine": "Train 4 days a week",
    "Get stronger, one session at a time": "Bench press 50 kg",
    "Prioritize 7–8 hours of sleep": "Sleep 7+ hours on weekdays",
    "Make time for recovery": "Walk 8,000 steps a day",
  };
  for (const month of Object.keys(data.goalsByMonth))
    data.goalsByMonth[month] = data.goalsByMonth[month].map(
      (g) => demoGoals[g] || g,
    );
  if (data.challengeTarget === "Show up for myself, every day.")
    data.challengeTarget = "Walk 8,000 steps every day.";
  return data;
}

/** Copy prescribed fields with fresh row IDs; never copy actuals or completion. */
export function copyWorkoutPlan(source: Workout): Workout {
  return {
    ...emptyWorkout(),
    muscle: source.muscle,
    warmup: source.warmup,
    cooldown: source.cooldown,
    notes: source.notes,
    exercises: source.exercises.map((e) => ({
      id: uid(),
      name: e.name,
      sets: Array.from({ length: 6 }, (_, i) => ({
        reps: e.sets[i]?.reps || "",
        weight: e.sets[i]?.weight || "",
      })),
    })),
    cardio: source.cardio.map((c) => ({ ...c, id: uid() })),
  };
}

/** A new member starts with their own records, without illustrative sample data. */
export function newMemberStore(email: string, name: string): Store {
  const seed = initialStore();
  return {
    ...seed,
    sampleData: false,
    account: { email },
    profile: { Name: name },
    goalsByMonth: {},
    habits: [],
    planner: {},
    challenge: [],
    challengeTarget: "",
    challengeNote: "",
    weights: [],
    measurements: {},
    baselineMeasurements: {},
    before: "",
    after: "",
    reviews: {},
    nutrition: {},
    plans: {},
    logs: {},
    setCompletions: {},
    workoutLibrary: [],
  };
}

/** Temporary populated preview: fill gaps without replacing entered records. */
export function withSamplePreview(current: Store): Store {
  const sample = initialStore();
  const nutrition = { ...sample.nutrition };
  for (const [date, entry] of Object.entries(current.nutrition)) {
    const fallback = sample.nutrition[date] || emptyNutrition();
    nutrition[date] = {
      ...fallback,
      ...entry,
      metrics: { ...fallback.metrics, ...entry.metrics },
      meals: Object.fromEntries(meals.map((meal) => [meal, entry.meals[meal]?.length ? entry.meals[meal] : fallback.meals[meal]])),
    };
  }
  const measurements = { ...sample.measurements };
  for (const [month, entries] of Object.entries(current.measurements))
    measurements[month] = { ...measurements[month], ...entries };
  const reviews = { ...sample.reviews };
  for (const [month, entries] of Object.entries(current.reviews))
    reviews[month] = { ...reviews[month], ...entries };
  const enteredWeightDates = new Set(current.weights.map((entry) => entry.date));
  return {
    ...sample,
    ...current,
    sampleData: true,
    profile: { ...sample.profile, ...current.profile },
    nutrition,
    measurements,
    reviews,
    baselineMeasurements: { ...sample.baselineMeasurements, ...current.baselineMeasurements },
    goalsByMonth: { ...sample.goalsByMonth, ...current.goalsByMonth },
    planner: { ...sample.planner, ...current.planner },
    plans: { ...sample.plans, ...current.plans },
    logs: { ...sample.logs, ...current.logs },
    weights: [...sample.weights.filter((entry) => !enteredWeightDates.has(entry.date)), ...current.weights],
    habits: current.habits.length ? current.habits : sample.habits,
    challenge: current.challenge.length ? current.challenge : sample.challenge,
    challengeTarget: current.challengeTarget || sample.challengeTarget,
    challengeNote: current.challengeNote || sample.challengeNote,
    before: current.before || sample.before,
    after: current.after || sample.after,
    resultDates: { now: current.resultDates.now || sample.resultDates.now, previous: current.resultDates.previous || sample.resultDates.previous },
    workoutLibrary: current.workoutLibrary?.length ? current.workoutLibrary : sample.workoutLibrary,
  };
}
