import { ADFEntity } from '../types';
import { traverse } from './traverse';

export function map<T = any>(
  adf: ADFEntity,
  callback: (node: ADFEntity) => T,
): Array<T> {
  const result: Array<T> = [];

  traverse(adf, {
    any: (node) => {
      result.push(callback(node));
    },
  });

  return result;
}
