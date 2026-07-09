import { type SmartLinkResponse } from '@atlaskit/linking-types';

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
