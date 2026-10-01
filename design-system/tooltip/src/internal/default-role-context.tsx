import { createContext, useContext } from 'react';

/**
 * Internal. Sets the role `TooltipPrimitive` uses when it gets no `role` prop.
 *
 * The top-layer tooltip puts `role="tooltip"` on the Popover host and provides
 * `'presentation'` here, so a custom `component` that does not forward `role`
 * does not add a second `role="tooltip"`. `TooltipPrimitive` resets this to
 * `undefined` around its own children, so a primitive inside tooltip content
 * keeps the normal default.
 */
export const DefaultRoleContext: React.Context<React.AriaRole | undefined> = createContext<
	React.AriaRole | undefined
>(undefined);

export function useDefaultRole(): React.AriaRole | undefined {
	return useContext(DefaultRoleContext);
}
