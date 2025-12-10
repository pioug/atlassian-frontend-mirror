/* eslint-disable @atlaskit/ui-styling-standard/no-classname-prop */
import React, { type ReactNode } from 'react';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

type AboveProp = {
	above: Breakpoint;
	below?: never;
};

type BelowProp = {
	above?: never;
	below: Breakpoint;
};

type ShowProps = {
	children: ReactNode;
} & (AboveProp | BelowProp);

/**
 * Generate a className based on the breakpoints provided.
 *
 * **Warning** - must much classnames defined in ResponsiveContainer.tsx
 * @param above - The breakpoint to show the element above.
 * @param below - The breakpoint to show the element below.
 * @returns The className to apply to the element.
 */
const generateClassName = (above?: Breakpoint, below?: Breakpoint) => {
	if (above) {
		return `show-above-${above}`;
	}

	if (below) {
		return `show-below-${below}`;
	}

	return;
};

/**
 * Conditionally renders children based on responsive breakpoints.
 * Use either `above` or `below` prop to control visibility.
 *
 * *note:* This component must be an ancestor of a ResponsiveContainer component to work correctly
 * as it relies on CSS container queries.
 */
export const Show = ({ children, above, below }: ShowProps): React.JSX.Element => {
	return <div className={generateClassName(above, below)}>{children}</div>;
};
