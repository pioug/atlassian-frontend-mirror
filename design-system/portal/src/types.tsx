import type React from 'react';

import { type MountStrategy, type PortalEventDetail } from './internal/types';

/**
 * Interface for props to be passed in Atlassian Portal component
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
 */
export type PortalEvent = CustomEvent<PortalEventDetail>;
