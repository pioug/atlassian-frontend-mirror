import { useNotifyOpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';

type NotifyOpenLayerObserverProps = {
	isOpen: boolean;
	onClose: () => void;
};

/**
 * Functional component wrapper around `useNotifyOpenLayerObserver`.
 *
 * This is needed as PopupSelect is a class component, which cannot use hooks directly.
 *
 * Even though the internal `Select` component (used internally by `PopupSelect`) also registers with
 * the OpenLayerObserver, we are also registering `PopupSelect` as well, to allow the observer to close
 * the `PopupSelect`'s outer popup.
 *
 * This will technically count as 2 open layers, however the specific count is not important - the main
 * concern is that the observer can know if there are _any_ open layers (0, or 1+), and how to close them.
 */
export function NotifyOpenLayerObserver({ isOpen, onClose }: NotifyOpenLayerObserverProps): null {
	useNotifyOpenLayerObserver({ isOpen, onClose });

	return null;
}
