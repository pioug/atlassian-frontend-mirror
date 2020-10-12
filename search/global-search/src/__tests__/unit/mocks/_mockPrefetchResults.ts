import { ConfluenceRecentsMap, Result } from '../../../model/Result';
import {
  SearchResultsMap,
  EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE,
} from '../../../api/CrossProductSearchClient';

const confluenceRecentItemsPromise: Promise<ConfluenceRecentsMap> = Promise.resolve(
  {
    objects: {
      items: [],
      totalSize: 0,
    },
    spaces: {
      items: [],
      totalSize: 0,
    },
    people: {
      items: [],
      totalSize: 0,
    },
  },
);

const crossProductRecentItemsPromise: Promise<SearchResultsMap> = Promise.resolve(
  {
    ...EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE.results,
    'jira.issue': {
      items: [],
      totalSize: 0,
    },
    'jira.board,project,filter': {
      items: [],
      totalSize: 0,
    },
  } as SearchResultsMap,
);

const abTestPromise: Promise<Result[]> = Promise.resolve([]);

export const mockConfluencePrefetchedData = jest.fn(() => {
  return {
    confluenceRecentItemsPromise,
    abTestPromise,
  };
});

export const mockJiraPrefetchedData = jest.fn(() => {
  return {
    crossProductRecentItemsPromise,
    abTestPromise,
  };
});
