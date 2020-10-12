import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import {
  ABTest,
  DEFAULT_AB_TEST,
  FilterType,
  FilterWithMetadata,
} from '../../../../api/CrossProductSearchClient';
import { CreateAnalyticsEventFn } from '../../../analytics/types';
import {
  PartiallyLoadedRecentItems,
  Props,
  QuickSearchContainer,
} from '../../QuickSearchContainer';
import { GlobalQuickSearch } from '../../../GlobalQuickSearch';
import * as AnalyticsHelper from '../../../../util/analytics-event-helper';
import {
  PerformanceTiming,
  ShownAnalyticsAttributes,
} from '../../../../util/analytics-util';
import { ReferralContextIdentifiers } from '../../../GlobalQuickSearchWrapper';
import { QuickSearchContext } from '../../../../api/types';
import { mockLogger } from '../../../../__tests__/unit/mocks/_mockLogger';
import {
  JiraResultsMap,
  ConfluenceResultsMap,
  ResultsGroup,
  ResultsWithTiming,
} from '../../../../model/Result';
import uuid from 'uuid/v4';
import { DEFAULT_FEATURES } from '../../../../util/features';
import keycode from 'keycode';

const defaultAutocompleteData = ['autocomplete', 'automock', 'automation'];
const defaultReferralContext = {
  searchReferrerId: 'referrerId',
  currentContentId: 'currentContentId',
  currentContainerId: 'currentContainerId',
};

type GenericResultMap = JiraResultsMap | ConfluenceResultsMap;

const mapToResultGroup = (resultMap: GenericResultMap): ResultsGroup[] =>
  Object.keys(resultMap).map(key => ({
    key,
    title: `title_${key}` as any,
    items: resultMap[key] as any[],
    showTotalSize: false,
    totalSize: 0,
  }));

const mockEvent: any = {
  context: [],
  update: jest.fn(() => mockEvent),
  fire: jest.fn(() => mockEvent),
};

const defaultProps: Props<GenericResultMap> = {
  product: 'confluence' as QuickSearchContext,
  logger: mockLogger(),
  getSearchResultsComponent: jest.fn(() => null),
  getRecentItems: jest.fn(() => ({
    eagerRecentItemsPromise: Promise.resolve({ results: {} as any }),
    lazyLoadedRecentItemsPromise: Promise.resolve({}),
  })),
  getSearchResults: jest.fn(() => Promise.resolve({ results: {} as any })),
  getAutocompleteSuggestions: jest.fn(() =>
    Promise.resolve(defaultAutocompleteData),
  ),
  createAnalyticsEvent: jest.fn(() => mockEvent),
  handleSearchSubmit: jest.fn(),
  referralContextIdentifiers: defaultReferralContext,
  getPreQueryDisplayedResults: jest.fn(mapToResultGroup),
  getPostQueryDisplayedResults: jest.fn(mapToResultGroup),
  advancedSearchId: 'product_advanced_search',
  features: DEFAULT_FEATURES,
};

const mountQuickSearchContainer = (
  partialProps?: Partial<Props<GenericResultMap>>,
) => {
  const props = {
    ...defaultProps,
    ...partialProps,
  };
  return mount(<QuickSearchContainer {...props} searchSessionId={uuid()} />);
};

const mountQuickSearchContainerWaitingForRender = async (
  partialProps?: Partial<Props<GenericResultMap>>,
) => {
  const wrapper = mountQuickSearchContainer(partialProps);
  await wrapper.instance().componentDidMount!();
  wrapper.update();
  return wrapper;
};

const assertLastCall = (spy: jest.Mock<{}>, obj: {} | any[]) => {
  expect(spy).toHaveBeenCalled();
  const getSearchResultComponentLastCall =
    spy.mock.calls[spy.mock.calls.length - 1];
  expect(getSearchResultComponentLastCall[0]).toMatchObject(obj);
};

