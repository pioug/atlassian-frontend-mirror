import { useContext, useEffect } from 'react';

import { OpenLayerObserverContext } from './open-layer-observer-context';

/**
 * Hook that increments/decrements the open layer count when the component mounts/unmounts or becomes visible/hidden.
 * It is used to "notify" the layer observer(s) that a new layer has been added/opened.
 *
 * It takes an optional parameter with an `isOpen` option, which can be used to conditionally update the layer count
 * based on the visibility of the layered component.
 *
 * Example usage:
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false); // State for controlling layer visibility
 * useNotifyLayerObserver({ isOpen });
 * ```
 */
export function useNotifyOpenLayerObserver({ isOpen = true }: { isOpen?: boolean } = {}): void {
	const context = useContext(OpenLayerObserverContext);

	useEffect(() => {
		if (context === null) {
			return;
		}

		if (!isOpen) {
			return;
		}

		context.increment();

		return () => {
			context.decrement();
		};
	}, [context, isOpen]);
}
