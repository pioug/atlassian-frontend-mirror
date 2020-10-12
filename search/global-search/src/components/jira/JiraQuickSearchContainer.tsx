import React from 'react';
import {
  injectIntl,
  InjectedIntlProps,
  FormattedHTMLMessage,
} from 'react-intl';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import { withAnalytics } from '@atlaskit/analytics';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { CancelableEvent } from '@atlaskit/quick-search';
import StickyFooter from '../common/StickyFooter';
import { CreateAnalyticsEventFn } from '../analytics/types';
import { SearchScreenCounter } from '../../util/ScreenCounter';
import { JiraClient } from '../../api/JiraClient';
import { PeopleSearchClient } from '../../api/PeopleSearchClient';
import { Scope, JiraItem } from '../../api/types';
import {
  LinkComponent,
  ReferralContextIdentifiers,
  Logger,
  JiraApplicationPermission,
} from '../GlobalQuickSearchWrapper';
import {
  BaseJiraQuickSearchContainerJira,
  SearchResultProps,
  PartiallyLoadedRecentItems,
} from '../common/QuickSearchContainer';
import { messages } from '../../messages';
import SearchResultsComponent from '../common/SearchResults';
import NoResultsState from './NoResultsState';
import JiraAdvancedSearch from './JiraAdvancedSearch';
import {
  mapRecentResultsToUIGroups,
  mapSearchResultsToUIGroups,
  MAX_RECENT_RESULTS_TO_SHOW,
} from './JiraSearchResultsMapper';
import {
  handlePromiseError,
  JiraEntityTypes,
  redirectToJiraAdvancedSearch,
  ADVANCED_JIRA_SEARCH_RESULT_ID,
} from '../SearchResultsUtil';
import {
  JiraResult,
  Result,
  ResultsWithTiming,
  JiraResultsMap,
  AnalyticsType,
} from '../../model/Result';
import { getUniqueResultId } from '../ResultList';
import {
  CrossProductSearchClient,
  CrossProductSearchResults,
  SearchItem,
} from '../../api/CrossProductSearchClient';
import performanceNow from '../../util/performance-now';
import {
  fireSelectedAdvancedSearch,
  AdvancedSearchSelectedEvent,
} from '../../util/analytics-event-helper';
import AdvancedIssueSearchLink from './AdvancedIssueSearchLink';
import { getJiraMaxObjects } from '../../util/experiment-utils';
import { buildJiraModelParams } from '../../util/model-parameters';
import { JiraFeatures } from '../../util/features';
import { injectFeatures } from '../FeaturesProvider';
import { mapJiraItemToResult } from '../../api/JiraItemMapper';
import { appendListWithoutDuplication } from '../../util/search-results-utils';

const JIRA_RESULT_LIMIT = 6;
const JIRA_PREQUERY_RESULT_LIMIT = 10;

const NoResultsAdvancedSearchContainer = styled.div`
  margin-top: ${4 * gridSize()}px;
`;

const BeforePreQueryStateContainer = styled.div`
  margin-top: ${gridSize()}px;
`;

const containsQuery = (string: string, query: string) => {
  return string.toLowerCase().indexOf(query.toLowerCase()) > -1;
};

const getRecentItemMatches = (
  query: string,
  recentItems: JiraResultsMap | null,
): Result[] => {
  if (!recentItems) {
    return [];
  }

  const issueKeyMatches = recentItems.objects.filter(
    result => result.objectKey && containsQuery(result.objectKey, query),
  );
  const titleMatches = recentItems.objects.filter(result =>
    containsQuery(result.name, query),
  );

  return issueKeyMatches
    .concat(titleMatches)
    .slice(0, MAX_RECENT_RESULTS_TO_SHOW);
};

const mergeSearchResultsWithRecentItems = (
  searchResults: JiraResultsMap,
  recentItems: Result[],
): JiraResultsMap => {
  const defaultSearchResults: JiraResultsMap = {
    objects: [],
    containers: [],
    people: [],
  };

  const results = { ...defaultSearchResults, ...searchResults };

  return {
    objects: appendListWithoutDuplication(recentItems, results.objects),
    containers: results.containers,
    people: results.people,
  };
};

/**
 * NOTE: This component is only consumed internally as such avoid using optional props
 * i.e. instead of "propX?: something" use "propX: something | undefined"
 *
 * This improves type safety and prevent us from accidentally forgetting a parameter.
 */
