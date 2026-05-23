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
import {
	avatar3,
	figmaUnauthImage,
	forbiddenJira,
	gdriveUnauthImage,
	iconDropbox,
	iconFigma,
	iconGoogleDrive,
	iconOneDrive,
	iconSlack,
	image1,
	image2,
	imageForbiddenJiraEmbed,
	onedriveUnauthImage,
	slackUnauthImage,
} from '../images';

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
	simpleProjectPlaceholderData: {
		data: {
			'@context': AtlasProject.data['@context'],
			'@type': AtlasProject.data['@type'],
			url: AtlasProject.data.url,
			icon: AtlasProject.data.icon,
			name: 'Fancy project with placeholder data for SSR',
			'atlassian:state': AtlasProject.data['atlassian:state'],
		},
		meta: {
			auth: [],
			definitionId: 'watermelon-object-provider',
			visibility: 'restricted',
			access: 'granted',
			key: 'watermelon-object-provider',
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

	unauthorized: (
		url: string,
	): {
		data: {
			'@context': {
				'@vocab': string;
				atlassian: string;
				schema: string;
			};
			'@type': string;
			generator: {
				'@type': string;
				icon?:
					| {
							'@type': string;
							url: string;
					  }
					| undefined;
				name: string;
			};
			image: any;
			url: string;
		};
		meta: {
			access: string;
			auth: {
				displayName: string;
				key: string;
				url: string;
			}[];
			definitionId: string;
			key: string;
			resourceType: string;
			visibility: string;
		};
	} => {
		let key = 'google-object-provider';
		let name = 'Google';
		let icon = iconGoogleDrive;
		let image = gdriveUnauthImage;

		if (url.includes('figma.com')) {
			key = 'figma-object-provider';
			name = 'Figma';
			icon = iconFigma;
			image = figmaUnauthImage;
		} else if (url.includes('dropbox.com')) {
			key = 'dropbox-object-provider';
			name = 'Dropbox';
			icon = iconDropbox;
			image = undefined;
		} else if (url.includes('onedrive.live.com')) {
			key = 'onedrive-object-provider';
			name = 'OneDrive';
			icon = iconOneDrive;
			image = onedriveUnauthImage;
		} else if (url.includes('.slack.com')) {
			key = 'slack-object-provider';
			name = 'Slack';
			icon = iconSlack;
			image = slackUnauthImage;
		}
		return {
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
				key,
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
					name: name,
					...(icon ? { icon: { '@type': 'Image', url: icon } } : {}),
				},
				url,
				image,
			},
		};
	},
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

export const ResolvedClientUrl: 'https://project-url' = atlasProjectUrl;
export const ResolvedClientUrlNoPreview: 'https://project-url/no-preview' = `${atlasProjectUrl}/no-preview`;
export const ResolvedClientEmbedUrl: 'https://www.youtube.com/watch?v=9tpySewzRG0' =
	YouTubeVideoUrl;
export const ResolvedClientEmbedInteractiveUrl: 'https://docs.google.com/document/d/1MbN3KKm5Ih6QDeejgrduvrXeadEQGcINPK8Vz3vgGlc/edit?usp=sharing' =
	GoogleDocUrl;
export const ResolvedClientWithLongTitleUrl: 'https://project-url/long-title' = `${atlasProjectUrl}/long-title`;
export const ResolvedClientWithTextHighlightInTitleUrl: 'https://project-url/text-highlight-title' = `${atlasProjectUrl}/text-highlight-title`;
export const ResolvedClientProfileUrl: 'https://project-url/profile-url' = `${atlasProjectUrl}/profile-url`;

const ICON_TEST_BASE = 'https://icon-test';

const iconTestMeta = {
	auth: [] as never[],
	definitionId: 'icon-test-provider',
	visibility: 'public' as const,
	access: 'granted' as const,
	key: 'icon-test-provider',
};

const iconTestContext = {
	'@vocab': 'https://www.w3.org/ns/activitystreams#',
	atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
	schema: 'http://schema.org/',
};

const iconTestDefaultGenerator: Record<string, unknown> = {
	'@type': 'Application',
	name: 'Acme Link Sandbox',
	icon: { '@type': 'Image', url: iconGoogleDrive },
};

const iconTestSharedFields = {
	preview: {
		'@type': 'Link',
		href: 'https://icon-test.example/assets/preview-placeholder',
	},
	updated: '2025-11-18T14:22:00.000Z',
	attributedTo: [
		{
			'@type': 'Person',
			icon: avatar3,
			name: 'Jordan Rivers',
		},
	],
};