describe('QuickSearchContainer', () => {
  let firePreQueryShownEventSpy: jest.SpyInstance<
    void,
    [
      ShownAnalyticsAttributes,
      number,
      number,
      string,
      CreateAnalyticsEventFn,
      ABTest,
      ReferralContextIdentifiers?,
      boolean?,
    ]
  >;
  let firePostQueryShownEventSpy: jest.SpyInstance<
    void,
    [
      ShownAnalyticsAttributes,
      PerformanceTiming,
      string,
      string,
      { [filter: string]: boolean },
      CreateAnalyticsEventFn,
      ABTest,
      ReferralContextIdentifiers?,
    ]
  >;
  let fireExperimentExposureEventSpy: jest.SpyInstance<
    void,
    [ABTest, string, CreateAnalyticsEventFn]
  >;

  const assertPreQueryAnalytics = (
    recentItems: Record<any, any>,
    abTest: ABTest,
  ) => {
    expect(firePreQueryShownEventSpy).toBeCalled();
    expect(defaultProps.getPreQueryDisplayedResults).toBeCalled();
    expect(defaultProps.getPostQueryDisplayedResults).not.toBeCalled();

    const lastCall =
      firePreQueryShownEventSpy.mock.calls[
        firePreQueryShownEventSpy.mock.calls.length - 1
      ];
    expect(lastCall).toMatchObject([
      expect.objectContaining({
        resultCount: Object.keys(recentItems)
          .map(key => recentItems[key])
          .reduce((acc, arr) => acc + arr.length, 0),
        resultSectionCount: Object.keys(recentItems).length,
      }),
      expect.any(Number),
      expect.any(Number),
      expect.any(String),
      defaultProps.createAnalyticsEvent,
      abTest,
      defaultReferralContext,
      expect.any(Boolean),
    ]);
  };

  const assertPostQueryAnalytics = (
    query: string,
    searchResults: {
      [x: string]: any;
      spaces?: { key: string }[] | { key: string }[];
    },
    filtersApplied: { [filterType: string]: boolean } = {},
  ) => {
    expect(firePostQueryShownEventSpy).toBeCalled();
    expect(defaultProps.getPostQueryDisplayedResults).toBeCalled();

    const lastCall =
      firePostQueryShownEventSpy.mock.calls[
        firePostQueryShownEventSpy.mock.calls.length - 1
      ];
    expect(lastCall).toMatchObject([
      expect.objectContaining({
        resultCount: Object.keys(searchResults)
          .map(key => searchResults[key])
          .reduce((acc, arr) => acc + arr.length, 0),
        resultSectionCount: Object.keys(searchResults).length,
      }),
      expect.objectContaining({
        startTime: expect.any(Number),
        elapsedMs: expect.any(Number),
      }),
      expect.any(String),
      query,
      filtersApplied,
      defaultProps.createAnalyticsEvent,
      DEFAULT_AB_TEST,
      defaultReferralContext,
    ]);
  };

  const assertExposureEventAnalytics = (abTest: ABTest) => {
    expect(fireExperimentExposureEventSpy).toBeCalledWith(
      abTest,
      expect.any(String),
      defaultProps.createAnalyticsEvent,
    );
  };

  beforeEach(() => {
    firePreQueryShownEventSpy = jest.spyOn(
      AnalyticsHelper,
      'firePreQueryShownEvent',
    );
    firePostQueryShownEventSpy = jest.spyOn(
      AnalyticsHelper,
      'firePostQueryShownEvent',
    );
    fireExperimentExposureEventSpy = jest.spyOn(
      AnalyticsHelper,
      'fireExperimentExposureEvent',
    );
  });

  afterEach(() => {
    // reset mocks of default props
    jest.clearAllMocks();
  });

  it('should render GlobalQuickSearch with loading before recent items is retrieved', async () => {
    const wrapper = mountQuickSearchContainer();

    const globalQuickSearch = wrapper.find(GlobalQuickSearch);
    expect(globalQuickSearch.length).toBe(1);
    expect(globalQuickSearch.props().isLoading).toBe(true);
  });

  it('should add searchSessionId to handleSearchSubmit', async () => {
    const wrapper = await mountQuickSearchContainerWaitingForRender();
    wrapper
      .find('input')
      .simulate('keydown', { key: 'Enter', keyCode: keycode('enter') });
    wrapper.update();

    const { searchSessionId } = wrapper.find(QuickSearchContainer).props();
    expect(searchSessionId).not.toBeNull();

    expect(defaultProps.handleSearchSubmit).toHaveBeenCalledWith(
      expect.anything(),
      searchSessionId,
    );
  });

  describe('Recent Items', () => {
    const recentItems = {
      recentPages: [
        {
          id: 'page-1',
        },
      ],
    };

    const lazyLoadedRecentItems = {
      recentPeople: [
        {
          id: 'person-1',
        },
      ],
    };

    const expectedRecentItems = {
      ...recentItems,
      ...lazyLoadedRecentItems,
    };

    it('should render recent items after mount', async () => {
      const getRecentItems = jest.fn<
        PartiallyLoadedRecentItems<GenericResultMap>,
        []
      >(() => ({
        eagerRecentItemsPromise: Promise.resolve({
          results: recentItems as any,
        }),
        lazyLoadedRecentItemsPromise: Promise.resolve(
          lazyLoadedRecentItems as any,
        ),
      }));

      const wrapper = await mountQuickSearchContainerWaitingForRender({
        getRecentItems,
      });

      // after update
      const globalQuickSearch = wrapper.find(GlobalQuickSearch);
      expect(globalQuickSearch.props().isLoading).toBe(false);
      expect(getRecentItems).toHaveBeenCalled();
      assertLastCall(defaultProps.getSearchResultsComponent as any, {
        recentItems: expectedRecentItems,
        isLoading: false,
        isError: false,
      });

      assertPreQueryAnalytics(expectedRecentItems, DEFAULT_AB_TEST);
      assertExposureEventAnalytics(DEFAULT_AB_TEST);
    });

    it('should render eager recent items before lazy one', async () => {
      let eagerResolveFn = () => {};
      let lazyResolveFn = () => {};

      const eagerRecentItemsPromise: Promise<ResultsWithTiming<
        GenericResultMap
      >> = new Promise(resolve => {
        eagerResolveFn = () => resolve({ results: recentItems as any });
      });
      const lazyLoadedRecentItemsPromise: Promise<Partial<
        GenericResultMap
      >> = new Promise(resolve => {
        lazyResolveFn = () => resolve(lazyLoadedRecentItems as any);
      });

      const getRecentItems = jest.fn<
        PartiallyLoadedRecentItems<GenericResultMap>,
        []
      >(() => ({
        eagerRecentItemsPromise,
        lazyLoadedRecentItemsPromise,
      }));

      await eagerResolveFn();

      await mountQuickSearchContainerWaitingForRender({
        getRecentItems,
      });

      assertLastCall(defaultProps.getSearchResultsComponent as any, {
        recentItems,
        isLoading: false,
        isError: false,
      });

      await lazyResolveFn();

      assertLastCall(defaultProps.getSearchResultsComponent as any, {
        recentItems: expectedRecentItems,
        isLoading: false,
        isError: false,
      });
    });
  });

  describe('Search', () => {
    let getSearchResults: jest.Mock;

    const renderAndWait = async (getRecentItems?: undefined) => {
      const wrapper = await mountQuickSearchContainerWaitingForRender({
        getSearchResults,
        ...(getRecentItems ? { getRecentItems } : {}),
      });
      return wrapper;
    };

    const search = async (
      wrapper:
        | ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>
        | ReactWrapper<{}, {}, React.Component<{}, {}, any>>,
      query: string,
      resultPromise:
        | Promise<{ results: { spaces: { key: string }[] } }>
        | Promise<never>
        | Promise<{ results: { spaces: { key: string }[] } }>,
      filters: FilterWithMetadata[] = [],
    ) => {
      getSearchResults.mockReturnValueOnce(resultPromise);
      let globalQuickSearch = wrapper.find(GlobalQuickSearch);
      await globalQuickSearch.props().onSearch(query, 0, filters);

      globalQuickSearch = wrapper.find(GlobalQuickSearch);
      expect(globalQuickSearch.props().isLoading).toBe(false);

      expect(getSearchResults).toHaveBeenCalledTimes(1);
      expect(getSearchResults.mock.calls[0][0]).toBe(query);
      return wrapper;
    };

    beforeEach(() => {
      getSearchResults = jest.fn();
    });

    it('should handle search', async () => {
      const searchResults = {
        spaces: [
          {
            key: 'space-1',
          },
        ],
      };
      const query = 'query';
      const wrapper = await renderAndWait();
      await search(wrapper, query, Promise.resolve({ results: searchResults }));
      assertLastCall(defaultProps.getSearchResultsComponent as any, {
        searchResults,
        isLoading: false,
        isError: false,
      });
      assertPostQueryAnalytics(query, searchResults);
    });

    it('should handle search with filters', async () => {
      const searchResults = {
        spaces: [
          {
            key: 'space-1',
          },
        ],
      };
      const query = 'query';
      const wrapper = await renderAndWait();
      await search(
        wrapper,
        query,
        Promise.resolve({ results: searchResults }),
        [{ filter: { '@type': FilterType.Spaces, spaceKeys: ['abc123'] } }],
      );
      assertLastCall(defaultProps.getSearchResultsComponent as any, {
        searchResults,
        isLoading: false,
        isError: false,
      });
      assertPostQueryAnalytics(query, searchResults, { spaces: true });
    });

    it('should be able to retry search with same query', async () => {
      const query = 'query';
      const wrapper = await renderAndWait();
      await search(
        wrapper,
        query,
        Promise.reject(new Error('something wrong')),
      );

      expect(getSearchResults).toHaveBeenCalledTimes(1);

      (wrapper.instance() as QuickSearchContainer<
        ConfluenceResultsMap
      >).retrySearch();

      expect(getSearchResults).toHaveBeenCalledTimes(2);
    });

    it('should handle error', async () => {
      const query = 'queryWithError';
      const wrapper = await renderAndWait();
      await search(
        wrapper,
        query,
        Promise.reject(new Error('something wrong')),
      );
      assertLastCall(defaultProps.getSearchResultsComponent as any, {
        isLoading: false,
        isError: true,
        latestSearchQuery: query,
      });
    });

    it('should clear error after new query', async () => {
      const query = 'queryWithError2';
      const wrapper = await renderAndWait();
      await search(
        wrapper,
        query,
        Promise.reject(new Error('something wrong')),
      );
      assertLastCall(defaultProps.getSearchResultsComponent as any, {
        isLoading: false,
        isError: true,
        latestSearchQuery: query,
      });

      const newQuery = 'newQuery';
      const searchResults = {
        spaces: [
          {
            key: 'space-2',
          },
        ],
      };
      getSearchResults.mockReset();
      await search(
        wrapper,
        newQuery,
        Promise.resolve({ results: searchResults }),
      );
      assertLastCall(defaultProps.getSearchResultsComponent as any, {
        isLoading: false,
        isError: false,
        latestSearchQuery: newQuery,
      });
      assertPostQueryAnalytics(newQuery, searchResults);
    });
  });

  describe('Autocomplete', () => {
    it('renders GlobalQuickSearch with undefined autocomplete data', async () => {
      const wrapper = await mountQuickSearchContainerWaitingForRender();

      const globalQuickSearch = wrapper.find(GlobalQuickSearch);
      expect(globalQuickSearch.prop('autocomplete')).toBeUndefined();
    });

    it('should call getAutocomplete when onAutocomplete is triggered', async () => {
      const query = 'auto';
      const wrapper = await mountQuickSearchContainerWaitingForRender();

      const globalQuickSearch = wrapper.find(GlobalQuickSearch);
      const onAutocomplete = globalQuickSearch.props().onAutocomplete;
      onAutocomplete && (await onAutocomplete(query));
      expect(defaultProps.getAutocompleteSuggestions).toHaveBeenCalledWith(
        query,
      );
    });

    it('should pass down the results of getAutocomplete to GlobalQuickSearch', async () => {
      const query = 'auto';
      const wrapper = await mountQuickSearchContainerWaitingForRender();

      let globalQuickSearch = wrapper.find(GlobalQuickSearch);
      const onAutocomplete = globalQuickSearch.props().onAutocomplete;
      onAutocomplete && (await onAutocomplete(query));
      wrapper.update();
      globalQuickSearch = wrapper.find(GlobalQuickSearch);
      expect(globalQuickSearch.prop('autocompleteSuggestions')).toBe(
        defaultAutocompleteData,
      );
    });

    it('should handle error', async () => {
      const query = 'auto';
      const wrapper = await mountQuickSearchContainerWaitingForRender({
        getAutocompleteSuggestions: () =>
          Promise.reject(new Error('everything is broken')),
      });

      let globalQuickSearch = wrapper.find(GlobalQuickSearch);
      const onAutocomplete = globalQuickSearch.props().onAutocomplete;
      onAutocomplete && (await onAutocomplete(query));
      globalQuickSearch = wrapper.find(GlobalQuickSearch);
      expect(globalQuickSearch.prop('autocomplete')).toBeUndefined();
    });
  });
});
