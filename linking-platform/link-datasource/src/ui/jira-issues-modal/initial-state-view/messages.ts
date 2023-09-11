import { defineMessages } from 'react-intl-next';

export const initialStateViewMessages = defineMessages({
  searchTitle: {
    id: 'linkDataSource.modal-initial-state.searchTitle',
    description:
      'The initial modal search state title that gives the user some idea about how to get information',
    defaultMessage: 'Search for Jira issues',
  },
  searchDescription: {
    id: 'linkDataSource.modal-initial-state.searchDescription',
    description:
      'The initial modal search state helper message displayed under the search title',
    defaultMessage: 'Start typing or use JQL to search.',
  },
  learnMoreLink: {
    id: 'linkDataSource.modal-initial-state.learnMoreLink',
    description:
      'The link that displays under the search description to help people know more about JQL',
    defaultMessage: 'Learn more about searching with JQL.',
  },
});
