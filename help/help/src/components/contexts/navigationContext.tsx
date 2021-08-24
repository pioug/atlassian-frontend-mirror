import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { Article, ArticleItem } from '../../model/Article';
import { WhatsNewArticleItem, WhatsNewArticle } from '../../model/WhatsNew';
import { REQUEST_STATE } from '../../model/Requests';
import { HistoryItem, articleId, ARTICLE_TYPE } from '../../model/Help';
import { createCtx } from '../../util/hooks/ctx';

import { VIEW } from '../constants';

import { useHelpArticleContext } from './helpArticleContext';
import { useWhatsNewArticleContext } from './whatsNewArticleContext';
import { useHomeContext } from './homeContext';
import { useSearchContext } from './searchContext';
import { useHeaderContext } from './headerContext';

export interface NavigationSharedInterface {
  articleId?: articleId;
  history?: HistoryItem[];
  historySetter?(history: HistoryItem[]): void;
}

export interface NavigationContextInterface extends NavigationSharedInterface {
  view: VIEW;
  setArticleId?(id: articleId): void;
  canNavigateBack(): boolean;
  navigateBack?(): void;
  onGetArticle?(id: articleId): Promise<Article | WhatsNewArticle>;
  getCurrentArticle(): HistoryItem | undefined;
  getCurrentArticleItemData(): ArticleItem | WhatsNewArticleItem | undefined;
  reloadHelpArticle?(historyItem: HistoryItem): void;
  reloadWhatsNewArticle?(historyItem: HistoryItem): void;
  isOverlayVisible(): boolean;
  onClose?(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ): void;
}

export interface NavigationProviderInterface extends NavigationSharedInterface {
  articleIdSetter?(id: articleId): void;
}

export const [useNavigationContext, CtxProvider] = createCtx<
  NavigationContextInterface
>();

