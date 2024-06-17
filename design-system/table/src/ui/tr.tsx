/** @jsx jsx */
import type { FC, ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import FocusRing from '@atlaskit/focus-ring';
import { token } from '@atlaskit/tokens';

const baseStyles = css({
	height: '3rem',
	position: 'relative',
	border: 'none',
	borderImageWidth: 0,
	borderSpacing: 0,
});

const selectedStyles = css({
	backgroundColor: token('color.background.selected', '#DEEBFF88'),
	'&:hover': {
		backgroundColor: token('color.background.selected.hovered', '#DEEBFF'), // B50
	},
});

const subitemStyles = css({
	backgroundColor: token('color.background.neutral', '#091E420F'),
});

const bodyRowStyles = css({
	borderBlockEnd: `1px solid ${token('color.border', '#eee')}`,
	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered', '#f8f8f8'),
	},
	'&:focus-visible::after': {
		boxShadow: 'none',
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
		<FocusRing isInset>
			<tr
				tabIndex={-1}
				aria-selected={isSelected}
				data-testid={testId}
				css={[
					baseStyles,
					isBodyRow && bodyRowStyles,
					isSelected && selectedStyles,
					isSubitem && subitemStyles,
				]}
			>
				{children}
			</tr>
		</FocusRing>
	);
};
