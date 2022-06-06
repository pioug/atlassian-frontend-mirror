import { JsonLd } from 'json-ld-types';

export type ResolveResponse = JsonLd.Response;

export {
  SmartCardProvider as Provider,
  SmartCardContext,
  useSmartLinkAnalytics,
} from './state';
export type { ProviderProps, CardType } from './state';
export {
  EditorCardProvider,
  editorCardProvider,
} from '@atlaskit/link-provider';
export type {
  CardAdf,
  InlineCardAdf,
  BlockCardAdf,
  EmbedCardAdf,
} from '@atlaskit/linking-common';
export { APIError } from '@atlaskit/linking-common';
export { CardClient as Client } from '@atlaskit/link-provider';
export { Card } from './view/Card';
export type { CardProps, CardAppearance, CardPlatform } from './view/Card';
export { SmartCardContext as Context } from '@atlaskit/link-provider';
export type { CardContext } from '@atlaskit/link-provider';
export { EmbedResizeMessageListener } from './view/EmbedCard/EmbedResizeMessageListener';
export { embedHeaderHeight } from './view/EmbedCard/components/styled';
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
  blockCardResolvedViewByClassName,
  blockCardForbiddenViewLinkClassName,
  blockCardContentClassName,
  blockCardContentHeaderClassName,
  blockCardContentHeaderNameClassName,
  blockCardNotFoundViewClassName,
  blockCardErroredViewClassName,
} from './classNames';
export { loadingPlaceholderClassName } from './view/CardWithUrl/component-lazy/LazyFallback';
// Flexible UI
export {
  ActionName,
  ElementName,
  SmartLinkDirection,
  SmartLinkPosition,
  SmartLinkSize,
  SmartLinkTheme,
} from './constants';
export {
  MetadataBlock,
  PreviewBlock,
  SnippetBlock,
  TitleBlock,
  FooterBlock,
} from './view/FlexibleCard/components/blocks';
export type {
  ActionItem,
  ElementItem,
} from './view/FlexibleCard/components/blocks/types';
