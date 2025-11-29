
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

// Names Database
export const NAMES_KOREAN = [
  "김철수", "이영희", "박지민", "최민수", "정서연", "강현우", "윤하은", "장동건", "임수정", "한석규",
  "김도윤", "이하준", "박서준", "최지우", "정민재", "강준우", "윤도현", "장예준", "임건우", "한지호",
  "김우진", "이선우", "박서진", "최연우", "정유준", "강시우", "윤준서", "장지훈", "임현준", "한은우",
  "김지유", "이서윤", "박서아", "최하윤", "정지아", "강지우", "윤소율", "장하은", "임민서", "한유나",
  "김윤아", "이채원", "박수아", "최지유", "정서율", "강은서", "윤다은", "장예은", "임수빈", "한지안",
  "류승룡", "마동석", "송강호", "황정민", "이정재", "하정우", "전지현", "김혜수", "손예진", "박보영",
  "이병헌", "공유", "현빈", "조승우", "배두나", "김태리", "아이유", "수지", "박서준", "정해인"
];

export const NAMES_ENGLISH = [
  "John Smith", "Jane Doe", "Arthur Blackwood", "Eleanor Vance", "Harvey Walters", "Mary Johnson", "William Scott", "Elizabeth Brown",
  "Thomas Anderson", "Charles Miller", "George Davis", "Henry Wilson", "Edward Moore", "Frank Taylor", "Walter White", "Harry Harris",
  "Harold Martin", "Richard Thompson", "Joseph Garcia", "Paul Martinez", "Robert Robinson", "James Clark", "Margaret Lewis", "Ruth Lee",
  "Helen Walker", "Dorothy Hall", "Virginia Allen", "Mildred Young", "Frances King", "Sarah Wright", "Alice Scott", "Ann Green",
  "Florence Baker", "Martha Adams", "Howard Phillips", "Randolph Carter", "Richard Upton Pickman", "Herbert West", "Wilbur Whateley", "Obed Marsh",
  "Etienne Laurent", "Sebastian Thorne", "Beatrice Sharpe", "Adelaide French", "Victoria Wingate", "Cordelia Vane", "Silas Marsh", "Preston Sterling",
  "Nathaniel Wingate Peaslee", "Francis Wayland Thurston", "Henry Armitage", "Albert Wilmarth", "Walter Gilman", "William Dyer"
];

export const NAMES_ASIAN = [
  "다나카 히로시 (Tanaka Hiroshi)", "스즈키 사쿠라 (Suzuki Sakura)", "사토 켄지 (Sato Kenji)", "야마모토 유키 (Yamamoto Yuki)", "나카무라 렌 (Nakamura Ren)",
  "코바야시 하하루 (Kobayashi Haru)", "카토 미사키 (Kato Misaki)", "요시다 타쿠미 (Yoshida Takumi)", "야마다 아오이 (Yamada Aoi)", "사사키 료 (Sasaki Ryo)",
  "왕 웨이 (Wang Wei)", "리 메이 (Li Mei)", "장 웨이 (Zhang Wei)", "류 양 (Liu Yang)", "첸 민 (Chen Min)",
  "양 시우 (Yang Xiu)", "황 레이 (Huang Lei)", "자오 팡 (Zhao Fang)", "우 진 (Wu Jin)", "주 링 (Zhou Ling)",
  "응우옌 반 민 (Nguyen Van Minh)", "트란 티 마이 (Tran Thi Mai)", "레 반 훙 (Le Van Hung)", "팜 티 란 (Pham Thi Lan)", "호앙 득 (Hoang Duc)",
  "타카하시 류 (Takahashi Ryu)", "이토 유이 (Ito Yui)", "와타나베 켄 (Watanabe Ken)", "마츠모토 준 (Matsumoto Jun)", "이노우에 마오 (Inoue Mao)",
  "김라희 (Kim Lahee)", "박솔 (Park Sol)", "최강 (Choi Kang)", "정하늘 (Jung Haneul)", "윤바다 (Yoon Bada)"
];

// Use LocalStorage key for the API URL so the user doesn't have to re-enter it every refresh
export const LS_API_KEY = "coc_sheet_api_url";
