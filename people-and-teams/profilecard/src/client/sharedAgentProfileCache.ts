import { LRUMap } from 'lru_map';

import type { RovoAgentCardClientResult } from '../types';

/**
 * Module-level agent profile cache shared across every `RovoAgentCardClient`
 * instance
 */
type CachedAgentProfile = { expire: number; profile: RovoAgentCardClientResult };

const SHARED_CACHE_SIZE = 50;
export const SHARED_CACHE_MAX_AGE: number = 5 * 60 * 1000; // 5 minutes

export const sharedAgentProfileCache: LRUMap<string, CachedAgentProfile> = new LRUMap(
	SHARED_CACHE_SIZE,
);
