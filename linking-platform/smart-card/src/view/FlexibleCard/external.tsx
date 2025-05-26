/**
 * This file contains export components and API for FlexibleCard components.
 * For internal usage for access to all available props, please use following
 * - ./components/elements for metadata component
 * - ./components/actions for action component
 *
 * DO NOT add a new prop to these components until we are ready to support it externally.
 */
import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { SmartLinkSize } from '../../constants';

import {
	CopyLinkAction as CopyLinkActionComponent,
	CustomAction as CustomActionComponent,
	DownloadAction as DownloadActionComponent,
	FollowAction as FollowActionComponent,
	PreviewAction as PreviewActionComponent,
	UnresolvedAction as UnresolvedActionComponent,
} from './components/actions';
import {
	AssignedTo,
	AssignedToGroup,
	AttachmentCount,
	AuthorGroup,
	ChecklistProgress,
	CollaboratorGroup,
	CommentCount,
	CreatedBy,
	CreatedOn,
	DueOn,
	LatestCommit,
	LinkIcon,
	Location,
	ModifiedBy,
	ModifiedOn,
	OwnedBy,
	OwnedByGroup,
	Preview,
	Priority,
	ProgrammingLanguage,
	Provider,
	ReactCount,
	ReadTime,
	SentOn,
	Snippet,
	SourceBranch,
	State,
	StoryPoints,
	SubscriberCount,
	SubTasksProgress,
	TargetBranch,
	Title,
	ViewCount,
	VoteCount,
} from './components/elements';
import {
	type BaseBadgeElementProps,
	type BaseDateTimeElementProps,
	type BaseIconElementProps,
	type BaseLinkElementProps,
	type BaseTextElementProps,
} from './components/elements/common';
import { PreviewElementProps } from './components/elements/preview-element';

// ---- EXPORTED METADATA COMPONENT ---- //
export const AssignedToElement = () => <AssignedTo />;
export const AssignedToGroupElement = () => <AssignedToGroup />;
export const AttachmentCountElement = () => <AttachmentCount />;
export const AuthorGroupElement = () => <AuthorGroup />;
export const ChecklistProgressElement = () => <ChecklistProgress />;
export const CollaboratorGroupElement = () => <CollaboratorGroup />;

type CommentCountElementProps = Pick<BaseBadgeElementProps, 'color'>;
export const CommentCountElement = (props?: CommentCountElementProps) => {
	if (fg('platform-linking-additional-flexible-element-props')) {
		return <CommentCount color={props?.color} />;
	}
	return <CommentCount />;
};

export const CreatedOnElement = () => <CreatedOn />;
export const CreatedByElement = () => <CreatedBy />;
export const DueOnElement = () => <DueOn />;
export const LatestCommitElement = () => <LatestCommit />;

type LinkIconElementProps = Pick<BaseIconElementProps, 'render'> & {
	iconTileSize?: 16 | 24;
};
export const LinkIconElement = (props?: LinkIconElementProps) => {
	if (fg('platform-linking-additional-flexible-element-props')) {
		return (
			<LinkIcon
				size={props?.iconTileSize === 24 ? SmartLinkSize.Large : SmartLinkSize.Medium}
				render={props?.render}
			/>
		);
	}
	return <LinkIcon />;
};

export const LocationElement = () => <Location />;
export const ModifiedByElement = () => <ModifiedBy />;

type ModifiedOnElementProps = Pick<BaseDateTimeElementProps, 'hideDatePrefix' | 'color'>;
export const ModifiedOnElement = (props?: ModifiedOnElementProps) => {
	if (fg('platform-linking-additional-flexible-element-props')) {
		return <ModifiedOn hideDatePrefix={props?.hideDatePrefix} color={props?.color} />;
	}
	return <ModifiedOn />;
};

type OwnedByElementProps = Pick<BaseTextElementProps, 'hideFormat' | 'color'>;
export const OwnedByElement = (props?: OwnedByElementProps) => {
	if (fg('platform-linking-additional-flexible-element-props')) {
		return <OwnedBy hideFormat={props?.hideFormat} color={props?.color} />;
	}
	return <OwnedBy />;
};

export const OwnedByGroupElement = () => <OwnedByGroup />;

export const PreviewElement = (
	props: Omit<PreviewElementProps, 'overrideUrl'> & {
		url?: PreviewElementProps['overrideUrl'];
	},
) => {
	if (fg('platform-linking-additional-flexible-element-props')) {
		return <Preview overrideUrl={props?.url} />;
	}
	return <Preview />;
};

export const PriorityElement = () => <Priority />;
export const ProgrammingLanguageElement = () => <ProgrammingLanguage />;
export const ProviderElement = () => <Provider />;

type ReactCountElementProps = Pick<BaseBadgeElementProps, 'color'>;
export const ReactCountElement = (props?: ReactCountElementProps) => {
	if (fg('platform-linking-additional-flexible-element-props')) {
		return <ReactCount color={props?.color} />;
	}
	return <ReactCount />;
};

export const ReadTimeElement = () => <ReadTime />;
export const SentOnElement = () => <SentOn />;

export type SnippetElementProps = Pick<BaseTextElementProps, 'maxLines'> & {
	text?: BaseTextElementProps['content'];
};
export const SnippetElement = (props: SnippetElementProps) => (
	<Snippet maxLines={props.maxLines} content={props.text} />
);

export const SourceBranchElement = () => <SourceBranch />;
export const StateElement = () => <State />;
export const StoryPointsElement = () => <StoryPoints />;
export const SubscriberCountElement = () => <SubscriberCount />;
export const SubTasksProgressElement = () => <SubTasksProgress />;
export const TargetBranchElement = () => <TargetBranch />;

export type TitleElementProps = Pick<
	BaseLinkElementProps,
	'hideTooltip' | 'maxLines' | 'target' | 'text'
>;
export const TitleElement = (props: TitleElementProps) => (
	<Title
		hideTooltip={props?.hideTooltip}
		maxLines={props?.maxLines}
		target={props?.target}
		{...(props?.text ? { text: props?.text } : undefined)}
	/>
);
export const ViewCountElement = () => <ViewCount />;
export const VoteCountElement = () => <VoteCount />;

// ---- EXPORTED ACTION COMPONENTS ---- //
type BaseActionProps = { appearance?: 'default' | 'subtle' };
export const toActionProps = (props?: BaseActionProps) => ({
	appearance: props?.appearance ?? 'default',
	icon: undefined,
});

export type CopyLinkActionProps = BaseActionProps;
export const CopyLinkAction = (props: CopyLinkActionProps) => (
	<CopyLinkActionComponent {...toActionProps(props)} />
);

export type CustomActionProps = BaseActionProps & {
	children: React.ReactNode;
	onClick: () => void;
};
export const CustomAction = (props: CustomActionProps) => (
	<CustomActionComponent
		{...toActionProps(props)}
		content={props?.children}
		onClick={props?.onClick}
	/>
);

export type DownloadActionProps = BaseActionProps;
export const DownloadAction = (props: DownloadActionProps) => (
	<DownloadActionComponent {...toActionProps(props)} />
);

export type FollowActionProps = BaseActionProps;
export const FollowAction = (props: FollowActionProps) => (
	<FollowActionComponent {...toActionProps(props)} />
);

export type PreviewActionProps = BaseActionProps;
export const PreviewAction = (props: PreviewActionProps) => (
	<PreviewActionComponent {...toActionProps(props)} />
);

export const UnresolvedAction = () => <UnresolvedActionComponent />;
