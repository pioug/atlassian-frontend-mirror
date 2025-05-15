import { type ReactNode } from 'react';

import { type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export type Placement =
	| 'auto-start'
	| 'auto'
	| 'auto-end'
	| 'top-start'
	| 'top'
	| 'top-end'
	| 'right-start'
	| 'right'
	| 'right-end'
	| 'bottom-end'
	| 'bottom'
	| 'bottom-start'
	| 'left-end'
	| 'left'
	| 'left-start';

export interface InlineDialogProps extends WithAnalyticsEventsProps {
	/**
	 * The elements that the InlineDialog will be positioned relative to.
	 */
	children: ReactNode;
	/**
	 * The elements to be displayed within the InlineDialog.
	 */
	content: ReactNode | (() => ReactNode);
	/**
	 * Sets whether to show or hide the dialog.
	 */
	isOpen?: boolean;
	/**
	 * Function called when you lose focus on the object.
	 */
	onContentBlur?: () => void;
	/**
	 * Function called when user clicks on the open dialog.
	 */
	onContentClick?: () => void;
	/**
	 * Function called when user focuses on the open dialog.
	 */
	onContentFocus?: () => void;
	/**
	 * Function called when the dialog is open and a click occurs anywhere outside
	 * the dialog.
	 */
	onClose?: (obj: { isOpen: boolean; event: Event }) => void;
	/**
	 * Where the dialog should appear, relative to the contents of the children.
	 */
	placement?: Placement;

	/**
	 * Placement strategy used. Can be 'fixed' or 'absolute'. Defaults to 'fixed'.
	 */
	strategy?: 'fixed' | 'absolute';
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
	 */
	testId?: string;
	/**
	 * This is a list of backup placements to try.
	 * When the preferred placement doesn't have enough space,
	 * the modifier will test the ones provided in the list, and use the first suitable one.
	 * If no fallback placements are suitable, it reverts back to the original placement.
	 */
	fallbackPlacements?: Placement[];
}
