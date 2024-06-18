import { FEDRAMP_MODERATE } from '../../common/constants';

/**
 * Caution: Consider Alternatives Use of this function is not recommended as a long term solution, as it creates an assumption
 * there are no other isolated environments than just FedRAMP Moderate. You are encouraged to consider alternate solutions,
 * such as Statsig or environment configuration, that don’t require creating a hard dependency between your code features
 * and the FedRAMP environment.
 * See [go-is-fedramp](https://go.atlassian.com/is-fedramp)
 */
export function isFedRamp(): boolean {
	// MICROS_PERIMETER is already used by few products, so we need to keep it for backward compatibility
	// @ts-ignore - This is causing ts errors when this package is being enrolled into jira local consumption so temporarily ts ignoring this line for now
	const env = globalThis.MICROS_PERIMETER || globalThis.UNSAFE_ATL_CONTEXT_BOUNDARY;

	if (env) {
		return env === FEDRAMP_MODERATE;
	}

	const matches = globalThis.location?.hostname?.match(
		/atlassian-us-gov-mod\.(com|net)|atlassian-us-gov\.(com|net)|atlassian-fex\.(com|net)|atlassian-stg-fedm\.(com|net)/,
	);

	return matches ? matches.length > 0 : false;
}
