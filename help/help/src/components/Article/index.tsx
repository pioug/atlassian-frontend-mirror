/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useState, useLayoutEffect, useRef, useEffect, useCallback } from 'react';
import { Transition } from 'react-transition-group';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { token } from '@atlaskit/tokens';
import { css, jsx } from '@compiled/react';

import { useNavigationContext } from '../contexts/navigationContext';
import { useHelpArticleContext } from '../contexts/helpArticleContext';
import { SLIDEIN_OVERLAY_TRANSITION_DURATION_MS, type TransitionStatus, VIEW } from '../constants';
import ArticleContent from './ArticleContent';
import type { HistoryItem } from '../../model/Help';

interface ArticleProps {
	isAiEnabled?: boolean;
}

const articleContainerStyles = css({
	paddingTop: token('space.200', '16px'),
	paddingRight: token('space.300', '24px'),
	paddingBottom: token('space.200', '16px'),
	paddingLeft: token('space.300', '24px'),
	position: 'absolute',
	height: '100%',
	width: '100%',
	top: 0,
	backgroundColor: token('elevation.surface', '#FFFFFF'),
	left: '100%',
	flex: 1,
	flexDirection: 'column',
	boxSizing: 'border-box',
	overflowX: 'hidden',
	overflowY: 'auto',
	zIndex: 2,
	'&:focus': {
		outline: 'none',
	},
});

const articleContainerAiStyles = css({
	paddingLeft: token('space.300', '24px'),
	paddingRight: token('space.300', '24px'),
	paddingBottom: token('space.200', '16px'),
	position: 'absolute',
	height: `calc(100% - ${token('space.800', '60px')})`,
	width: '100%',
	top: token('space.800', '60px'),
	backgroundColor: token('elevation.surface', '#FFFFFF'),
	left: '100%',
	flex: 1,
	flexDirection: 'column',
	boxSizing: 'border-box',
	overflowX: 'hidden',
	overflowY: 'auto',
	zIndex: 2,
	'&:focus': {
		outline: 'none',
	},
});

// Animation
const enableTransition: { [id: string]: React.CSSProperties } = {
	enabled: {
		transition: `left ${SLIDEIN_OVERLAY_TRANSITION_DURATION_MS}ms cubic-bezier(0.2, 0, 0, 1) 0s`,
	},
};

const transitionStyles: { [id: string]: React.CSSProperties } = {
	entered: { left: 0 },
	exited: { left: '100%' },
};

export const Article: React.FC<ArticleProps> = ({ isAiEnabled }) => {
	const { view, articleId, history, getCurrentArticle, reloadHelpArticle, reloadWhatsNewArticle } =
		useNavigationContext();
	const { onHelpArticleLoadingFailTryAgainButtonClick } = useHelpArticleContext();

	const [skipArticleSlideInAnimation, setSkipArticleSlideInAnimation] = useState(
		articleId?.id !== '' || (history?.length ?? 0) > 0,
	);
	const [showArticle, setShowArticle] = useState(skipArticleSlideInAnimation);

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
			// Move focus to the article container for accessibility
			articleContainerRef.current?.focus();
		}, SLIDEIN_OVERLAY_TRANSITION_DURATION_MS);
	};

	const onArticleExit = (): void => {
		clearTimeout(onArticleEnteredTimeout.current);
	};

	const handleOnHelpArticleLoadingFailTryAgainButtonClick = useCallback(
		(event: React.MouseEvent<HTMLElement, MouseEvent>, analyticsEvent: UIAnalyticsEvent): void => {
			if (onHelpArticleLoadingFailTryAgainButtonClick) {
				onHelpArticleLoadingFailTryAgainButtonClick(event, analyticsEvent, articleId);
			}

			if (reloadHelpArticle && currentArticle) {
				reloadHelpArticle(currentArticle);
			}
		},
		[articleId, currentArticle, onHelpArticleLoadingFailTryAgainButtonClick, reloadHelpArticle],
	);

	const handleOnWhatsNewArticleLoadingFailTryAgainButtonClick = useCallback(
		(event: React.MouseEvent<HTMLElement, MouseEvent>, analyticsEvent: UIAnalyticsEvent): void => {
			if (onHelpArticleLoadingFailTryAgainButtonClick) {
				onHelpArticleLoadingFailTryAgainButtonClick(event, analyticsEvent, articleId);
			}
			if (reloadWhatsNewArticle && currentArticle) {
				reloadWhatsNewArticle(currentArticle);
			}
		},
		[currentArticle, articleId, onHelpArticleLoadingFailTryAgainButtonClick, reloadWhatsNewArticle],
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
				view === VIEW.ARTICLE || view === VIEW.SEARCH || view === VIEW.WHATS_NEW_ARTICLE,
			);
		} else {
			setShowArticle(view === VIEW.ARTICLE || view === VIEW.WHATS_NEW_ARTICLE);
		}
	}, [view, showArticle]);

	return isAiEnabled ? (
		<Transition
			in={showArticle}
			timeout={SLIDEIN_OVERLAY_TRANSITION_DURATION_MS}
			enter={!skipArticleSlideInAnimation}
			onEntered={onArticleEntered}
			onExit={onArticleExit}
			unmountOnExit
			mountOnEnter
		>
			{(state: TransitionStatus) => {
				return (
					<div
						css={articleContainerAiStyles}
						ref={articleContainerRef}
						tabIndex={-1}
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							...transitionStyles[state],
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							...enableTransition[!skipArticleSlideInAnimation ? 'enabled' : 'disabled'],
						}}
					>
						<ArticleContent
							currentArticle={currentArticle}
							onHelpArticleLoadingFailTryAgainButtonClick={
								reloadHelpArticle && handleOnHelpArticleLoadingFailTryAgainButtonClick
							}
							onWhatsNewArticleLoadingFailTryAgainButtonClick={
								reloadWhatsNewArticle && handleOnWhatsNewArticleLoadingFailTryAgainButtonClick
							}
						/>
					</div>
				);
			}}
		</Transition>
	) : (
		<Transition
			in={showArticle}
			timeout={SLIDEIN_OVERLAY_TRANSITION_DURATION_MS}
			enter={!skipArticleSlideInAnimation}
			onEntered={onArticleEntered}
			onExit={onArticleExit}
			unmountOnExit
			mountOnEnter
		>
			{(state: TransitionStatus) => {
				return (
					<div
						css={articleContainerStyles}
						ref={articleContainerRef}
						tabIndex={-1}
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							...transitionStyles[state],
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							...enableTransition[!skipArticleSlideInAnimation ? 'enabled' : 'disabled'],
						}}
					>
						<ArticleContent
							currentArticle={currentArticle}
							onHelpArticleLoadingFailTryAgainButtonClick={
								reloadHelpArticle && handleOnHelpArticleLoadingFailTryAgainButtonClick
							}
							onWhatsNewArticleLoadingFailTryAgainButtonClick={
								reloadWhatsNewArticle && handleOnWhatsNewArticleLoadingFailTryAgainButtonClick
							}
						/>
					</div>
				);
			}}
		</Transition>
	);
};

export default Article;
