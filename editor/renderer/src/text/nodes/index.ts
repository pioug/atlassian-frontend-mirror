import { Node as PMNode, Schema } from 'prosemirror-model';
import blockquote from './blockquote';
import bulletList from './bulletList';
import decisionItem from './decisionItem';
import hardBreak from './hardBreak';
import heading from './heading';
import listItem from './listItem';
import mediaGroup from './mediaGroup';
import mention from './mention';
import orderedList from './orderedList';
import panel from './panel';
import paragraph from './paragraph';
import rule from './rule';
import table from './table';
import taskItem from './taskItem';
import unknown from './unknown';

export type NodeReducer = (node: PMNode, schema: Schema) => string;

export const reduce: NodeReducer = (node: PMNode, schema: Schema) => {
  const reducer =
    nodeToReducerMapping[node.type.name] || nodeToReducerMapping.unknown;
  return reducer(node, schema);
};

export const nodeToReducerMapping: { [key: string]: NodeReducer } = {
  blockquote,
  bulletList,
  decisionItem,
  hardBreak,
  heading,
  listItem,
  mediaGroup,
  mention,
  orderedList,
  panel,
  paragraph,
  rule,
  table,
  taskItem,
  unknown,
};
