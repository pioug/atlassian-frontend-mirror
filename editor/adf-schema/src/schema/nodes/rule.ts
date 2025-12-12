import type { DOMOutputSpec } from '@atlaskit/editor-prosemirror/model';
import { rule as ruleFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils/uuid';

/**
 * @name rule_node
 */
export interface RuleDefinition {
	attrs?: { localId?: string };
	type: 'rule';
}

const hrDOM: DOMOutputSpec = ['hr'];
export const rule = ruleFactory({
	parseDOM: [{ tag: 'hr' }],
	toDOM() {
		return hrDOM;
	},
});

export const ruleWithLocalId = ruleFactory({
	parseDOM: [{ tag: 'hr', getAttrs: () => ({ localId: uuid.generate() }) }],
	toDOM(node) {
		return ['hr', { 'data-local-id': node?.attrs?.localId || undefined }];
	},
});
