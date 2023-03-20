import { renameEditorToMigrationComponent } from './migrates/rename-editor-to-editor-migration-component';
import { createTransformer } from './utils';

const transformer = createTransformer('@atlaskit/editor-core', [
  renameEditorToMigrationComponent,
]);

export default transformer;
