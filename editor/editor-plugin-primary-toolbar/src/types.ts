import type {
  EditorCommand,
  NextEditorPlugin,
  ToolbarUIComponentFactory,
} from '@atlaskit/editor-common/types';

export type PrimaryToolbarPlugin = NextEditorPlugin<
  'primaryToolbar',
  {
    sharedState: PrimaryToolbarPluginState | undefined;
    commands: {
      registerComponent: ({
        name,
        component,
      }: {
        name: ToolbarElementNames;
        component: ToolbarUIComponentFactory;
      }) => EditorCommand;
    };
  }
>;

type ComponentRegistry = Map<string, ToolbarUIComponentFactory>;

export type ToolbarElementNames =
  | 'separator'
  | 'undoRedoPlugin'
  | 'blockType'
  | 'textFormatting'
  | 'alignment'
  | 'textColor'
  | 'highlight';

export type ToolbarElementConfig = {
  name: ToolbarElementNames;
  enabled?: (componentRegistry: ComponentRegistry) => boolean;
};

export type PrimaryToolbarPluginState = {
  componentRegistry: ComponentRegistry;
  components: ToolbarUIComponentFactory[];
};
