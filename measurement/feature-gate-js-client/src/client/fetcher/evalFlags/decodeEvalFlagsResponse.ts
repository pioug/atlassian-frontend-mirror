import type { EvalFlagsProviderStatus, EvalFlagsStatus, FfpInitializeValues } from '../../types';
import type { EvalFlagsResponse, FrontendExperimentsResponse } from '../types';

// @atlaskit/feature-gate-fetcher imports the helpers in this directory through the `./eval-flags/*`
// entry points, so the client and the providers share one implementation.

const PROVIDER_STATUSES: readonly EvalFlagsProviderStatus[] = ['OK', 'DISABLED', 'UNAVAILABLE'];

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null;

/** The status the service reported, or `undefined` when it is absent or unknown to this client. */
const decodeReportedStatus = (reported: unknown): EvalFlagsProviderStatus | undefined =>
	PROVIDER_STATUSES.find((status) => status === reported);

/**
 * A provider's status when the service reported none this client knows. The body is not validated,
 * so this falls back to the sections, which the service omits for a provider it did not use.
 */
const statusFromSection = (section: unknown): EvalFlagsProviderStatus =>
	section === undefined ? 'DISABLED' : 'OK';

/** A section normalised to `undefined` unless it carries values. */
const sectionWithValues = <T>(section: T | null | undefined, hasValues: boolean): T | undefined =>
	hasValues ? (section ?? undefined) : undefined;

/** The Statsig section when it carries values; `undefined` when omitted, `null` or empty. */
const decodeStatsigSection = (
	response: EvalFlagsResponse,
): FrontendExperimentsResponse | undefined =>
	sectionWithValues(response.statsig, isRecord(response.statsig?.experimentValues));

/** The FFP section when it carries flags; `undefined` when omitted, `null` or empty. */
const decodeFfpSection = (response: EvalFlagsResponse): FfpInitializeValues | undefined =>
	sectionWithValues(response.ffp, isRecord(response.ffp?.flags));

/** A section a caller may use, which is one whose provider is `OK`. */
const whenOk = <T>(section: T | undefined, status: EvalFlagsProviderStatus): T | undefined =>
	status === 'OK' ? section : undefined;

/** A response read once: each provider's health, and the sections a caller may use. */
export interface DecodedEvalFlagsResponse {
	readonly status: EvalFlagsStatus;
	readonly statsig?: FrontendExperimentsResponse;
	readonly ffp?: FfpInitializeValues;
}

/**
 * Read a response once. A section is usable only when it carries values and its provider is `OK`, so
 * that rule lives here rather than at each call site.
 */
export const decodeEvalFlagsResponse = (response: EvalFlagsResponse): DecodedEvalFlagsResponse => {
	const statsig = decodeStatsigSection(response);
	const ffp = decodeFfpSection(response);
	const status: EvalFlagsStatus = {
		statsig: decodeReportedStatus(response.status?.statsig) ?? statusFromSection(statsig),
		ffp: decodeReportedStatus(response.status?.ffp) ?? statusFromSection(ffp),
	};

	return { status, statsig: whenOk(statsig, status.statsig), ffp: whenOk(ffp, status.ffp) };
};
