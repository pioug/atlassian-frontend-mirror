import type { EditorView } from 'prosemirror-view';

import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { contextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';
import type { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';

export type ForceFocusSelector = (
  selector: string | null,
  view?: EditorView,
) => void;

export type FloatingToolbarPlugin = NextEditorPlugin<
  'floatingToolbar',
  {
    dependencies: [
      typeof featureFlagsPlugin,
      typeof decorationsPlugin,
      OptionalPlugin<typeof contextPanelPlugin>,
    ];
    actions: { forceFocusSelector: ForceFocusSelector };
  }
>;
