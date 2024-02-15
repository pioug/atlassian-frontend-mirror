import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
  deprecatedFieldTooltipDefaultMessage: {
    id: 'jql-editor.plugins.autocomplete.autocomplete-option.deprecated-tooltip.default',
    defaultMessage:
      'This field has been deprecated and may stop working in the future.',
    description: 'Default tooltip message for a deprecated field.',
  },
  deprecatedFieldTooltipParentReplacementMessage: {
    id: 'jql-editor.plugins.autocomplete.autocomplete-option.deprecated-tooltip.epic-link',
    defaultMessage:
      "<b>''{received}''</b> will soon be replaced with <b>''{parentReplacement}''</b>. Use the <b>''{parentReplacement}''</b> field instead.",
    description:
      'Tooltip message served to user when there is a deprecated field',
  },
});
