import { type CardAppearance } from '@atlaskit/linking-common';

export interface CardProvider {
	resolve(
		url: string,
		appearance: CardAppearance,
		shouldForceAppearance?: boolean,
		isEmbedFriendlyLocation?: boolean,
	): Promise<any>;
}
export type ORSCheckResponse = {
	isSupported: boolean;
};

type DisplayViews = 'inline' | 'block' | 'embed';

export type ProviderPattern = {
	source: string;
	supportedViews?: DisplayViews[];
	defaultView?: DisplayViews;
};

type Provider = {
	key: string;
	patterns: ProviderPattern[];
};

export type LinkAppearance = CardAppearance | 'url';

export interface UserPreferences {
	defaultAppearance: LinkAppearance;
	appearances: { urlSegment: string; appearance: LinkAppearance }[];
}

export type ORSProvidersResponse = {
	providers: Provider[];
	userPreferences?: UserPreferences;
};

export interface ProvidersData {
	patterns: ProviderPattern[];
	userPreferences?: UserPreferences;
}
