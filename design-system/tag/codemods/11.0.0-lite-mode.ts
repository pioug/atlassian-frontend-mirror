import { addIsRemovableFlag } from './migrates/add-isRemovable-flag-when-removeButtonText-fond';
import { renameRemoveButtonText } from './migrates/rename-removeButtonText-to-removeButtonLabel';
import { replaceImportStatement } from './migrates/replace-import-statements';
import { createTransformer } from './utils';

const transformer = createTransformer('@atlaskit/tag', [
  addIsRemovableFlag,
  renameRemoveButtonText,
  replaceImportStatement,
]);

export default transformer;
