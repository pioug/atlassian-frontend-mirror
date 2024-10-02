import React, { useCallback, useContext, useMemo, useRef } from 'react';

import __noop from '@atlaskit/ds-lib/noop';

import { OpenLayerCount } from './open-layer-count-context';
import { UpdateLayerCount } from './update-layer-count-context';

/**
 * Context provider for observing the number of __open__ layering components (e.g. popups, dropdown menus) under the observer.
 * It uses a ref object to keep track of the number of open layered components - which means the observer will not re-render
 * when the number of layers changes.
 *
 * If this `OpenLayerObserver` has a parent `OpenLayerObserver`, it will also increment/decrement its parent observer's layer count.
 * This allows for nested `OpenLayerObserver` components to correctly track the number of open layers.
 */
export const OpenLayerObserver = ({ children }: { children: React.ReactNode }) => {
	const openLayerCountRef = useRef(0);

	const parentContext = useContext(UpdateLayerCount);

	const increment = useCallback(() => {
		openLayerCountRef.current += 1;

		// If the `OpenLayerObserver` is nested, increment the layer count in the parent context as well.
		if (parentContext !== null) {
			parentContext?.increment();
		}
	}, [parentContext]);

	const decrement = useCallback(() => {
		openLayerCountRef.current -= 1;

		// If the `OpenLayerObserver` is nested, decrement the layer count in the parent context as well.
		if (parentContext !== null) {
			parentContext.decrement();
		}
	}, [parentContext]);

	const updaters = useMemo(
		() => ({
			increment,
			decrement,
		}),
		[increment, decrement],
	);

	return (
		<OpenLayerCount.Provider value={openLayerCountRef}>
			<UpdateLayerCount.Provider value={updaters}>{children}</UpdateLayerCount.Provider>
		</OpenLayerCount.Provider>
	);
};
