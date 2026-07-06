/** @deprecated Use @atlaskit/smart-card/card/lazy */
export { Card } from './view/Card';

/** @deprecated Use @atlaskit/smart-card/card/types */
export type { CardProps, CardAppearance, CardPlatform } from './view/Card';

/** @deprecated Use @atlaskit/smart-card/embed-resize-message-listener */
export {
	embedHeaderHeight,
	EmbedResizeMessageListener,
} from './view/EmbedCard/EmbedResizeMessageListener';

/** @deprecated Use @atlaskit/smart-card/expanded-frame */
export { ExpandedFrame } from './view/EmbedCard/components/ExpandedFrame';

/** @deprecated Use @atlaskit/smart-card/analytics */
export { SmartLinkEvents } from './utils/analytics/analytics';

/** @deprecated Use @atlaskit/smart-card/hook/use-smart-link-events */
export { useSmartLinkEvents } from './view/SmartLinkEvents/useSmartLinkEvents';

// Classnames for integrators
/** @deprecated Use @atlaskit/smart-card/class-names */
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
	loadingPlaceholderClassName,
} from './classNames';

/** @deprecated Use @atlaskit/smart-card/enums */
export {
	ActionName,
	CardAction,
	ElementName,
	MediaPlacement,
	SmartLinkDirection,
	SmartLinkPosition,
	SmartLinkSize,
	SmartLinkTheme,
} from './constants';

export {
	/** @deprecated Use @atlaskit/flexible/smart-card/metadata-block */
	MetadataBlock,
	/** @deprecated Use @atlaskit/flexible/smart-card/preview-block */
	PreviewBlock,
	/** @deprecated Use @atlaskit/flexible/smart-card/snippet-block */
	SnippetBlock,
	/** @deprecated Use @atlaskit/flexible/smart-card/title-block */
	TitleBlock,
	/** @deprecated Use @atlaskit/flexible/smart-card/footer-block */
	FooterBlock,
	/** @deprecated Use @atlaskit/flexible/smart-card/custom-block */
	CustomBlock,
} from './view/FlexibleCard/components/blocks';

