import { type JsonLd } from 'json-ld-types';

import { CardClient } from '@atlaskit/link-provider';
import { Client } from '@atlaskit/smart-card';

import {
	AtlasProject,
	GoogleDoc,
	GoogleDocUrl,
	YouTubeVideo,
	YouTubeVideoUrl,
} from '../../examples-helpers/_jsonLDExamples';
import { iconGoogleDrive } from '../images';

import { mocks, overrideEmbedContent } from './common';

const resolve = (
	url: string,
	response: JsonLd.Response<JsonLd.Data.BaseData>,
	overrideData?: Partial<JsonLd.Data.BaseData>,
): Promise<JsonLd.Response<JsonLd.Data.BaseData>> =>
	Promise.resolve({
		...response,
		data: { ...response.data, ...overrideData, url },
	} as JsonLd.Response<JsonLd.Data.BaseData>);

export const ResolvedClientUrl = AtlasProject.data.url;
export const ResolvedClientEmbedUrl = YouTubeVideoUrl;
export const ResolvedClientEmbedInteractiveUrl = GoogleDocUrl;
export const ResolvedClientWithLongTitleUrl = `${AtlasProject.data.url}/long-title`;
export const ResolvedClientWithTextHighlightInTitleUrl = `${AtlasProject.data.url}/text-highlight-title`;
export class ResolvedClient extends Client {
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
		}

		const response = { ...AtlasProject };
		response.data.preview.href = overrideEmbedContent;
		return Promise.resolve(response as JsonLd.Response);
	}
}

export const ResolvingClientUrl = 'https://resolving-link';
export class ResolvingClient extends CardClient {
	fetchData(url: string): Promise<JsonLd.Response> {
		return new Promise(() => {
			// resolve() never get called to keep status as resolving forever
		});
	}
}

export class ErroredClient extends CardClient {
	fetchData(url: string): Promise<JsonLd.Response> {
		return Promise.reject(`Can't resolve from ${url}`);
	}
}

// "visibility": "restricted",
// "access": "forbidden",
export class ForbiddenClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.forbidden);
	}
}

// "visibility": "restricted",
// "access": "forbidden",
// "accessType": "ACCESS_EXISTS",
export class ForbiddenWithObjectRequestAccessClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.unresolved('ACCESS_EXISTS', 'restricted'));
	}
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "DENIED_REQUEST_EXISTS",
export class ForbiddenWithSiteDeniedRequestClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.unresolved('DENIED_REQUEST_EXISTS', 'not_found'));
	}
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "DIRECT_ACCESS",
export class ForbiddenWithSiteDirectAccessClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.unresolved('DIRECT_ACCESS', 'not_found'));
	}
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "FORBIDDEN",
export class ForbiddenWithSiteForbiddenClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.unresolved('FORBIDDEN', 'not_found'));
	}
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "PENDING_REQUEST_EXISTS",
export class ForbiddenWithSitePendingRequestClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.unresolved('PENDING_REQUEST_EXISTS', 'not_found'));
	}
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "REQUEST_ACCESS",
export class ForbiddenWithSiteRequestAccessClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.unresolved('REQUEST_ACCESS', 'not_found'));
	}
}

// visibility: 'not_found',
// access: 'forbidden',
export class NotFoundClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.notFound);
	}
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "ACCESS_EXISTS",
export class NotFoundWithSiteAccessExistsClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.unresolved('ACCESS_EXISTS', 'not_found'));
	}
}

export class UnAuthClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.unauthorized);
	}
}

export class UnAuthClientWithProviderImage extends CardClient {
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

export class UnAuthClientWithNoAuthFlow extends CardClient {
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
