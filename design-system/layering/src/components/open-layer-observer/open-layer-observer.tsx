import React, { useContext, useState } from 'react';

import invariant from 'tiny-invariant';

import { OpenLayerObserverContext } from './open-layer-observer-context';
import type {
	CleanupFn,
	LayerCloseListenerFn,
	LayerCountChangeListenerFn,
	LayerType,
	OpenLayerObserverInternalAPI,
} from './types';

/**
 * Layers that are registered without a namespace are grouped under this fallback namespace.
 */
const noNamespaceSymbol = Symbol('no-namespace');
type NoNamespaceSymbol = typeof noNamespaceSymbol;

type NamespaceToListenerRegistry<T> = Map<string | NoNamespaceSymbol, Set<T>>;

/**
 * A registered layer with its close listener and optional layer type.
 */
type RegisteredLayer = {
	listener: LayerCloseListenerFn;
	type?: LayerType;
};

/**
 * Returns the number of open layers across all namespaces.
 * It calculates the sum of the set sizes in the map, which corresponds to the number of open layers.
 */
function getTotalOpenLayerCount<T>(registry: NamespaceToListenerRegistry<T>): number {
	return Array.from(registry.values()).reduce((acc, listeners) => acc + listeners.size, 0);
}

/**
 * Returns the number of layers in the set that match the type filter.
 */
function getLayerCountWithFilter({
	layers,
	type,
}: {
	layers: Set<RegisteredLayer>;
	type: LayerType;
}): number {
	return Array.from(layers.values()).filter((layer) => layer.type === type).length;
}

/**
 * Returns the layer count change listeners set for the namespace.
 * If there are no listeners registered for the namespace yet, it creates a new set
 * and adds it to the registry, then returns the new set.
 */
function getListeners<T>({
	registry,
	namespace,
}: {
	registry: NamespaceToListenerRegistry<T>;
	namespace: string | NoNamespaceSymbol;
}): Set<T> {
	// 1. If there are existing listeners for this namespace, return the existing set.
	const existingListeners = registry.get(namespace);
	if (existingListeners) {
		return existingListeners;
	}

	// 2. If there are no existing listeners for this namespace, create a new set for this namespace
	// and add it to the registry, then return the new set.
	const newSet = new Set<T>();
	registry.set(namespace, newSet);
	return newSet;
}

/**
 * Returns an instance of the open layer observer API. It internally keeps track of the number of open layers and
 * exposes methods to get the current count, increment/decrement the count, and subscribe to changes.
 */
