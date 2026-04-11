import { createContext, type Context } from 'react';

/**
 * Provide capacity to override creation date
 * `DateOverrideContext` is a stopgap for a specific bug (https://product-fabric.atlassian.net/browse/CXP-2840)
 * This is a temporal solution, please consult before usage
 */
export const DateOverrideContext: Context<Record<string, number> | undefined> = createContext<
	Record<string, number> | undefined
>(undefined);
