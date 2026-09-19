import React, { useContext, useEffect, useMemo } from 'react';

import merge from 'lodash/merge';
import { createStore, type Reducer } from 'redux';

import { extractSmartLinkEmbed } from '@atlaskit/link-extractors/extract-smart-link-embed';
import type { LinkPreview, CardPlatform } from '@atlaskit/link-extractors/types';
import { ACTION_RELOADING, ACTION_ERROR, cardAction } from '@atlaskit/linking-common/actions';
import { APIError } from '@atlaskit/linking-common/api-error';
import { type CardStore, getUrl } from '@atlaskit/linking-common/store';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import CardClient from './client';
import { cardReducer } from './reducers';
import { SMART_CARD_EXTERNAL_AUTH_EVENT } from './smart-card-external-auth-event';
import { SmartCardContext } from './state/context';
import { type CardProviderProps } from './state/context/types';

/**
 * Whether the error represents a URL the resolver does not support. This is an expected,
 * benign outcome (not a real failure) and must not be surfaced as an errored card.
 */
const isUnsupportedError = (error: APIError): boolean =>
	error.type === 'UnsupportedError' ||
	error.type === 'ResolveUnsupportedError' ||
	error.type === 'SearchUnsupportedError';

export function SmartCardProvider({
	linkNavigation,
	storeOptions,
	bridgeProduct,
	client: customClient,
	authFlow: customAuthFlow,
	children,
	renderers,
	isAdminHubAIEnabled,
	product,
	shouldControlDataExport,
	isPreviewPanelAvailable,
	isPreviewRestricted,
	openPreviewPanel,
	rovoOptions,
	xpcProduct,
	xpcSubProduct,
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
		const handler = (event: Event) => {
			const detail = (event as CustomEvent).detail as { extensionKeys?: string[] } | undefined;
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
						// "Unsupported URL" is a benign, expected resolver outcome (ORS does not
						// support this link), surfaced as a fatal APIError. Turning it into an
						// errored card state causes non-flexible SmartLinks to re-throw it to their
						// error boundary and report it to Sentry. Leave the card in its prior
						// unauthorized state instead.
						if (
							err instanceof APIError &&
							isUnsupportedError(err) &&
							fg('platform_lp_navx_5358_dont_throw_error')
						) {
							return;
						}
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
			bridgeProduct,
			isAdminHubAIEnabled,
			product,
			shouldControlDataExport,
			isPreviewPanelAvailable,
			...(fg('preview_panel_unit_check') ? { isPreviewRestricted } : undefined),
			openPreviewPanel,
			rovoOptions,
			xpcProduct,
			xpcSubProduct,
		};
	}, [
		customAuthFlow,
		bridgeProduct,
		client,
		isAdminHubAIEnabled,
		isPreviewPanelAvailable,
		isPreviewRestricted,
		openPreviewPanel,
		product,
		renderers,
		shouldControlDataExport,
		rovoOptions,
		store,
		xpcProduct,
		xpcSubProduct,
	]);

	const value = useMemo(
		() =>
			merge({}, parentContext || providerValue, {
				...(fg('confluence_ep_shim_macro_links_v2') ? { linkNavigation } : undefined),
				isPreviewPanelAvailable,
				...(fg('preview_panel_unit_check') ? { isPreviewRestricted } : undefined),
				openPreviewPanel,
			}),
		[
			parentContext,
			providerValue,
			isPreviewPanelAvailable,
			isPreviewRestricted,
			openPreviewPanel,
			linkNavigation,
		],
	);

	return <SmartCardContext.Provider value={value}>{children}</SmartCardContext.Provider>;
}
