import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import type { MediaFeatureFlags } from '@atlaskit/media-common';

import { EditorAppearance, EditorProps } from '../../src/editor';
import { EditorActions } from '../../src';
import { Message } from '../adf-url';

export interface ExampleProps {
  onTitleChange?: (title: string) => void;
  setMode?: (isEditing: boolean) => void;
  customPrimaryToolbarComponents?: EditorProps['primaryToolbarComponents'];
  onExampleEditorReady?: (
    editorActions: EditorActions,
    timeTaken?: number,
  ) => void;
  clickToEdit?: boolean;
  editorProps?: Partial<EditorProps>;
}

export interface ExampleRendererProps {
  document?: string | object;
  setMode: (mode: boolean) => void;
  extensionProviders?: (ExtensionProvider | Promise<ExtensionProvider>)[];
  allowCustomPanel?: boolean;
  clickToEdit?: boolean;
  mediaFeatureFlags?: MediaFeatureFlags;
}

export interface EditorState {
  disabled: boolean;
  title?: string;
  appearance: EditorAppearance;
  warning?: Message;
}

export interface ExampleEditorProps {
  editorProps: Partial<EditorProps>;

  onExampleEditorReady?: ExampleProps['onExampleEditorReady'];
  onTitleChange?: ExampleProps['onTitleChange'];
  setMode?: ExampleProps['setMode'];

  customPrimaryToolbarComponents?: ExampleProps['customPrimaryToolbarComponents'];
}