/** @deprecated Use @atlaskit/smart-card/flexible/assigned-to-element */
export { AssignedToElement } from './entry-points/flexible-assigned-to-element';
/** @deprecated Use @atlaskit/smart-card/flexible/assigned-to-group-element */
export { AssignedToGroupElement } from './entry-points/flexible-assigned-to-group-element';
/** @deprecated Use @atlaskit/smart-card/flexible/attachment-count-element */
export { AttachmentCountElement } from './entry-points/flexible-attachment-count-element';
/** @deprecated Use @atlaskit/smart-card/flexible/author-group-element */
export { AuthorGroupElement } from './entry-points/flexible-author-group-element';
/** @deprecated Use @atlaskit/smart-card/flexible/checklist-progress-element */
export { ChecklistProgressElement } from './entry-points/flexible-checklist-progress-element';
/** @deprecated Use @atlaskit/smart-card/flexible/collaborator-group-element */
export { CollaboratorGroupElement } from './entry-points/flexible-collaborator-group-element';
/** @deprecated Use @atlaskit/smart-card/flexible/comment-count-element */
export { CommentCountElement } from './entry-points/flexible-comment-count-element';
/** @deprecated Use @atlaskit/smart-card/flexible/created-on-element */
export { CreatedOnElement } from './entry-points/flexible-created-on-element';
/** @deprecated Use @atlaskit/smart-card/flexible/created-by-element */
export { CreatedByElement } from './entry-points/flexible-created-by-element';
/** @deprecated Use @atlaskit/smart-card/flexible/due-on-element */
export { DueOnElement } from './entry-points/flexible-due-on-element';
/** @deprecated Use @atlaskit/smart-card/flexible/latest-commit-element */
export { LatestCommitElement } from './entry-points/flexible-latest-commit-element';
/** @deprecated Use @atlaskit/smart-card/flexible/link-icon-element */
export { LinkIconElement } from './entry-points/flexible-link-icon-element';
/** @deprecated Use @atlaskit/smart-card/flexible/location-element */
export { LocationElement } from './entry-points/flexible-location-element';
/** @deprecated Use @atlaskit/smart-card/flexible/modified-by-element */
export { ModifiedByElement } from './entry-points/flexible-modified-by-element';
/** @deprecated Use @atlaskit/smart-card/flexible/modified-on-element */
export { ModifiedOnElement } from './entry-points/flexible-modified-on-element';
/** @deprecated Use @atlaskit/smart-card/flexible/owned-by-element */
export { OwnedByElement } from './entry-points/flexible-owned-by-element';
/** @deprecated Use @atlaskit/smart-card/flexible/owned-by-group-element */
export { OwnedByGroupElement } from './entry-points/flexible-owned-by-group-element';
/** @deprecated Use @atlaskit/smart-card/flexible/preview-element */
export { PreviewElement } from './entry-points/flexible-preview-element';
/** @deprecated Use @atlaskit/smart-card/flexible/priority-element */
export { PriorityElement } from './entry-points/flexible-priority-element';
/** @deprecated Use @atlaskit/smart-card/flexible/programming-language-element */
export { ProgrammingLanguageElement } from './entry-points/flexible-programming-language-element';
/** @deprecated Use @atlaskit/smart-card/flexible/provider-element */
export { ProviderElement } from './entry-points/flexible-provider-element';
/** @deprecated Use @atlaskit/smart-card/flexible/react-count-element */
export { ReactCountElement } from './entry-points/flexible-react-count-element';
/** @deprecated Use @atlaskit/smart-card/flexible/read-time-element */
export { ReadTimeElement } from './entry-points/flexible-read-time-element';
/** @deprecated Use @atlaskit/smart-card/flexible/sent-on-element */
export { SentOnElement } from './entry-points/flexible-sent-on-element';
/** @deprecated Use @atlaskit/smart-card/flexible/snippet-element */
export { SnippetElement } from './entry-points/flexible-snippet-element';
/** @deprecated Use @atlaskit/smart-card/flexible/source-branch-element */
export { SourceBranchElement } from './entry-points/flexible-source-branch-element';
/** @deprecated Use @atlaskit/smart-card/flexible/state-element */
export { StateElement } from './entry-points/flexible-state-element';
/** @deprecated Use @atlaskit/smart-card/flexible/story-points-element */
export { StoryPointsElement } from './entry-points/flexible-story-points-element';
/** @deprecated Use @atlaskit/smart-card/flexible/subscriber-count-element */
export { SubscriberCountElement } from './entry-points/flexible-subscriber-count-element';
/** @deprecated Use @atlaskit/smart-card/flexible/sub-tasks-progress-element */
export { SubTasksProgressElement } from './entry-points/flexible-sub-tasks-progress-element';
/** @deprecated Use @atlaskit/smart-card/flexible/target-branch-element */
export { TargetBranchElement } from './entry-points/flexible-target-branch-element';
/** @deprecated Use @atlaskit/smart-card/flexible/title-element */
export { TitleElement } from './entry-points/flexible-title-element';
/** @deprecated Use @atlaskit/smart-card/flexible/view-count-element */
export { ViewCountElement } from './entry-points/flexible-view-count-element';
/** @deprecated Use @atlaskit/smart-card/flexible/vote-count-element */
export { VoteCountElement } from './entry-points/flexible-vote-count-element';
/** @deprecated Use @atlaskit/smart-card/flexible/custom-by-access-type-element */
export { CustomByAccessTypeElement } from './entry-points/flexible-custom-by-access-type-element';
/** @deprecated Use @atlaskit/smart-card/flexible/custom-by-status-element */
export { CustomByStatusElement } from './entry-points/flexible-custom-by-status-element';
/** @deprecated Use @atlaskit/smart-card/flexible/copy-link-action */
export { CopyLinkAction } from './entry-points/flexible-copy-link-action';
/** @deprecated Use @atlaskit/smart-card/flexible/custom-action */
export { CustomAction } from './entry-points/flexible-custom-action';
/** @deprecated Use @atlaskit/smart-card/flexible/download-action */
export { DownloadAction } from './entry-points/flexible-download-action';
/** @deprecated Use @atlaskit/smart-card/flexible/follow-action */
export { FollowAction } from './entry-points/flexible-follow-action';
/** @deprecated Use @atlaskit/smart-card/flexible/preview-action */
export { PreviewAction } from './entry-points/flexible-preview-action';
/** @deprecated Use @atlaskit/smart-card/flexible/unresolved-action */
export { UnresolvedAction } from './entry-points/flexible-unresolved-action';
/** @deprecated Use @atlaskit/smart-card/flexible/custom-unresolved-action */
export { CustomUnresolvedAction } from './entry-points/flexible-custom-unresolved-action';

/** @deprecated Use extractAri, extractNameFromJsonLd, extractUrlFromIconJsonLd from @atlaskit/link-extractors */
export { getObjectAri, getObjectName, getObjectIconUrl } from './state/helpers';

/** @deprecated Use @atlaskit/smart-card/flexible/types */
export type {
	ActionItem,
	ElementItem,
	OnActionMenuOpenChangeOptions,
} from './view/FlexibleCard/components/blocks/types';

/** @deprecated Use @atlaskit/smart-card/analytics/types */
export type {
	AnalyticsAction,
	AnalyticsActionSubject,
	AnalyticsPayload,
	AnalyticsHandler,
} from './utils/types';

/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-661 Internal documentation for deprecation (no external access)} */
export { editorCardProvider, EditorCardProvider } from './linkProvider';
