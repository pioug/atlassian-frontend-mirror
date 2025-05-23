/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { FC, ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const baseStyles = css({
	position: 'sticky',
	zIndex: 1,
	inset: 0,
	backgroundColor: token('elevation.surface', 'white'),
	border: 'none',
	borderBlockEnd: `2px solid ${token('color.border', '#eee')}`,
	borderBlockStart: '2px solid transparent',
});

/**
 * __THead__
 *
 * A primitive table head container. Applies the HTML native element with minimal styling.
 *
 * @primitive
 */
export const THead: FC<{ children?: ReactNode }> = ({ children }) => {
	return <thead css={baseStyles}>{children}</thead>;
};
