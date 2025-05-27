import React, { useContext } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { ElementName, IconType, SmartLinkInternalTheme } from '../../../../constants';
import { messages } from '../../../../messages';
import { FlexibleUiContext, useFlexibleUiContext } from '../../../../state/flexible-ui-context';
import { type FlexibleUiDataContext } from '../../../../state/flexible-ui-context/types';

import AppliedToComponentsCount from './applied-to-components-count-element';
import assignedToElement from './assigned-to-element';
import assignedToGroupElement from './assigned-to-group-element';
import attachmentCountElement from './attachment-count-element';
import authorGroupElement from './author-group-element';
import checklistProgressElement from './checklist-progress-element';
import collaboratorGroupElement from './collaborator-group-element';
import commentCountElement from './comment-count-element';
import {
	BaseAtlaskitBadgeElement,
	BaseAvatarGroupElement,
	type BaseAvatarItemProps,
	BaseBadgeElement,
	BaseDateTimeElement,
	BaseIconElement,
	BaseLinkElement,
	BaseLozengeElement,
	BaseTextElement,
	toAtlaskitBadgeProps,
	toAvatarGroupProps,
	toBadgeProps,
	toDateLozengeProps,
	toDateTimeProps,
	toFormattedTextProps,
	toLinkIconProps,
	toLinkProps,
	toTextProps,
} from './common';
import createdByElement from './created-by-element';
import createdOnElement from './created-on-element';
import dueOnElement from './due-on-element';
import latestCommitElement from './latest-commit-element';
import linkIconElement from './link-icon-element';
import locationElement from './location-element';
import MediaElement from './media-element';
import modifiedByElement from './modified-by-element';
import modifiedOnElement from './modified-on-element';
import ownedByElement from './owned-by-element';
import ownedByGroupElement from './owned-by-group-element';
import previewElement from './preview-element';
import priorityElement from './priority-element';
import programmingLanguageElement from './programming-language-element';
import providerElement from './provider-element';
import reactCountElement from './react-count-element';
import readTimeElement from './read-time-element';
import sentOnElement from './sent-on-element';
import sourceBranchElement from './source-branch-element';
import stateElement from './state-element';
import storyPointsElement from './story-points-element';
import subTasksProgressElement from './sub-tasks-progress-element';
import subscriberCountElement from './subscriber-count-element';
import targetBranchElement from './target-branch-element';
import titleElement from './title-element';
import viewCountElement from './view-count-element';
import voteCountElement from './vote-count-element';

/**
 * @deprecated remove on FG clean up platform-linking-flexible-card-elements-refactor
 */
type ElementMapping = {
	[key in ElementName]?: {
		component: React.ComponentType<any> | undefined;
		props?: any;
		newComponent?: React.ComponentType<any>;
	};
};

/**
 * @deprecated remove on FG clean up platform-linking-flexible-card-elements-refactor
 */
const elementMappings: ElementMapping = {
	[ElementName.AppliedToComponentsCount]: {
		component: AppliedToComponentsCount,
		props: { icon: IconType.Component },
	},
	[ElementName.AttachmentCount]: {
		component: BaseBadgeElement,
		props: { icon: IconType.Attachment },
		newComponent: attachmentCountElement,
	},
	[ElementName.AuthorGroup]: {
		component: BaseAvatarGroupElement,
		newComponent: authorGroupElement,
	},
	[ElementName.ChecklistProgress]: {
		component: BaseBadgeElement,
		props: { icon: IconType.CheckItem },
		newComponent: checklistProgressElement,
	},
	[ElementName.CollaboratorGroup]: {
		component: BaseAvatarGroupElement,
		newComponent: collaboratorGroupElement,
	},
	[ElementName.CommentCount]: {
		component: BaseBadgeElement,
		props: { icon: IconType.Comment },
		newComponent: commentCountElement,
	},
	[ElementName.ViewCount]: {
		component: BaseBadgeElement,
		props: { icon: IconType.View },
		newComponent: viewCountElement,
	},
	[ElementName.ReactCount]: {
		component: BaseBadgeElement,
		props: { icon: IconType.React },
		newComponent: reactCountElement,
	},
	[ElementName.VoteCount]: {
		component: BaseBadgeElement,
		props: { icon: IconType.Vote },
		newComponent: voteCountElement,
	},
	[ElementName.CreatedBy]: { component: BaseTextElement, newComponent: createdByElement },
	[ElementName.OwnedBy]: { component: BaseTextElement, newComponent: ownedByElement },
	[ElementName.AssignedTo]: { component: BaseTextElement, newComponent: assignedToElement },
	[ElementName.AssignedToGroup]: {
		component: BaseAvatarGroupElement,
		newComponent: assignedToGroupElement,
	},
	[ElementName.OwnedByGroup]: {
		component: BaseAvatarGroupElement,
		newComponent: ownedByGroupElement,
	},
	[ElementName.CreatedOn]: { component: BaseDateTimeElement, newComponent: createdOnElement },
	[ElementName.DueOn]: { component: BaseLozengeElement, newComponent: dueOnElement },
	[ElementName.LatestCommit]: {
		component: BaseBadgeElement,
		props: { icon: IconType.Commit },
		newComponent: latestCommitElement,
	},
	[ElementName.LinkIcon]: { component: BaseIconElement, newComponent: linkIconElement },
	[ElementName.ModifiedBy]: { component: BaseTextElement, newComponent: modifiedByElement },
	[ElementName.ModifiedOn]: { component: BaseDateTimeElement, newComponent: modifiedOnElement },
	[ElementName.Preview]: { component: MediaElement, newComponent: previewElement },
	[ElementName.Priority]: { component: BaseBadgeElement, newComponent: priorityElement },
	[ElementName.ProgrammingLanguage]: {
		component: BaseBadgeElement,
		props: { icon: IconType.ProgrammingLanguage },
		newComponent: programmingLanguageElement,
	},
	[ElementName.Provider]: { component: BaseBadgeElement, newComponent: providerElement },
	[ElementName.ReadTime]: { component: BaseTextElement, newComponent: readTimeElement },
	[ElementName.SentOn]: { component: BaseDateTimeElement, newComponent: sentOnElement },
	[ElementName.SourceBranch]: { component: BaseTextElement, newComponent: sourceBranchElement },
	[ElementName.State]: { component: BaseLozengeElement, newComponent: stateElement },
	[ElementName.SubscriberCount]: {
		component: BaseBadgeElement,
		props: { icon: IconType.Subscriber },
		newComponent: subscriberCountElement,
	},
	[ElementName.SubTasksProgress]: {
		component: BaseBadgeElement,
		props: { icon: IconType.SubTasksProgress },
		newComponent: subTasksProgressElement,
	},
	[ElementName.StoryPoints]: {
		component: BaseAtlaskitBadgeElement,
		newComponent: storyPointsElement,
	},
	[ElementName.TargetBranch]: { component: BaseTextElement, newComponent: targetBranchElement },
	[ElementName.Title]: { component: BaseLinkElement, newComponent: titleElement },
	[ElementName.Location]: {
		component: BaseLinkElement,
		props: { theme: SmartLinkInternalTheme.Grey },
		newComponent: locationElement,
	},
};

