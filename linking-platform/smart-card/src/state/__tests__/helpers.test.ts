import type { JsonLd } from '@atlaskit/json-ld-types';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { getContentId, getJiraIssueId, getPageId } from '../helpers';

// Spy on window.location.href getter
let locationSpy: jest.SpyInstance;

const mockLocationHref = (url: string) => {
	if (locationSpy) {
		locationSpy.mockReturnValue(url);
	}
};

beforeAll(() => {
	// Create a spy on the window.location.href getter
	locationSpy = jest.spyOn(window.location, 'href', 'get');
});

afterAll(() => {
	// Restore the spy
	if (locationSpy) {
		locationSpy.mockRestore();
	}
});

const createMockResponse = (url: string): JsonLd.Response => ({
	data: {
		'@type': 'Document',
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		url,
		name: 'Test',
	},
	meta: { access: 'granted', visibility: 'restricted' },
});

describe('helpers', () => {
	beforeEach(() => {
		// Clear any previous mock return values
		if (locationSpy) {
			locationSpy.mockClear();
		}
	});

	describe('getPageId', () => {
		ffTest.on('platform_smartlink_3pclick_analytics', '', () => {
			it('extracts page ID from Confluence URL when on Confluence site', () => {
				mockLocationHref('https://confluence.atlassian.net/wiki/spaces/TEAM');
				const response = createMockResponse(
					'https://test.atlassian.net/wiki/spaces/TEST/pages/123456',
				);
				expect(getPageId(response)).toBe('123456');
			});

			it('returns undefined when not on Confluence site', () => {
				mockLocationHref('https://jira.atlassian.net/browse/PROJ-1');
				const response = createMockResponse(
					'https://test.atlassian.net/wiki/spaces/TEST/pages/123456',
				);
				expect(getPageId(response)).toBeUndefined();
			});
		});

		ffTest.off('platform_smartlink_3pclick_analytics', '', () => {
			it('returns undefined when feature flag is disabled', () => {
				const response = createMockResponse(
					'https://test.atlassian.net/wiki/spaces/TEST/pages/123456',
				);
				expect(getPageId(response)).toBeUndefined();
			});
		});
	});

	describe('getContentId', () => {
		ffTest.on('platform_smartlink_3pclick_analytics', '', () => {
			it('extracts content ID from app connector URL when on Confluence site', () => {
				mockLocationHref('https://confluence.atlassian.net/wiki/spaces/TEAM');
				const response = createMockResponse(
					'https://test.atlassian.net/wiki/plugins/servlet/ac/app?content.id=999888',
				);
				expect(getContentId(response)).toBe('999888');
			});

			it('returns undefined when not on Confluence site', () => {
				mockLocationHref('https://jira.atlassian.net/browse/PROJ-1');
				const response = createMockResponse(
					'https://test.atlassian.net/wiki/plugins/servlet/ac/app?content.id=999888',
				);
				expect(getContentId(response)).toBeUndefined();
			});
		});

		ffTest.off('platform_smartlink_3pclick_analytics', '', () => {
			it('returns undefined when feature flag is disabled', () => {
				const response = createMockResponse(
					'https://test.atlassian.net/wiki/plugins/servlet/ac/app?content.id=999888',
				);
				expect(getContentId(response)).toBeUndefined();
			});
		});
	});

	describe('getJiraIssueId', () => {
		ffTest.on('platform_smartlink_3pclick_analytics', '', () => {
			it('extracts issue key from browse URL when on Jira site', () => {
				mockLocationHref('https://jira.atlassian.net/browse/PROJ-1');
				const response = createMockResponse('https://test.atlassian.net/browse/ABC-123');
				expect(getJiraIssueId(response)).toBe('ABC-123');
			});

			it('returns undefined when not on Jira site', () => {
				mockLocationHref('https://confluence.atlassian.net/wiki/spaces/TEAM');
				const response = createMockResponse('https://test.atlassian.net/browse/ABC-123');
				expect(getJiraIssueId(response)).toBeUndefined();
			});
		});

		ffTest.off('platform_smartlink_3pclick_analytics', '', () => {
			it('returns undefined when feature flag is disabled', () => {
				const response = createMockResponse('https://test.atlassian.net/browse/ABC-123');
				expect(getJiraIssueId(response)).toBeUndefined();
			});
		});
	});
});
