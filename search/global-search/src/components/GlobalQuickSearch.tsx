import React from 'react';

import debounce from 'lodash/debounce';
import { QuickSearch } from '@atlaskit/quick-search';
import {
  LinkComponent,
  ReferralContextIdentifiers,
} from './GlobalQuickSearchWrapper';
import {
  withAnalyticsEvents,
  AnalyticsContext,
} from '@atlaskit/analytics-next';

import {
  fireSelectedSearchResult,
  fireHighlightedSearchResult,
  SelectedSearchResultEvent,
  AdvancedSearchSelectedEvent,
  KeyboardControlEvent,
  fireSelectedAdvancedSearch,
  fireTextEnteredEvent,
  fireDismissedEvent,
  fireAutocompleteRenderedEvent,
  fireAutocompleteCompletedEvent,
} from '../util/analytics-event-helper';

import { CreateAnalyticsEventFn } from './analytics/types';
import { isAdvancedSearchResult } from './SearchResultsUtil';
import { getAutocompleteText } from '../util/autocomplete';
import { FilterWithMetadata } from './../api/CrossProductSearchClient';

const ATLASKIT_QUICKSEARCH_NS = 'atlaskit.navigation.quick-search';
const QS_ANALYTICS_EV_KB_CTRLS_USED = `${ATLASKIT_QUICKSEARCH_NS}.keyboard-controls-used`;
const QS_ANALYTICS_EV_SUBMIT = `${ATLASKIT_QUICKSEARCH_NS}.submit`;

export interface Props {
  onMount?: () => void;
  onSearch(
    query: string,
    queryVersion: number,
    filters?: FilterWithMetadata[],
  ): void;
  onSearchSubmit?(event: React.KeyboardEvent<HTMLInputElement>): void;
  onAutocomplete?(query: string): void;
  isLoading: boolean;
  placeholder?: string;
  searchSessionId: string;
  children: React.ReactNode;
  linkComponent?: LinkComponent;
  createAnalyticsEvent?: CreateAnalyticsEventFn;
  isSendSearchTermsEnabled?: boolean;
  selectedResultId?: string;
  onSelectedResultIdChanged?: (id: string | number | null) => void;
  inputControls?: JSX.Element;
  autocompleteSuggestions?: string[];
  referralContextIdentifiers?: ReferralContextIdentifiers;
  filters?: FilterWithMetadata[];
  advancedSearchId: string;
}

export interface State {
  query: string;
  autocompleteText: string | undefined;
}

/**
 * Presentational component that renders the search input and search results.
 */
export class GlobalQuickSearch extends React.Component<Props, State> {
  queryVersion: number = 0;
  autoCompleteVersion: number = 0;
  autoCompleteLastTimeStamp: number = 0;
  resultSelected: boolean = false;

  state: State = {
    query: '',
    autocompleteText: undefined,
  };

  static getDerivedStateFromProps(
    nextProps: Readonly<any>,
    prevState: State,
  ): State {
    const { autocompleteSuggestions } = nextProps;
    const { query } = prevState;

    return {
      ...prevState,
      autocompleteText: getAutocompleteText(query, autocompleteSuggestions),
    };
  }

