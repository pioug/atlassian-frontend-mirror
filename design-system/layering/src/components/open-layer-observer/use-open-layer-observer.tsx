import { useContext, useMemo } from 'react';

import { OpenLayerObserverContext } from './open-layer-observer-context';
import { type OpenLayerObserverInternalAPI } from './types';

type OpenLayerObserverPublicAPI = Pick<
	OpenLayerObserverInternalAPI,
	'getCount' | 'onChange' | 'closeLayers'
>;

/**
 * A hook for use within an `OpenLayerObserver` component.  It will return `null` if there is no
 * `OpenLayerObserver` in the component tree.
 *
 * It provides access to:
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
 *   return openLayerObserver?.onChange(function onChange({ count }) {
 *     // react to changes in the layer count
 *   });
 * }, [openLayerObserver]);
 * ```
 *
 * @deprecated Use `@atlaskit/top-layer/page-surface/has-open-dialog-or-popover` and
 * `@atlaskit/top-layer/page-surface/request-close-popovers`: `getCount` becomes `hasOpenDialogOrPopover` and
 * `closeLayers` becomes `requestClosePopovers`. For `onChange`, listen for `toggle` and `close`
 * in the capture phase, then call `hasOpenDialogOrPopover`. During the rollout, pass
 * `isEnabled: !fg('platform-dst-top-layer')`.
 */
export function useOpenLayerObserver({
	isEnabled = true,
}: {
	/**
	 * Set to `false` to opt out (for example on a feature-gated top-layer code path). The hook then
	 * returns `null`, as if there were no `OpenLayerObserver` in the tree. Defaults to `true`.
	 */
	isEnabled?: boolean;
} = {}): OpenLayerObserverPublicAPI | null {
	const context = useContext(OpenLayerObserverContext);

	const publicAPI: OpenLayerObserverPublicAPI | null = useMemo(() => {
		if (context === null || !isEnabled) {
			return null;
		}

		return {
			getCount: context.getCount,
			onChange: context.onChange,
			closeLayers: context.closeLayers,
		};
	}, [context, isEnabled]);

	return publicAPI;
}