const makeIconTestResponse = (
	url: string,
	type: string | string[],
	dataOverrides?: Record<string, unknown>,
	generator: Record<string, unknown> = iconTestDefaultGenerator,
): JsonLd.Response =>
	({
		meta: iconTestMeta,
		data: {
			'@context': iconTestContext,
			'@type': type,
			url,
			...iconTestSharedFields,
			generator,
			...dataOverrides,
		},
	}) as JsonLd.Response;

const confluenceGenerator = {
	'@type': 'Application',
	'@id': 'https://www.atlassian.com/#Confluence',
	name: 'Confluence',
	icon: { '@type': 'Image', url: image2 },
};

const jiraGenerator = {
	'@type': 'Application',
	'@id': 'https://www.atlassian.com/#Jira',
	name: 'Jira',
	icon: { '@type': 'Image', url: image2 },
};

const iconTestResponseMap: Record<string, JsonLd.Response> = {
	[`${ICON_TEST_BASE}/url-icon`]: makeIconTestResponse(`${ICON_TEST_BASE}/url-icon`, 'Document', {
		name: 'Quarterly roadmap — icon resolved from explicit document image URL',
		summary:
			'This mock prioritises the linked `icon` URL over file format and provider artwork, so you can verify URL-based icons without relying on generator metadata.',
		icon: { '@type': 'Image', url: iconGoogleDrive },
	}),
	[`${ICON_TEST_BASE}/file-format`]: makeIconTestResponse(
		`${ICON_TEST_BASE}/file-format`,
		'Document',
		{
			name: 'Field photos — JPEG archive (file-format icon path)',
			summary:
				'No dedicated thumbnail URL is supplied; the smart card should derive a file-type glyph from `schema:fileFormat` while still showing title and summary in the resolved layout.',
			'schema:fileFormat': 'image/jpeg',
		},
	),
	[`${ICON_TEST_BASE}/provider-only`]: makeIconTestResponse(
		`${ICON_TEST_BASE}/provider-only`,
		'Object',
		{
			name: 'Partner CRM record #88421 (provider icon fallback)',
			summary:
				'A generic object with no per-resource icon or file format hint. The inline card should fall back to the upstream application icon from `generator`, matching the prioritisation order used in production resolver payloads.',
		},
	),
	[`${ICON_TEST_BASE}/blog`]: makeIconTestResponse(`${ICON_TEST_BASE}/blog`, 'schema:BlogPosting', {
		name: 'Engineering blog: shipping safer deploys with progressive rollouts',
		summary:
			'Long-form `schema:BlogPosting` content used to exercise blog-specific iconography alongside a full summary block, attribution, and preview link metadata.',
	}),
	[`${ICON_TEST_BASE}/digital-doc-confluence`]: makeIconTestResponse(
		`${ICON_TEST_BASE}/digital-doc-confluence`,
		'schema:DigitalDocument',
		{
			name: 'Confluence live doc — collaborative spec (digital document + Confluence generator)',
			summary:
				'Represents a live Confluence-backed digital document. Useful for validating Confluence generator detection, co-editing affordances in block/embed cards, and the Confluence-specific icon branch.',
		},
		confluenceGenerator,
	),
	[`${ICON_TEST_BASE}/digital-doc`]: makeIconTestResponse(
		`${ICON_TEST_BASE}/digital-doc`,
		'schema:DigitalDocument',
		{
			name: 'Shared playbook — Google Doc export (digital document, non-Confluence)',
			summary:
				'A vendor-neutral `schema:DigitalDocument` with rich text summary so block and inline appearances still read well when the resource is not tied to Atlassian generator metadata.',
		},
	),
	[`${ICON_TEST_BASE}/template`]: makeIconTestResponse(
		`${ICON_TEST_BASE}/template`,
		'atlassian:Template',
		{
			name: 'Sprint retrospective template (Confluence)',
			summary:
				'Pre-built retrospective structure with prompts for what went well, what to improve, and action items. Exercises `atlassian:Template` typing and template icon mapping in the extractor pipeline.',
		},
	),
	[`${ICON_TEST_BASE}/pull-request`]: makeIconTestResponse(
		`${ICON_TEST_BASE}/pull-request`,
		'atlassian:SourceCodePullRequest',
		{
			name: 'PR #482: harden OAuth token refresh + add integration tests',
			summary:
				'Source pull request payload with a realistic title and description span. Helps validate pull-request icons, status chips, and how long metadata wraps inside block and embed frames.',
			'atlassian:state': {
				'@type': 'Object',
				name: 'Open',
				appearance: 'information',
			},
		},
	),
	[`${ICON_TEST_BASE}/jira-bug`]: makeIconTestResponse(
		`${ICON_TEST_BASE}/jira-bug`,
		['atlassian:Task', 'Object'],
		{
			name: 'NAV-2048: Inline card icons drift when priority chip is present',
			summary:
				'Steps to reproduce: open inline smart link in the editor, toggle reduced motion, resize panel. Expected: priority and issue type icons stay aligned. Actual: glyph baseline shifts by 2px.',
			'atlassian:taskType': {
				'@type': 'Object',
				'@id': 'https://www.atlassian.com/taskType#JiraBug',
				name: 'Bug',
			},
			'atlassian:state': {
				'@type': 'Object',
				name: 'In progress',
				appearance: 'information',
			},
		},
		jiraGenerator,
	),
	[`${ICON_TEST_BASE}/task-default`]: makeIconTestResponse(
		`${ICON_TEST_BASE}/task-default`,
		['atlassian:Task', 'Object'],
		{
			name: 'LP-901: Document smart-link icon precedence for QA fixtures',
			summary:
				'Tracker work item without a specialised `atlassian:taskType` id, so the card should use the default task/issue iconography while still rendering summary and workflow state from JSON-LD.',
			'atlassian:state': {
				'@type': 'Object',
				name: 'To do',
				appearance: 'default',
			},
		},
	),
	[`${ICON_TEST_BASE}/confluence-doc`]: makeIconTestResponse(
		`${ICON_TEST_BASE}/confluence-doc`,
		'Document',
		{
			name: 'Runbook: restoring Media Services after a regional failover',
			summary:
				'Operational checklist covering traffic drain, cache invalidation, and comms templates. Uses a Confluence `generator` block so provider-specific document icons and titles can be regression-tested together.',
		},
		confluenceGenerator,
	),
};

