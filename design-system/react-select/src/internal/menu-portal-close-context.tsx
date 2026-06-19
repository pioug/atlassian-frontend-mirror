import { type Context, createContext } from 'react';

/**
 * Internal handoff from `Select` to `MenuPortalTopLayer` for the top-layer
 * dismiss signal. Kept off `MenuPortalProps` to avoid widening the public
 * subpath export at `@atlaskit/react-select/menu-portal`.
 */
export const MenuPortalCloseContext: Context<(() => void) | undefined> = createContext<
	(() => void) | undefined
>(undefined);
