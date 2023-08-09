import React, { useContext } from 'react';
import { FormattedDate, MessageDescriptor } from 'react-intl-next';
import { css } from '@emotion/react';

import {
  ElementName,
  IconType,
  SmartLinkInternalTheme,
} from '../../../../constants';
import { FlexibleUiDataContext } from '../../../../state/flexible-ui-context/types';
import Icon from './icon';
import Link from './link';
import Lozenge from './lozenge';
import { FlexibleUiContext } from '../../../../state/flexible-ui-context';
import Badge from './badge';
import AvatarGroup from './avatar-group';
import Media from './media';
import Text from './text';
import { messages } from '../../../../messages';
import DateTime from './date-time';
import { AvatarGroupProps, AvatarItemProps } from './avatar-group/types';
import { BadgeProps } from './badge/types';
import { DateTimeProps } from './date-time/types';
import { LinkProps } from './link/types';
import { TextProps } from './text/types';
import { tokens } from '../../../../utils/token';
import { LozengeProps } from './lozenge/types';
import AtlaskitBadge from './atlaskit-badge';
import { AtlaskitBadgeProps } from './atlaskit-badge/types';

const SNIPPET_DEFAULT_MAX_LINES = 3;

const elementMappings: Record<
  ElementName,
  { component: React.FC<any> | undefined; props?: any }
> = {
  [ElementName.AttachmentCount]: {
    component: Badge,
    props: { icon: IconType.Attachment },
  },
  [ElementName.AuthorGroup]: { component: AvatarGroup },
  [ElementName.ChecklistProgress]: {
    component: Badge,
    props: { icon: IconType.CheckItem },
  },
  [ElementName.CollaboratorGroup]: { component: AvatarGroup },
  [ElementName.CommentCount]: {
    component: Badge,
    props: { icon: IconType.Comment },
  },
  [ElementName.ViewCount]: {
    component: Badge,
    props: { icon: IconType.View },
  },
  [ElementName.ReactCount]: {
    component: Badge,
    props: { icon: IconType.React },
  },
  [ElementName.VoteCount]: {
    component: Badge,
    props: { icon: IconType.Vote },
  },
  [ElementName.CreatedBy]: { component: Text },
  [ElementName.OwnedBy]: { component: Text },
  [ElementName.AssignedTo]: { component: Text },
  [ElementName.AssignedToGroup]: { component: AvatarGroup },
  [ElementName.OwnedByGroup]: { component: AvatarGroup },
  [ElementName.CreatedOn]: { component: DateTime },
  [ElementName.DueOn]: { component: Lozenge },
  [ElementName.LatestCommit]: {
    component: Badge,
    props: { icon: IconType.Commit },
  },
  [ElementName.LinkIcon]: { component: Icon },
  [ElementName.ModifiedBy]: { component: Text },
  [ElementName.ModifiedOn]: { component: DateTime },
  [ElementName.Preview]: { component: Media },
  [ElementName.Priority]: { component: Badge },
  [ElementName.ProgrammingLanguage]: {
    component: Badge,
    props: { icon: IconType.ProgrammingLanguage },
  },
  [ElementName.Provider]: { component: Badge },
  [ElementName.ReadTime]: { component: Text },
  [ElementName.Snippet]: {
    component: Text,
    props: {
      maxLines: SNIPPET_DEFAULT_MAX_LINES,
      overrideCss: css`
        color: ${tokens.snippet};
      `,
    },
  },
  [ElementName.SourceBranch]: { component: Text },
  [ElementName.State]: { component: Lozenge },
  [ElementName.SubscriberCount]: {
    component: Badge,
    props: { icon: IconType.Subscriber },
  },
  [ElementName.SubTasksProgress]: {
    component: Badge,
    props: { icon: IconType.SubTasksProgress },
  },
  [ElementName.StoryPoints]: {
    component: AtlaskitBadge,
  },
  [ElementName.TargetBranch]: { component: Text },
  [ElementName.Title]: { component: Link },
  [ElementName.Location]: {
    component: Link,
    props: { theme: SmartLinkInternalTheme.Grey },
  },
};

const getContextKey = (name: ElementName) => {
  // Attempt to predict context prop name in advance to reduce the amount of
  // code run during runtime
  return name.length > 0
    ? name.charAt(0).toLowerCase() + name.slice(1)
    : undefined;
};

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
    case ElementName.AuthorGroup:
    case ElementName.AssignedToGroup:
    case ElementName.CollaboratorGroup:
    case ElementName.OwnedByGroup:
      return toAvatarGroupProps(data as AvatarItemProps[]);
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
    case ElementName.ReadTime:
      return toFormattedTextProps(messages.read_time, data as string);
    case ElementName.Snippet:
    case ElementName.SourceBranch:
    case ElementName.TargetBranch:
      return toTextProps(data as string | undefined);
    case ElementName.Title:
      return toLinkProps(context.title, context.url);
    default:
      return typeof data === 'object' ? data : undefined;
  }
};

const toAvatarGroupProps = (
  items?: AvatarItemProps[],
): Partial<AvatarGroupProps> | undefined => {
  return items ? { items } : undefined;
};

const toBadgeProps = (label?: string): Partial<BadgeProps> | undefined => {
  return label ? { label } : undefined;
};

const toAtlaskitBadgeProps = (
  value?: number,
): Partial<AtlaskitBadgeProps> | undefined => {
  return value ? { value } : undefined;
};

const toDateLozengeProps = (
  dateString?: string,
): Partial<LozengeProps> | undefined => {
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
  type: 'created' | 'modified',
  dateString?: string,
): Partial<DateTimeProps> | undefined => {
  return dateString ? { date: new Date(dateString), type } : undefined;
};

const toFormattedTextProps = (
  descriptor: MessageDescriptor,
  context?: string,
): Partial<TextProps> | undefined => {
  return context ? { message: { descriptor, values: { context } } } : undefined;
};

const toLinkProps = (
  text?: string,
  url?: string,
): Partial<LinkProps> | undefined => {
  return text ? { text, url } : undefined;
};

const toTextProps = (content?: string): Partial<TextProps> | undefined => {
  return content ? { content } : undefined;
};

export const createElement = <P extends {}>(name: ElementName): React.FC<P> => {
  const { component: BaseElement, props } = elementMappings[name] || {};
  const contextKey = getContextKey(name);

  if (!BaseElement) {
    throw Error(`Element ${name} does not exist.`);
  }

  return (overrides: P) => {
    const context = useContext(FlexibleUiContext);
    const data = getData(name, contextKey, context);
    return data ? (
      <BaseElement {...props} {...data} {...overrides} name={name} />
    ) : null;
  };
};
