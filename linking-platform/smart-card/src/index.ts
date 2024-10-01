import { type JsonLd } from 'json-ld-types';

/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-15961 Internal documentation for deprecation (no external access)} */
export type ResolveResponse = JsonLd.Response;

/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-15961 Internal documentation for deprecation (no external access)} */
export { SmartCardProvider as Provider, SmartCardContext } from './state';

/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-15961 Internal documentation for deprecation (no external access)} */
export type { ProviderProps, CardType } from './state';

/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-15961 Internal documentation for deprecation (no external access)} */
export type {
	CardAdf,
	InlineCardAdf,
	BlockCardAdf,
	EmbedCardAdf,
	DatasourceAdf,
	DatasourceAdfView,
} from '@atlaskit/linking-common';

/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-15961 Internal documentation for deprecation (no external access)} */
export { APIError } from '@atlaskit/linking-common';

/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-15961 Internal documentation for deprecation (no external access)} */
export { CardClient as Client } from '@atlaskit/link-provider';

export { Card } from './view/Card';
export type { CardProps, CardAppearance, CardPlatform } from './view/Card';
export { CardAction } from './view/Card/types';

/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-15961 Internal documentation for deprecation (no external access)} */
export { SmartCardContext as Context } from '@atlaskit/link-provider';

/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-15961 Internal documentation for deprecation (no external access)} */
export type { CardContext } from '@atlaskit/link-provider';

export { EmbedResizeMessageListener } from './view/EmbedCard/EmbedResizeMessageListener';
export { ExpandedFrame } from './view/EmbedCard/components/ExpandedFrame';
export { embedHeaderHeight } from './view/EmbedCard/components/styled';
export { SmartLinkEvents } from './utils/analytics/analytics';

// This hook should be migrated to /hooks entrypoint
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
	MediaPlacement,
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
	CustomBlock,
} from './view/FlexibleCard/components/blocks';
export type {
	ActionItem,
	ElementItem,
	OnActionMenuOpenChangeOptions,
} from './view/FlexibleCard/components/blocks/types';
export type {
	AnalyticsAction,
	AnalyticsActionSubject,
	AnalyticsPayload,
	AnalyticsHandler,
} from './utils/types';

/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-661 Internal documentation for deprecation (no external access)} */
export { editorCardProvider, EditorCardProvider } from '@atlaskit/link-provider';
