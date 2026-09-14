import { BaseUrls, prodBaseUrl } from './environments';
import { type EnvironmentsKeys } from './types';

export const getBaseUrl: any = (envKey?: EnvironmentsKeys, baseUrlOverride?: string): string => {
	// The `custom` environment is used if the full resolver URL is provided by the user.
	// It could be useful for SSR, where `CardClient` should use direct service URL instead of the Edge Proxy.
	if (envKey === 'custom') {
		return baseUrlOverride ?? prodBaseUrl;
	}

	// If an environment is provided, then use Stargate.
	if (envKey) {
		return envKey in BaseUrls
			? BaseUrls[envKey as Exclude<EnvironmentsKeys, 'custom'>]
			: prodBaseUrl;
	}

	return typeof window !== 'undefined' && typeof window.location !== 'undefined'
		? window.location.origin
		: '';
};
