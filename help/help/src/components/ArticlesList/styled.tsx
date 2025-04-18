/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const articlesListContainerStyles = css({
	position: 'relative',
});

export const ArticlesListContainer = ({ children }: { children: React.ReactNode }) => (
	<div css={articlesListContainerStyles}>{children}</div>
);

const toggleShowMoreArticlesContainerStyles = css({
	paddingTop: token('space.100', '8px'),
	paddingRight: 0,
	paddingBottom: token('space.100', '8px'),
	paddingLeft: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	span: {
		margin: 0,
	},
});

export const ToggleShowMoreArticlesContainer = ({ children }: { children: React.ReactNode }) => (
	<div css={toggleShowMoreArticlesContainerStyles}>{children}</div>
);
