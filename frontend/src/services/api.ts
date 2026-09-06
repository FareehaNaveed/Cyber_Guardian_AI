/**
 * Cyber Guardian AI — API Service
 * Tries backend first, falls back to client-side analysis.
 */

import { analyzeEmail, analyzeSms, analyzeUrl, analyzePassword, analyzeQrText } from './clientAnalysis';
import type { AnalysisResult } from './clientAnalysis';

const API_BASE = import.meta.env.VITE_API_URL || '';

export type { AnalysisResult };

export interface EmailInput {
  subject: string;
  sender: string;
  body: string;
  links?: string[];
  attachments?: string[];
}

export interface SmsInput {
  text: string;
  sender?: string;
  url?: string;
}

export interface UrlInput {
  url: string;
}

async function apiCall<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  return response.json();
}

async function tryBackendOrFallback<T>(path: string, fallback: () => T, options?: RequestInit): Promise<T> {
  if (!API_BASE) return fallback();
  try {
    return await apiCall<T>(path, options);
  } catch {
    return fallback();
  }
}

export const api = {
  async analyzeEmail(data: EmailInput): Promise<AnalysisResult> {
    return tryBackendOrFallback(
      '/api/analyze/email',
      () => analyzeEmail(data),
      { method: 'POST', body: JSON.stringify(data) },
    );
  },

  async analyzeSms(data: SmsInput): Promise<AnalysisResult> {
    return tryBackendOrFallback(
      '/api/analyze/sms',
      () => analyzeSms(data),
      { method: 'POST', body: JSON.stringify(data) },
    );
  },

  async analyzeUrl(data: UrlInput): Promise<AnalysisResult> {
    return tryBackendOrFallback(
      '/api/analyze/url',
      () => analyzeUrl(data),
      { method: 'POST', body: JSON.stringify(data) },
    );
  },

  async analyzePassword(data: { password: string }): Promise<AnalysisResult> {
    return tryBackendOrFallback(
      '/api/analyze/password',
      () => analyzePassword(data),
      { method: 'POST', body: JSON.stringify(data) },
    );
  },

  async analyzeQrText(content: string): Promise<AnalysisResult> {
    return tryBackendOrFallback(
      '/api/analyze/qr/text',
      () => analyzeQrText(content),
      { method: 'POST', body: JSON.stringify({ url: content }) },
    );
  },

  async analyzeQrImage(_file: File): Promise<AnalysisResult> {
    // QR image upload requires backend — return a message
    return {
      riskLevel: 'moderate',
      threatScore: 0,
      confidence: 'low',
      indicators: [{ id: 'qr_image', label: 'QR Image uploaded', description: 'Image QR analysis requires the backend service. Please paste the QR content as text instead.', severity: 'low', category: 'observed' }],
      evidence: [{ category: 'observed', content: 'QR image uploaded' }],
      recommendations: [{ priority: 'high', action: 'Use text QR analysis', description: 'Paste the QR code URL or text content for analysis.' }],
      explanation: 'QR image analysis requires the backend. Please paste the QR code content as text for client-side analysis.',
      explanationUrdu: 'کیو آر تصویر کا تجزیہ بیک اینڈ کی ضرورت ہے۔ براہ کست کیو آر کوڈ کا مواد ٹیکسٹ کے طور پر پیسٹ کریں۔',
      analysisType: 'qr',
    };
  },

  async getEducation(): Promise<{ topics: Array<{ id: string; title: string; titleUrdu: string; icon: string }> }> {
    // Education is static data — return empty if no backend
    return { topics: [] };
  },

  async healthCheck(): Promise<{ status: string; version: string; aiEnabled: boolean }> {
    return { status: 'client-side', version: '1.0.0', aiEnabled: false };
  },
};
