/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactNode } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

export type TPopoverSurfaceProps = {
	children: ReactNode;
};

const styles = cssMap({
	root: {
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.small', '3px'),
		boxShadow: token('elevation.shadow.overlay'),
		overflow: 'auto',
	},
});

/**
 * Optional styled wrapper for popover content.
 *
 * Adds default visual styling (background, border-radius, box-shadow)
 * using design tokens.
 *
 * Presentational primitive - `children`-only by design. This component
 * intentionally exposes no `style`, `className`, `xcss`, `id`, or `ref`
 * props. If you need any of those, render your own wrapper element inside
 * `Popover` instead. `PopoverSurface` is the no-config "give me the default
 * ADS overlay look" surface, nothing more.
 */
export function PopoverSurface({ children }: TPopoverSurfaceProps): React.ReactElement {
	return <div css={styles.root}>{children}</div>;
}
