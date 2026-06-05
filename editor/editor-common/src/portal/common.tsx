import React, { memo } from 'react';

import { createPortal } from 'react-dom';

import { isSSR } from '../core-utils/is-ssr';
import { isSSRStreaming } from '../core-utils/is-ssr-streaming';

import type { PortalManager } from './PortalManager';
import { PortalRenderWrapperInner } from './PortalRenderWrapperInner';
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
	destroy: DestoryFn;
	remove: RemoveFn;
	render: RenderFn;
}

export type PortalRendererComponent = () => JSX.Element;

export type UsePortalProviderReturnType = [PortalProviderAPI, PortalRendererComponent];

const PortalRenderWrapper = memo(PortalRenderWrapperInner);
PortalRenderWrapper.displayName = 'PortalRenderWrapper';

// Tree-shakable renderToStaticMarkup that should work only in SSR
function getRenderToStaticMarkup() {
	if (process.env.REACT_SSR) {
		return require('react-dom/server').renderToStaticMarkup;
	}

	return () => '';
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
		render: (children, container, key, onBeforeReactDomRender, immediate = false) => {
			if (isSSR() && isSSRStreaming()) {
				let html = '';

				try {
					const renderToStaticMarkup = getRenderToStaticMarkup();
					const Children = children;
					html = renderToStaticMarkup(<Children />);
				} catch (error) {
					if (process.env.NODE_ENV !== 'production') {
						// Extract the nodeView type name from container classes, e.g. "mediaSingleView-content-wrap" → "mediaSingle"
						const nodeTypeName =
							Array.from(container.classList)
								.find((c) => c.endsWith('View-content-wrap'))
								?.replace('View-content-wrap', '') ?? 'unknown';
						// eslint-disable-next-line no-console
						console.warn(
							`[EditorSSR] Failed to render "${nodeTypeName}" nodeView to static markup during SSR streaming. ` +
								'The container will be empty. This is likely caused by a React hook ' +
								'(e.g. useSharedPluginStateWithSelector, useIntl) that requires a context ' +
								"not available during renderToStaticMarkup. Ensure the nodeView's render() " +
								'is wrapped with Context Providers, or that the hook has an SSR-safe fallback.',
							error,
						);
					}
				}

				container.innerHTML = html;
			} else {
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
			}
		},
		remove: (key) => {
			if (isSSR() && isSSRStreaming()) {
				return;
			}

			portalsMap.get(key)?.();
			portalsMap.delete(key);
		},
		destroy: () => {
			portalsMap.clear();
			portalManager.destroy();
		},
	};
};
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { createPortalRendererComponent } from './createPortalRendererComponent';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { PortalRenderWrapperInner } from './PortalRenderWrapperInner';
