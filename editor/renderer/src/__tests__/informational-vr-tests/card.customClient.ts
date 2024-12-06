// eslint-disable-next-line
import { JsonLd } from 'json-ld-types';
import { CardClient } from '@atlaskit/link-provider';

import { dropboxImage } from './images/dropbox';
import { forbidden } from './images/forbidden';
import { notFound } from './images/notFound';
import { unauthorized } from './images/unauthorized';

import { avatarImage } from './images/avatar';
import { iconAtlas } from './images/atlas';

import forbiddenJira from './images/forbidden-jira.svg';
import imageForbiddenJiraEmbed from './images/forbidden-jira-embed.svg';

export const embedContent = `
<html>
  <body style="font-family:sans-serif;text-align:center;background-color:#091E4208">
    VR TEST: EMBED CONTENT
  </body>
</html>
`;

const mockData = {
	resolved: {
		meta: {
			auth: [],
			definitionId: 'watermelon-object-provider',
			visibility: 'restricted',
			access: 'granted',
			key: 'watermelon-object-provider',
		},
		data: {
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			generator: {
				'@type': 'Application',
				name: 'Atlas',
				icon: { '@type': 'Image', url: iconAtlas },
			},
			'@type': ['Object', 'atlassian:Project'],
			url: 'https://some.url',
			icon: {
				'@type': 'Image',
				url: iconAtlas,
			},
			name: 'Lorem ipsum dolor sit amet',
			summary:
				'Cras ut nisi vitae lectus sagittis mattis. Curabitur a urna feugiat, laoreet enim ac, lobortis diam.',
			'atlassian:state': {
				'@type': 'Object',
				name: 'On track',
				appearance: 'success',
			},
			preview: {
				'@type': 'Link',
				href: 'https://some.url',
			},
			attributedTo: [{ '@type': 'Person', icon: avatarImage, name: 'Aliza' }],
			updated: '2022-06-05T16:44:00.000+1000',
			endTime: '2022-07-31T00:00:00.000Z',
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
			generator: {
				'@type': 'Application',
				name: 'Dropbox',
				icon: {
					'@type': 'Image',
					url: dropboxImage,
				},
				image: notFound,
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
				name: 'Dropbox',
				icon: {
					'@type': 'Image',
					url: dropboxImage,
				},
				image: forbidden,
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
				name: 'Dropbox',
				icon: {
					'@type': 'Image',
					url: dropboxImage,
				},
				image: unauthorized,
			},
			url: 'https://some.url',
		},
	} as JsonLd.Response,
};

export class NotFoundClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mockData.notFound);
	}
}

export class ResolvedClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mockData.resolved);
	}
}

export class ResolvingClient extends CardClient {
	private timeout;
	constructor(timeout: number) {
		super();
		this.timeout = timeout;
	}
	fetchData(): Promise<JsonLd.Response> {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({} as JsonLd.Response);
			}, this.timeout);
		});
	}
}

export class ForbiddenClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mockData.forbidden);
	}
}

export class UnauthorizedClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mockData.unauthorized);
	}
}

export class ErroredClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		// @ts-expect-error negative test case
		return Promise.resolve({ data: null });
	}
}

// "visibility": "restricted",
// "access": "forbidden",
// "accessType": "ACCESS_EXISTS",
export class ForbiddenWithObjectRequestAccessClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mockData.unresolved('ACCESS_EXISTS', 'restricted'));
	}
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "DENIED_REQUEST_EXISTS",
export class ForbiddenWithSiteDeniedRequestClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mockData.unresolved('DENIED_REQUEST_EXISTS', 'not_found'));
	}
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "APPROVED_REQUEST_EXISTS",
export class ForbiddenWithSiteApprovedRequestClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mockData.unresolved('APPROVED_REQUEST_EXISTS', 'not_found'));
	}
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "DIRECT_ACCESS",
export class ForbiddenWithSiteDirectAccessClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mockData.unresolved('DIRECT_ACCESS', 'not_found'));
	}
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "FORBIDDEN",
export class ForbiddenWithSiteForbiddenClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mockData.unresolved('FORBIDDEN', 'not_found'));
	}
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "PENDING_REQUEST_EXISTS",
export class ForbiddenWithSitePendingRequestClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mockData.unresolved('PENDING_REQUEST_EXISTS', 'not_found'));
	}
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "REQUEST_ACCESS",
export class ForbiddenWithSiteRequestAccessClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(mockData.unresolved('REQUEST_ACCESS', 'not_found'));
	}
}
