import { type JsonLd } from 'json-ld-types';

export interface ErrorResponseBody {
	type: ServerErrorType;
	message: string;
	status: number;
}
export type ServerErrorType =
	| 'ResolveBadRequestError'
	| 'ResolveAuthError'
	| 'ResolveUnsupportedError'
	| 'ResolveFailedError'
	| 'ResolveRateLimitError'
	| 'ResolveTimeoutError'
	| 'SearchBadRequestError'
	| 'SearchAuthError'
	| 'SearchUnsupportedError'
	| 'SearchFailedError'
	| 'SearchTimeoutError'
	| 'SearchRateLimitError'
	| 'InternalServerError';

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

export const mocks = {
	success: jsonLdResponse as JsonLd.Response,
	datasourceSuccess: {
		...jsonLdResponse,
		datasources: [
			{
				key: 'datasource-jira-issues',
				parameters: {
					jql: 'ORDER BY assignee DESC',
					cloudId: 'a957adff-45b0-4f4f-8669-b640ed9973b6',
				},
				id: 'd8b75300-dfda-4519-b6cd-e49abbd50401',
				ari: 'ari:cloud:linking-platform::datasource/d8b75300-dfda-4519-b6cd-e49abbd50401',
				description: 'For extracting a list of Jira issues using JQL',
				name: 'Jira issues',
			},
		],
	},
	searchSuccess: {
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
			'@type': 'Collection',
			items: [
				{
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
			],
		},
	} as JsonLd.Response,
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
};
