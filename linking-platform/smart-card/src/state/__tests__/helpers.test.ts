import { ffTest } from '@atlassian/feature-flags-test-utils';

import { getFirstPartyIdentifier } from '../helpers';

// Spy on window.location.href getter
let locationSpy: jest.SpyInstance;

const mockLocationHref = (url: string) => {
	if (locationSpy) {
		locationSpy.mockReturnValue(url);
	}
};

beforeAll(() => {
	locationSpy = jest.spyOn(window.location, 'href', 'get');
});

afterAll(() => {
	if (locationSpy) {
		locationSpy.mockRestore();
	}
});

describe('getFirstPartyIdentifier', () => {
	beforeEach(() => {
		if (locationSpy) {
			locationSpy.mockClear();
		}
	});

	ffTest.on('platform_smartlink_3pclick_analytics', '', () => {
		it('returns ConfluenceContentId when content.id is present in Confluence URL', () => {
			mockLocationHref(
				'https://confluence.atlassian.net/wiki/plugins/servlet/ac/app?content.id=999888',
			);
			expect(getFirstPartyIdentifier()).toBe('ConfluenceContentId:999888');
		});

		it('returns ConfluencePageId when pageId is present in Confluence URL', () => {
			mockLocationHref('https://confluence.atlassian.net/wiki/spaces/TEAM/pages/123456/Test');
			expect(getFirstPartyIdentifier()).toBe('ConfluencePageId:123456');
		});

		it('returns JiraIssueKey when issue key is present in Jira URL', () => {
			mockLocationHref('https://jira.atlassian.net/browse/ABC-123');
			expect(getFirstPartyIdentifier()).toBe('JiraIssueKey:ABC-123');
		});

		it('returns undefined if no identifier is found', () => {
			mockLocationHref('https://confluence.atlassian.net/wiki/spaces/TEAM');
			expect(getFirstPartyIdentifier()).toBeUndefined();
		});
		it('returns ConfluenceContentId when both content.id and pageId are present', () => {
			mockLocationHref(
				'https://confluence.atlassian.net/wiki/spaces/TEAM/pages/123456?content.id=999888',
			);
			expect(getFirstPartyIdentifier()).toBe('ConfluenceContentId:999888');
		});
	});

	ffTest.off('platform_smartlink_3pclick_analytics', '', () => {
		it('returns undefined when feature flag is disabled', () => {
			mockLocationHref('https://confluence.atlassian.net/wiki/spaces/TEAM/pages/123456/Test');
			expect(getFirstPartyIdentifier()).toBeUndefined();
		});
	});
});

describe('getFirstPartyIdentifier - Confluence page and content extraction', () => {
	const pageUrl =
		'https://swang14-slclick.jira-dev.com/wiki/spaces/~712020f4496290c6be4720910e80fad0c1b5c7/pages/3309579/Test+e2e+flow';
	const contentUrl =
		'https://hello.atlassian.net/wiki/plugins/servlet/ac/com.atlassian.perspectiveretros/perspective-retros?content.id=5662725850';

	ffTest.on('platform_smartlink_3pclick_analytics', '', () => {
		it('extracts ConfluencePageId from personal space URL', () => {
			mockLocationHref(pageUrl);
			expect(getFirstPartyIdentifier()).toBe('ConfluencePageId:3309579');
		});

		it('extracts ConfluenceContentId from plugin servlet URL', () => {
			mockLocationHref(contentUrl);
			expect(getFirstPartyIdentifier()).toBe('ConfluenceContentId:5662725850');
		});
	});

	ffTest.off('platform_smartlink_3pclick_analytics', '', () => {
		it('returns undefined when feature flag is off for page URL', () => {
			mockLocationHref(pageUrl);
			expect(getFirstPartyIdentifier()).toBeUndefined();
		});

		it('returns undefined when feature flag is off for content URL', () => {
			mockLocationHref(contentUrl);
			expect(getFirstPartyIdentifier()).toBeUndefined();
		});
	});
});

describe('getFirstPartyIdentifier - Jira key extraction from browse URL', () => {
	const jiraUrl = 'https://product-fabric.atlassian.net/browse/AI3W-864';

	ffTest.on('platform_smartlink_3pclick_analytics', '', () => {
		it('extracts JiraIssueKey from Jira browse URL', () => {
			mockLocationHref(jiraUrl);
			expect(getFirstPartyIdentifier()).toBe('JiraIssueKey:AI3W-864');
		});

		it('returns undefined when not on Jira site', () => {
			mockLocationHref('https://confluence.atlassian.net/wiki/spaces/TEAM');
			expect(getFirstPartyIdentifier()).toBeUndefined();
		});
	});

	ffTest.off('platform_smartlink_3pclick_analytics', '', () => {
		it('returns undefined when feature flag is disabled', () => {
			mockLocationHref(jiraUrl);
			expect(getFirstPartyIdentifier()).toBeUndefined();
		});
	});
});
