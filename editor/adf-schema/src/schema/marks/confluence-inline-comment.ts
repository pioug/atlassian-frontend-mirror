import { MarkSpec } from 'prosemirror-model';

/**
 * @name inline_comment_marker
 * @description This temporary mark represents a Confluence-backed inline comment that wraps a piece of text. It will be replaced with a cross-product inline comment solution at later date.
 */
export interface ConfluenceInlineCommentDefinition {
  type: 'confluenceInlineComment';
  attrs: {
    reference: string;
  };
}

export const confluenceInlineComment: MarkSpec = {
  inclusive: false,
  excludes: '',
  attrs: {
    reference: {
      default: '',
    },
  },
  parseDOM: [{ tag: 'span[data-mark-type="confluenceInlineComment"]' }],
  toDOM(node) {
    return [
      'span',
      {
        'data-mark-type': 'confluenceInlineComment',
        'data-reference': node.attrs.reference,
      },
    ];
  },
};
