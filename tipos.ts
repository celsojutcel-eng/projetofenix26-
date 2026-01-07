
export interface DailyEntry {
  date: string; // ISO date string YYYY-MM-DD
  phrase: string;
  question: string;
  mood: string;
  reconnection: string;
  writing: string;
  selfcare: string;
  keyword: string;
  aiInsight?: string;
}

export enum View {
  TODAY = 'today',
  HISTORY = 'history',
  INSIGHTS = 'insights'
}

export const MOODS = [
  'Leve', 
  'Cansada', 
  'Inspirada', 
  'Ansiosa', 
  'Presente', 
  'Confusa', 
  'Grata', 
  'Empoderada'
];
