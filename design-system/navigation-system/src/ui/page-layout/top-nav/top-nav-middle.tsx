/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { useIsFhsEnabled } from '../../fhs-rollout/use-is-fhs-enabled';

const styles = cssMap({
	root: {
		gap: token('space.100'),
		width: '100%',
		gridColumn: 2,
		alignItems: 'center',
		/**
		 * On small viewports the search is an icon button.
		 *
		 * We want the icon button (and Create button) to hug the right / end.
		 */
		display: 'flex',
		justifyContent: 'end',
		/**
		 * On large viewports the search is a text field.
		 *
		 * We want our search bar to adapt to available space (up to a maximum of `780px`)
		 * but we need to set that constraint in the grid.
		 *
		 * The parent grid on TopNav gives `TopNavMiddle` an `auto` width,
		 * so `TopNavMiddle` must set up further layout constraints.
		 *
		 * Setting it just on the search directly does not seem possible,
		 * because without the column `minmax` the search collapses to its `min-content` width.
		 *
		 * Because we need to set it on the column, we need to make an assumption / requirement
		 * that the search is always the first item.
		 */
		'@media (min-width: 48rem)': {
			display: 'grid',
			// This column constraint is only relevant for the search bar
			// It only applies to the first column
			// We know we can safely shrink the search to `min-content` because its text content can't wrap
			gridTemplateColumns: 'minmax(min-content, 780px)',
			// Additional items will be inserted into implicitly-created columns
			gridAutoFlow: 'column',
			// Determines the width of any implicitly-created columns
			// Using `max-content` because we don't want text to wrap
			gridAutoColumns: 'max-content',
			/**
			 * The Search Platform component uses a `780px` breakpoint which is not aligned
			 * with our `48rem` / `768px` breakpoint.
			 *
			 * This means there is a small range where the search is an icon button and we
			 * are still on the grid layout. So there is a `32px` wide icon button inside
			 * of a potentially `780px` column.
			 *
			 * We need to apply `justifyItems: 'end'` to ensure that icon button hugs the end of its column.
			 *
			 * We can remove this once the Search Platform component is aligned with our breakpoints.
			 */
			justifyItems: 'end',
		},
	},
	fullHeightSidebar: {
		// Pointer events are disabled on the top nav
		// So we need to restore them for the slot
		pointerEvents: 'auto',
	},
});

/**
 * __TopNavMiddle__
 *
 * Wrapper for the actions in the middle of the top navigation.
 *
 * Expects that the search bar is the first child.
 * If it is not, you might see unexpected layout behavior.
 */
export function TopNavMiddle({
	children,
}: {
	/**
	 * The content of the layout area.
	 *
	 * The first child should be the search bar.
	 * If it is not, you might see unexpected layout behavior.
	 *
	 * Should also contain the Create button.
	 */
	children: React.ReactNode;
}) {
	const isFhsEnabled = useIsFhsEnabled();

	return <div css={[styles.root, isFhsEnabled && styles.fullHeightSidebar]}>{children}</div>;
}
