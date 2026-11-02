import type { EvalFlagsStatus } from '../types';

/**
 * Thrown when the Feature Flag Service responds, but no provider is `OK` and one is `UNAVAILABLE`, so
 * there are no values to use. Initialization and user updates fail as for any other failed fetch.
 */
export class EvalFlagsUnavailableError extends Error {
	readonly status: EvalFlagsStatus;

	constructor(status: EvalFlagsStatus) {
		super(`Feature flag values are unavailable (Statsig: ${status.statsig}, FFP: ${status.ffp})`);
		this.status = status;
	}
}
