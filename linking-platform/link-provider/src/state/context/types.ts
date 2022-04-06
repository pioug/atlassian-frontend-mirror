import { Store } from 'redux';
import {
  CardPlatform,
  CardAppearance,
  LinkPreview,
} from '@atlaskit/linking-common';
import CardClient from '../../client';
import { CardStore, CardConnections } from '../store/types';

// TODO: Remove once mobile team move to using authentication
// flow https://product-fabric.atlassian.net/browse/SL-347.
export interface CardAuthFlowOpts {
  authFlow?: 'oauth2' | 'disabled';
}

export interface CardContext {
  store: Store<CardStore>;
  prefetchStore: Record<string, boolean>;
  connections: CardConnections;
  config: CardProviderCacheOpts & CardAuthFlowOpts;
  extractors: {
    getPreview: (
      url: string,
      platform?: CardPlatform,
    ) => LinkPreview | undefined;
  };
  renderers?: CardProviderRenderers;
}

/** @deprecated Feature removed (EDM-2205) */
export interface CardProviderCacheOpts {
  maxAge?: number;
  maxLoadingDelay?: number;
}

export interface CardProviderStoreOpts {
  initialState: CardStore;
}

export interface CardProviderRenderers {
  adf?: (adf: string) => React.ReactNode;
  emoji?: (emoji?: string, parentComponent?: CardAppearance) => React.ReactNode;
}

export type CardProviderProps = {
  client?: CardClient;
  /** @deprecated Feature removed (EDM-2205) */
  cacheOptions?: CardProviderCacheOpts;
  storeOptions?: CardProviderStoreOpts;
  children: React.ReactNode;
  renderers?: CardProviderRenderers;
} & CardAuthFlowOpts;
