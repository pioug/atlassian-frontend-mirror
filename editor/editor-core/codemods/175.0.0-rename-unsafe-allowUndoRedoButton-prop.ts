import type { FileInfo, API, Options } from 'jscodeshift';

import { renameUnsafeAllowUndoRedoButtonsProp } from './migrates/rename-unsafe-allowUndoRedoButtons-prop';
import { createTransformer } from './utils';

const transformer: (fileInfo: FileInfo, _api: API, options: Options) => string = createTransformer(
	'@atlaskit/editor-core',
	[renameUnsafeAllowUndoRedoButtonsProp],
);

export default transformer;
