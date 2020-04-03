import React from 'react';
import { useContext, useMemo } from 'react';
import { createStore, Reducer } from 'redux';
import { cardReducer } from '../reducers';
import { SmartCardContext } from '.';
import { CardProviderProps } from './types';
import { MAX_RELOAD_DELAY, MAX_LOADING_DELAY } from '../actions/constants';
import { CardStore } from '../types';
import CardClient from '../../client';

export function SmartCardProvider({
  storeOptions,
  client: customClient,
  cacheOptions: customCacheOptions,
  authFlow: customAuthFlow,
  children,
}: CardProviderProps) {
  const parentContext = useContext(SmartCardContext);
  const providerValue = useMemo(() => {
    const { initialState } = storeOptions || { initialState: {} };
    const client = customClient || new CardClient();
    const store = createStore(cardReducer as Reducer<CardStore>, initialState);
    const authFlow = customAuthFlow || 'oauth2';
    const cacheOptions = customCacheOptions || {
      maxAge: MAX_RELOAD_DELAY,
      maxLoadingDelay: MAX_LOADING_DELAY,
    };

    return {
      store,
      connections: {
        client,
      },
      config: { ...cacheOptions, authFlow },
    };
  }, [customClient, customCacheOptions, customAuthFlow, storeOptions]);

  return (
    <SmartCardContext.Provider value={parentContext || providerValue}>
      {children}
    </SmartCardContext.Provider>
  );
}
export { CardProviderProps as ProviderProps };
export default SmartCardProvider;
