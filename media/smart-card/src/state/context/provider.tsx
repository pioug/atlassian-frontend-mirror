import React from 'react';
import { useContext, useMemo } from 'react';
import { createStore, Reducer } from 'redux';
import { cardReducer } from '../reducers';
import { SmartCardContext } from '.';
import { CardProviderProps } from './types';
import { CardStore } from '../types';
import CardClient from '../../client';
import { extractPreview, LinkPreview } from '../../extractors/common/preview';
import { JsonLd } from 'json-ld-types';
import { getUrl } from '../helpers';
import { CardPlatform } from '../../view/Card';

export function SmartCardProvider({
  storeOptions,
  client: customClient,
  authFlow: customAuthFlow,
  children,
  renderers,
}: CardProviderProps) {
  const parentContext = useContext(SmartCardContext);
  const providerValue = useMemo(() => {
    const { initialState } = storeOptions || { initialState: {} };
    const client = customClient || new CardClient();
    const store = createStore(cardReducer as Reducer<CardStore>, initialState);
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
    };
  }, [customClient, customAuthFlow, storeOptions, renderers]);

  return (
    <SmartCardContext.Provider value={parentContext || providerValue}>
      {children}
    </SmartCardContext.Provider>
  );
}
export type { CardProviderProps as ProviderProps };
export default SmartCardProvider;
