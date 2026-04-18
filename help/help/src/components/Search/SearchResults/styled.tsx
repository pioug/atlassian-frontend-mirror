/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import type { TransitionStatus } from '../../constants';

export const FADEIN_OVERLAY_TRANSITION_DURATION_MS = 440;

const searchResultsContainerStyles = css({
	position: 'absolute',
	height: '100%',
	width: '100%',
	top: 0,
	backgroundColor: token('elevation.surface'),
	flex: 1,
	flexDirection: 'column',
	boxSizing: 'border-box',
	overflowX: 'hidden',
	overflowY: 'auto',
	zIndex: 10,
	paddingTop: 0,
	paddingRight: token('space.200'),
	paddingBottom: 0,
	paddingLeft: token('space.200'),
	transition: `opacity ${FADEIN_OVERLAY_TRANSITION_DURATION_MS}ms`,
	opacity: 0,
	visibility: 'hidden',
});

const transitionStyles: { [id: string]: React.CSSProperties } = {
	entering: { opacity: 1, visibility: 'visible' },
	entered: { opacity: 1, visibility: 'visible' },
	exiting: { opacity: 0, visibility: 'visible' },
	exited: { opacity: 0, visibility: 'hidden' },
};

type SearchResultsContainerProps = {
	children: React.ReactNode;
	transitionState: TransitionStatus;
};

export const SearchResultsContainer: React.ForwardRefExoticComponent<
	SearchResultsContainerProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, SearchResultsContainerProps>(
	({ children, transitionState }, ref): JSX.Element => (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
		<div ref={ref} css={searchResultsContainerStyles} style={transitionStyles[transitionState]}>
			{children}
		</div>
	),
);

SearchResultsContainer.displayName = 'SearchResultsContainer';

const searchResultsContainerAiStyles = css({
	position: 'absolute',
	height: `calc(100% - ${token('space.800')})`,
	width: '100%',
	top: token('space.800'),
	backgroundColor: token('elevation.surface'),
	flex: 1,
	flexDirection: 'column',
	boxSizing: 'border-box',
	overflowX: 'hidden',
	overflowY: 'auto',
	zIndex: 10,
	paddingTop: 0,
	paddingRight: token('space.200'),
	paddingBottom: 0,
	paddingLeft: token('space.200'),
	transition: `opacity ${FADEIN_OVERLAY_TRANSITION_DURATION_MS}ms`,
	opacity: 0,
	visibility: 'hidden',
});

export const SearchResultsContainerAi: React.ForwardRefExoticComponent<
	SearchResultsContainerProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, SearchResultsContainerProps>(
	({ children, transitionState }, ref): JSX.Element => (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
		<div ref={ref} css={searchResultsContainerAiStyles} style={transitionStyles[transitionState]}>
			{children}
		</div>
	),
);

SearchResultsContainerAi.displayName = 'SearchResultsContainerAi';

const searchResultEmptyMessageImageStyles = css({
	paddingTop: token('space.300'),
	paddingRight: token('space.300'),
	paddingBottom: 0,
	paddingLeft: token('space.300'),
	textAlign: 'center',
});

export const SearchResultEmptyMessageImage = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <div css={searchResultEmptyMessageImageStyles}>{children}</div>;

const searchResultEmptyMessageTextStyles = css({
	paddingTop: token('space.300'),
	paddingRight: token('space.300'),
	paddingBottom: 0,
	paddingLeft: token('space.300'),
	textAlign: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	p: {
		color: token('color.text.subtlest'),
	},
});

export const SearchResultEmptyMessageText = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <div css={searchResultEmptyMessageTextStyles}>{children}</div>;

const searchResultEmptyMessageHeaderTextStyles = css({
	color: token('color.text'),
	font: token('font.body'),
	fontWeight: token('font.weight.bold'),
});

export const SearchResultEmptyMessageHeaderText = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => (
	// eslint-disable-next-line @atlaskit/design-system/use-heading
	<h2 css={searchResultEmptyMessageHeaderTextStyles}>{children}</h2>
);

const searchResultSearchExternalSiteContainerStyles = css({
	paddingTop: token('space.300'),
	paddingRight: token('space.300'),
	paddingBottom: token('space.300'),
	paddingLeft: token('space.300'),
	textAlign: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	p: {
		color: token('color.text.subtlest'),
	},
});

export const SearchResultSearchExternalSiteContainer = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <div css={searchResultSearchExternalSiteContainerStyles}>{children}</div>;
