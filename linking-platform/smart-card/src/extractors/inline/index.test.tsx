import type { SmartLinkResponse } from '@atlaskit/linking-types';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { extractInlineProps } from './index';

const response: SmartLinkResponse = {
	meta: {
		access: 'granted',
		visibility: 'public',
	},
	data: {
		'@type': 'Document',
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
	},
};

describe('extractInlineProps', () => {
	it('should return the type of the response', () => {
		const result = extractInlineProps(response);
		expect(result.type).toEqual(['Document']);
	});

	ffTest.off(
		'platform_lp_use_entity_icon_url_for_icon',
		'when feature gate is off',
		() => {
			it('should keep provider icon for entities', () => {
				const result = extractInlineProps({
					...response,
					meta: {
						...response.meta,
						generator: {
							name: 'Google Drive',
							icon: {
								url: 'https://provider-icon.com/icon.png',
							},
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
				} as SmartLinkResponse);

				expect(result.icon).toEqual('https://provider-icon.com/icon.png');
			});
		},
	);

	ffTest.on(
		'platform_lp_use_entity_icon_url_for_icon',
		'when feature gate is on',
		() => {
			it('should use entity icon url and label tuple', () => {
				const result = extractInlineProps({
					...response,
					meta: {
						...response.meta,
						generator: {
							name: 'Google Drive',
							icon: {
								url: 'https://provider-icon.com/icon.png',
							},
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
				} as SmartLinkResponse);

				expect(result.icon).toEqual(['https://entity-icon.com/icon.png', 'document']);
			});
		},
	);
});
