import { useContext } from 'react';

import { OpenLayerObserverNamespaceContext } from './open-layer-observer-namespace-context';

/**
 * A hook for use within an `OpenLayerObserver` component. It provides access to the namespace of the
 * `OpenLayerObserver`.
 *
 * This is useful for determining the number of layers open within a section of the page, e.g. the SideNav.
 */
export function useOpenLayerObserverNamespace(): string | null {
	const namespace = useContext(OpenLayerObserverNamespaceContext);

	return namespace;
}
