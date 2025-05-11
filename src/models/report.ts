// Report section structure
export interface ReportSection {
  title: string;
  content: string;
  chartImageUrl?: string; // Optional: for visualizations
}

// Base report interface
export interface BaseReport {
  id: string;
  userId: string;
  type: ReportType;
  createdAt: number; // Unix timestamp
  sections: ReportSection[];
  creditCost: number;
}

export type ReportType =
  | 'birth_chart'
  | 'compatibility'
  | 'career'
  | 'finance';

// Birth Chart Report
export interface BirthChartReport extends BaseReport {
  type: 'birth_chart';
  birthDetails: {
    name?: string;
    birthDate: string;
    birthTime?: string;
    birthPlace: string;
    sunSign: string;
    moonSign: string;
    ascendant: string;
    planetaryPositions: Record<string, string>; // e.g., { Sun: 'Aries', Moon: 'Taurus', ... }
  };
}

// Compatibility Report
export interface CompatibilityReport extends BaseReport {
  type: 'compatibility';
  partnerDetails: {
    name?: string;
    birthDate: string;
    birthTime?: string;
    birthPlace: string;
    sunSign: string;
    moonSign: string;
    ascendant: string;
    planetaryPositions: Record<string, string>;
  };
  compatibilityScore: number;
  summary: string;
}

// Career Report
export interface CareerReport extends BaseReport {
  type: 'career';
  focusAreas: string[];
  recommendations: string[];
}

// Finance Report
export interface FinanceReport extends BaseReport {
  type: 'finance';
  financialInsights: string[];
  riskAssessment: string;
}

// Union type for all reports
export type AstrologicalReport =
  | BirthChartReport
  | CompatibilityReport
  | CareerReport
  | FinanceReport; 