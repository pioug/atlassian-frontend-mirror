import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { rebrandProvider } from '../rebrand-provider';

describe('rebrandProvider', () => {
	afterEach(() => jest.clearAllMocks());

	describe('when provider is undefined', () => {
		it('returns undefined', () => {
			expect(rebrandProvider(undefined)).toBeUndefined();
		});
	});

	describe('when provider text is not "Google"', () => {
		it('returns the provider unchanged for an arbitrary text', () => {
			const provider = { text: 'Jira', id: 'jira-id', image: 'https://example.com/jira.png' };
			expect(rebrandProvider(provider)).toEqual(provider);
		});

		it('returns the provider unchanged for Confluence', () => {
			const provider = {
				text: 'Confluence',
				id: 'confluence-id',
				image: 'https://example.com/confluence.png',
			};
			expect(rebrandProvider(provider)).toEqual(provider);
		});
	});

	describe('when provider text is "Google"', () => {
		describe('when platform_lp_use_entity_icon_url_for_icon gate is OFF', () => {
			beforeEach(() => {
				failGate('platform_lp_use_entity_icon_url_for_icon');
			});

			it('renames text to "Google Drive"', () => {
				const provider = { text: 'Google' };
				expect(rebrandProvider(provider)).toEqual({ text: 'Google Drive' });
			});

			it('preserves other provider fields and renames text', () => {
				const provider = {
					text: 'Google',
					id: 'google-id',
					image: 'https://example.com/google.png',
					icon: 'https://example.com/google-icon.png',
				};
				expect(rebrandProvider(provider)).toEqual({
					...provider,
					text: 'Google Drive',
				});
			});

			it('does not add iconLabel', () => {
				const result = rebrandProvider({ text: 'Google' });
				expect(result).not.toHaveProperty('iconLabel');
			});
		});

		describe('when platform_lp_use_entity_icon_url_for_icon gate is ON', () => {
			beforeEach(() => {
				passGate('platform_lp_use_entity_icon_url_for_icon');
			});

			it('renames text to "Google Drive" and sets iconLabel to "Google Drive"', () => {
				const provider = { text: 'Google' };
				expect(rebrandProvider(provider)).toEqual({
					text: 'Google Drive',
					iconLabel: 'Google Drive',
				});
			});

			it('overrides existing iconLabel with "Google Drive"', () => {
				const provider = {
					text: 'Google',
					iconLabel: 'Google',
					id: 'google-id',
					image: 'https://example.com/google.png',
				};
				expect(rebrandProvider(provider)).toEqual({
					...provider,
					text: 'Google Drive',
					iconLabel: 'Google Drive',
				});
			});
		});
	});
});
