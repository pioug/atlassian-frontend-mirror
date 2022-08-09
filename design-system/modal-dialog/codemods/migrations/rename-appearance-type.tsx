import { renameNamedImportWithAliasName } from '@atlaskit/codemod-utils';

import { PACKAGE_NAME } from '../internal/constants';

export const renameAppearanceType = renameNamedImportWithAliasName(
  PACKAGE_NAME,
  'AppearanceType',
  'Appearance',
);
