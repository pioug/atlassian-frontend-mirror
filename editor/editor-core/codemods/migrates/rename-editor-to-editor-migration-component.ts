import type core from 'jscodeshift';
import type { Collection } from 'jscodeshift/src/Collection';

import { createUpdateEditorToMigrationComponent } from './createUpdateEditorToMigrationComponent';

export const renameEditorToMigrationComponent: (
	j: core.JSCodeshift,
	source: Collection<unknown>,
) => void = createUpdateEditorToMigrationComponent('@atlaskit/editor-core', 'Editor');
