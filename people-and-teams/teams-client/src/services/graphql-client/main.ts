import { fg } from '@atlaskit/platform-feature-flags';

import { DefaultError, GraphQLError } from '../../common/utils/error';
import { BaseClient, type ClientConfig } from '../base-client';

import { type Body, type Options, type ResultResponse } from './types';
import { handleGraphQLRequest } from './utils';

/**
 * Validates that a siteId (cloudId) conforms to the format expected by
 * PlatformSiteAri from `@atlassian/ari/platform`.
 *
 * We inline this instead of importing `@atlassian/ari` because that package
 * is private and `teams-client` is a public package - public packages cannot
 * depend on private packages.
 *
 * The regex matches the `resourceIdSegmentFormats.siteId` rule from the
 * PlatformSiteAri manifest: `/[a-zA-Z0-9_\-.]{1,255}/`
 */
const SITE_ID_PATTERN = /^[a-zA-Z0-9_\-.]{1,255}$/;

function createPlatformSiteAri(siteId: string) {
	if (!SITE_ID_PATTERN.test(siteId)) {
		throw new Error(`Invalid siteId: ${siteId}`);
	}
	return `ari:cloud:platform::site/${siteId}`;
}

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
	 * Creates query context headers if cloudId is available and valid.
	 * When the fix-invalid-ari flag is enabled, validates the cloudId before
	 * constructing the ARI, preventing invalid ARIs like
	 * `ari:cloud:platform::site/None` from being sent.
	 */
	private createQueryContextHeaders(cloudId?: string | null): Record<string, string> | undefined {
		if (!cloudId) {
			return undefined;
		}

		if (fg('teams-app_client_fix-invalid-ari')) {
			try {
				const ari = createPlatformSiteAri(cloudId);
				return { 'X-Query-Context': ari };
			} catch {
				return undefined;
			}
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
