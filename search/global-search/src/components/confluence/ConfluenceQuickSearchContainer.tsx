import React from 'react';
import {
  injectIntl,
  InjectedIntlProps,
  FormattedHTMLMessage,
} from 'react-intl';
// @ts-ignore
import { withAnalytics, FireAnalyticsEvent } from '@atlaskit/analytics';
import { CancelableEvent } from '@atlaskit/quick-search';
import { ConfluenceClient } from '../../api/ConfluenceClient';
import {
  CrossProductSearchClient,
  CrossProductSearchResults,
  Filter,
  FilterType,
  SpaceFilter,
  FilterWithMetadata,
  QueryBasedSpaceFilterMetadata,
} from '../../api/CrossProductSearchClient';
import { Scope, ConfluenceModelContext } from '../../api/types';
import {
  Result,
  ResultsWithTiming,
  ConfluenceResultsMap,
  PersonResult,
  ConfluenceObjectResult,
} from '../../model/Result';
import { PeopleSearchClient } from '../../api/PeopleSearchClient';
import { SearchScreenCounter } from '../../util/ScreenCounter';
import {
  LinkComponent,
  ReferralContextIdentifiers,
  Logger,
} from '../GlobalQuickSearchWrapper';
import {
  ConfluenceAdvancedSearchTypes,
  redirectToConfluenceAdvancedSearch,
  handlePromiseError,
  ADVANCED_CONFLUENCE_SEARCH_RESULT_ID,
} from '../SearchResultsUtil';
import { CreateAnalyticsEventFn } from '../analytics/types';
import performanceNow from '../../util/performance-now';
import {
  BaseConfluenceQuickSearchContainer,
  SearchResultProps,
  PartiallyLoadedRecentItems,
} from '../common/QuickSearchContainer';
import { messages } from '../../messages';
import NoResultsState from './NoResultsState';
import SearchResultsComponent, {
  FilterComponentProps,
} from '../common/SearchResults';
import { getConfluenceAdvancedSearchLink } from '../SearchResultsUtil';
import AdvancedSearchGroup from './AdvancedSearchGroup';
import {
  mapRecentResultsToUIGroups,
  mapSearchResultsToUIGroups,
  MAX_RECENT_RESULTS_TO_SHOW,
} from './ConfluenceSearchResultsMapper';
import { CONF_MAX_DISPLAYED_RESULTS } from '../../util/experiment-utils';
import { AutocompleteClient } from '../../api/AutocompleteClient';
import { appendListWithoutDuplication } from '../../util/search-results-utils';
import { buildConfluenceModelParams } from '../../util/model-parameters';
import ConfluenceFilterGroup from './ConfluenceFilterGroup';
import NoResultsInFilterState from './NoResultsInFilterState';
import some from 'lodash/some';
import { injectFeatures } from '../FeaturesProvider';
import { ConfluenceFeatures } from '../../util/features';

/**
 * NOTE: This component is only consumed internally as such avoid using optional props
 * i.e. instead of "propX?: something" use "propX: something | undefined"
 *
 * This improves type safety and prevent us from accidentally forgetting a parameter.
 */
export interface Props {
  crossProductSearchClient: CrossProductSearchClient;
  peopleSearchClient: PeopleSearchClient;
  confluenceClient: ConfluenceClient;
  autocompleteClient: AutocompleteClient;
  linkComponent: LinkComponent | undefined;
  referralContextIdentifiers: ReferralContextIdentifiers | undefined;
  logger: Logger;
  modelContext: ConfluenceModelContext | undefined;
  onAdvancedSearch:
    | undefined
    | ((
        e: CancelableEvent,
        entity: string,
        query: string,
        searchSessionId: string,
        spaces?: string[],
      ) => void);
  inputControls: JSX.Element | undefined;
  features: ConfluenceFeatures;

  // These are provided by the withAnalytics HOC
  firePrivateAnalyticsEvent?: any;
  createAnalyticsEvent?: CreateAnalyticsEventFn;
  confluenceUrl: string;
}

const getRecentItemMatches = (
  query: string,
  recentItems: ConfluenceResultsMap | null,
): ConfluenceObjectResult[] => {
  if (!recentItems) {
    return [];
  }

  return recentItems.objects.items
    .filter(result => {
      return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
    })
    .slice(0, MAX_RECENT_RESULTS_TO_SHOW);
};

