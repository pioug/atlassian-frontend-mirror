import React, { useState, useCallback } from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { NotificationLogProvider } from '@atlaskit/notification-log-client';

import {
  WhatsNewArticleItem,
  WhatsNewArticle,
  whatsNewSearchResult,
} from '../../model/WhatsNew';
import { REQUEST_STATE } from '../../model/Requests';
import { articleId } from '../../model/Help';
import { WHATS_NEW_ITEM_TYPES } from '../../model/WhatsNew';
import { createCtx } from '../../util/hooks/ctx';

import { NUMBER_OF_WHATS_NEW_ITEMS_PER_PAGE } from '../constants';

interface WhatsNewArticleSharedInterface {
  // "What's New" notification provider. This prop is optional, if is not defined the "What's new" notification icon will be hidden
  whatsNewGetNotificationProvider?: Promise<NotificationLogProvider>;
  // Event handler fired when the user clicks the "What's new" button. This prop is optional
  onWhatsNewButtonClick?(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ): void;
  // Event handler fired when the user clicks an Item in the "What's new" result list. This prop is optional
  onWhatsNewResultItemClick?(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
    whatsNewArticleData: WhatsNewArticleItem,
  ): void;
  // Function executed when the user clicks the "show more" button of the "What's new" list. This prop is optional
  onSearchWhatsNewArticlesShowMoreClick?(
    event: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
  ): void;
  // Function used to get a What article content. This prop is optional, if is not defined the "What's new" feature will be hidden
  onGetWhatsNewArticle?(id: articleId): Promise<WhatsNewArticle>;
}

interface WhatsNewArticleContextInterface
  extends WhatsNewArticleSharedInterface {
  // Function used to search "What's New" articles. This prop is optional, if is not defined the "What's new" feature will be hidden
  onSearchWhatsNewArticles?(
    filter?: WHATS_NEW_ITEM_TYPES | '',
    numberOfItems?: number,
    page?: string,
  ): Promise<void>;
  searchWhatsNewArticlesState: REQUEST_STATE;
  searchWhatsNewArticlesResult: whatsNewSearchResult | null;
}

interface WhatsNewArticleProviderInterface
  extends WhatsNewArticleSharedInterface {
  // Function used to search "What's New" articles. This prop is optional, if is not defined the "What's new" feature will be hidden
  onSearchWhatsNewArticles?(
    filter?: WHATS_NEW_ITEM_TYPES | '',
    numberOfItems?: number,
    page?: string,
  ): Promise<whatsNewSearchResult>;
}

export const [useWhatsNewArticleContext, CtxProvider] = createCtx<
  WhatsNewArticleContextInterface
>();

export const WhatsNewArticleProvider: React.FC<WhatsNewArticleProviderInterface> = ({
  whatsNewGetNotificationProvider,
  onWhatsNewButtonClick,
  onSearchWhatsNewArticles,
  onSearchWhatsNewArticlesShowMoreClick,
  onWhatsNewResultItemClick,
  onGetWhatsNewArticle,
  children,
}) => {
  // What's new
  const [whatsNewSearchType, setWhatsNewSearchType] = useState<
    WHATS_NEW_ITEM_TYPES | '' | undefined
  >(undefined);
  const [
    searchWhatsNewArticlesResult,
    setSearchWhatsNewArticlesResult,
  ] = useState<whatsNewSearchResult | null>(null);
  const [
    searchWhatsNewArticlesState,
    setSearchWhatsNewArticlesState,
  ] = useState<REQUEST_STATE>(REQUEST_STATE.done);

  const searchWhatsNew = useCallback(
    async (
      filter: WHATS_NEW_ITEM_TYPES | '' = '',
      numberOfItems: number = NUMBER_OF_WHATS_NEW_ITEMS_PER_PAGE,
      page: string = '',
    ) => {
      setWhatsNewSearchType(filter);
      if (onSearchWhatsNewArticles) {
        try {
          setSearchWhatsNewArticlesState(REQUEST_STATE.loading);
          // If the filter type hasn't change, then we are loading an extra page
          if (filter === whatsNewSearchType && page !== '') {
            const results = await onSearchWhatsNewArticles(
              filter,
              numberOfItems,
              page,
            );
            setSearchWhatsNewArticlesResult({
              articles: [
                ...(searchWhatsNewArticlesResult?.articles
                  ? searchWhatsNewArticlesResult.articles
                  : []),
                ...results.articles,
              ],
              hasNextPage: results.hasNextPage,
              nextPage: results.nextPage,
            });
          } else {
            // new search
            setSearchWhatsNewArticlesResult(null);
            const results = await onSearchWhatsNewArticles(
              filter,
              numberOfItems,
              page,
            );
            setSearchWhatsNewArticlesResult(results);
          }
          setSearchWhatsNewArticlesState(REQUEST_STATE.done);
        } catch (error) {
          setSearchWhatsNewArticlesResult(null);
          setSearchWhatsNewArticlesState(REQUEST_STATE.error);
        }
      } else {
        setSearchWhatsNewArticlesState(REQUEST_STATE.error);
      }
    },
    [
      onSearchWhatsNewArticles,
      whatsNewSearchType,
      searchWhatsNewArticlesResult,
    ],
  );

  return (
    <CtxProvider
      value={{
        whatsNewGetNotificationProvider,
        onWhatsNewButtonClick,
        onSearchWhatsNewArticlesShowMoreClick,
        onSearchWhatsNewArticles: searchWhatsNew,
        searchWhatsNewArticlesState,
        searchWhatsNewArticlesResult,
        onWhatsNewResultItemClick,
        onGetWhatsNewArticle,
      }}
    >
      {children}
    </CtxProvider>
  );
};
