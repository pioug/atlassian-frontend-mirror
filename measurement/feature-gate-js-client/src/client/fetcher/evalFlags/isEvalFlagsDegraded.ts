import type { EvalFlagsStatus } from '../../types';

/**
 * Whether the values are worse than the service intends: a provider could not be evaluated, or
 * neither provider was used.
 */
export const isEvalFlagsDegraded = (status: EvalFlagsStatus): boolean =>
	status.statsig === 'UNAVAILABLE' ||
	status.ffp === 'UNAVAILABLE' ||
	(status.statsig === 'DISABLED' && status.ffp === 'DISABLED');
