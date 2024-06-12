/* eslint-disable @repo/internal/react/no-clone-element */
/** @jsx jsx */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const bodyStyles = css({
	position: 'relative',
	border: 'none',
	'&:after': {
		position: 'absolute',
		inset: 0,
		boxShadow: `inset 0 -2px 0 0 ${token('color.border', '#eee')}`,
		content: "''",
		pointerEvents: 'none',
	},
});

/**
 * __TBody__
 * @primitive
 */
export const TBody: FC<{ children: ReactNode }> = ({ children }) => (
	<tbody css={bodyStyles}>{children}</tbody>
);

export default TBody;
