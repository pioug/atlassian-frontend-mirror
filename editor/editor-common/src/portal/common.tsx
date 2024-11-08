import React, { useLayoutEffect, useMemo, useState } from 'react';

import { createPortal } from 'react-dom';

import { PortalBucket } from './PortalBucket';
import { type PortalManager } from './PortalManager';

type RenderFn = (
	children: () => React.ReactChild | JSX.Element | null,
	container: HTMLElement,
	key: string,
) => void;
type RemoveFn = (key: string) => void;
type DestoryFn = () => void;

export interface PortalProviderAPI {
	render: RenderFn;
	remove: RemoveFn;
	destroy: DestoryFn;
}

export type PortalRendererComponent = () => JSX.Element;

export type UsePortalProviderReturnType = [PortalProviderAPI, PortalRendererComponent];

export function createPortalRendererComponent(portalManager: PortalManager) {
	return function PortalRenderer() {
		const [buckets, setBuckets] = useState(portalManager.getBuckets());
		useLayoutEffect(() => {
			portalManager.registerPortalRenderer(setBuckets);
			return () => {
				portalManager.unregisterPortalRenderer();
			};
		}, []);
		const portalsElements = useMemo(
			() => buckets.map((_, i) => <PortalBucket key={i} id={i} portalManager={portalManager} />),
			[buckets],
		);
		return <>{portalsElements}</>;
	};
}

/**
 * Creates a portal provider for managing multiple React portals. The provider
 * facilitates rendering, removing, and destroying portals managed by a given
 * PortalManager.
 *
 * @param {PortalManager} portalManager - An instance of a PortalManager which
 * is responsible for registering, managing, and destroying portals.
 * @returns {PortalProviderAPI} An object containing methods to render, remove, and destroy
 * portals.
 *  - `render(children, container, key)` Renders a new React portal with the given
 *    children, mounts it into the specified DOM container, and registers it
 *    with the PortalManager using a unique key.
 *  - `remove(key)` Removes a previously rendered portal identified by its key
 *    and deregisters it from the PortalManager.
 *  - `destroy()` Clears all portals managed by this provider and invokes the
 *    destroy method on the PortalManager to clean up any resources.
 *
 */
export const getPortalProviderAPI = (portalManager: PortalManager): PortalProviderAPI => {
	const portalsMap = new Map();
	return {
		render: (children: () => React.ReactNode, container: HTMLElement, key: string) => {
			const portal = createPortal(children(), container, key);
			portalsMap.set(key, portalManager.registerPortal(key, portal));
		},
		remove: (key: string) => {
			portalsMap.get(key)?.();
			portalsMap.delete(key);
		},
		destroy: () => {
			portalsMap.clear();
			portalManager.destroy();
		},
	};
};
