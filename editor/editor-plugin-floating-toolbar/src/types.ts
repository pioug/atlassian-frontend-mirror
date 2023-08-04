import type {
  FloatingToolbarConfig,
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { contextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';
import type { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

export type ConfigWithNodeInfo = {
  config: FloatingToolbarConfig | undefined;
  pos: number;
  node: Node;
};

export type FloatingToolbarPluginData = {
  confirmDialogForItem?: number;
};

export type ForceFocusSelector = (
  selector: string | null,
) => (tr: Transaction) => Transaction;

export type FloatingToolbarPlugin = NextEditorPlugin<
  'floatingToolbar',
  {
    dependencies: [
      typeof featureFlagsPlugin,
      typeof decorationsPlugin,
      OptionalPlugin<typeof contextPanelPlugin>,
      EditorDisabledPlugin,
    ];
    actions: { forceFocusSelector: ForceFocusSelector };
    sharedState:
      | {
          configWithNodeInfo: ConfigWithNodeInfo | undefined;
          floatingToolbarData: FloatingToolbarPluginData | undefined;
        }
      | undefined;
  }
>;
