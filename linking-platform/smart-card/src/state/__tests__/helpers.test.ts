import { getFirstPartyIdentifier } from '../getFirstPartyIdentifier';

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

describe('getFirstPartyIdentifier - Confluence page and content extraction', () => {
	const pageUrl =
		'https://swang14-slclick.jira-dev.com/wiki/spaces/~712020f4496290c6be4720910e80fad0c1b5c7/pages/3309579/Test+e2e+flow';
	const contentUrl =
		'https://hello.atlassian.net/wiki/plugins/servlet/ac/com.atlassian.perspectiveretros/perspective-retros?content.id=5662725850';

	it('extracts ConfluencePageId from personal space URL', () => {
		mockLocationHref(pageUrl);
		expect(getFirstPartyIdentifier()).toBe('ConfluencePageId:3309579');
	});

	it('extracts ConfluenceContentId from plugin servlet URL', () => {
		mockLocationHref(contentUrl);
		expect(getFirstPartyIdentifier()).toBe('ConfluenceContentId:5662725850');
	});
});

describe('getFirstPartyIdentifier - Jira key extraction from browse URL', () => {
	const jiraUrl = 'https://product-fabric.atlassian.net/browse/AI3W-864';

	it('extracts JiraIssueKey from Jira browse URL', () => {
		mockLocationHref(jiraUrl);
		expect(getFirstPartyIdentifier()).toBe('JiraIssueKey:AI3W-864');
	});

	it('returns undefined when not on Jira site', () => {
		mockLocationHref('https://confluence.atlassian.net/wiki/spaces/TEAM');
		expect(getFirstPartyIdentifier()).toBeUndefined();
	});
});

describe('getFirstPartyIdentifier - third-party and first-party URL fixtures', () => {
	it('handles various third-party and first-party URLs correctly', () => {
		const fixtures = [
			{
				url: 'https://trello.com/b/675b4029f5c9a805291230a0',
				expected: undefined,
				description: 'Trello board',
			},
			{
				url: 'https://trello.com/c/FlNbrRqK/59-autonomously-refactor-10-instances-of-deprecated-technology-out-of-codebase',
				expected: undefined,
				description: 'Trello card',
			},
			{
				url: 'https://bitbucket.org/atlassian/ai-3p-connector/src/main/',
				expected: undefined,
				description: 'Bitbucket repo',
			},
			{
				url: 'https://bitbucket.org/atlassian/ai-3p-connector/pull-requests/21168',
				expected: undefined,
				description: 'Bitbucket PR',
			},
			{
				url: 'https://confluence.atlassian.net/wiki/spaces/TEAM/pages/123456/Test',
				expected: 'ConfluencePageId:123456',
				description: 'Confluence page',
			},
			{
				url: 'https://jira.atlassian.net/browse/ABC-123',
				expected: 'JiraIssueKey:ABC-123',
				description: 'Jira issue',
			},
		];

		fixtures.forEach(({ url, expected }) => {
			mockLocationHref(url);
			expect(getFirstPartyIdentifier()).toBe(expected);
		});
	});
});
