import type { MarkSpec } from '@atlaskit/editor-prosemirror/model';
import { confluenceInlineComment as confluenceInlineCommentFactory } from '../../next-schema/generated/markTypes';

/**
 * @name inline_comment_marker
 * @description This temporary mark represents a Confluence-backed inline comment that wraps a piece of text. It will be replaced with a cross-product inline comment solution at later date.
 */
export interface ConfluenceInlineCommentDefinition {
	attrs: {
		reference: string;
	};
	type: 'confluenceInlineComment';
}

export const confluenceInlineComment: MarkSpec = confluenceInlineCommentFactory({
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
});
