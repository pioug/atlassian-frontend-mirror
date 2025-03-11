import type { RequestServiceOptions, KeyValues, SecurityOptions } from './types';

export const defaultRequestServiceOptions: RequestServiceOptions = {};

export const buildUrl = (
	baseUrl: string,
	path: string = '',
	queryParams?: KeyValues,
	secOptions?: SecurityOptions,
): string => {
	const searchParam = new URLSearchParams(
		// For relative urls, the URL class requires base to be set. It's ignored if a url is not relative.
		// Since we only care about search params it is fine to have any base url here.
		new URL(baseUrl, 'https://BASE_FALLBACK').search || undefined,
	);
	baseUrl = baseUrl.split('?')[0];
	if (queryParams) {
		for (const key in queryParams) {
			if ({}.hasOwnProperty.call(queryParams, key)) {
				searchParam.append(key, queryParams[key]);
			}
		}
	}
	if (secOptions && secOptions.params) {
		for (const key in secOptions.params) {
			if ({}.hasOwnProperty.call(secOptions.params, key)) {
				const values = secOptions.params[key];
				if (Array.isArray(values)) {
					for (let i = 0; i < values.length; i++) {
						searchParam.append(key, values[i]);
					}
				} else {
					searchParam.append(key, values);
				}
			}
		}
	}
	let separator = '';
	if (path && baseUrl.substr(-1) !== '/' && !path.startsWith('/')) {
		separator = '/';
	}
	let params = searchParam.toString();
	if (params) {
		params = '?' + params;
	}

	return `${baseUrl}${separator}${path}${params}`;
};

const addToHeaders = (headers: KeyValues, keyValues?: KeyValues) => {
	if (keyValues) {
		for (const key in keyValues) {
			if ({}.hasOwnProperty.call(keyValues, key)) {
				const values = keyValues[key];
				if (Array.isArray(values)) {
					for (let i = 0; i < values.length; i++) {
						headers[key] = values[i];
					}
				} else {
					headers[key] = values;
				}
			}
		}
	}
};

export const buildHeaders = (secOptions?: SecurityOptions, extraHeaders?: KeyValues): KeyValues => {
	const headers = {};
	addToHeaders(headers, extraHeaders);
	if (secOptions) {
		addToHeaders(headers, secOptions.headers);
	}
	return headers;
};
