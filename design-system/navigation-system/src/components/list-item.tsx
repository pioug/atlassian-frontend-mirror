/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode, type Ref } from 'react';

import { jsx } from '@compiled/react';

import type { StrictXCSSProp } from '@atlaskit/css';

type ListItemProps = {
	/**
	 * The contents of the list item.
	 */
	children: ReactNode;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * Bounded style overrides.
	 */
	xcss?: StrictXCSSProp<'display' | 'scrollMarginInline', never>;
};

function _ListItem({ children, testId, xcss }: ListItemProps, ref: Ref<HTMLDivElement>) {
	return (
		<div role="listitem" ref={ref} className={xcss} data-testid={testId}>
			{children}
		</div>
	);
}

/**
 * __List item__
 *
 * A [list item](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li) with visual styles removed.
 */
export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(_ListItem);
