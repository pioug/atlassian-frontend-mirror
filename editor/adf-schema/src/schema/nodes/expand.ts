import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { BreakoutMarkDefinition } from '../marks';
import type { MarksObject, NoMark } from './types/mark';
import type { NonNestableBlockContent } from './types/non-nestable-block-content';
import type { ExpandNode } from '../../next-schema/generated/nodeTypes';
import { expand as expandFactory } from '../../next-schema/generated/nodeTypes';
import type { NodeSpecOptions } from '../createPMSpecFactory';
import type { NestedExpandDefinition } from './nested-expand';
import { uuid } from '../../utils/uuid';

/**
 * @name expand_node
 */
export interface ExpandBaseDefinition {
	attrs: {
		__expanded?: boolean;
		localId?: string;
		title?: string;
	};
	/**
	 * @minItems 1
	 * @allowUnsupportedBlock true
	 */
	content: Array<NonNestableBlockContent | NestedExpandDefinition>;
	type: 'expand';
}

/**
 * @name expand_with_no_mark_node
 */
export type ExpandDefinition = ExpandBaseDefinition & NoMark;

/**
 * @name expand_root_only_node
 */
export type ExpandRootOnlyDefinition = ExpandBaseDefinition & MarksObject<BreakoutMarkDefinition>;

function getExpandAttrs(domNode: Node | string) {
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	const dom = domNode as HTMLElement;
	return {
		title: dom.getAttribute('data-title'),
		__expanded: true,
	};
}

const nodeSpecOptions: NodeSpecOptions<ExpandNode> = {
	parseDOM: [
		{
			context: 'table//',
			tag: 'div[data-node-type="expand"]',
			getAttrs: getExpandAttrs,
		},
		{
			context: 'expand//',
			tag: '[data-node-type="expand"]',
			getAttrs: getExpandAttrs,
		},
		{
			context: 'nestedExpand//',
			tag: '[data-node-type="expand"]',
			getAttrs: getExpandAttrs,
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
			tag: 'div[data-node-type="expand"]',
			getAttrs: getExpandAttrs,
		},
	],
	toDOM(node) {
		const attrs = {
			'data-node-type': 'expand',
			'data-title': node.attrs.title,
			'data-expanded': node.attrs.__expanded,
		};
		return ['div', attrs, 0];
	},
};

export const expandWithNestedExpand = expandFactory(nodeSpecOptions);

export const expandWithNestedExpandLocalId = expandFactory({
	parseDOM: [
		{
			context: 'table//',
			tag: 'div[data-node-type="expand"]',
			getAttrs: (dom) => {
				const attrs = getExpandAttrs(dom);
				return {
					...attrs,
					localId: uuid.generate(),
				};
			},
		},
		{
			context: 'expand//',
			tag: '[data-node-type="expand"]',
			getAttrs: (dom) => {
				const attrs = getExpandAttrs(dom);
				return {
					...attrs,
					localId: uuid.generate(),
				};
			},
		},
		{
			context: 'nestedExpand//',
			tag: '[data-node-type="expand"]',
			getAttrs: (dom) => {
				const attrs = getExpandAttrs(dom);
				return {
					...attrs,
					localId: uuid.generate(),
				};
			},
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
			tag: 'div[data-node-type="expand"]',
			getAttrs: (dom) => {
				const attrs = getExpandAttrs(dom);
				return {
					...attrs,
					localId: uuid.generate(),
				};
			},
		},
	],
	toDOM(node) {
		const attrs = {
			'data-node-type': 'expand',
			'data-title': node.attrs.title,
			'data-expanded': node.attrs.__expanded,
			'data-local-id': node?.attrs?.localId || undefined,
		};
		return ['div', attrs, 0];
	},
});

export const toJSON = (node: PMNode) => ({
	attrs: Object.keys(node.attrs)
		.filter((key) => !key.startsWith('__'))
		.reduce<typeof node.attrs>((obj, key) => {
			return {
				...obj,
				[key]: node.attrs[key],
			};
		}, {}),
});
