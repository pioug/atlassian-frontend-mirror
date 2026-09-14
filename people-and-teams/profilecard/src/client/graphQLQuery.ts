import { HttpError } from '../util/HttpError';

import type { HeaderProcessor } from './HeaderProcessor';
import type { Query } from './Query';
import { buildHeaders } from './buildHeaders';
import { id } from './id';

export async function graphQLQuery(
	serviceUrl: string,
	query: Query,
	processHeaders: HeaderProcessor | undefined = id,
	handleErrors: (errors: any, traceId: string | null) => void,
): Promise<any> {
	const headers = processHeaders(buildHeaders());

	const response = await fetch(
		new Request(serviceUrl, {
			method: 'POST',
			credentials: 'include',
			mode: 'cors',
			headers,
			body: JSON.stringify(query),
		}),
	);

	const traceIdFromHeaders = response?.headers?.get('atl-traceid');

	if (!response.ok) {
		throw new HttpError(response.status, response.statusText, traceIdFromHeaders);
	}

	const json = await response.json();

	if (json.errors) {
		handleErrors(json.errors, json.extensions?.gateway?.request_id ?? traceIdFromHeaders);
	}

	return json.data;
}
