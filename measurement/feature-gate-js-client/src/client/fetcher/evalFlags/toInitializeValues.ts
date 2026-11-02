import type { CustomAttributes, EvalFlagsProvider, FrontendExperimentsResult } from '../../types';
import type { EvalFlagsResponse } from '../types';
import { decodeEvalFlagsResponse } from './decodeEvalFlagsResponse';

/**
 * Normalises an `/api/v1/evalFlags` response. A section is used only when its provider is `OK`.
 * Without a Statsig section, Statsig is bootstrapped with no values (so its flags return code
 * defaults) and the request attributes are used for the user. A `DISABLED` provider is listed in
 * `disabledProviders`, so the client neither initializes nor calls it.
 */
export const toInitializeValues = (
	response: EvalFlagsResponse,
	requestCustomAttributes: CustomAttributes | undefined,
): FrontendExperimentsResult => {
	const { status, statsig, ffp } = decodeEvalFlagsResponse(response);
	const disabledProviders = (['statsig', 'ffp'] as const).filter(
		(provider: EvalFlagsProvider) => status[provider] === 'DISABLED',
	);
	return {
		clientSdkKey: statsig?.clientSdkKey,
		experimentValues: statsig?.experimentValues ?? {},
		customAttributesFromFetch: statsig?.customAttributes ?? requestCustomAttributes,
		ffp,
		status,
		...(disabledProviders.length > 0 && { disabledProviders }),
	};
};
