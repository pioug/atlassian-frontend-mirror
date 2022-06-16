import React, { useContext } from 'react';
import { MessageDescriptor } from 'react-intl-next';
import { css } from '@emotion/core';

import { ElementName, IconType } from '../../../../constants';
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

const SNIPPET_DEFAULT_MAX_LINES = 3;

const elementMappings: Record<
  ElementName,
  { component: React.FC<any> | undefined; props?: any }
> = {
  [ElementName.AuthorGroup]: { component: AvatarGroup },
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
  [ElementName.LinkIcon]: { component: Icon },
  [ElementName.ModifiedBy]: { component: Text },
  [ElementName.Preview]: { component: Media },
  [ElementName.Priority]: { component: Badge },
  [ElementName.ProgrammingLanguage]: {
    component: Badge,
    props: { icon: IconType.ProgrammingLanguage },
  },
  [ElementName.Snippet]: {
    component: Text,
    props: {
      maxLines: SNIPPET_DEFAULT_MAX_LINES,
      overrideCss: css`
        color: ${tokens.snippet};
      `,
    },
  },
  [ElementName.State]: { component: Lozenge },
  [ElementName.SubscriberCount]: {
    component: Badge,
    props: { icon: IconType.Subscriber },
  },
  [ElementName.Title]: { component: Link },
  [ElementName.CreatedOn]: { component: DateTime },
  [ElementName.ModifiedOn]: { component: DateTime },
  [ElementName.Provider]: { component: Badge },
  [ElementName.LatestCommit]: {
    component: Badge,
    props: { icon: IconType.Commit },
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
    case ElementName.CollaboratorGroup:
      return toAvatarGroupProps(data as AvatarItemProps[]);
    case ElementName.CommentCount:
    case ElementName.ViewCount:
    case ElementName.ReactCount:
    case ElementName.VoteCount:
    case ElementName.ProgrammingLanguage:
    case ElementName.SubscriberCount:
    case ElementName.LatestCommit:
      return toBadgeProps(data as string);
    case ElementName.CreatedBy:
      return toFormattedTextProps(messages.created_by, context.createdBy);
    case ElementName.CreatedOn:
      return toDateTimeProps('created', context.createdOn);
    case ElementName.ModifiedBy:
      return toFormattedTextProps(messages.modified_by, context.modifiedBy);
    case ElementName.ModifiedOn:
      return toDateTimeProps('modified', context.modifiedOn);
    case ElementName.Snippet:
      return toTextProps(data as string | undefined);
    case ElementName.Title:
      return toLinkProps(context.title, context.url);
    default:
      return data;
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
    return data ? <BaseElement {...props} {...data} {...overrides} /> : null;
  };
};
