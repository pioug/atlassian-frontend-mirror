import { useNotifyOpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';

type NotifyOpenLayerObserverProps = {
	isOpen: boolean;
	onClose: () => void;
};

/**
 * Functional component wrapper around `useNotifyOpenLayerObserver`.
 *
 * This is needed as Select is a class component, which cannot use hooks directly.
 */
export function NotifyOpenLayerObserver({ isOpen, onClose }: NotifyOpenLayerObserverProps): null {
	// @ts-ignore - hot-116676
	useNotifyOpenLayerObserver({ isOpen, onClose });

	return null;
}
