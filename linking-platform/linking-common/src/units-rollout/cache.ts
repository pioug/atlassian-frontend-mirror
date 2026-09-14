import { type UnitsRolloutSettings } from './types';

/**
 * Holds the in-flight/resolved request so that the settings are only fetched once per page load.
 */
export const cache: { promise?: Promise<UnitsRolloutSettings> } = {};
