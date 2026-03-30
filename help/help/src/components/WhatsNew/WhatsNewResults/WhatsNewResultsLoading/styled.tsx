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
	marginTop: token('space.200'),
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
	paddingTop: token('space.100'),
	paddingRight: token('space.100'),
	paddingBottom: token('space.100'),
	paddingLeft: token('space.100'),
	margin: 0,
	boxSizing: 'border-box',
});

export const LoadingWhatsNewResultsListItem = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <li css={loadingWhatsNewResultsListItemStyles}>{children}</li>;
