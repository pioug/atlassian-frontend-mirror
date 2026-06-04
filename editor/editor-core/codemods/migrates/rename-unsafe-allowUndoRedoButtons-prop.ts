import type { JSCodeshift } from 'jscodeshift';
import type { Collection } from 'jscodeshift/src/Collection';

import { createRenameVariableTransform } from '../createRenameVariableTransform';

export const renameUnsafeAllowUndoRedoButtonsProp: (
	j: JSCodeshift,
	source: Collection<unknown>,
) => void = createRenameVariableTransform('UNSAFE_allowUndoRedoButtons', 'allowUndoRedoButtons');