function createInternalAPI(): OpenLayerObserverInternalAPI {
	/**
	 * The layer count change listeners for each namespace.
	 */
	const namespaceToChangeListenerRegistry: NamespaceToListenerRegistry<LayerCountChangeListenerFn> =
		new Map();

	/**
	 * The registered layers for each namespace.
	 * Each layer registers with an `onClose` callback, and optionally with a layer type (`type`).
	 * **When the layer is open**, its `onClose`
	 * callback is registered in this set along with its type.
	 *
	 * This data structure is also used determine the number of open layers.
	 */
	const namespaceToLayerRegistry: NamespaceToListenerRegistry<RegisteredLayer> = new Map();

	/**
	 * Calls the appropriate layer count change listeners after the number of open layers has changed.
	 */
	function callChangeListeners({
		namespace,
		newCount,
	}: {
		namespace: string | null;
		newCount: number;
	}): void {
		// 1. Call listeners registered to the specific namespace
		if (namespace) {
			const listenersForNamespace = namespaceToChangeListenerRegistry.get(namespace);

			// Using `Array.from` to ensure we iterate over a stable list - e.g. in case a listener adds to the registry while we are
			// iterating over it.
			Array.from(listenersForNamespace ?? []).forEach((listener) => listener({ count: newCount }));
		}

		// 2. Call listeners registered without a specific namespace
		const noNamespaceListeners = namespaceToChangeListenerRegistry.get(noNamespaceSymbol);

		// Return early if no listeners
		if (!noNamespaceListeners) {
			return;
		}

		// For the listeners without a specific namespace, we need to provide the sum of all namespace counts
		// as the callback `count` arg.
		const totalCount = getTotalOpenLayerCount(namespaceToLayerRegistry);

		Array.from(noNamespaceListeners).forEach((listener) => listener({ count: totalCount }));
	}

	/**
	 * Returns the current count of open layers.
	 *
	 * - If a namespace is provided, the count for that namespace is returned.
	 * - If a type is provided, only layers of that type are counted.
	 * - If both are provided, only layers matching both criteria are counted.
	 * - Otherwise, the sum of all namespace counts is returned.
	 */
	function getCount({ namespace, type }: { namespace?: string; type?: LayerType } = {}): number {
		if (namespace) {
			// 1. A namespace was requested, so we count only layers in that namespace
			const layersForNamespace = namespaceToLayerRegistry.get(namespace);
			if (!layersForNamespace) {
				return 0;
			}

			if (type) {
				// Count layers in the namespace that match the type filter
				return getLayerCountWithFilter({ layers: layersForNamespace, type });
			}

			// No type filter - just return the size of the set
			return layersForNamespace.size;
		}

		// 2. A specific namespace was not requested, so we count across all namespaces

		if (type) {
			// Count layers in each namespace that match the type filter
			return Array.from(namespaceToLayerRegistry.values()).reduce(
				(acc, layers) => acc + getLayerCountWithFilter({ layers, type }),
				0,
			);
		}

		// No type filter - count all layers across all namespaces
		return getTotalOpenLayerCount(namespaceToLayerRegistry);
	}

	/**
	 * Adds a listener that will be called when the number of open layers changes.
	 *
	 * @returns a cleanup function to unsubscribe, which should be called when the component unmounts.
	 */
	function onChange(
		listener: LayerCountChangeListenerFn,
		{ namespace: providedNamespace }: { namespace?: string } = {},
	): CleanupFn {
		/**
		 * We are wrapping the passed listener in a function to ensure that each call to `onChange` creates a unique
		 * function reference. This is to handle scenarios where the same function is provided to several different `onChange`
		 * calls - we want to ensure that each call to `unsubscribe` only removes the specific listener registration that was added.
		 */
		function wrapped(...args: Parameters<LayerCountChangeListenerFn>) {
			listener(...args);
		}

		const namespace = providedNamespace ?? noNamespaceSymbol;

		const listenersForNamespace = getListeners({
			namespace,
			registry: namespaceToChangeListenerRegistry,
		});

		listenersForNamespace.add(wrapped);

		return function unsubscribe() {
			listenersForNamespace.delete(wrapped);

			// If there are no listeners for this namespace, remove the registry entry.
			if (listenersForNamespace.size === 0) {
				namespaceToChangeListenerRegistry.delete(namespace);
			}
		};
	}

	/**
	 * Adds a listener to the registry that tells the observer how to close the layer component.
	 * The listener should only be added if the layer is open. This is handled by `useNotifyOpenLayerObserver`.
	 *
	 * All close listeners will be called by the observer when `closeLayers` is called.
	 *
	 * @returns a cleanup function to unsubscribe, which should be called when the component unmounts.
	 */
	function onClose(
		listener: LayerCloseListenerFn,
		{ namespace: providedNamespace, type }: { namespace: string | null; type?: LayerType },
	): CleanupFn {
		const wrapped = { listener, type };

		const namespace = providedNamespace ?? noNamespaceSymbol;

		const listenersForNamespace = getListeners({
			namespace,
			registry: namespaceToLayerRegistry,
		});

		listenersForNamespace.add(wrapped);

		callChangeListeners({
			namespace: providedNamespace,
			newCount: listenersForNamespace.size,
		});

		return function unsubscribe() {
			listenersForNamespace.delete(wrapped);

			callChangeListeners({
				namespace: providedNamespace,
				newCount: listenersForNamespace.size,
			});

			// If there are no listeners for this namespace, remove the registry entry.
			if (listenersForNamespace.size === 0) {
				namespaceToLayerRegistry.delete(namespace);
			}
		};
	}

	/**
	 * Closes all open layers registered across all namespaces.
	 */
	function closeLayers(): void {
		// Using `Array.from` to ensure we iterate over a stable list - e.g. in case a listener adds to the registry while we are
		// iterating over it.
		Array.from(namespaceToLayerRegistry.values()).forEach((listeners) => {
			Array.from(listeners).forEach(({ listener }) => listener());
		});
	}

	const internalAPI: OpenLayerObserverInternalAPI = {
		getCount,
		onChange,
		onClose,
		closeLayers,
	};

	return internalAPI;
}

/**
 * Context provider for observing the number of __open__ layering components (e.g. popups, dropdown menus) under the observer.
 * It uses a stable object to keep track of the number of open layered components - which means the observer will not re-render
 * when the number of layers changes.
 *
 * There should only be one `OpenLayerObserver` in the application. If there are more, the component will throw an error.
 * To track the number of layers in a section of the application, use the `OpenLayerObserverNamespaceProvider` to create a new
 * namespace to group layers.
 *
 * It is intended for use with the `useOpenLayerObserver` hook.
 */
export function OpenLayerObserver({ children }: { children: React.ReactNode }): React.JSX.Element {
	// Using state to ensure a stable reference to a single instance.
	const [internalAPI] = useState(() => createInternalAPI());

	const parentContext = useContext(OpenLayerObserverContext);

	// We don't expect a parent context. If there is one, that means this component is nested within another `OpenLayerObserver`
	// - which we don't support.
	invariant(
		parentContext === null,
		'`OpenLayerObserver` cannot be nested within another `OpenLayerObserver`.',
	);

	return (
		<OpenLayerObserverContext.Provider value={internalAPI}>
			{children}
		</OpenLayerObserverContext.Provider>
	);
}
