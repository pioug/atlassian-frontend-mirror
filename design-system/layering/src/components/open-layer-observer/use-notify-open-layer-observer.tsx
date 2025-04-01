import { useContext, useEffect } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { OpenLayerObserverContext } from './open-layer-observer-context';
import type { LayerCloseListenerFn } from './types';
import { useOpenLayerObserverNamespace } from './use-open-layer-observer-namespace';

/**
 * Hook that increments/decrements the open layer count when the component mounts/unmounts or becomes visible/hidden.
 * It is used to "notify" the layer observer(s) that a new layer has been added/opened.
 *
 * It takes an object with two arguments:
 * - `isOpen` - used to conditionally update the layer count based on the visibility of the layered component.
 * - `onClose` - callback used to close this layer when the OpenLayerObserver has called `closeLayers`.
 *
 * Example usage:
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false); // State for controlling layer visibility
 * useNotifyLayerObserver({
 *   isOpen,
 *   onClose: () => setIsOpen(false) // Optional callback to close this layer
 * });
 * ```
 */
export function useNotifyOpenLayerObserver({
	isOpen,
	onClose,
}: {
	/**
	 * Whether the layer is open.
	 */
	isOpen: boolean;
	/**
	 * Handler that is used to close this layer.
	 *
	 * It will be called when an OpenLayerObserver has called `closeLayers`.
	 *
	 * You'll want to use this to set the open state accordingly, and then pump it back into the `isOpen` prop.
	 *
	 * Note: the callback will only be called for _open_ layers (based on the `isOpen` prop).
	 */
	onClose: LayerCloseListenerFn;
}): void {
	const context = useContext(OpenLayerObserverContext);
	const namespace = useOpenLayerObserverNamespace();

	useEffect(() => {
		if (fg('platform_dst_open_layer_observer_close_layers')) {
			return;
		}
		/**
		 * Increments the layer count when the component mounts or becomes visible.
		 *
		 * Returns a cleanup function to decrement the layer count when the component unmounts or becomes hidden.
		 */
		if (context === null) {
			return;
		}

		if (!isOpen) {
			return;
		}

		context.increment();

		return function cleanup() {
			context.decrement();
		};
	}, [context, isOpen, namespace]);

	useEffect(() => {
		/**
		 * Registers the `onClose` callback with the OpenLayerObserver.
		 */
		if (!fg('platform_dst_open_layer_observer_close_layers')) {
			return;
		}

		if (context === null) {
			return;
		}

		if (!isOpen) {
			/**
			 * If the layer is not open, we are not registering the `onClose` callback.
			 * This is important to prevent the `onClose` from being called for layers that
			 * are not open.
			 *
			 * Some consumers mistakenly pass "toggle" functions to `onClose` callbacks for
			 * layer components, as Popup, e.g. `onClose={() => setIsOpen(!isOpen)}`.
			 */
			return;
		}

		return context.onClose(onClose, { namespace });
	}, [context, isOpen, namespace, onClose]);
}
