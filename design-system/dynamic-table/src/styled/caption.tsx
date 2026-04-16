/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const captionStyles = css({
	font: token('font.heading.medium'),
	marginBlockEnd: token('space.100'),
	marginBlockStart: token('space.300'),
	willChange: 'transform',
});

export const Caption: FC<{ children: ReactNode }> = ({ children }) => (
	<caption css={captionStyles}>{children}</caption>
);
