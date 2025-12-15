/* eslint-disable @atlaskit/ui-styling-standard/no-classname-prop */
import React, { type ReactNode } from 'react';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

type AboveProp = {
	above: Breakpoint;
	below?: never;
	only?: never;
};

type BelowProp = {
	above?: never;
	below: Breakpoint;
	only?: never;
};

type OnlyProp = {
	above?: never;
	below?: never;
	only: Breakpoint;
};

type ShowProps = {
	children: ReactNode;
} & (AboveProp | BelowProp | OnlyProp);

/**
 * Generate a className based on the breakpoints provided.
 *
 * **Warning** - must much classnames defined in ResponsiveContainer.tsx
 * @param above - The breakpoint to show the element above.
 * @param below - The breakpoint to show the element below.
 * @returns The className to apply to the element.
 */
const generateClassName = (above?: Breakpoint, below?: Breakpoint, only?: Breakpoint) => {
	if (only) {
		return `show-only-${only}`;
	}

	const classes = [];

	if (above) {
		classes.push(`show-above-${above}`);
	}

	if (below) {
		classes.push(`show-below-${below}`);
	}

	return classes.length > 0 ? classes.join(' ') : undefined;
};

/**
 * Conditionally renders children based on responsive breakpoints.
 * Use either `above` or `below` prop to control visibility.
 *
 * *note:* This component must be an ancestor of a ResponsiveContainer component to work correctly
 * as it relies on CSS container queries.
 */
export const Show = ({ children, above, below, only }: ShowProps): React.JSX.Element => {
	return <div className={generateClassName(above, below, only)}>{children}</div>;
};
