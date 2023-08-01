import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeEncoder, NodeEncoderOpts } from '..';

export const mediaInline: NodeEncoder = (
  node: PMNode,
  { context }: NodeEncoderOpts = {},
): string => {
  let fileName: string;

  fileName =
    context?.conversion?.mediaConversion?.[node.attrs.id]?.transform ??
    node.attrs.id;

  return `[^${fileName}]`;
};
