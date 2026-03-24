import { isTeamsAppRoute } from '../../../src/common/utils/utils';

// Not testing isModified or getRoutePathFromUrl because they are logic that was migrated from other packages

describe('isTeamsAppRoute', () => {
	test.each([
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
	])('%s', (_, url, expected) => {
		expect(isTeamsAppRoute(url)).toBe(expected);
	});
});
