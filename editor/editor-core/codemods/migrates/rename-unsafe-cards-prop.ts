import { createRenameVariableTransform } from '../utils';

export const renameUnsafeCardProp = createRenameVariableTransform(
  'UNSAFE_cards',
  'smartLinks',
);
