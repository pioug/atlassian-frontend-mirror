import React from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { Article, ArticleItem, ArticleFeedback } from '../../model/Article';
import { articleId } from '../../model/Help';
import { createCtx } from '../../util/hooks/ctx';

export interface HelpArticleContextInterface {
  onGetHelpArticle?(articleId: articleId): Promise<Article>;
  onHelpArticleLoadingFailTryAgainButtonClick?(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
    articleId?: articleId,
  ): void;
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
}

export const [useHelpArticleContext, CtxProvider] = createCtx<
  HelpArticleContextInterface
>();

export const HelpArticleContextProvider: React.FC<HelpArticleContextInterface> = ({
  onGetHelpArticle,
  onHelpArticleLoadingFailTryAgainButtonClick,
  onWasHelpfulYesButtonClick,
  onWasHelpfulNoButtonClick,
  onWasHelpfulSubmit,
  children,
}) => {
  return (
    <CtxProvider
      value={{
        onGetHelpArticle,
        onHelpArticleLoadingFailTryAgainButtonClick,
        onWasHelpfulYesButtonClick,
        onWasHelpfulNoButtonClick,
        onWasHelpfulSubmit,
      }}
    >
      {children}
    </CtxProvider>
  );
};
