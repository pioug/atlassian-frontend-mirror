import { getConfig as getConfigUFO } from '../../../config';
import type { ResourceTimingsConfig } from '../types';

const defaultAllowedParams = ['operationName', 'operation', 'q'];

const getAllowedParams = () => {
	const config = getConfigUFO();
	return config?.allowedResourcesParams || defaultAllowedParams;
};

const handleQueryParams = (urlString: string): string => {
	try {
		if (typeof urlString !== 'string') {
			return urlString;
		}
		const url = new URL(urlString);
		const params = new URLSearchParams(url.search);
		const allowedParams = getAllowedParams();
		for (const [key] of params) {
			if (!allowedParams.includes(key)) {
				url.searchParams.delete(key);
			}
		}
		return url.toString();
	} catch (e) {
		return urlString;
	}
};

let config: ResourceTimingsConfig = {
	mapResources: (url: string) => url,
	sanitiseEndpoints: (url: string) => {
		return handleQueryParams(url);
	},
};

export function configure(resourceTimingConfig: ResourceTimingsConfig) {
	const newConfig = {
		mapResources: resourceTimingConfig.mapResources,
		sanitiseEndpoints: (url: string) => {
			const sanitised = resourceTimingConfig.sanitiseEndpoints(url);
			if (sanitised) {
				return handleQueryParams(sanitised);
			}
			return sanitised;
		},
	};
	config = newConfig;
}

export const getConfig = () => config;
