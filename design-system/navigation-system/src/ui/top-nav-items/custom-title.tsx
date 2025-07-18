/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { forwardRef, type ReactNode } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { useHasCustomTheme } from './themed/has-custom-theme-context';

const styles = cssMap({
	root: {
		whiteSpace: 'nowrap',
		maxWidth: '200px',
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		font: token('font.body'),
		// There should be `12px` between the logo and the custom title.
		// There is already `4px` of padding on the logo and a `4px` flex gap between the logo and the title.
		paddingInlineStart: token('space.050'),
		// The `TopNavStart` container has no padding, so the title needs padding at the end.
		paddingInlineEnd: token('space.100'),
		display: 'none',
		// Hiding the CustomTitle on smaller viewports
		'@media (min-width: 64rem)': {
			// '&&' is required to add more CSS specificity to resolve non-deterministic ordering, which can result in broken UI.
			// Clean up task: https://jplat.atlassian.net/browse/BLU-4788
			// @ts-ignore
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&&': {
				display: 'flex',
			},
		},
	},
	// Text color used in standard light/dark mode. Custom theming will use an inherited `color` value.
	subtleText: {
		color: token('color.text.subtle'),
	},
});

type CustomTitleProps = {
	/**
	 * The custom title value to display.
	 */
	children: ReactNode;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
};

/**
 * __Custom title__
 *
 * A custom site title to be displayed in the top navigation, to the right of the logo.
 * It is hidden on smaller viewports.
 */
export const CustomTitle = forwardRef(function CustomTitle(
	{ children, testId }: CustomTitleProps,
	ref: React.ForwardedRef<HTMLDivElement>,
) {
	const hasCustomTheme = useHasCustomTheme();

	return (
		<div
			ref={ref}
			css={[
				styles.root,
				// Only setting a text color when there is no custom theming.
				// With custom theming, the text will inherit the `color` set on the `TopNav`.
				// In the future we might want an explicit CSS var for this color, such as a subtle theme-aware color.
				!hasCustomTheme && styles.subtleText,
			]}
			data-testid={testId}
		>
			{children}
		</div>
	);
});
