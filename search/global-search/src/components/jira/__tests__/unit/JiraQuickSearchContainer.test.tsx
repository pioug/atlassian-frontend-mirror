import React from 'react';
import uuid from 'uuid/v4';
import { shallowWithIntl } from '../../../../__tests__/unit/helpers/_intl-enzyme-test-helper';
import {
  JiraQuickSearchContainer,
  Props,
} from '../../JiraQuickSearchContainer';
import {
  BaseJiraQuickSearchContainerJira,
  Props as QuickSearchContainerProps,
} from '../../../common/QuickSearchContainer';
import {
  noResultsCrossProductSearchClient,
  errorCrossProductSearchClient,
  mockCrossProductSearchClient,
  mockErrorCrossProductSearchClient,
} from '../../../../__tests__/unit/mocks/_mockCrossProductSearchClient';
import {
  noResultsPeopleSearchClient,
  errorPeopleSearchClient,
  mockPeopleSearchClient,
} from '../../../../__tests__/unit/mocks/_mockPeopleSearchClient';
import { mockLogger } from '../../../../__tests__/unit/mocks/_mockLogger';
import { mockNoResultJiraClient } from '../../../../__tests__/unit/mocks/_mockJiraClient';
import {
  makeJiraObjectResult,
  makePersonResult,
} from '../../../../__tests__/unit/_test-util';
import { ContentType, JiraResultsMap } from '../../../../model/Result';
import { Scope } from '../../../../api/types';
import * as SearchUtils from '../../../SearchResultsUtil';
import { ShallowWrapper } from 'enzyme';
import { CancelableEvent } from '@atlaskit/quick-search';
import {
  DEFAULT_AB_TEST,
  SearchResultsMap,
} from '../../../../api/CrossProductSearchClient';
import { ReferralContextIdentifiers } from '../../../GlobalQuickSearchWrapper';
import { DEFAULT_FEATURES } from '../../../../util/features';

const issues = [
  makeJiraObjectResult({
    contentType: ContentType.JiraIssue,
  }),
  makeJiraObjectResult({
    contentType: ContentType.JiraIssue,
  }),
];
const boards = [
  makeJiraObjectResult({
    contentType: ContentType.JiraBoard,
  }),
];

const recentlytIssuesAndBoards: SearchResultsMap = {
  'jira.issue': {
    items: issues,
    totalSize: issues.length,
  },
  'jira.board,project,filter': {
    items: boards,
    totalSize: boards.length,
  },
} as SearchResultsMap;

const people = [makePersonResult(), makePersonResult(), makePersonResult()];
const referralContextIdentifiers: ReferralContextIdentifiers = {
  currentContainerId: '123-container',
  currentContentId: '123-content',
  searchReferrerId: '123-search-referrer',
};