export const iconTestUrls: string[] = Object.keys(iconTestResponseMap);

export class MockCardClient extends CardClient {
	prefetchData(url: string): Promise<JsonLd.Response | undefined> {
		return Promise.resolve(undefined);
	}
}

export class ResolvedClient extends MockCardClient {
	fetchData(url: string): Promise<JsonLd.Response<JsonLd.Data.BaseData>> {
		const iconTestResponse = iconTestResponseMap[url];
		if (iconTestResponse) {
			return Promise.resolve(iconTestResponse as JsonLd.Response<JsonLd.Data.BaseData>);
		}

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
	fetchData(): Promise<JsonLd.Response> {
		return new Promise(() => {
			// resolve() never get called to keep status as resolving forever
		});
	}
}

export class ResolvedClientWithDelay extends MockCardClient {
	fetchData(): Promise<JsonLd.Response> {
		const response = { ...AtlasProject };
		return new Promise((resolve) => setTimeout(() => resolve(response as JsonLd.Response), 2000));
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
	fetchData(url: string): Promise<JsonLd.Response> {
		return Promise.resolve(mocks.unauthorized(url) as JsonLd.Response);
	}
}

export class UnAuthClientWithProviderImage extends MockCardClient {
	fetchData(url: string): Promise<JsonLd.Response> {
		const unauthorizedResponse = mocks.unauthorized(url);
		(unauthorizedResponse.data.generator as any).image = {
			'@type': 'Image',
			url: iconGoogleDrive,
		};
		return Promise.resolve(unauthorizedResponse as JsonLd.Response);
	}
}

export class UnAuthClientWithNoAuthFlow extends MockCardClient {
	fetchData(url: string): Promise<JsonLd.Response> {
		const unauthorizedResponse = mocks.unauthorized(url);
		unauthorizedResponse.meta.auth = [];
		return Promise.resolve(unauthorizedResponse as JsonLd.Response);
	}
}

export class UnAuthClientWithNoIcon extends MockCardClient {
	fetchData(url: string): Promise<JsonLd.Response> {
		const unauthorizedResponse = mocks.unauthorized(url);
		unauthorizedResponse.meta.key = 'some-unknown-provider';
		unauthorizedResponse.data.generator = {
			name: 'Provider',
			'@type': 'Application',
			icon: undefined,
		};
		return Promise.resolve(unauthorizedResponse as JsonLd.Response);
	}
}

export class UnicornResolvedClient extends CardClient {
	fetchData(): Promise<JsonLd.Response> {
		return Promise.resolve(unicornResponse as JsonLd.Response);
	}
}
