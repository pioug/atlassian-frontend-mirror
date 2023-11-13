import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type {
  ExtensionAPI,
  ExtensionHandlers,
} from '@atlaskit/editor-common/extensions';
import type { MacroProvider } from '@atlaskit/editor-common/provider-factory';
import type {
  EditorAppearance,
  LongPressSelectionPluginOptions,
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type {
  ApplyChangeHandler,
  ContextPanelPlugin,
} from '@atlaskit/editor-plugin-context-panel';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

interface CreateExtensionAPIOptions {
  editorView: EditorView;
  applyChange: ApplyChangeHandler | undefined;
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
  editInLegacyMacroBrowser?: () => void;
}

export type CreateExtensionAPI = (
  options: CreateExtensionAPIOptions,
) => ExtensionAPI;

export interface ExtensionPluginOptions
  extends LongPressSelectionPluginOptions {
  allowAutoSave?: boolean;
  breakoutEnabled?: boolean;
  extensionHandlers?: ExtensionHandlers;
  appearance?: EditorAppearance;
}

type InsertMacroFromMacroBrowser = (
  macroProvider: MacroProvider,
  macroNode?: PmNode,
  isEditing?: boolean,
) => (view: EditorView) => Promise<boolean>;

export type RunMacroAutoConvert = (
  state: EditorState,
  text: string,
) => PmNode | null;

export type ExtensionPlugin = NextEditorPlugin<
  'extension',
  {
    pluginConfiguration: ExtensionPluginOptions | undefined;
    dependencies: [
      OptionalPlugin<AnalyticsPlugin>,
      FeatureFlagsPlugin,
      WidthPlugin,
      DecorationsPlugin,
      OptionalPlugin<ContextPanelPlugin>,
    ];
    actions: {
      api: () => ExtensionAPI;
      insertMacroFromMacroBrowser: InsertMacroFromMacroBrowser;
      runMacroAutoConvert: RunMacroAutoConvert;
    };
  }
>;
