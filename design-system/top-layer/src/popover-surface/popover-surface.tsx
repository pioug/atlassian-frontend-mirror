/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

export type TPopoverSurfaceProps = {
	children: ReactNode;
};

const styles = cssMap({
	root: {
		backgroundColor: token('elevation.surface.overlay'),
		// Pairs the text color with the overlay background, so the contrast holds wherever it renders.
		color: token('color.text'),
		borderRadius: token('radius.large'),
		boxShadow: token('elevation.shadow.overlay'),
		overflow: 'auto',
	},
});

/**
 * Optional styled wrapper for popover content.
 *
 * Adds the default overlay styles from design tokens: background, text color, border radius and
 * box shadow. Content that overflows scrolls.
 *
 * Presentational primitive, with only `children` by design. It has no `style`, `className`,
 * `xcss`, `id` or `ref` props. If you need any of those, render your own wrapper element inside
 * `Popover` instead. `PopoverSurface` gives the default ADS overlay look with no configuration,
 * nothing more.
 */
export function PopoverSurface({ children }: TPopoverSurfaceProps): ReactNode {
	return <div css={styles.root}>{children}</div>;
}
