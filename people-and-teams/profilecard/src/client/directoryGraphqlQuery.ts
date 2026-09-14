import type { HeaderProcessor } from './HeaderProcessor';
import type { Query } from './Query';
import { graphQLQuery } from './graphQLQuery';
import { handleDirectoryGraphQLErrors } from './handleDirectoryGraphQLErrors';
import { id } from './id';

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
