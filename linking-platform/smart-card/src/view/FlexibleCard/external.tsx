/**
 * This file contains export components and API for FlexibleCard components.
 * For internal usage for access to all available props, please use following
 * - ./components/elements for metadata component
 * - ./components/actions for action component
 *
 * DO NOT add a new prop to these components until we are ready to support it externally.
 */
import React from 'react';

import type { Prettify } from '@atlaskit/linking-common';

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

// ---- EXPORTED METADATA COMPONENTS ---- //
export const AssignedToElement = () => <AssignedTo />;
export const AssignedToGroupElement = () => <AssignedToGroup />;
export const AttachmentCountElement = () => <AttachmentCount />;
export const AuthorGroupElement = () => <AuthorGroup />;
export const ChecklistProgressElement = () => <ChecklistProgress />;
export const CollaboratorGroupElement = () => <CollaboratorGroup />;

type CommentCountElementProps = Pick<
	React.ComponentProps<typeof CommentCount>,
	'color' | 'onRender'
>;

export const CommentCountElement = (props?: CommentCountElementProps) => {
	return <CommentCount color={props?.color} onRender={props?.onRender} />;
};

export const CreatedOnElement = () => <CreatedOn />;
export const CreatedByElement = () => <CreatedBy />;
export const DueOnElement = () => <DueOn />;
export const LatestCommitElement = () => <LatestCommit />;

type LinkIconElementProps = Prettify<
	Pick<React.ComponentProps<typeof LinkIcon>, 'render'> & {
		iconTileSize?: 16 | 24;
	}
>;

export const LinkIconElement = (props?: LinkIconElementProps) => {
	return (
		<LinkIcon
			size={props?.iconTileSize === 24 ? SmartLinkSize.Large : SmartLinkSize.Medium}
			render={props?.render}
		/>
	);
};

export const LocationElement = () => <Location />;
export const ModifiedByElement = () => <ModifiedBy />;

export type ModifiedOnElementProps = Pick<
	React.ComponentProps<typeof ModifiedOn>,
	'hideDatePrefix' | 'color' | 'onRender' | 'fontSize'
>;

export const ModifiedOnElement = (props?: ModifiedOnElementProps) => {
	return (
		<ModifiedOn
			hideDatePrefix={props?.hideDatePrefix}
			color={props?.color}
			onRender={props?.onRender}
			fontSize={props?.fontSize}
		/>
	);
};

export type OwnedByElementProps = Pick<
	React.ComponentProps<typeof OwnedBy>,
	'hideFormat' | 'color' | 'onRender' | 'textPrefix' | 'fontSize'
>;

export const OwnedByElement = (props?: OwnedByElementProps) => {
	return (
		<OwnedBy
			hideFormat={props?.hideFormat}
			color={props?.color}
			onRender={props?.onRender}
			textPrefix={props?.textPrefix}
			fontSize={props?.fontSize}
		/>
	);
};

type OwnedByGroupElementProps = Pick<React.ComponentProps<typeof OwnedByGroup>, 'onRender'>;
export const OwnedByGroupElement = (props?: OwnedByGroupElementProps) => {
	return <OwnedByGroup onRender={props?.onRender} />;
};

type PreviewElementProps = {
	url?: React.ComponentProps<typeof Preview>['overrideUrl'];
};

export const PreviewElement = (props?: PreviewElementProps) => {
	return <Preview overrideUrl={props?.url} />;
};

export const PriorityElement = () => <Priority />;
export const ProgrammingLanguageElement = () => <ProgrammingLanguage />;
export const ProviderElement = () => <Provider />;

type ReactCountElementProps = Pick<React.ComponentProps<typeof ReactCount>, 'color' | 'onRender'>;
export const ReactCountElement = (props?: ReactCountElementProps) => {
	return <ReactCount color={props?.color} onRender={props?.onRender} />;
};

export const ReadTimeElement = () => <ReadTime />;
export const SentOnElement = () => <SentOn />;

export type SnippetElementProps = Prettify<
	Pick<React.ComponentProps<typeof Snippet>, 'maxLines'> & {
		text?: React.ComponentProps<typeof Snippet>['content'];
	}
>;

export const SnippetElement = (props?: SnippetElementProps) => (
	<Snippet maxLines={props?.maxLines} content={props?.text} />
);

export const SourceBranchElement = () => <SourceBranch />;
export const StateElement = () => <State />;
export const StoryPointsElement = () => <StoryPoints />;
export const SubscriberCountElement = () => <SubscriberCount />;
export const SubTasksProgressElement = () => <SubTasksProgress />;
export const TargetBranchElement = () => <TargetBranch />;

export type TitleElementProps = Pick<
	React.ComponentProps<typeof Title>,
	'hideTooltip' | 'maxLines' | 'target' | 'text' | 'theme' | 'size' | 'testId'
>;

export const TitleElement = (props?: TitleElementProps) => (
	<Title
		hideTooltip={props?.hideTooltip}
		maxLines={props?.maxLines}
		target={props?.target}
		theme={props?.theme}
		size={props?.size}
		testId={props?.testId}
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

export type CustomActionProps = Prettify<
	BaseActionProps & {
		children: React.ReactNode;
		onClick: () => void;
	}
>;
export const CustomAction = (props: CustomActionProps) => (
	<CustomActionComponent
		{...toActionProps(props)}
		content={props.children}
		onClick={props.onClick}
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

export const UnresolvedAction = (props: { hasPadding?: boolean }) => (
	<UnresolvedActionComponent {...props} />
);

export { CustomUnresolvedAction } from './components/actions';
export { CustomByAccessTypeElement, CustomByStatusElement } from './components/elements';
