import { isFedramp, isIsolatedCloud, isTeamsAppRoute } from '../../../src/common/utils/utils';

// Not testing isModified or getRoutePathFromUrl because they are logic that was migrated from other packages

describe('isFedramp', () => {
	test.each([
		// Production FedRAMP Moderate domains
		['atlassian-us-gov-mod.com', true],
		['atlassian-us-gov-mod.net', true],
		['home.atlassian-us-gov-mod.com', true],
		['app.stg.atlassian-us-gov-mod.net', true],

		// FedRAMP Gov domains
		['atlassian-us-gov.com', true],
		['atlassian-us-gov.net', true],
		['home.atlassian-us-gov.com', true],

		// FedRAMP staging domains
		['atlassian-fex.com', true],
		['atlassian-fex.net', true],
		['home.atlassian-fex.com', true],
		['atlassian-stg-fedm.com', true],
		['atlassian-stg-fedm.net', true],
		['home.atlassian-stg-fedm.net', true],

		// Case insensitivity
		['HOME.ATLASSIAN-US-GOV-MOD.COM', true],

		// Non-FedRAMP domains
		['atlassian.com', false],
		['atlassian.net', false],
		['home.atlassian.com', false],
		['example.com', false],
		['atlassian-isolated.net', false],
	])('isFedramp("%s") should return %s', (hostname, expected) => {
		expect(isFedramp(hostname)).toBe(expected);
	});
});

describe('isIsolatedCloud', () => {
	test.each([
		// Isolated Cloud domains
		['atlassian-isolated.net', true],
		['apple.atlassian-isolated.net', true],
		['admin.apple.atlassian-isolated.net', true],
		['id.apple.atlassian-isolated.net', true],

		// Case insensitivity
		['APPLE.ATLASSIAN-ISOLATED.NET', true],

		// Non-Isolated Cloud domains
		['atlassian.com', false],
		['atlassian.net', false],
		['home.atlassian.com', false],
		['atlassian-us-gov-mod.com', false],
		['example.com', false],
	])('isIsolatedCloud("%s") should return %s', (hostname, expected) => {
		expect(isIsolatedCloud(hostname)).toBe(expected);
	});
});

describe('isTeamsAppRoute', () => {
	test.each([
		// Standard commercial domains
		['people route with /o/ prefix', 'https://home.atlassian.com/o/my-org/people/123', true],
		['people route without /o/ prefix', 'https://home.atlassian.com/people/123', true],
		[
			'project route on home.atlassian.com',
			'https://home.atlassian.com/o/my-org/project/abc',
			false,
		],
		['people route on different host', 'https://example.com/o/my-org/people/123', false],
		['unrelated internal path', 'https://confluence.atlassian.com/pages/123', false],
		[
			'route under /o/ without /people',
			'https://home.atlassian.com/o/my-org/unknown-app/123',
			false,
		],

		// FedRAMP domains
		[
			'people route on FedRAMP production',
			'https://home.atlassian-us-gov-mod.com/people/123',
			true,
		],
		['people route on FedRAMP staging', 'https://home.atlassian-fex.com/people/123', true],
		['non-people route on FedRAMP', 'https://home.atlassian-us-gov-mod.com/project/abc', false],

		// Isolated Cloud domains
		['people route on Isolated Cloud', 'https://apple.atlassian-isolated.net/people/123', true],
		[
			'non-people route on Isolated Cloud',
			'https://apple.atlassian-isolated.net/project/abc',
			false,
		],
	])('%s', (_, url, expected) => {
		expect(isTeamsAppRoute(url)).toBe(expected);
	});
});
