import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  inviteItemTitle: {
    id: 'fabric.editor.inviteItem.title',
    defaultMessage:
      '{userRole, select, admin {Invite} trusted {Invite} other {Add}} teammate to {productName}',
    description: 'Title of the invite teammate item in typeahead plugin',
  },
});
