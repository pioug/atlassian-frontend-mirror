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
export { EmbedResizeMessageListener } from './view/EmbedCard/EmbedResizeMessageListener';
export { embedHeaderHeight } from '@atlaskit/media-ui/embeds';
export { SmartLinkEvents } from './utils/analytics/analytics';
export { useSmartLinkEvents } from './view/SmartLinkEvents/useSmartLinkEvents';
// Classnames for integrators
export {
  contentFooterClassName,
  metadataListClassName,
  blockCardResolvingViewClassName,
  blockCardResolvedViewClassName,
  blockCardForbiddenViewClassName,
  blockCardIconImageClassName,
} from '@atlaskit/media-ui/classNames';
export { loadingPlaceholderClassName } from './view/CardWithUrl/component-lazy/LazyFallback';
