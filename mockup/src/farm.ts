/* The farm profile the farmer fills in. Stored on the device only. */

export type Season = "aus" | "aman" | "boro";
export type CropStatus = "preparing" | "planted";
export type LandType = "high" | "medium" | "low";

export type FarmProfile = {
  name: string;
  district: string;
  status: CropStatus | null;
  season: Season | null;
  /** Days since the seedlings went into the field (when status === "planted"). */
  plantedDays: number | null;
  landType: LandType | null;
  hasIrrigation: boolean | null;
  fertilizers: string[];
  /** Field size in shotangsho (1 shotangsho = 40 sq m). */
  areaShotangsho: number | null;
};

export const EMPTY_PROFILE: FarmProfile = {
  name: "",
  district: "",
  status: null,
  season: null,
  plantedDays: null,
  landType: null,
  hasIrrigation: null,
  fertilizers: [],
  areaShotangsho: null,
};

const PROFILE_KEY = "krishisathi.farmProfile";

export const CROP_STATUSES: ReadonlyArray<{ value: CropStatus; label: string; sub: string }> = [
  { value: "preparing", label: "জমি তৈরি করছি", sub: "এখনো চারা রোপণ করিনি" },
  { value: "planted", label: "চারা রোপণ করেছি", sub: "মাঠে ধান লাগানো আছে" },
];

export const SEASONS: ReadonlyArray<{ value: Season; label: string; sub: string }> = [
  { value: "aus", label: "আউশ", sub: "গ্রীষ্মের ধান" },
  { value: "aman", label: "আমন", sub: "বর্ষার ধান" },
  { value: "boro", label: "বোরো", sub: "শীতের ধান" },
];

export const LAND_TYPES: ReadonlyArray<{ value: LandType; label: string; sub: string }> = [
  { value: "high", label: "উঁচু জমি", sub: "পানি দ্রুত সরে যায়" },
  { value: "medium", label: "মাঝারি জমি", sub: "সাধারণ ধান চাষের উপযোগী" },
  { value: "low", label: "নিচু জমি", sub: "বৃষ্টির পানি জমে থাকে" },
];

export const FERTILIZER_OPTIONS = [
  "ইউরিয়া",
  "টিএসপি",
  "এমওপি (পটাশ)",
  "জৈব / গোবর সার",
  "এখনো দিইনি",
] as const;

export const DISTRICTS = [
  "দিনাজপুর",
  "বগুড়া",
  "সিরাজগঞ্জ",
  "নরসিংদী",
  "বরিশাল",
  "খুলনা",
] as const;

export const PLANTED_DAYS = [7, 15, 30, 45, 60, 75] as const;
export const AREAS = [10, 20, 33, 50, 100] as const;

export function seasonLabel(season: Season | null): string | null {
  return SEASONS.find((item) => item.value === season)?.label ?? null;
}

export function landLabel(landType: LandType | null): string | null {
  return LAND_TYPES.find((item) => item.value === landType)?.label ?? null;
}

/** True once the farmer has told us their cultivation status or stage. */
export function hasFarm(profile: FarmProfile): boolean {
  return profile.status !== null || profile.plantedDays !== null || profile.season !== null;
}

export type Stage = { label: string; percent: number };

const STAGES: ReadonlyArray<{ until: number; label: string; percent: number }> = [
  { until: 10, label: "রোপণ", percent: 15 },
  { until: 45, label: "বৃদ্ধি", percent: 48 },
  { until: 75, label: "ফুল আসা", percent: 74 },
  { until: 100, label: "পাকা", percent: 90 },
  { until: Number.POSITIVE_INFINITY, label: "কাটা", percent: 100 },
];

export function stageFor(days: number): Stage {
  const band = STAGES.find((item) => days <= item.until) ?? STAGES[STAGES.length - 1];
  return { label: band.label, percent: band.percent };
}

