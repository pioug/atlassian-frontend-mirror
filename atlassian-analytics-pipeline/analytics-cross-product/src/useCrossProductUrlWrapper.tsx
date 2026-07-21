import { useCallback, useEffect, useRef, useState } from 'react';

import { bind, type UnbindFn } from 'bind-event-listener';

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
 * This React hook is called with the correct bridge, product and sub-product parameters.
 * It returns a function that can be used to generate URLs with cross-product interaction parameters.
 *
 * @param options - Properties object that contains the following parameters:
 *
 * @returns A function that appends interaction session ID and other cross-product interaction parameters to a given URL.
 */
function useCrossProductUrlWrapper(options: CrossProductUrlOptions): (url: string) => string {
	const { bridge, product, subProduct } = options;

	// `useRef(initialValue)` evaluates `initialValue` on every render but only uses the result on
	// the first render. Populate the ref imperatively the first time we need it so we don't call
	// `getInstance()` on every render (per Billy Chen's review suggestion).
	const interactionSessionClientRef = useRef<InteractionSessionTracking | undefined>(undefined);
	if (!interactionSessionClientRef.current) {
		interactionSessionClientRef.current = GlobalInteractionSessionTracking.getInstance();
	}

	const [interactionSessionId, setInteractionSessionId] = useState<string>(
		() => interactionSessionClientRef.current?.getCurrentInteractionSessionId() ?? '',
	);

	useEffect(() => {
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
	}, []);

	return useCallback(
		(url: string) => {
			if (!interactionSessionId) {
				return url;
			}
			return generateUrlWithParams(url, bridge, interactionSessionId, product, subProduct);
		},
		[bridge, interactionSessionId, product, subProduct],
	);
}

export default useCrossProductUrlWrapper;
export { useCrossProductUrlWrapper };
