import { ResponseError } from '@atlaskit/feature-gate-fetcher/errors';
import Fetcher, {
	EVAL_FLAGS_API_VERSION,
	EXPERIMENT_VALUES_API_VERSION,
	fromExperimentValuesResponse,
	getEvalFlagsStatus,
	toFrontendExperimentsResult,
} from '@atlaskit/feature-gate-fetcher/Fetcher';
import type { EvalFlagsResponse, FetcherOptions } from '@atlaskit/feature-gate-fetcher/types';
import {
	type CustomAttributes,
	type EvalFlagsStatus,
	FeatureGateEnvironment,
	type FrontendExperimentsResult,
} from '@atlaskit/feature-gate-js-client/types';

import { type RulesetProfile } from '../database/types';

/**
 * Prefix of the profile hash, which keys the cached values and names the broadcast channel, when
 * FFP flags are included. It names the endpoint that produced the values, so entries cached or
 * broadcast by versions that called another endpoint (with another response shape) are never read.
 */
export const PROFILE_HASH_PREFIX: string = `evalFlags.${EVAL_FLAGS_API_VERSION}`;

/**
 * Prefix of the profile hash when FFP flags are not included. It differs from
 * {@link PROFILE_HASH_PREFIX}, so values fetched with one setting are never served with the other,
 * and from the prefixes of earlier versions, which cached the values in another shape.
 */
export const STATSIG_ONLY_PROFILE_HASH_PREFIX: string = `experimentValues.${EXPERIMENT_VALUES_API_VERSION}`;

export const getProfileHashPrefix = (includeFfpFlags: boolean | undefined): string =>
	includeFfpFlags ? PROFILE_HASH_PREFIX : STATSIG_ONLY_PROFILE_HASH_PREFIX;

/**
 * Fetches the values for a profile. With `includeFfpFlags`, they come from `/api/v1/evalFlags`;
 * otherwise only Statsig values are fetched, from `/api/v2/frontend/experimentValues`, and are
 * returned as a response in which FFP is `DISABLED`.
 */
export const fetchFlagValues = (
	clientVersion: string,
	fetcherOptions: FetcherOptions,
	rulesetProfile: RulesetProfile,
): Promise<EvalFlagsResponse> => {
	const { identifiers, customAttributes } = rulesetProfile;
	if (fetcherOptions.includeFfpFlags) {
		return Fetcher.fetchEvalFlags(clientVersion, fetcherOptions, identifiers, customAttributes);
	}
	return Fetcher.fetchExperimentValues(
		clientVersion,
		fetcherOptions,
		identifiers,
		customAttributes,
	).then(fromExperimentValuesResponse);
};

/**
 * Converts a (possibly merged, see {@link withLastOkSections}) evalFlags response into a provider
 * result. `status` is the health reported by the fetch that produced the values; omit it for values
 * that were not freshly fetched by this tab (cached or broadcast), so they are not reported again.
 */
export const getFrontendExperimentsResult = (
	evalFlagsResponse: EvalFlagsResponse,
	requestCustomAttributes?: CustomAttributes,
	status?: EvalFlagsStatus,
): FrontendExperimentsResult => {
	const { status: _status, ...result } = toFrontendExperimentsResult(
		evalFlagsResponse,
		requestCustomAttributes,
	);
	return status ? { ...result, status } : result;
};

/** 4xx statuses that are worth retrying because they describe a temporary condition. */
const RETRYABLE_CLIENT_ERROR_STATUSES: readonly number[] = [408, 429];

/**
 * Whether a failed fetch is worth retrying. A 4xx means the request itself is wrong (for example an
 * invalid API key or body), so retrying will not change the outcome until the profile changes; 408
 * and 429 are the exceptions. 5xx and network errors are retried.
 */
export const isRetryableFetchError = (error: unknown): boolean => {
	if (!(error instanceof ResponseError)) {
		return true;
	}
	return (
		error.status < 400 ||
		error.status >= 500 ||
		RETRYABLE_CLIENT_ERROR_STATUSES.includes(error.status)
	);
};

/**
 * Replaces the section of each provider that is `UNAVAILABLE` in `next` with its last `OK` section
 * from `previous` (a response for the same profile), so a temporary outage does not reset that
 * provider's flags to their defaults. The replaced section is marked `OK`, so the merged response
 * can be cached and broadcast like any other. `DISABLED` providers are deliberate, so are applied
 * as returned.
 */
export const withLastOkSections = (
	next: EvalFlagsResponse,
	previous: EvalFlagsResponse | undefined,
): EvalFlagsResponse => {
	if (!previous) {
		return next;
	}
	const nextStatus = getEvalFlagsStatus(next);
	const previousStatus = getEvalFlagsStatus(previous);
	const keepStatsig = nextStatus.statsig === 'UNAVAILABLE' && previousStatus.statsig === 'OK';
	const keepFfp = nextStatus.ffp === 'UNAVAILABLE' && previousStatus.ffp === 'OK';
	if (!keepStatsig && !keepFfp) {
		return next;
	}
	return {
		...next,
		statsig: keepStatsig ? previous.statsig : next.statsig,
		ffp: keepFfp ? previous.ffp : next.ffp,
		status: {
			statsig: keepStatsig ? 'OK' : nextStatus.statsig,
			ffp: keepFfp ? 'OK' : nextStatus.ffp,
		},
	};
};

export const getValidatedPollingInterval = (
	currentInterval: number,
	environment: FeatureGateEnvironment,
	logInfo: boolean,
): number => {
	const prodMinInterval = 60000;
	const nonProdMinInterval = 1000;
	let newInterval = currentInterval;
	if (currentInterval < prodMinInterval) {
		if (environment === FeatureGateEnvironment.Production) {
			newInterval = prodMinInterval;
			if (logInfo) {
				// eslint-disable-next-line no-console
				console.info(
					`options.pollingInterval needs to be greater than ${prodMinInterval}, interval has been set to minimum`,
				);
			}
		} else if (currentInterval < nonProdMinInterval) {
			newInterval = nonProdMinInterval;
			if (logInfo) {
				// eslint-disable-next-line no-console
				console.info(
					`options.pollingInterval needs to be greater than ${nonProdMinInterval}, interval has been set to minimum`,
				);
			}
		} else {
			if (logInfo) {
				// eslint-disable-next-line no-console
				console.info(
					`options.pollingInterval needs to be greater than ${prodMinInterval} in Production`,
				);
			}
		}
	}
	return newInterval;
};

export const createHash = async (input: string): Promise<string> => {
	const msgUint8 = new TextEncoder().encode(input); // encode as (utf-8) Uint8Array
	const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8); // hash the message
	const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
	return hashHex;
};

export const cloneObject = <T>(obj: T): T => {
	const str = JSON.stringify(obj);
	return JSON.parse(str);
};
