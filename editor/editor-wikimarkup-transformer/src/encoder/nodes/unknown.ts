import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type NodeEncoder } from '..';
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
