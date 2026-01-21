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

// ---- EXPORTED METADATA COMPONENTS ---- //
export const AssignedToElement = (): React.JSX.Element => <AssignedTo />;
export const AssignedToGroupElement = (): React.JSX.Element => <AssignedToGroup />;
export const AttachmentCountElement = (): React.JSX.Element => <AttachmentCount />;
export const AuthorGroupElement = (): React.JSX.Element => <AuthorGroup />;
export const ChecklistProgressElement = (): React.JSX.Element => <ChecklistProgress />;
export const CollaboratorGroupElement = (): React.JSX.Element => <CollaboratorGroup />;

type CommentCountElementProps = Pick<
	React.ComponentProps<typeof CommentCount>,
	'color' | 'onRender'
>;

export const CommentCountElement = (props?: CommentCountElementProps): React.JSX.Element => {
	return <CommentCount color={props?.color} onRender={props?.onRender} />;
};

export const CreatedOnElement = (): React.JSX.Element => <CreatedOn />;
export const CreatedByElement = (): React.JSX.Element => <CreatedBy />;
export const DueOnElement = (): React.JSX.Element => <DueOn />;
export const LatestCommitElement = (): React.JSX.Element => <LatestCommit />;

type LinkIconElementProps = Prettify<
	Pick<React.ComponentProps<typeof LinkIcon>, 'render'> & {
		iconTileSize?: 16 | 24;
	}
>;

export const LinkIconElement = (props?: LinkIconElementProps): React.JSX.Element => {
	return (
		<LinkIcon
			size={props?.iconTileSize === 24 ? SmartLinkSize.Large : SmartLinkSize.Medium}
			render={props?.render}
		/>
	);
};

export const LocationElement = (): React.JSX.Element => <Location />;
export const ModifiedByElement = (): React.JSX.Element => <ModifiedBy />;

export type ModifiedOnElementProps = Pick<
	React.ComponentProps<typeof ModifiedOn>,
	'hideDatePrefix' | 'color' | 'onRender' | 'fontSize'
>;

export const ModifiedOnElement = (props?: ModifiedOnElementProps): React.JSX.Element => {
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

export const OwnedByElement = (props?: OwnedByElementProps): React.JSX.Element => {
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
export const OwnedByGroupElement = (props?: OwnedByGroupElementProps): React.JSX.Element => {
	return <OwnedByGroup onRender={props?.onRender} />;
};

type PreviewElementProps = {
	url?: React.ComponentProps<typeof Preview>['overrideUrl'];
};

export const PreviewElement = (props?: PreviewElementProps): React.JSX.Element => {
	return <Preview overrideUrl={props?.url} />;
};

export const PriorityElement = (): React.JSX.Element => <Priority />;
export const ProgrammingLanguageElement = (): React.JSX.Element => <ProgrammingLanguage />;
export const ProviderElement = (): React.JSX.Element => <Provider />;

type ReactCountElementProps = Pick<React.ComponentProps<typeof ReactCount>, 'color' | 'onRender'>;
export const ReactCountElement = (props?: ReactCountElementProps): React.JSX.Element => {
	return <ReactCount color={props?.color} onRender={props?.onRender} />;
};

export const ReadTimeElement = (): React.JSX.Element => <ReadTime />;
export const SentOnElement = (): React.JSX.Element => <SentOn />;

export type SnippetElementProps = Prettify<
	Pick<React.ComponentProps<typeof Snippet>, 'maxLines'> & {
		text?: React.ComponentProps<typeof Snippet>['content'];
	}
>;

export const SnippetElement = (props?: SnippetElementProps): React.JSX.Element => (
	<Snippet maxLines={props?.maxLines} content={props?.text} />
);

export const SourceBranchElement = (): React.JSX.Element => <SourceBranch />;

export type StateElementProps = Prettify<Pick<React.ComponentProps<typeof State>, 'maxWidth'>>;
export const StateElement = (props?: StateElementProps): React.JSX.Element => (
	<State
		{...(fg('platform_navx_sl_lozenge_max_width') ? { maxWidth: props?.maxWidth } : undefined)}
	/>
);
export const StoryPointsElement = (): React.JSX.Element => <StoryPoints />;
export const SubscriberCountElement = (): React.JSX.Element => <SubscriberCount />;
export const SubTasksProgressElement = (): React.JSX.Element => <SubTasksProgress />;
export const TargetBranchElement = (): React.JSX.Element => <TargetBranch />;

export type TitleElementProps = Pick<
	React.ComponentProps<typeof Title>,
	'hideTooltip' | 'maxLines' | 'target' | 'text' | 'theme' | 'size' | 'testId'
>;

export const TitleElement = (props?: TitleElementProps): React.JSX.Element => (
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

export const ViewCountElement = (): React.JSX.Element => <ViewCount />;
export const VoteCountElement = (): React.JSX.Element => <VoteCount />;

// ---- EXPORTED ACTION COMPONENTS ---- //
type BaseActionProps = { appearance?: 'default' | 'subtle' };
export const toActionProps = (props?: BaseActionProps) => ({
	appearance: props?.appearance ?? 'default',
	icon: undefined,
});

export type CopyLinkActionProps = BaseActionProps;
export const CopyLinkAction = (props: CopyLinkActionProps): React.JSX.Element => (
	<CopyLinkActionComponent {...toActionProps(props)} />
);

export type CustomActionProps = Prettify<
	BaseActionProps & {
		children: React.ReactNode;
		onClick: () => void;
	}
>;
export const CustomAction = (props: CustomActionProps): React.JSX.Element => (
	<CustomActionComponent
		{...toActionProps(props)}
		content={props.children}
		onClick={props.onClick}
	/>
);

export type DownloadActionProps = BaseActionProps;
export const DownloadAction = (props: DownloadActionProps): React.JSX.Element => (
	<DownloadActionComponent {...toActionProps(props)} />
);

export type FollowActionProps = BaseActionProps;
export const FollowAction = (props: FollowActionProps): React.JSX.Element => (
	<FollowActionComponent {...toActionProps(props)} />
);

export type PreviewActionProps = BaseActionProps;
export const PreviewAction = (props: PreviewActionProps): React.JSX.Element => (
	<PreviewActionComponent {...toActionProps(props)} />
);

export const UnresolvedAction = (props: { hasPadding?: boolean }): React.JSX.Element => (
	<UnresolvedActionComponent {...props} />
);

export { CustomUnresolvedAction } from './components/actions';
export { CustomByAccessTypeElement, CustomByStatusElement } from './components/elements';
