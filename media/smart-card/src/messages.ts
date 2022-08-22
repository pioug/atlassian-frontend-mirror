import { defineMessages, MessageDescriptor } from 'react-intl-next';

export type RequestAccessMessageKey =
  | 'click_to_join'
  | 'click_to_join_description'
  | 'forbidden_description'
  | 'request_access'
  | 'request_access_description'
  | 'request_access_pending'
  | 'request_access_pending_description'
  | 'request_denied_description';

export type MessageKey =
  | 'cannot_find_link'
  | 'connect_link_account_card'
  | 'connect_link_account_card_name'
  | 'connect_link_account_card_description'
  | 'could_not_load_link'
  | 'download'
  | 'invalid_permissions'
  | 'invalid_permissions_description'
  | 'join_to_view'
  | 'connect_link_account'
  | 'created_by'
  | 'created_on_relative'
  | 'created_on_absolute'
  | 'delete'
  | 'edit'
  | 'loading'
  | 'modified_by'
  | 'modified_on_relative'
  | 'modified_on_absolute'
  | 'more_actions'
  | 'not_found_title'
  | 'not_found_description'
  | 'preview'
  | 'preview_close'
  | 'preview_max_size'
  | 'preview_min_size'
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
  | 'request_access_to_view'
  | 'request_denied'
  | 'try_again'
  | 'try_another_account'
  | 'view'
  | 'viewIn'
  | 'viewOriginal'
  // Cannot find direct usage of the following messages,
  // but the context indicates it could be used in Smart Links.
  // Could the key be returned with JsonLd on auth flow?
  // Keep the messages until able to verify that the messages are not used.
  | 'actions'
  | 'add_account'
  | 'cancel'
  | 'close'
  | 'connect_to'
  | 'connect_account_description'
  | 'retry'
  | 'save'
  | 'unlink_account'
  | RequestAccessMessageKey;

type Messages = {
  [K in MessageKey]: MessageDescriptor;
};

