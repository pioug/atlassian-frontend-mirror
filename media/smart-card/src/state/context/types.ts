import { CardStore, CardConnections } from '../store/types';
import CardClient from '../../client';
import { Store } from 'redux';

// TODO: Remove once mobile team move to using authentication
// flow https://product-fabric.atlassian.net/browse/SL-347.
export interface CardAuthFlowOpts {
  authFlow?: 'oauth2' | 'disabled';
}

export interface CardContext {
  store: Store<CardStore>;
  connections: CardConnections;
  config: CardProviderCacheOpts & CardAuthFlowOpts;
}

export interface CardProviderCacheOpts {
  maxAge: number;
  maxLoadingDelay: number;
}

export interface CardProviderStoreOpts {
  initialState: CardStore;
}

export type CardProviderProps = {
  client?: CardClient;
  cacheOptions?: CardProviderCacheOpts;
  storeOptions?: CardProviderStoreOpts;
  children: React.ReactNode;
} & CardAuthFlowOpts;
