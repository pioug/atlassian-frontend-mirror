import { type ReactNode } from 'react';

export type VisuallyHiddenProps = {
	/**
	 * The element or elements that should be hidden.
	 */
	children: ReactNode;
	/**
	 * An ARIA role attribute to aid screen readers.
	 */
	role?: string;
	/**
	 * An id may be appropriate for this component if used in conjunction with `aria-describedby`
	 * on a paired element.
	 */
	id?: string;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
};
