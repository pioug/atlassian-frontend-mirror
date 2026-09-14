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
