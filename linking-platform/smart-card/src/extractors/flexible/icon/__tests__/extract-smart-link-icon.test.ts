import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { extractSmartLinkIcon } from '../extract-smart-link-icon';

const response: SmartLinkResponse = {
	meta: {
		access: 'granted',
		visibility: 'public',
		generator: {
			name: 'Google Drive',
			icon: {
				url: 'https://provider-icon.com/icon.png',
			},
		},
	},
	data: {
		'@type': 'Document',
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		icon: {
			'@type': 'Image',
			url: 'https://jsonld-icon.com/icon.png',
		},
	},
	entityData: {
		displayName: 'Entity',
		id: 'entity-id',
		url: 'https://entity-url.com',
		type: {
			category: 'document',
			iconUrl: 'https://entity-icon.com/icon.png',
		},
	},
};

describe('extractSmartLinkIcon', () => {
	it('uses entity icon extraction', () => {
		expect(extractSmartLinkIcon(response)).toEqual({
			url: 'https://entity-icon.com/icon.png',
			label: 'document',
		});
	});
});
