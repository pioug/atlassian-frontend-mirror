import { type Context, createContext } from 'react';

import { type TPopoverCloseReason } from '@atlaskit/top-layer/popover/types';

type CloseMenu = (args?: { reason: TPopoverCloseReason }) => void;

/**
 * Internal handoff from `Select` to `MenuPortalTopLayer` for the top-layer
 * dismiss signal. Kept off `MenuPortalProps` to avoid widening the public
 * subpath export at `@atlaskit/react-select/menu-portal`.
 */
export const MenuPortalCloseContext: Context<CloseMenu | undefined> = createContext<
	CloseMenu | undefined
>(undefined);
