import { HttpError } from '../util/errors';

import { handleAGGErrors, handleDirectoryGraphQLErrors } from './errorUtils';

const buildHeaders = () => {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');

	return headers;
};

interface Query {
	query: string;
	variables: Record<string, any>;
}

export interface GraphQLError {
	code?: number;
	reason?: string;
	source?: string;
	message?: string;
	traceId?: string;
	category: string;
	type: string;
	path: string[];
	extensions: {
		errorNumber: number;
	} & Record<string, any>;
}

type HeaderProcessor = (headers: Headers) => Headers;
const id: HeaderProcessor = (headers) => headers;

/**
 * @param {string} serviceUrl - GraphQL service endpoint
 * @param {Query} query - GraphQL query
 * @param {HeaderProcessor} processHeaders - a function to add extra headers to the request
 */
export async function directoryGraphqlQuery<D>(
	serviceUrl: string,
	query: Query,
	processHeaders: HeaderProcessor = id,
): Promise<D> {
	return graphQLQuery(serviceUrl, query, processHeaders, handleDirectoryGraphQLErrors);
}

/**
 * @param {string} serviceUrl - GraphQL service endpoint
 * @param {Query} query - GraphQL query
 * @param {HeaderProcessor} processHeaders - a function to add extra headers to the request
 */
export async function AGGQuery<D>(
	serviceUrl: string,
	query: Query,
	processHeaders: HeaderProcessor = id,
): Promise<D> {
	return graphQLQuery(serviceUrl, query, processHeaders, handleAGGErrors);
}

async function graphQLQuery(
	serviceUrl: string,
	query: Query,
	processHeaders: HeaderProcessor = id,
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
