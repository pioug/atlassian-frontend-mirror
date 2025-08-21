/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const articleContentInnerStyles = css({
	paddingBottom: token('space.200', '16px'),
	position: 'relative',
});

export const ArticleContentInner = ({ children }: { children: React.ReactNode }) => (
	<div css={articleContentInnerStyles}>{children}</div>
);

const articleContentTitleStyles = css({
	paddingBottom: token('space.200', '16px'),
});

export const ArticleContentTitle = ({ children }: { children: React.ReactNode }) => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives
	<div css={articleContentTitleStyles}>{children}</div>
);

const articleContentTitleLinkStyles = css({
	'&:hover': {
		textDecoration: 'none',
	},
});

export const ArticleContentTitleLink = ({
	href,
	target,
	children,
}: {
	children: React.ReactNode;
	href: string;
	target: string;
}) => (
	// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
	<a href={href} target={target} css={articleContentTitleLinkStyles}>
		{children}
	</a>
);