  componentDidMount() {
    this.props.onMount && this.props.onMount();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      createAnalyticsEvent,
      searchSessionId,
      autocompleteSuggestions,
    } = this.props;
    const { query, autocompleteText } = this.state;
    if (
      query.length > 0 &&
      autocompleteText &&
      autocompleteText.length > query.length &&
      (query !== prevState.query ||
        autocompleteText !== prevState.autocompleteText)
    ) {
      const duration = +new Date() - this.autoCompleteLastTimeStamp;
      fireAutocompleteRenderedEvent(
        duration,
        searchSessionId,
        query,
        autocompleteText,
        this.autoCompleteVersion,
        autocompleteSuggestions === prevProps.autocompleteSuggestions,
        createAnalyticsEvent,
      );
      this.autoCompleteLastTimeStamp = +new Date();
      this.autoCompleteVersion++;
    }
  }

  handleSearchInput = (
    { target }: React.FormEvent<HTMLInputElement>,
    isAutocompleted?: boolean,
  ) => {
    const query = (target as HTMLInputElement).value;
    this.debouncedSearch(query);
    if (query.length > 0) {
      this.autoCompleteLastTimeStamp = +new Date();
      this.debouncedAutocomplete(query);
    }
    if (isAutocompleted) {
      const { searchSessionId, createAnalyticsEvent } = this.props;
      const { query: prevQuery } = this.state;
      fireAutocompleteCompletedEvent(
        searchSessionId,
        prevQuery,
        query,
        createAnalyticsEvent,
      );
    }
    this.setState({
      query,
    });
  };

  debouncedSearch = debounce(this.doSearch, 350);

  doSearch(query: string) {
    const {
      onSearch,
      searchSessionId,
      createAnalyticsEvent,
      filters,
    } = this.props;
    onSearch(query.trim(), this.queryVersion, filters);
    fireTextEnteredEvent(
      query,
      searchSessionId,
      this.queryVersion,
      createAnalyticsEvent,
    );
    this.queryVersion++;
  }

  debouncedAutocomplete = debounce(this.doAutocomplete, 100);

  doAutocomplete(query: string) {
    const { onAutocomplete } = this.props;
    onAutocomplete && onAutocomplete(query);
  }

  fireSearchResultSelectedEvent = (eventData: SelectedSearchResultEvent) => {
    const {
      createAnalyticsEvent,
      searchSessionId,
      referralContextIdentifiers,
      advancedSearchId,
    } = this.props;
    this.resultSelected = true;
    const resultId =
      eventData.resultCount && eventData.method === 'shortcut'
        ? advancedSearchId
        : eventData.resultId;
    if (isAdvancedSearchResult(resultId)) {
      fireSelectedAdvancedSearch(
        {
          ...eventData,
          resultId,
          query: this.state.query,
          queryVersion: this.queryVersion,
          isLoading: this.props.isLoading,
        } as AdvancedSearchSelectedEvent,
        searchSessionId,
        referralContextIdentifiers,
        createAnalyticsEvent,
      );
    } else {
      fireSelectedSearchResult(
        {
          ...eventData,
          query: this.state.query,
          queryVersion: this.queryVersion,
        },
        searchSessionId,
        referralContextIdentifiers,
        createAnalyticsEvent,
      );
    }
  };

  fireSearchResultEvents = (eventName: string, eventData: Object) => {
    const {
      createAnalyticsEvent,
      searchSessionId,
      referralContextIdentifiers,
    } = this.props;
    if (eventName === QS_ANALYTICS_EV_SUBMIT) {
      this.fireSearchResultSelectedEvent(
        eventData as SelectedSearchResultEvent,
      );
    } else if (eventName === QS_ANALYTICS_EV_KB_CTRLS_USED) {
      const data = eventData as KeyboardControlEvent;
      if (data.key === 'ArrowDown' || data.key === 'ArrowUp') {
        fireHighlightedSearchResult(
          data,
          searchSessionId,
          referralContextIdentifiers,
          createAnalyticsEvent,
        );
      }
    }
  };

  componentWillUnmount() {
    if (this.resultSelected) {
      return;
    }
    const { createAnalyticsEvent, searchSessionId } = this.props;
    fireDismissedEvent(searchSessionId, createAnalyticsEvent);
  }

  render() {
    const {
      isLoading,
      placeholder,
      linkComponent,
      children,
      onSearchSubmit,
      selectedResultId,
      onSelectedResultIdChanged,
      inputControls,
    } = this.props;
    const { query, autocompleteText } = this.state;

    return (
      <AnalyticsContext data={{ searchSessionId: this.props.searchSessionId }}>
        <QuickSearch
          firePrivateAnalyticsEvent={this.fireSearchResultEvents}
          isLoading={isLoading}
          onSearchInput={this.handleSearchInput}
          placeholder={placeholder}
          value={query}
          linkComponent={linkComponent}
          onSearchSubmit={onSearchSubmit}
          selectedResultId={selectedResultId}
          onSelectedResultIdChanged={onSelectedResultIdChanged}
          inputControls={inputControls}
          autocompleteText={autocompleteText}
        >
          {children}
        </QuickSearch>
      </AnalyticsContext>
    );
  }
}

export default withAnalyticsEvents()(GlobalQuickSearch);
