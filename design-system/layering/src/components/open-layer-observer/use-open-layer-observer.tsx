import { useContext, useMemo } from 'react';

import invariant from 'tiny-invariant';

import { fg } from '@atlaskit/platform-feature-flags';

import { OpenLayerObserverContext } from './open-layer-observer-context';
import { type OpenLayerObserverInternalAPI } from './types';

type OpenLayerObserverPublicAPI = Pick<
	OpenLayerObserverInternalAPI,
	'getCount' | 'onChange' | 'closeLayers'
>;

/**
 * A hook for use within an `OpenLayerObserver` component. It provides access to:
 *
 * - `getCount`: a function that returns the current count of open layers under the observer.
 * - `onChange`: a function that allows you to subscribe to changes in the layer count. It returns a
 * cleanup function to unsubscribe, which you should call when the component unmounts.
 * - `closeLayers`: a function that closes all open layers.
 *
 * Example usage:
 * ```tsx
 * const openLayerObserver = useOpenLayerObserver();
 * useEffect(() => {
 *   return openLayerObserver.onChange(function onChange({ count }) {
 *     // react to changes in the layer count
 *   });
 * }, [openLayerObserver]);
 * ```
 */
export function useOpenLayerObserver(): OpenLayerObserverPublicAPI {
	const context = useContext(OpenLayerObserverContext);

	invariant(context, 'useOpenLayerObserver must be used within an OpenLayerObserver');

	const publicAPI: OpenLayerObserverPublicAPI = useMemo(
		() => ({
			getCount: context.getCount,
			onChange: context.onChange,
			closeLayers: context.closeLayers,
		}),
		[context.getCount, context.onChange, context.closeLayers],
	);

	return publicAPI;
}

/**
 * **Note: this hook will be cleaned up with fg('platform_dst_open_layer_observer_close_layers'), and replaced by `useOpenLayerObserver`.**
 *
 * Variant of `useOpenLayerObserver()` that will _not_ throw an error if the hook is used outside of an `OpenLayerObserver`.
 * Instead, it will return `null`.
 *
 * This is to enable progressive rollout of fg('platform_dst_open_layer_observer_close_layers'), which moves the `OpenLayerObserver`
 * provider from the nav4 `SideNav` slot to the `Root`.
 *
 * A separate hook is required as we cannot conditionally call React hooks based on a feature flag value, and it is unsafe to call
 * `useOpenLayerObserver()` in components that are not rendered inside the SideNav - such as `PanelSplitter` components rendered
 * inside the `Aside` slot.
 */
export function useOpenLayerObserverBehindFG(): OpenLayerObserverPublicAPI | null {
	const context = useContext(OpenLayerObserverContext);

	const publicAPI: OpenLayerObserverPublicAPI | null = useMemo(() => {
		if (!fg('platform_dst_open_layer_observer_close_layers')) {
			return null;
		}

		if (!context) {
			return null;
		}

		return {
			getCount: context.getCount,
			onChange: context.onChange,
			closeLayers: context.closeLayers,
		};
	}, [context]);

	return publicAPI;
}
