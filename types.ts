
export interface Stats {
  str: number;
  con: number;
  siz: number;
  dex: number;
  app: number;
  int: number;
  pow: number;
  edu: number;
  luck: number;
}

export interface Skill {
  name: string;
  base: number;
  occupationPoints: number;
  interestPoints: number;
  growth: number;
  tag?: string; // e.g., "Art", "Language"
  isCustom?: boolean; // Indicates if the skill was added by the user
}

export interface Character {
  id: string;
  name: string;
  player: string;
  occupation: string;
  age: number;
  gender: string;
  birthplace: string;
  residence: string;
  isLost: boolean;
  
  // Stats
  rawStats: Stats; // The dice rolls (inputs)
  stats: Stats;    // The final playable stats (editable)
  
  // Status
  hp: { current: number; max: number };
  mp: { current: number; max: number };
  san: { current: number; start: number; max: number };
  luck: { current: number };
  
  // Combat
  damageBonus: string;
  build: number;
  moveRate: number;
  
  // Mental Health
  tempInsanity: boolean;
  indefInsanity: boolean;
  insanityDescription?: string; // Description of the madness (Phobia, Mania, etc.)
  
  // Skills
  skills: Skill[];
  
  // Backstory
  backstory: string;
  gear: string;
  
  // Meta
  updatedAt: string;
}

export interface SkillDefinition {
  name: string;
  base: number;
}