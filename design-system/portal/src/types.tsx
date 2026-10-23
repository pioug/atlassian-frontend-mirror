import type React from 'react';

import { type MountStrategy, type PortalEventDetail } from './internal/types';

/**
 * Interface for props to be passed in Atlassian Portal component
 *
 * @deprecated The browser top layer renders layered UI above the page without a portal. Use a
 * design system layer component (for example Popup, Tooltip or Modal dialog), or `Popover` and
 * `Dialog` from `@atlaskit/top-layer`.
 */
export interface PortalProps {
	/* Children to render in the React Portal. */
	children: React.ReactNode;
	/* The z-index of the DOM container element. */
	zIndex?: number | string;
	/**
	 * Specify the mount strategy: useEffect or useLayoutEffect.
	 * Note: UseLayoutEffect can lead to performance issues and is discouraged.
	 */
	mountStrategy?: MountStrategy;
}

/**
 * Custom event object that will be fired when Atlassian Portal component is mounted and unmounted
 *
 * @deprecated Top-layer surfaces do not fire portal events. To know when a top-layer surface opens
 * or closes, listen for the native `toggle` and `close` events.
 */
export type PortalEvent = CustomEvent<PortalEventDetail>;
