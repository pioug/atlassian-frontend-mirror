import { DefaultError, GraphQLError } from '../../common/utils/error';
import { BaseClient, type ClientConfig } from '../base-client';

import { type Body, type Options, type ResultResponse } from './types';
import { handleGraphQLRequest } from './utils';

export class BaseGraphQlClient extends BaseClient {
	private serviceUrl: string;

	constructor(serviceUrl: string, config: ClientConfig) {
		super(config);
		this.serviceUrl = serviceUrl;
	}

	setServiceUrl(serviceUrl: string) {
		this.serviceUrl = serviceUrl;
	}

	async makeGraphQLRequest<Key extends string, Data = unknown, Variables = unknown>(
		body: Body<Variables>,
		options: Options = {},
	): Promise<ResultResponse<Key, Data>> {
		try {
			return handleGraphQLRequest<Key, Data, Variables>(this.serviceUrl, body, options);
		} catch (error) {
			if (error instanceof GraphQLError) {
				throw error;
			}

			this.logException(error, 'UnknownError in GraphQLClient.makeGraphQLRequestWithoutRetries');

			throw new DefaultError({});
		}
	}
}
