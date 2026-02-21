import type { LayoutColumnDefinition } from './layout-column';
import type { BreakoutMarkDefinition } from '../marks';
import {
	layoutSection as layoutSectionFactory,
	layoutSectionWithSingleColumnStage0 as layoutSectionWithSingleColumnStage0Factory,
	layoutSectionFull as layoutSectionFullFactory,
} from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils/uuid';
import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

/**
 * @name layoutSection_node
 */
export type LayoutSectionBaseDefinition = {
	attrs?: {
		localId?: string;
	};
	// Can't use Array<any> because `prosemirror-schema-compatibility-tests` can't handle it.
	content: Array<LayoutColumnDefinition>;
	marks?: Array<BreakoutMarkDefinition>;
	type: 'layoutSection';
};

/**
 * Need duplicate `type` and `marks` to make both validator and json-schema satisfied
 */

/**
 * @name layoutSection_full_node
 */
export type LayoutSectionFullDefinition = LayoutSectionBaseDefinition & {
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @minItems 2
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @maxItems 3
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @allowUnsupportedBlock true
	 */
	content: Array<LayoutColumnDefinition>;
	marks?: Array<BreakoutMarkDefinition>;
	type: 'layoutSection';
};

/**
 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
 * @stage 0
 * @name layoutSection_with_single_column_node
 */
export type LayoutSectionWithSingleColumnDefinition = LayoutSectionBaseDefinition & {
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @minItems 1
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @maxItems 3
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @allowUnsupportedBlock true
	 */
	content: Array<LayoutColumnDefinition>;
	marks?: Array<BreakoutMarkDefinition>;
	type: 'layoutSection';
};

export type LayoutSectionDefinition =
	| LayoutSectionFullDefinition
	| LayoutSectionWithSingleColumnDefinition;

export const layoutSection: NodeSpec = layoutSectionFactory({
	parseDOM: [
		{
			context: 'layoutSection//|layoutColumn//',
			tag: 'div[data-layout-section]',
			skip: true,
		},
		{
			tag: 'div[data-layout-section]',
		},
	],
	toDOM() {
		const attrs = { 'data-layout-section': 'true' };
		return ['div', attrs, 0];
	},
});

export const layoutSectionFull: NodeSpec = layoutSectionFullFactory({
	parseDOM: [
		{
			context: 'layoutSection//|layoutColumn//',
			tag: 'div[data-layout-section]',
			skip: true,
		},
		{
			tag: 'div[data-layout-section]',
		},
	],
	toDOM() {
		const attrs = { 'data-layout-section': 'true' };
		return ['div', attrs, 0];
	},
});

// stage-0 support for columnRuleStyle attribute and 1-5 columns
export const layoutSectionWithSingleColumn: NodeSpec = layoutSectionWithSingleColumnStage0Factory({
	parseDOM: [
		{
			context: 'layoutSection//|layoutColumn//',
			tag: 'div[data-layout-section]',
			skip: true,
		},
		{
			tag: 'div[data-layout-section]',
			getAttrs: (dom) => {
				const columnRuleStyle = dom.getAttribute('data-column-rule-style');
				return columnRuleStyle ? { columnRuleStyle } : {};
			},
		},
	],
	toDOM(node) {
		const { columnRuleStyle } = node.attrs;
		const attrs = {
			'data-layout-section': 'true',
			'data-column-rule-style': columnRuleStyle || undefined,
		};
		return ['div', attrs, 0];
	},
});

export const layoutSectionWithLocalId: NodeSpec = layoutSectionFactory({
	parseDOM: [
		{
			context: 'layoutSection//|layoutColumn//',
			tag: 'div[data-layout-section]',
			skip: true,
		},
		{
			tag: 'div[data-layout-section]',
			getAttrs: () => {
				const localId = uuid.generate();
				return { localId };
			},
		},
	],
	toDOM(node) {
		const { localId } = node.attrs;
		const attrs = { 'data-layout-section': 'true', 'data-local-id': localId };
		return ['div', attrs, 0];
	},
});

export const layoutSectionWithSingleColumnLocalId: NodeSpec =
	layoutSectionWithSingleColumnStage0Factory({
		parseDOM: [
			{
				context: 'layoutSection//|layoutColumn//',
				tag: 'div[data-layout-section]',
				skip: true,
			},
			{
				tag: 'div[data-layout-section]',
				getAttrs: (dom) => {
					const columnRuleStyle = dom.getAttribute('data-column-rule-style');
					const localId = uuid.generate();
					return columnRuleStyle ? { columnRuleStyle, localId } : { localId };
				},
			},
		],
		toDOM(node) {
			const { columnRuleStyle } = node.attrs;
			const attrs = {
				'data-layout-section': 'true',
				'data-column-rule-style': columnRuleStyle || undefined,
				'data-local-id': node?.attrs?.localId || undefined,
			};
			return ['div', attrs, 0];
		},
	});
