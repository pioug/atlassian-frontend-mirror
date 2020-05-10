import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder, NodeEncoderOpts } from '..';

const PREFIX = 'accountid:';
const UNKNOWN_USER = 'UNKNOWN_USER';

const addPrefix = (content: string) =>
  content.toLowerCase().startsWith(PREFIX) ? content : `${PREFIX}${content}`;

export const mention: NodeEncoder = (
  node: PMNode,
  { context }: NodeEncoderOpts = {},
): string => {
  if (node.attrs.id === UNKNOWN_USER) {
    return `[~${node.attrs.id}]`;
  }
  const mentionKey = node.attrs.id.toLowerCase();
  const content =
    context &&
    context.conversion &&
    context.conversion.mentionConversion &&
    context.conversion.mentionConversion[mentionKey]
      ? context.conversion.mentionConversion[mentionKey]
      : addPrefix(node.attrs.id);
  return `[~${content}]`;
};
