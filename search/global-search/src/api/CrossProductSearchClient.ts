import {
  Result,
  PersonResult,
  ResultType,
  AnalyticsType,
  ContentType,
  Results,
  PeopleResults,
  ConfluenceObjectResults,
} from '../model/Result';
import { mapJiraItemToResult } from './JiraItemMapper';
import { mapConfluenceItemToResult } from './ConfluenceItemMapper';
import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';
import {
  Scope,
  ConfluenceItem,
  JiraItem,
  PersonItem,
  QuickSearchContext,
  UrsPersonItem,
  NavScopeResultItem,
} from './types';
import { ModelParam } from '../util/model-parameters';
import { GlobalSearchPrefetchedResults } from './prefetchResults';

export const DEFAULT_AB_TEST: ABTest = Object.freeze({
  experimentId: 'default',
  abTestId: 'default',
  controlId: 'default',
});

const QUICKSEARCH_API_URL = 'quicksearch/v1';

type PeopleScopes = Scope.People | Scope.UserConfluence | Scope.UserJira;
type ConfluenceObjectScopes =
  | Scope.ConfluencePageBlogAttachment
  | Scope.ConfluencePageBlog;
type ConfluenceContainerResults = Scope.ConfluenceSpace;

/**
 * Eventually we want all the scopes to be typed in some way
 */
export type TypePeopleResults = {
  [S in PeopleScopes]: PeopleResults | undefined;
};

export type TypeConfluenceObjectResults = {
  [S in ConfluenceObjectScopes]: ConfluenceObjectResults | undefined;
};

export type TypeConfluenceContainerResults = {
  [S in ConfluenceContainerResults]: Results | undefined;
};

/**
 * Temporary type as we start typing all our results
 */
export type GenericResults = {
  [S in Exclude<Scope, PeopleScopes>]: Results | undefined;
};

/**
 * Note that this type ONLY provides types when retrieving objects given a key.
 * It does NOT have much type safety when it comes to assigning the values to a key.
 *
 * e.g.
 * typeof results[Scope.People] == PeopleResults (i.e provides type safety)
 *
 * but the following will also not throw any typescript warnings.
 *
 * const scope: Scope = Scope.People;
 * results[scope] = new Result()
 */
export type SearchResultsMap = GenericResults &
  TypePeopleResults &
  TypeConfluenceObjectResults &
  TypeConfluenceContainerResults;

export type CrossProductSearchResults = {
  results: SearchResultsMap;
  abTest?: ABTest;
};

export const EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE: CrossProductSearchResults = {
  results: {} as SearchResultsMap,
};

export interface CrossProductSearchResponse {
  scopes: ScopeResult[];
}

export interface CrossProductExperimentResponse {
  scopes: Experiment[];
}

export type SearchItem =
  | ConfluenceItem
  | JiraItem
  | PersonItem
  | UrsPersonItem
  | NavScopeResultItem;

export interface ABTest {
  abTestId: string;
  controlId: string;
  experimentId: string;
}

export interface ScopeResult {
  id: Scope;
  error?: string;
  results: SearchItem[];
  abTest?: ABTest; // in case of an error abTest will be undefined
  size?: number;
}

export interface Experiment {
  id: Scope;
  error?: string;
  abTest: ABTest;
}

export interface PrefetchedData {
  abTest: Promise<ABTest> | undefined;
}

export enum FilterType {
  Spaces = 'spaces',
  Contributors = 'contributors',
}

export interface SpaceFilter {
  '@type': FilterType.Spaces;
  spaceKeys: string[];
}

export interface QueryBasedSpaceFilterMetadata {
  spaceTitle: string;
  spaceAvatar: string;
}

export interface ContributorsFilter {
  '@type': FilterType.Contributors;
  accountIds: string[];
}

export type FilterMetadata = QueryBasedSpaceFilterMetadata;
export type Filter = SpaceFilter | ContributorsFilter;

export interface FilterWithMetadata<T = Filter, W = FilterMetadata> {
  filter: T;
  metadata?: W;
}

export interface SearchParams {
  query: string;
  sessionId: string;
  referrerId: string | undefined;
  scopes: Scope[];
  modelParams: ModelParam[];
  resultLimit?: number;
  filters?: Filter[];
  mapItemToResult?: ItemToResultMapper;
}

export interface RecentParams {
  context: QuickSearchContext;
  modelParams: ModelParam[];
  resultLimit?: number;
  filters?: Filter[];
  mapItemToResult: ItemToResultMapper;
}

export interface SearchPeopleParams {
  query: string;
  sessionId: string;
  referrerId: string | undefined;
  currentQuickSearchContext: QuickSearchContext;
  resultLimit?: number;
}

export interface CrossProductSearchClient {
  search(params: SearchParams): Promise<CrossProductSearchResults>;
  getRecentItems(params: RecentParams): Promise<CrossProductSearchResults>;
  getPeople(params: SearchPeopleParams): Promise<CrossProductSearchResults>;
  getAbTestData(scope: Scope): Promise<ABTest>;
  getAbTestDataForProduct(product: QuickSearchContext): Promise<ABTest>;
  getNavAutocompleteSuggestions(query: string): Promise<string[]>;
}

