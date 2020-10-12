import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import uuid from 'uuid/v4';
import { QuickSearchContext } from '../../../api/types';
import {
  BaseConfluenceQuickSearchContainer,
  BaseJiraQuickSearchContainerJira,
  Props as QuickSearchContainerProps,
  SearchResultProps,
} from '../../../components/common/QuickSearchContainer';
import SearchResultsComponent, {
  Props as SearchResultsComponentProps,
} from '../../../components/common/SearchResults';
import StickyFooter from '../../../components/common/StickyFooter';
import ConfluenceAdvancedSearchGroup from '../../../components/confluence/AdvancedSearchGroup';
import {
  ConfluenceQuickSearchContainer,
  Props as ConfluenceProps,
} from '../../../components/confluence/ConfluenceQuickSearchContainer';
import ConfluenceNoResultsState from '../../../components/confluence/NoResultsState';
import JiraAdvancedSearchGroup from '../../../components/jira/JiraAdvancedSearch';
import {
  JiraQuickSearchContainer,
  Props as JiraProps,
} from '../../../components/jira/JiraQuickSearchContainer';
import JiraNoResultsState from '../../../components/jira/NoResultsState';
import * as SearchResultUtils from '../../../components/SearchResultsUtil';
import { messages } from '../../../messages';
import {
  AnalyticsType,
  ConfluenceResultsMap,
  ContentType,
  JiraResultsMap,
  ResultsGroup,
  ResultType,
} from '../../../model/Result';
import { DEFAULT_FEATURES } from '../../../util/features';
import { SearchScreenCounter } from '../../../util/ScreenCounter';
import { shallowWithIntl } from '../helpers/_intl-enzyme-test-helper';
import {
  mockAutocompleteClient,
  noResultsConfluenceClient,
} from '../mocks/_mockConfluenceClient';
import { noResultsCrossProductSearchClient } from '../mocks/_mockCrossProductSearchClient';
import { mockNoResultJiraClient } from '../mocks/_mockJiraClient';
import { mockLogger } from '../mocks/_mockLogger';
import { noResultsPeopleSearchClient } from '../mocks/_mockPeopleSearchClient';
import {
  makeConfluenceContainerResult,
  makeJiraObjectResult,
  makePersonResult,
} from '../_test-util';

const getIssues = (searchSessionId: string) => [
  makeJiraObjectResult({
    contentType: ContentType.JiraIssue,
    href: `href?searchSessionId=${searchSessionId}&searchContentType=issue&searchObjectId=resultId`,
  }),
  makeJiraObjectResult({
    contentType: ContentType.JiraIssue,
    href: `href?searchSessionId=${searchSessionId}&searchContentType=issue&searchObjectId=resultId`,
  }),
];

const getBoards = (searchSessionId: string) => [
  makeJiraObjectResult({
    contentType: ContentType.JiraBoard,
    href: `href?searchSessionId=${searchSessionId}&searchContentType=board&searchObjectId=resultId`,
  }),
];

const getSpaceResults = (searchSessionId: string) => [
  makeConfluenceContainerResult({
    href: `href?search_id=${searchSessionId}`,
  }),
];

const getRecentlyInteractedPeople = (
  searchSessionId: string,
  product: QuickSearchContext,
) => {
  const href =
    product === 'jira'
      ? `href?searchSessionId=${searchSessionId}`
      : `href?search_id=${searchSessionId}`;
  return [
    makePersonResult({
      resultId: 'resultId',
      href,
    }),
  ];
};

const logger = mockLogger();
const createAnalyticsEventSpy = jest.fn();
const renderJiraQuickSearchContainer = (props: JiraProps) => {
  // @ts-ignore - doesn't recognise injected intl prop
  return shallowWithIntl(<JiraQuickSearchContainer {...props} />);
};

const renderConfluenceQuickSearchContainer = (props: ConfluenceProps) => {
  // @ts-ignore - doesn't recognise injected intl prop
  return shallowWithIntl(<ConfluenceQuickSearchContainer {...props} />);
};

