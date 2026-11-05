import { createContext, type Context } from 'react';

export type TopNavBreakpoints = {
	belowSm: boolean;
	/**
	 * Whether the header width has been measured on the client.
	 */
	hasMeasured: boolean;
};

// Null outside a gated TopNav: consumers retain their viewport-based behaviour.
export const TopNavElementContext: Context<TopNavBreakpoints | null> =
	createContext<TopNavBreakpoints | null>(null);
