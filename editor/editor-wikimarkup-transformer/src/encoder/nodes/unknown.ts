import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';

const jsonTransformer = new JSONTransformer();

export const unknown: NodeEncoder = (node: PMNode): string => {
  const content = JSON.stringify(jsonTransformer.encodeNode(node));
  return node.isBlock
    ? `{adf:display=block}
${content}
{adf}`
    : `{adf:display=inline}${content}{adf}`;
};
