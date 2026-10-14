import React, { useCallback, useLayoutEffect, useMemo, useReducer, useState } from 'react';

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { PortalManager } from './PortalManager';

type PortalBucketProps = {
	id: number;
	portalManager: PortalManager;
};

function LegacyPortalBucket({ id, portalManager }: PortalBucketProps): React.JSX.Element {
	// State to hold the current portals for this bucket
	const [portals, setPortals] = useState({});
	// Effect to register/unregister this bucket with the portal manager on mount/unmount
	useLayoutEffect(() => {
		portalManager.registerBucket(id, setPortals);
		return () => {
			portalManager.unregisterBucket(id);
		};
	}, [id, portalManager]);
	// Memoize the portal elements to avoid unnecessary re-renders
	const portalElements = useMemo(() => Object.values(portals), [portals]);
	// Render the current portal elements
	// @ts-ignore - TS2322 TypeScript 5.9.2 upgrade
	return <>{portalElements}</>;
}

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
	return isExperimentEnabled('platform_editor_reduce_memory_leaks') ? (
		<TickPortalBucket id={id} portalManager={portalManager} />
	) : (
		<LegacyPortalBucket id={id} portalManager={portalManager} />
	);
}
