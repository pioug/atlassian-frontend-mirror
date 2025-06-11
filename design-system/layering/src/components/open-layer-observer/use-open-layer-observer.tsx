import { useContext, useMemo } from 'react';

import invariant from 'tiny-invariant';

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
