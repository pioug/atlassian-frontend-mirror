import { JsonLd } from 'json-ld-types';

export type ResolveResponse = JsonLd.Response;

export {
  SmartCardProvider as Provider,
  ProviderProps,
  CardType,
  SmartCardContext,
} from './state';
export { EditorCardProvider, editorCardProvider } from './providers/editor';
export { default as Client } from './client';
export { APIError } from './client/errors';
export { Card, CardProps, CardAppearance, CardPlatform } from './view/Card';
export { default as Context, CardContext } from './state/context';
