import { useCallback, useEffect, useRef, useState } from 'react';

import { bind, type UnbindFn } from 'bind-event-listener';

import { UNSAFE_expValNoExposure } from '@atlaskit/platform-feature-experiments/unsafe-exp-val-no-exposure';

import { generateUrlWithParams } from './generateUrlWithParams';
import GlobalInteractionSessionTracking, {
	type InteractionSessionTracking,
} from './globalInteractionSessionTracking';

// WARNING: This value is shared between @atlaskit/analytics-cross-product and
// @atlassiansox/analytics-cross-product-interaction-client. Take care when updating.
export const INTERACTION_SESSION_ID_UPDATED_EVENT = 'interactionSessionIdUpdated';

/**
 * @param bridge - The name of your navigation component e.g. atlassianSwitcher
 * @param product - The product you are hosted on e.g. jira
 * @param subProduct - If specified, will be appended to the end of product as: product-subProduct
 */
export type CrossProductUrlOptions = {
	bridge: string;
	product: string;
	subProduct?: string;
};

/**
 * Kill switch config, defaults to enabled so we fail open if the config can't be resolved.
 * https://switcheroo.atlassian.com/ui/configurations/d3b9839b-0a19-4f81-928e-44fc4fac4c55/key/atlaskit-analytics-cross-product-kill-switch
 */
const KILL_SWITCH_CONFIG = 'atlaskit-analytics-cross-product-kill-switch';

/**
 * This React hook is called with the correct bridge, product and sub-product parameters.
 * It returns a function that can be used to generate URLs with cross-product interaction parameters.
 *
 * @param options - Properties object that contains the following parameters:
 *
 * @returns A function that appends interaction session ID and other cross-product interaction parameters to a given URL.
 */
function useCrossProductUrlWrapper(options: CrossProductUrlOptions): (url: string) => string {
	const { bridge, product, subProduct } = options;
	// This is a kill switch rather than an experiment, so no exposure is fired.
	const isEnabled = !UNSAFE_expValNoExposure<boolean>(KILL_SWITCH_CONFIG, 'value', false);

	// `useRef(initialValue)` evaluates `initialValue` on every render but only uses the result on
	// the first render. Populate the ref imperatively the first time we need it so we don't call
	// `getInstance()` on every render (per Billy Chen's review suggestion).
	const interactionSessionClientRef = useRef<InteractionSessionTracking | undefined>(undefined);
	if (isEnabled && !interactionSessionClientRef.current) {
		interactionSessionClientRef.current = GlobalInteractionSessionTracking.getInstance();
	}

	const [interactionSessionId, setInteractionSessionId] = useState<string>(
		() => interactionSessionClientRef.current?.getCurrentInteractionSessionId() ?? '',
	);

	useEffect(() => {
		if (!isEnabled) {
			return () => {};
		}

		// Add event listener that subscribes to any future interaction session ID updates
		const unbind: UnbindFn = bind(document, {
			type: INTERACTION_SESSION_ID_UPDATED_EVENT,
			listener: () => {
				// Re-attempt fetch Global interactionSessionClient if not present already
				if (!interactionSessionClientRef.current) {
					interactionSessionClientRef.current = GlobalInteractionSessionTracking.getInstance();
				}

				if (interactionSessionClientRef.current) {
					const currentSessionId =
						interactionSessionClientRef.current.getCurrentInteractionSessionId();
					currentSessionId && setInteractionSessionId(currentSessionId);
				}
			},
		});

		return unbind;
	}, [isEnabled]);

	return useCallback(
		(url: string) => {
			if (!isEnabled || !interactionSessionId) {
				return url;
			}
			return generateUrlWithParams(url, bridge, interactionSessionId, product, subProduct);
		},
		[isEnabled, bridge, interactionSessionId, product, subProduct],
	);
}

export default useCrossProductUrlWrapper;
export { useCrossProductUrlWrapper };
