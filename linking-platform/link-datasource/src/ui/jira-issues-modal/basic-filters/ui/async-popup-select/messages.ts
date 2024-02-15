import { defineMessages } from 'react-intl-next';

export const asyncPopupSelectMessages = defineMessages({
  selectPlaceholder: {
    id: 'linkDataSource.basic-filter.dropdown.select.placeholder',
    description: 'Placeholder text to be displayed for the search input box.',
    defaultMessage: 'Search',
  },
  paginationDetails: {
    id: 'linkDataSource.basic-filter.footer.pagination-details',
    description: 'Text to indicate page count and total count information.',
    defaultMessage: '{currentDisplayCount} of {totalCount}',
  },
  projectLabel: {
    id: 'linkDataSource.basic-filter.project.label',
    description: 'Label to be displayed for project filter dropdown button.',
    defaultMessage: 'Project',
  },
  statusLabel: {
    id: 'linkDataSource.basic-filter.status.label',
    description: 'Label to be displayed for status filter dropdown button.',
    defaultMessage: 'Status',
  },
  typeLabel: {
    id: 'linkDataSource.basic-filter.type.label',
    description: 'Label to be displayed for type filter dropdown button.',
    defaultMessage: 'Type',
  },
  assigneeLabel: {
    id: 'linkDataSource.basic-filter.assignee.label',
    description: 'Label to be displayed for assignee filter dropdown button.',
    defaultMessage: 'Assignee',
  },
  showMoreMessage: {
    id: 'linkDataSource.basic-filter.showMoreButton',
    defaultMessage: 'Show more',
    description: 'The text to show more options in dropdown',
  },
});