describe('Jira Quick Search Container', () => {
  let createAnalyticsEventSpy: jest.Mock;
  let sessionId: string;
  const logger = mockLogger();
  const renderComponent = (partialProps?: Partial<Props>): ShallowWrapper => {
    const props: Props = {
      crossProductSearchClient: noResultsCrossProductSearchClient,
      peopleSearchClient: noResultsPeopleSearchClient,
      jiraClient: mockNoResultJiraClient(),
      logger,
      createAnalyticsEvent: createAnalyticsEventSpy,
      referralContextIdentifiers,
      linkComponent: undefined,
      onAdvancedSearch: undefined,
      appPermission: undefined,
      features: DEFAULT_FEATURES,
      ...partialProps,
    };

    // @ts-ignore - doesn't recognise injected intl prop
    return shallowWithIntl(<JiraQuickSearchContainer {...props} />);
  };

  const getQuickSearchProperty = (
    wrapper: ShallowWrapper,
    property: keyof QuickSearchContainerProps<JiraResultsMap>,
  ) => {
    const quickSearch = wrapper.find(BaseJiraQuickSearchContainerJira);
    const quickSearchProps = quickSearch.props();

    // @ts-ignore
    return quickSearchProps[property];
  };

  beforeEach(() => {
    sessionId = uuid();
    createAnalyticsEventSpy = jest.fn();
  });

  afterEach(() => {
    createAnalyticsEventSpy.mockRestore();
    logger.reset();
  });

  it('should render quick search with correct props', () => {
    const wrapper = renderComponent();
    const quickSearch = wrapper.find(BaseJiraQuickSearchContainerJira);
    expect(quickSearch.props()).toMatchObject({
      placeholder: 'Search Jira',
      getPreQueryDisplayedResults: expect.any(Function),
      getPostQueryDisplayedResults: expect.any(Function),
      getSearchResultsComponent: expect.any(Function),
      getRecentItems: expect.any(Function),
      getSearchResults: expect.any(Function),
      handleSearchSubmit: expect.any(Function),
      createAnalyticsEvent: createAnalyticsEventSpy,
    });
  });

  describe('getRecentItems', () => {
    it('should not throw when recent promise throw', async () => {
      const error = new Error('something wrong');
      const crossProductSearchClient = mockErrorCrossProductSearchClient(error);
      const recentsSpy = jest.spyOn(crossProductSearchClient, 'getRecentItems');
      const getRecentItems = getQuickSearchProperty(
        renderComponent({ crossProductSearchClient }),
        'getRecentItems',
      );
      const { eagerRecentItemsPromise } = getRecentItems();
      expect(recentsSpy).toHaveBeenCalledTimes(1);
      expect(await eagerRecentItemsPromise).toMatchObject({
        results: {
          objects: [],
          containers: [],
          people: [],
        },
      });
      expect(logger.safeError).toHaveBeenCalledTimes(1);
      expect(logger.safeError.mock.calls[0]).toMatchObject([
        'AK.GlobalSearch.JiraQuickSearchContainer',
        'error in recent Jira items promise',
        error,
      ]);
    });

    it('should not throw when people recent promise is rejected', async () => {
      const recentsSpy = jest.spyOn(
        noResultsCrossProductSearchClient,
        'getRecentItems',
      );
      const getRecentItems = getQuickSearchProperty(
        renderComponent({
          crossProductSearchClient: noResultsCrossProductSearchClient,
          peopleSearchClient: errorPeopleSearchClient,
        }),
        'getRecentItems',
      );
      const { eagerRecentItemsPromise } = getRecentItems();
      expect(recentsSpy).toHaveBeenCalledTimes(1);
      expect(await eagerRecentItemsPromise).toMatchObject({
        results: {
          objects: [],
          containers: [],
          people: [],
        },
      });
      expect(logger.safeError).toHaveBeenCalledTimes(1);
      expect(logger.safeError.mock.calls[0]).toMatchObject([
        'AK.GlobalSearch.JiraQuickSearchContainer',
        'error in recently interacted people promise',
        'error',
      ]);
    });

    it('should return correct recent items', async () => {
      const crossProductSearchClient = mockCrossProductSearchClient(
        { results: recentlytIssuesAndBoards },
        DEFAULT_AB_TEST,
      );
      const recentsSpy = jest.spyOn(crossProductSearchClient, 'getRecentItems');
      const peopleSearchClient = mockPeopleSearchClient({
        recentPeople: people,
      });

      const getRecentItems = getQuickSearchProperty(
        renderComponent({ crossProductSearchClient, peopleSearchClient }),
        'getRecentItems',
      );
      const {
        eagerRecentItemsPromise,
        lazyLoadedRecentItemsPromise,
      } = getRecentItems();
      expect(recentsSpy).toHaveBeenCalledTimes(1);
      expect(await eagerRecentItemsPromise).toMatchObject({
        results: {
          objects: issues,
          containers: boards,
        },
      });

      expect(await lazyLoadedRecentItemsPromise).toEqual({
        people,
      });
      expect(logger.safeError).toHaveBeenCalledTimes(0);
    });

    it('should not return recent people if no browse permission', async () => {
      const jiraClient = mockNoResultJiraClient(false);
      const crossProductSearchClient = mockCrossProductSearchClient(
        { results: recentlytIssuesAndBoards },
        DEFAULT_AB_TEST,
      );
      const recentsSpy = jest.spyOn(crossProductSearchClient, 'getRecentItems');

      const peopleSearchClient = mockPeopleSearchClient({
        recentPeople: people,
      });

      const getRecentItems = getQuickSearchProperty(
        renderComponent({
          jiraClient,
          crossProductSearchClient,
          peopleSearchClient,
        }),
        'getRecentItems',
      );
      const recentItems = await getRecentItems().eagerRecentItemsPromise;
      expect(recentsSpy).toHaveBeenCalledTimes(1);
      expect(recentItems).toMatchObject({
        results: {
          objects: issues,
          containers: boards,
          people: [],
        },
      });
      expect(logger.safeError).toHaveBeenCalledTimes(0);
    });
  });

  describe('getSearchResults', () => {
    it('should return an error when cross product search has error', async () => {
      const getSearchResults = getQuickSearchProperty(
        renderComponent({
          crossProductSearchClient: errorCrossProductSearchClient,
        }),
        'getSearchResults',
      );

      try {
        await getSearchResults('query', sessionId, 100, 0);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    it('should call cross product search client with correct query version', async () => {
      const searchSpy = jest.spyOn(noResultsCrossProductSearchClient, 'search');
      const dummyQueryVersion = 123;

      const modelParams = [
        {
          '@type': 'queryParams',
          queryVersion: dummyQueryVersion,
        },
        {
          '@type': 'currentProject',
          projectId: '123-container',
        },
      ];

      const getSearchResults = getQuickSearchProperty(
        renderComponent({
          crossProductSearchClient: noResultsCrossProductSearchClient,
        }),
        'getSearchResults',
      );

      getSearchResults('query', sessionId, 100, dummyQueryVersion);

      expect(searchSpy).toHaveBeenCalledWith({
        query: 'query',
        sessionId: sessionId,
        referrerId: '123-search-referrer',
        scopes: expect.any(Array),
        modelParams,
        resultLimit: expect.any(Number),
      });

      searchSpy.mockRestore();
    });

    it('should return search results', async () => {
      const peopleSearchClient = mockPeopleSearchClient({
        recentPeople: [],
      });

      const resultsMap = {} as SearchResultsMap;
      resultsMap[Scope.JiraIssue] = {
        items: issues,
        totalSize: issues.length,
      };
      resultsMap[Scope.JiraBoardProjectFilter] = {
        items: boards,
        totalSize: boards.length,
      };
      const crossProductSearchClient = mockCrossProductSearchClient(
        {
          results: resultsMap,
        },
        DEFAULT_AB_TEST,
      );
      const getSearchResults = getQuickSearchProperty(
        renderComponent({ peopleSearchClient, crossProductSearchClient }),
        'getSearchResults',
      );
      const searchResults = await getSearchResults('query', sessionId, 100, 0);
      expect(searchResults).toMatchObject({
        results: {
          objects: issues,
          containers: boards,
        },
        timings: {
          crossProductSearchElapsedMs: expect.any(Number),
          peopleElapsedMs: expect.any(Number),
        },
      });
      expect(logger.safeError).toHaveBeenCalledTimes(0);
    });

    it('should not return people search results if no browse permission', async () => {
      const peopleSearchClient = mockPeopleSearchClient({
        recentPeople: [],
      });

      const resultsMap = {} as SearchResultsMap;
      resultsMap[Scope.JiraIssue] = {
        items: issues,
        totalSize: issues.length,
      };
      resultsMap[Scope.JiraBoardProjectFilter] = {
        items: boards,
        totalSize: boards.length,
      };

      const crossProductSearchClient = mockCrossProductSearchClient(
        {
          results: resultsMap,
          abTest: DEFAULT_AB_TEST,
        },
        DEFAULT_AB_TEST,
      );
      const getSearchResults = getQuickSearchProperty(
        renderComponent({
          peopleSearchClient,
          crossProductSearchClient,
          jiraClient: mockNoResultJiraClient(false),
        }),
        'getSearchResults',
      );
      const searchResults = await getSearchResults('query', sessionId, 100, 0);
      expect(searchResults).toMatchObject({
        results: {
          objects: issues,
          containers: boards,
          people: [],
        },
        timings: {
          crossProductSearchElapsedMs: expect.any(Number),
          peopleElapsedMs: expect.any(Number),
        },
      });
      expect(logger.safeError).toHaveBeenCalledTimes(0);
    });

    describe('Advanced Search callback', () => {
      let redirectSpy: jest.SpyInstance<
        void,
        [SearchUtils.JiraEntityTypes, (string | undefined)?]
      >;
      let originalWindowLocation = window.location;

      beforeEach(() => {
        delete window.location;
        window.location = Object.assign({}, window.location, {
          assign: jest.fn(),
        });
        redirectSpy = jest.spyOn(SearchUtils, 'redirectToJiraAdvancedSearch');
      });

      afterEach(() => {
        window.location = originalWindowLocation;
        redirectSpy.mockReset();
        redirectSpy.mockRestore();
      });

      const mountComponent = (
        spy:
          | jest.Mock<{}>
          | jest.Mock<any>
          | ((
              e: CancelableEvent,
              entity: string,
              query: string,
              searchSessionId: string,
            ) => void)
          | undefined,
      ) => {
        const wrapper = renderComponent({
          onAdvancedSearch: spy,
        });
        const quickSearchContainer = wrapper.find(
          BaseJiraQuickSearchContainerJira,
        );

        const props = quickSearchContainer.props() as any;
        expect(props).toHaveProperty('handleSearchSubmit');

        return props['handleSearchSubmit'];
      };
      const mockEvent = () => ({
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        target: {
          value: 'query',
        },
      });
      const mockSearchSessionId = 'someSearchSessionId';

      it('should call onAdvancedSearch call', () => {
        const spy = jest.fn();
        const handleSearchSubmit = mountComponent(spy);
        const mockedEvent = mockEvent();
        handleSearchSubmit(mockedEvent, mockSearchSessionId);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            preventDefault: expect.any(Function),
          }),
          'issues',
          'query',
          mockSearchSessionId,
        );
        expect(mockedEvent.preventDefault).toHaveBeenCalledTimes(0);
        expect(mockedEvent.stopPropagation).toHaveBeenCalledTimes(0);
        expect(redirectSpy).toHaveBeenCalledTimes(1);
      });

      it('should not call redirect', () => {
        const spy = jest.fn(e => e.preventDefault());
        const handleSearchSubmit = mountComponent(spy);
        const mockedEvent = mockEvent();
        handleSearchSubmit(mockedEvent, mockSearchSessionId);

        expect(mockedEvent.preventDefault).toHaveBeenCalledTimes(1);
        expect(mockedEvent.stopPropagation).toHaveBeenCalledTimes(1);
        expect(redirectSpy).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('faster search', () => {
    const mockSearchResults: JiraResultsMap = {
      objects: issues,
      containers: boards,
      people: [makePersonResult()],
    };

    const recentItemCommon1a = 'Common-1-A';
    const recentItemCommon1b = 'Common-1-B';
    const recentItemCommon2 = 'Common-2';

    const mockRecentItems: JiraResultsMap = {
      objects: [
        makeJiraObjectResult({
          resultId: recentItemCommon2,
          name: recentItemCommon2,
          contentType: ContentType.JiraIssue,
          objectKey: 'TEST-123',
        }),
        makeJiraObjectResult({
          resultId: recentItemCommon1a,
          name: recentItemCommon1a,
          contentType: ContentType.JiraIssue,
          objectKey: 'TEST-1',
        }),
        makeJiraObjectResult({
          resultId: recentItemCommon1b,
          name: recentItemCommon1b,
          contentType: ContentType.JiraIssue,
          objectKey: 'TEST-2',
        }),
      ],
      containers: [
        makeJiraObjectResult({
          name: 'Common-Board',
          contentType: ContentType.JiraBoard,
        }),
      ],
      people: [makePersonResult()],
    };

    it('should show filtered list of recent issues when loading', () => {
      const component = renderComponent({
        features: {
          ...DEFAULT_FEATURES,
          isInFasterSearchExperiment: true,
        },
      });

      const displayedResults = (component.instance() as JiraQuickSearchContainer).getPostQueryDisplayedResults(
        mockSearchResults,
        'common-1',
        mockRecentItems,
        true,
        'some-session-id',
      );

      // We expect 4 groups: advanced, objects, containers and people
      expect(displayedResults.length).toBe(4);
      // Only show the first group (issues) when loading, we also expect the results to be filtered by name
      const issueNames = displayedResults
        .find(result => result.key === 'issues')!
        .items.map(issue => issue.name);
      expect(issueNames).toEqual([recentItemCommon1a, recentItemCommon1b]);

      // Expect all the other results to be empty (we also exclude issue-advanced because that's a group hacked on to show advanced search)
      displayedResults
        .filter(
          result => result.key !== 'issues' && result.key !== 'issue-advanced',
        )
        .forEach(resultGroup => {
          expect(resultGroup.items.length).toBe(0);
        });
    });

    it('should include issue keys when filtering', () => {
      const component = renderComponent({
        features: {
          ...DEFAULT_FEATURES,
          isInFasterSearchExperiment: true,
        },
      });

      const displayedResults = (component.instance() as JiraQuickSearchContainer).getPostQueryDisplayedResults(
        mockSearchResults,
        'test-1',
        mockRecentItems,
        true,
        'some-session-id',
      );

      // We expect 4 groups: advanced, objects, containers and people
      expect(displayedResults.length).toBe(4);
      // The results are filtered by issue-key
      const issueKeys = displayedResults
        .find(result => result.key === 'issues')!
        .items.map(issue => issue.objectKey);
      expect(issueKeys).toEqual(['TEST-123', 'TEST-1']);
    });

    it('should show issueKey matches before title matches', () => {
      const recentItems: JiraResultsMap = {
        objects: [
          makeJiraObjectResult({
            resultId: recentItemCommon1a,
            name: 'This issue has TEST-123 in the title',
            contentType: ContentType.JiraIssue,
            objectKey: 'TEST-4',
          }),
          makeJiraObjectResult({
            resultId: recentItemCommon2,
            name: recentItemCommon2,
            contentType: ContentType.JiraIssue,
            objectKey: 'TEST-123',
          }),
          makeJiraObjectResult({
            resultId: recentItemCommon1b,
            name: recentItemCommon1b,
            contentType: ContentType.JiraIssue,
            objectKey: 'TEST-12',
          }),
        ],
        containers: [],
        people: [],
      };

      const component = renderComponent({
        features: {
          ...DEFAULT_FEATURES,
          isInFasterSearchExperiment: true,
        },
      });

      const displayedResults = (component.instance() as JiraQuickSearchContainer).getPostQueryDisplayedResults(
        mockSearchResults,
        'test-1',
        recentItems,
        true,
        'some-session-id',
      );

      expect(displayedResults.length).toBe(4);
      const issueKeys = displayedResults
        .find(result => result.key === 'issues')!
        .items.map(issue => issue.objectKey);
      // The issueKey matches should appear before the title matches
      expect(issueKeys).toEqual(['TEST-123', 'TEST-12', 'TEST-4']);
    });

    it('should show normal list of issues when not loading with matching recent items at the top', () => {
      const component = renderComponent({
        features: {
          ...DEFAULT_FEATURES,
          isInFasterSearchExperiment: true,
        },
      });

      const displayedResults = (component.instance() as JiraQuickSearchContainer).getPostQueryDisplayedResults(
        mockSearchResults,
        'common-1',
        mockRecentItems,
        false,
        'some-session-id',
      );

      // We expect 4 groups: advanced, objects, containers and people
      expect(displayedResults.length).toBe(4);
      // Only show the first group (issues) when loading, we also expect the results to be filtered by name
      const issueNames = displayedResults
        .find(result => result.key === 'issues')!
        .items.map(issue => issue.name);
      const searchResultNames = mockSearchResults.objects.map(
        issue => issue.name,
      );
      expect(issueNames).toEqual([
        recentItemCommon1a,
        recentItemCommon1b,
        ...searchResultNames,
      ]);

      // Expect all the other results to not be empty (we also exclude search-jira because that's a group hacked on to show advanced search)
      displayedResults
        .filter(result => result.key !== 'issues')
        .forEach(resultGroup => {
          expect(resultGroup.items.length).not.toBe(0);
        });
    });
  });
});
