import { useContext, useEffect } from 'react';

import { OpenLayerObserverContext } from './open-layer-observer-context';
import type { LayerCloseListenerFn, LayerType } from './types';
import { useOpenLayerObserverNamespace } from './use-open-layer-observer-namespace';

type NotifyOpenLayerObserverProps = {
	/**
	 * Whether the layer is open.
	 */
	isOpen: boolean;

	/**
	 * The type of layer that this is.
	 */
	type?: LayerType;

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
};
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
	type,
	onClose,
}: NotifyOpenLayerObserverProps): void {
	const context = useContext(OpenLayerObserverContext);
	const namespace = useOpenLayerObserverNamespace();

	useEffect(() => {
		/**
		 * Registers the `onClose` callback with the OpenLayerObserver.
		 */

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

		return context.onClose(onClose, { namespace, type });
	}, [context, isOpen, namespace, onClose, type]);
}
