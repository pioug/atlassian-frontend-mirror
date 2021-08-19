import { createRenameJSXFunc } from './utils';

export const renamethemeTokensImport = createRenameJSXFunc(
  '@atlaskit/textfield',
  'themeTokens',
  'TextFieldColors',
  'DSTextFieldColors',
);

export const renameThemeAppearanceImport = createRenameJSXFunc(
  '@atlaskit/textfield',
  'ThemeAppearance',
  'Appearance',
  'DSTextFieldAppearance',
);
