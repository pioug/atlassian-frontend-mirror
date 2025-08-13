import React, { memo, useLayoutEffect, useMemo, useState } from 'react';

import { createPortal } from 'react-dom';

import { PortalBucket } from './PortalBucket';
import { type PortalManager } from './PortalManager';

type RenderFn = (
	children: () => React.ReactChild | JSX.Element | null,
	container: HTMLElement,
	key: string,
	onBeforeReactDomRender?: () => void,
	immediate?: boolean,
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
			// Ignored via go/ees005
			// eslint-disable-next-line react/no-array-index-key
			() => buckets.map((_, i) => <PortalBucket key={i} id={i} portalManager={portalManager} />),
			[buckets],
		);
		return <>{portalsElements}</>;
	};
}

/**
 * Wraps the children of a portal to allow for React rendering
 * lifecycle hook to be exposed, primarily for node virtualization.
 */
export const PortalRenderWrapperInner = ({
	getChildren,
	onBeforeRender,
}: {
	getChildren: () => React.ReactNode;
	onBeforeRender: () => void;
}) => {
	useLayoutEffect(() => {
		if (onBeforeRender) {
			onBeforeRender();
		}
	}, [onBeforeRender]);
	return <>{getChildren()}</>;
};

const PortalRenderWrapper = memo(PortalRenderWrapperInner);
PortalRenderWrapper.displayName = 'PortalRenderWrapper';

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
		render: (children, container, key, onBeforeReactDomRender, immediate = false) => {
			if (typeof onBeforeReactDomRender === 'function') {
				const portal = createPortal(
					<PortalRenderWrapper getChildren={children} onBeforeRender={onBeforeReactDomRender} />,
					container,
					key,
				);
				portalsMap.set(key, portalManager.registerPortal(key, portal, immediate));
			} else {
				const portal = createPortal(children(), container, key);
				portalsMap.set(key, portalManager.registerPortal(key, portal, immediate));
			}
		},
		remove: (key) => {
			portalsMap.get(key)?.();
			portalsMap.delete(key);
		},
		destroy: () => {
			portalsMap.clear();
			portalManager.destroy();
		},
	};
};
