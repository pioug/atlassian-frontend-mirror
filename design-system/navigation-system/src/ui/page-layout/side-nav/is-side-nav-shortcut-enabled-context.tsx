import { createContext, type Context } from 'react';

/**
 * Context for whether the side nav toggle shortcut is enabled.
 *
 * Used to share the `isSideNavShortcutEnabled` prop value from `Root` with other components,
 * so the visual keyboard shortcut in tooltips can be conditionally displayed.
 */
export const IsSideNavShortcutEnabledContext: Context<boolean> = createContext<boolean>(false);
