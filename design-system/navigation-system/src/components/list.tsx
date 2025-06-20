/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode, type Ref } from 'react';

import { jsx, type XCSSProp } from '@compiled/react';

export type ListProps = {
	/**
	 * The contents of the list. Should contain list items.
	 */
	children: ReactNode;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * Bounded style overrides.
	 */
	xcss?: XCSSProp<'alignItems' | 'display' | 'gap' | 'paddingInlineStart' | 'padding', never>;
};

function _List({ children, testId, xcss }: ListProps, forwardedRef: Ref<HTMLDivElement>) {
	return (
		/**
		 * We are using `role="list"` instead of a `ul` element to enable more flexible
		 * composition. By using ARIA roles we can validly have elements between a list
		 * and list items, as long as those in-between elements have no semantics.
		 */
		<div role="list" ref={forwardedRef} className={xcss} data-testid={testId}>
			{children}
		</div>
	);
}

/**
 * __List__
 *
 * A an element with the role of `list` for semantically grouping list items.
 *
 * This is the internal primitive used by other external components in the navigation system.
 */
export const List = forwardRef<HTMLDivElement, ListProps>(_List);
