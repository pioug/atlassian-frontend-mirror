import { LRUMap } from 'lru_map';
import type { AISummaryServiceInt } from './types';

const AI_SUMMARY_CACHE_SIZE = 100;

// Contains cached mapping between url and an AISummaryService.
export const AISummariesStore = new LRUMap<string, AISummaryServiceInt>(
  AI_SUMMARY_CACHE_SIZE,
);
