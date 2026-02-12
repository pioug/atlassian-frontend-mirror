/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

const bodyStyles = css({
	position: 'relative',
	border: 'none',
});

/**
 * __TBody__
 * @primitive
 */
export const TBody: FC<{ children: ReactNode }> = ({ children }) => (
	<tbody css={bodyStyles}>{children}</tbody>
);
