import { SkillDefinition } from './types';

export const BASE_SKILLS: SkillDefinition[] = [
  { name: "회계", base: 5 },
  { name: "인류학", base: 1 },
  { name: "감정", base: 5 },
  { name: "고고학", base: 1 },
  { name: "예술/공예", base: 5 },
  { name: "매혹", base: 15 },
  { name: "오르기", base: 20 },
  { name: "컴퓨터 사용", base: 5 },
  { name: "신용등급", base: 0 },
  { name: "크툴루 신화", base: 0 },
  { name: "변장", base: 5 },
  { name: "회피", base: 0 }, // Special: Half DEX
  { name: "자동차 운전", base: 20 },
  { name: "전기 수리", base: 10 },
  { name: "전자 공학", base: 1 },
  { name: "말재주", base: 5 },
  { name: "근접전(격투)", base: 25 },
  { name: "사격(권총)", base: 20 },
  { name: "응급처치", base: 30 },
  { name: "역사", base: 5 },
  { name: "위협", base: 15 },
  { name: "도약", base: 20 },
  { name: "외국어", base: 1 },
  { name: "모국어", base: 0 }, // Special: EDU
  { name: "법률", base: 5 },
  { name: "자료조사", base: 20 },
  { name: "듣기", base: 20 },
  { name: "열쇠공", base: 1 },
  { name: "기계 수리", base: 10 },
  { name: "의료", base: 1 },
  { name: "자연", base: 10 },
  { name: "항법", base: 10 },
  { name: "오컬트", base: 5 },
  { name: "중장비 조작", base: 1 },
  { name: "설득", base: 10 },
  { name: "조종", base: 1 },
  { name: "심리학", base: 10 },
  { name: "정신분석", base: 1 },
  { name: "승마", base: 5 },
  { name: "과학", base: 1 },
  { name: "손놀림", base: 10 },
  { name: "관찰력", base: 25 },
  { name: "은밀행동", base: 20 },
  { name: "생존술", base: 10 },
  { name: "수영", base: 20 },
  { name: "투척", base: 20 },
  { name: "추적", base: 10 },
];

export const NAMES_KOREAN = ["김철수", "이영희", "박지민", "최민수", "정서연", "강현우", "윤하은", "장동건", "임수정", "한석규"];
export const NAMES_ENGLISH = ["John Smith", "Jane Doe", "Arthur Blackwood", "Eleanor Vance", "Harvey Walters", "Mary Johnson", "William Scott", "Elizabeth Brown"];
export const NAMES_ASIAN = ["Tanaka Hiroshi", "Suzuki Sakura", "Chen Wei", "Li Mei", "Sato Kenji", "Nguyen Van Minh"];

// Use LocalStorage key for the API URL so the user doesn't have to re-enter it every refresh
export const LS_API_KEY = "coc_sheet_api_url";