import type { EvalFlagsStatus } from '../../types';

/**
 * Whether the values serve nothing because no provider is `OK` and one could not be evaluated. Such a
 * response is treated as a failed fetch, as the service returned a 5xx in that case before it
 * reported provider status. Both providers `DISABLED` is deliberate, so it is not included.
 */
export const hasNoUsableProvider = (status: EvalFlagsStatus): boolean =>
	status.statsig !== 'OK' &&
	status.ffp !== 'OK' &&
	(status.statsig === 'UNAVAILABLE' || status.ffp === 'UNAVAILABLE');
