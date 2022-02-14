import React, { useContext } from 'react';
import { MessageDescriptor } from 'react-intl-next';

import { ElementName, IconType } from '../../../../constants';
import { FlexibleUiDataContext } from '../../../../state/flexible-ui-context/types';
import Icon from './icon';
import Link from './link';
import Lozenge from './lozenge';
import { FlexibleUiContext } from '../../../../state/flexible-ui-context';
import Badge from './badge';
import AvatarGroup from './avatar-group';
import Text from './text';
import { messages } from '../../../../messages';
import DateTime from './date-time';
import { DateTimeProps } from './date-time/types';

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
  [ElementName.CreatedBy]: { component: Text },
  [ElementName.LinkIcon]: { component: Icon },
  [ElementName.ModifiedBy]: { component: Text },
  [ElementName.Priority]: { component: Badge },
  [ElementName.ProgrammingLanguage]: {
    component: Badge,
    props: { icon: IconType.ProgrammingLanguage },
  },
  [ElementName.State]: { component: Lozenge },
  [ElementName.SubscriberCount]: {
    component: Badge,
    props: { icon: IconType.Subscriber },
  },
  [ElementName.Title]: { component: Link },
  [ElementName.CreatedOn]: { component: DateTime },
  [ElementName.ModifiedOn]: { component: DateTime },
};

const getContextKey = (name: ElementName) => {
  // Attempt to predict context prop name in advance to reduce the amount of
  // code run during runtime
  return name.length > 0
    ? name.charAt(0).toLowerCase() + name.slice(1)
    : undefined;
};

const getFormattedMessage = (descriptor: MessageDescriptor, value?: string) =>
  value
    ? {
        message: {
          descriptor,
          values: { context: value },
        },
      }
    : undefined;

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
    case ElementName.CommentCount:
    case ElementName.ProgrammingLanguage:
    case ElementName.SubscriberCount:
      return { label: data };
    case ElementName.AuthorGroup:
      return { items: context.authorGroup };
    case ElementName.CollaboratorGroup:
      return { items: context.collaboratorGroup };
    case ElementName.CreatedBy:
      return getFormattedMessage(messages.created_by, context.createdBy);
    case ElementName.ModifiedBy:
      return getFormattedMessage(messages.modified_by, context.modifiedBy);
    case ElementName.ModifiedOn:
      return context.modifiedOn
        ? ({
            date: new Date(context.modifiedOn),
            type: 'modified',
          } as DateTimeProps)
        : undefined;
    case ElementName.CreatedOn:
      return context.createdOn
        ? ({
            date: new Date(context.createdOn),
            type: 'created',
          } as DateTimeProps)
        : undefined;
    case ElementName.Title:
      return { text: context.title, url: context.url };
    default:
      return data;
  }
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
