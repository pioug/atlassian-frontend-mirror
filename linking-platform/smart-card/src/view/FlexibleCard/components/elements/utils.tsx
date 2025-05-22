import React, { useContext } from 'react';

import { FormattedDate, type MessageDescriptor } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';

import { ElementName, IconType, SmartLinkInternalTheme } from '../../../../constants';
import { messages } from '../../../../messages';
import { FlexibleUiContext, useFlexibleUiContext } from '../../../../state/flexible-ui-context';
import { type FlexibleUiDataContext } from '../../../../state/flexible-ui-context/types';
import { isProfileType } from '../../../../utils';

import AppliedToComponentsCount from './applied-to-components-count-element';
import AtlaskitElementBadge, { type AtlaskitBadgeElementProps } from './atlaskit-badge-element';
import {
	BaseAvatarGroupElement,
	type BaseAvatarGroupElementProps,
	type BaseAvatarItemProps,
	BaseBadgeElement,
	type BaseBadgeElementProps,
	BaseDateTimeElement,
	type BaseDateTimeProps,
	BaseLinkElement,
	type BaseLinkElementProps,
	BaseLozengeElement,
	type BaseLozengeElementProps,
	BaseTextElement,
	type BaseTextElementProps,
} from './common';
import IconElement from './icon-element';
import MediaElement from './media-element';

type ElementMapping = {
	[key in ElementName]?: { component: React.ComponentType<any> | undefined; props?: any };
};

const elementMappings: ElementMapping = {
	[ElementName.AppliedToComponentsCount]: {
		component: AppliedToComponentsCount,
		props: { icon: IconType.Component },
	},
	[ElementName.AttachmentCount]: {
		component: BaseBadgeElement,
		props: { icon: IconType.Attachment },
	},
	[ElementName.AuthorGroup]: { component: BaseAvatarGroupElement },
	[ElementName.ChecklistProgress]: {
		component: BaseBadgeElement,
		props: { icon: IconType.CheckItem },
	},
	[ElementName.CollaboratorGroup]: { component: BaseAvatarGroupElement },
	[ElementName.CommentCount]: {
		component: BaseBadgeElement,
		props: { icon: IconType.Comment },
	},
	[ElementName.ViewCount]: {
		component: BaseBadgeElement,
		props: { icon: IconType.View },
	},
	[ElementName.ReactCount]: {
		component: BaseBadgeElement,
		props: { icon: IconType.React },
	},
	[ElementName.VoteCount]: {
		component: BaseBadgeElement,
		props: { icon: IconType.Vote },
	},
	[ElementName.CreatedBy]: { component: BaseTextElement },
	[ElementName.OwnedBy]: { component: BaseTextElement },
	[ElementName.AssignedTo]: { component: BaseTextElement },
	[ElementName.AssignedToGroup]: { component: BaseAvatarGroupElement },
	[ElementName.OwnedByGroup]: { component: BaseAvatarGroupElement },
	[ElementName.CreatedOn]: { component: BaseDateTimeElement },
	[ElementName.DueOn]: { component: BaseLozengeElement },
	[ElementName.LatestCommit]: {
		component: BaseBadgeElement,
		props: { icon: IconType.Commit },
	},
	[ElementName.LinkIcon]: { component: IconElement },
	[ElementName.ModifiedBy]: { component: BaseTextElement },
	[ElementName.ModifiedOn]: { component: BaseDateTimeElement },
	[ElementName.Preview]: { component: MediaElement },
	[ElementName.Priority]: { component: BaseBadgeElement },
	[ElementName.ProgrammingLanguage]: {
		component: BaseBadgeElement,
		props: { icon: IconType.ProgrammingLanguage },
	},
	[ElementName.Provider]: { component: BaseBadgeElement },
	[ElementName.ReadTime]: { component: BaseTextElement },
	[ElementName.SentOn]: { component: BaseDateTimeElement },
	[ElementName.SourceBranch]: { component: BaseTextElement },
	[ElementName.State]: { component: BaseLozengeElement },
	[ElementName.SubscriberCount]: {
		component: BaseBadgeElement,
		props: { icon: IconType.Subscriber },
	},
	[ElementName.SubTasksProgress]: {
		component: BaseBadgeElement,
		props: { icon: IconType.SubTasksProgress },
	},
	[ElementName.StoryPoints]: {
		component: AtlaskitElementBadge,
	},
	[ElementName.TargetBranch]: { component: BaseTextElement },
	[ElementName.Title]: { component: BaseLinkElement },
	[ElementName.Location]: {
		component: BaseLinkElement,
		props: { theme: SmartLinkInternalTheme.Grey },
	},
};

/**
 * @deprecated
 */
const getContextKey = (name: ElementName) => {
	// Attempt to predict context prop name in advance to reduce the amount of
	// code run during runtime
	return name.length > 0 ? name.charAt(0).toLowerCase() + name.slice(1) : undefined;
};

/**
 * @deprecated
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

const toAvatarGroupProps = (
	items?: BaseAvatarItemProps[],
	showFallbackAvatar?: boolean,
): Partial<BaseAvatarGroupElementProps> | undefined => {
	return items ? { items } : showFallbackAvatar ? { items: [] } : undefined;
};

const toBadgeProps = (label?: string): Partial<BaseBadgeElementProps> | undefined => {
	return label ? { label } : undefined;
};

const toAtlaskitBadgeProps = (value?: number): Partial<AtlaskitBadgeElementProps> | undefined => {
	return value ? { value } : undefined;
};

const toDateLozengeProps = (dateString?: string): Partial<BaseLozengeElementProps> | undefined => {
	if (dateString) {
		const text = Date.parse(dateString) ? (
			<FormattedDate
				value={new Date(dateString)}
				year="numeric"
				month="short"
				day="numeric"
				formatMatcher="best fit"
			/>
		) : (
			dateString
		);
		return { text };
	}
};

const toDateTimeProps = (
	type: 'created' | 'modified' | 'sent',
	dateString?: string,
): Partial<BaseDateTimeProps> | undefined => {
	return dateString ? { date: new Date(dateString), type } : undefined;
};

const toFormattedTextProps = (
	descriptor: MessageDescriptor,
	context?: string,
): Partial<BaseTextElementProps> | undefined => {
	if (fg('platform-linking-additional-flexible-element-props')) {
		return context ? { message: { descriptor, values: { context } }, content: context } : undefined;
	}
	return context ? { message: { descriptor, values: { context } } } : undefined;
};

const toLinkProps = (text?: string, url?: string): Partial<BaseLinkElementProps> | undefined => {
	return text ? { text, url } : undefined;
};

const toTextProps = (content?: string): Partial<BaseTextElementProps> | undefined => {
	return content ? { content } : undefined;
};

const toLinkIconProps = (
	data: FlexibleUiDataContext[keyof FlexibleUiDataContext] | undefined,
	type: FlexibleUiDataContext['type'],
) => {
	const isDataLinkIcon = (_data: typeof data): _data is FlexibleUiDataContext['linkIcon'] => {
		return typeof _data === 'object' && _data !== null && ('icon' in _data || 'url' in _data);
	};

	if (!isDataLinkIcon(data)) {
		return typeof data === 'object' ? data : undefined;
	}

	const isImageRound = isProfileType(type);

	return { ...data, appearance: isImageRound ? 'round' : 'square' };
};

/**
 * @deprecated
 */
export const createElement = <P extends {}>(name: ElementName): React.ComponentType<P> => {
	const { component: BaseElement, props } = elementMappings[name] || {};
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
