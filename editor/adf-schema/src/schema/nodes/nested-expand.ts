import type { NoMark } from './types/mark';
import type { ParagraphDefinition as Paragraph } from './paragraph';
import type { HeadingDefinition as Heading } from './heading';
import type { MediaSingleDefinition as MediaSingle } from './media-single';
import type { MediaGroupDefinition as MediaGroup } from './media-group';
import type { CodeBlockDefinition as CodeBlock } from './code-block';
import type {
	BulletListDefinition as BulletList,
	OrderedListDefinition as OrderedList,
} from './types/list';
import type { TaskListDefinition as TaskList } from './task-list';
import type { DecisionListDefinition as DecisionList } from './decision-list';
import type { RuleDefinition as Rule } from './rule';
import type { PanelDefinition as Panel } from './panel';
import type { BlockQuoteDefinition as BlockQuote } from './blockquote';
import type { NestedExpandNode } from '../../next-schema/generated/nodeTypes';
import { nestedExpand as nestedExpandFactory } from '../../next-schema/generated/nodeTypes';
import type { NodeSpecOptions } from '../createPMSpecFactory';
import { uuid } from '../../utils/uuid';
import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

/**
 * @name nestedExpand_content
 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
 * @minItems 1
 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
 * @allowUnsupportedBlock true
 */
export type NestedExpandContent = Array<
	| Paragraph
	| Heading
	| MediaSingle
	| MediaGroup
	| CodeBlock
	| BulletList
	| OrderedList
	| TaskList
	| DecisionList
	| Rule
	| Panel
	| BlockQuote
>;

/**
 * @name nestedExpand_node
 */
export interface NestedExpandBaseDefinition {
	attrs: {
		__expanded?: boolean;
		localId?: string;
		title?: string;
	};
	content: NestedExpandContent;
	type: 'nestedExpand';
}

/**
 * @name nestedExpand_with_no_marks_node
 */
export type NestedExpandDefinition = NestedExpandBaseDefinition & NoMark;

function getExpandAttrs(domNode: Node | string, generateLocalId: boolean) {
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	const dom = domNode as HTMLElement;
	return {
		title: dom.getAttribute('data-title'),
		__expanded: true,
		localId: generateLocalId ? uuid.generate() : undefined,
	} as NestedExpandBaseDefinition['attrs'];
}

const nestedExpandFactoryOptions: NodeSpecOptions<NestedExpandNode> = {
	parseDOM: [
		{
			context: 'nestedExpand//',
			tag: '[data-node-type="nestedExpand"]',
			getAttrs: (domNode) => getExpandAttrs(domNode, false),
		},
		{
			tag: '[data-node-type="nestedExpand"] button',
			ignore: true,
		},
		{
			tag: '[data-node-type="expand"] button',
			ignore: true,
		},
		{
			tag: 'div[data-node-type="nestedExpand"]',
			getAttrs: (domNode) => getExpandAttrs(domNode, false),
		},
	],
	toDOM(node) {
		const attrs = {
			'data-node-type': 'nestedExpand',
			'data-title': node.attrs.title,
			'data-expanded': node.attrs.__expanded,
			'data-local-id': node?.attrs?.localId || undefined,
		};
		return ['div', attrs, 0];
	},
};

/**
 * @name nestedExpand
 * @description an expand that can be nested (eg. inside table, layout).
 */
export const nestedExpand: NodeSpec = nestedExpandFactory(
	nestedExpandFactoryOptions,
);

export const nestedExpandWithLocalId: NodeSpec = nestedExpandFactory({
	...nestedExpandFactoryOptions,
	parseDOM: [
		...(nestedExpandFactoryOptions.parseDOM || []),
		{
			context: 'nestedExpand//',
			tag: '[data-node-type="nestedExpand"]',
			getAttrs: (domNode) => getExpandAttrs(domNode, true),
		},
		{
			tag: '[data-node-type="nestedExpand"]',
			getAttrs: (domNode) => getExpandAttrs(domNode, true),
		},
	],
});
