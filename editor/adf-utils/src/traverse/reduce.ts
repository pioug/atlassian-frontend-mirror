import { ADFEntity } from '../types';
import { traverse } from './traverse';

export function reduce<T = any>(
  adf: ADFEntity,
  callback: (accunulator: T, node: ADFEntity) => T,
  initial: T,
): T {
  let result = initial;

  traverse(adf, {
    any: (node) => {
      result = callback(result, node);
    },
  });

  return result;
}
