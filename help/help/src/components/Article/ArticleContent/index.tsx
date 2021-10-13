import React from 'react';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { HistoryItem, ARTICLE_TYPE } from '../../../model/Help';
import { REQUEST_STATE } from '../../../model/Requests';
import { Article as ArticleType } from '../../../model/Article';
import { WhatsNewArticle as WhatsNewArticleType } from '../../../model/WhatsNew';

import HelpArticle from '../HelpArticle';
import ArticleLoadingFail from '../ArticleLoadingFail';
import WhatsNewArticle from '../WhatsNewArticle';

interface Props {
  currentArticle: HistoryItem | undefined;
  onHelpArticleLoadingFailTryAgainButtonClick?(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ): void;
  onWhatsNewArticleLoadingFailTryAgainButtonClick?(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ): void;
}

export const ArticleContent: React.FC<Props> = ({
  currentArticle,
  onHelpArticleLoadingFailTryAgainButtonClick,
  onWhatsNewArticleLoadingFailTryAgainButtonClick,
}) => {
  if (currentArticle && currentArticle.id) {
    if (currentArticle.type === ARTICLE_TYPE.HELP_ARTICLE) {
      const article = currentArticle.article as ArticleType;
      if (article && currentArticle.state === REQUEST_STATE.done) {
        return <HelpArticle article={article} />;
      } else if (currentArticle.state === REQUEST_STATE.loading) {
        return <HelpArticle isLoading />;
      } else if (currentArticle.state === REQUEST_STATE.error) {
        return (
          <ArticleLoadingFail
            onTryAgainButtonClick={onHelpArticleLoadingFailTryAgainButtonClick}
          />
        );
      }
    }

    if (currentArticle.type === ARTICLE_TYPE.WHATS_NEW) {
      const article = currentArticle.article as WhatsNewArticleType;
      if (article && currentArticle.state === REQUEST_STATE.done) {
        return <WhatsNewArticle article={article} />;
      } else if (currentArticle.state === REQUEST_STATE.loading) {
        return <WhatsNewArticle isLoading />;
      } else if (currentArticle.state === REQUEST_STATE.error) {
        return (
          <ArticleLoadingFail
            onTryAgainButtonClick={
              onWhatsNewArticleLoadingFailTryAgainButtonClick
            }
          />
        );
      }
    }
  }

  return null;
};

export default ArticleContent;
