import { type Context, createContext } from 'react';

import { type TPopoverCloseReason } from '@atlaskit/top-layer/popover/types';

type TMenuPortalCloseContext = {
	/**
	 * Select's "close the menu" callback, distinct from `Popover.onClose`.
	 */
	closeMenu: (args?: { reason: TPopoverCloseReason }) => void;
	/**
	 * The menu's `Popover` has finished closing, so Select can unmount the menu.
	 */
	onExitFinish: () => void;
};

/**
 * Internal handoff from `Select` to `MenuPortalTopLayer` for the top-layer
 * dismiss and exit signals. Kept off `MenuPortalProps` to avoid widening the
 * public subpath export at `@atlaskit/react-select/menu-portal`.
 */
export const MenuPortalCloseContext: Context<TMenuPortalCloseContext | undefined> = createContext<
	TMenuPortalCloseContext | undefined
>(undefined);
