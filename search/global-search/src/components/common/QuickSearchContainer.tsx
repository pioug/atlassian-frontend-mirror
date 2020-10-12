import React from 'react';
import {
  LinkComponent,
  Logger,
  ReferralContextIdentifiers,
} from '../GlobalQuickSearchWrapper';
import GlobalQuickSearch from '../GlobalQuickSearch';
import performanceNow from '../../util/performance-now';
import {
  ResultsWithTiming,
  Result,
  ResultsGroup,
  ConfluenceResultsMap,
  Results,
  JiraResultsMap,
} from '../../model/Result';
import {
  ShownAnalyticsAttributes,
  buildShownEventDetails,
  PerformanceTiming,
} from '../../util/analytics-util';
import {
  firePreQueryShownEvent,
  firePostQueryShownEvent,
  fireExperimentExposureEvent,
} from '../../util/analytics-event-helper';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import deepEqual from 'deep-equal';
import {
  JiraFeatures,
  ConfluenceFeatures,
  CommonFeatures,
} from '../../util/features';
import { Scope, QuickSearchContext } from '../../api/types';
import { CONF_OBJECTS_ITEMS_PER_PAGE } from '../../util/experiment-utils';
import { Filter, FilterWithMetadata } from '../../api/CrossProductSearchClient';
import {
  injectSearchSession,
  SearchSessionProps,
} from '../SearchSessionProvider';

const resultMapToArray = (results: ResultsGroup[]): Result[][] =>
  results.map(result => result.items);

export interface SearchResultProps<T> extends State<T> {
  retrySearch: () => void;
  searchMore: (scope: Scope) => void;
  searchSessionId: string;
  onFilterChanged(filter: FilterWithMetadata[]): void;
}

export interface PartiallyLoadedRecentItems<
  T extends ConfluenceResultsMap | JiraResultsMap
> {
  // Represents recent items that should be present before any UI is shown
  eagerRecentItemsPromise: Promise<ResultsWithTiming<T>>;
  // Represents items which can load in after initial UI is shown
  lazyLoadedRecentItemsPromise: Promise<Partial<T>>;
}

export interface Props<T extends ConfluenceResultsMap | JiraResultsMap>
  extends WithAnalyticsEventsProps {
  logger: Logger;
  linkComponent?: LinkComponent;
  product: QuickSearchContext;
  getSearchResultsComponent(state: SearchResultProps<T>): React.ReactNode;
  getRecentItems(sessionId: string): PartiallyLoadedRecentItems<T>;
  getSearchResults(
    query: string,
    sessionId: string,
    startTime: number,
    queryVersion: number,
    filters: Filter[],
  ): Promise<ResultsWithTiming<T>>;
  getAutocompleteSuggestions?(query: string): Promise<string[]>;
  getNavAutocompleteSuggestions?(query: string): Promise<string[]>;
  referralContextIdentifiers?: ReferralContextIdentifiers;

  /**
   * return displayed groups for pre query searches
   * Used by analytics to tell how many ui groups are displayed for user
   * for example in jira we pass (issues, boards, filters and projects but we display only 2 groups issues and others combined)
   * @param results
   */

  getPreQueryDisplayedResults(
    results: T | null,
    searchSessionId: string,
  ): ResultsGroup[];
  /**
   * return displayed groups for post query searches
   * Used by analytics to tell how many ui groups are displayed for user
   * for example in jira we pass (issues, boards, filters and projects but we display only 2 groups issues and others combined)
   * @param results
   */
  getPostQueryDisplayedResults(
    searchResults: T | null,
    latestSearchQuery: string,
    recentItems: T | null,
    isLoading: boolean,
    searchSessionId: string,
  ): ResultsGroup[];

  handleSearchSubmit?(
    event: React.KeyboardEvent<HTMLInputElement>,
    searchSessionId: string,
  ): void;
  placeholder?: string;
  selectedResultId?: string;
  onSelectedResultIdChanged?: (id: string | null | number) => void;
  enablePreQueryFromAggregator?: boolean;
  inputControls?: JSX.Element;
  features: JiraFeatures | ConfluenceFeatures | CommonFeatures;
  advancedSearchId: string;
}

