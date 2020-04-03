import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder, NodeEncoderOpts } from '..';

import { emoji } from './emoji';
import { hardBreak } from './hard-break';
import { mention } from './mention';
import { text } from './text';
import { inlineCard } from './inline-card';
import { status } from './status';
import { unknown } from './unknown';
import { date } from './date';

const inlinesEncoderMapping: { [key: string]: NodeEncoder } = {
  emoji,
  hardBreak,
  mention,
  text,
  inlineCard,
  status,
  date,
};

export const inlines: NodeEncoder = (
  node: PMNode,
  opts?: NodeEncoderOpts,
): string => {
  const encoder = inlinesEncoderMapping[node.type.name];
  if (encoder) {
    return encoder(node, opts);
  }
  return unknown(node);
};