export type ItemToResultMapper = (scope: Scope, item: SearchItem) => Result;

export default class CachingCrossProductSearchClientImpl
  implements CrossProductSearchClient {
  private serviceConfig: ServiceConfig;
  private cloudId: string;
  private isUserAnonymous: boolean;
  private abTestDataCache: { [scope: string]: Promise<ABTest> };
  private bootstrapPeopleCache: Promise<CrossProductSearchResults> | undefined;
  private crossProductRecentsCache: Promise<SearchResultsMap> | undefined;

  // result limit per scope
  private readonly RESULT_LIMIT = 10;

  constructor(
    url: string,
    cloudId: string,
    isUserAnonymous: boolean,
    prefetchResults: GlobalSearchPrefetchedResults | undefined,
  ) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
    this.isUserAnonymous = isUserAnonymous;
    this.abTestDataCache = prefetchResults ? prefetchResults.abTestPromise : {};
    this.crossProductRecentsCache = prefetchResults
      ? prefetchResults.crossProductRecentItemsPromise
      : undefined;
  }

  public async getNavAutocompleteSuggestions(query: string): Promise<string[]> {
    const path = 'quicksearch/v1';

    const results: CrossProductSearchResponse = await this.makeRequest<
      CrossProductSearchResponse
    >(path, {
      cloudId: this.cloudId,
      scopes: [Scope.NavSearchCompleteConfluence],
      query,
    });

    const matchingScope: ScopeResult | undefined = results.scopes.find(
      scope => scope.id === Scope.NavSearchCompleteConfluence,
    );

    const matchingDocuments = matchingScope ? matchingScope.results : [];

    return matchingDocuments.map(mapItemToNavCompletionString);
  }

  public async getPeople({
    query,
    sessionId,
    referrerId,
    currentQuickSearchContext,
    resultLimit = 3,
  }: SearchPeopleParams): Promise<CrossProductSearchResults> {
    const isBootstrapQuery = !query;

    // We will use the bootstrap people cache if the query is a bootstrap query and there is a result cached
    if (isBootstrapQuery && this.bootstrapPeopleCache) {
      return this.bootstrapPeopleCache;
    }

    const scope: Scope.UserConfluence | Scope.UserJira | null =
      currentQuickSearchContext === 'confluence'
        ? Scope.UserConfluence
        : currentQuickSearchContext === 'jira'
        ? Scope.UserJira
        : null;

    if (scope) {
      const searchPromise = this.search({
        query,
        sessionId,
        referrerId,
        scopes: [scope],
        modelParams: [],
        resultLimit,
      });

      if (isBootstrapQuery) {
        this.bootstrapPeopleCache = searchPromise;
      }

      return searchPromise;
    }

    return {
      results: {} as SearchResultsMap,
    };
  }

  public async search({
    query,
    sessionId,
    referrerId,
    scopes,
    modelParams,
    resultLimit = this.RESULT_LIMIT,
    filters = [],
    mapItemToResult = postQueryMapItemToResult,
  }: SearchParams): Promise<CrossProductSearchResults> {
    const body = {
      query: query,
      cloudId: this.cloudId,
      limit: resultLimit,
      scopes,
      filters: filters,
      searchSession: {
        sessionId,
        referrerId,
      },
      ...(modelParams.length > 0 ? { modelParams } : {}),
    };

    const response = await this.makeRequest<CrossProductSearchResponse>(
      QUICKSEARCH_API_URL,
      body,
    );
    return this.parseResponse(response, mapItemToResult);
  }

  public async getRecentItems({
    context,
    modelParams,
    resultLimit = this.RESULT_LIMIT,
    filters = [],
    mapItemToResult,
  }: RecentParams): Promise<CrossProductSearchResults> {
    if (this.isUserAnonymous) {
      return EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE;
    }

    const scopes = mapContextToScopes(context);

    if (this.crossProductRecentsCache) {
      const recents = await this.crossProductRecentsCache;
      if (areAllScopesInCache(scopes, recents)) {
        return {
          results: recents,
        };
      }
    }

    const body = {
      query: '',
      cloudId: this.cloudId,
      limit: resultLimit,
      scopes,
      filters: filters,
      ...(modelParams.length > 0 ? { modelParams } : {}),
    };

    const response = await this.makeRequest<CrossProductSearchResponse>(
      QUICKSEARCH_API_URL,
      body,
    );
    return this.parseResponse(response, mapItemToResult);
  }

  public async getAbTestDataForProduct(product: QuickSearchContext) {
    let scope: Scope;

    switch (product) {
      case 'confluence':
        scope = Scope.ConfluencePageBlogAttachment;
        break;
      case 'jira':
        scope = Scope.JiraIssue;
        break;
      default:
        throw new Error('Invalid product for abtest');
    }

    return await this.getAbTestData(scope);
  }

  /**
   * @deprecated use {getAbTestDataForProduct} instead. Using manually defined scopes here can
   * break caching behaviour.
   *
   * This will be moved into private scope in the near future.
   */
  public async getAbTestData(scope: Scope): Promise<ABTest> {
    if (this.abTestDataCache[scope]) {
      return this.abTestDataCache[scope];
    }

    const path = 'experiment/v1';
    const body = {
      cloudId: this.cloudId,
      scopes: [scope],
    };

    const response = await this.makeRequest<CrossProductExperimentResponse>(
      path,
      body,
    );

    const scopeWithAbTest: Experiment | undefined = response.scopes.find(
      s => s.id === scope,
    );

    const abTestPromise = scopeWithAbTest
      ? Promise.resolve(scopeWithAbTest.abTest)
      : Promise.resolve(DEFAULT_AB_TEST);

    this.abTestDataCache[scope] = abTestPromise;

    return abTestPromise;
  }

  private async makeRequest<T>(path: string, body: object): Promise<T> {
    const options: RequestServiceOptions = {
      path,
      requestInit: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    };

    return utils.requestService<T>(this.serviceConfig, options);
  }

  /**
   * Converts the raw xpsearch-aggregator response into a CrossProductSearchResults object containing
   * the results set and the experimentId that generated them.
   *
   * @param response
   * @param searchSessionId
   * @returns a CrossProductSearchResults object
   */
  private parseResponse(
    response: CrossProductSearchResponse,
    mapItemToResult: ItemToResultMapper,
  ): CrossProductSearchResults {
    let abTest: ABTest | undefined;
    const results: SearchResultsMap = response.scopes
      .filter(scope => scope.results)
      .reduce((resultsMap, scopeResult) => {
        const items = scopeResult.results.map(result =>
          mapItemToResult(scopeResult.id as Scope, result),
        );

        // mapItemToResult returns a generic result type, technically we can't guarantee that the
        // type returned by `mapItemToResult` can be coerced into the expected type, e.g. there's
        // no guarantee the `Result` can be casted to `ConfluenceObjectResult`. We just make the assumption
        // here for now and suppress the typescript error
        resultsMap[scopeResult.id] = {
          // @ts-ignore
          items,
          totalSize:
            scopeResult.size !== undefined ? scopeResult.size : items.length,
        };

        if (!abTest) {
          abTest = scopeResult.abTest;
        }
        return resultsMap;
      }, {} as SearchResultsMap);

    return { results, abTest };
  }
}

