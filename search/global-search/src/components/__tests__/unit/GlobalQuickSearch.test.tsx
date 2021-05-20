import React from 'react';
import { mount } from 'enzyme';
import MockDate from 'mockdate';
import GlobalQuickSearchWithAnalytics, {
  GlobalQuickSearch,
  Props,
} from '../../GlobalQuickSearch';
import * as AnalyticsHelper from '../../../util/analytics-event-helper';
import { CreateAnalyticsEventFn } from '../../analytics/types';
import { ReferralContextIdentifiers } from '../../GlobalQuickSearchWrapper';
import {
  FilterType,
  FilterWithMetadata,
} from '../../../api/CrossProductSearchClient';

const noop = () => {};
const DEFAULT_PROPS = {
  onSearch: noop,
  onAutocomplete: noop,
  onMount: noop,
  isLoading: false,
  searchSessionId: 'abc',
  children: [],
  advancedSearchId: 'product_advanced_search',
};
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function render(partialProps: Partial<Props>) {
  const props: Props = {
    ...DEFAULT_PROPS,
    ...partialProps,
  };

  return mount(<GlobalQuickSearch {...props} />);
}

describe('GlobalQuickSearch', () => {
  describe('GlobalQuickSearchWithAnalytics', () => {
    it('should render GlobalQuickSearch with a createAnalyticsEvent prop', () => {
      const wrapper = mount(
        <GlobalQuickSearchWithAnalytics {...DEFAULT_PROPS} />,
      );
      expect(
        wrapper.find(GlobalQuickSearch).prop('createAnalyticsEvent'),
      ).toBeDefined();
    });
  });

  it('should call onMount on mount, duh', () => {
    const onMountMock = jest.fn();
    render({ onMount: onMountMock });
    expect(onMountMock).toHaveBeenCalled();
  });

  it('should handle search input', () => {
    const searchMock = jest.fn();
    const wrapper = render({ onSearch: searchMock });

    const onSearchInput: Function = wrapper
      .find('QuickSearch')
      .prop('onSearchInput');
    onSearchInput({ target: { value: 'foo' } });

    expect(searchMock).toHaveBeenCalledWith('foo', 0, undefined);
  });

  it('should handle searching with filter applied', () => {
    const searchMock = jest.fn();
    const filters: FilterWithMetadata[] = [
      { filter: { '@type': FilterType.Spaces, spaceKeys: ['TEST'] } },
    ];
    const wrapper = render({ onSearch: searchMock, filters });

    const onSearchInput: Function = wrapper
      .find('QuickSearch')
      .prop('onSearchInput');
    onSearchInput({ target: { value: 'foo' } });

    expect(searchMock).toHaveBeenCalledWith('foo', 0, filters);
  });

  it('should fire searches with the queryVersion parameter incrementing', () => {
    const searchMock = jest.fn();
    const wrapper = render({ onSearch: searchMock });

    const onSearchInput: Function = wrapper
      .find('QuickSearch')
      .prop('onSearchInput');

    onSearchInput({ target: { value: 'foo' } });
    expect(searchMock).toHaveBeenNthCalledWith(1, 'foo', 0, undefined);

    onSearchInput({ target: { value: 'foo' } });
    expect(searchMock).toHaveBeenNthCalledWith(2, 'foo', 1, undefined);
  });

  it('should trim the search input', () => {
    const searchMock = jest.fn();
    const wrapper = render({ onSearch: searchMock });

    const onSearchInput: Function = wrapper
      .find('QuickSearch')
      .prop('onSearchInput');
    onSearchInput({ target: { value: '  pattio   ' } });

    expect(searchMock).toHaveBeenCalledWith('pattio', 0, undefined);
  });

  describe('Autocomplete', () => {
    let fireAutocompleteRenderedEventSpy: jest.SpyInstance<
      void,
      [number, string, string, string, number, boolean, CreateAnalyticsEventFn?]
    >;

    let fireAutocompleteCompletedEventSpy: jest.SpyInstance<
      void,
      [string, string, string, CreateAnalyticsEventFn?]
    >;

    beforeEach(() => {
      fireAutocompleteRenderedEventSpy = jest.spyOn(
        AnalyticsHelper,
        'fireAutocompleteRenderedEvent',
      );
      fireAutocompleteCompletedEventSpy = jest.spyOn(
        AnalyticsHelper,
        'fireAutocompleteCompletedEvent',
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should fire fireAutocompleteRenderedEvent when autocomplete suggestions rendered', () => {
      const wrapper = render({});

      const onSearchInput: Function = wrapper
        .find('QuickSearch')
        .prop('onSearchInput');
      onSearchInput({ target: { value: 'au' } });
      expect(fireAutocompleteRenderedEventSpy.mock.calls.length).toBe(0);

      wrapper.setProps({ autocompleteSuggestions: ['auto', 'autocomplete'] });
      expect(fireAutocompleteRenderedEventSpy.mock.calls.length).toBe(1);
      expect(fireAutocompleteRenderedEventSpy.mock.calls[0][0]).toBeGreaterThan(
        -1,
      );
      expect(fireAutocompleteRenderedEventSpy.mock.calls[0][1]).toBe('abc');
      expect(fireAutocompleteRenderedEventSpy.mock.calls[0][2]).toBe('au');
      expect(fireAutocompleteRenderedEventSpy.mock.calls[0][3]).toBe('auto');
      expect(fireAutocompleteRenderedEventSpy.mock.calls[0][4]).toBe(0);
      expect(fireAutocompleteRenderedEventSpy.mock.calls[0][5]).toBe(false);
    });

    it('should fire fireAutocompleteRenderedEvent when autocomplete suggestions rendered from cache', () => {
      const wrapper = render({
        autocompleteSuggestions: ['auto', 'autocomplete'],
      });

      const onSearchInput: Function = wrapper
        .find('QuickSearch')
        .prop('onSearchInput');

      onSearchInput({ target: { value: 'au' } });
      expect(wrapper.state('query')).toBe('au');
      // Emulating getDerivedStateFromProps as it's not called by enzyme :(
      wrapper.setState(
        GlobalQuickSearch.getDerivedStateFromProps(
          {
            ...DEFAULT_PROPS,
            autocompleteSuggestions: ['auto', 'autocomplete'],
          },
          {
            query: 'au',
            autocompleteText: undefined,
          },
        ),
      );

      expect(fireAutocompleteRenderedEventSpy.mock.calls.length).toBe(1);
      expect(fireAutocompleteRenderedEventSpy.mock.calls[0][0]).toBeGreaterThan(
        -1,
      );
      expect(fireAutocompleteRenderedEventSpy.mock.calls[0][1]).toBe('abc');
      expect(fireAutocompleteRenderedEventSpy.mock.calls[0][2]).toBe('au');
      expect(fireAutocompleteRenderedEventSpy.mock.calls[0][3]).toBe('auto');
      expect(fireAutocompleteRenderedEventSpy.mock.calls[0][4]).toBe(0);
      expect(fireAutocompleteRenderedEventSpy.mock.calls[0][5]).toBe(true);
    });

    it('should increase version when user autosuggestion updates', () => {
      const wrapper = render({});

      const onSearchInput: Function = wrapper
        .find('QuickSearch')
        .prop('onSearchInput');

      onSearchInput({ target: { value: 'au' } });

      wrapper.setProps({ autocompleteSuggestions: ['auto', 'australia'] });
      expect(fireAutocompleteRenderedEventSpy.mock.calls[0][4]).toBe(0);
      onSearchInput({ target: { value: 'aus' } });
      wrapper.setProps({ autocompleteSuggestions: ['australia'] });
      expect(fireAutocompleteRenderedEventSpy.mock.calls[1][4]).toBe(1);
    });

    it('should measure duration between autocomplete renders', async () => {
      MockDate.reset();
      const wrapper = render({});

      const onSearchInput: Function = wrapper
        .find('QuickSearch')
        .prop('onSearchInput');

      onSearchInput({ target: { value: 'au' } });

      const latency = 100;
      await sleep(latency);

      wrapper.setProps({ autocompleteSuggestions: ['auto', 'australia'] });
      expect(
        fireAutocompleteRenderedEventSpy.mock.calls[0][0],
      ).toBeGreaterThanOrEqual(latency);
    });

    it('should not fire fireAutocompleteRenderedEvent on initial render', () => {
      render({});
      expect(fireAutocompleteRenderedEventSpy.mock.calls.length).toBe(0);
    });

    it('should not fire fireAutocompleteRenderedEvent if query is empty', () => {
      render({ autocompleteSuggestions: ['auto', 'complete'] });
      expect(fireAutocompleteRenderedEventSpy.mock.calls.length).toBe(0);
    });

    it('should fire fireAutocompleteCompletedEvent when user accepts autcomplete suggestion', () => {
      const wrapper = render({
        autocompleteSuggestions: ['auto', 'autocomplete'],
      });

      const onSearchInput: Function = wrapper
        .find('QuickSearch')
        .prop('onSearchInput');

      onSearchInput({ target: { value: 'au' } });

      expect(fireAutocompleteCompletedEventSpy.mock.calls.length).toBe(0);
      onSearchInput({ target: { value: 'auto ' } }, true);
      expect(fireAutocompleteCompletedEventSpy.mock.calls.length).toBe(1);
      expect(fireAutocompleteCompletedEventSpy.mock.calls[0][0]).toBe('abc');
      expect(fireAutocompleteCompletedEventSpy.mock.calls[0][1]).toBe('au');
      expect(fireAutocompleteCompletedEventSpy.mock.calls[0][2]).toBe('auto ');
    });
  });

  describe('Search result events', () => {
    const searchSessionId = 'random-session-id';
    let fireHighlightEventSpy: jest.SpyInstance<
      void,
      [
        AnalyticsHelper.KeyboardControlEvent,
        string,
        ReferralContextIdentifiers?,
        CreateAnalyticsEventFn?,
      ]
    >;
    let fireSearchResultSelectedEventSpy: jest.SpyInstance<
      void,
      [
        AnalyticsHelper.SelectedSearchResultEvent,
        string,
        ReferralContextIdentifiers?,
        CreateAnalyticsEventFn?,
      ]
    >;
    let fireAdvancedSearchSelectedEventSpy: jest.SpyInstance<
      void,
      [
        AnalyticsHelper.AdvancedSearchSelectedEvent,
        string,
        ReferralContextIdentifiers?,
        CreateAnalyticsEventFn?,
      ]
    >;
    beforeEach(() => {
      fireHighlightEventSpy = jest.spyOn(
        AnalyticsHelper,
        'fireHighlightedSearchResult',
      );
      fireSearchResultSelectedEventSpy = jest.spyOn(
        AnalyticsHelper,
        'fireSelectedSearchResult',
      );
      fireAdvancedSearchSelectedEventSpy = jest.spyOn(
        AnalyticsHelper,
        'fireSelectedAdvancedSearch',
      );
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    const deepRender = (): Function =>
      render({ searchSessionId })
        .find('QuickSearch')
        .prop('firePrivateAnalyticsEvent');

    ['ArrowUp', 'ArrowDown'].forEach((key) => {
      it('should trigger highlight event', () => {
        const firePrivateAnalyticsEvent = deepRender();
        const eventData = {
          resultId: 'result-id',
          type: 'recent-result',
          contentType: 'confluence-page',
          sectionIndex: 2,
          index: 11,
          indexWithinSection: 2,
          key,
        };
        // call
        firePrivateAnalyticsEvent(
          'atlaskit.navigation.quick-search.keyboard-controls-used',
          eventData,
        );

        // asserts
        expect(fireHighlightEventSpy.mock.calls.length).toBe(1);
        expect(fireHighlightEventSpy.mock.calls[0][0]).toMatchObject(eventData);
        expect(fireHighlightEventSpy.mock.calls[0][1]).toBe(searchSessionId);

        // verify other spies are not called
        [
          fireAdvancedSearchSelectedEventSpy,
          fireSearchResultSelectedEventSpy,
        ].forEach((spy) => expect(spy.mock.calls.length).toBe(0));
      });
    });

    it('should not fire highlight event on enter', () => {
      const firePrivateAnalyticsEvent = deepRender();
      const eventData = {
        resultId: 'result-id',
        type: 'recent-result',
        contentType: 'confluence-page',
        sectionIndex: 2,
        index: 11,
        indexWithinSection: 2,
        key: 'Enter',
      };
      // call
      firePrivateAnalyticsEvent(
        'atlaskit.navigation.quick-search.keyboard-controls-used',
        eventData,
      );

      // verify
      [
        fireAdvancedSearchSelectedEventSpy,
        fireSearchResultSelectedEventSpy,
        fireHighlightEventSpy,
      ].forEach((spy) => expect(spy.mock.calls.length).toBe(0));
    });

    it('should fire selected search event', () => {
      const firePrivateAnalyticsEvent = deepRender();
      const eventData = {
        resultId: 'result-id',
        type: 'recent-result',
        contentType: 'confluence-page',
        sectionIndex: 2,
        index: 11,
        indexWithinSection: 2,
        method: 'click',
        newTab: false,
      };

      // call
      firePrivateAnalyticsEvent(
        'atlaskit.navigation.quick-search.submit',
        eventData,
      );

      // assert
      expect(fireSearchResultSelectedEventSpy.mock.calls.length).toBe(1);
      expect(fireSearchResultSelectedEventSpy.mock.calls[0][0]).toMatchObject(
        eventData,
      );
      expect(fireSearchResultSelectedEventSpy.mock.calls[0][1]).toBe(
        searchSessionId,
      );

      // verify
      [
        fireAdvancedSearchSelectedEventSpy,
        fireHighlightEventSpy,
      ].forEach((spy) => expect(spy.mock.calls.length).toBe(0));
    });

    it('should fire advanced search event', () => {
      const firePrivateAnalyticsEvent = deepRender();
      const eventData = {
        resultId: 'search_confluence',
        type: 'recent-result',
        contentType: 'confluence-page',
        sectionIndex: 2,
        index: 11,
        indexWithinSection: 2,
        method: 'click',
        newTab: false,
      };

      // call
      firePrivateAnalyticsEvent(
        'atlaskit.navigation.quick-search.submit',
        eventData,
      );

      // assert
      expect(fireAdvancedSearchSelectedEventSpy.mock.calls.length).toBe(1);
      expect(fireAdvancedSearchSelectedEventSpy.mock.calls[0][0]).toMatchObject(
        eventData,
      );
      expect(fireAdvancedSearchSelectedEventSpy.mock.calls[0][1]).toBe(
        searchSessionId,
      );

      // verify
      [fireSearchResultSelectedEventSpy, fireHighlightEventSpy].forEach((spy) =>
        expect(spy.mock.calls.length).toBe(0),
      );
    });
  });
});
