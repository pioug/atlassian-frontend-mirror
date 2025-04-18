/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';
import { N200 } from '@atlaskit/theme/colors';

const { heading } = fontFallback;

const articleFeedbackContainerStyles = css({
	position: 'relative',
});

export const ArticleFeedbackContainer = ({ children }: { children: React.ReactNode }) => (
	<div css={articleFeedbackContainerStyles}>{children}</div>
);

const articleFeedbackTextStyles = css({
	font: token('font.heading.xxsmall', heading.xxsmall),
	color: token('color.text.subtlest', N200),
	position: 'relative',
	display: 'inline-block',
});

export const ArticleFeedbackText = ({
	id,
	top,
	paddingRight,
	children,
	...rest
}: {
	id?: string;
	top?: string;
	paddingRight?: string;
	children: React.ReactNode;
	[rest: string]: any;
}) => (
	<div
		id={id}
		css={articleFeedbackTextStyles}
		style={{
			top: top,
			paddingRight: paddingRight,
		}}
		{...rest}
	>
		{children}
	</div>
);

const articleFeedbackAnswerWrapperStyles = css({
	paddingTop: token('space.200', '16px'),
});

export const ArticleFeedbackAnswerWrapper = ({ children }: { children: React.ReactNode }) => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives
	<div css={articleFeedbackAnswerWrapperStyles}>{children}</div>
);