const mergeSearchResultsWithRecentItems = (
  searchResults: ConfluenceResultsMap,
  recentItems: ConfluenceObjectResult[],
): ConfluenceResultsMap => {
  const defaultSearchResults: ConfluenceResultsMap = {
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
  };

  const results = { ...defaultSearchResults, ...searchResults };

  return {
    objects: {
      items: appendListWithoutDuplication(recentItems, results.objects.items),
      // We don't add the 3 extra results to the total.
      // The rationale here is that the server results will eventually contain the 3 recent items
      // so the total here already includes the recent items.
      // In the case where we don't know the number from the server, we also can't show more so
      // this numeber should just be the size of the current list.
      totalSize: results.objects.totalSize,
      numberOfCurrentItems: results.objects.numberOfCurrentItems,
    },
    spaces: results.spaces,
    people: results.people,
  };
};

const LOGGER_NAME = 'AK.GlobalSearch.ConfluenceQuickSearchContainer';
const CCS_AUTOCOMPLETE = 'ccsearch-autocomplete';
/**
 * Container Component that handles the data fetching when the user interacts with Search.
 */
export class ConfluenceQuickSearchContainer extends React.Component<
  Props & InjectedIntlProps
> {
  screenCounters = {
    preQueryScreenCounter: new SearchScreenCounter(),
    postQueryScreenCounter: new SearchScreenCounter(),
  };

  handleSearchSubmit = (
    event: React.KeyboardEvent<HTMLInputElement>,
    searchSessionId: string,
  ) => {
    const { onAdvancedSearch = () => {} } = this.props;
    const target = event.target as HTMLInputElement;
    const query = target.value;
    let defaultPrevented = false;

    onAdvancedSearch(
      Object.assign({}, event, {
        preventDefault() {
          defaultPrevented = true;
          event.preventDefault();
          event.stopPropagation();
        },
        stopPropagation() {},
      }),
      ConfluenceAdvancedSearchTypes.Content,
      query,
      searchSessionId,
    );

    if (!defaultPrevented) {
      redirectToConfluenceAdvancedSearch(query);
    }
  };

  async searchCrossProductConfluence(
    query: string,
    sessionId: string,
    queryVersion: number,
    filters: Filter[],
  ): Promise<CrossProductSearchResults> {
    const {
      crossProductSearchClient,
      modelContext,
      referralContextIdentifiers,
    } = this.props;

    let scopes = [Scope.ConfluencePageBlogAttachment];

    if (!some(filters, (filter: Filter) => filter['@type'] === 'spaces')) {
      scopes = scopes.concat([Scope.ConfluenceSpace, Scope.People]);
    }

    const modelParams = buildConfluenceModelParams(
      queryVersion,
      modelContext || {},
    );

    const referrerId =
      referralContextIdentifiers && referralContextIdentifiers.searchReferrerId;

    const results = await crossProductSearchClient.search({
      query,
      sessionId,
      referrerId,
      scopes,
      modelParams,
      resultLimit: CONF_MAX_DISPLAYED_RESULTS,
      filters,
    });

    return results;
  }

  // TODO extract
  handleSearchErrorAnalytics(error: Error, source: string): void {
    const { firePrivateAnalyticsEvent } = this.props;
    if (firePrivateAnalyticsEvent) {
      try {
        firePrivateAnalyticsEvent(
          'atlassian.fabric.global-search.search-error',
          {
            name: error.name,
            message: error.message,
            source: source,
          },
        );
      } catch (e) {
        this.props.logger.safeError(
          LOGGER_NAME,
          'Can not fire event atlassian.fabric.global-search.search-error',
          e,
        );
      }
    }
  }

  handleSearchErrorAnalyticsThunk = (
    source: string,
  ): ((reason: any) => void) => error => {
    this.handleSearchErrorAnalytics(error, source);
    this.props.logger.safeError(
      LOGGER_NAME,
      `error in promise ${source}`,
      error,
    );
  };

  getSearchResults = (
    query: string,
    sessionId: string,
    startTime: number,
    queryVersion: number,
    filters: Filter[],
  ): Promise<ResultsWithTiming<ConfluenceResultsMap>> => {
    const confXpSearchPromise = this.searchCrossProductConfluence(
      query,
      sessionId,
      queryVersion,
      filters,
    );

    confXpSearchPromise.catch(
      this.handleSearchErrorAnalyticsThunk('xpsearch-confluence'),
    );

    const mapPromiseToPerformanceTime = (p: Promise<any>) =>
      p.then(() => performanceNow() - startTime);

    return Promise.all<CrossProductSearchResults, number>([
      confXpSearchPromise,
      mapPromiseToPerformanceTime(confXpSearchPromise),
    ]).then(([xpsearchResults, confSearchElapsedMs]) => {
      const spaces = xpsearchResults.results[Scope.ConfluenceSpace];
      const objects =
        xpsearchResults.results[Scope.ConfluencePageBlogAttachment];
      const people = xpsearchResults.results[Scope.People];

      return {
        results: {
          objects: {
            items: objects ? objects.items : [],
            totalSize: objects ? objects.totalSize : 0,
          },
          spaces: {
            items: spaces ? spaces.items : [],
            totalSize: spaces ? spaces.totalSize : 0,
          },
          people: {
            items: people ? people.items : [],
            totalSize: people ? people.totalSize : 0,
          },
        },
        timings: {
          confSearchElapsedMs,
        },
      };
    });
  };

  getRecentPeople = (sessionId: string): Promise<PersonResult[]> => {
    const {
      peopleSearchClient,
      crossProductSearchClient,
      features,
      referralContextIdentifiers,
    } = this.props;

    const referrerId =
      referralContextIdentifiers && referralContextIdentifiers.searchReferrerId;

    // We want to be consistent with the search results when prefetching is enabled so we will use URS (via aggregator) to get the
    // bootstrapped people results, see prefetchResults.ts.
    return !features.useUrsForBootstrapping
      ? peopleSearchClient.getRecentPeople()
      : crossProductSearchClient
          .getPeople({
            query: '',
            sessionId,
            referrerId,
            currentQuickSearchContext: 'confluence',
            resultLimit: 3,
          })
          .then(xProductResult => {
            const recentPeople = xProductResult.results[Scope.UserConfluence];
            return recentPeople ? recentPeople.items : [];
          });
  };

  getRecentItems = (
    sessionId: string,
  ): PartiallyLoadedRecentItems<ConfluenceResultsMap> => {
    const { confluenceClient } = this.props;

    const recentActivityPromisesMap = {
      'recent-confluence-items': confluenceClient.getRecentItems(),
      'recent-confluence-spaces': confluenceClient.getRecentSpaces(),
    };

    const recentActivityPromises: Promise<Result[]>[] = (Object.keys(
      recentActivityPromisesMap,
    ) as Array<keyof typeof recentActivityPromisesMap>).map(key =>
      handlePromiseError(
        recentActivityPromisesMap[key],
        [],
        this.handleSearchErrorAnalyticsThunk(key),
      ),
    );

    // NOTE:
    // We lose type safety here as typescript assumes there's no guarantee the order in which a map
    // gets converted into promises. Also there is currently no way (and no way in the forseeable future)
    // to get typescript to convert union types into tuple types (https://github.com/Microsoft/TypeScript/issues/13298)
    const required = Promise.all(recentActivityPromises).then(
      ([recentlyViewedPages, recentlyViewedSpaces]) => {
        return {
          results: {
            objects: {
              items: recentlyViewedPages as ConfluenceObjectResult[],
              totalSize: recentlyViewedPages.length,
            },
            spaces: {
              items: recentlyViewedSpaces as Result[],
              totalSize: recentlyViewedSpaces.length,
            },
            people: {
              items: [],
              totalSize: 0,
            },
          },
        };
      },
    );

    return {
      eagerRecentItemsPromise: required,
      lazyLoadedRecentItemsPromise: this.getRecentPeople(sessionId).then(
        recentPeople => ({
          people: {
            items: recentPeople,
            totalSize: recentPeople.length,
          },
        }),
      ),
    };
  };

  getAutocompleteSuggestions = (query: string): Promise<string[]> => {
    const { autocompleteClient, features } = this.props;

    if (features.isNavAutocompleteEnabled) {
      const { crossProductSearchClient } = this.props;

      const navAutocompletePromise = handlePromiseError(
        crossProductSearchClient.getNavAutocompleteSuggestions(query),
        [query],
        this.handleSearchErrorAnalyticsThunk(CCS_AUTOCOMPLETE),
      );

      return navAutocompletePromise;
    } else if (features.isAutocompleteEnabled) {
      const autocompletePromise = handlePromiseError(
        autocompleteClient.getAutocompleteSuggestions(query),
        [query],
        this.handleSearchErrorAnalyticsThunk(CCS_AUTOCOMPLETE),
      );

      return autocompletePromise;
    }

    return Promise.resolve([]);
  };

  getPreQueryDisplayedResults = (
    recentItems: ConfluenceResultsMap | null,
    searchSessionId: string,
  ) => {
    const { features } = this.props;
    return mapRecentResultsToUIGroups(recentItems, features, searchSessionId);
  };

  getPostQueryDisplayedResults = (
    searchResults: ConfluenceResultsMap | null,
    latestSearchQuery: string,
    recentItems: ConfluenceResultsMap | null,
    isLoading: boolean,
    searchSessionId: string,
  ) => {
    const { features } = this.props;
    const currentSearchResults: ConfluenceResultsMap =
      isLoading || !searchResults
        ? ({} as ConfluenceResultsMap)
        : searchResults;

    const recentResults = getRecentItemMatches(latestSearchQuery, recentItems);

    const mergedRecentSearchResults = mergeSearchResultsWithRecentItems(
      currentSearchResults,
      recentResults,
    );

    return mapSearchResultsToUIGroups(
      mergedRecentSearchResults,
      features,
      searchSessionId,
      isLoading, // Hide the lozenge for the faster search screen
    );
  };

  getNoResultsStateComponent = (
    latestSearchQuery: string,
    searchSessionId: string,
    currentFilters: FilterWithMetadata[],
    onFilterChanged: (filter: FilterWithMetadata[]) => void,
  ) => {
    const {
      onAdvancedSearch = () => {},
      referralContextIdentifiers,
    } = this.props;
    const filtersAreApplied = currentFilters.length > 0;
    if (
      filtersAreApplied &&
      referralContextIdentifiers &&
      referralContextIdentifiers.currentContainerName
    ) {
      return (
        <NoResultsInFilterState
          spaceTitle={referralContextIdentifiers.currentContainerName}
          query={latestSearchQuery}
          onClickAdvancedSearch={(event, entity) =>
            onAdvancedSearch(event, entity, latestSearchQuery, searchSessionId)
          }
          onClearFilters={() => {
            onFilterChanged([]);
          }}
        />
      );
    }

    return (
      <NoResultsState
        query={latestSearchQuery}
        onClick={(event, entity) =>
          onAdvancedSearch(event, entity, latestSearchQuery, searchSessionId)
        }
      />
    );
  };

  getFilterComponent = (searchResults: ConfluenceResultsMap | null) => ({
    latestSearchQuery,
    searchResultsTotalSize,
    isLoading,
    searchSessionId,
    currentFilters,
    onFilterChanged,
  }: FilterComponentProps) => {
    const { onAdvancedSearch = () => {}, features } = this.props;

    if (!features.spaceballsExperimentEnabled || searchResults === null) {
      return;
    }

    // only show filter post-query
    if (!latestSearchQuery) {
      return;
    }
    // don't show space filter if there are no results in all spaces
    if (currentFilters.length === 0 && searchResultsTotalSize === 0) {
      return;
    }

    const filterObject = this.createQueryBasedSpaceFilter(
      currentFilters,
      searchResults,
    );

    if (
      filterObject &&
      filterObject.filter.spaceKeys[0] &&
      filterObject.metadata
    ) {
      const { filter } = filterObject;
      const spaces = filter ? filter.spaceKeys : [];
      return (
        <ConfluenceFilterGroup
          onFilterChanged={onFilterChanged}
          isDisabled={isLoading}
          spaceTitle={filterObject.metadata.spaceTitle}
          spaceAvatar={filterObject.metadata.spaceAvatar}
          spaceKey={filter.spaceKeys[0]}
          isFilterOn={currentFilters.length !== 0}
          searchSessionId={searchSessionId}
          onAdvancedSearch={(event: CancelableEvent) =>
            onAdvancedSearch(
              event,
              ConfluenceAdvancedSearchTypes.Content,
              latestSearchQuery,
              searchSessionId,
              spaces,
            )
          }
        />
      );
    }
  };

  createQueryBasedSpaceFilter = (
    currentFilters: FilterWithMetadata[],
    searchResults: ConfluenceResultsMap,
  ) => {
    function instanceOfSpaceFilter(
      filter: FilterWithMetadata,
    ): filter is FilterWithMetadata<
      SpaceFilter,
      QueryBasedSpaceFilterMetadata
    > {
      return filter.filter['@type'] === FilterType.Spaces;
    }

    function createSpaceFilter({
      spaces,
    }: ConfluenceResultsMap):
      | FilterWithMetadata<SpaceFilter, QueryBasedSpaceFilterMetadata>
      | undefined {
      const space = spaces.items[0];

      return space && space.key && space.avatarUrl
        ? {
            filter: {
              '@type': FilterType.Spaces,
              spaceKeys: [space.key],
            },
            metadata: {
              spaceAvatar: space.avatarUrl,
              spaceTitle: space.name,
            },
          }
        : undefined;
    }

    const existingSpaceFilter = currentFilters.find(instanceOfSpaceFilter);

    if (existingSpaceFilter) {
      return existingSpaceFilter;
    }

    return createSpaceFilter(searchResults);
  };

  getSearchResultsComponent = ({
    retrySearch,
    latestSearchQuery,
    isError,
    searchResults,
    isLoading,
    recentItems,
    searchSessionId,
    searchMore,
    currentFilters,
    onFilterChanged,
  }: SearchResultProps<ConfluenceResultsMap>) => {
    const { onAdvancedSearch = () => {} } = this.props;
    const onSearchMoreAdvancedSearchClicked = (event: CancelableEvent) => {
      onAdvancedSearch(
        event,
        ConfluenceAdvancedSearchTypes.Content,
        latestSearchQuery,
        searchSessionId,
      );
    };

    return (
      <SearchResultsComponent
        query={latestSearchQuery}
        isPreQuery={!latestSearchQuery}
        isError={isError}
        onFilterChanged={onFilterChanged}
        getFilterComponent={this.getFilterComponent(searchResults)}
        isLoading={isLoading}
        retrySearch={retrySearch}
        searchMore={searchMore}
        currentFilters={currentFilters}
        onSearchMoreAdvancedSearchClicked={onSearchMoreAdvancedSearchClicked}
        keepPreQueryState={false}
        searchSessionId={searchSessionId}
        {...this.screenCounters}
        referralContextIdentifiers={this.props.referralContextIdentifiers}
        renderNoRecentActivity={() => (
          <FormattedHTMLMessage
            {...messages.no_recent_activity_body}
            values={{ url: getConfluenceAdvancedSearchLink() }}
          />
        )}
        renderAdvancedSearchGroup={(analyticsData?) => (
          <AdvancedSearchGroup
            key="advanced"
            query={latestSearchQuery}
            analyticsData={analyticsData}
            onClick={(event, entity) =>
              onAdvancedSearch(
                event,
                entity,
                latestSearchQuery,
                searchSessionId,
              )
            }
          />
        )}
        getPreQueryGroups={() =>
          this.getPreQueryDisplayedResults(recentItems, searchSessionId)
        }
        getPostQueryGroups={() =>
          this.getPostQueryDisplayedResults(
            searchResults,
            latestSearchQuery,
            recentItems,
            isLoading,
            searchSessionId,
          )
        }
        renderNoResult={() =>
          this.getNoResultsStateComponent(
            latestSearchQuery,
            searchSessionId,
            currentFilters,
            onFilterChanged,
          )
        }
      />
    );
  };

  render() {
    const { linkComponent, logger, inputControls, features } = this.props;
    const { isAutocompleteEnabled } = features;
    const { isNavAutocompleteEnabled } = features;

    return (
      <BaseConfluenceQuickSearchContainer
        placeholder={this.props.intl.formatMessage(
          messages.confluence_search_placeholder,
        )}
        linkComponent={linkComponent}
        getSearchResultsComponent={this.getSearchResultsComponent}
        referralContextIdentifiers={this.props.referralContextIdentifiers}
        getRecentItems={this.getRecentItems}
        getSearchResults={this.getSearchResults}
        getAutocompleteSuggestions={
          isAutocompleteEnabled || isNavAutocompleteEnabled
            ? this.getAutocompleteSuggestions
            : undefined
        }
        product="confluence"
        handleSearchSubmit={this.handleSearchSubmit}
        getPreQueryDisplayedResults={this.getPreQueryDisplayedResults}
        getPostQueryDisplayedResults={this.getPostQueryDisplayedResults}
        logger={logger}
        inputControls={inputControls}
        features={features}
        advancedSearchId={ADVANCED_CONFLUENCE_SEARCH_RESULT_ID}
      />
    );
  }
}

export default injectFeatures(
  injectIntl<Props>(withAnalytics(ConfluenceQuickSearchContainer, {}, {})),
);
