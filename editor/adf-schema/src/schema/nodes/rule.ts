import { NodeSpec, DOMOutputSpec } from '@atlaskit/editor-prosemirror/model';

/**
 * @name rule_node
 */
export interface RuleDefinition {
  type: 'rule';
}

const hrDOM: DOMOutputSpec = ['hr'];
export const rule: NodeSpec = {
  group: 'block',
  parseDOM: [{ tag: 'hr' }],
  toDOM() {
    return hrDOM;
  },
};
