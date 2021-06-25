import { createRenameVariableTransform } from '../utils';

export const renameExperimentalTextColorProp = createRenameVariableTransform(
  'EXPERIMENTAL_allowMoreTextColors',
  'allowMoreTextColors',
);
