import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder, NodeEncoderOpts } from '..';

const PREFIX = 'accountid:';
const UNKNOWN_USER = 'UNKNOWN_USER';

const addPrefix = (content: string) =>
  content.startsWith(PREFIX) ? content : `${PREFIX}${content}`;

export const mention: NodeEncoder = (
  node: PMNode,
  { context }: NodeEncoderOpts = {},
): string => {
  if (node.attrs.id === UNKNOWN_USER) {
    return `[~${node.attrs.id}]`;
  }
  const content =
    context &&
    context.conversion &&
    context.conversion.mentionConversion &&
    context.conversion.mentionConversion[node.attrs.id]
      ? context.conversion.mentionConversion[node.attrs.id]
      : addPrefix(node.attrs.id);
  return `[~${content}]`;
};
