/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { TransitionStatus } from '../../constants';
import { N200, N500 } from '@atlaskit/theme/colors';

export const FADEIN_OVERLAY_TRANSITION_DURATION_MS = 440;

const searchResultsContainerStyles = css({
	position: 'absolute',
	height: '100%',
	width: '100%',
	top: 0,
	backgroundColor: token('elevation.surface', '#FFFFFF'),
	flex: 1,
	flexDirection: 'column',
	boxSizing: 'border-box',
	overflowX: 'hidden',
	overflowY: 'auto',
	zIndex: 10,
	paddingTop: 0,
	paddingRight: token('space.200', '16px'),
	paddingBottom: 0,
	paddingLeft: token('space.200', '16px'),
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

export const SearchResultsContainer = ({
	children,
	transitionState,
}: {
	children: React.ReactNode;
	transitionState: TransitionStatus;
}) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
	<div css={searchResultsContainerStyles} style={transitionStyles[transitionState]}>
		{children}
	</div>
);

const searchResultsContainerAiStyles = css({
	position: 'absolute',
	height: `calc(100% - ${token('space.800', '60px')})`,
	width: '100%',
	top: token('space.800', '60px'),
	backgroundColor: token('elevation.surface', '#FFFFFF'),
	flex: 1,
	flexDirection: 'column',
	boxSizing: 'border-box',
	overflowX: 'hidden',
	overflowY: 'auto',
	zIndex: 10,
	paddingTop: 0,
	paddingRight: token('space.200', '16px'),
	paddingBottom: 0,
	paddingLeft: token('space.200', '16px'),
	transition: `opacity ${FADEIN_OVERLAY_TRANSITION_DURATION_MS}ms`,
	opacity: 0,
	visibility: 'hidden',
});

export const SearchResultsContainerAi = ({
	children,
	transitionState,
}: {
	children: React.ReactNode;
	transitionState: TransitionStatus;
}) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
	<div css={searchResultsContainerAiStyles} style={transitionStyles[transitionState]}>
		{children}
	</div>
);

const searchResultEmptyMessageImageStyles = css({
	paddingTop: token('space.300', '24px'),
	paddingRight: token('space.300', '24px'),
	paddingBottom: 0,
	paddingLeft: token('space.300', '24px'),
	textAlign: 'center',
});

export const SearchResultEmptyMessageImage = ({ children }: { children: React.ReactNode }) => (
	<div css={searchResultEmptyMessageImageStyles}>{children}</div>
);

const searchResultEmptyMessageTextStyles = css({
	paddingTop: token('space.300', '24px'),
	paddingRight: token('space.300', '24px'),
	paddingBottom: 0,
	paddingLeft: token('space.300', '24px'),
	textAlign: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	p: {
		color: token('color.text.subtlest', N200),
	},
});

export const SearchResultEmptyMessageText = ({ children }: { children: React.ReactNode }) => (
	<div css={searchResultEmptyMessageTextStyles}>{children}</div>
);

const searchResultEmptyMessageHeaderTextStyles = css({
	color: token('color.text', N500),
	font: token('font.body'),
	fontWeight: token('font.weight.bold'),
});

export const SearchResultEmptyMessageHeaderText = ({ children }: { children: React.ReactNode }) => (
	// eslint-disable-next-line @atlaskit/design-system/use-heading
	<h2 css={searchResultEmptyMessageHeaderTextStyles}>{children}</h2>
);

const searchResultSearchExternalSiteContainerStyles = css({
	paddingTop: token('space.300', '24px'),
	paddingRight: token('space.300', '24px'),
	paddingBottom: token('space.300', '24px'),
	paddingLeft: token('space.300', '24px'),
	textAlign: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	p: {
		color: token('color.text.subtlest', N200),
	},
});

export const SearchResultSearchExternalSiteContainer = ({
	children,
}: {
	children: React.ReactNode;
}) => <div css={searchResultSearchExternalSiteContainerStyles}>{children}</div>;