const renderComponent = (product: QuickSearchContext) => {
  const props: ConfluenceProps & JiraProps = {
    crossProductSearchClient: noResultsCrossProductSearchClient,
    peopleSearchClient: noResultsPeopleSearchClient,
    jiraClient: mockNoResultJiraClient(),
    autocompleteClient: mockAutocompleteClient,
    logger,
    createAnalyticsEvent: createAnalyticsEventSpy,
    confluenceClient: noResultsConfluenceClient,
    confluenceUrl: 'mockConfluenceUrl',
    features: DEFAULT_FEATURES,
    onAdvancedSearch: undefined,
    linkComponent: undefined,
    referralContextIdentifiers: undefined,
    modelContext: undefined,
    inputControls: undefined,
    appPermission: undefined,
  };

  return product === 'jira'
    ? renderJiraQuickSearchContainer(props)
    : renderConfluenceQuickSearchContainer(props);
};

const getNoResultsState = (product: QuickSearchContext) =>
  product === 'jira' ? JiraNoResultsState : ConfluenceNoResultsState;

const assertJiraNoRecentActivity = (element: JSX.Element) => {
  const { type = '', props = {} } = element || {};
  expect(type).toEqual(React.Fragment);
  const formattedMessage = props.children[0];
  expect(formattedMessage).toMatchObject({
    type: FormattedHTMLMessage,
    props: {
      id: 'global_search.jira.no_recent_activity_body',
    },
  });

  const advancedSearchSection = props.children[1].props.children;
  expect(advancedSearchSection).toMatchObject({
    type: JiraAdvancedSearchGroup,
    props: {
      query: 'query',
      analyticsData: { resultsCount: 0, wasOnNoResultsScreen: true },
    },
  });
};

const assertConfluenceNoRecentActivity = (element: JSX.Element) => {
  const { type = '', props = {} } = element || {};
  expect(type).toBe(FormattedHTMLMessage);
  expect(props).toMatchObject({
    id: 'global_search.no_recent_activity_body',
    values: { url: '/wiki/search' },
  } as {});
};
const assertNoRecentActivityComponent = (
  product: QuickSearchContext,
  element: JSX.Element,
) => {
  if (product === 'jira') {
    assertJiraNoRecentActivity(element);
  } else {
    assertConfluenceNoRecentActivity(element);
  }
};

const assertJiraAdvancedSearchGroup = (element: JSX.Element) => {
  const { type = '', props = {} } = element || {};
  expect(type).toEqual(StickyFooter);
  expect(props.children).toMatchObject({
    type: JiraAdvancedSearchGroup,
    props: {
      analyticsData: { resultsCount: 10 },
      query: 'query',
    },
  });
};

const assertConfluenceAdvancedSearchGroup = (element: JSX.Element) => {
  const { type = '', props = {} } = element || {};
  const analyticsData = { resultsCount: 10 };
  expect(type).toBe(ConfluenceAdvancedSearchGroup);
  expect(props).toMatchObject({
    analyticsData,
    query: 'query',
  });
};
const assertAdvancedSearchGroup = (
  product: QuickSearchContext,
  element: JSX.Element,
) => {
  if (product === 'jira') {
    assertJiraAdvancedSearchGroup(element);
  } else {
    assertConfluenceAdvancedSearchGroup(element);
  }
};

const commonProps = {
  retrySearch: jest.fn(),
  onFilterChanged: jest.fn(),
  latestSearchQuery: 'query',
  isError: false,
  isLoading: false,
  keepPreQueryState: false,
  searchMore: () => {},
  currentFilters: [],
};

const getSearchAndRecentItemsForJira = (
  sessionId: string,
  extraProps = {},
): SearchResultProps<JiraResultsMap> => {
  return {
    ...commonProps,
    ...extraProps,
    searchSessionId: sessionId,
    searchResults: {
      objects: getIssues(sessionId),
      containers: getBoards(sessionId),
      people: [],
    },
    recentItems: {
      objects: [],
      containers: [],
      people: getRecentlyInteractedPeople(sessionId, 'jira'),
    },
  };
};

