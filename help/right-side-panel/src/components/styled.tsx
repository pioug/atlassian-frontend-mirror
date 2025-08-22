/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';

const flexContainerStyles = css({
	display: 'flex',
});

export const FlexContainer = ({ id, children }: { children: React.ReactNode; id: string }) => (
	<div id={id} css={flexContainerStyles}>
		{children}
	</div>
);

const contentWrapperStyles = css({
	position: 'relative',
	minWidth: 0,
	flex: '1 1 auto',
	overflowX: 'hidden',
});

export const ContentWrapper = ({ children }: { children: React.ReactNode }) => (
	<div css={contentWrapperStyles}>{children}</div>
);
