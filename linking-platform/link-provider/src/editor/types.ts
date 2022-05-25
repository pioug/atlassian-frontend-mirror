import { CardAppearance } from '@atlaskit/linking-common';

export interface CardProvider {
  resolve(url: string, appearance: CardAppearance): Promise<any>;
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
export type ORSProvidersResponse = {
  providers: Provider[];
};
