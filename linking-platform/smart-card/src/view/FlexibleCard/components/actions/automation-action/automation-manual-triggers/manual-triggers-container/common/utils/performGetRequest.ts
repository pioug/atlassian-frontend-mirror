import { _performRequest } from './_performRequest';

export const performGetRequest = async (url: string, options?: RequestInit): Promise<any> => {
	return _performRequest(url, 'GET', options);
};