const getSearchAndRecentItemsForConfluence = (
  sessionId: string,
  extraProps = {},
): SearchResultProps<ConfluenceResultsMap> => {
  const recentPeople = getRecentlyInteractedPeople(sessionId, 'confluence');
  const spaceResults = getSpaceResults(sessionId);
  return {
    ...commonProps,
    ...extraProps,
    searchSessionId: sessionId,
    searchResults: {
      objects: {
        items: [],
        totalSize: 0,
      },
      spaces: {
        items: spaceResults,
        totalSize: spaceResults.length,
      },
      people: {
        items: [],
        totalSize: 0,
      },
    },
    recentItems: {
      objects: {
        items: [],
        totalSize: 0,
      },
      spaces: {
        items: [],
        totalSize: 0,
      },
      people: {
        items: recentPeople,
        totalSize: recentPeople.length,
      },
    },
  };
};

const getJiraPreqQueryResults = (sessionId: string) => [
  {
    items: [],
    key: 'issues',
    title: messages.jira_recent_issues_heading,
  },
  {
    items: [],
    key: 'containers',
    title: messages.jira_recent_containers,
  },
  {
    items: getRecentlyInteractedPeople(sessionId, 'jira'),
    title: messages.jira_recent_people_heading,
    key: 'people',
  },
];
const getConfluencePreQueryResults = (sessionId: string) => [
  {
    items: [],
    key: 'objects',
    title: messages.confluence_recent_pages_heading,
  },
  {
    items: [],
    key: 'spaces',
    title: messages.confluence_recent_spaces_heading,
  },
  {
    items: getRecentlyInteractedPeople(sessionId, 'confluence'),
    title: messages.people_recent_people_heading,
    key: 'people',
  },
];

const getJiraPostQueryResults = (sessionId: string): ResultsGroup[] => [
  {
    items: getIssues(sessionId),
    key: 'issues',
    title: messages.jira_search_result_issues_heading,
    showTotalSize: false,
    totalSize: getIssues(sessionId).length,
  },
  {
    items: [
      {
        analyticsType: 'link-postquery-advanced-search-jira' as AnalyticsType.LinkPostQueryAdvancedSearchJira,
        contentType: 'jira-issue' as ContentType.JiraIssue,
        href: 'jiraUrl',
        name: 'jira',
        resultId: 'search-jira',
        resultType: 'JiraIssueAdvancedSearch' as ResultType.JiraIssueAdvancedSearch,
      },
    ],
    key: 'issue-advanced',
    title: undefined,
    showTotalSize: false,
    totalSize: 1,
  },
  {
    items: getBoards(sessionId),
    key: 'containers',
    title: messages.jira_search_result_containers_heading,
    showTotalSize: false,
    totalSize: getBoards(sessionId).length,
  },
  {
    items: [],
    title: messages.jira_search_result_people_heading,
    key: 'people',
    showTotalSize: false,
    totalSize: 0,
  },
];
const getConfluencePostQueryResults: (
  sessionId: string,
) => ResultsGroup[] = sessionId => [
  {
    items: [],
    key: 'objects',
    title: messages.confluence_confluence_objects_heading,
    showTotalSize: true,
    totalSize: 0,
  },
  {
    items: getSpaceResults(sessionId),
    key: 'spaces',
    title: messages.confluence_spaces_heading,
    showTotalSize: false,
    totalSize: getSpaceResults(sessionId).length,
  },
  {
    items: [],
    title: messages.people_people_heading,
    key: 'people',
    showTotalSize: false,
    totalSize: 0,
  },
];

const getPostQueryResults = (
  sessionId: string,
  product: QuickSearchContext,
): ResultsGroup[] =>
  product === 'jira'
    ? getJiraPostQueryResults(sessionId)
    : getConfluencePostQueryResults(sessionId);

const getPreQueryResults = (sessionId: string, product: QuickSearchContext) =>
  product === 'jira'
    ? getJiraPreqQueryResults(sessionId)
    : getConfluencePreQueryResults(sessionId);

