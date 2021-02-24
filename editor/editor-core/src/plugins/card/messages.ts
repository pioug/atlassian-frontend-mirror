import { defineMessages } from 'react-intl';

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
});
