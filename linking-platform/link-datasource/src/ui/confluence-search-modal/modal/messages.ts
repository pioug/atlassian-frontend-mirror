import { defineMessages } from 'react-intl-next';

export const confluenceSearchModalMessages = defineMessages({
  cancelButtonText: {
    id: 'linkDataSource.confluence-search.configmodal.cancelButtonText',
    description: 'Button text to close the modal with no changes being made',
    defaultMessage: 'Cancel',
  },
  insertResultsButtonText: {
    id: 'linkDataSource.confluence-search.configmodal.insertResultsButtonText',
    description: 'Button text to insert the displayed content',
    defaultMessage: 'Insert results',
  },
  searchLabel: {
    id: 'linkDataSource.confluence-search.configmodal.searchLabel',
    description: 'Placeholder text for the search input box',
    defaultMessage: 'Enter keywords to find pages, attachments, and more',
  },
  insertIssuesTitle: {
    id: 'linkDataSource.confluence-search.configmodal.insertConfluenceTitle',
    description:
      'Title for the Confluence Search Datasource Confluence Search config modal',
    defaultMessage: 'Insert Confluence list',
  },
  insertIssuesTitleManySites: {
    id: 'linkDataSource.confluence-search.configmodal.insertConfluenceTitleManySites',
    description:
      'Title for the Confluence Search config modal when a user has to select a site to insert issues from',
    defaultMessage: 'Insert Confluence list from',
  },
  initialViewSearchTitle: {
    id: 'linkDataSource.modal-initial-state.confluenceSearchTitle',
    description:
      'The initial modal search state title explains to user how to get information',
    defaultMessage: 'Search for Confluence pages',
  },
  initialViewSearchDescription: {
    id: 'linkDataSource.modal-initial-state.searchDescription-confluence',
    description:
      'The initial modal search state helper message for confluence search displayed under the search title',
    defaultMessage: 'Search by keyword for pages to insert.',
  },
  noAccessToConfluenceSitesTitle: {
    id: 'linkDataSource.confluence-search.no.confluence.sites.access.title',
    description:
      'Title that shows in the modal when user has no access to any Confluence sites',
    defaultMessage: "You don't have access to any Confluence sites",
  },
  noAccessToConfluenceSitesDescription: {
    id: 'linkDataSource.confluence-search.no.confluence.sites.access.description',
    description:
      'Description that shows in the modal when user has no access to any Confluence sites',
    defaultMessage: 'To request access, contact your admin.',
  },
});
