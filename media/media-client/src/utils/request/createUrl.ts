import { mapAuthToQueryParameters } from '../../models/auth-query-parameters';
import { type CreateUrlOptions } from './types';

export function createUrl(url: string, { params, auth }: CreateUrlOptions): string {
	const parsedUrl = new URL(url, auth?.baseUrl);
	const authParams = (auth && mapAuthToQueryParameters(auth)) || {};
	const paramsToAppend: { [key: string]: any } = {
		...params,
		...authParams,
	};
	Object.entries(paramsToAppend)
		.filter(([_, value]) => value != null)
		.forEach((pair) => {
			parsedUrl.searchParams.set(...pair);
		});
	parsedUrl.searchParams.sort();
	return parsedUrl.toString();
}
