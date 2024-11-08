import { useEffect, useMemo } from 'react';

import {
	createPortalRendererComponent,
	getPortalProviderAPI,
	type PortalRendererComponent,
	type UsePortalProviderReturnType,
} from './common';
import { PortalManager } from './PortalManager';

import { type PortalProviderAPI } from './index';

/**
 * Initializes PortalManager and creates PortalRendererComponent. Offers an API (portalProviderAPI) for managing portals.
 * @returns {[PortalProviderAPI, PortalRendererComponent]} An array containing two elements:
 *         1. portalProviderAPI: An object providing an API for rendering and removing portals.
 *         2. PortalRenderer: A React component responsible for rendering the portal content.
 */
export function usePortalProvider(): UsePortalProviderReturnType {
	const portalManager = useMemo(() => new PortalManager(), []);
	const PortalRenderer: PortalRendererComponent = useMemo(
		() => createPortalRendererComponent(portalManager),
		[portalManager],
	);

	const portalProviderAPI: PortalProviderAPI = useMemo(
		() => getPortalProviderAPI(portalManager),
		[portalManager],
	);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			portalProviderAPI.destroy();
		};
	}, [portalManager, portalProviderAPI]);

	return [portalProviderAPI, PortalRenderer];
}
