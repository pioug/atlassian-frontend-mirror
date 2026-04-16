import { createContext } from 'react';

/**
 * Context for the panel splitter's double click handler. Only internally exported.
 *
 * NOTE: This context is a temporary workaround to enable the `SideNavPanelSplitter` component
 * to collapse the side nav on double click, without exposing the `onDoubleClick` prop on `PanelSplitter`.
 * Once `PanelSplitter` supports an `onDoubleClick` prop directly, this context should be removed.
 */
export const OnDoubleClickContext: import('react').Context<(() => void) | undefined> =
	createContext<(() => void) | undefined>(undefined);
