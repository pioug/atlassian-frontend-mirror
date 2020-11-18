import { CardAppearance } from '../../view/Card';
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

export interface InlineCardAdf {
  type: 'inlineCard';
  attrs: {
    url: string;
  };
}
export interface BlockCardAdf {
  type: 'blockCard';
  attrs: {
    url: string;
  };
}
export interface EmbedCardAdf {
  type: 'embedCard';
  attrs: {
    url: string;
    layout: 'wide';
  };
}
export type CardAdf = InlineCardAdf | BlockCardAdf | EmbedCardAdf;
