import { Node as PMNode } from 'prosemirror-model';
import { encode } from '..';

import { paragraph } from './paragraph';
import { unknown } from './unknown';
import { codeBlock } from './code-block';
import { mediaGroup } from './media-group';
import { Context } from '../../interfaces';

export const listItem = (
  node: PMNode,
  prefix: string,
  context?: Context,
): string => {
  const result: string[] = [];
  let contentBuffer: string[] = [];
  node.forEach((n) => {
    switch (n.type.name) {
      case 'paragraph': {
        contentBuffer.push(paragraph(n, { context }));
        break;
      }
      case 'bulletList':
      case 'orderedList': {
        if (contentBuffer.length) {
          result.push(`${prefix} ${contentBuffer.join('\n')}`);
          contentBuffer = [];
        }
        const nestedList = encode(n, context)
          .split('\n')
          .map((line) => {
            if (['#', '*'].indexOf(line.substr(0, 1)) !== -1) {
              return `${prefix}${line}`;
            }
            return line;
          })
          .join('\n');
        result.push(nestedList);
        break;
      }
      case 'codeBlock': {
        contentBuffer.push(codeBlock(n));
        break;
      }
      case 'mediaSingle': {
        // mediaSingle and mediaGroup are holding the same conversion logic
        contentBuffer.push(mediaGroup(n, { context }));
        break;
      }
      default:
        contentBuffer.push(unknown(n));
    }
  });
  if (contentBuffer.length) {
    result.push(`${prefix} ${contentBuffer.join('\n')}`);
  }
  return result.join('\n');
};
