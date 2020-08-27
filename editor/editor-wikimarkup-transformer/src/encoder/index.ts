import { Node as PMNode } from 'prosemirror-model';

import { blockquote } from './nodes/blockquote';
import { bulletList } from './nodes/bullet-list';
import { taskList } from './nodes/taskList';
import { decisionList } from './nodes/decisionList';
import { codeBlock } from './nodes/code-block';
import { doc } from './nodes/doc';
import { expand } from './nodes/expand';
import { heading } from './nodes/heading';
import { mediaGroup } from './nodes/media-group';
import { orderedList } from './nodes/ordered-list';
import { panel } from './nodes/panel';
import { paragraph } from './nodes/paragraph';
import { rule } from './nodes/rule';
import { table } from './nodes/table';
import { unknown } from './nodes/unknown';
import { blockCard } from './nodes/block-card';
import { embedCard } from './nodes/embed-card';
import { Context } from '../interfaces';

export type MarkEncoder = (text: string, attrs: any) => string;
export type NodeEncoder = (node: PMNode, opts?: NodeEncoderOpts) => string;
export type NodeEncoderOpts = {
  parent?: PMNode;
  context?: Context;
};

const nodeEncoderMapping: { [key: string]: NodeEncoder } = {
  blockquote,
  bulletList,
  taskList,
  decisionList,
  codeBlock,
  doc,
  heading,
  mediaGroup,
  mediaSingle: mediaGroup,
  orderedList,
  panel,
  paragraph,
  rule,
  table,
  blockCard,
  embedCard,
  expand,
};

export function encode(node: PMNode, context?: Context): string {
  const encoder = nodeEncoderMapping[node.type.name];
  try {
    if (encoder) {
      return encoder(node, { context });
    }
    return unknown(node);
  } catch (err) {
    return unknown(node);
  }
}
