
export type Language = 'en' | 'mr';

export type PlanType = 'free' | 'premium';

export type Translation = Record<string, Record<Language, string>>;

export interface PlanetPosition {
  name: string;
  house: number;
  sign?: string;
  isRetrograde?: boolean;
}

export interface BirthDetails {
  name: string;
  date: string;
  time: string;
  place: string;
  gender: 'male' | 'female';
  phoneNumber?: string;
  carNumber?: string;
  isPremium?: boolean;
  email?: string;
  carColor?: string;
  // New Fields
  spouseName?: string;
  spouseDOB?: string;
  childName?: string;
  childDOB?: string;
  signatureBase64?: string;
}

export interface YearPrediction {
  year: number;
  theme: string;
  career: string;
  health: string;
  relationship: string;
  finance: string;
  remedy: string;
}

export interface NumerologyReport {
  // Meta
  generatedDate?: string;

  // Core Numbers
  driver: number;
  conductor: number;
  
  // Page 4: Snapshot
  summary: {
    lifeTheme: string;
    luckyElements: string[];
    keyAdvice: string[];
    favorableNumbers: number[];
    favorableDays: string[];
    favorableColors: string[];
  };

  // Detailed Analysis (Pages 5-14)
  loShuGrid: number[]; // Numbers present in grid
  birthChartAnalysis: string;
  driverAnalysis: string; // Detailed
  conductorAnalysis: string; // Detailed
  combinationAnalysis: string; // Driver-Conductor dynamics
  strengths: string[];
  weaknesses: string[];

  // Missing Numbers (Pages 15-17)
  missingNumbers: number[];
  missingNumberAnalysis: string;
  missingNumberRemedies: string[];

  // Name & Mobile (Pages 19-22)
  nameAnalysis: string;
  nameCorrection: string; // Suggestion
  mobileAnalysis: string;
  mobileScore: string; // e.g. "Good" or "Bad"
  
  // New Car Fields
  carAnalysis?: string;
  carScore?: string;

  // Signature
  signatureAnalysis: string; // General advice
  signatureVisualAnalysis?: string; // Specific to the image drawn
  userSignatureImage?: string; // To display back in report

  // Family Analysis
  spouseAnalysis?: string;
  childAnalysis?: string;

  // Health (Pages 23-24)
  healthAnalysis: string;
  healthRemedies: string[];

  // Career & Finance (Pages 25-27)
  careerAnalysis: string;
  suitableProfessions: string[];
  financeAnalysis: string;
  wealthMindset: string;
  
  // Relationships (Pages 28-29)
  relationshipAnalysis: string;
  familyDynamics: string;

  // Future (Pages 31-35) - Detailed object per year
  futurePredictions: YearPrediction[];

  // Remedies (Pages 36-38)
  remedies: {
    lalKitab: string[];
    lifestyle: string[];
    crystals: string;
    yantra: string;
  };

  // Conclusion (Page 40)
  actionPlan: string[];
  goldenRules: string[];
}
