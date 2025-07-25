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

ffTest.both('smart_links_noun_support', '', () => {
	describe('extractInlineProps', () => {
		it('should return the type of the response', () => {
			const result = extractInlineProps(response);
			expect(result.type).toEqual(['Document']);
		});
	});
});
