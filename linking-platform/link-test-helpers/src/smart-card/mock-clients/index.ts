import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient } from '@atlaskit/link-provider';
import type { SmartLinkResponse } from '@atlaskit/linking-types';

import {
	AtlasProject,
	AtlasProjectNoPreview,
	GoogleDoc,
	GoogleDocUrl,
	ProfileObject,
	unicornResponse,
	YouTubeVideo,
	YouTubeVideoUrl,
} from '../example-helpers';
import { atlasProjectUrl } from '../example-helpers/_jsonLDExamples/provider.atlas';
import { overrideEmbedContent } from '../example-helpers/_jsonLDExamples/utils';
import { forbiddenJira, iconGoogleDrive, image1, image2, imageForbiddenJiraEmbed } from '../images';

import { MockCardClient } from './mock-card-client';

export const mocks = {
	entityDataSuccess: {
		meta: {
			visibility: 'public',
			access: 'granted',
			auth: [],
			definitionId: 'd1',
			key: 'object-provider',
			resourceType: 'object-resource',
			subproduct: 'object-subproduct',
			product: 'object-product',
			generator: {
				name: 'I love cheese',
				icon: {
					url: image2,
				},
			},
		},
		data: {
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			'@type': 'Object',
			name: 'https://some.url',
			summary: 'Here is your serving of cheese: 🧀',
			preview: {
				href: 'https://www.ilovecheese.com',
			},
			generator: {
				'@type': 'Application',
				icon: {
					'@type': 'Image',
					url: image2,
				},
				name: 'I love cheese',
			},
			url: 'https://some.url',
		},
		entityData: {
			id: 'I love cheese',
			displayName: 'I love cheese',
			description: 'Here is your serving of cheese: 🧀',
			url: 'https://some.url',
			lastUpdatedAt: '2025-01-08T22:26:52.501Z',
			thumbnail: {
				externalUrl: image1,
			},
			liveEmbedUrl: 'https://www.ilovecheese.com',
			type: 'FILE',
			inspectUrl: 'https://www.ilovecheese.com',
			iconUrl: image2,
		},
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
			generator: {
				'@type': 'Application',
				name: 'Google',
				icon: {
					'@type': 'Image',
					url: iconGoogleDrive,
				},
			},
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
			generator: {
				'@type': 'Application',
				name: 'Google',
				icon: {
					'@type': 'Image',
					url: iconGoogleDrive,
				},
			},
			url: 'https://some.url',
		},
	} as JsonLd.Response,
	unresolved: (accessType = 'FORBIDDEN', visibility = 'not_found') =>
		({
			meta: {
				auth: [],
				definitionId: 'jira-object-provider',
				product: 'jira',
				visibility,
				access: 'forbidden',
				resourceType: 'issue',
				category: 'object',
				tenantId: 'tenant-id',
				key: 'jira-object-provider',
				requestAccess: {
					accessType,
					cloudId: 'cloud-id',
				},
			},

			data: {
				'@context': {
					'@vocab': 'https://www.w3.org/ns/activitystreams#',
					atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
					schema: 'http://schema.org/',
				},
				generator: {
					'@type': 'Application',
					'@id': 'https://www.atlassian.com/#Jira',
					name: 'Jira',
					icon: {
						'@type': 'Image',
						url: 'https://icon-url',
					},
					image: {
						'@type': 'Image',
						url: imageForbiddenJiraEmbed,
					},
				},
				image: {
					'@type': 'Image',
					url: forbiddenJira,
				},
				url: 'https://site.atlassian.net/browse/key-1',
				'@type': ['atlassian:Task', 'Object'],
			},
		}) as JsonLd.Response,
	unauthorized: {
		meta: {
			access: 'unauthorized',
			visibility: 'restricted',
			auth: [
				{
					key: 'some-flow',
					displayName: 'Flow',
					url: 'https://outbound-auth/flow',
				},
			],
			definitionId: 'd1',
			key: 'google-object-provider',
			resourceType: 'file',
		},
		data: {
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			'@type': 'Object',
			generator: {
				'@type': 'Application',
				name: 'Google',
				icon: {
					'@type': 'Image',
					url: iconGoogleDrive,
				},
			},
			url: 'https://some.url',
		},
	} as JsonLd.Response,
};

const resolve = (
	url: string,
	response: JsonLd.Response<JsonLd.Data.BaseData>,
	overrideData?: Partial<JsonLd.Data.BaseData>,
): Promise<JsonLd.Response<JsonLd.Data.BaseData>> =>
	Promise.resolve({
		...response,
		data: { ...response.data, ...overrideData, url },
	} as JsonLd.Response<JsonLd.Data.BaseData>);

