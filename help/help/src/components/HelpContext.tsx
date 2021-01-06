import React, { useState, useRef, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { usePrevious } from '../util/hooks/previous';
import { ArticleItem, ArticleFeedback } from '../model/Article';
import { REQUEST_STATE } from '../model/Requests';
import { Help as HelpInterface, HistoryItem } from '../model/Help';
import { createCtx } from '../util/hooks/ctx';

import {
  MIN_CHARACTERS_FOR_SEARCH,
  VIEW,
  TRANSITION_DURATION_MS,
} from './constants';

export interface State {
  view: VIEW;

  // Article
  articleId: string;
  history: HistoryItem[]; // holds all the articles ID the user has navigated
  articleFullyVisible: boolean; // This will true only if an article 100% visible, that means, after the open animation and before close animation

  // Search
  searchMode: boolean;
  searchResultsVisible: boolean;
  searchValue: string;
  searchResult: ArticleItem[] | null;
  searchState: REQUEST_STATE;
}

export interface HelpContextInterface {
  help: {
    view: VIEW;

    // Article
    loadArticle(id?: string): void;
    onArticleLoadingFailTryAgainButtonClick?(
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
      articleId?: string,
    ): void;
    setArticleId?(articleId: string): void;
    setArticleFullyVisible(isVisible: boolean): void;
    isArticleVisible(): boolean;
    articleIdSetter?(id: string): void;
    onArticleRenderBegin?(): void;
    onArticleRenderDone?(): void;
    history: HistoryItem[];
    getCurrentArticle(): HistoryItem | undefined;
    getCurrentArticleItemData(): ArticleItem | undefined;
    articleId?: string;
    articleFullyVisible: boolean;

    // Default content / Home screen
    defaultContent?: React.ReactNode;

    // Related Articles
    onGetRelatedArticleOfOpenArticle?(
      routeGroup?: string,
      routeName?: string,
    ): Promise<ArticleItem[]>;
    onRelatedArticlesListItemClick?: (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
      articleData: ArticleItem,
    ) => void;
    onRelatedArticlesShowMoreClickOfOpenArticle?(
      event: React.MouseEvent<HTMLElement>,
      analyticsEvent: UIAnalyticsEvent,
      isCollapsed: boolean,
    ): void;

    // Header buttons
    onCloseButtonClick?(
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void;
    isBackbuttonVisible(): boolean;
    onBackButtonClick?(
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void;
    navigateBack(): void;

    // Feedback form
    onWasHelpfulYesButtonClick?(
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
      ArticleItem: ArticleItem,
    ): void;
    onWasHelpfulNoButtonClick?(
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
      ArticleItem: ArticleItem,
    ): void;
    onWasHelpfulSubmit?(
      analyticsEvent: UIAnalyticsEvent,
      articleFeedback: ArticleFeedback,
      articleData: ArticleItem,
    ): Promise<boolean>;

    // Footer
    isFooterVisible(): boolean;
    footer?: React.ReactNode;

    // Search
    onSearch(value?: string): void;
    onSearchInputChanged?(
      event: React.KeyboardEvent<HTMLInputElement>,
      analyticsEvent: UIAnalyticsEvent,
      value: string,
    ): void;
    onSearchInputCleared?(
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void;
    onSearchResultItemClick?(
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
      articleData: ArticleItem,
    ): void;
    onSearchExternalUrlClick?(
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void;
    setSearchResultsVisible(isVisible: boolean): void;
    isSearchVisible(): boolean;
    searchExternalUrl?: string;
    searchMode: boolean;
    setSearchMode(searchMode: boolean): void;
    searchResultsVisible: boolean;
    searchResult: ArticleItem[] | null;
    searchState: REQUEST_STATE;
    searchValue: string;
  };
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const [useHelpContext, CtxProvider] = createCtx<HelpContextInterface>();

export const HelpContextProvider: React.FC<
  HelpInterface & {
    defaultContent?: React.ReactNode;
  }
> = props => {
  const [view, setView] = useState<VIEW>(VIEW.DEFAULT_CONTENT);

  // Article
  const [articleId, setArticleId] = useState<string>(
    props.articleId ? props.articleId : '',
  );
  const prevArticleId = usePrevious(articleId);
  const [history, setHistory] = useState<HistoryItem[]>(
    props.history ? props.history : [],
  );
  const tempHistory = useRef<HistoryItem[]>(props.history ? props.history : []);
  const [articleFullyVisible, setArticleFullyVisible] = useState<boolean>(
    false,
  );

  // Search
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const [searchResultsVisible, setSearchResultsVisible] = useState<boolean>(
    false,
  );
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResult, setSearchResult] = useState<ArticleItem[] | null>(null);
  const [searchState, setSearchState] = useState<REQUEST_STATE>(
    REQUEST_STATE.done,
  );

  // AFP-2511 TODO: Fix automatic suppressions below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedDoSearch = useCallback(
    debounce(async (value: string = '') => {
      const { onSearch } = props;
      if (onSearch) {
        try {
          const results = await onSearch(value);
          setSearchResult(results);
          setSearchState(REQUEST_STATE.done);
        } catch (error) {
          setSearchResult([]);
          setSearchState(REQUEST_STATE.error);
        }
      } else {
        setSearchState(REQUEST_STATE.error);
      }
    }, 500),
    [],
  );

  // Props
  const { onGetArticle, articleIdSetter, historySetter } = props;

  // Util
  const clearHistory = useCallback(async () => {
    // Wait until the animation finishes before clearing the history
    await sleep(TRANSITION_DURATION_MS);
    // Clear History
    tempHistory.current = [];
    setHistory(tempHistory.current);

    // Clear host history using the historySetter
    historySetter && historySetter(tempHistory.current);

    // Set article ID to ''
    articleIdSetter && articleIdSetter('');
  }, [articleIdSetter, historySetter]);

  /**
   * Get a simplified version of the history. The items in the history have only
   * the ID, UID and state === 'reload'
   */
  const getSimpleHistory = useCallback((fullHistory: HistoryItem[]) => {
    const copyHistory = fullHistory.map(tempHistoryItem => {
      const { id, uid } = tempHistoryItem;

      return { id, uid, state: REQUEST_STATE.reload };
    });

    return copyHistory;
  }, []);

  // ARTICLES / DEFAULT CONTENT

  const loadArticle = async () => {
    if (onGetArticle && tempHistory.current.length > 0) {
      let lastHistoryItem = getCurrentArticle();
      lastHistoryItem.state = REQUEST_STATE.loading;
      updateHistoryItem(lastHistoryItem);

      try {
        const article = await onGetArticle(lastHistoryItem.id);
        lastHistoryItem = {
          ...lastHistoryItem,
          state: REQUEST_STATE.done,
          article,
        };
      } catch (error) {
        lastHistoryItem = {
          ...lastHistoryItem,
          state: REQUEST_STATE.error,
        };
      }

      updateHistoryItem(lastHistoryItem);
    }
  };

  const updateHistoryItem = useCallback(
    (historyItem: HistoryItem, update?: Partial<HistoryItem>) => {
      const index = tempHistory.current.findIndex(
        historyItemTemp => historyItemTemp.uid === historyItem.uid,
      );

      if (index !== -1) {
        const newHistory = [...tempHistory.current];
        newHistory[index] = { ...historyItem, ...update };
        tempHistory.current = newHistory;
        setHistory(tempHistory.current);

        const simpleHistory = getSimpleHistory(tempHistory.current);
        historySetter && historySetter(simpleHistory);
      }
    },
    [getSimpleHistory, historySetter],
  );

  const fetchArticle = useCallback(
    async (historyItem: HistoryItem) => {
      if (onGetArticle) {
        try {
          const article = await onGetArticle(historyItem.id);
          updateHistoryItem(historyItem, {
            state: REQUEST_STATE.done,
            article,
          });
        } catch (error) {
          updateHistoryItem(historyItem, {
            state: REQUEST_STATE.error,
          });
        }
      }
    },
    [onGetArticle, updateHistoryItem],
  );

  const isArticleVisible = (): boolean => {
    return view === VIEW.ARTICLE || view === VIEW.ARTICLE_NAVIGATION;
  };

  const isDefaultContentDefined = (): boolean => {
    return props.defaultContent !== undefined;
  };

  const getCurrentArticle = useCallback((): HistoryItem => {
    const currentArticleItem =
      tempHistory.current[tempHistory.current.length - 1];
    return currentArticleItem;
  }, []);

  const getCurrentArticleItemData = (): ArticleItem | undefined => {
    const { article } = getCurrentArticle();

    if (article) {
      const { body, relatedArticles, ...articleItemData } = article;
      const currentArticleSlimData: ArticleItem = articleItemData;

      return currentArticleSlimData;
    }
  };

  // BACK BUTTON
  const navigateBack = async () => {
    const { articleIdSetter } = props;

    if (searchMode) {
      onSearch('');
    } else {
      if (articleIdSetter) {
        // If the history has more than one article, navigate back through the history
        if (tempHistory.current.length > 1) {
          // Remove last element
          const newHistoryValue: HistoryItem[] = [
            ...tempHistory.current.slice(0, -1),
          ];

          // update tempHistory and history
          tempHistory.current = newHistoryValue;
          setHistory(tempHistory.current);

          // Update host history using the historySetter
          historySetter && historySetter(tempHistory.current);

          // If the state of the current article (last article in the history)
          // is 'reload', fetch the article
          const lastHistoryItem = getCurrentArticle();
          if (lastHistoryItem.state === REQUEST_STATE.reload) {
            // fetch article data for the new history Item
            fetchArticle(lastHistoryItem);
          }

          /**
           * If the state of the current article (last article in the history)
           * is NOT 'reload', it means the article is already loaded, is loading or
           * it had an error (which is handled and we display an error messages with
           * a "try again" button). So we just need to set the host article ID === to the
           * current article ID using the "articleIdSetter" prop function
           */
          if (articleIdSetter && lastHistoryItem) {
            articleIdSetter(lastHistoryItem.id);
          }
        } else {
          // Otherwise change the view mode to DEFAULT_CONTENT and clear the history
          setView(VIEW.DEFAULT_CONTENT);
          clearHistory();
        }
      }
    }
  };

  const isBackbuttonVisible = (): boolean => {
    if (
      (tempHistory.current.length === 1 && !isDefaultContentDefined()) ||
      !props.articleIdSetter
    ) {
      return false;
    }

    return isArticleVisible() || searchMode || searchResultsVisible;
  };

  const closeButtonClick =
    props.onCloseButtonClick &&
    ((
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void => {
      clearHistory();
      if (props.onCloseButtonClick) {
        props.onCloseButtonClick(event, analyticsEvent);
      }
    });

  // SEARCH

  const onSearch = (value: string = searchValue) => {
    // Execute this function only if the this.props.onSearch is defined
    if (!props.onSearch) {
      return;
    }

    if (value !== searchValue) {
      setSearchValue(value);
    } else {
      debouncedDoSearch(value);
    }
  };

  const isSearchVisible = (): boolean => {
    if (props.onSearch) {
      return (
        view === VIEW.ARTICLE ||
        view === VIEW.ARTICLE_NAVIGATION ||
        view === VIEW.DEFAULT_CONTENT
      );
    }

    return false;
  };

  // FOOTER

  const isFooterVisible = (): boolean => {
    return props.footer !== undefined;
  };

  const getNewHistoryItem = (articleId: string) => {
    let uid = Math.floor(Math.random() * Math.pow(10, 17));
    const newHistoryItem: HistoryItem = {
      uid,
      id: articleId,
      state: REQUEST_STATE.loading,
    };

    return newHistoryItem;
  };

  // EFFECTS

  /**
   * Search effect
   * If the amount of caracters is > than the minimun defined to fire a search...
   */
  useEffect(() => {
    if (searchValue.length >= MIN_CHARACTERS_FOR_SEARCH) {
      try {
        setSearchMode(true);
        setSearchState(REQUEST_STATE.loading);
        debouncedDoSearch(searchValue);
      } catch (error) {
        setSearchMode(true);
        setSearchState(REQUEST_STATE.error);
        setSearchResult(null);
      }
    } else if (searchValue.length === 0) {
      // If the search input is empty, the search results should be empty and
      // the state.view should change to VIEW.ARTICLE
      setSearchMode(false);
      setSearchResult(null);
      setSearchState(REQUEST_STATE.done);
      setSearchResultsVisible(false);
    }
  }, [debouncedDoSearch, searchValue]);

  // Keep local article ID in sync with host article ID
  useEffect(() => {
    setArticleId(props.articleId!);
  }, [props.articleId]);

  useEffect(() => {
    // If the articleId has changed (new article)
    if (articleId !== prevArticleId) {
      // And the artileId is defined
      if (articleId) {
        // get the last History Item
        const lastHistoryItem = getCurrentArticle();
        // If the last history item articleId is different to the current articleId don't do anything
        if (lastHistoryItem && lastHistoryItem.id === articleId) {
          return;
        }

        // Set the view to Article
        setView(VIEW.ARTICLE);
        // Create a new History Item
        const newHistoryItem = getNewHistoryItem(articleId);
        // add add it to the tempHistory variable
        tempHistory.current = [...tempHistory.current, { ...newHistoryItem }];
        updateHistoryItem(newHistoryItem);
        if (articleIdSetter) {
          articleIdSetter(newHistoryItem.id);
        }

        // fetch article data for the new history Item
        fetchArticle(newHistoryItem);
      } else {
        // prevArticleId is undefined only during the first execution of this effect
        if (prevArticleId === undefined) {
          const lastHistoryItem = getCurrentArticle();
          if (lastHistoryItem && articleIdSetter) {
            articleIdSetter(lastHistoryItem.id);

            // Set the view to Article
            setView(VIEW.ARTICLE);

            // fetch article data for the new history Item
            fetchArticle(lastHistoryItem);
          }
        } else {
          // If article ID is empty then set the view to default and clear the history
          setView(VIEW.DEFAULT_CONTENT);
          clearHistory();
        }
      }
    }
  }, [
    articleId,
    prevArticleId,
    onGetArticle,
    getCurrentArticle,
    articleIdSetter,
    clearHistory,
    fetchArticle,
    updateHistoryItem,
  ]);

  return (
    <CtxProvider
      value={{
        help: {
          view,

          // Article
          loadArticle,
          onArticleLoadingFailTryAgainButtonClick:
            props.onArticleLoadingFailTryAgainButtonClick,
          setArticleFullyVisible,
          setArticleId: articleIdSetter,
          isArticleVisible,
          articleIdSetter: props.articleIdSetter,
          onArticleRenderBegin: props.onArticleRenderBegin,
          onArticleRenderDone: props.onArticleRenderDone,
          history,
          getCurrentArticle,
          getCurrentArticleItemData,
          articleId,
          articleFullyVisible,

          // Related Articles
          onGetRelatedArticleOfOpenArticle:
            props.onGetRelatedArticleOfOpenArticle,
          onRelatedArticlesListItemClick: props.onRelatedArticlesListItemClick,
          onRelatedArticlesShowMoreClickOfOpenArticle:
            props.onRelatedArticlesShowMoreClickOfOpenArticle,

          // Default content / Home screen
          defaultContent: props.defaultContent,

          // Header buttons
          onCloseButtonClick: closeButtonClick,
          isBackbuttonVisible,
          onBackButtonClick: props.onBackButtonClick,
          navigateBack,

          // Feedback form
          onWasHelpfulYesButtonClick: props.onWasHelpfulYesButtonClick,
          onWasHelpfulNoButtonClick: props.onWasHelpfulNoButtonClick,
          onWasHelpfulSubmit: props.onWasHelpfulSubmit,

          // Footer
          isFooterVisible,
          footer: props.footer,

          // Search
          onSearch,
          onSearchInputChanged: props.onSearchInputChanged,
          onSearchInputCleared: props.onSearchInputCleared,
          searchExternalUrl: props.searchExternalUrl,
          onSearchExternalUrlClick: props.onSearchExternalUrlClick,
          onSearchResultItemClick: props.onSearchResultItemClick,
          isSearchVisible: isSearchVisible,
          searchMode: searchMode,
          setSearchMode: setSearchMode,
          searchResultsVisible: searchResultsVisible,
          setSearchResultsVisible: setSearchResultsVisible,
          searchResult: searchResult,
          searchState: searchState,
          searchValue: searchValue,
        },
      }}
    >
      {props.children}
    </CtxProvider>
  );
};
