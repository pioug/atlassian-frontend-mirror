import React, { useState, useLayoutEffect, useRef, ReactElement } from 'react';
import { Transition } from 'react-transition-group';
import RelatedArticles from '../RelatedArticles';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { useHelpContext } from '../HelpContext';
import { TRANSITION_DURATION_MS, TRANSITION_STATUS } from '../constants';
import { REQUEST_STATE } from '../../model/Requests';
import { ArticleFeedback, ArticleItem } from '../../model/Article';

import ArticleContent from './ArticleContent';
import ArticleWasHelpfulForm from './ArticleWasHelpfulForm';
import ArticleLoadingFail from './ArticleLoadingFail';
import { ArticleContainer } from './styled';

// Animation
const defaultStyle = {
  left: `100%`,
};

const enableTransition: { [id: string]: React.CSSProperties } = {
  enabled: {
    transition: `left ${TRANSITION_DURATION_MS}ms cubic-bezier(0.2, 0, 0, 1) 0s`,
  },
};

const transitionStyles: { [id: string]: React.CSSProperties } = {
  entered: { left: 0 },
  exited: { left: `100%` },
};

export const Article: React.FC = () => {
  const {
    help: {
      articleId,
      isArticleVisible,
      isSearchVisible,
      setArticleFullyVisible,
      setArticleId,
      onRelatedArticlesListItemClick,
      onArticleLoadingFailTryAgainButtonClick,
      loadArticle,
      getCurrentArticleItemData,
      onWasHelpfulNoButtonClick,
      onWasHelpfulYesButtonClick,
      onWasHelpfulSubmit,
      getCurrentArticle,
      onArticleRenderBegin,
      onArticleRenderDone,
      onGetRelatedArticleOfOpenArticle,
      onRelatedArticlesShowMoreClickOfOpenArticle,
      history,
    },
  } = useHelpContext();
  const [
    skipArticleSlideInAnimation,
    setSkipArticleSlideInAnimation,
  ] = useState<boolean>(articleId !== '' || history.length > 0);
  const articleContainerRef = useRef<HTMLDivElement>(null);
  const onArticleEnteredTimeout = useRef<number>();

  useLayoutEffect(() => {
    if (articleContainerRef.current) {
      articleContainerRef.current.scrollTop = 0;
    }
  }, [history]);

  const onArticleEntered = (): void => {
    onArticleEnteredTimeout.current = window.setTimeout(() => {
      // if skipArticleSlideInAnimation is true, set to false after the
      // first slide-in animation
      // NOTE: skipArticleSlideInAnimation could be true only after the mounting
      if (skipArticleSlideInAnimation) {
        setSkipArticleSlideInAnimation(false);
      }

      setArticleFullyVisible(true);
    }, TRANSITION_DURATION_MS);
  };

  const onArticleExit = (): void => {
    clearTimeout(onArticleEnteredTimeout.current);
    setArticleFullyVisible(false);
  };

  const handleOnRelatedArticlesListItemClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
    articleData: ArticleItem,
  ): void => {
    if (onRelatedArticlesListItemClick) {
      onRelatedArticlesListItemClick(event, analyticsEvent, articleData);
    }

    if (setArticleId) {
      setArticleId(articleData.id);
    }
  };

  const handleOnArticleLoadingFailTryAgainButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ): void => {
    if (onArticleLoadingFailTryAgainButtonClick) {
      onArticleLoadingFailTryAgainButtonClick(event, analyticsEvent, articleId);
    }

    loadArticle();
  };

  const handleOnWasHelpfulNoButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ): void => {
    const currentArticleItemData = getCurrentArticleItemData();
    if (onWasHelpfulNoButtonClick && currentArticleItemData) {
      onWasHelpfulNoButtonClick(event, analyticsEvent, currentArticleItemData);
    }
  };

  const handleOnWasHelpfulYesButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ): void => {
    const currentArticleItemData = getCurrentArticleItemData();
    if (onWasHelpfulYesButtonClick && currentArticleItemData) {
      onWasHelpfulYesButtonClick(event, analyticsEvent, currentArticleItemData);
    }
  };

  const handleOnWasHelpfulSubmit = (
    analyticsEvent: UIAnalyticsEvent,
    articleFeedback: ArticleFeedback,
  ): Promise<boolean> => {
    const currentArticleItemData = getCurrentArticleItemData();
    if (onWasHelpfulSubmit && currentArticleItemData) {
      return onWasHelpfulSubmit(
        analyticsEvent,
        articleFeedback,
        currentArticleItemData,
      );
    }

    return Promise.resolve(false);
  };

  const renderArticleContent = (): ReactElement | null => {
    const currentArticle = getCurrentArticle();

    if (currentArticle) {
      const { article } = currentArticle;

      if (currentArticle.state === REQUEST_STATE.error) {
        return (
          <ArticleLoadingFail
            onTryAgainButtonClick={
              handleOnArticleLoadingFailTryAgainButtonClick
            }
          />
        );
      } else if (article && currentArticle.state === REQUEST_STATE.done) {
        return (
          <>
            <ArticleContent
              title={article.title}
              body={article.body}
              titleLinkUrl={article.href}
              onArticleRenderBegin={onArticleRenderBegin}
              onArticleRenderDone={onArticleRenderDone}
            />
            <ArticleWasHelpfulForm
              onWasHelpfulNoButtonClick={handleOnWasHelpfulNoButtonClick}
              onWasHelpfulYesButtonClick={handleOnWasHelpfulYesButtonClick}
              onWasHelpfulSubmit={
                onWasHelpfulSubmit && handleOnWasHelpfulSubmit
              }
            />
            {onGetRelatedArticleOfOpenArticle &&
              onRelatedArticlesListItemClick && (
                <RelatedArticles
                  style="secondary"
                  onRelatedArticlesListItemClick={
                    handleOnRelatedArticlesListItemClick
                  }
                  onGetRelatedArticle={onGetRelatedArticleOfOpenArticle}
                  routeGroup={article.routeGroup}
                  routeName={article.routeName}
                  onRelatedArticlesShowMoreClick={
                    onRelatedArticlesShowMoreClickOfOpenArticle
                  }
                />
              )}
          </>
        );
      } else {
        return <ArticleContent isLoading />;
      }
    }

    return null;
  };

  return (
    <Transition
      in={isArticleVisible()}
      timeout={TRANSITION_DURATION_MS}
      enter={!skipArticleSlideInAnimation}
      onEntered={onArticleEntered}
      onExit={onArticleExit}
    >
      {(state: TRANSITION_STATUS) => (
        <ArticleContainer
          ref={articleContainerRef}
          isSearchVisible={isSearchVisible()}
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
            ...enableTransition[
              !skipArticleSlideInAnimation ? 'enabled' : 'disabled'
            ],
          }}
        >
          {renderArticleContent()}
        </ArticleContainer>
      )}
    </Transition>
  );
};

export default Article;
