import { renameUnsafeAllowUndoRedoButtonsProp } from './migrates/rename-unsafe-allowUndoRedoButtons-prop';
import { createTransformer } from './utils';

const transformer = createTransformer('@atlaskit/editor-core', [
  renameUnsafeAllowUndoRedoButtonsProp,
]);

export default transformer;
