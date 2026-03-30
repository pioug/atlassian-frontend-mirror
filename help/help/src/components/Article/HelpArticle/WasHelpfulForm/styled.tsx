/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const articleFeedbackContainerStyles = css({
	position: 'relative',
});

export const ArticleFeedbackContainer = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <div css={articleFeedbackContainerStyles}>{children}</div>;

const articleFeedbackTextStyles = css({
	font: token('font.heading.xxsmall'),
	color: token('color.text.subtlest'),
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
	[rest: string]: any;
	children: React.ReactNode;
	id?: string;
	paddingRight?: string;
	top?: string;
}): JSX.Element => (
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
	paddingTop: token('space.200'),
});

export const ArticleFeedbackAnswerWrapper = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives
	<div css={articleFeedbackAnswerWrapperStyles}>{children}</div>
);
