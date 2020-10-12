import React from 'react';
import { Transition } from 'react-transition-group';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { REQUEST_STATE } from '../../../model/Requests';
import { ArticleItem } from '../../../model/Article';

import {
  SEARCH_RESULTS_FADEIN_TRANSITION_DURATION_MS,
  TRANSITION_STATUS,
} from '../../constants';
import { useHelpContext } from '../../HelpContext';

import SearchResultsList from './SearchResults';
import SearchExternalSite from './SearchExternalSite';
import SearchResultsEmpty from './SearchResultsEmpty';
import SearchResultsError from './SearchResultsError';
import { SearchResultsContainer } from './styled';

const defaultStyle: Partial<React.CSSProperties> = {
  transition: `opacity ${SEARCH_RESULTS_FADEIN_TRANSITION_DURATION_MS}ms`,
  opacity: 0,
  visibility: 'hidden',
};

const transitionStyles: { [id: string]: React.CSSProperties } = {
  entering: { opacity: 1, visibility: 'visible' },
  entered: { opacity: 1, visibility: 'visible' },
  exiting: { opacity: 0, visibility: 'visible' },
  exited: { opacity: 0, visibility: 'hidden' },
};

export const SearchResults: React.FC = () => {
  const {
    help: {
      setArticleId,
      searchMode,
      setSearchMode,
      searchResult,
      searchState,
      setSearchResultsVisible,
      onSearchResultItemClick,
      onSearch,
      searchExternalUrl,
      onSearchExternalUrlClick,
    },
  } = useHelpContext();

  const handleOnSearchResultItemClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
    articleData: ArticleItem,
  ): void => {
    if (setArticleId) {
      setArticleId(articleData.id);
      setSearchMode(false);
    }

    if (onSearchResultItemClick) {
      onSearchResultItemClick(event, analyticsEvent, articleData);
    }
  };

  return (
    <Transition
      in={searchMode}
      timeout={SEARCH_RESULTS_FADEIN_TRANSITION_DURATION_MS}
      onEntered={() => setSearchResultsVisible(true)}
      onExited={() => setSearchResultsVisible(false)}
    >
      {(state: TRANSITION_STATUS) => (
        <SearchResultsContainer
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
        >
          {searchState !== REQUEST_STATE.error &&
            searchResult !== null &&
            searchResult.length > 0 &&
            state !== 'exited' && (
              <>
                <SearchResultsList
                  searchResult={searchResult}
                  onSearchResultItemClick={handleOnSearchResultItemClick}
                />
                <SearchExternalSite
                  searchExternalUrl={searchExternalUrl}
                  onSearchExternalUrlClick={onSearchExternalUrlClick}
                />
              </>
            )}

          {searchState !== REQUEST_STATE.error &&
            searchResult !== null &&
            searchResult.length === 0 && (
              <SearchResultsEmpty
                searchExternalUrl={searchExternalUrl}
                onSearchExternalUrlClick={onSearchExternalUrlClick}
              />
            )}

          {searchState === REQUEST_STATE.error && (
            <SearchResultsError onSearch={onSearch} />
          )}
        </SearchResultsContainer>
      )}
    </Transition>
  );
};

export default SearchResults;
