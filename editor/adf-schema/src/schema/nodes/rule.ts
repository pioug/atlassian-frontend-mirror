import type { DOMOutputSpec, NodeSpec } from '@atlaskit/editor-prosemirror/model';
import type { BreakoutMarkDefinition } from '../marks';
import type { MarksObject } from './types/mark';
import { rule as ruleFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils/uuid';

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

export const ruleRootOnlyStage0: NodeSpec = {
	...ruleWithLocalId,
	marks: 'breakout unsupportedMark unsupportedNodeAttribute',
};
