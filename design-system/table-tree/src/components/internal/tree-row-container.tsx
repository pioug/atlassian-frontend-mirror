/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { FC, HTMLAttributes, ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const treeRowContainerStyles = css({
	display: 'flex',
	borderBlockEnd: `${token('border.width')} solid ${token('color.border')}`,
});

/**
 * __Tree row container__
 */
export const TreeRowContainer: FC<HTMLAttributes<HTMLDivElement> & { children: ReactNode }> = (
	props,
) => (
	<div
		role="row"
		css={treeRowContainerStyles}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
	/>
);
