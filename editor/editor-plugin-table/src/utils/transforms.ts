import type { Transaction } from '@atlaskit/editor-prosemirror/state';

export const combineTransforms = (
  transforms: Array<(tr: Transaction) => Transaction>,
  tr: Transaction,
) => {
  return transforms.reduce((prev, curr) => {
    return curr(prev);
  }, tr);
};
