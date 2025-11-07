/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const loadingErrorMessageStyles = css({
	paddingTop: token('space.300', '24px'),
	textAlign: 'center',
});

export const LoadingErrorMessage = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<div css={loadingErrorMessageStyles}>{children}</div>
);

const loadingErrorButtonContainerStyles = css({
	paddingTop: token('space.300', '24px'),
	textAlign: 'center',
});

export const LoadingErrorButtonContainer = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <div css={loadingErrorButtonContainerStyles}>{children}</div>;

const loadingErrorHeadingStyles = css({
	paddingTop: token('space.500', '40px'),
	textAlign: 'center',
});

export const LoadingErrorHeading = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<div css={loadingErrorHeadingStyles}>{children}</div>
);
