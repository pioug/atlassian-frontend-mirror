/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N800 } from '@atlaskit/theme/colors';
import Heading from '@atlaskit/heading';

const relatedArticlesTitleStyles = css({
	color: token('color.text', N800),
	font: token('font.heading.small'),
	paddingTop: token('space.200', '16px'),
	paddingRight: 0,
	paddingBottom: token('space.200', '16px'),
	paddingLeft: 0,
});

export const RelatedArticlesTitle = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<div css={relatedArticlesTitleStyles}>
		<Heading size="large" as="h3" color="color.text">
			{children}
		</Heading>
	</div>
);

/**
 * Loading styled-components
 */

const loadingRelatedArticleListStyles = css({
	width: '100%',
	margin: 0,
	padding: 0,
	boxSizing: 'border-box',
});

export const LoadingRelatedArticleList = ({
	children,
	...rest
}: {
	[rest: string]: any;
	children: React.ReactNode;
}): JSX.Element => (
	<ul css={loadingRelatedArticleListStyles} {...rest}>
		{children}
	</ul>
);

const loadingRelatedArticleListItemStyles = css({
	display: 'block',
	width: '100%',
	paddingTop: token('space.100', '8px'),
	paddingRight: token('space.100', '8px'),
	paddingBottom: token('space.100', '8px'),
	paddingLeft: token('space.100', '8px'),
	marginBottom: token('space.200', '16px'),
	boxSizing: 'border-box',
});

export const LoadingRelatedArticleListItem = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <li css={loadingRelatedArticleListItemStyles}>{children}</li>;
