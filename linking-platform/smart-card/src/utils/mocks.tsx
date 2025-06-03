import { type JsonLd } from '@atlaskit/json-ld-types';
import { type BatchResponse, CardClient } from '@atlaskit/link-provider';
import { type SmartLinkResponse } from '@atlaskit/linking-types';

export const mockContext = {
	'@vocab': 'https://www.w3.org/ns/activitystreams#',
	atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
	schema: 'http://schema.org/',
} as const;

export const mockGenerator = {
	'@type': 'Application',
	'@id': 'https://www.atlassian.com/#Jira',
	name: 'Jira',
};

export const mockByUrl = (url: string) => {
	return {
		meta: {
			visibility: 'public',
			access: 'granted',
			auth: [],
			definitionId: 'd1',
			key: 'object-provider',
			resourceType: 'object-resource',
			subproduct: 'object-subproduct',
			product: 'object-product',
		},
		data: {
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			'@type': 'Object',
			name: url,
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
			url: url,
		},
	} as JsonLd.Response;
};

const errorResponseData = {
	'@context': {
		'@vocab': 'https://www.w3.org/ns/activitystreams#',
		atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
		schema: 'http://schema.org/',
	},
	'@type': 'Object',
	name: 'I love cheese',
	url: 'https://some.url',
};

const successfulResponseData = {
	...errorResponseData,
	summary: 'Here is your serving of cheese: 🧀',
	'schema:potentialAction': {
		'@id': 'download',
		'@type': 'DownloadAction',
		identifier: 'object-provider',
		name: 'Download',
	},
	'atlassian:downloadUrl': 'https://some-download.url',
	'atlassian:ari': 'ari:cloud:example:1234',
	preview: {
		href: 'https://www.ilovecheese.com',
	},
	icon: {
		'@type': 'Image',
		url: 'https://www.ilovecheese.com/icon.png',
	},
};

const jsonLdResponse = {
	meta: {
		visibility: 'public',
		access: 'granted',
		auth: [],
		definitionId: 'd1',
		key: 'object-provider',
	},
	data: successfulResponseData,
};

const entityDataResponse = {
	entityData: {
		id: 'I love cheese',
		displayName: 'I love cheese',
		url: 'https://some.url',
		lastUpdatedAt: '2025-01-08T22:26:52.501Z',
		thumbnail: {
			externalUrl: 'https://www.ilovecheese.com',
		},
		'atlassian:design': {
			liveEmbedUrl: 'https://www.ilovecheese.com',
			type: 'FILE',
			inspectUrl: 'https://www.ilovecheese.com',
			iconUrl: 'https://www.ilovecheese.com',
		},
	},
};

export const mocks = {
	success: {
		...jsonLdResponse,
	} as JsonLd.Response,
	entityDataSuccess: {
		...jsonLdResponse,
		data: {
			...jsonLdResponse.data,
			generator: {
				'@type': 'Application',
				icon: {
					'@type': 'Image',
					url: 'https://www.ilovecheese.com',
				},
				name: 'I love cheese',
			},
		},
		meta: {
			...jsonLdResponse.meta,
			generator: {
				name: 'I love cheese',
				icon: {
					url: 'https://www.ilovecheese.com',
				},
			},
		},
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
		data: errorResponseData,
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
		data: errorResponseData,
	} as JsonLd.Response,
	forbiddenWithNoAuth: {
		meta: {
			visibility: 'restricted',
			access: 'forbidden',
			auth: [],
			definitionId: 'd1',
			key: 'object-provider',
		},
		data: errorResponseData,
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
		data: errorResponseData,
	} as JsonLd.Response,
	unauthorizedWithNoAuth: {
		meta: {
			visibility: 'restricted',
			access: 'unauthorized',
			auth: [],
			definitionId: 'd1',
			key: 'object-provider',
		},
		data: errorResponseData,
	} as JsonLd.Response,
	actionSuccess: {
		meta: {
			visibility: 'public',
			access: 'granted',
			auth: [],
			definitionId: 'd1',
		},
		data: {
			status: 'CompletedStatus',
		},
	},
	analytics: {
		status: 'resolved' as const,
		details: {
			meta: {
				visibility: 'public' as const,
				access: 'granted' as const,
				auth: [],
				definitionId: 'spaghetti-id',
				key: 'spaghetti-key',
				resourceType: 'spaghetti-resource',
				subproduct: 'spaghetti-subproduct',
				product: 'spaghetti-product',
			},
		},
	},
	withDatasource: {
		meta: {
			visibility: 'public',
			access: 'granted',
			auth: [],
			definitionId: 'd1',
			key: 'object-provider',
		},
		data: successfulResponseData,
		datasources: [
			{
				key: 'datasource-jira-issues',
				parameters: {
					jql: '(text ~ "test*" OR summary ~ "test*") order by created DESC',
					cloudId: '16f8b71e',
				},
				id: '1234-test-id-321',
				ari: 'ari:cloud:linking-platform::datasource/1234-test-id-321',
				description: 'For extracting a list of Jira issues using JQL',
				name: 'Jira issues',
			},
		],
	},
};
export const fakeResponse = () => Promise.resolve(mocks.success);

export const fakeFactory: any = (
	implementation: (url: string) => Promise<JsonLd.Response>,
	implementationPost: () => Promise<JsonLd.Response>,
	implementationPrefetch: () => Promise<JsonLd.Response | undefined>,
	implementationAri: (aris: string[]) => Promise<BatchResponse>,
) =>
	class CustomClient extends CardClient {
		// @ts-ignore
		async fetchData(url: string) {
			return await implementation(url);
		}
		// @ts-ignore
		async postData() {
			return await implementationPost();
		}
		// @ts-ignore
		async prefetchData() {
			return await implementationPrefetch();
		}
		// @ts-ignore
		async fetchDataAris(aris: string[]) {
			return await implementationAri(aris);
		}
	};

export const waitFor = (time = 1) => new Promise((res) => setTimeout(res, time));
