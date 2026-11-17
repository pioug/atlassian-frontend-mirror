import React, { useCallback, useLayoutEffect, useReducer } from 'react';

import type { PortalManager } from './PortalManager';

type PortalBucketProps = {
	id: number;
	portalManager: PortalManager;
};

/**
 * Portals stay in the manager; state is only a render tick. React keeps
 * hook state on both the current and alternate fiber, so storing portals
 * in state would retain removed portals until the next render.
 */
function TickPortalBucket({ id, portalManager }: PortalBucketProps): React.JSX.Element {
	const [, forceRender] = useReducer((tick: number) => tick + 1, 0);
	const updater = useCallback(() => forceRender(), []);
	useLayoutEffect(() => {
		portalManager.registerBucket(id, updater);
		return () => {
			portalManager.unregisterBucket(id);
		};
	}, [id, portalManager, updater]);
	// @ts-ignore - TS2322 TypeScript 5.9.2 upgrade
	return <>{Object.values(portalManager.getBuckets()[id]?.portals ?? {})}</>;
}

/**
 * A component for rendering portals managed by a `PortalManager`.
 * It subscribes to a `PortalManager` instance to listen for changes in the portal content
 * and renders the content of its assigned portal bucket.
 *
 * @param {PortalBucketProps} props The component props.
 * @param {number} props.id The ID for the portal bucket. This ID is used by the `PortalManager` to manage the content of this bucket.
 * @param {PortalManager} props.portalManager An instance of `PortalManager` which manages the registration and unregistration of portal buckets and their content.
 * @returns {React.ReactElement} The React element(s) that are currently registered to this portal bucket.
 */
export function PortalBucket({ id, portalManager }: PortalBucketProps): React.JSX.Element {
	return <TickPortalBucket id={id} portalManager={portalManager} />;
}
