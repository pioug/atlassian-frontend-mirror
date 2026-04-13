import { type Context, createContext } from 'react';

/**
 * __Ensure is inside drawer context__
 *
 * An context that ensures that the component is inside a drawer.
 */
export const EnsureIsInsideDrawerContext: Context<boolean> = createContext<boolean>(false);
