import { useEffect, useState } from 'react';

import {
	type LayerType,
	useOpenLayerObserver,
} from '@atlaskit/layering/experimental/open-layer-observer';
import { fg } from '@atlaskit/platform-feature-flags';

import { useIsFhsEnabled } from '../fhs-rollout/use-is-fhs-enabled';

/**
 * Returns whether there are any open layers across the specified namespaces, optionally filtered by type.
 */
export function useHasOpenLayers({
	namespaces,
	type,
}: {
	namespaces: string[];
	type?: LayerType;
}): boolean {
	const isFhsEnabled = useIsFhsEnabled();
	const openLayerObserver = useOpenLayerObserver();
	// Setting the initial state to false, as it is unlikely that there would be any open layers when the app starts.
	const [hasOpenLayers, setHasOpenLayers] = useState(false);

	useEffect(() => {
		if (!openLayerObserver || !isFhsEnabled || !fg('platform-dst-side-nav-layering-fixes')) {
			return;
		}

		function updateState(): void {
			if (!openLayerObserver) {
				return;
			}

			const hasAnyOpenLayers = namespaces.some(
				(namespace) => openLayerObserver.getCount({ namespace, type }) > 0,
			);
			setHasOpenLayers(hasAnyOpenLayers);
		}

		// Initial check
		updateState();

		// Subscribe to each namespace
		const cleanups = namespaces.map((namespace) =>
			openLayerObserver.onChange(updateState, { namespace }),
		);

		return function cleanupHook() {
			cleanups.forEach((cleanup) => cleanup());
		};
	}, [isFhsEnabled, openLayerObserver, namespaces, type]);

	return hasOpenLayers;
}
