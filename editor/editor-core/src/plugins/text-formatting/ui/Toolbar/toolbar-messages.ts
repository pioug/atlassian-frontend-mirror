import { defineMessages } from 'react-intl-next';

export const toolbarMessages = defineMessages({
  underline: {
    id: 'fabric.editor.underline',
    defaultMessage: 'Underline',
    description: 'Whether the text selection has underlined text',
  },
  strike: {
    id: 'fabric.editor.strike',
    defaultMessage: 'Strikethrough',
    description: 'Whether the text selection has crossed out text',
  },
  code: {
    id: 'fabric.editor.code',
    defaultMessage: 'Code',
    description: 'Whether the text selection has monospaced/code font',
  },
  codeOn: {
    id: 'fabric.editor.code.on',
    defaultMessage: '{textFormattingOff}, Code On',
    description: 'Reports that code formatting has been turned on',
  },
  subscript: {
    id: 'fabric.editor.subscript',
    defaultMessage: 'Subscript',
    description:
      'Whether the text selection is written below the line in a slightly smaller size',
  },
  subscriptOffSuperscriptOn: {
    id: 'fabric.editor.subscript.off.superscript.on',
    defaultMessage: 'Subscript Off, Superscript On',
    description:
      'Reports text formatting in case when subscript off and superscript on',
  },
  superscript: {
    id: 'fabric.editor.superscript',
    defaultMessage: 'Superscript',
    description:
      'Whether the text selection is written above the line in a slightly smaller size',
  },
  superscriptOffSubscriptOn: {
    id: 'fabric.editor.superscript.off.subscript.on',
    defaultMessage: 'Superscript Off, Subscript On',
    description:
      'Describe text formatting in case when Superscript Off and Subscript on',
  },
  clearFormatting: {
    id: 'fabric.editor.clearFormatting',
    defaultMessage: 'Clear formatting',
    description: 'Remove all rich text formatting from the selected text',
  },
  moreFormatting: {
    id: 'fabric.editor.moreFormatting',
    defaultMessage: 'More formatting',
    description:
      'Clicking this will show a menu with additional formatting options',
  },
  bold: {
    id: 'fabric.editor.bold',
    defaultMessage: 'Bold',
    description:
      'This refers to bold or “strong” formatting, indicates that its contents have strong importance, seriousness, or urgency.',
  },
  italic: {
    id: 'fabric.editor.italic',
    defaultMessage: 'Italic',
    description: 'This refers to italics or emphasized formatting.',
  },
  on: {
    id: 'fabric.editor.on',
    defaultMessage: '{formattingType} On',
    description: 'Reports that text formatting has been turned on',
  },
  off: {
    id: 'fabric.editor.off',
    defaultMessage: '{formattingType} Off',
    description: 'Reports that text formatting has been turned off',
  },
  textFormattingOff: {
    id: 'fabric.editor.text.formatting.off',
    defaultMessage: 'Text formatting Off',
    description: 'Reports that text formatting has been turned off',
  },
});
