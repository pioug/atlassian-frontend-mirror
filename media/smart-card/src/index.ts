import { JsonLd } from 'json-ld-types';

export type ResolveResponse = JsonLd.Response;

export { SmartCardProvider as Provider, SmartCardContext } from './state';
export type { ProviderProps, CardType } from './state';
export { EditorCardProvider, editorCardProvider } from './providers/editor';
export type {
  CardAdf,
  InlineCardAdf,
  BlockCardAdf,
  EmbedCardAdf,
} from './providers/editor';
export { default as Client } from './client';
export { APIError } from './client/errors';
export { Card } from './view/Card';
export type { CardProps, CardAppearance, CardPlatform } from './view/Card';
export { default as Context } from './state/context';
export type { CardContext } from './state/context';
