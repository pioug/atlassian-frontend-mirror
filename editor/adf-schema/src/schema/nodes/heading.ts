import type { AlignmentMarkDefinition, IndentationMarkDefinition } from '../marks';
import type { MarksObject, NoMark } from './types/mark';
import type { Inline } from './types/inline-content';
import { heading as headingFactory } from '../../next-schema/generated/nodeTypes';
import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

/**
 * @name heading_node
 */
export interface HeadingBaseDefinition {
	attrs: {
		/**
		 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
		 * @minimum 1
		 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
		 * @maximum 6
		 */
		level: number;
		/**
		 * An optional UUID for unique identification of the node
		 */
		localId?: string;
	};
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @allowUnsupportedInline true
	 */
	content?: Array<Inline>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	marks?: Array<any>;
	type: 'heading';
}

/**
 * @name heading_with_no_marks_node
 */
export type HeadingDefinition = HeadingBaseDefinition & NoMark;

// Check `paragraph` node for why we are doing things like this
/**
 * @name heading_with_alignment_node
 */
export type HeadingWithAlignmentDefinition = HeadingBaseDefinition &
	MarksObject<AlignmentMarkDefinition>;

/**
 * @name heading_with_indentation_node
 */
export type HeadingWithIndentationDefinition = HeadingBaseDefinition &
	MarksObject<IndentationMarkDefinition>;

export type HeadingWithMarksDefinition =
	| HeadingWithAlignmentDefinition
	| HeadingWithIndentationDefinition;

const getAttrs = (level: number) => (domNode: string | HTMLElement) => ({
	level,
	localId:
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		(domNode as HTMLElement).getAttribute('data-local-id') || null,
});

export const heading: NodeSpec = headingFactory({
	parseDOM: [
		{ tag: 'h1', getAttrs: getAttrs(1) },
		{ tag: 'h2', getAttrs: getAttrs(2) },
		{ tag: 'h3', getAttrs: getAttrs(3) },
		{ tag: 'h4', getAttrs: getAttrs(4) },
		{ tag: 'h5', getAttrs: getAttrs(5) },
		{ tag: 'h6', getAttrs: getAttrs(6) },
	],
	toDOM(node) {
		const { level, localId } = node.attrs;
		const name = 'h' + level;
		const attrs = localId !== undefined && localId !== null ? [{ 'data-local-id': localId }] : [];
		return [name, ...attrs, 0];
	},
});
