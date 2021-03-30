import { defineMessages } from 'react-intl';

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
  subscript: {
    id: 'fabric.editor.subscript',
    defaultMessage: 'Subscript',
    description:
      'Whether the text selection is written below the line in a slightly smaller size',
  },
  superscript: {
    id: 'fabric.editor.superscript',
    defaultMessage: 'Superscript',
    description:
      'Whether the text selection is written above the line in a slightly smaller size',
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
});
