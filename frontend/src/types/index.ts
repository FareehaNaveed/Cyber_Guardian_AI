/**
 * Cyber Guardian AI — Types
 */

export interface AnalysisResult {
  riskLevel: string;
  threatScore: number;
  confidence: string;
  indicators: Indicator[];
  evidence: Evidence[];
  recommendations: Recommendation[];
  explanation: string;
  explanationUrdu: string;
  analysisType: string;
  qrContent?: string;
  destinationType?: string;
  note?: string;
  strength?: string;
  crackTimeEstimate?: string;
  problems?: string[];
  improvementSuggestions?: string[];
}

export interface Indicator {
  id: string;
  label: string;
  description: string;
  severity: string;
  category: string;
}

export interface Evidence {
  category: string;
  content: string;
}

export interface Recommendation {
  priority: string;
  action: string;
  description: string;
}

export type AnalyzerType = 'email' | 'sms' | 'url' | 'qr' | 'password';

export interface HistoryEntry {
  id: string;
  type: string;
  timestamp: number;
  riskLevel: string;
  summary: string;
  result?: AnalysisResult;
}
