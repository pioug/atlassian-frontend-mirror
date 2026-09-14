/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import { useMemo } from 'react';

import { SmartLinkEvents } from '../../utils/analytics/SmartLinkEvents';

export function useSmartLinkEvents(): SmartLinkEvents {
	/**
	 * this utility maybe extended in the future to include
	 * more contextual info about SLs
	 */
	const events = useMemo(() => new SmartLinkEvents(), []);
	return events;
}

export type Fire3PWorkflowsClickEventOptions = {
	/** True for middle-clicks (button === 1) captured via `onAuxClick`. */
	isAuxClick?: boolean;
	/** True for right-clicks captured via `onContextMenu`. */
	isContextMenu?: boolean;
};

/**
 * @deprecated Use `import { useFire3PWorkflowsClickEvent } from '@atlaskit/smart-card/use-fire3-p-workflows-click-event'` instead.
 */
export { useFire3PWorkflowsClickEvent } from './useFire3PWorkflowsClickEvent';
