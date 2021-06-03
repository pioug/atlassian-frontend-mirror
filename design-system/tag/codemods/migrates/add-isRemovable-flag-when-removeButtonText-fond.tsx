import { createConvertFuncFor, isEmpty } from '../utils';

export const addIsRemovableFlag = createConvertFuncFor(
  '@atlaskit/tag',
  'removeButtonText',
  'isRemovable',
  (value) => isEmpty(value),
);
