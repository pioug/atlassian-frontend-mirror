import { removeThemeImports } from './migrations/remove-imports';
import { removeThemeProp } from './migrations/remove-props';
import {
  renameThemeAppearanceImport,
  renamethemeTokensImport,
} from './migrations/rename-imports';
import { createTransformer } from './migrations/utils';

const transformer = createTransformer('@atlaskit/textfield', [
  removeThemeProp,
  removeThemeImports,
  renamethemeTokensImport,
  renameThemeAppearanceImport,
]);

export default transformer;
