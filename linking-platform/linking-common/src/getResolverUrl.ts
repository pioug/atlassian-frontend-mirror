import { getBaseUrl } from './getBaseUrl';
import { type EnvironmentsKeys } from './types';

export const getResolverUrl: any = (
	envKey?: EnvironmentsKeys,
	baseUrlOverride?: string,
): string => {
	// The `custom` environment is used if the full resolver URL is provided by the user.
	// It could be useful for SSR, where `CardClient` should use direct service URL instead of the Edge Proxy.
	if (envKey === 'custom') {
		return baseUrlOverride ?? '/gateway/api/object-resolver';
	}

	// If an environment is provided, then use Stargate directly for requests.
	if (envKey || baseUrlOverride) {
		const baseUrl = baseUrlOverride || getBaseUrl(envKey);

		return `${baseUrl}/object-resolver`;
	} else {
		// Otherwise, we fallback to using the Edge Proxy to access Stargate,
		// which fixes some cookie issues with strict Browser policies.
		return '/gateway/api/object-resolver';
	}
};
