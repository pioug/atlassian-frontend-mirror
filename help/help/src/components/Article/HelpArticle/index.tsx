import React, { useCallback } from 'react';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { BODY_FORMAT_TYPES } from '@atlaskit/help-article';

import RelatedArticles from '../../RelatedArticles';
import { ARTICLE_TYPE } from '../../../model/Help';
import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';
import {
  ArticleFeedback,
  ArticleItem,
  Article as ArticleType,
} from '../../../model/Article';

import { useNavigationContext } from '../../contexts/navigationContext';
import { useHelpArticleContext } from '../../contexts/helpArticleContext';
import { useRelatedArticlesContext } from '../../contexts/relatedArticlesContext';

import HelpArticleContent from '@atlaskit/help-article';
import WasHelpfulForm from './WasHelpfulForm';
import Loading from './Loading';

interface Props {
  article?: ArticleType;
  isLoading?: boolean;
}

export const HelpArticle: React.FC<Props> = ({ article, isLoading }) => {
  const { setArticleId, getCurrentArticleItemData } = useNavigationContext();
  const {
    onWasHelpfulNoButtonClick,
    onWasHelpfulYesButtonClick,
    onWasHelpfulSubmit,
  } = useHelpArticleContext();
  const {
    onRelatedArticlesListItemClick,
    onRelatedArticlesShowMoreClick,
    onGetRelatedArticles,
  } = useRelatedArticlesContext();

  const handleOnWasHelpfulNoButtonClick = useCallback(
    (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void => {
      const currentArticleItemData = getCurrentArticleItemData();
      if (onWasHelpfulNoButtonClick && currentArticleItemData) {
        onWasHelpfulNoButtonClick(
          event,
          analyticsEvent,
          currentArticleItemData as ArticleItem,
        );
      }
    },
    [getCurrentArticleItemData, onWasHelpfulNoButtonClick],
  );

  const handleOnWasHelpfulYesButtonClick = useCallback(
    (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void => {
      const currentArticleItemData = getCurrentArticleItemData();
      if (onWasHelpfulYesButtonClick && currentArticleItemData) {
        onWasHelpfulYesButtonClick(
          event,
          analyticsEvent,
          currentArticleItemData as ArticleItem,
        );
      }
    },
    [getCurrentArticleItemData, onWasHelpfulYesButtonClick],
  );

  const handleOnWasHelpfulSubmit = useCallback(
    (
      analyticsEvent: UIAnalyticsEvent,
      articleFeedback: ArticleFeedback,
    ): Promise<boolean> => {
      const currentArticleItemData = getCurrentArticleItemData();
      if (onWasHelpfulSubmit && currentArticleItemData) {
        return onWasHelpfulSubmit(
          analyticsEvent,
          articleFeedback,
          currentArticleItemData as ArticleItem,
        );
      }

      return Promise.resolve(false);
    },
    [getCurrentArticleItemData, onWasHelpfulSubmit],
  );

  const handleOnRelatedArticlesListItemClick = useCallback(
    (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
      articleData: ArticleItem,
    ): void => {
      if (onRelatedArticlesListItemClick) {
        analyticsEvent.payload.origin = 'relatedArticleOfOpenArticle';
        onRelatedArticlesListItemClick(event, analyticsEvent, articleData);
      }

      if (setArticleId) {
        setArticleId({
          id: articleData.id,
          type: ARTICLE_TYPE.HELP_ARTICLE,
        });
      }
    },
    [setArticleId, onRelatedArticlesListItemClick],
  );

  const handleOnRelatedArticlesShowMoreClick = useCallback(
    (
      event: React.MouseEvent<HTMLElement>,
      analyticsEvent: UIAnalyticsEvent,
      isCollapsed: boolean,
    ) => {
      analyticsEvent.payload.attributes = {
        componentName: 'Article',
        packageName,
        packageVersion,
      };
      if (onRelatedArticlesShowMoreClick) {
        onRelatedArticlesShowMoreClick(event, analyticsEvent, isCollapsed);
      }
    },
    [onRelatedArticlesShowMoreClick],
  );

  if (isLoading) {
    return <Loading />;
  }

  if (article) {
    return (
      <>
        <HelpArticleContent
          title={article.title}
          body={article.body}
          titleLinkUrl={article.href}
          bodyFormat={
            article.bodyFormat ? article.bodyFormat : BODY_FORMAT_TYPES.html
          }
        />
        <WasHelpfulForm
          onWasHelpfulNoButtonClick={
            onWasHelpfulNoButtonClick && handleOnWasHelpfulNoButtonClick
          }
          onWasHelpfulYesButtonClick={
            onWasHelpfulYesButtonClick && handleOnWasHelpfulYesButtonClick
          }
          onWasHelpfulSubmit={onWasHelpfulSubmit && handleOnWasHelpfulSubmit}
        />
        {onGetRelatedArticles && onRelatedArticlesListItemClick && (
          <RelatedArticles
            style="secondary"
            onRelatedArticlesListItemClick={
              handleOnRelatedArticlesListItemClick
            }
            onGetRelatedArticles={onGetRelatedArticles}
            routeGroup={article.routeGroup}
            routeName={article.routeName}
            onRelatedArticlesShowMoreClick={
              handleOnRelatedArticlesShowMoreClick
            }
          />
        )}
      </>
    );
  }

  return null;
};

export default HelpArticle;
