import type { DOMOutputSpec, NodeSpec } from '@atlaskit/editor-prosemirror/model';
import type { BreakoutMarkDefinition } from '../marks';
import type { MarksObject } from './types/mark';
import { rule as ruleFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils/uuid';

export type RuleStyle = 'solid' | 'dashed' | 'dotted' | 'sketch' | 'fade';

export interface RuleAttributes {
	color?: string;
	localId?: string;
	style?: RuleStyle;
	weight?: number;
}

/**
 * @name rule_node
 */
export interface RuleDefinition {
	attrs?: { localId?: string };
	type: 'rule';
}

/**
 * @name rule_root_only_node
 */
export type RuleRootOnlyDefinition = RuleDefinition & MarksObject<BreakoutMarkDefinition>;

/**
 * @name rule_with_attrs_node
 */
export interface RuleWithAttrsDefinition {
	attrs?: RuleAttributes;
	type: 'rule';
}

/**
 * @name rule_with_attrs_root_only_node
 */
export type RuleWithAttrsRootOnlyDefinition = RuleWithAttrsDefinition &
	MarksObject<BreakoutMarkDefinition>;

const hrDOM: DOMOutputSpec = ['hr'];
export const rule: NodeSpec = ruleFactory({
	parseDOM: [{ tag: 'hr' }],
	toDOM() {
		return hrDOM;
	},
});

export const ruleWithLocalId: NodeSpec = ruleFactory({
	parseDOM: [{ tag: 'hr', getAttrs: () => ({ localId: uuid.generate() }) }],
	toDOM(node) {
		return ['hr', { 'data-local-id': node?.attrs?.localId || undefined }];
	},
});

const getAttrs = (domNode: string | HTMLElement): RuleAttributes => {
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	const dom = domNode as HTMLElement;
	const weight = dom.getAttribute('data-weight');

	return {
		color: dom.getAttribute('data-color') || undefined,
		localId: dom.getAttribute('data-local-id') || undefined,
		style: (dom.getAttribute('data-style') as RuleStyle) || undefined,
		weight: weight === null || weight === '' ? undefined : Number(weight),
	};
};

export const ruleWithAttrs: NodeSpec = {
	...ruleWithLocalId,
	attrs: {
		...ruleWithLocalId.attrs,
		color: { default: null },
		style: { default: null },
		weight: { default: null },
	},
	parseDOM: [{ tag: 'hr', getAttrs }],
	toDOM(node) {
		const { color, localId, style, weight } = node.attrs;
		return [
			'hr',
			{
				'data-color': color || undefined,
				'data-local-id': localId || undefined,
				'data-style': style || undefined,
				'data-weight': weight ?? undefined,
			},
		];
	},
};

export const ruleRootOnlyStage0: NodeSpec = {
	...ruleWithLocalId,
	marks: 'breakout unsupportedMark unsupportedNodeAttribute',
};

export const ruleWithAttrsRootOnlyStage0: NodeSpec = {
	...ruleWithAttrs,
	marks: 'breakout unsupportedMark unsupportedNodeAttribute',
};
