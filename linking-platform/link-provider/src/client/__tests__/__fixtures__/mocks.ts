import { type JsonLd } from '@atlaskit/json-ld-types';
import CardClient from '../..';
import { type ErrorResponseBody } from '../../types/responses';
import { SmartLinkResponse } from '@atlaskit/linking-types';

export const mockContext = {
	'@vocab': 'https://www.w3.org/ns/activitystreams#',
	atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
	schema: 'http://schema.org/',
} as const;

const jsonLdResponse = {
	meta: {
		visibility: 'public',
		access: 'granted',
		auth: [],
		definitionId: 'd1',
		key: 'object-provider',
	},
	data: {
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		'@type': 'Object',
		name: 'I love cheese',
		summary: 'Here is your serving of cheese: 🧀',
		'schema:potentialAction': {
			'@id': 'comment',
			'@type': 'CommentAction',
			identifier: 'object-provider',
			name: 'Comment',
		},
		preview: {
			href: 'https://www.ilovecheese.com',
		},
		url: 'https://some.url',
	},
};

const entityDataResponse = {
	entityData: {
		schemaVersion: '2.0',
		id: 'frl3oZ39Cd6jr7WvWZUQPw',
		updateSequenceNumber: 1736456473,
		displayName: 'Rovo admin – GA',
		url: 'https://www.figma.com/design/frl3oZ39Cd6jr7WvWZUQPw/Rovo-GA-in-Admin-Hub',
		lastUpdatedAt: '2025-01-08T22:26:52.501Z',
		thumbnail: {
			externalUrl:
				'https://s3-alpha.figma.com/thumbnails/67c42edb-8cf1-49b7-8866-452b8dc2bc19?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQ4GOSFWCXHUIFXET%2F20250109%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250109T000000Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=7e0174016982e5a3fa9c74725f28ca4ab19b7f39ae700553a0aaf0386c07494c',
		},
		liveEmbedUrl:
			'https://www.figma.com/embed?embed_host=astra&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2Ffrl3oZ39Cd6jr7WvWZUQPw%2FRovo-GA-in-Admin-Hub',
		status: 'UNKNOWN',
		type: 'FILE',
		inspectUrl: 'https://www.figma.com/design/frl3oZ39Cd6jr7WvWZUQPw/Rovo-GA-in-Admin-Hub?m=dev',
		iconUrl: 'https://static.figma.com/app/icon/1/favicon.ico',
	},
};

export const mocks = {
	success: {
		meta: {
			...jsonLdResponse.meta,
		},
		data: {
			...jsonLdResponse.data,
			'atlassian:ari': 'ari:cloud:confluence:test:page:1234',
		},
	} as JsonLd.Response,
	searchSuccess: {
		meta: {
			...jsonLdResponse.meta,
		},
		data: {
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			'@type': 'Collection',
			items: [{ ...jsonLdResponse.data }],
		},
	} as JsonLd.Response,
	entityDataSuccess: {
		...jsonLdResponse,
		...entityDataResponse,
	} as SmartLinkResponse,
	notFound: {
		meta: {
			visibility: 'not_found',
			access: 'forbidden',
			auth: [],
			definitionId: 'd1',
			key: 'object-provider',
		},
		data: {
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			'@type': 'Object',
			name: 'I love cheese',
			url: 'https://some.url',
			'atlassian:ari': 'ari:cloud:confluence:test:page:1234',
		},
	} as JsonLd.Response,
	forbidden: {
		meta: {
			visibility: 'restricted',
			access: 'forbidden',
			auth: [
				{
					key: 'some-flow',
					displayName: 'Flow',
					url: 'https://outbound-auth/flow',
				},
			],
			definitionId: 'd1',
			key: 'object-provider',
		},
		data: {
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			'@type': 'Object',
			name: 'I love cheese',
			url: 'https://some.url',
		},
	} as JsonLd.Response,
	unauthorized: {
		meta: {
			visibility: 'restricted',
			access: 'unauthorized',
			auth: [
				{
					key: 'some-flow',
					displayName: 'Flow',
					url: 'https://outbound-auth/flow',
				},
			],
			definitionId: 'd1',
			key: 'object-provider',
		},
		data: {
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			'@type': 'Object',
			name: 'I love cheese',
			url: 'https://some.url',
			'atlassian:ari': 'ari:cloud:confluence:test:page:1234',
		},
	} as JsonLd.Response,
	notSupported: {
		message: 'URL not supported',
		status: 404,
		type: 'ResolveUnsupportedError',
	} as ErrorResponseBody,
	invokeSearchUnsupportedError: {
		error: {
			type: 'SearchUnsupportedError',
			message: 'Search not supported',
			status: 404,
		},
		status: 404,
	},
	invokeSearchTimeoutError: {
		error: {
			type: 'SearchTimeoutError',
			message: 'Server took too long to respond',
			status: 504,
		},
		status: 200,
	},
	invokeSearchFailedError: {
		error: {
			type: 'SearchFailedError',
			message: 'Search failed',
			status: 404,
		},
		status: 200,
	},
	invokeSearchAuthError: {
		error: {
			type: 'SearchAuthError',
			message: 'Authorization failed',
			status: 403,
		},
		status: 403,
	},
	invokeSearchRateLimitError: {
		error: {
			type: 'SearchRateLimitError',
			message: 'Too many requests',
			status: 429,
		},
		status: 200,
	},
	invokeInternalServerError: {
		error: {
			type: 'InternalServerError',
			message: 'Something went wrong',
			status: 504,
		},
		status: 500,
	},
	invokeBadRequestError: {
		error: {
			type: 'BadRequestError',
			message: 'Bad request',
			status: 400,
		},
		status: 200,
	},
	invokeAuthError: {
		error: {
			type: 'AuthError',
			message: 'Authorization failed',
			status: 403,
		},
		status: 403,
	},
	invokeUnsupportedError: {
		error: {
			type: 'UnsupportedError',
			message: 'Search not supported',
			status: 404,
		},
		status: 404,
	},
	invokeTimeoutError: {
		error: {
			type: 'TimeoutError',
			message: 'Server took too long to respond',
			status: 504,
		},
		status: 200,
	},
	invokeRateLimitError: {
		error: {
			type: 'RateLimitError',
			message: 'Too many requests',
			status: 429,
		},
		status: 200,
	},
};
export const fakeResponse = () => Promise.resolve(mocks.success);

export const fakeFactory: any = (
	implementation: () => Promise<JsonLd.Response>,
	implementationPost: () => Promise<JsonLd.Response>,
	implementationPrefetch: () => Promise<JsonLd.Response | undefined>,
) =>
	class CustomClient extends CardClient {
		async fetchData() {
			return await implementation();
		}

		async postData() {
			return await implementationPost();
		}

		async prefetchData() {
			return await implementationPrefetch();
		}
	};

export const waitFor = (time = 1) => new Promise((res) => setTimeout(res, time));
