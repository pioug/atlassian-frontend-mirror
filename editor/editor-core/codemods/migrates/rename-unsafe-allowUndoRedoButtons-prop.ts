import { createRenameVariableTransform } from '../utils';

export const renameUnsafeAllowUndoRedoButtonsProp =
  createRenameVariableTransform(
    'UNSAFE_allowUndoRedoButtons',
    'allowUndoRedoButtons',
  );
