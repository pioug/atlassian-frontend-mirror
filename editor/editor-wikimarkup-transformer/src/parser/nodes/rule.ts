import { Node as PMNode, NodeType, Schema } from 'prosemirror-model';

const HORIZONTAL_LINE_INSIDE_MACRO = '---';

export default function getRuleNodeView(
  schema: Schema,
  containerNodeType: NodeType | null,
): PMNode {
  const { paragraph, rule } = schema.nodes;

  if (containerNodeType) {
    const textNode = schema.text(HORIZONTAL_LINE_INSIDE_MACRO);
    return paragraph.createChecked({}, textNode);
  } else {
    return rule.createChecked();
  }
}

export function createRuleNode(schema: Schema): PMNode[] {
  const { rule } = schema.nodes;

  const ruleNode = rule.createChecked();
  return [ruleNode];
}