/** Returns tailored tasks based on the farmer's actual profile answers (demo logic). */
export function tasksForProfile(profile: FarmProfile): string[] {
  if (profile.status === "preparing") {
    const tasks = [
      "জমি ভালোভাবে চাষ ও মই দিয়ে সমান করুন",
      "আইল বেঁধে পানি ধরে রাখার ব্যবস্থা করুন",
    ];
    if (profile.fertilizers.includes("এখনো দিইনি") || profile.fertilizers.length === 0) {
      tasks.push("চারা রোপণের আগে ভিত্তি সার ও জৈব সার মেশানোর প্রস্তুতি নিন");
    } else {
      tasks.push("সুস্থ ও সবল চারা বাছাই করে রোপণের জন্য প্রস্তুত রাখুন");
    }
    return tasks;
  }

  const days = profile.plantedDays ?? 30;
  if (days <= 15) {
    return [
      "রোপণের পর জমিতে হালকা ছিপছিপে পানি রাখুন",
      "মরা চারা থাকলে ৭–১০ দিনের মধ্যে নতুন চারা দিয়ে পূরণ করুন",
      "আগাছা গজাচ্ছে কি না খেয়াল করুন",
    ];
  }
  if (days <= 45) {
    return [
      "জমিতে বাড়তি পানি জমে থাকলে সরিয়ে দিন",
      "পাতার রঙ হলদে বা দাগযুক্ত হচ্ছে কি না দেখুন",
      "আগাছা পরিষ্কার করে সারির মাঝে আলো-বাতাস চলাচল রাখুন",
    ];
  }
  return [
    "ধানের শীষ বের হওয়ার সময় জমিতে যেন রস থাকে তা দেখুন",
    "পাতা বা শীষে পোকা দেখা যাচ্ছে কি না খেয়াল করুন",
    "কোনো সন্দেহ হলে কৃষি অফিসের পরামর্শ নিন",
  ];
}

export function suggestionForProfile(profile: FarmProfile): string {
  const landNote =
    profile.landType === "low"
      ? "নিচু জমি হওয়ায় বাড়তি পানি বের করার নালা পরিষ্কার রাখা জরুরি।"
      : profile.landType === "high"
        ? "উঁচু জমি হওয়ায় সেচ ও রস ধরে রাখার দিকে খেয়াল রাখুন।"
        : "মাঝারি জমিতে সময়মতো সেচ ও আগাছা দমন করলে ভালো ফলন পাওয়া যায়।";

  if (profile.status === "preparing") {
    return `${landNote} চারা রোপণের আগে কৃষি অফিসের পরামর্শ অনুযায়ী ভিত্তি সার ব্যবহার করুন।`;
  }
  if (profile.fertilizers.includes("এখনো দিইনি")) {
    return `${landNote} এখনো সার না দিয়ে থাকলে গাছের বয়স অনুযায়ী সঠিক মাত্রা কৃষি অফিস থেকে জেনে নিন।`;
  }
  return `${landNote} নিয়মিত পাতার রঙ পর্যবেক্ষণ করুন; অপ্রয়োজনীয় ওষুধ স্প্রে করা থেকে বিরত থাকুন।`;
}

function isSeason(value: unknown): value is Season {
  return value === "aus" || value === "aman" || value === "boro";
}

function isStatus(value: unknown): value is CropStatus {
  return value === "preparing" || value === "planted";
}

function isLand(value: unknown): value is LandType {
  return value === "high" || value === "medium" || value === "low";
}

export function readProfile(): FarmProfile {
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return EMPTY_PROFILE;
    const saved = JSON.parse(raw) as Partial<FarmProfile>;
    return {
      name: typeof saved.name === "string" ? saved.name : "",
      district: typeof saved.district === "string" ? saved.district : "",
      status: isStatus(saved.status) ? saved.status : null,
      season: isSeason(saved.season) ? saved.season : null,
      plantedDays: typeof saved.plantedDays === "number" ? saved.plantedDays : null,
      landType: isLand(saved.landType) ? saved.landType : null,
      hasIrrigation: typeof saved.hasIrrigation === "boolean" ? saved.hasIrrigation : null,
      fertilizers: Array.isArray(saved.fertilizers)
        ? saved.fertilizers.filter((x): x is string => typeof x === "string")
        : [],
      areaShotangsho: typeof saved.areaShotangsho === "number" ? saved.areaShotangsho : null,
    };
  } catch {
    return EMPTY_PROFILE;
  }
}

export function writeProfile(profile: FarmProfile): void {
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* Private mode can block storage; the demo still works without it. */
  }
}
