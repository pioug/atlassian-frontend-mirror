import type {
  ExtensionAPI,
  ExtensionHandlers,
} from '@atlaskit/editor-common/extensions';
import type {
  EditorAppearance,
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { LongPressSelectionPluginOptions } from '@atlaskit/editor-common/types';
import type { ContextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';
import type { ApplyChangeHandler } from '@atlaskit/editor-plugin-context-panel';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

interface CreateExtensionAPIOptions {
  editorView: EditorView;
  applyChange: ApplyChangeHandler | undefined;
  editInLegacyMacroBrowser?: () => void;
}

export type CreateExtensionAPI = (
  options: CreateExtensionAPIOptions,
) => ExtensionAPI;

interface ExtensionPluginOptions extends LongPressSelectionPluginOptions {
  allowAutoSave?: boolean;
  breakoutEnabled?: boolean;
  extensionHandlers?: ExtensionHandlers;
  appearance?: EditorAppearance;
}

export type ExtensionPlugin = NextEditorPlugin<
  'extension',
  {
    pluginConfiguration: ExtensionPluginOptions | undefined;
    dependencies: [
      FeatureFlagsPlugin,
      WidthPlugin,
      DecorationsPlugin,
      OptionalPlugin<ContextPanelPlugin>,
    ];
    actions: { createExtensionAPI: CreateExtensionAPI };
  }
>;
