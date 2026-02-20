import type {
	AlignmentMarkDefinition,
	IndentationMarkDefinition,
} from '../marks';
import type { MarksObject, NoMark } from './types/mark';
import type { Inline } from './types/inline-content';
import { paragraph as paragraphFactory } from '../../next-schema/generated/nodeTypes';
import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

export interface ParagraphAttributes {
	/**
	 * An optional UUID for unique identification of the node
	 */
	localId?: string;
}

/**
 * @name paragraph_node
 */
export interface ParagraphBaseDefinition {
	attrs?: ParagraphAttributes;
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @allowUnsupportedInline true
	 */
	content?: Array<Inline>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	marks?: Array<any>;
	type: 'paragraph';
}

/**
 * @name paragraph_with_no_marks_node
 */
export type ParagraphDefinition = ParagraphBaseDefinition & NoMark;

/**
 * NOTE: Need this because TS is too smart and inline everything.
 * So we need to give them separate identity.
 * Probably there's a way to solve it but that will need time and exploration.
 * // http://bit.ly/2raXFX5
 * type T1 = X | Y
 * type T2 = A | T1 | B // T2 = A | X | Y | B
 */

/**
 * @name paragraph_with_alignment_node
 */
export type ParagraphWithAlignmentDefinition = ParagraphBaseDefinition &
	MarksObject<AlignmentMarkDefinition>;

/**
 * @name paragraph_with_indentation_node
 */
export type ParagraphWithIndentationDefinition = ParagraphBaseDefinition &
	MarksObject<IndentationMarkDefinition>;

export type ParagraphWithMarksDefinition =
	| ParagraphWithAlignmentDefinition
	| ParagraphWithIndentationDefinition;

export const paragraph: NodeSpec = paragraphFactory({
	parseDOM: [
		{
			tag: 'p',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				const attrs: ParagraphAttributes = {
					localId:
						dom.getAttribute('data-local-id') ||
						paragraph.attrs?.localId?.default,
				};
				return attrs;
			},
		},
	],
	toDOM(node) {
		const { localId } = node.attrs;
		const name = 'p';
		const attrs =
			localId !== undefined && localId !== null
				? [{ 'data-local-id': localId }]
				: [];
		return [name, ...attrs, 0];
	},
});
