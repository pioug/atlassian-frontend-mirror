import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
  inviteItemTitle: {
    id: 'fabric.editor.inviteItem.title',
    defaultMessage:
      '{userRole, select, admin {Invite} trusted {Invite} other {Add}} teammate to {productName}',
    description: 'Title of the invite teammate item in typeahead plugin',
  },
  mentionsAddLabel: {
    id: 'fabric.editor.mentionsAddLabel',
    defaultMessage: 'add-icon',
    description: 'icon label to describe adding a new mention',
  },
  mentionsIconLabel: {
    id: 'fabric.editor.mentionsIconLabel',
    defaultMessage: 'Mention',
    description: 'icon label to describe the mention icon',
  },
});
