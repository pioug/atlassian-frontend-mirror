import { JsonLd } from 'json-ld-types';
import { AnyAction } from 'redux';

export interface InvokePayload<T> {
  key: string;
  context?: string;
  action: T;
}

export type CardAppearance = 'inline' | 'block' | 'embed';
export type CardPlatform = JsonLd.Primitives.Platforms;
export type CardActionType =
  | 'pending'
  | 'resolving'
  | 'resolved'
  | 'errored'
  | 'fallback'
  | 'reloading';

export type CardType =
  | 'pending'
  | 'resolving'
  | 'resolved'
  | 'errored'
  | 'fallback'
  | 'unauthorized'
  | 'forbidden'
  | 'errored'
  | 'not_found';

export interface CardAction<T = JsonLd.Response> extends AnyAction {
  type: CardActionType;
  url: string;
  payload?: T;
}
export interface ServerActionOpts {
  type: string;
  payload: ServerActionPayload;
}
export interface ServerActionPayload {
  id: string;
  context?: JsonLd.Primitives.Object | JsonLd.Primitives.Link;
}

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
