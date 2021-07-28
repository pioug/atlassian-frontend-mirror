import React, {
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { Transition } from 'react-transition-group';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { useNavigationContext } from '../contexts/navigationContext';
import { useHelpArticleContext } from '../contexts/helpArticleContext';
import {
  SLIDEIN_OVERLAY_TRANSITION_DURATION_MS,
  TRANSITION_STATUS,
  VIEW,
} from '../constants';
import { ArticleContainer } from './styled';
import ArticleContent from './ArticleContent';
import type { HistoryItem } from '../../model/Help';

// Animation
const defaultStyle = {
  left: `100%`,
};

const enableTransition: { [id: string]: React.CSSProperties } = {
  enabled: {
    transition: `left ${SLIDEIN_OVERLAY_TRANSITION_DURATION_MS}ms cubic-bezier(0.2, 0, 0, 1) 0s`,
  },
};

const transitionStyles: { [id: string]: React.CSSProperties } = {
  entered: { left: 0 },
  exited: { left: `100%` },
};

export const Article: React.FC = () => {
  const {
    view,
    articleId,
    history,
    getCurrentArticle,
    reloadHelpArticle,
    reloadWhatsNewArticle,
  } = useNavigationContext();
  const {
    onHelpArticleLoadingFailTryAgainButtonClick,
  } = useHelpArticleContext();

  const [
    skipArticleSlideInAnimation,
    setSkipArticleSlideInAnimation,
  ] = useState<boolean>(
    articleId?.id !== '' || (history ? history.length : []) > 0,
  );
  const [showArticle, setShowArticle] = useState<boolean>(
    skipArticleSlideInAnimation,
  );

  const currentArticleValue: HistoryItem | undefined = getCurrentArticle();
  const [currentArticle, setCurrentArticle] = useState<HistoryItem | undefined>(
    currentArticleValue,
  );

  const articleContainerRef = useRef<HTMLDivElement>(null);
  const onArticleEnteredTimeout = useRef<number>();
  const onCurrentArticleChangedTimeout = useRef<number>();

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
    }, SLIDEIN_OVERLAY_TRANSITION_DURATION_MS);
  };

  const onArticleExit = (): void => {
    clearTimeout(onArticleEnteredTimeout.current);
  };

  const handleOnHelpArticleLoadingFailTryAgainButtonClick = useCallback(
    (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void => {
      if (onHelpArticleLoadingFailTryAgainButtonClick) {
        onHelpArticleLoadingFailTryAgainButtonClick(
          event,
          analyticsEvent,
          articleId,
        );
      }

      if (reloadHelpArticle && currentArticle) {
        reloadHelpArticle(currentArticle);
      }
    },
    [
      articleId,
      currentArticle,
      onHelpArticleLoadingFailTryAgainButtonClick,
      reloadHelpArticle,
    ],
  );

  const handleOnWhatsNewArticleLoadingFailTryAgainButtonClick = useCallback(
    (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void => {
      if (onHelpArticleLoadingFailTryAgainButtonClick) {
        onHelpArticleLoadingFailTryAgainButtonClick(
          event,
          analyticsEvent,
          articleId,
        );
      }
      if (reloadWhatsNewArticle && currentArticle) {
        reloadWhatsNewArticle(currentArticle);
      }
    },
    [
      currentArticle,
      articleId,
      onHelpArticleLoadingFailTryAgainButtonClick,
      reloadWhatsNewArticle,
    ],
  );

  useEffect(() => {
    clearTimeout(onCurrentArticleChangedTimeout.current);
    if (currentArticleValue) {
      setCurrentArticle(currentArticleValue);
    } else {
      onCurrentArticleChangedTimeout.current = window.setTimeout(() => {
        setCurrentArticle(currentArticleValue);
      }, SLIDEIN_OVERLAY_TRANSITION_DURATION_MS);
    }
  }, [currentArticleValue]);

  useEffect(() => {
    if (showArticle) {
      setShowArticle(
        view === VIEW.ARTICLE ||
          view === VIEW.SEARCH ||
          view === VIEW.WHATS_NEW_ARTICLE,
      );
    } else {
      setShowArticle(view === VIEW.ARTICLE || view === VIEW.WHATS_NEW_ARTICLE);
    }
  }, [view, showArticle]);

  return (
    <Transition
      in={showArticle}
      timeout={SLIDEIN_OVERLAY_TRANSITION_DURATION_MS}
      enter={!skipArticleSlideInAnimation}
      onEntered={onArticleEntered}
      onExit={onArticleExit}
      unmountOnExit
      mountOnEnter
    >
      {(state: TRANSITION_STATUS) => {
        return (
          <ArticleContainer
            ref={articleContainerRef}
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
              ...enableTransition[
                !skipArticleSlideInAnimation ? 'enabled' : 'disabled'
              ],
            }}
          >
            <ArticleContent
              currentArticle={currentArticle}
              onHelpArticleLoadingFailTryAgainButtonClick={
                reloadHelpArticle &&
                handleOnHelpArticleLoadingFailTryAgainButtonClick
              }
              onWhatsNewArticleLoadingFailTryAgainButtonClick={
                reloadWhatsNewArticle &&
                handleOnWhatsNewArticleLoadingFailTryAgainButtonClick
              }
            />
          </ArticleContainer>
        );
      }}
    </Transition>
  );
};

export default Article;