// TODO enzyme loses type for quicksearchcontainer, the tests need to be written separately probably
(['confluence', 'jira'] as Array<QuickSearchContext>).forEach(
  (product: QuickSearchContext) => {
    describe(`${product} SearchResultsComponent`, () => {
      let searchResultsComponent: React.ReactNode;
      let getAdvancedSearchUrlSpy: jest.SpyInstance<
        string,
        [
          {
            entityType: SearchResultUtils.JiraEntityTypes;
            query?: string;
            enableIssueKeySmartMode?: boolean;
            isJiraPeopleProfilesEnabled?: boolean;
          },
        ]
      >;
      const wrapper = renderComponent(product);
      const getProps = (): SearchResultsComponentProps => {
        const { props = {} as SearchResultsComponentProps } =
          (searchResultsComponent as React.ReactElement<
            SearchResultsComponentProps
          >) || {};
        return props as SearchResultsComponentProps;
      };

      let sessionId: string;
      beforeEach(() => {
        sessionId = uuid();
        getAdvancedSearchUrlSpy = jest.spyOn(
          SearchResultUtils,
          'getJiraAdvancedSearchUrl',
        );

        getAdvancedSearchUrlSpy.mockReturnValue(
          product === 'jira' ? 'jiraUrl' : 'confUrl',
        );
        searchResultsComponent =
          product === 'jira'
            ? (wrapper
                .find(BaseJiraQuickSearchContainerJira)
                .props() as QuickSearchContainerProps<
                JiraResultsMap
              >).getSearchResultsComponent(
                getSearchAndRecentItemsForJira(sessionId),
              )
            : (wrapper
                .find(BaseConfluenceQuickSearchContainer)
                .props() as QuickSearchContainerProps<
                ConfluenceResultsMap
              >).getSearchResultsComponent(
                getSearchAndRecentItemsForConfluence(sessionId),
              );
      });

      afterEach(() => {
        getAdvancedSearchUrlSpy.mockRestore();
      });

      it('should has expected props and type', () => {
        const { type = '', props = {} } =
          (searchResultsComponent as React.ReactElement<
            SearchResultsComponentProps
          >) || {};
        expect(type).toBe(SearchResultsComponent);
        expect(props).toMatchObject({
          isPreQuery: false,
          isError: false,
          isLoading: false,
          keepPreQueryState: false,
          searchSessionId: sessionId,
          preQueryScreenCounter: expect.any(SearchScreenCounter),
          postQueryScreenCounter: expect.any(SearchScreenCounter),
        });
      });

      it('should renderNoResult component', () => {
        const { renderNoResult } = getProps();
        const noResultState = renderNoResult();
        const { type = '', props = {} } = (noResultState as JSX.Element) || {};

        expect(type).toBe(getNoResultsState(product));
        expect(props).toMatchObject({
          query: 'query',
        });
      });

      it('should renderNoRecentActivity', () => {
        const { renderNoRecentActivity } = getProps();
        const noRecentActivity = renderNoRecentActivity();
        assertNoRecentActivityComponent(product, noRecentActivity);
      });

      it('should renderAdvancedSearchGroup', () => {
        const { renderAdvancedSearchGroup } = getProps();
        const analyticsData = { resultsCount: 10 };
        const advancedSearchGroup = renderAdvancedSearchGroup(analyticsData);
        assertAdvancedSearchGroup(product, advancedSearchGroup);
      });

      it('should return preQueryGroups', () => {
        const { getPreQueryGroups } = getProps();
        const preQueryGroups = getPreQueryGroups();

        expect(preQueryGroups).toMatchObject(
          getPreQueryResults(sessionId, product),
        );
      });

      it('should return postQueryGroups', () => {
        const { getPostQueryGroups } = getProps();
        const postQueryGroups = getPostQueryGroups();
        expect(postQueryGroups).toMatchObject(
          getPostQueryResults(sessionId, product),
        );
      });
    });
  },
);

describe('jira', () => {
  it('should not render lozenge for pre-query screen', () => {
    const wrapper = renderComponent('jira');
    const quickSearchContainer = wrapper.find(BaseJiraQuickSearchContainerJira);
    const searchResultsComponent = (quickSearchContainer.props() as QuickSearchContainerProps<
      JiraResultsMap
    >).getSearchResultsComponent(
      getSearchAndRecentItemsForJira('abc', { latestSearchQuery: '' }),
    );

    const { props } = searchResultsComponent! as React.ReactElement<
      SearchResultsComponentProps
    >;
    const { renderAdvancedSearchGroup } = props;
    const advancedSearchGroup = renderAdvancedSearchGroup({ resultsCount: 10 });
    expect(advancedSearchGroup.props.children).toMatchObject({
      type: JiraAdvancedSearchGroup,
      props: {
        analyticsData: { resultsCount: 10 },
        query: '',
      },
    });
  });
});
