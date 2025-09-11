import { type EnvironmentsKeys } from './types';

const devBaseUrl = 'https://api-private.dev.atlassian.com';
const stgBaseUrl = 'https://pug.jira-dev.com/gateway/api';
const prodBaseUrl = 'https://api-private.atlassian.com';

export const BaseUrls = {
	dev: devBaseUrl,
	development: devBaseUrl,

	stg: stgBaseUrl,
	staging: stgBaseUrl,

	prd: prodBaseUrl,
	prod: prodBaseUrl,
	production: prodBaseUrl,
};

export const getBaseUrl = (envKey?: EnvironmentsKeys, baseUrlOverride?: string) => {
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

export const getResolverUrl = (envKey?: EnvironmentsKeys, baseUrlOverride?: string) => {
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

export default BaseUrls;
