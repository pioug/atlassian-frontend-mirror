import { createRemoveImportsFor } from './utils';

export const removeThemeImports = createRemoveImportsFor({
  importsToRemove: ['ThemeProps', 'ThemeTokens', 'Theme'],
  packagePath: '@atlaskit/textfield',
  comment: `This file uses exports used to help theme @atlaskit/textfield which
  has now been removed due to its poor performance characteristics.`,
});