export const NavigationContextProvider: React.FC<NavigationProviderInterface> = ({
  articleId: propsArticleId,
  articleIdSetter,
  history: propsHistory,
  historySetter,
  children,
}) => {
  const { onGetHelpArticle } = useHelpArticleContext();
  const { onGetWhatsNewArticle } = useWhatsNewArticleContext();
  const { homeContent, homeOptions } = useHomeContext();
  const { onSearch, isSearchResultVisible } = useSearchContext();
  const { onCloseButtonClick } = useHeaderContext();

  const [view, setView] = useState<VIEW>(VIEW.DEFAULT_CONTENT);

  const articleId = useMemo(() => {
    if (
      propsArticleId?.id === undefined &&
      propsArticleId?.type === undefined
    ) {
      return undefined;
    }

    return {
      id: propsArticleId.id ? propsArticleId.id : '',
      type: propsArticleId.type
        ? propsArticleId.type
        : ARTICLE_TYPE.HELP_ARTICLE,
    };
  }, [propsArticleId?.id, propsArticleId?.type]);
  const [history, setHistory] = useState<HistoryItem[]>(
    propsHistory ? propsHistory : [],
  );
  const tempHistory = useRef<HistoryItem[]>(propsHistory ? propsHistory : []);

  const clearHistory = useCallback(() => {
    if (!articleIdSetter) {
      return;
    }
    // Clear History
    tempHistory.current = [];
    setHistory(tempHistory.current);

    // Clear host history using the historySetter
    historySetter && historySetter(tempHistory.current);

    // Set article ID to ''
    articleIdSetter({ id: '', type: ARTICLE_TYPE.HELP_ARTICLE });
  }, [articleIdSetter, historySetter]);

  const isDefaultContentDefined = useCallback((): boolean => {
    return homeContent !== undefined || homeOptions !== undefined;
  }, [homeContent, homeOptions]);

  const getNewHistoryItem = (id: string, type: ARTICLE_TYPE) => {
    let uid = Math.floor(Math.random() * Math.pow(10, 17));
    const newHistoryItem: HistoryItem = {
      uid,
      id,
      type,
      state: REQUEST_STATE.loading,
    };

    return newHistoryItem;
  };

  /**
   * Get a simplified version of the history. The items in the history have only
   * the ID, UID and state === 'reload'
   */
  const getSimpleHistory = useCallback((fullHistory: HistoryItem[]) => {
    const copyHistory = fullHistory.map((tempHistoryItem) => {
      const { id, uid, type } = tempHistoryItem;

      return { id, uid, state: REQUEST_STATE.reload, type };
    });

    return copyHistory;
  }, []);

  const updateView = useCallback(() => {
    if (isSearchResultVisible) {
      setView(VIEW.SEARCH);
    } else if (articleId?.type === ARTICLE_TYPE.HELP_ARTICLE) {
      if (articleId.id) {
        setView(VIEW.ARTICLE);
      } else {
        setView(VIEW.DEFAULT_CONTENT);
      }
    } else if (articleId?.type === ARTICLE_TYPE.WHATS_NEW) {
      if (articleId.id) {
        setView(VIEW.WHATS_NEW_ARTICLE);
      } else {
        setView(VIEW.WHATS_NEW);
      }
    }
  }, [articleId, isSearchResultVisible]);

  const updateHistoryItem = useCallback(
    (historyItem: HistoryItem, update?: Partial<HistoryItem>) => {
      const index = tempHistory.current.findIndex(
        (historyItemTemp) => historyItemTemp.uid === historyItem.uid,
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

  const reloadHelpArticle = useCallback(
    async (historyItem: HistoryItem) => {
      let reloadingHelpArticleHistoryItem = historyItem;

      if (onGetHelpArticle) {
        // if the historyItem isn't a "Help article", display the error message
        if (historyItem.type !== ARTICLE_TYPE.HELP_ARTICLE) {
          reloadingHelpArticleHistoryItem = {
            ...reloadingHelpArticleHistoryItem,
            state: REQUEST_STATE.error,
          };
        } else {
          reloadingHelpArticleHistoryItem.state = REQUEST_STATE.loading;
          updateHistoryItem(reloadingHelpArticleHistoryItem);

          try {
            const article = await onGetHelpArticle({
              id: reloadingHelpArticleHistoryItem.id,
              type: reloadingHelpArticleHistoryItem.type,
            });
            reloadingHelpArticleHistoryItem = {
              ...reloadingHelpArticleHistoryItem,
              state: REQUEST_STATE.done,
              article,
            };
          } catch (error) {
            reloadingHelpArticleHistoryItem = {
              ...reloadingHelpArticleHistoryItem,
              state: REQUEST_STATE.error,
            };
          }
        }
      } else {
        reloadingHelpArticleHistoryItem = {
          ...reloadingHelpArticleHistoryItem,
          state: REQUEST_STATE.error,
        };
      }

      updateHistoryItem(reloadingHelpArticleHistoryItem);
    },
    [onGetHelpArticle, updateHistoryItem],
  );

  const reloadWhatsNewArticle = useCallback(
    async (historyItem: HistoryItem) => {
      let reloadingWhatsNewArticleHistoryItem = historyItem;

      if (onGetWhatsNewArticle) {
        if (historyItem.type !== ARTICLE_TYPE.WHATS_NEW) {
          // if the historyItem isn't a "What's new article", display the error message
          reloadingWhatsNewArticleHistoryItem = {
            ...reloadingWhatsNewArticleHistoryItem,
            state: REQUEST_STATE.error,
          };
        } else {
          reloadingWhatsNewArticleHistoryItem.state = REQUEST_STATE.loading;
          updateHistoryItem(reloadingWhatsNewArticleHistoryItem);

          try {
            const article = await onGetWhatsNewArticle({
              id: reloadingWhatsNewArticleHistoryItem.id,
              type: reloadingWhatsNewArticleHistoryItem.type,
            });
            reloadingWhatsNewArticleHistoryItem = {
              ...reloadingWhatsNewArticleHistoryItem,
              state: REQUEST_STATE.done,
              article,
            };
          } catch (error) {
            reloadingWhatsNewArticleHistoryItem = {
              ...reloadingWhatsNewArticleHistoryItem,
              state: REQUEST_STATE.error,
            };
          }
        }
      } else {
        reloadingWhatsNewArticleHistoryItem = {
          ...reloadingWhatsNewArticleHistoryItem,
          state: REQUEST_STATE.error,
        };
      }

      updateHistoryItem(reloadingWhatsNewArticleHistoryItem);
    },
    [onGetWhatsNewArticle, updateHistoryItem],
  );

  const fetchArticleData = useCallback(
    async (historyItem: HistoryItem) => {
      if (historyItem.type === ARTICLE_TYPE.HELP_ARTICLE) {
        if (onGetHelpArticle) {
          try {
            const article = await onGetHelpArticle({
              id: historyItem.id,
              type: historyItem.type,
            });
            updateHistoryItem(historyItem, {
              state: REQUEST_STATE.done,
              article,
            });
          } catch (error) {
            updateHistoryItem(historyItem, {
              state: REQUEST_STATE.error,
            });
          }
        } else {
          updateHistoryItem(historyItem, {
            state: REQUEST_STATE.error,
          });
        }
      } else if (historyItem.type === ARTICLE_TYPE.WHATS_NEW) {
        if (onGetWhatsNewArticle) {
          try {
            const article = await onGetWhatsNewArticle({
              id: historyItem.id,
              type: historyItem.type,
            });
            updateHistoryItem(historyItem, {
              state: REQUEST_STATE.done,
              article,
            });
          } catch (error) {
            updateHistoryItem(historyItem, {
              state: REQUEST_STATE.error,
            });
          }
        } else {
          updateHistoryItem(historyItem, {
            state: REQUEST_STATE.error,
          });
        }
      }
    },
    [onGetHelpArticle, onGetWhatsNewArticle, updateHistoryItem],
  );

  const getCurrentArticle = useCallback((): HistoryItem => {
    const currentArticleItem =
      tempHistory.current[tempHistory.current.length - 1];
    return currentArticleItem;
  }, []);

  const getCurrentArticleItemData = useCallback(():
    | ArticleItem
    | WhatsNewArticleItem
    | undefined => {
    const { article, type } = getCurrentArticle();

    if (article) {
      if (type === ARTICLE_TYPE.HELP_ARTICLE) {
        const {
          body,
          relatedArticles,
          ...articleItemData
        } = article as Article;
        const currentArticleSlimData: ArticleItem = articleItemData;

        return currentArticleSlimData;
      } else if (type === ARTICLE_TYPE.WHATS_NEW) {
        const {
          description,
          ...whatsNewArticleItemData
        } = article as WhatsNewArticle;
        const currentWhatsNewArticleSlimData: WhatsNewArticleItem = whatsNewArticleItemData;

        return currentWhatsNewArticleSlimData;
      }
    }
  }, [getCurrentArticle]);

  const isOverlayVisible = useCallback((): boolean => {
    return (
      view === VIEW.ARTICLE ||
      view === VIEW.SEARCH ||
      view === VIEW.WHATS_NEW ||
      view === VIEW.WHATS_NEW_ARTICLE
    );
  }, [view]);

  const canNavigateBack = useCallback((): boolean => {
    /**
     * - If default content isn't defined and the history only has one article,
     * we should not display the back button
     * - If the prop.article.setArticleId is not defined, we should also hide the back
     * button because we are not able to navigate though the history without it
     */
    if (
      (tempHistory.current.length === 1 && !isDefaultContentDefined()) ||
      (view === VIEW.WHATS_NEW && !isDefaultContentDefined())
    ) {
      return false;
    }

    /**
     * if an overlay is visible return true to display the back buton
     */
    return isOverlayVisible();
  }, [isDefaultContentDefined, isOverlayVisible, view]);

  const navigateBack = useCallback(async () => {
    if (!articleIdSetter) {
      return;
    }

    /**
     * If the user is in the search screen, just clean the search. That will make the search results
     * overlay disapear and show the last element in the history or (if is defined) the default content
     * */
    if (view === VIEW.SEARCH && onSearch) {
      onSearch('');
      return;
    }

    //  if the history is not empty and ...
    if (tempHistory.current.length > 0) {
      // the history has more than one article, navigate back through the history
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
          fetchArticleData(lastHistoryItem);
        }

        /**
         * If the state of the current article (last article in the history)
         * is NOT 'reload', it means the article is already loaded, is loading or
         * it had an error (which is handled and we display an error messages with
         * a "try again" button). So we just need to set the host article ID === to the
         * current article ID using the "articleIdSetter" prop function
         */
        if (lastHistoryItem) {
          articleIdSetter({
            id: lastHistoryItem.id,
            type: lastHistoryItem.type,
          });
        }
      } else if (tempHistory.current.length === 1) {
        // but if the history only has one item, clear the history
        clearHistory();
      }
    }
  }, [
    articleIdSetter,
    clearHistory,
    fetchArticleData,
    getCurrentArticle,
    historySetter,
    onSearch,
    view,
  ]);

  const onClose = useCallback(
    (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void => {
      if (onCloseButtonClick) {
        clearHistory();
        onCloseButtonClick(event, analyticsEvent);
      }
    },
    [clearHistory, onCloseButtonClick],
  );

  useEffect(() => {
    if (!articleIdSetter) {
      return;
    }

    /**
     * If the article type is HELP_ARTICLE and the ID is defined we add a new historyItem
     *
     * If the article type is WHATS_NEW it doesn't matter if the the articleId.id is defined or not, we want
     * to add it to the history
     */
    if (
      (articleId?.type === ARTICLE_TYPE.HELP_ARTICLE && articleId?.id) ||
      articleId?.type === ARTICLE_TYPE.WHATS_NEW
    ) {
      // get the last History Item
      const lastHistoryItem = getCurrentArticle();
      // If the last history item articleId isn't different to the current articleId don't do anything
      if (lastHistoryItem && lastHistoryItem.id === articleId.id) {
        return;
      }

      // Create a new History Item
      const newHistoryItem = getNewHistoryItem(articleId.id, articleId.type);
      // add add it to the tempHistory variable
      tempHistory.current = [...tempHistory.current, { ...newHistoryItem }];
      updateHistoryItem(newHistoryItem);

      // fetch article data for the new history Item
      fetchArticleData(newHistoryItem);
    } else {
      // articleId is undefined only during the first execution of this effect
      if (articleId === undefined) {
        const lastHistoryItem = getCurrentArticle();
        if (lastHistoryItem) {
          articleIdSetter({
            id: lastHistoryItem.id,
            type: lastHistoryItem.type,
          });

          // fetch article data for the new history Item
          fetchArticleData(lastHistoryItem);
        }
      } else {
        // If article ID is empty clear the history
        if (history.length > 0) {
          clearHistory();
        }
      }
    }
  }, [
    articleId,
    articleIdSetter,
    clearHistory,
    fetchArticleData,
    getCurrentArticle,
    updateHistoryItem,
    history.length,
  ]);

  /**
   * VIEW effect
   * Set the view value based on the values of articleId
   */
  useEffect(() => {
    updateView();
  }, [articleId, updateView]);

  return (
    <CtxProvider
      value={{
        view,
        articleId,
        setArticleId: articleIdSetter,
        history,
        getCurrentArticle,
        getCurrentArticleItemData,
        reloadHelpArticle: onGetHelpArticle && reloadHelpArticle,
        reloadWhatsNewArticle: onGetWhatsNewArticle && reloadWhatsNewArticle,
        canNavigateBack,
        navigateBack,
        isOverlayVisible,
        onClose,
      }}
    >
      {children}
    </CtxProvider>
  );
};
