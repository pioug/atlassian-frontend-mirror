import { CardAppearance } from '@atlaskit/linking-common';

export interface CardProvider {
  resolve(url: string, appearance: CardAppearance): Promise<any>;
}
export type ORSCheckResponse = {
  isSupported: boolean;
};

type ProviderPattern = {
  source: string;
  flags: string;
};
type Provider = {
  key: string;
  patterns: ProviderPattern[];
};
export type ORSProvidersResponse = {
  providers: Provider[];
};
