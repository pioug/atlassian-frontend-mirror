import { ADFEntity } from '../types';
import { traverse } from '../traverse/traverse';

export function filter(
  adf: ADFEntity,
  callback: (node: ADFEntity) => boolean,
): Array<ADFEntity> {
  const result: Array<ADFEntity> = [];

  traverse(adf, {
    any: (node) => {
      if (callback(node)) {
        result.push(node);
      }
    },
  });

  return result;
}