/**
 * @deprecated remove on FG clean up platform-linking-flexible-card-elements-refactor
 */
const getContextKey = (name: ElementName) => {
	// Attempt to predict context prop name in advance to reduce the amount of
	// code run during runtime
	return name.length > 0 ? name.charAt(0).toLowerCase() + name.slice(1) : undefined;
};

/**
 * @deprecated remove on FG clean up platform-linking-flexible-card-elements-refactor
 */
const getData = (
	elementName: ElementName,
	contextKey?: string,
	context?: FlexibleUiDataContext,
) => {
	if (!context) {
		return undefined;
	}

	const data = context[contextKey as keyof typeof context];

	switch (elementName) {
		case ElementName.AssignedToGroup:
		case ElementName.AuthorGroup:
		case ElementName.CollaboratorGroup:
		case ElementName.OwnedByGroup:
			const AvatarGroupsWithFallback = [ElementName.AssignedToGroup];
			const showFallbackAvatar = AvatarGroupsWithFallback.includes(elementName);
			return toAvatarGroupProps(data as BaseAvatarItemProps[], showFallbackAvatar);
		case ElementName.AppliedToComponentsCount:
		case ElementName.AttachmentCount:
		case ElementName.ChecklistProgress:
		case ElementName.CommentCount:
		case ElementName.ViewCount:
		case ElementName.ReactCount:
		case ElementName.VoteCount:
		case ElementName.ProgrammingLanguage:
		case ElementName.SubscriberCount:
		case ElementName.LatestCommit:
		case ElementName.SubTasksProgress:
			return toBadgeProps(data as string);
		case ElementName.StoryPoints:
			return toAtlaskitBadgeProps(data as number);
		case ElementName.CreatedBy:
			return toFormattedTextProps(messages.created_by, context.createdBy);
		case ElementName.AssignedTo:
			return toFormattedTextProps(messages.assigned_to, context.assignedTo);
		case ElementName.OwnedBy:
			return toFormattedTextProps(messages.owned_by, context.ownedBy);
		case ElementName.CreatedOn:
			return toDateTimeProps('created', context.createdOn);
		case ElementName.DueOn:
			return toDateLozengeProps(context.dueOn);
		case ElementName.ModifiedBy:
			return toFormattedTextProps(messages.modified_by, context.modifiedBy);
		case ElementName.ModifiedOn:
			return toDateTimeProps('modified', context.modifiedOn);
		case ElementName.SentOn:
			return toDateTimeProps('sent', context.sentOn);
		case ElementName.ReadTime:
			return toFormattedTextProps(messages.read_time, data as string);
		case ElementName.SourceBranch:
		case ElementName.TargetBranch:
			return toTextProps(data as string | undefined);
		case ElementName.Title:
			if (fg('platform-linking-flexible-card-context')) {
				return context.linkTitle;
			}
			return toLinkProps(context.title, context.url);
		case ElementName.LinkIcon:
			if (fg('platform-linking-visual-refresh-v2')) {
				return toLinkIconProps(data, context.type);
			}
			return typeof data === 'object' ? data : undefined;
		default:
			return typeof data === 'object' ? data : undefined;
	}
};

/**
 * @deprecated remove on FG platform-linking-flexible-card-elements-refactor clean up
 */
export const createElement = <P extends {}>(name: ElementName): React.ComponentType<P> => {
	const { component: BaseElement, props, newComponent } = elementMappings[name] || {};

	if (newComponent && fg('platform-linking-flexible-card-elements-refactor')) {
		return newComponent;
	}

	const contextKey = getContextKey(name);

	if (!BaseElement) {
		throw Error(`Element ${name} does not exist.`);
	}

	return (overrides: P) => {
		const context = fg('platform-linking-flexible-card-context')
			? // eslint-disable-next-line react-hooks/rules-of-hooks
				useFlexibleUiContext()
			: // eslint-disable-next-line react-hooks/rules-of-hooks
				useContext(FlexibleUiContext);
		const data = getData(name, contextKey, context);
		return data ? <BaseElement {...props} {...data} {...overrides} name={name} /> : null;
	};
};
