import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeEncoder, NodeEncoderOpts } from '..';
import { caption } from './caption';
import { media } from './media';
import { unknown } from './unknown';

export const mediaGroup: NodeEncoder = (
  node: PMNode,
  opts: NodeEncoderOpts = {},
): string => {
  const result: string[] = [];
  node.forEach((n) => {
    switch (n.type.name) {
      case 'media':
        result.push(media(n, { ...opts, parent: node }));
        break;
      case 'caption':
        result.push(caption(n, opts));
        break;
      default:
        result.push(unknown(n));
        break;
    }
  });

  return result.join('\n');
};
