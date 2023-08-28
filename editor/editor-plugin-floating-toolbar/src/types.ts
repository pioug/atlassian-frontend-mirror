import type {
  FloatingToolbarConfig,
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { ContextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';

export type ConfigWithNodeInfo = {
  config: FloatingToolbarConfig | undefined;
  pos: number;
  node: Node;
};

export type FloatingToolbarPluginState = {
  getConfigWithNodeInfo: (
    state: EditorState,
  ) => ConfigWithNodeInfo | null | undefined;
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
      FeatureFlagsPlugin,
      DecorationsPlugin,
      OptionalPlugin<ContextPanelPlugin>,
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
