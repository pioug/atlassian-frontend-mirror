import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';

export type UndoRedoPlugin = NextEditorPlugin<
  'undoRedoPlugin',
  {
    dependencies: [TypeAheadPlugin];
  }
>;
