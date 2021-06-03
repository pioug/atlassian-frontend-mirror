import { Node as PMNode } from 'prosemirror-model';
import { encode, NodeEncoder, NodeEncoderOpts } from '..';
import { unknown } from './unknown';

export const table: NodeEncoder = (
  node: PMNode,
  opts: NodeEncoderOpts = {},
): string => {
  try {
    const result: string[] = [];
    node.forEach((n) => {
      result.push(tableRow(n, opts));
    });

    return result.join('\n');
  } catch (err) {
    return unknown(node);
  }
};

const tableRow: NodeEncoder = (
  node: PMNode,
  opts: NodeEncoderOpts = {},
): string => {
  let result: string = '';
  let separator: string = '|';
  node.forEach((n) => {
    if (n.type.name === 'tableHeader') {
      separator = '||';
    } else {
      separator = '|';
    }
    result = `${result}${separator}${tableCell(n, opts)}`;
  });

  return `${result}${separator}`;
};

const tableCell: NodeEncoder = (
  node: PMNode,
  { context }: NodeEncoderOpts = {},
): string => {
  if (hasMergedCell(node)) {
    // This is an advanced table
    throw new Error('Advanced feature of table is not supported');
  }
  const result: string[] = [];
  node.forEach((n) => {
    result.push(encode(n, context));
  });
  const output = result.join('\n').trim();
  // Return single whitespace if content of cell is empty
  // to preserve correct empty cell rendering in wiki
  return output === '' ? ' ' : output;
};

const hasMergedCell = (node: PMNode): boolean => {
  if (!node.attrs) {
    return false;
  }

  if (node.attrs.colspan && node.attrs.colspan !== 1) {
    return true;
  }

  if (node.attrs.rowspan && node.attrs.rowspan !== 1) {
    return true;
  }

  return false;
};
