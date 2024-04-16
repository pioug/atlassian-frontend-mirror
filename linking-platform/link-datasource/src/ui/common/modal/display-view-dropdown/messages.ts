import { defineMessages } from 'react-intl-next';

export const displayViewDropDownMessages = defineMessages({
  // TODO EDM-9573
  // remove duplicate from end of key once EDM-9431 is merged
  tableViewModeLabelDuplicate: {
    id: 'linkDataSource.configmodal.tableViewModeLabel',
    description: 'Display search results as a table',
    defaultMessage: 'Table',
  },
  // remove duplicate from end of key once EDM-9431 is merged
  tableViewModeDescriptionDuplicate: {
    id: 'linkDataSource.configmodal.tableViewModeDescription',
    description: 'Description for table view mode',
    defaultMessage: 'Display search results as a table',
  },
  // remove duplicate from end of key once EDM-9431 is merged
  inlineLinkViewModeLabelDuplicate: {
    id: 'linkDataSource.configmodal.inlineLinkViewModeLabel',
    description: 'Display the number of search results as an inline smart link',
    defaultMessage: 'Inline link',
  },
  // remove duplicate from end of key once EDM-9431 is merged
  inlineLinkViewModeDescriptionDuplicate: {
    id: 'linkDataSource.configmodal.inlineLinkViewModeDescription',
    description: 'Description for inline view mode',
    defaultMessage:
      'Display the number of search results or as an inline smart link',
  },
  // delete once EDM-9431 is merged
  tableViewModeLabel: {
    id: 'linkDataSource.jira-issues.configmodal.tableViewModeLabel',
    description: 'Display Jira search results as a table',
    defaultMessage: 'Table',
  },
  // delete once EDM-9431 is merged
  tableViewModeDescription: {
    id: 'linkDataSource.jira-issues.configmodal.tableViewModeDescription',
    description: 'Description for table view mode',
    defaultMessage: 'Display Jira search results as a table',
  },
  // delete once EDM-9431 is merged
  inlineLinkViewModeLabel: {
    id: 'linkDataSource.jira-issues.configmodal.inlineLinkViewModeLabel',
    description: 'Display the number of search results as an inline smart link',
    defaultMessage: 'Inline link',
  },
  // delete once EDM-9431 is merged
  inlineLinkViewModeDescription: {
    id: 'linkDataSource.jira-issues.configmodal.inlineLinkViewModeDescription',
    description: 'Description for inline link view mode',
    defaultMessage:
      'Display the number of search results or as an inline smart link',
  },
});
