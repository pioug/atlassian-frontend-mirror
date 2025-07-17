export { Card } from './view/Card';
export type { CardProps, CardAppearance, CardPlatform } from './view/Card';
export { CardAction } from './view/Card/types';

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
export {
	AssignedToElement,
	AssignedToGroupElement,
	AttachmentCountElement,
	AuthorGroupElement,
	ChecklistProgressElement,
	CollaboratorGroupElement,
	CommentCountElement,
	CreatedOnElement,
	CreatedByElement,
	DueOnElement,
	LatestCommitElement,
	LinkIconElement,
	LocationElement,
	ModifiedByElement,
	ModifiedOnElement,
	OwnedByElement,
	OwnedByGroupElement,
	PreviewElement,
	PriorityElement,
	ProgrammingLanguageElement,
	ProviderElement,
	ReactCountElement,
	ReadTimeElement,
	SentOnElement,
	SnippetElement,
	SourceBranchElement,
	StateElement,
	StoryPointsElement,
	SubscriberCountElement,
	SubTasksProgressElement,
	TargetBranchElement,
	TitleElement,
	ViewCountElement,
	VoteCountElement,
	CustomByAccessTypeElement,
	CustomByStatusElement,
} from './view/FlexibleCard/external';
export {
	CopyLinkAction,
	CustomAction,
	DownloadAction,
	FollowAction,
	PreviewAction,
	UnresolvedAction,
	CustomUnresolvedAction,
} from './view/FlexibleCard/external';
export { getObjectAri, getObjectName, getObjectIconUrl } from './state/helpers';
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
