/* eslint-disable @atlaskit/design-system/no-styled-tagged-template-expression */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx, keyframes } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const containerStyles = css({
	position: 'absolute',
	top: 0,
	bottom: 0,
	left: 0,
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	backgroundColor: token('elevation.surface'),
});

export const Container = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<div css={containerStyles}>{children}</div>
);

const sectionStyles = css({
	flexGrow: 1,
	display: 'flex',
	flexDirection: 'column',
	minHeight: 0,
});

export const Section = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<div css={sectionStyles}>{children}</div>
);

const helpFooterStyles = css({
	paddingTop: token('space.100'),
	paddingRight: 0,
	paddingBottom: token('space.100'),
	paddingLeft: 0,
	boxSizing: 'border-box',
	backgroundColor: token('color.background.neutral'),
	borderTop: `${token('border.width.selected')} solid ${token('color.border')}`,
	justifyContent: 'space-between',
});

export const HelpFooter = ({
	dataTestId,
	children,
}: {
	children: React.ReactNode;
	dataTestId: string;
}): JSX.Element => (
	<div css={helpFooterStyles} data-testid={dataTestId}>
		{children}
	</div>
);

/**
 * Loading
 */

const loadingContainerStyles = css({
	paddingTop: token('space.200'),
	paddingRight: token('space.200'),
	paddingBottom: token('space.200'),
	paddingLeft: token('space.200'),
	height: '100%',
});

export const LoadingContainer = ({
	children,
	...rest
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>): JSX.Element => (
	<div css={loadingContainerStyles} {...rest}>
		{children}
	</div>
);

type LoadingRectangleProps = {
	contentHeight?: string;
	contentWidth?: string;
	marginTop?: string;
};

const shimmer = keyframes({
	'0%': {
		backgroundPosition: '-300px 0',
	},
	'100%': {
		backgroundPosition: '1000px 0',
	},
});

const loadingRectangleStyles = css({
	position: 'relative',
	height: token('space.200'),
	marginTop: token('space.100'),
	width: '100%',
	borderRadius: token('radius.xsmall'),
	animationDuration: '1.2s',
	animationFillMode: 'forwards',
	animationIterationCount: 'infinite',
	animationName: shimmer,
	animationTimingFunction: 'linear',
	backgroundColor: token('color.background.neutral'),
	backgroundImage: `linear-gradient(
		to right,
		${token('color.background.neutral.subtle')} 10%,
		${token('color.background.neutral')} 20%,
		${token('color.background.neutral.subtle')} 30%
	)`,
	backgroundRepeat: 'no-repeat',
});

export const LoadingRectangle = ({
	contentWidth,
	contentHeight,
	marginTop,
}: LoadingRectangleProps): JSX.Element => (
	<div
		css={[loadingRectangleStyles]}
		style={{ width: contentWidth, height: contentHeight, marginTop }}
	/>
);
