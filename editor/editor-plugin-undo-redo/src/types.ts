import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { HistoryPlugin } from '@atlaskit/editor-plugin-history';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';

export type UndoRedoPlugin = NextEditorPlugin<
  'undoRedoPlugin',
  {
    dependencies: [
      TypeAheadPlugin,
      HistoryPlugin,
      OptionalPlugin<PrimaryToolbarPlugin>,
    ];
  }
>;