type CompleteProps<T extends ConfluenceResultsMap | JiraResultsMap> = Props<T> &
  SearchSessionProps &
  WithAnalyticsEventsProps;

export interface State<T> {
  latestSearchQuery: string;
  isLoading: boolean;
  isError: boolean;
  keepPreQueryState: boolean;
  searchResults: T | null;
  recentItems: T | null;
  autocompleteSuggestions?: string[];
  currentFilters: FilterWithMetadata[];
}

const LOGGER_NAME = 'AK.GlobalSearch.QuickSearchContainer';
/**
 * Container/Stateful Component that handles the data fetching and state handling when the user interacts with Search.
 */
export class QuickSearchContainer<
  T extends ConfluenceResultsMap | JiraResultsMap
> extends React.Component<CompleteProps<T>, State<T>> {
  // used to terminate if component is unmounted while waiting for a promise
  unmounted: boolean = false;
  latestQueryVersion: number = 0;

  constructor(props: CompleteProps<T>) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      latestSearchQuery: '',
      recentItems: null,
      searchResults: null,
      keepPreQueryState: true,
      currentFilters: [],
    };
  }

  shouldComponentUpdate(nextProps: CompleteProps<T>, nextState: State<T>) {
    return (
      !deepEqual(nextProps, this.props) || !deepEqual(nextState, this.state)
    );
  }

  componentDidCatch(error: any, info: any) {
    this.props.logger.safeError(LOGGER_NAME, 'component did catch an error', {
      error,
      info,
      safeState: {
        searchSessionId: this.props.searchSessionId,
        latestSearchQuery: !!this.state.latestSearchQuery,
        isLoading: this.state.isLoading,
        isError: this.state.isError,
        keepPreQueryState: this.state.keepPreQueryState,
        recentItems: !!this.state.recentItems,
        searchResults: !!this.state.searchResults,
      },
    });

    this.setState({
      isError: true,
    });
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  doSearch = async (
    query: string,
    queryVersion: number,
    filters: FilterWithMetadata[],
  ) => {
    const startTime: number = performanceNow();
    this.latestQueryVersion = queryVersion;

    try {
      const { results, timings } = await this.props.getSearchResults(
        query,
        this.props.searchSessionId,
        startTime,
        queryVersion,
        filters.map(({ filter }) => filter),
      );

      if (this.unmounted) {
        return;
      }

      const elapsedMs = performanceNow() - startTime;
      if (this.state.latestSearchQuery === query) {
        this.setState(
          {
            searchResults: results,
            isError: false,
            isLoading: false,
            keepPreQueryState: false,
          },
          () => {
            this.fireShownPostQueryEvent(
              startTime,
              elapsedMs,
              this.state.searchResults || ({} as any), // Remove 'any' as part of QS-740
              this.state.recentItems || ({} as any), // Remove 'any' as part of QS-740
              timings || {},
              this.props.searchSessionId,
              this.state.latestSearchQuery,
              this.state.currentFilters.map(({ filter }) => filter) || [],
              this.state.isLoading,
            );
          },
        );
      }
    } catch (e) {
      this.props.logger.safeError(
        LOGGER_NAME,
        'error while getting search results',
        e,
      );
      this.setState({
        isError: true,
        isLoading: false,
        keepPreQueryState: false,
      });
    }
  };

  fireExperimentExposureEvent = () => {
    const { createAnalyticsEvent, features, searchSessionId } = this.props;

    if (createAnalyticsEvent) {
      fireExperimentExposureEvent(
        features.abTest,
        searchSessionId,
        createAnalyticsEvent,
      );
    }
  };

  fireShownPreQueryEvent = (
    requestStartTime?: number,
    renderStartTime?: number,
  ) => {
    const { searchSessionId } = this.props;
    const { recentItems } = this.state;

    const {
      createAnalyticsEvent,
      getPreQueryDisplayedResults,
      enablePreQueryFromAggregator,
      referralContextIdentifiers,
      features,
    } = this.props;
    if (createAnalyticsEvent && getPreQueryDisplayedResults) {
      const elapsedMs: number = requestStartTime
        ? performanceNow() - requestStartTime
        : 0;

      const renderTime: number = renderStartTime
        ? performanceNow() - renderStartTime
        : 0;

      const resultsArray: Result[][] = resultMapToArray(
        getPreQueryDisplayedResults(recentItems, searchSessionId),
      );
      const eventAttributes: ShownAnalyticsAttributes = {
        ...buildShownEventDetails(...resultsArray),
      };

      firePreQueryShownEvent(
        eventAttributes,
        elapsedMs,
        renderTime,
        searchSessionId,
        createAnalyticsEvent,
        features.abTest,
        referralContextIdentifiers,
        !!enablePreQueryFromAggregator,
      );
    }
  };

  fireShownPostQueryEvent = (
    startTime: number,
    elapsedMs: number,
    searchResults: T,
    recentItems: T,
    timings: Record<string, number | React.ReactText>,
    searchSessionId: string,
    latestSearchQuery: string,
    latestFilters: Filter[],
    isLoading: boolean,
  ) => {
    const { features } = this.props;
    const performanceTiming: PerformanceTiming = {
      startTime,
      elapsedMs,
      ...timings,
    };
    const {
      createAnalyticsEvent,
      getPostQueryDisplayedResults,
      referralContextIdentifiers,
    } = this.props;

    const filtersApplied: { [filterType: string]: boolean } = {};
    for (const filter of latestFilters) {
      filtersApplied[filter['@type']] = true;
    }

    if (createAnalyticsEvent && getPostQueryDisplayedResults) {
      const resultsArray: Result[][] = resultMapToArray(
        getPostQueryDisplayedResults(
          searchResults,
          latestSearchQuery,
          recentItems,
          isLoading,
          searchSessionId,
        ),
      );
      const resultsDetails: ShownAnalyticsAttributes = buildShownEventDetails(
        ...resultsArray,
      );
      firePostQueryShownEvent(
        resultsDetails,
        performanceTiming,
        searchSessionId,
        latestSearchQuery,
        filtersApplied,
        createAnalyticsEvent,
        features.abTest,
        referralContextIdentifiers,
      );
    }
  };

  handleSearch = (
    newLatestSearchQuery: string,
    queryVersion: number,
    filters: FilterWithMetadata[],
  ) => {
    if (
      this.state.latestSearchQuery !== newLatestSearchQuery ||
      filters !== this.state.currentFilters
    ) {
      this.setState({
        latestSearchQuery: newLatestSearchQuery,
        currentFilters: filters,
        isLoading: true,
      });
    }

    if (newLatestSearchQuery.length === 0) {
      // reset search results so that internal state between query and results stays consistent
      this.setState(
        {
          isError: false,
          isLoading: false,
          keepPreQueryState: true,
          currentFilters: [],
        },
        () => {
          this.fireShownPreQueryEvent();
        },
      );
    } else {
      this.doSearch(newLatestSearchQuery, queryVersion, filters);
    }
  };

  retrySearch = () => {
    this.handleSearch(
      this.state.latestSearchQuery,
      this.latestQueryVersion,
      this.state.currentFilters,
    );
  };

  async componentDidMount() {
    const startTime = performanceNow();

    this.fireExperimentExposureEvent();

    try {
      const {
        eagerRecentItemsPromise,
        lazyLoadedRecentItemsPromise,
      } = this.props.getRecentItems(this.props.searchSessionId);

      const { results } = await eagerRecentItemsPromise;

      const renderStartTime = performanceNow();
      if (this.unmounted) {
        return;
      }
      this.setState({
        recentItems: results,
        isLoading: false,
      });

      lazyLoadedRecentItemsPromise.then(lazyLoadedRecentItems => {
        this.setState(
          {
            recentItems: Object.assign({}, results, lazyLoadedRecentItems),
          },
          async () => {
            this.fireShownPreQueryEvent(startTime, renderStartTime);
          },
        );
      });
    } catch (e) {
      this.props.logger.safeError(
        LOGGER_NAME,
        'error while getting recent items',
        e,
      );
      if (this.state.isLoading) {
        this.setState({
          isLoading: false,
        });
      }
    }
  }

  handleAutocomplete = async (query: string) => {
    const { getAutocompleteSuggestions } = this.props;

    if (!getAutocompleteSuggestions) {
      return;
    }

    try {
      const results = await getAutocompleteSuggestions(query);

      if (this.unmounted) {
        return;
      }

      this.setState({
        autocompleteSuggestions: results,
      });
    } catch (e) {
      this.props.logger.safeError(
        LOGGER_NAME,
        'error while getting autocompletion',
        e,
      );
    }
  };

  getMoreSearchResults = async (scope: Scope) => {
    const { product } = this.props;
    if (product === 'confluence') {
      try {
        // This is a hack, we assume product = confluence means that this cast is safe. When GenericResultsMap is gone
        // we probably won't need this cast anymore.
        const currentResultsByScope = this.state
          .searchResults as ConfluenceResultsMap;

        // @ts-ignore More hacks as there's no guarantee that the scope is one that is available here
        const result: Results<Result> = currentResultsByScope[scope];

        if (result) {
          const numberOfCurrentItems =
            result.numberOfCurrentItems || CONF_OBJECTS_ITEMS_PER_PAGE;

          this.setState({
            searchResults: {
              ...(this.state.searchResults as any),
              [scope]: {
                ...result,
                numberOfCurrentItems:
                  numberOfCurrentItems + CONF_OBJECTS_ITEMS_PER_PAGE,
              },
            },
          });
        }
      } catch (e) {
        this.props.logger.safeError(
          LOGGER_NAME,
          `error while getting more results for ${scope}`,
          e,
        );
        this.setState({
          isLoading: false,
        });
      }
    }
  };

  handleSearchSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { handleSearchSubmit } = this.props;
    if (handleSearchSubmit) {
      handleSearchSubmit(event, this.props.searchSessionId);
    }
  };

  handleFilter = (filter: FilterWithMetadata[]) => {
    this.handleSearch(
      this.state.latestSearchQuery,
      this.latestQueryVersion,
      filter,
    );
  };

  render() {
    const {
      linkComponent,
      getSearchResultsComponent,
      placeholder,
      selectedResultId,
      onSelectedResultIdChanged,
      inputControls,
      searchSessionId,
      advancedSearchId,
    } = this.props;
    const {
      isLoading,
      latestSearchQuery,
      isError,
      searchResults,
      recentItems,
      keepPreQueryState,
      autocompleteSuggestions,
      currentFilters,
    } = this.state;

    return (
      <GlobalQuickSearch
        onSearch={this.handleSearch}
        onSearchSubmit={this.handleSearchSubmit}
        onAutocomplete={this.handleAutocomplete}
        isLoading={isLoading}
        placeholder={placeholder}
        linkComponent={linkComponent}
        searchSessionId={searchSessionId}
        selectedResultId={selectedResultId}
        onSelectedResultIdChanged={onSelectedResultIdChanged}
        inputControls={inputControls}
        autocompleteSuggestions={autocompleteSuggestions}
        filters={this.state.currentFilters}
        advancedSearchId={advancedSearchId}
      >
        {getSearchResultsComponent({
          retrySearch: this.retrySearch,
          latestSearchQuery,
          isError,
          searchResults,
          isLoading,
          recentItems,
          keepPreQueryState,
          searchSessionId,
          searchMore: this.getMoreSearchResults,
          currentFilters,
          onFilterChanged: this.handleFilter,
        })}
      </GlobalQuickSearch>
    );
  }
}

export const BaseConfluenceQuickSearchContainer = injectSearchSession(
  withAnalyticsEvents()<
    CompleteProps<ConfluenceResultsMap>,
    React.ComponentType<CompleteProps<ConfluenceResultsMap>>
  >(QuickSearchContainer),
);

export const BaseJiraQuickSearchContainerJira = injectSearchSession(
  withAnalyticsEvents()<
    CompleteProps<JiraResultsMap>,
    React.ComponentType<CompleteProps<JiraResultsMap>>
  >(QuickSearchContainer),
);
