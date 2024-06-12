import { addIsRemovableFlag } from './migrates/add-is-removable-flag-when-remove-button-text-found';
import { renameRemoveButtonText } from './migrates/rename-remove-button-text-to-remove-button-label';
import { replaceImportStatement } from './migrates/replace-import-statements';
import { createTransformer } from './utils';

const transformer = createTransformer('@atlaskit/tag', [
	addIsRemovableFlag,
	renameRemoveButtonText,
	replaceImportStatement,
]);

export default transformer;
