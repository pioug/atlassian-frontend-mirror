import { fg } from '@atlaskit/platform-feature-flags';
import { createAtlAttributionHeader, type AtlAttributionHeaderData } from './atl-attribution';
export type { AtlAttributionHeaderData } from './atl-attribution';

const buildHeaders = (attributionData?: Partial<AtlAttributionHeaderData>) => {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');

	if (fg('smart-user-picker-attribution-header')) {
		const atlAttributionHeader = createAtlAttributionHeader(attributionData);
		headers.append('atl-attribution', atlAttributionHeader['atl-attribution']);
	}

	return headers;
};

interface Query {
	query: string;
	variables: Record<string, string> | Record<string, string[]>;
}

export interface GraphQLError {
	code?: number;
	reason: string;
}

/**
 * @param {string} serviceUrl - GraphQL service endpoint
 * @param {Query} query - GraphQL query
 * @param {Partial<AtlAttributionHeaderData>} attributionData - Optional attribution data for the atl-attribution header
 */
export function graphqlQuery<D>(
	serviceUrl: string,
	query: Query,
	attributionData?: Partial<AtlAttributionHeaderData>,
): Promise<D> {
	const headers = buildHeaders(attributionData);

	return fetch(
		new Request(`${serviceUrl}`, {
			method: 'POST',
			credentials: 'include',
			mode: 'cors',
			headers,
			body: JSON.stringify(query),
		}),
	)
		.then((response) => {
			if (!response.ok) {
				return Promise.reject({
					code: response.status,
					reason: response.statusText,
				});
			}

			return response;
		})
		.then((response) => response.json())
		.then((json) => {
			if (json.errors) {
				return Promise.reject({
					reason: json.errors[0]?.category || 'default',
				});
			}

			return json.data;
		});
}
