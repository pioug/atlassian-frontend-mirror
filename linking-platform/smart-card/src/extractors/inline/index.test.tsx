import type { SmartLinkResponse } from '@atlaskit/linking-types';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { extractInlineProps } from './index';

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(() => false),
}));

jest.mock('@atlaskit/link-extractors/extract-smart-link-inline-icon', () => ({
	extractSmartLinkInlineIcon: jest.fn(() => 'copied-inline-icon'),
}));

const { expValEquals } = jest.requireMock('@atlaskit/tmp-editor-statsig/exp-val-equals') as {
	expValEquals: jest.Mock;
};

const { extractSmartLinkInlineIcon: extractSmartLinkInlineIconFromLinkExtractors } =
	jest.requireMock('@atlaskit/link-extractors/extract-smart-link-inline-icon') as {
		extractSmartLinkInlineIcon: jest.Mock;
	};

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
	beforeEach(() => {
		expValEquals.mockReturnValue(false);
		extractSmartLinkInlineIconFromLinkExtractors.mockClear();
	});

	it('should return the type of the response', () => {
		const result = extractInlineProps(response);
		expect(result.type).toEqual(['Document']);
	});

	it('should use the link-extractors inline icon helper when experiment is enabled', () => {
		expValEquals.mockReturnValue(true);

		const result = extractInlineProps(response);

		expect(expValEquals).toHaveBeenCalledWith(
			'confluence_1p_and_3p_connection_byline_experiment',
			'isEnabled',
			true,
		);
		expect(result.icon).toBe('copied-inline-icon');
		expect(extractSmartLinkInlineIconFromLinkExtractors).toHaveBeenCalledWith(response, true);
	});

	it('should keep using the local inline icon helper when experiment is disabled', () => {
		const result = extractInlineProps({
			...response,
			data: {
				...response.data,
				generator: {
					'@type': 'Application',
					name: 'Google Drive',
					icon: {
						'@type': 'Image',
						url: 'https://provider-icon.com/icon.png',
					},
				},
			},
		} as SmartLinkResponse);

		expect(result.icon).toBe('https://provider-icon.com/icon.png');
		expect(extractSmartLinkInlineIconFromLinkExtractors).not.toHaveBeenCalled();
	});

	ffTest.off('platform_lp_use_entity_icon_url_for_icon', 'when feature gate is off', () => {
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
	});

	ffTest.on('platform_lp_use_entity_icon_url_for_icon', 'when feature gate is on', () => {
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
	});
});
