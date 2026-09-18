import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

import { bodiedRuleStage0 as bodiedRuleFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils/uuid';
import type { BreakoutMarkDefinition } from '../marks';
import type { HeadingDefinition } from './heading';
import type { ParagraphDefinition } from './paragraph';
import type { MarksObject } from './types/mark';

export type BodiedRuleAlignment = 'start' | 'center' | 'end';
export type BodiedRuleStyle = 'solid' | 'dashed' | 'dotted' | 'sketch' | 'fade';

export interface BodiedRuleAttributes {
	alignment?: BodiedRuleAlignment;
	color?: string;
	localId: string;
	style?: BodiedRuleStyle;
	weight?: number;
}

/**
 * @name bodiedRule_node
 */
export interface BodiedRuleDefinition {
	attrs: BodiedRuleAttributes;
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @minItems 1
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @maxItems 1
	 */
	content: Array<HeadingDefinition | ParagraphDefinition>;
	type: 'bodiedRule';
}

/**
 * @name bodiedRule_root_only_node
 */
export type BodiedRuleRootOnlyDefinition = BodiedRuleDefinition &
	MarksObject<BreakoutMarkDefinition>;

const getAttrs = (domNode: string | HTMLElement): BodiedRuleAttributes => {
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	const dom = domNode as HTMLElement;
	const weight = dom.getAttribute('data-weight');

	return {
		alignment: (dom.getAttribute('data-alignment') as BodiedRuleAlignment) || undefined,
		color: dom.getAttribute('data-color') || undefined,
		localId: dom.getAttribute('data-local-id') || uuid.generate(),
		style: (dom.getAttribute('data-style') as BodiedRuleStyle) || undefined,
		weight: weight === null || weight === '' ? undefined : Number(weight),
	};
};

export const bodiedRule: NodeSpec = bodiedRuleFactory({
	parseDOM: [{ tag: 'div[data-node-type="bodied-rule"]', getAttrs }],
	toDOM(node) {
		const { alignment, color, localId, style, weight } = node.attrs;
		return [
			'div',
			{
				'data-node-type': 'bodied-rule',
				'data-alignment': alignment || undefined,
				'data-color': color || undefined,
				'data-local-id': localId || undefined,
				'data-style': style || undefined,
				'data-weight': weight ?? undefined,
			},
			0,
		];
	},
});

export const bodiedRuleRootOnlyStage0: NodeSpec = {
	...bodiedRule,
	marks: 'breakout unsupportedMark unsupportedNodeAttribute',
};
