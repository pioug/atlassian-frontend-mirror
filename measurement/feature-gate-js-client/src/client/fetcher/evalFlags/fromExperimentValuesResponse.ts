import type { EvalFlagsResponse, FrontendExperimentsResponse } from '../types';

/**
 * Expresses an `/api/v2/frontend/experimentValues` response as an `/api/v1/evalFlags` response in
 * which Statsig is `OK` and FFP is `DISABLED`, for clients that do not include FFP flags.
 */
export const fromExperimentValuesResponse = (
	response: FrontendExperimentsResponse,
): EvalFlagsResponse => ({
	statsig: response,
	status: { statsig: 'OK', ffp: 'DISABLED' },
});
