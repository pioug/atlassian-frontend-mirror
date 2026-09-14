import { FetchError } from './FetchError';

export const mapFetchErrors = (error: any): Error => {
	if (error instanceof Response && !error.ok) {
		return new FetchError(error.status, `Error server response: ${error.status}`);
	}
	return error;
};
