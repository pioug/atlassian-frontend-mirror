import React, { useContext, useEffect, useMemo } from 'react';
import { createStore, type Reducer } from 'redux';
import merge from 'lodash/merge';
import { type CardStore, getUrl } from '@atlaskit/linking-common';
import { ACTION_RELOADING, ACTION_ERROR, cardAction } from '@atlaskit/linking-common';
import {
	type LinkPreview,
	type CardPlatform,
	extractSmartLinkEmbed,
} from '@atlaskit/link-extractors';
import { cardReducer } from './reducers';
import { SmartCardContext } from './state/context';
import { type CardProviderProps } from './state/context/types';
import FeatureGates from '@atlaskit/feature-gate-js-client';
import CardClient from './client';

/**
 * This event is intended to be dispatched by code OUTSIDE the SmartCardProvider's React tree
 * (e.g. Post Office flags) when an external auth flow has completed and any matching unauthorized SmartLinks on the page should be refreshed.
 *
 * @example for usage from external source: 
 *   window.dispatchEvent(new CustomEvent('atlaskit-smart-card:external-auth-completed', {
 *     detail: { extensionKeys: ['figma-object-provider'] },
 *   }));
 */
export const SMART_CARD_EXTERNAL_AUTH_EVENT = 'atlaskit-smart-card:external-auth-completed';

export function SmartCardProvider({
	storeOptions,
	client: customClient,
	authFlow: customAuthFlow,
	children,
	renderers,
	isAdminHubAIEnabled,
	product,
	shouldControlDataExport,
	isPreviewPanelAvailable,
	openPreviewPanel,
	rovoOptions,
}: CardProviderProps): React.JSX.Element {
	const parentContext = useContext(SmartCardContext);

	const defaultInitialState = useMemo(() => {
		return {};
	}, []);
	const { initialState } = storeOptions || {
		initialState: defaultInitialState,
	};

	const store = useMemo(() => {
		return createStore(cardReducer as Reducer<CardStore>, initialState);
	}, [initialState]);

	const client = useMemo(() => {
		const c = customClient || new CardClient();
		if (product && c.setProduct) {
			c.setProduct(product);
		}
		return c;
	}, [customClient, product]);

	// Listen for external auth completion events and re-resolve any matching unauthorized cards in this store. 
	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}
		if (!FeatureGates.initializeCompleted() || !FeatureGates.getExperimentValue('synchronized-post-office-and-smartcard-auth-exp', 'isEnabled', false)) {
			return;
		}
		const handler = (event: Event) => {
			const detail = (event as CustomEvent).detail as
				| { extensionKeys?: string[] }
				| undefined;
			if (!detail?.extensionKeys?.length) {
				return;
			}
			const targetKeys = new Set(detail.extensionKeys);
			const state = store.getState() as CardStore;
			for (const url of Object.keys(state)) {
				const cardState = state[url];
				if (!cardState || cardState.status !== 'unauthorized') {
					continue;
				}
				const cardExtensionKey = cardState.details?.meta?.key;
				if (!cardExtensionKey || !targetKeys.has(cardExtensionKey)) {
					continue;
				}
				// Fetch fresh data from ORS and dispatch new payload data
				client.fetchData(url, true).then(
					(response) => {
						store.dispatch(
							cardAction(ACTION_RELOADING, { url }, response, undefined, undefined, true),
						);
					},
					(err) => {
						store.dispatch(cardAction(ACTION_ERROR, { url }, undefined, err, undefined, true));
					},
				);
			}
		};
		window.addEventListener(SMART_CARD_EXTERNAL_AUTH_EVENT, handler);
		return () => {
			window.removeEventListener(SMART_CARD_EXTERNAL_AUTH_EVENT, handler);
		};
	}, [store, client]);

	const providerValue = useMemo(() => {
		const authFlow = customAuthFlow || 'oauth2';

		const getPreview = (
			url: string,
			// @deprecated The support for platform will be removed and default to `web`
			_platform?: CardPlatform,
		): LinkPreview | undefined => {
			const cardState = getUrl(store, url);

			return cardState.details ? extractSmartLinkEmbed(cardState.details) : undefined;
		};

		return {
			renderers,
			store,
			prefetchStore: {},
			connections: {
				client,
			},
			config: { authFlow },
			extractors: {
				getPreview,
			},
			isAdminHubAIEnabled,
			product,
			shouldControlDataExport,
			isPreviewPanelAvailable,
			openPreviewPanel,
			rovoOptions,
		};
	}, [
		customAuthFlow,
		client,
		isAdminHubAIEnabled,
		isPreviewPanelAvailable,
		openPreviewPanel,
		product,
		renderers,
		shouldControlDataExport,
		rovoOptions,
		store,
	]);

	const value = useMemo(
		() => merge({}, parentContext || providerValue, { isPreviewPanelAvailable, openPreviewPanel }),
		[parentContext, providerValue, isPreviewPanelAvailable, openPreviewPanel],
	);

	return <SmartCardContext.Provider value={value}>{children}</SmartCardContext.Provider>;
}
export type { CardProviderProps as ProviderProps };
export default SmartCardProvider;
