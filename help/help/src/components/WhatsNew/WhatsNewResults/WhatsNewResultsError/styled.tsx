/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N200 } from '@atlaskit/theme/colors';

const searchResultEmptyMessageImageStyles = css({
	paddingTop: token('space.300', '24px'),
	paddingRight: token('space.300', '24px'),
	paddingBottom: 0,
	paddingLeft: token('space.300', '24px'),
	textAlign: 'center',
});

export const SearchResultEmptyMessageImage = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <div css={searchResultEmptyMessageImageStyles}>{children}</div>;

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

export const SearchResultEmptyMessageText = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <div css={searchResultEmptyMessageTextStyles}>{children}</div>;
