import { defineMessages } from 'react-intl-next';

export const codeBidiWarningMessages = defineMessages({
  /**
   * Message taken from
   * https://hello.atlassian.net/wiki/spaces/~tswan/pages/1366555782/PSHELP-2943+Investigate+Trojan+Source+Attack+Vulnerability+design
   */
  label: {
    id: 'fabric.editor.codeBidiWarningLabel',
    defaultMessage:
      'Bidirectional characters change the order that text is rendered. This could be used to obscure malicious code.',
    description:
      'Tooltip message to present to users when a bidirectional character is encountered in code.',
  },
});
