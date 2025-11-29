
import { Stats } from '../types';

export const calculateHalf = (val: number) => Math.floor(val / 2);
export const calculateFifth = (val: number) => Math.floor(val / 5);

export const calculateDamageBonusAndBuild = (str: number, siz: number): { db: string; build: number } => {
  const total = str + siz;
  if (total <= 64) return { db: "-2", build: -2 };
  if (total <= 84) return { db: "-1", build: -1 };
  if (total <= 124) return { db: "0", build: 0 };
  if (total <= 164) return { db: "+1d4", build: 1 };
  if (total <= 204) return { db: "+1d6", build: 2 };
  if (total <= 284) return { db: "+2d6", build: 3 };
  if (total <= 364) return { db: "+3d6", build: 4 };
  if (total <= 444) return { db: "+4d6", build: 5 };
  if (total <= 524) return { db: "+5d6", build: 6 };
  return { db: "+6d6", build: 7 }; // Capped for simplicity
};

export const calculateMoveRate = (dex: number, str: number, siz: number, age: number): number => {
  let mov = 8;
  if (dex < siz && str < siz) mov = 7;
  else if (dex > siz && str > siz) mov = 9;
  
  // Age modifiers for MOV (Still automated as it's a derived stat, but usually fixed rule)
  // Or should we remove this too? Usually MOV changes are strictly enforced by age.
  // We will keep MOV auto-calc for convenience as it is derived, not a base stat.
  if (age >= 40 && age < 50) mov -= 1;
  else if (age >= 50 && age < 60) mov -= 2;
  else if (age >= 60 && age < 70) mov -= 3;
  else if (age >= 70 && age < 80) mov -= 4;
  else if (age >= 80) mov -= 5;

  return Math.max(0, mov);
};

// Converts Raw Dice Rolls (e.g., 10 from 3D6) into Percentage Stats (e.g., 50)
export const calculateBaseStats = (dice: Stats): Stats => {
  const stats = { ...dice };
  
  // Group 1: 3D6 * 5
  // STR, CON, DEX, APP, POW
  stats.str = dice.str * 5;
  stats.con = dice.con * 5;
  stats.dex = dice.dex * 5;
  stats.app = dice.app * 5;
  stats.pow = dice.pow * 5;
  
  // Group 2: (2D6 + 6) * 5
  // SIZ, INT, EDU. User inputs the 2D6 result (2-12).
  stats.siz = (dice.siz + 6) * 5;
  stats.int = (dice.int + 6) * 5;
  stats.edu = (dice.edu + 6) * 5;
  
  // Luck is usually 3D6 * 5 for starting value
  stats.luck = dice.luck * 5; 
  
  return stats;
};

// Returns the text description of age modifiers instead of applying them automatically
export const getAgeRuleDescription = (age: number): string => {
  if (age >= 15 && age <= 19) {
    return "15~19세: [근력]과 [크기] 합계에서 5점 뺌. [교육]에서 5점 뺌. 운(LUCK)을 두 번 굴려 높은 값 사용.";
  } else if (age >= 20 && age <= 39) {
    return "20~39세: [교육] 향상 판정 1회.";
  } else if (age >= 40 && age <= 49) {
    return "40~49세: [근력], [건강], [민첩] 합계에서 5점 뺌. [외모] 5점 뺌. [교육] 향상 판정 2회.";
  } else if (age >= 50 && age <= 59) {
    return "50~59세: [근력], [건강], [민첩] 합계에서 10점 뺌. [외모] 10점 뺌. [교육] 향상 판정 3회.";
  } else if (age >= 60 && age <= 69) {
    return "60~69세: [근력], [건강], [민첩] 합계에서 20점 뺌. [외모] 15점 뺌. [교육] 향상 판정 4회.";
  } else if (age >= 70 && age <= 79) {
    return "70~79세: [근력], [건강], [민첩] 합계에서 40점 뺌. [외모] 20점 뺌. [교육] 향상 판정 4회.";
  } else if (age >= 80) {
    return "80세 이상: [근력], [건강], [민첩] 합계에서 80점 뺌. [외모] 25점 뺌. [교육] 향상 판정 4회.";
  }
  return "";
};