export const messages: Messages = defineMessages({
  actions: {
    id: 'fabric.linking.actions',
    defaultMessage: 'Actions',
    description: '',
  },
  add_account: {
    id: 'fabric.linking.add_account',
    defaultMessage: 'Add account',
    description: 'Allows to add a new account',
  },
  cancel: {
    id: 'fabric.linking.cancel',
    defaultMessage: 'Cancel',
    description: 'cancel',
  },
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
    defaultMessage: 'Join {context}',
    description: 'Allows the user join the product or service immediately',
  },
  click_to_join_description: {
    id: 'fabric.linking.click_to_join_description',
    defaultMessage:
      "You've been approved, so you can join {context} right away.",
    description:
      'Informs the user that they have access to this product, and can sign up or join right away.',
  },
  close: {
    id: 'fabric.linking.close',
    defaultMessage: 'Close',
    description: '',
  },
  connect_to: {
    id: 'fabric.linking.connect_to',
    defaultMessage: 'Connect to {name}',
    description:
      'Allows the user to connect with different types of external services',
  },
  connect_account_description: {
    id: 'fabric.linking.connect_account_description',
    defaultMessage:
      "We'll open a new page to help you connect your {name} account",
    description:
      'Explains what will happen when the users connects to a new account',
  },
  connect_link_account: {
    id: 'fabric.linking.connect_link_account',
    defaultMessage: 'Connect to preview',
    description:
      'Shown when a user does not have access to a link, but can connect their external account to view the link.',
  },
  connect_link_account_card: {
    id: 'fabric.linking.connect_link_account_card_view',
    defaultMessage: 'Connect',
    description:
      'Shown when a user does not have access to a link, but can connect their external account to view the link on card view.',
  },
  connect_link_account_card_name: {
    id: 'fabric.linking.connect_link_account_card_view_name',
    defaultMessage: 'Connect your {context} account',
    description:
      'Shown when a user does not have access to a link, but can connect their external account to view the link on card view. Displayed in title.',
  },
  connect_link_account_card_description: {
    id: 'fabric.linking.connect_link_account_card_view_description',
    defaultMessage:
      'To show a preview of this link, connect your {context} account.',
    description:
      'Shown when a user does not have access to a link, but can connect their external account to view the link on card view. Displayed in byline.',
  },
  could_not_load_link: {
    id: 'fabric.linking.couldnt_load_link',
    defaultMessage: "We couldn't load this link for an unknown reason.",
    description: 'Error case for card view - link could not be loaded.',
  },
  created_by: {
    id: 'fabric.linking.created_by',
    defaultMessage: 'Created by {context}',
    description: 'Indicates the person or entity that created the resource.',
  },
  created_on_relative: {
    id: 'fabric.linking.create_on_relative',
    defaultMessage: 'Created {context}',
    description: 'Indicated when entity was created (relative form)',
  },
  created_on_absolute: {
    id: 'fabric.linking.create_on_absolute',
    defaultMessage: 'Created on {context}',
    description: 'Indicated when entity was created (absolute form)',
  },
  delete: {
    id: 'fabric.linking.delete',
    defaultMessage: 'Delete',
    description: 'Allow a user to delete a link',
  },
  download: {
    id: 'fabric.linking.download',
    defaultMessage: 'Download',
    description: '',
  },
  edit: {
    id: 'fabric.linking.edit',
    defaultMessage: 'Edit',
    description: 'Allow a user to edit a link',
  },
  forbidden_description: {
    id: 'fabric.linking.forbidden_description',
    defaultMessage:
      'You don’t have access to this preview. Contact the site admin if you need access.',
    description: 'Informs the user that they cannot view this content.',
  },
  invalid_permissions: {
    id: 'fabric.linking.invalid_permissions',
    defaultMessage: 'Restricted link',
    description:
      'Message shown when a user does not have permissions to view an item',
  },
  invalid_permissions_description: {
    id: 'fabric.linking.invalid_permissions_description',
    defaultMessage:
      "You'll need to request access or try a different account to view this preview.",
    description:
      'Message shown when a user does not have permissions to view an item. Displayed as description.',
  },
  join_to_view: {
    id: 'fabric.linking.join_to_view',
    defaultMessage: 'Join {context} to view this issue',
    description: 'Allows the user join the product or service immediately',
  },
  loading: {
    id: 'fabric.linking.loading',
    defaultMessage: 'Loading...',
    description: 'Indicates an element on a page is loading.',
  },
  modified_by: {
    id: 'fabric.linking.updated_by',
    defaultMessage: 'Modified by {context}',
    description: 'Indicates the person or entity that modified the resource.',
  },
  modified_on_relative: {
    id: 'fabric.linking.modified_on_relative',
    defaultMessage: 'Updated {context}',
    description: 'Indicated when entity was modified (relative form)',
  },
  modified_on_absolute: {
    id: 'fabric.linking.modified_on_absolute',
    defaultMessage: 'Updated on {context}',
    description: 'Indicated when entity was modified (absolute form)',
  },
  more_actions: {
    id: 'fabric.linking.more_actions',
    defaultMessage: 'More actions',
    description: 'Allows the users to see more link actions',
  },
  not_found_description: {
    id: 'fabric.linking.not_found_description',
    defaultMessage:
      "We couldn't find the link. Check the url and try editing or paste again.",
    description:
      'Error case for when a provided item is not found within the list of items',
  },
  not_found_title: {
    id: 'fabric.linking.not_found_title',
    defaultMessage: "Uh oh. We can't find this link!",
    description: 'Error case for when a provided link is not found',
  },
  preview: {
    id: 'fabric.linking.preview',
    defaultMessage: 'Preview',
    description:
      'Click to view a richer view of your content, without needing to navigate to it.',
  },
  preview_close: {
    id: 'fabric.linking.preview_close',
    defaultMessage: 'Close preview',
    description: 'Click to close embed preview modal.',
  },
  preview_max_size: {
    id: 'fabric.linking.preview_max_size',
    defaultMessage: 'View full screen',
    description:
      'Click to increase embed preview modal size to a maximum viewing size.',
  },
  preview_min_size: {
    id: 'fabric.linking.preview_min_size',
    defaultMessage: 'Close full screen',
    description:
      'Click to decrease embed preview modal size to a minimum viewing size.',
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
    id: 'fabric.linking.restricted_link',
    defaultMessage: 'Restricted link, try another account',
    description:
      'Message shown when a user does not have permissions to view an item',
  },
  request_access: {
    id: 'fabric.linking.request_access',
    defaultMessage: 'Request access',
    description: 'Allows the user to request access to a product or service',
  },
  request_access_description: {
    id: 'fabric.linking.request_access_description',
    defaultMessage: 'Request access to {context} view this preview.',
    description: 'Allows the user to request access to a product',
  },
  request_access_pending: {
    id: 'fabric.linking.request_access_pending',
    defaultMessage: 'Access pending',
    description:
      'Allows the user to try an action again with their current account',
  },
  request_access_pending_description: {
    id: 'fabric.linking.request_access_pending_description',
    defaultMessage: 'Your access request is pending.',
    description:
      'Informs the user that their request to view this content is pending',
  },
  request_access_to_view: {
    id: 'fabric.linking.request_access_to_view',
    defaultMessage: 'Request access to {context} to view this issue',
    description: 'Allows the user to request access to a product or service',
  },
  request_denied: {
    id: 'fabric.linking.request_denied',
    defaultMessage: 'Your access request was denied',
    description:
      'The user had request access but the request was denied by a product or service',
  },
  request_denied_description: {
    id: 'fabric.linking.request_denied_description',
    defaultMessage:
      'Your access request was denied. Contact the site admin if you still need access.',
    description:
      'Informs the user that their request to view this content was denied',
  },
  retry: {
    id: 'fabric.linking.retry',
    defaultMessage: 'Retry',
    description: 'Allows user to perform an action again',
  },
  save: {
    id: 'fabric.linking.save',
    defaultMessage: 'Save',
    description: 'Just the "save" word',
  },
  try_again: {
    id: 'fabric.linking.try_again',
    defaultMessage: 'Try again',
    description: 'Allow the user to try an action again',
  },
  try_another_account: {
    id: 'fabric.linking.try_another_account',
    defaultMessage: 'Try another account',
    description:
      'Allows the user to try an action again with a different account',
  },
  unlink_account: {
    id: 'fabric.linking.unlink_account',
    defaultMessage: 'Unlink Account',
    description: 'Allows to remove a connected account from the user',
  },
  view: {
    id: 'fabric.linking.view',
    defaultMessage: 'View',
    description:
      'Go through to a piece of content to view it in its original context.',
  },
  viewIn: {
    id: 'fabric.linking.srclink',
    defaultMessage: 'View in',
    description:
      'We have a link in our preview modals to the original document. This text goes before the provider name',
  },
  viewOriginal: {
    id: 'fabric.linking.srclinkunknown',
    defaultMessage: 'View Original',
    description:
      "We have a link in our preview modals to the original document. This is for when we don't know the provider name",
  },
});
