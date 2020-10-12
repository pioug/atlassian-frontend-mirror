import {
  AnalyticsType,
  ConfluenceObjectResult,
  ConfluenceRecentsMap,
  Result,
} from '../model/Result';
import configureSearchClients from './configureSearchClients';
import { ConfluenceClient } from './ConfluenceClient';
import {
  ABTest,
  CrossProductSearchClient,
  SearchResultsMap,
  EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE,
} from './CrossProductSearchClient';
import { mapJiraItemToResult } from './JiraItemMapper';
import { JiraItem, Scope } from './types';

interface CommonPrefetchedResults {
  abTestPromise: { [scope: string]: Promise<ABTest> };
  crossProductRecentItemsPromise: Promise<SearchResultsMap>;
}

export interface ConfluencePrefetchedResults extends CommonPrefetchedResults {
  confluenceRecentItemsPromise: Promise<ConfluenceRecentsMap>;
}

export interface JiraPrefetchedResults extends CommonPrefetchedResults {}

export type GlobalSearchPrefetchedResults =
  | ConfluencePrefetchedResults
  | JiraPrefetchedResults;

const prefetchConfluence = async (
  confluenceClient: ConfluenceClient,
): Promise<ConfluenceRecentsMap> => {
  // based on https://github.com/microsoft/TypeScript/issues/34925
  const [objects, spaces] = await Promise.all<
    ConfluenceObjectResult[],
    Result[]
  >([confluenceClient.getRecentItems(), confluenceClient.getRecentSpaces()]);

  return {
    objects: {
      items: objects,
      totalSize: objects.length,
    },
    spaces: {
      items: spaces,
      totalSize: spaces.length,
    },
    people: {
      items: [],
      totalSize: 0,
    },
  };
};

const prefetchJira = async (
  crossProductSearchClient: CrossProductSearchClient,
): Promise<SearchResultsMap> => {
  const { results } = await crossProductSearchClient.getRecentItems({
    context: 'jira',
    modelParams: [],
    resultLimit: 250,
    mapItemToResult: (_: Scope, item) =>
      mapJiraItemToResult(AnalyticsType.RecentJira)(item as JiraItem),
  });

  return results;
};

export const getConfluencePrefetchedData = (
  cloudId: string,
  confluenceUrl?: string,
): ConfluencePrefetchedResults => {
  const config = confluenceUrl
    ? {
        confluenceUrl,
      }
    : {};
  const { confluenceClient, crossProductSearchClient } = configureSearchClients(
    cloudId,
    config,
    false,
  );

  // Pre-call the relevant endpoints to cache the results

  return {
    confluenceRecentItemsPromise: prefetchConfluence(confluenceClient),
    abTestPromise: {
      [Scope.ConfluencePageBlogAttachment]: crossProductSearchClient.getAbTestData(
        Scope.ConfluencePageBlogAttachment,
      ),
    },
    crossProductRecentItemsPromise: Promise.resolve(
      EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE.results,
    ),
  };
};

export const getJiraPrefetchedData = (
  cloudId: string,
  isUserAnonymous: boolean,
  jiraUrl?: string,
): JiraPrefetchedResults => {
  const config = jiraUrl
    ? {
        jiraUrl,
      }
    : {};
  const { crossProductSearchClient } = configureSearchClients(
    cloudId,
    config,
    isUserAnonymous,
  );

  return {
    crossProductRecentItemsPromise: prefetchJira(crossProductSearchClient),
    abTestPromise: {
      [Scope.JiraIssue]: crossProductSearchClient.getAbTestData(
        Scope.JiraIssue,
      ),
    },
  };
};
