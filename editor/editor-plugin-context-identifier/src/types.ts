import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import type {
  EditorCommand,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';

export type Configuration = {
  contextIdentifierProvider?: ContextIdentifierProvider;
};

export type PluginConfiguration = {
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
};

export type ContextIdentifierPlugin = NextEditorPlugin<
  'contextIdentifier',
  {
    pluginConfiguration: PluginConfiguration | undefined;
    sharedState: Configuration | undefined;
    commands: { setProvider: (config: Configuration) => EditorCommand };
  }
>;
