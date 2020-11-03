/** Extracted into its own file so the mock variables can be instantiated before other imports in the test file that would otherwise be hoisted before it */
import { mockConfluencePrefetchedData } from '../../../__tests__/unit/mocks/_mockPrefetchResults';
import { DEFAULT_AB_TEST } from '../../../api/CrossProductSearchClient';

jest.mock('../../FeaturesProvider');
jest.mock('../../../api/CachingConfluenceClient');
jest.mock('../../MessagesIntlProvider');
jest.mock('../../feedback/withFeedbackButton', () => ({
  withFeedbackButton: (component: any) => component,
}));
jest.mock(
  '../../confluence/ConfluenceQuickSearchContainer',
  () => 'ConfluenceQuickSearchContainer',
);
jest.mock(
  '../../jira/JiraQuickSearchContainer',
  () => 'JiraQuickSearchContainer',
);
jest.doMock('../../PrefetchedResultsProvider', () => ({
  GlobalSearchPreFetchContext: {
    Consumer: ({ children }: any) => children(mockConfluencePrefetchedData()),
  },
}));
jest.doMock('../../AbTestProvider', () => ({
  ABTestProvider: ({ children }: any) => children(DEFAULT_AB_TEST),
}));
