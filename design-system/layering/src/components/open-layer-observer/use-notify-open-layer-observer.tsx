import { useContext, useEffect } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { UpdateLayerCount } from './update-layer-count-context';

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
export const useNotifyOpenLayerObserver = ({ isOpen = true }: { isOpen?: boolean } = {}) => {
	const context = useContext(UpdateLayerCount);

	useEffect(() => {
		if (!fg('platform_design_system_team_layering_observer')) {
			return;
		}

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
};
