import React, { useCallback, useContext, useMemo, useState } from 'react';

import { OpenLayerObserverContext } from './open-layer-observer-context';
import { type CleanupFn, type ListenerFn, type OpenLayerObserverInternalAPI } from './types';

/**
 * Returns an instance of the open layer observer API. It internally keeps track of the number of open layers and
 * exposes methods to get the current count, increment/decrement the count, and subscribe to changes.
 */
function createInternalAPI(): OpenLayerObserverInternalAPI {
	let count = 0;
	const registry = new Set<ListenerFn>();

	function onChange(listener: ListenerFn): CleanupFn {
		/**
		 * We are wrapping the passed listener in a function to ensure that each call to `onChange` creates a unique
		 * function reference. This is to handle scenarios where the same function is provided to several different `onChange`
		 * calls - we want to ensure that each call to `unsubscribe` only removes the specific listener registration that was added.
		 */
		function wrapped(...args: Parameters<ListenerFn>) {
			listener(...args);
		}

		registry.add(wrapped);

		return function unsubscribe() {
			registry.delete(wrapped);
		};
	}

	function increment() {
		count += 1;
		// Using `Array.from` to ensure we iterate over a stable list - e.g. in case a listener adds to the registry while we are
		// iterating over it.
		Array.from(registry).forEach((listener) => listener({ count }));
	}

	function decrement() {
		count -= 1;
		// Using `Array.from` to ensure we iterate over a stable list - e.g. in case a listener adds to the registry while we are
		// iterating over it.
		Array.from(registry).forEach((listener) => listener({ count }));
	}

	return {
		getCount() {
			return count;
		},
		onChange,
		increment,
		decrement,
	};
}

/**
 * Context provider for observing the number of __open__ layering components (e.g. popups, dropdown menus) under the observer.
 * It uses a stable object to keep track of the number of open layered components - which means the observer will not re-render
 * when the number of layers changes.
 *
 * If this `OpenLayerObserver` has a parent `OpenLayerObserver`, it will also increment/decrement its parent observer's layer count.
 * This allows for nested `OpenLayerObserver` components to correctly track the number of open layers.
 *
 * It is intended for use with the `useOpenLayerObserver` hook.
 */
export function OpenLayerObserver({ children }: { children: React.ReactNode }) {
	// Using state to ensure a stable reference to a single instance.
	const [internalAPI] = useState(() => createInternalAPI());

	const parentContext = useContext(OpenLayerObserverContext);

	const increment = useCallback(() => {
		internalAPI.increment();

		// If the `OpenLayerObserver` is nested, increment the layer count in the parent context as well.
		if (parentContext !== null) {
			parentContext.increment();
		}
	}, [internalAPI, parentContext]);

	const decrement = useCallback(() => {
		internalAPI.decrement();

		// If the `OpenLayerObserver` is nested, decrement the layer count in the parent context as well.
		if (parentContext !== null) {
			parentContext.decrement();
		}
	}, [internalAPI, parentContext]);

	const contextValue = useMemo(
		() => ({
			getCount: internalAPI.getCount,
			onChange: internalAPI.onChange,
			increment,
			decrement,
		}),
		[decrement, increment, internalAPI.getCount, internalAPI.onChange],
	);

	return (
		<OpenLayerObserverContext.Provider value={contextValue}>
			{children}
		</OpenLayerObserverContext.Provider>
	);
}
