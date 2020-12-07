import { removeThemeImports } from './migrations/remove-imports';
import {
  removeFullWidth,
  removeOverrides,
  removeTheme,
} from './migrations/remove-props';
import {
  renameCheckboxWithoutAnalyticsImport,
  renameDeepTypeImport,
  renameTypeImport,
} from './migrations/rename-import';
import { renameInputRef } from './migrations/rename-inputRef-to-ref';
import { createTransformer } from './utils';

const transformer = createTransformer('@atlaskit/checkbox', [
  removeThemeImports,
  renameCheckboxWithoutAnalyticsImport,
  renameTypeImport,
  renameDeepTypeImport,
  renameInputRef,
  removeFullWidth,
  removeOverrides,
  removeTheme,
]);

export default transformer;
