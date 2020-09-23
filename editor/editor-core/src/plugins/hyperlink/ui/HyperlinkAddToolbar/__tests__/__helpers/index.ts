import { activityProviderFactory } from '@atlaskit/editor-test-helpers/mock-activity-provider';
import { searchProviderFactory } from '@atlaskit/editor-test-helpers/mock-search-provider';
import { ActivityItem } from '@atlaskit/activity-provider';
import { QuickSearchResult, LinkContentType } from '@atlaskit/editor-common';
import { RECENT_SEARCH_LIST_SIZE } from '../../HyperlinkAddToolbar';

const allQuickSearchResultContentTypes: QuickSearchResult['contentType'][] = [
  'jira.issue',
  'confluence.page',
  'confluence.blogpost',
  'default',
];
const padZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export const generateSearchproviderMockResults = (
  count: number,
  contentType?: LinkContentType,
): QuickSearchResult[] =>
  Array(count)
    .fill(null)
    .map(
      (_, i): QuickSearchResult => ({
        objectId: `object-id-${i + 1}`,
        title: `some-quick-search-title-${i + 1}`,
        container: `some-quick-search-container-${i + 1}`,
        url: `some-quick-search-url-${i + 1}.com`,
        updatedTimestamp: `2020-04-15T${padZero(i)}:00:00+00:00`,
        contentType:
          contentType ||
          allQuickSearchResultContentTypes[
            i % allQuickSearchResultContentTypes.length
          ],
      }),
    );

export const searchProviderMockResults: QuickSearchResult[] = generateSearchproviderMockResults(
  RECENT_SEARCH_LIST_SIZE,
);

export const searchProviderMock = searchProviderFactory(
  searchProviderMockResults,
);

export const generateActivityProviderMockResults = (numberOfItems: number) =>
  Array(numberOfItems)
    .fill(null)
    .map(
      (_, i): ActivityItem => ({
        objectId: `object-id-${i + 1}`,
        name: `some-activity-name-${i + 1}`,
        container: `some-activity-container-${i + 1}`,
        iconUrl: `some-activity-icon-url-${i + 1}.com`,
        url: `some-activity-url-${i + 1}.com`,
        viewedTimestamp: `2020-04-16T${padZero(i)}:00:00+00:00`,
        type: 'ISSUE',
      }),
    );

export const activityProviderMockResults: ActivityItem[] = generateActivityProviderMockResults(
  RECENT_SEARCH_LIST_SIZE,
);

/**
 * Provides sample data for this suite of tests.
 */
export const activityProviderMock = activityProviderFactory(
  activityProviderMockResults,
);
