/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { FC, ReactNode } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import { Focusable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	base: {
		height: '3rem',
		position: 'relative',
		border: 'none',
		borderImageWidth: 0,
		borderSpacing: 0,
	},
	selected: {
		backgroundColor: token('color.background.selected', '#DEEBFF88'),
		'&:hover': {
			backgroundColor: token('color.background.selected.hovered', '#DEEBFF'), // B50
		},
	},
	subitem: {
		backgroundColor: token('color.background.neutral', '#091E420F'),
	},
	bodyRow: {
		borderBlockEndWidth: token('border.width', '1px'),
		borderBlockEndStyle: 'solid',
		borderBlockEndColor: token('color.border', '#eee'),
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered', '#f8f8f8'),
		},
	},
});

interface TRProps {
	/**
	 * A `testId` prop is a unique string that appears as a data attribute `data-testid`
	 * in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * If the row has programatic selection applied.
	 */
	isSelected?: boolean;
	/**
	 * Adjust the behavior of the element depending on whether the row is in the `THead` or in the `TBody`.
	 */
	isBodyRow?: boolean;
	/**
	 * Content of the row.
	 */
	children?: ReactNode;
	/**
	 * If the row is a subitem (an expandable row nested under a parent).
	 */
	isSubitem?: boolean;
}

/**
 * __Row__
 *
 * A row primitive.
 *
 * - [Examples](https://atlassian.design/components/table/examples)
 */
export const TR: FC<TRProps> = ({ children, testId, isSelected, isBodyRow = true, isSubitem }) => {
	return (
		<Focusable
			as="tr"
			isInset
			tabIndex={-1}
			aria-selected={isSelected}
			testId={testId}
			xcss={cx(
				styles.base,
				isBodyRow && styles.bodyRow,
				isSelected && styles.selected,
				isSubitem && styles.subitem,
			)}
		>
			{children}
		</Focusable>
	);
};
