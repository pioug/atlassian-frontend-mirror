import type { KeyValues, SecurityOptions } from './types';

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
