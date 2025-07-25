import React, { useContext, useMemo } from 'react';
import { createStore, type Reducer } from 'redux';
import { type JsonLd } from '@atlaskit/json-ld-types';
import merge from 'lodash/merge';
import { type CardStore, getUrl } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';
import {
	extractPreview,
	type LinkPreview,
	type CardPlatform,
	extractSmartLinkEmbed,
} from '@atlaskit/link-extractors';
import { cardReducer } from './reducers';
import { SmartCardContext } from './state/context';
import { type CardProviderProps } from './state/context/types';
import CardClient from './client';

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
}: CardProviderProps) {
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

	const providerValue = useMemo(() => {
		const client = customClient || new CardClient();

		// If product is passed into provider, set it on the client if setProduct is supported
		if (product && client.setProduct) {
			client.setProduct(product);
		}

		const authFlow = customAuthFlow || 'oauth2';

		const getPreview = (
			url: string,
			// @deprecated The support for platform will be removed and default to `web`
			platform?: CardPlatform,
		): LinkPreview | undefined => {
			const cardState = getUrl(store, url);

			return cardState.details
				? fg('smart_links_noun_support')
					? extractSmartLinkEmbed(cardState.details)
					: extractPreview(cardState.details.data as JsonLd.Data.BaseData, platform)
				: undefined;
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
		};
	}, [
		customAuthFlow,
		customClient,
		isAdminHubAIEnabled,
		isPreviewPanelAvailable,
		openPreviewPanel,
		product,
		renderers,
		shouldControlDataExport,
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
