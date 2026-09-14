import { DEFAULT_HEADER } from './default-header';

export const _performRequest = async (
	url: string,
	method: string,
	options?: RequestInit,
): Promise<any> => {
	const response = await fetch(url, { headers: DEFAULT_HEADER, ...options, method });
	return response.json();
};
