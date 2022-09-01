import { defineMessages } from 'react-intl-next';

export const codeBlockCopyButtonMessages = defineMessages({
  copyCodeToClipboard: {
    id: 'fabric.editor.codeBlockCopyButton.copyToClipboard',
    defaultMessage: 'Copy as text',
    description: 'Copy the content of the code block as text to your clipboard',
  },
  copiedCodeToClipboard: {
    id: 'fabric.editor.codeBlockCopyButton.copiedToClipboard',
    defaultMessage: 'Copied!',
    description: 'Copied the content of the code block as text to clipboard',
  },
});
