import { graphQLQuery } from './graphQLQuery';
import { handleAGGErrors } from './handleAGGErrors';
import type { HeaderProcessor } from './HeaderProcessor';
import { id } from './id';
import type { Query } from './Query';

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