export interface Props {
  createAnalyticsEvent?: CreateAnalyticsEventFn | undefined;
  linkComponent: LinkComponent | undefined;
  referralContextIdentifiers: ReferralContextIdentifiers | undefined;
  jiraClient: JiraClient;
  peopleSearchClient: PeopleSearchClient;
  crossProductSearchClient: CrossProductSearchClient;
  logger: Logger;
  onAdvancedSearch:
    | undefined
    | ((
        e: CancelableEvent,
        entity: string,
        query: string,
        searchSessionId: string,
      ) => void);
  appPermission: JiraApplicationPermission | undefined;
  features: JiraFeatures;
  isJiraPeopleProfilesEnabled?: boolean;
}

const SCOPES = [Scope.JiraIssue, Scope.JiraBoardProjectFilter];

export interface State {
  selectedAdvancedSearchType: JiraEntityTypes;
  selectedResultId?: string;
}

const LOGGER_NAME = 'AK.GlobalSearch.JiraQuickSearchContainer';

/**
 * Container/Stateful Component that handles the data fetching and state handling when the user interacts with Search.
 */
export class JiraQuickSearchContainer extends React.Component<
  Props & InjectedIntlProps,
  State
> {
  state: State = {
    selectedAdvancedSearchType: JiraEntityTypes.Issues,
  };

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
      this.state.selectedAdvancedSearchType,
      query,
      searchSessionId,
    );

    if (!defaultPrevented) {
      redirectToJiraAdvancedSearch(
        this.state.selectedAdvancedSearchType,
        query,
      );
    }
  };

  handleAdvancedSearch = (
    event: CancelableEvent,
    entity: string,
    query: string,
    searchSessionId: string,
    analyticsData: Object,
    isLoading: boolean,
  ) => {
    const {
      referralContextIdentifiers,
      onAdvancedSearch = () => {},
    } = this.props;
    const eventData = {
      resultId: ADVANCED_JIRA_SEARCH_RESULT_ID,
      ...analyticsData,
      query,
      // queryversion is missing
      contentType: entity,
      type: AnalyticsType.AdvancedSearchJira,
      isLoading,
    } as AdvancedSearchSelectedEvent;

    fireSelectedAdvancedSearch(
      eventData,
      searchSessionId,
      referralContextIdentifiers,
      this.props.createAnalyticsEvent,
    );
    onAdvancedSearch(event, entity, query, searchSessionId);
  };

  getPreQueryDisplayedResults = (
    recentItems: JiraResultsMap | null,
    searchSessionId: string,
  ) => {
    const { features } = this.props;

    return mapRecentResultsToUIGroups(
      recentItems,
      searchSessionId,
      features,
      this.props.appPermission,
    );
  };

  getPostQueryDisplayedResults = (
    searchResults: JiraResultsMap | null,
    latestSearchQuery: string,
    recentItems: JiraResultsMap | null,
    isLoading: boolean,
    searchSessionId: string,
  ) => {
    const { features } = this.props;
    if (features.isInFasterSearchExperiment) {
      const currentSearchResults: JiraResultsMap =
        isLoading || !searchResults ? ({} as JiraResultsMap) : searchResults;

      const recentResults = getRecentItemMatches(
        latestSearchQuery,
        recentItems,
      );

      const mergedRecentSearchResults = mergeSearchResultsWithRecentItems(
        currentSearchResults,
        recentResults,
      );

      return mapSearchResultsToUIGroups(
        mergedRecentSearchResults,
        searchSessionId,
        features,
        this.props.appPermission,
        latestSearchQuery,
      );
    }

    return mapSearchResultsToUIGroups(
      searchResults as JiraResultsMap,
      searchSessionId,
      features,
      this.props.appPermission,
      latestSearchQuery,
    );
  };

  getSearchResultsComponent = ({
    retrySearch,
    latestSearchQuery,
    isError,
    searchResults,
    isLoading,
    recentItems,
    keepPreQueryState,
    searchSessionId,
    searchMore,
    currentFilters,
    onFilterChanged,
  }: SearchResultProps<JiraResultsMap>) => {
    const query = latestSearchQuery;
    const {
      referralContextIdentifiers,
      onAdvancedSearch = () => {},
      appPermission,
      features,
      isJiraPeopleProfilesEnabled,
    } = this.props;

    return (
      <SearchResultsComponent
        query={query}
        isPreQuery={!query}
        isError={isError}
        isLoading={isLoading}
        retrySearch={retrySearch}
        keepPreQueryState={
          features.isInFasterSearchExperiment ? false : keepPreQueryState
        }
        searchSessionId={searchSessionId}
        {...this.screenCounters}
        referralContextIdentifiers={referralContextIdentifiers}
        searchMore={searchMore}
        currentFilters={currentFilters}
        onFilterChanged={onFilterChanged}
        renderNoRecentActivity={() => (
          <>
            <FormattedHTMLMessage {...messages.jira_no_recent_activity_body} />
            <NoResultsAdvancedSearchContainer>
              <JiraAdvancedSearch
                appPermission={appPermission}
                query={query}
                analyticsData={{ resultsCount: 0, wasOnNoResultsScreen: true }}
                onClick={(mouseEvent, entity) =>
                  this.handleAdvancedSearch(
                    mouseEvent,
                    entity,
                    query,
                    searchSessionId,
                    { resultsCount: 0, wasOnNoResultsScreen: true },
                    isLoading,
                  )
                }
                isJiraPeopleProfilesEnabled={isJiraPeopleProfilesEnabled}
              />
            </NoResultsAdvancedSearchContainer>
          </>
        )}
        renderAdvancedSearchGroup={(analyticsData?) => (
          <StickyFooter style={{ marginTop: `${2 * gridSize()}px` }}>
            <JiraAdvancedSearch
              appPermission={appPermission}
              analyticsData={analyticsData}
              query={query}
              onClick={(mouseEvent, entity) =>
                this.handleAdvancedSearch(
                  mouseEvent,
                  entity,
                  query,
                  searchSessionId,
                  analyticsData,
                  isLoading,
                )
              }
              isJiraPeopleProfilesEnabled={isJiraPeopleProfilesEnabled}
            />
          </StickyFooter>
        )}
        renderBeforePreQueryState={() => (
          <BeforePreQueryStateContainer>
            <AdvancedIssueSearchLink
              onClick={({ event }) =>
                onAdvancedSearch(
                  event,
                  JiraEntityTypes.Issues,
                  query,
                  searchSessionId,
                )
              }
            />
          </BeforePreQueryStateContainer>
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
        renderNoResult={() => (
          <NoResultsState
            query={query}
            onAdvancedSearch={(mouseEvent, entity) =>
              this.handleAdvancedSearch(
                mouseEvent,
                entity,
                query,
                searchSessionId,
                { resultsCount: 0, wasOnNoResultsScreen: true },
                isLoading,
              )
            }
            isJiraPeopleProfilesEnabled={isJiraPeopleProfilesEnabled}
          />
        )}
      />
    );
  };

  getRecentlyInteractedPeople = (): Promise<Result[]> => {
    /*
      the following code is temporarily feature flagged for performance reasons and will be shortly reinstated.
      https://product-fabric.atlassian.net/browse/QS-459
    */
    if (this.props.features.disableJiraPreQueryPeopleSearch) {
      return Promise.resolve([]);
    } else {
      const peoplePromise: Promise<
        Result[]
      > = this.props.peopleSearchClient.getRecentPeople();
      return handlePromiseError<Result[]>(
        peoplePromise,
        [] as Result[],
        error =>
          this.props.logger.safeError(
            LOGGER_NAME,
            'error in recently interacted people promise',
            error,
          ),
      ) as Promise<Result[]>;
    }
  };

  getJiraRecentItems = (): Promise<JiraResultsMap> => {
    const { features } = this.props;

    return this.props.crossProductSearchClient
      .getRecentItems({
        context: 'jira',
        modelParams: [],
        resultLimit: getJiraMaxObjects(
          features.abTest,
          JIRA_PREQUERY_RESULT_LIMIT,
        ),
        mapItemToResult: (_: Scope, item: SearchItem) =>
          mapJiraItemToResult(AnalyticsType.RecentJira)(item as JiraItem),
      })
      .then(xpRecentResults => {
        const objects = xpRecentResults.results[Scope.JiraIssue];
        const containers =
          xpRecentResults.results[Scope.JiraBoardProjectFilter];

        return {
          objects: objects ? objects.items : [],
          containers: containers ? containers.items : [],
          people: [],
        };
      })
      .catch(error => {
        this.props.logger.safeError(
          LOGGER_NAME,
          'error in recent Jira items promise',
          error,
        );
        return {
          objects: [],
          containers: [],
          people: [],
        };
      });
  };

  canSearchUsers = (): Promise<boolean> => {
    /*
      the following code is temporarily feature flagged for performance reasons and will be shortly reinstated.
      https://product-fabric.atlassian.net/browse/QS-459
    */
    if (this.props.features.disableJiraPreQueryPeopleSearch) {
      return Promise.resolve(false);
    } else {
      return handlePromiseError(
        this.props.jiraClient.canSearchUsers(),
        false,
        error =>
          this.props.logger.safeError(
            LOGGER_NAME,
            'error fetching browse user permission',
            error,
          ),
      );
    }
  };

  getRecentItems = (): PartiallyLoadedRecentItems<JiraResultsMap> => {
    return {
      eagerRecentItemsPromise: this.getJiraRecentItems().then(
        results => ({ results } as ResultsWithTiming<JiraResultsMap>),
      ),
      lazyLoadedRecentItemsPromise: Promise.all([
        this.getRecentlyInteractedPeople(),
        this.canSearchUsers(),
      ]).then(([people, canSearchUsers]) => {
        return {
          people: canSearchUsers ? people : [],
        };
      }),
    };
  };

  getSearchResults = (
    query: string,
    sessionId: string,
    startTime: number,
    queryVersion: number,
  ): Promise<ResultsWithTiming<JiraResultsMap>> => {
    const { features } = this.props;

    const referrerId =
      this.props.referralContextIdentifiers &&
      this.props.referralContextIdentifiers.searchReferrerId;

    const crossProductSearchPromise = this.props.crossProductSearchClient.search(
      {
        query,
        sessionId,
        referrerId,
        scopes: SCOPES,
        modelParams: buildJiraModelParams(
          queryVersion,
          this.props.referralContextIdentifiers &&
            this.props.referralContextIdentifiers.currentContainerId,
        ),
        resultLimit: getJiraMaxObjects(features.abTest, JIRA_RESULT_LIMIT),
      },
    );

    const searchPeoplePromise = Promise.resolve([] as Result[]);

    const mapPromiseToPerformanceTime = (p: Promise<any>) =>
      p.then(() => performanceNow() - startTime);

    return Promise.all<
      CrossProductSearchResults,
      Result[],
      number,
      number,
      boolean
    >([
      crossProductSearchPromise,
      searchPeoplePromise,
      mapPromiseToPerformanceTime(crossProductSearchPromise),
      mapPromiseToPerformanceTime(searchPeoplePromise),
      this.canSearchUsers(),
    ]).then(
      ([
        xpsearchResults,
        peopleResults,
        crossProductSearchElapsedMs,
        peopleElapsedMs,
        canSearchPeople,
      ]) => {
        const objects = xpsearchResults.results[Scope.JiraIssue];
        const containers =
          xpsearchResults.results[Scope.JiraBoardProjectFilter];

        const objectItems = objects ? objects.items : [];

        this.highlightMatchingFirstResult(query, objectItems as JiraResult[]);

        return {
          results: {
            objects: objectItems,
            containers: containers ? containers.items : [],
            people: canSearchPeople ? peopleResults : [],
          },
          timings: {
            crossProductSearchElapsedMs,
            peopleElapsedMs,
          },

          abTest: xpsearchResults.abTest,
        };
      },
    );
  };

  highlightMatchingFirstResult(query: string, issueResults: JiraResult[]) {
    if (
      issueResults &&
      issueResults.length > 0 &&
      typeof issueResults[0].objectKey === 'string' &&
      (issueResults[0].objectKey!.toLowerCase() === query.toLowerCase() ||
        (!!+query &&
          issueResults[0].objectKey!.toLowerCase().endsWith(`${-query}`)))
    ) {
      this.setState({
        selectedResultId: getUniqueResultId(issueResults[0]),
      });
    }
  }

  handleSelectedResultIdChanged(newSelectedId?: string) {
    this.setState({
      selectedResultId: newSelectedId,
    });
  }

  render() {
    const {
      linkComponent,
      createAnalyticsEvent,
      logger,
      features,
      referralContextIdentifiers,
      isJiraPeopleProfilesEnabled,
    } = this.props;
    const { selectedResultId } = this.state;

    return (
      <BaseJiraQuickSearchContainerJira
        placeholder={this.props.intl.formatMessage(
          messages.jira_search_placeholder,
        )}
        linkComponent={linkComponent}
        getPreQueryDisplayedResults={(
          recentItems: JiraResultsMap | null,
          searchSessionId: string,
        ) => this.getPreQueryDisplayedResults(recentItems, searchSessionId)}
        getPostQueryDisplayedResults={this.getPostQueryDisplayedResults}
        getSearchResultsComponent={this.getSearchResultsComponent}
        getRecentItems={this.getRecentItems}
        getSearchResults={this.getSearchResults}
        handleSearchSubmit={this.handleSearchSubmit}
        // @ts-ignore
        createAnalyticsEvent={createAnalyticsEvent}
        logger={logger}
        selectedResultId={selectedResultId}
        onSelectedResultIdChanged={(newId: any) =>
          this.handleSelectedResultIdChanged(newId)
        }
        referralContextIdentifiers={referralContextIdentifiers}
        product="jira"
        features={features}
        advancedSearchId={ADVANCED_JIRA_SEARCH_RESULT_ID}
        isJiraPeopleProfilesEnabled={isJiraPeopleProfilesEnabled}
      />
    );
  }
}

const JiraQuickSearchContainerWithIntl = injectIntl<Props>(
  withAnalytics(JiraQuickSearchContainer, {}, {}),
);

export default injectFeatures(
  withAnalyticsEvents()(JiraQuickSearchContainerWithIntl),
);
