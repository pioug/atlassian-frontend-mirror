import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
  datasourceJiraIssue: {
    id: 'fabric.editor.datasource.jiraIssue',
    defaultMessage: 'Jira Issues',
    description: 'Insert a jira datasource table',
  },
  datasourceJiraIssueDescription: {
    id: 'fabric.editor.datasource.jiraIssue.description',
    defaultMessage:
      'Insert Jira issues from Jira Cloud with enhanced search, filtering, and configuration.',
    description: 'Insert a jira datasource table',
  },
  datasourceAssetsObjects: {
    id: 'fabric.editor.datasource.assetsObjects',
    defaultMessage: 'Assets (Beta)',
    description:
      'Text displayed when selecting the type of data to include onto the page, in this case: JSM Assets objects. This feature is currently in Beta release, so we also include messaging for that.',
  },
  datasourceAssetsObjectsDescription: {
    id: 'fabric.editor.datasource.assetsObjects.description',
    defaultMessage:
      'Insert objects from Assets in Jira Service Management with search and filtering',
    description:
      'Description text displayed when selecting the type of data to include onto the page, in this case: JSM Assets objects',
  },
  inlineOverlay: {
    id: 'fabric.editor.inlineOverlay',
    defaultMessage: 'Change view',
    description:
      'An overlay shown when hover over inline smart link to inform user that they can change link view to card and/or embed.',
  },
});
