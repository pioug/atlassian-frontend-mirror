import { Node as PMNode, Schema } from 'prosemirror-model';
import { reduce, NodeReducer } from './';

const table: NodeReducer = (node: PMNode, schema: Schema) => {
  const result: string[] = [];
  node.forEach((n) => {
    result.push(tableRow(n, schema));
  });

  return result.join('\n');
};

const tableRow: NodeReducer = (node: PMNode, schema: Schema): string => {
  const result: string[] = [];
  let separator: string = '|';
  node.forEach((n) => {
    result.push(tableCell(n, schema));
  });

  return `${separator}${result.join(`${separator}`)}${separator}`;
};

const tableCell: NodeReducer = (node: PMNode, schema: Schema): string => {
  const result: string[] = [];
  node.forEach((n) => {
    result.push(reduce(n, schema));
  });

  return result.join('\n');
};

export default table;
