import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeEncoder, NodeEncoderOpts } from '..';

import { listItem } from './listItem';

export const orderedList: NodeEncoder = (
  node: PMNode,
  { context }: NodeEncoderOpts = {},
): string => {
  const result: string[] = [];
  node.forEach((item) => {
    result.push(listItem(item, '#', context));
  });
  return result.join('\n');
};
