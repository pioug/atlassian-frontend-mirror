import { useCallback, useEffect, useRef, useState } from 'react';

import { bind, type UnbindFn } from 'bind-event-listener';

import { fg } from '@atlaskit/platform-feature-flags';

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
 * @private
 * @deprecated Use `useCrossProductUrlWrapper` instead. This implementation is preserved behind
 * the `cross_product_wrapper_react_safe` feature gate and will be removed once the gate is fully
 * rolled out.
 *
 * This React hook is called with the correct bridge, product and sub-product parameters.
 * It returns a function that can be used to generate URLs with cross-product interaction parameters.
 *
 * @param options - Properties object that contains the following parameters:
 *
 * @returns A function that appends interaction session ID and other cross-product interaction parameters to a given URL.
 */
function useCrossProductUrlWrapper_DEPRECATED(
	options: CrossProductUrlOptions,
): (url: string) => string {
	const [interactionSessionId, setInteractionSessionId] = useState<string>('');
	const { bridge, product, subProduct } = options;
	const isEnabled = fg('atlaskit-analytics-cross-product');
	let interactionSessionClient: InteractionSessionTracking | undefined;

	useEffect(() => {
		if (isEnabled) {
			// Fetch interaction session client from window object
			interactionSessionClient = GlobalInteractionSessionTracking.getInstance();

			// Fetch any initial interaction session ID
			if (interactionSessionClient) {
				const currentSessionId = interactionSessionClient.getCurrentInteractionSessionId();
				currentSessionId && setInteractionSessionId(currentSessionId);
			}

			// Add event listener that subscribes to any future interaction session ID updates
			const unbind: UnbindFn = bind(document, {
				type: INTERACTION_SESSION_ID_UPDATED_EVENT,
				listener: () => {
					// Re-attempt fetch Global interactionSessionClient if not present already
					if (!interactionSessionClient) {
						interactionSessionClient = GlobalInteractionSessionTracking.getInstance();
					}

					if (interactionSessionClient) {
						const currentSessionId = interactionSessionClient.getCurrentInteractionSessionId();
						currentSessionId && setInteractionSessionId(currentSessionId);
					}
				},
			});

			return unbind;
		}
		return () => {};
	}, [interactionSessionClient, isEnabled]);

	if (!isEnabled || !interactionSessionId) {
		return (url: string) => url;
	}

	return (url: string) =>
		generateUrlWithParams(url, bridge, interactionSessionId, product, subProduct);
}

/**
 * This React hook is called with the correct bridge, product and sub-product parameters.
 * It returns a function that can be used to generate URLs with cross-product interaction parameters.
 *
 * @param options - Properties object that contains the following parameters:
 *
 * @returns A function that appends interaction session ID and other cross-product interaction parameters to a given URL.
 */
function useCrossProductUrlWrapper(
	options: CrossProductUrlOptions,
): (url: string) => string {
	const { bridge, product, subProduct } = options;
	const isEnabled = fg('atlaskit-analytics-cross-product');

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

/**
 * Default export — this React hook is called with the correct bridge, product and sub-product
 * parameters. It returns a function that can be used to generate URLs with cross-product
 * interaction parameters.
 *
 * Routes to the new React-safe implementation (`useCrossProductUrlWrapper`) when the
 * `cross_product_wrapper_react_safe` feature gate is enabled, otherwise falls back to the
 * previous behaviour preserved in `useCrossProductUrlWrapper_DEPRECATED`.
 *
 * @param options - Properties object that contains the following parameters:
 *
 * @returns A function that appends interaction session ID and other cross-product interaction parameters to a given URL.
 */
export default function useCrossProductUrlWrapperDispatcher(
	options: CrossProductUrlOptions,
): (url: string) => string {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	if (fg('cross_product_wrapper_react_safe')) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		return useCrossProductUrlWrapper(options);
	}
	// eslint-disable-next-line react-hooks/rules-of-hooks
	return useCrossProductUrlWrapper_DEPRECATED(options);
}

export { useCrossProductUrlWrapper, useCrossProductUrlWrapper_DEPRECATED };
