import type { FileInfo, API, Options } from 'jscodeshift';

import { renameEditorToMigrationComponent } from './migrates/rename-editor-to-editor-migration-component';
import { createTransformer } from './utils';

const transformer: (fileInfo: FileInfo, _api: API, options: Options) => string = createTransformer(
	'@atlaskit/editor-core',
	[renameEditorToMigrationComponent],
);

export default transformer;
