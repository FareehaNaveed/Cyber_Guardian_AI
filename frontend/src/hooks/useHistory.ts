/**
 * Cyber Guardian AI — History Hook
 * Uses sessionStorage for temporary history that clears when browser/tab closes.
 */

import { useState, useEffect, useCallback } from 'react';
import { generateId } from '@/lib/utils';

export interface HistoryEntry {
  id: string;
  type: string;
  timestamp: number;
  riskLevel: string;
  summary: string;
  result?: unknown;
}

const STORAGE_KEY = 'cyber-guardian-history';

function loadHistory(): HistoryEntry[] {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage full or unavailable
  }
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addEntry = useCallback((type: string, riskLevel: string, summary: string, result?: unknown) => {
    const entry: HistoryEntry = {
      id: generateId(),
      type,
      timestamp: Date.now(),
      riskLevel,
      summary,
      result,
    };
    setHistory(prev => [entry, ...prev].slice(0, 50)); // Keep last 50
    return entry;
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setHistory(prev => prev.filter(e => e.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    history,
    addEntry,
    deleteEntry,
    clearHistory,
  };
}
