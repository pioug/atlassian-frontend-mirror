import { renderWithIntl as render } from '@atlaskit/link-test-helpers';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import {
	TEST_BASE_DATA,
	TEST_IMAGE,
	TEST_LINK,
	TEST_NAME,
	TEST_OBJECT,
	TEST_URL,
} from '../__mocks__/linkingPlatformJsonldMocks';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../constants';
import { extractProvider } from '../index';

describe('extractors.context.provider', () => {
	afterEach(() => jest.clearAllMocks());

	it('returns undefined if no generator', () => {
		expect(extractProvider(TEST_BASE_DATA)).toBe(undefined);
	});

	it('throws if generator is a string', () => {
		expect(() => extractProvider({ ...TEST_BASE_DATA, generator: TEST_URL })).toThrow(
			'Link.generator requires a name and icon.',
		);
	});

	it('returns undefined if link has no name', () => {
		expect(
			extractProvider({
				...TEST_BASE_DATA,
				generator: { ...(TEST_LINK as any), name: undefined },
			}),
		).toEqual(undefined);
	});

	it('returns generator with name if link has name', () => {
		expect(extractProvider({ ...TEST_BASE_DATA, generator: TEST_LINK })).toEqual({
			text: TEST_NAME,
		});
	});

	it('returns undefined if object has no name', () => {
		expect(
			extractProvider({
				...TEST_BASE_DATA,
				generator: { ...TEST_OBJECT, name: undefined },
			}),
		).toEqual(undefined);
	});

	it('returns generator with name if object has name', () => {
		expect(
			extractProvider({
				...TEST_BASE_DATA,
				generator: { ...TEST_OBJECT, icon: undefined },
			}),
		).toEqual({ text: TEST_NAME, image: TEST_URL });
	});

	it('returns generator with name, icon if object has name, icon', () => {
		expect(
			extractProvider({
				...TEST_BASE_DATA,
				generator: TEST_OBJECT,
			}),
		).toEqual({ text: TEST_NAME, icon: TEST_URL, image: TEST_URL });
	});

	it('returns generator icon for Confluence', () => {
		const provider = extractProvider({
			...TEST_BASE_DATA,
			generator: { ...TEST_OBJECT, '@id': CONFLUENCE_GENERATOR_ID },
		});
		expect(provider).toBeDefined();
		const { getByLabelText } = render(provider!.icon);
		expect(getByLabelText('Confluence')).toBeDefined();
	});

	it('returns generator icon for Jira', () => {
		const provider = extractProvider({
			...TEST_BASE_DATA,
			generator: { ...TEST_OBJECT, '@id': JIRA_GENERATOR_ID },
		});
		expect(provider).toBeDefined();
		const { getByLabelText } = render(provider!.icon);
		expect(getByLabelText('Jira')).toBeDefined();
	});

	describe('with platform_sl_google_rebrand gate OFF', () => {
		beforeEach(() => {
			failGate('platform_sl_google_rebrand');
		});

		it('returns text as-is for a Link generator named "Google"', () => {
			expect(
				extractProvider({
					...TEST_BASE_DATA,
					generator: { '@type': 'Link', href: TEST_URL, name: 'Google' },
				}),
			).toEqual({ text: 'Google' });
		});

		it('returns text as-is for an Object generator named "Google"', () => {
			expect(
				extractProvider({
					...TEST_BASE_DATA,
					generator: { ...TEST_OBJECT, name: 'Google', icon: undefined },
				}),
			).toEqual({ text: 'Google', image: TEST_URL });
		});
	});

	describe('with platform_sl_google_rebrand gate ON', () => {
		beforeEach(() => {
			passGate('platform_sl_google_rebrand');
		});

		it('renames "Google" to "Google Drive" for a Link generator', () => {
			expect(
				extractProvider({
					...TEST_BASE_DATA,
					generator: { '@type': 'Link', href: TEST_URL, name: 'Google' },
				}),
			).toEqual({ text: 'Google Drive' });
		});

		it('renames "Google" to "Google Drive" for an Object generator', () => {
			const result = extractProvider({
				...TEST_BASE_DATA,
				generator: { ...TEST_OBJECT, name: 'Google', icon: undefined },
			});
			expect(result?.text).toBe('Google Drive');
		});

		it('does not rename non-Google providers', () => {
			expect(
				extractProvider({
					...TEST_BASE_DATA,
					generator: { '@type': 'Link', href: TEST_URL, name: TEST_NAME },
				}),
			).toEqual({ text: TEST_NAME });
		});
	});

	describe('with image', () => {
		it('returns raw string', () => {
			const provider = extractProvider({
				...TEST_BASE_DATA,
				generator: { ...TEST_OBJECT, image: TEST_URL },
			});
			expect(provider?.image).toBe(TEST_URL);
		});

		it('returns image url from link', () => {
			const provider = extractProvider({
				...TEST_BASE_DATA,
				generator: { ...TEST_OBJECT, image: TEST_LINK },
			});
			expect(provider?.image).toBe(TEST_URL);
		});

		it('returns image url from image', () => {
			const provider = extractProvider({
				...TEST_BASE_DATA,
				generator: { ...TEST_OBJECT, image: TEST_IMAGE },
			});
			expect(provider?.image).toBe(TEST_URL);
		});
	});
});
