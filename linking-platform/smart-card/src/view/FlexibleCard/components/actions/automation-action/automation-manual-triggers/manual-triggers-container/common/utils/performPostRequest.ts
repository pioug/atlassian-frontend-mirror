import { _performRequest } from './_performRequest';

export const performPostRequest = async (url: string, options?: RequestInit): Promise<any> => {
	return _performRequest(url, 'POST', options);
};
