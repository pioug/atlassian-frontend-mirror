import { type UnitsRolloutSettings } from './types';

/**
 * Holds in-flight/resolved requests per fallback org id for the lifetime of the page.
 */
export const cache: Map<string, Promise<UnitsRolloutSettings>> = new Map();
