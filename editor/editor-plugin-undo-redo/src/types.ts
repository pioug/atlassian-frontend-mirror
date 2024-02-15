import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { HistoryPlugin } from '@atlaskit/editor-plugin-history';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';

export type UndoRedoPlugin = NextEditorPlugin<
  'undoRedoPlugin',
  {
    dependencies: [TypeAheadPlugin, HistoryPlugin];
  }
>;
