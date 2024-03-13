import React, { PropsWithChildren } from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { ArticleItem } from '../../model/Article';
import { createCtx } from '../../util/hooks/ctx';

export interface RelatedArticlesContextInterface {
  routeGroup?: string;
  routeName?: string;
  onGetRelatedArticles?(
    routeGroup?: string,
    routeName?: string,
  ): Promise<ArticleItem[]>;
  onRelatedArticlesShowMoreClick?(
    event: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
    isCollapsed: boolean,
  ): void;
  onRelatedArticlesListItemClick?: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
    articleData: ArticleItem,
  ) => void;
}

export const [useRelatedArticlesContext, CtxProvider] =
  createCtx<RelatedArticlesContextInterface>();

export const RelatedArticlesContextProvider = ({
  routeGroup,
  routeName,
  onGetRelatedArticles,
  onRelatedArticlesShowMoreClick,
  onRelatedArticlesListItemClick,
  children,
}: PropsWithChildren<RelatedArticlesContextInterface>) => {
  return (
    <CtxProvider
      value={{
        routeGroup,
        routeName,
        onGetRelatedArticles,
        onRelatedArticlesShowMoreClick,
        onRelatedArticlesListItemClick,
      }}
    >
      {children}
    </CtxProvider>
  );
};
