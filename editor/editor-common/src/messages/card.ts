import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
  url: {
    id: 'fabric.editor.url',
    defaultMessage: 'Display URL',
    description: 'Convert the card to become a regular text-based hyperlink.',
  },
  block: {
    id: 'fabric.editor.displayBlock',
    defaultMessage: 'Display card',
    description:
      'Display link as a card with a rich preview similar to in a Facebook feed with page title, description, and potentially an image.',
  },
  inline: {
    id: 'fabric.editor.displayInline',
    defaultMessage: 'Display inline',
    description: 'Display link with the title only.',
  },
  embed: {
    id: 'fabric.editor.displayEmbed',
    defaultMessage: 'Display embed',
    description: 'Display link as an embedded object',
  },
  link: {
    id: 'fabric.editor.displayLink',
    defaultMessage: 'Display as text',
    description: 'Convert the card to become a regular text-based hyperlink.',
  },
  card: {
    id: 'fabric.editor.cardFloatingControls',
    defaultMessage: 'Card options',
    description: 'Options to change card type',
  },
  blockCardUnavailable: {
    id: 'fabric.editor.blockCardUnavailable',
    defaultMessage:
      'The inline link is inside {node} and cannot have its view changed',
    description:
      'Warning message to show the user that this node cannot change its view',
  },
  displayOptionUnavailableInParentNode: {
    id: 'fabric.editor.displayOptionUnavailableInParentNode',
    defaultMessage: "This display option isn't available inside {node}",
    description:
      'Warning message to show the user that this node option is not available inside a parent node type',
  },
  urlTitle: {
    id: 'fabric.editor.urlTitle',
    defaultMessage: 'URL',
    description:
      'Title for option to convert the card to become a regular text-based hyperlink.',
  },
  blockTitle: {
    id: 'fabric.editor.blockTitle',
    defaultMessage: 'Card',
    description: 'Title for option to display link in the card view.',
  },
  inlineTitle: {
    id: 'fabric.editor.inlineTitle',
    defaultMessage: 'Inline',
    description: 'Title for option to display link in the inline view.',
  },
  embedTitle: {
    id: 'fabric.editor.embedTitle',
    defaultMessage: 'Embed',
    description: 'Title for option to display link as an embedded object.',
  },
  urlDescription: {
    id: 'fabric.editor.urlDescription',
    defaultMessage: 'Display link as URL',
    description:
      'Description for option to convert the card to become a regular text-based hyperlink.',
  },
  blockDescription: {
    id: 'fabric.editor.blockDescription',
    defaultMessage:
      'Display more information about a link, including a summary and actions',
    description: 'Description for option to display link in the card view.',
  },
  inlineDescription: {
    id: 'fabric.editor.inlineDescription',
    defaultMessage: 'Display link as inline text',
    description: 'Description for option to display link in the inline view.',
  },
  embedDescription: {
    id: 'fabric.editor.ecombedDescription',
    defaultMessage: 'Display an interactive preview of a link',
    description:
      'Description for option to display link as an embedded object.',
  },
  datasourceTitle: {
    id: 'fabric.editor.datasourceTitle',
    defaultMessage: 'Edit search query',
    description: 'Tooltip of button to edit a card into a datasource',
  },
  datasourceAppearanceTitle: {
    id: 'fabric.editor.datasourceAppearanceTitle',
    defaultMessage: 'Table',
    description: 'Tooltip of button to change to datasource table appearance',
  },
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
    defaultMessage: 'Configure',
    description:
      'An overlay shown when hover over inline smart link to inform user that they can click the link to edit the links appearance.',
  },
});
