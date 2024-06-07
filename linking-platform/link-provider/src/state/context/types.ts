import { type Store } from 'redux';
import {
	type CardAppearance,
	type CardStore,
	type LinkingPlatformFeatureFlags,
	type ProductType,
} from '@atlaskit/linking-common';
import { type LinkPreview, type CardPlatform } from '@atlaskit/link-extractors';
import type CardClient from '../../client';
import { type CardConnections } from '../store/types';

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
		getPreview: (url: string, platform?: CardPlatform) => LinkPreview | undefined;
	};
	renderers?: CardProviderRenderers;
	featureFlags?: LinkingPlatformFeatureFlags;
	isAdminHubAIEnabled?: boolean;
	product?: ProductType;
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
	// Needed to support passing flags from the product without having to bump this interface
	featureFlags?: LinkingPlatformFeatureFlags & { [flag: string]: unknown };
	isAdminHubAIEnabled?: boolean;
	product?: ProductType;
} & CardAuthFlowOpts;
