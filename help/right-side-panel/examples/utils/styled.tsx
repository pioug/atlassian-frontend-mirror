/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const buttonsWrapperStyles = css({
	paddingTop: token('space.200'),
	paddingRight: token('space.200'),
	paddingBottom: token('space.200'),
	paddingLeft: token('space.200'),
});

export const ButtonsWrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives
	<div css={buttonsWrapperStyles}>{children}</div>
);

const textWrapperStyles = css({
	paddingTop: token('space.200'),
	paddingRight: token('space.200'),
	paddingBottom: token('space.200'),
	paddingLeft: token('space.200'),
	textAlign: 'center',
});

export const TextWrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<div css={textWrapperStyles}>{children}</div>
);
