/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

/**
 * Loading styled-components
 */
const loadingWhatsNewResultsListStyles = css({
	width: '100%',
	margin: 0,
	padding: 0,
	boxSizing: 'border-box',
	marginTop: token('space.200', '16px'),
});

export const LoadingWhatsNewResultsList = ({
	children,
	...rest
}: {
	[rest: string]: any;
	children: React.ReactNode;
}): JSX.Element => (
	<ul css={loadingWhatsNewResultsListStyles} {...rest}>
		{children}
	</ul>
);

const loadingWhatsNewResultsListItemStyles = css({
	display: 'block',
	width: '100%',
	paddingTop: token('space.100', '8px'),
	paddingRight: token('space.100', '8px'),
	paddingBottom: token('space.100', '8px'),
	paddingLeft: token('space.100', '8px'),
	margin: 0,
	boxSizing: 'border-box',
});

export const LoadingWhatsNewResultsListItem = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <li css={loadingWhatsNewResultsListItemStyles}>{children}</li>;
