import type { SmartLinkResponse } from '@atlaskit/linking-types';

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
});
