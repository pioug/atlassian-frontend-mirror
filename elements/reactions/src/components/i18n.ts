import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
  loadingReactions: {
    id: 'fabric.reactions.loading',
    defaultMessage: 'Loading...',
    description: 'Message while reactions are being loaded',
  },
  moreEmoji: {
    id: 'fabric.reactions.more.emoji',
    defaultMessage: 'More emoji',
    description:
      'Tooltip of the "show more" button in the quick reaction selector. The full emoji selector is displayed when the user clicks on it.',
  },
  unexpectedError: {
    id: 'fabric.reactions.error.unexpected',
    defaultMessage: 'Something went wrong',
    description: 'Unexpected error message',
  },
  otherUsers: {
    id: 'fabric.reactions.other.reacted.users',
    defaultMessage:
      '{count, plural, one {and one other} other {and {count} others}}',
    description:
      "The number of users that have reacted similarly, but aren't shown",
  },
});