export const ResolvedClientUrl = atlasProjectUrl;
export const ResolvedClientUrlNoPreview = `${atlasProjectUrl}/no-preview`;
export const ResolvedClientEmbedUrl = YouTubeVideoUrl;
export const ResolvedClientEmbedInteractiveUrl = GoogleDocUrl;
export const ResolvedClientWithLongTitleUrl = `${atlasProjectUrl}/long-title`;
export const ResolvedClientWithTextHighlightInTitleUrl = `${atlasProjectUrl}/text-highlight-title`;
export const ResolvedClientProfileUrl = `${atlasProjectUrl}/profile-url`;
export class ResolvedClient extends MockCardClient {
	fetchData(url: string) {
		switch (url) {
			case ResolvedClientEmbedUrl:
				return resolve(url, YouTubeVideo);
			case ResolvedClientEmbedInteractiveUrl:
				return resolve(url, GoogleDoc);
			case ResolvedClientWithLongTitleUrl:
				return resolve(url, AtlasProject as JsonLd.Response<JsonLd.Data.BaseData>, {
					name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id lectus lorem. Phasellus luctus vulputate diam vitae sagittis. Fusce laoreet pulvinar dapibus.',
				});
			case ResolvedClientWithTextHighlightInTitleUrl:
				return resolve(url, AtlasProject as JsonLd.Response<JsonLd.Data.BaseData>, {
					name: `${AtlasProject.data.name} | :~:text=highlight this`,
				});
			case ResolvedClientUrlNoPreview:
				return resolve(url, AtlasProjectNoPreview as JsonLd.Response<JsonLd.Data.BaseData>);
			case ResolvedClientProfileUrl:
				return resolve(url, ProfileObject as JsonLd.Response<JsonLd.Data.BaseData>);
		}

		const response = { ...AtlasProject };
		response.data.preview.href = overrideEmbedContent;
		return Promise.resolve(response as JsonLd.Response);
	}
}

export const ResolvingClientUrl = 'https://resolving-link';
export class ResolvingClient extends MockCardClient {
	fetchData(url: string): Promise<JsonLd.Response> {
		return new Promise(() => {
			// resolve() never get called to keep status as resolving forever
		});
	}
}

export class ErroredClient extends MockCardClient {
	fetchData(url: string): Promise<JsonLd.Response> {
		return Promise.reject(`Can't resolve from ${url}`);
	}
}

// "visibility": "restricted",
// "access": "forbidden",
export class ForbiddenClient extends MockCardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.forbidden);
	}
}

// "visibility": "restricted",
// "access": "forbidden",
// "accessType": "ACCESS_EXISTS",
export class ForbiddenWithObjectRequestAccessClient extends MockCardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.unresolved('ACCESS_EXISTS', 'restricted'));
	}
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "DENIED_REQUEST_EXISTS",
export class ForbiddenWithSiteDeniedRequestClient extends MockCardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.unresolved('DENIED_REQUEST_EXISTS', 'not_found'));
	}
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "DIRECT_ACCESS",
export class ForbiddenWithSiteDirectAccessClient extends MockCardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.unresolved('DIRECT_ACCESS', 'not_found'));
	}
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "FORBIDDEN",
export class ForbiddenWithSiteForbiddenClient extends MockCardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.unresolved('FORBIDDEN', 'not_found'));
	}
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "PENDING_REQUEST_EXISTS",
export class ForbiddenWithSitePendingRequestClient extends MockCardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.unresolved('PENDING_REQUEST_EXISTS', 'not_found'));
	}
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "REQUEST_ACCESS",
export class ForbiddenWithSiteRequestAccessClient extends MockCardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.unresolved('REQUEST_ACCESS', 'not_found'));
	}
}

// "visibility": "restricted",
// "access": "forbidden",
export class ForbiddenClientWithNoIcon extends MockCardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve({
			...mocks.forbidden,
			data: { ...mocks.forbidden.data, generator: { name: 'Provider' } },
		} as JsonLd.Response);
	}
}

// visibility: 'not_found',
// access: 'forbidden',
export class NotFoundClient extends MockCardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.notFound);
	}
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "ACCESS_EXISTS",
export class NotFoundWithSiteAccessExistsClient extends MockCardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.unresolved('ACCESS_EXISTS', 'not_found'));
	}
}

export class NotFoundWithNoIconClient extends MockCardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve({
			...mocks.notFound,
			data: { ...mocks.forbidden.data, generator: { name: 'Provider' } },
		} as JsonLd.Response);
	}
}

export class UnAuthClient extends MockCardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.unauthorized);
	}
}

export class UnAuthClientWithProviderImage extends MockCardClient {
	fetchData(): Promise<JsonLd.Response> {
		const response = {
			...mocks.unauthorized,
			data: {
				...mocks.unauthorized.data,
				generator: {
					...((mocks.unauthorized.data as JsonLd.Data.BaseData)
						.generator as JsonLd.Primitives.Object),
					image: {
						'@type': 'Image',
						url: iconGoogleDrive,
					},
				},
			},
		};
		return Promise.resolve(response as JsonLd.Response);
	}
}

export class UnAuthClientWithNoAuthFlow extends MockCardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve({
			...mocks.unauthorized,
			meta: {
				...mocks.unauthorized.meta,
				auth: [],
			},
		} as JsonLd.Response);
	}
}

export class UnAuthClientWithNoIcon extends MockCardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve({
			meta: { ...mocks.unauthorized.meta },
			data: { ...mocks.unauthorized.data, generator: { name: 'Provider' } },
		} as JsonLd.Response);
	}
}

export class UnicornResolvedClient extends CardClient {
	fetchData(url: string): Promise<JsonLd.Response> {
		return Promise.resolve(unicornResponse as JsonLd.Response);
	}
}
