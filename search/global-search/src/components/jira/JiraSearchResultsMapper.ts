import {
  ResultsGroup,
  JiraResultsMap,
  Result,
  ResultType,
  AnalyticsType,
  ContentType,
} from '../../model/Result';
import {
  take,
  getJiraAdvancedSearchUrl,
  JiraEntityTypes,
} from '../SearchResultsUtil';
import { messages } from '../../messages';
import { JiraApplicationPermission } from '../GlobalQuickSearchWrapper';
import { attachJiraContextIdentifiers } from '../common/contextIdentifiersHelper';
import { ABTest } from '../../api/CrossProductSearchClient';
import { getJiraMaxObjects } from '../../util/experiment-utils';
import { JiraFeatures } from '../../util/features';

const DEFAULT_MAX_OBJECTS = 8;
const MAX_CONTAINERS = 6;
const MAX_PEOPLE = 3;
export const MAX_RECENT_RESULTS_TO_SHOW = 3;

const DEFAULT_JIRA_RESULTS_MAP: JiraResultsMap = {
  objects: [],
  containers: [],
  people: [],
};

const isEmpty = (arr: Array<any> = []) => !arr.length;

const hasNoResults = (
  objects: Array<Result> = [],
  poeple: Array<Result> = [],
  containers: Array<Result> = [],
): boolean => isEmpty(objects) && isEmpty(poeple) && isEmpty(containers);

const sliceResults = (resultsMap: JiraResultsMap | null, abTest: ABTest) => {
  const { objects, containers, people } = resultsMap
    ? resultsMap
    : DEFAULT_JIRA_RESULTS_MAP;

  const [objectsToDisplay, peopleToDisplay, containersToDisplay] = [
    { items: objects, count: getJiraMaxObjects(abTest, DEFAULT_MAX_OBJECTS) },
    { items: people, count: MAX_PEOPLE },
    { items: containers, count: MAX_CONTAINERS },
  ].map(({ items, count }) => take(items, count));

  return {
    objectsToDisplay,
    containersToDisplay,
    peopleToDisplay,
  };
};

export const mapRecentResultsToUIGroups = (
  recentlyViewedObjects: JiraResultsMap | null,
  searchSessionId: string,
  features: JiraFeatures,
  appPermission?: JiraApplicationPermission,
): ResultsGroup[] => {
  const withSessionId =
    recentlyViewedObjects !== null
      ? attachJiraContextIdentifiers(searchSessionId, recentlyViewedObjects)
      : recentlyViewedObjects;

  const {
    objectsToDisplay,
    peopleToDisplay,
    containersToDisplay,
  } = sliceResults(withSessionId, features.abTest);

  return [
    {
      items: objectsToDisplay,
      key: 'issues',
      title: messages.jira_recent_issues_heading,
      totalSize: objectsToDisplay.length,
      showTotalSize: false, // Jira doesn't support search extensions yet
    },
    {
      items: containersToDisplay,
      key: 'containers',
      title:
        appPermission && !appPermission.hasSoftwareAccess
          ? messages.jira_recent_core_containers
          : messages.jira_recent_containers,
      totalSize: containersToDisplay.length,
      showTotalSize: false,
    },
    {
      items: peopleToDisplay,
      key: 'people',
      title: messages.jira_recent_people_heading,
      totalSize: peopleToDisplay.length,
      showTotalSize: false,
    },
  ];
};

export const mapSearchResultsToUIGroups = (
  searchResultsObjects: JiraResultsMap | null,
  searchSessionId: string,
  features: JiraFeatures,
  appPermission?: JiraApplicationPermission,
  query?: string,
): ResultsGroup[] => {
  const withSessionId =
    searchResultsObjects !== null
      ? attachJiraContextIdentifiers(searchSessionId, searchResultsObjects)
      : searchResultsObjects;

  const {
    objectsToDisplay,
    peopleToDisplay,
    containersToDisplay,
  } = sliceResults(withSessionId, features.abTest);
  return [
    {
      items: objectsToDisplay,
      key: 'issues',
      title: messages.jira_search_result_issues_heading,
      showTotalSize: false, // Jira doesn't support search extensions yet
      totalSize: objectsToDisplay.length,
    },
    ...(!hasNoResults(objectsToDisplay, peopleToDisplay, containersToDisplay)
      ? [
          {
            items: [
              {
                resultType: ResultType.JiraIssueAdvancedSearch,
                resultId: 'search-jira',
                name: 'jira',
                href: getJiraAdvancedSearchUrl({
                  entityType: JiraEntityTypes.Issues,
                  query,
                }),
                analyticsType: AnalyticsType.LinkPostQueryAdvancedSearchJira,
                contentType: ContentType.JiraIssue,
              },
            ],
            key: 'issue-advanced',
            title: isEmpty(objectsToDisplay)
              ? messages.jira_search_result_issues_heading
              : undefined,
            showTotalSize: false,
            totalSize: 1,
          },
        ]
      : []),
    {
      items: containersToDisplay,
      key: 'containers',
      title:
        appPermission && !appPermission.hasSoftwareAccess
          ? messages.jira_search_result_core_containers_heading
          : messages.jira_search_result_containers_heading,
      showTotalSize: false,
      totalSize: containersToDisplay.length,
    },
    {
      items: peopleToDisplay,
      key: 'people',
      title: messages.jira_search_result_people_heading,
      showTotalSize: false,
      totalSize: peopleToDisplay.length,
    },
  ];
};
