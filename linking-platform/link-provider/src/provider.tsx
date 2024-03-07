import React, { useContext, useMemo } from 'react';
import { createStore, Reducer } from 'redux';
import { JsonLd } from 'json-ld-types';
import { CardStore, getUrl } from '@atlaskit/linking-common';
import {
  extractPreview,
  LinkPreview,
  CardPlatform,
} from '@atlaskit/link-extractors';
import { cardReducer } from './reducers';
import { SmartCardContext } from './state/context';
import { CardProviderProps } from './state/context/types';
import CardClient from './client';

export function SmartCardProvider({
  storeOptions,
  client: customClient,
  authFlow: customAuthFlow,
  children,
  renderers,
  featureFlags,
  isAdminHubAIEnabled,
  product,
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
    const authFlow = customAuthFlow || 'oauth2';

    const getPreview = (
      url: string,
      platform?: CardPlatform,
    ): LinkPreview | undefined => {
      const cardState = getUrl(store, url);
      return cardState.details
        ? extractPreview(
            cardState.details.data as JsonLd.Data.BaseData,
            platform,
          )
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
      featureFlags,
      isAdminHubAIEnabled,
      product,
    };
  }, [
    customClient,
    customAuthFlow,
    isAdminHubAIEnabled,
    product,
    renderers,
    featureFlags,
    store,
  ]);

  return (
    <SmartCardContext.Provider value={parentContext || providerValue}>
      {children}
    </SmartCardContext.Provider>
  );
}
export type { CardProviderProps as ProviderProps };
export default SmartCardProvider;
