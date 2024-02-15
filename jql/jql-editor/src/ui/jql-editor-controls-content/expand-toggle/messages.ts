import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
  buttonLabel: {
    id: 'jql-editor.ui.jql-editor-controls-content.expand-toggle.button-label',
    defaultMessage: 'Editor',
    description:
      'Label that tells the user the expand toggle is controlling the JQL editor.',
  },
  expandTooltip: {
    id: 'jql-editor.ui.jql-editor-controls-content.expand-toggle.expand-tooltip',
    defaultMessage: 'Expand editor',
    description:
      'Tooltip to show for the expand icon which increases the height of the editor',
  },
  collapseTooltip: {
    id: 'jql-editor.ui.jql-editor-controls-content.expand-toggle.collapse-tooltip',
    defaultMessage: 'Collapse editor',
    description:
      'Tooltip to show for the collapse icon which shrinks the height of the editor',
  },
});
