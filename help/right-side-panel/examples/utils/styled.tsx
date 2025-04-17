/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const buttonsWrapperStyles = css({
	paddingTop: token('space.200', '16px'),
	paddingRight: token('space.200', '16px'),
	paddingBottom: token('space.200', '16px'),
	paddingLeft: token('space.200', '16px'),
});

export const ButtonsWrapper = ({ children }: { children: React.ReactNode }) => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives
	<div css={buttonsWrapperStyles}>{children}</div>
);

const textWrapperStyles = css({
	paddingTop: token('space.200', '16px'),
	paddingRight: token('space.200', '16px'),
	paddingBottom: token('space.200', '16px'),
	paddingLeft: token('space.200', '16px'),
	textAlign: 'center',
});

export const TextWrapper = ({ children }: { children: React.ReactNode }) => (
	<div css={textWrapperStyles}>{children}</div>
);