function mapPersonItemToResult(item: PersonItem): PersonResult {
  const mention = item.nickname || item.name;

  return {
    resultType: ResultType.PersonResult,
    resultId: 'people-' + item.account_id,
    name: item.name,
    href: '/people/' + item.account_id,
    avatarUrl: item.picture,
    contentType: ContentType.Person,
    analyticsType: AnalyticsType.ResultPerson,
    mentionName: mention,
    presenceMessage: item.job_title || '',
  };
}

function mapUrsResultItemToResult(item: UrsPersonItem): PersonResult {
  return {
    resultType: ResultType.PersonResult,
    resultId: 'people-' + item.id,
    name: item.name,
    href: '/people/' + item.id,
    avatarUrl: item.avatarUrl,
    contentType: ContentType.Person,
    analyticsType: AnalyticsType.ResultPerson,
    mentionName: item.nickname || '',
    presenceMessage: '',
  };
}

function postQueryMapItemToResult(scope: Scope, item: SearchItem): Result {
  if (scope.startsWith('confluence')) {
    return mapConfluenceItemToResult(scope, item as ConfluenceItem);
  }

  if (scope.startsWith('jira')) {
    return mapJiraItemToResult(AnalyticsType.ResultJira)(item as JiraItem);
  }

  if (scope === Scope.People) {
    return mapPersonItemToResult(item as PersonItem);
  }

  if (scope === Scope.UserConfluence || scope === Scope.UserJira) {
    return mapUrsResultItemToResult(item as UrsPersonItem);
  }

  if (scope === Scope.NavSearchCompleteConfluence) {
    throw new Error(
      'nav.completion-confluence cannot be transformed into a result because it is not a search result',
    );
  }

  throw new Error(`Non-exhaustive match for scope: ${scope}`);
}

function mapItemToNavCompletionString(item: SearchItem): string {
  const completionItem = item as NavScopeResultItem;

  return completionItem.query;
}

function mapContextToScopes(context: QuickSearchContext) {
  if (context === 'jira') {
    return [Scope.JiraIssue, Scope.JiraBoardProjectFilter];
  } else {
    throw new Error(
      `Supplied contet ${context} is not supported for pre-fetching`,
    );
  }
}

function areAllScopesInCache(scopes: Scope[], cache: SearchResultsMap) {
  return scopes.filter(scope => cache[scope] === undefined).length === 0;
}
