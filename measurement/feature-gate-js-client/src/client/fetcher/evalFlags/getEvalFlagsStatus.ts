import type { EvalFlagsStatus } from '../../types';
import type { EvalFlagsResponse } from '../types';
import { decodeEvalFlagsResponse } from './decodeEvalFlagsResponse';

/**
 * The health of each provider, derived from the sections when the reported status is missing or
 * unknown.
 */
export const getEvalFlagsStatus = (response: EvalFlagsResponse): EvalFlagsStatus =>
	decodeEvalFlagsResponse(response).status;
