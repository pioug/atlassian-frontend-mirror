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

	setServiceUrl(serviceUrl: string): void {
		this.serviceUrl = serviceUrl;
	}

	/**
	 * Creates query context headers if cloudId is available.
	 */
	private createQueryContextHeaders(cloudId?: string | null): Record<string, string> | undefined {
		if (!cloudId) {
			return undefined;
		}

		return {
			'X-Query-Context': `ari:cloud:platform::site/${cloudId}`,
		};
	}

	async makeGraphQLRequest<Key extends string, Data = unknown, Variables = unknown>(
		body: Body<Variables>,
		options: Options = {},
	): Promise<ResultResponse<Key, Data>> {
		try {
			// Automatically add X-Query-Context header if cloudId is available in context
			const cloudId = this.getCloudId();
			const queryContextHeaders = this.createQueryContextHeaders(cloudId);

			// Merge headers: query context headers first, then provided headers (provided headers take precedence)
			const mergedOptions: Options = {
				...options,
				headers: {
					...queryContextHeaders,
					...options.headers,
				},
			};

			return handleGraphQLRequest<Key, Data, Variables>(this.serviceUrl, body, mergedOptions);
		} catch (error) {
			if (error instanceof GraphQLError) {
				throw error;
			}

			this.logException(error, 'UnknownError in GraphQLClient.makeGraphQLRequestWithoutRetries');

			throw new DefaultError({});
		}
	}
}
