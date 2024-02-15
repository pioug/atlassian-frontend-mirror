import { defineMessages } from 'react-intl-next';

export const codeBlockButtonMessages = defineMessages({
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
  wrapCode: {
    id: 'fabric.editor.codeBlockWrapButton.wrapCodeBlock',
    defaultMessage: 'Turn on wrap',
    description: 'Wrap the content of the code block',
  },
  unwrapCode: {
    id: 'fabric.editor.codeBlockWrapButton.unwrapCodeBlock',
    defaultMessage: 'Turn off wrap',
    description: 'Wrap the content of the code block',
  },
  selectLanguage: {
    id: 'fabric.editor.selectLanguage',
    defaultMessage: 'Select language',
    description:
      'Code blocks display software code. A prompt to select the software language the code is written in.',
  },
});
