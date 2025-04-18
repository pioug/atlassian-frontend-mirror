/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N800 } from '@atlaskit/theme/colors';

const relatedArticlesTitleStyles = css({
	color: token('color.text', N800),
	font: token('font.heading.small'),
	paddingTop: token('space.200', '16px'),
	paddingRight: 0,
	paddingBottom: token('space.200', '16px'),
	paddingLeft: 0,
});

export const RelatedArticlesTitle = ({ children }: { children: React.ReactNode }) => (
	<div css={relatedArticlesTitleStyles}>{children}</div>
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
	children: React.ReactNode;
	[rest: string]: any;
}) => (
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

export const LoadingRelatedArticleListItem = ({ children }: { children: React.ReactNode }) => (
	<li css={loadingRelatedArticleListItemStyles}>{children}</li>
);
