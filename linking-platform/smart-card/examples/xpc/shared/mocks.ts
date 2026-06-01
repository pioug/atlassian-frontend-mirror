import { type SmartLinkResponse } from '@atlaskit/linking-types';

export const SHARED_FIRST_PARTY_URL = 'https://example.atlassian.net/browse/JIRA-1';
export const SHARED_THIRD_PARTY_URL = 'https://example.com/some/external/page';
export const SHARED_ALREADY_WRAPPED_URL =
	'https://example.atlassian.net/browse/JIRA-1?xpis=existing-session';

const baseMeta = {
	visibility: 'public',
	access: 'granted',
	auth: [],
	definitionId: 'd1',
	key: 'object-provider',
	resourceType: 'object-resource',
	subproduct: 'object-subproduct',
};

const baseData = (url: string, name: string) => ({
	'@context': {
		'@vocab': 'https://www.w3.org/ns/activitystreams#',
		atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
		schema: 'http://schema.org/',
	},
	'@type': 'Object',
	generator: {
		'@type': 'Application',
		'@id': 'https://www.atlassian.com/#Jira',
		name: 'Jira',
	},
	url,
	name,
	summary: 'XPC cross-product URL wrapping example response.',
});

/** First-party Jira link with product set — should be wrapped when gates are ON. */
export const firstPartyResponse: SmartLinkResponse = {
	meta: { ...baseMeta, product: 'jira', is1PLink: true },
	data: baseData(SHARED_FIRST_PARTY_URL, 'XPC 1P Smart Link Example'),
} as unknown as SmartLinkResponse;

/** Third-party link — should NEVER be wrapped, regardless of gate state. */
export const thirdPartyResponse: SmartLinkResponse = {
	meta: { ...baseMeta, product: 'external-thing', is1PLink: false },
	data: baseData(SHARED_THIRD_PARTY_URL, 'XPC 3P Smart Link Example'),
} as unknown as SmartLinkResponse;

/** First-party but no `product` resolved by ORS — should NOT be wrapped (safety guard). */
export const firstPartyNoProductResponse: SmartLinkResponse = {
	// Note: no `product` key.
	meta: { ...baseMeta, is1PLink: true },
	data: baseData(SHARED_FIRST_PARTY_URL, 'XPC 1P (no host product) Example'),
} as unknown as SmartLinkResponse;

/** First-party link whose URL already carries `xpis=` — should not be double-wrapped. */
export const alreadyWrappedResponse: SmartLinkResponse = {
	meta: { ...baseMeta, product: 'jira', is1PLink: true },
	data: baseData(SHARED_ALREADY_WRAPPED_URL, 'XPC already-wrapped Example'),
} as unknown as SmartLinkResponse;
