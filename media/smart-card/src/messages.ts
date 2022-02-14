import { defineMessages, MessageDescriptor } from 'react-intl-next';

export type MessageKey =
  | 'cannot_find_link'
  | 'click_to_join'
  | 'connect_link_account'
  | 'created_by'
  | 'created_on'
  | 'delete'
  | 'modified_by'
  | 'modified_on'
  | 'priority_blocker'
  | 'priority_critical'
  | 'priority_high'
  | 'priority_highest'
  | 'priority_low'
  | 'priority_lowest'
  | 'priority_major'
  | 'priority_medium'
  | 'priority_minor'
  | 'priority_trivial'
  | 'priority_undefined'
  | 'forbidden_access'
  | 'pending_request'
  | 'restricted_link'
  | 'request_access'
  | 'request_denied';

type Messages = {
  [K in MessageKey]: MessageDescriptor;
};

export const messages: Messages = defineMessages({
  cannot_connect: {
    id: 'fabric.linking.cannot_connect',
    defaultMessage: "Can't connect, try again",
    description: 'Error for when a provided link is not found.',
  },
  cannot_find_link: {
    id: 'fabric.linking.cannot_find_link',
    defaultMessage: "Can't find link",
    description: 'Error for when a provided link is not found.',
  },
  click_to_join: {
    id: 'fabric.linking.click_to_join',
    defaultMessage: 'Join {context} to view this issue',
    description: 'Allows the user join the product or service immediately',
  },
  connect_link_account: {
    id: 'fabric.linking.connect_link_account',
    defaultMessage: 'Connect to preview',
    description:
      'Shown when a user does not have access to a link, but can connect their external account to view the link.',
  },
  created_by: {
    id: 'fabric.linking.created_by',
    defaultMessage: 'Created by {context}',
    description: 'Indicates the person or entity that created the resource.',
  },
  created_on: {
    id: 'fabric.linking.create_on',
    defaultMessage: 'Created {context}',
    description: 'Indicated when entity was created',
  },
  delete: {
    id: 'fabric.linking.delete',
    defaultMessage: 'Delete',
    description: 'Allow a user to delete a link',
  },
  modified_by: {
    id: 'fabric.linking.updated_by',
    defaultMessage: 'Modified by {context}',
    description: 'Indicates the person or entity that modified the resource.',
  },
  modified_on: {
    id: 'fabric.linking.modified_on',
    defaultMessage: 'Updated {context}',
    description: 'Indicated when entity was modified',
  },
  priority_blocker: {
    id: 'fabric.linking.priority_blocker',
    defaultMessage: 'Blocker',
    description: 'Indicated priority as blocker',
  },
  priority_critical: {
    id: 'fabric.linking.priority_critical',
    defaultMessage: 'Critical',
    description: 'Indicated priority as critical',
  },
  priority_high: {
    id: 'fabric.linking.priority_high',
    defaultMessage: 'High',
    description: 'Indicated priority as high',
  },
  priority_highest: {
    id: 'fabric.linking.priority_highest',
    defaultMessage: 'Highest',
    description: 'Indicated priority as highest',
  },
  priority_low: {
    id: 'fabric.linking.priority_low',
    defaultMessage: 'Low',
    description: 'Indicated priority as low',
  },
  priority_lowest: {
    id: 'fabric.linking.priority_lowest',
    defaultMessage: 'Lowest',
    description: 'Indicated priority as lowest',
  },
  priority_major: {
    id: 'fabric.linking.priority_major',
    defaultMessage: 'Major',
    description: 'Indicated priority as major',
  },
  priority_medium: {
    id: 'fabric.linking.priority_medium',
    defaultMessage: 'Medium',
    description: 'Indicated priority as medium',
  },
  priority_minor: {
    id: 'fabric.linking.priority_minor',
    defaultMessage: 'Minor',
    description: 'Indicated priority as minor',
  },
  priority_trivial: {
    id: 'fabric.linking.priority_trivial',
    defaultMessage: 'Trivial',
    description: 'Indicated priority as trivial',
  },
  priority_undefined: {
    id: 'fabric.linking.priority_undefined',
    defaultMessage: 'Undefined',
    description: 'Indicated priority as unknown',
  },
  forbidden_access: {
    id: 'fabric.linking.forbidden_access',
    defaultMessage: 'Your access is forbidden',
    description:
      'Shown when a user does not have access to a resource behind the link.',
  },
  pending_request: {
    id: 'fabric.linking.pending_request',
    defaultMessage: 'Your access request is pending',
    description:
      'Shown when a user has requested an access but status is pending.',
  },
  restricted_link: {
    id: 'fabric.linking.invalid_permissions',
    defaultMessage: 'Restricted link, try another account',
    description:
      'Message shown when a user does not have permissions to view an item',
  },
  request_access: {
    id: 'fabric.linking.request_access',
    defaultMessage: 'Request access to {context} to view this issue',
    description: 'Allows the user to request access to a product or service',
  },
  request_denied: {
    id: 'fabric.linking.request_denied',
    defaultMessage: 'Your access request was denied',
    description:
      'The user had request access but the request was denied by a product or service',
  },
});
