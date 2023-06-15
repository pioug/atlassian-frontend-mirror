import { defineMessages } from 'react-intl-next';

export default defineMessages({
  heading: {
    id: 'link-create.unknown-error.heading',
    defaultMessage: 'Something went wrong',
    description: 'Heading when an unknown error occurs',
  },
  description: {
    id: 'link-create.unknown-error.description',
    defaultMessage:
      'Refresh the page, or contact <a>Atlassian Support</a> if this keeps happening.',
    description: 'Description when an unknown error occurs',
  },
});
