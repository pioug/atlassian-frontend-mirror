import type { SmartLinkResponse } from '@atlaskit/linking-types';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { extractSmartLinkIcon } from '../index';

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
	ffTest.off('platform_lp_use_entity_icon_url_for_icon', 'when feature gate is off', () => {
		it('uses generator icon (since entity path is taken)', () => {
			expect(extractSmartLinkIcon(response)).toMatchObject({
				url: 'https://provider-icon.com/icon.png',
			});
		});
	});

	ffTest.on('platform_lp_use_entity_icon_url_for_icon', 'when feature gate is on', () => {
		it('uses entity icon extraction', () => {
			expect(extractSmartLinkIcon(response)).toEqual({
				url: 'https://entity-icon.com/icon.png',
				label: 'document',
			});
		});
	});
});
