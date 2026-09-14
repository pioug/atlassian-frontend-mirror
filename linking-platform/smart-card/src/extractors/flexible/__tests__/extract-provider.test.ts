import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { IconType } from '../../../constants';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../../constants';
import extractProvider from '../extract-provider';

/**
 * Build a minimal SmartLinkResponse with a generator embedded in data (non-entity path).
 * This is the shape that extractSmartLinkProvider reads when response.entityData is absent.
 */
const buildResponse = ({
	generatorId,
	generatorName,
	generatorIcon,
}: {
	generatorIcon?: string;
	generatorId?: string;
	generatorName?: string;
} = {}): SmartLinkResponse => {
	const generator =
		generatorId || generatorName || generatorIcon
			? {
					'@type': 'Application',
					'@id': generatorId,
					name: generatorName,
					icon: generatorIcon
						? {
								'@type': 'Image',
								url: generatorIcon,
							}
						: undefined,
				}
			: undefined;

	return {
		data: {
			'@type': 'Document',
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			url: 'https://example.com',
			...(generator ? { generator } : {}),
		},
		meta: { access: 'granted', visibility: 'public' },
	} as unknown as SmartLinkResponse;
};

describe('extractProvider', () => {
	describe('when response is undefined', () => {
		it('returns undefined', () => {
			const result = extractProvider(undefined);
			expect(result).toBeUndefined();
		});
	});

	describe('when response has no generator', () => {
		it('returns undefined', () => {
			const response = {
				data: { '@type': 'Document' },
				meta: { access: 'granted', visibility: 'public' },
			} as unknown as SmartLinkResponse;

			const result = extractProvider(response);
			expect(result).toBeUndefined();
		});
	});

	describe('Confluence provider', () => {
		it('returns Confluence icon type with provider name as label', () => {
			const response = buildResponse({
				generatorId: CONFLUENCE_GENERATOR_ID,
				generatorName: 'Confluence',
			});

			const result = extractProvider(response);

			expect(result).toEqual({
				icon: IconType.Confluence,
				label: 'Confluence',
			});
		});

		it('returns Confluence icon type with custom provider name as label', () => {
			const response = buildResponse({
				generatorId: CONFLUENCE_GENERATOR_ID,
				generatorName: 'My Confluence',
			});

			const result = extractProvider(response);

			expect(result).toEqual({
				icon: IconType.Confluence,
				label: 'My Confluence',
			});
		});

		it('returns undefined when generator name is empty string', () => {
			// extractSmartLinkProvider requires a non-empty name — when name is '',
			// it returns undefined, so extractProvider also returns undefined.
			const response = buildResponse({
				generatorId: CONFLUENCE_GENERATOR_ID,
				generatorName: '',
			});

			const result = extractProvider(response);

			expect(result).toBeUndefined();
		});
	});

	describe('Jira provider', () => {
		it('returns Jira icon type with provider name as label', () => {
			const response = buildResponse({
				generatorId: JIRA_GENERATOR_ID,
				generatorName: 'Jira',
			});

			const result = extractProvider(response);

			expect(result).toEqual({
				icon: IconType.Jira,
				label: 'Jira',
			});
		});

		it('returns Jira icon type with custom provider name as label', () => {
			const response = buildResponse({
				generatorId: JIRA_GENERATOR_ID,
				generatorName: 'My Jira',
			});

			const result = extractProvider(response);

			expect(result).toEqual({
				icon: IconType.Jira,
				label: 'My Jira',
			});
		});
	});

	describe('entity provider', () => {
		const response = {
			meta: {
				generator: {
					name: 'Google Drive',
					id: 'google-drive',
					icon: { url: 'https://provider-icon.com/icon.png' },
				},
			},
			data: { '@type': 'Object' },
			entityData: {
				displayName: 'Entity',
				id: 'entity-id',
				url: 'https://entity-url.com',
				type: {
					category: 'document',
					iconUrl: 'https://entity-icon.com/icon.png',
				},
			},
		} as unknown as SmartLinkResponse;

		it('returns the generator icon when the gate is on', () => {
			passGate('platform_lp_use_generator_icon_for_provider');

			expect(extractProvider(response)).toEqual({
				label: 'Google Drive',
				url: 'https://provider-icon.com/icon.png',
			});
		});

		it('returns the entity icon when the gate is off', () => {
			failGate('platform_lp_use_generator_icon_for_provider');

			expect(extractProvider(response)).toEqual({
				label: 'Google Drive',
				url: 'https://entity-icon.com/icon.png',
			});
		});
	});

	describe('third-party provider', () => {
		it('returns url-based icon descriptor with label and url when both name and icon URL are present', () => {
			const iconUrl = 'https://example.com/icon.png';
			const response = buildResponse({
				generatorName: 'Figma',
				generatorIcon: iconUrl,
			});

			const result = extractProvider(response);

			expect(result).toEqual({
				label: 'Figma',
				url: iconUrl,
			});
		});

		it('returns label only (no url) when generator has a name but no icon URL', () => {
			const response = buildResponse({ generatorName: 'Unknown Provider' });

			const result = extractProvider(response);

			expect(result).toEqual({
				label: 'Unknown Provider',
				url: undefined,
			});
		});

		it('returns undefined when generator has no name (extractSmartLinkProvider requires name)', () => {
			// extractSmartLinkProvider returns undefined when generator has no name,
			// so extractProvider also returns undefined in this case.
			const iconUrl = 'https://example.com/icon.png';
			const response = buildResponse({ generatorIcon: iconUrl });

			const result = extractProvider(response);

			expect(result).toBeUndefined();
		});
	});
});
