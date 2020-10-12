export const ADVANCED_CONFLUENCE_SEARCH_RESULT_ID = 'search_confluence';
export const ADVANCED_JIRA_SEARCH_RESULT_ID = 'search_jira';
export const ADVANCED_PEOPLE_SEARCH_RESULT_ID = 'search_people';

export enum JiraEntityTypes {
  Projects = 'projects',
  Issues = 'issues',
  Boards = 'boards',
  Filters = 'filters',
  People = 'people',
}

export enum ConfluenceAdvancedSearchTypes {
  Content = 'content',
  People = 'people',
}

export const isAdvancedSearchResult = (resultId: string) =>
  [
    ADVANCED_CONFLUENCE_SEARCH_RESULT_ID,
    ADVANCED_JIRA_SEARCH_RESULT_ID,
    ADVANCED_PEOPLE_SEARCH_RESULT_ID,
  ].some(advancedResultId => advancedResultId === resultId);

export function getConfluenceAdvancedSearchLink(query?: string) {
  const queryString = query ? `?text=${encodeURIComponent(query)}` : '';
  return `/wiki/search${queryString}`;
}

type Props = {
  entityType: JiraEntityTypes;
  query?: string;
  enableIssueKeySmartMode?: boolean;
  isJiraPeopleProfilesEnabled?: boolean;
};

export function getJiraAdvancedSearchUrl(props: Props) {
  const {
    entityType,
    query,
    enableIssueKeySmartMode,
    isJiraPeopleProfilesEnabled,
  } = props;
  switch (entityType) {
    case JiraEntityTypes.Issues:
      return !enableIssueKeySmartMode && query && +query
        ? `/issues/?jql=order+by+created+DESC`
        : `/secure/QuickSearch.jspa?searchString=${query}`;
    case JiraEntityTypes.Boards:
      return `/secure/ManageRapidViews.jspa?contains=${query}`;
    case JiraEntityTypes.Filters:
      return `/secure/ManageFilters.jspa?Search=Search&filterView=search&name=${query}`;
    case JiraEntityTypes.Projects:
      return `/projects?contains=${query}`;
    case JiraEntityTypes.People:
      return !!isJiraPeopleProfilesEnabled
        ? `/jira/people/search?q=${query}`
        : `/people/search?q=${query}`;
  }
}

export function redirectToConfluenceAdvancedSearch(query = '') {
  // XPSRCH-891: this breaks SPA navigation. Consumer needs to pass in a redirect/navigate function.
  window.location.assign(getConfluenceAdvancedSearchLink(query));
}

export function redirectToJiraAdvancedSearch(
  entityType: JiraEntityTypes,
  query = '',
) {
  window.location.assign(
    getJiraAdvancedSearchUrl({
      entityType,
      query,
      enableIssueKeySmartMode: true,
    }),
  );
}

export function take<T>(array: Array<T>, n: number) {
  return (array || []).slice(0, n);
}

export function isEmpty<T>(array: Array<T>) {
  return array.length === 0;
}

/**
 *
 * Gracefully handle promise catch and returning default value
 * @param promise promise to handle its catch block
 * @param defaultValue value returned by the promise in case of error
 * @param errorHandler function to be called in case of promise rejection
 */
export function handlePromiseError<T>(
  promise: Promise<T>,
  defaultValue: T,
  errorHandler?: (reason: any) => T | void,
): Promise<T> {
  return promise.catch(error => {
    try {
      if (errorHandler) {
        errorHandler(error);
      }
    } catch (e) {}
    return defaultValue;
  });
}
