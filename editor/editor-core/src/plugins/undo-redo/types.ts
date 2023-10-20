import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { HistoryPlugin } from '@atlaskit/editor-plugin-history';

export type UndoRedoPlugin = NextEditorPlugin<
  'undoRedoPlugin',
  {
    dependencies: [TypeAheadPlugin, HistoryPlugin];
  }
>;
