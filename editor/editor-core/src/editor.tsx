/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import type { EditorProps } from './types/editor-props';
import editorDeprecationWarnings from './utils/editorDeprecationWarnings';

export type {
  AllowedBlockTypes,
  Command,
  CommandDispatch,
  DomAtPos,
  EditorAppearance,
  EditorAppearanceComponentProps,
  EditorConfig,
  EditorInstance,
  EditorPlugin,
  EditorProps,
  ExtensionConfig,
  ExtensionProvidersProp,
  FeedbackInfo,
  MarkConfig,
  MessageDescriptor,
  NodeConfig,
  NodeViewConfig,
  PluginsOptions,
  PMPlugin,
  PMPluginCreateConfig,
  PMPluginFactory,
  PMPluginFactoryParams,
  ReactComponents,
  ToolbarUIComponentFactory,
  ToolbarUiComponentFactoryParams,
  UIComponentFactory,
  UiComponentFactoryParams,
} from './types';

import EditorNext from './editor-next';
import useUniversalPreset from './labs/next/presets/useUniversalPreset';

interface WrapperProps {
  props: EditorProps;
}

const EditorNextWrapper = ({ props }: WrapperProps) => {
  const preset = useUniversalPreset({ props });
  return <EditorNext preset={preset} {...props} />;
};

export default class Editor extends React.Component<EditorProps> {
  static defaultProps: EditorProps = {
    appearance: 'comment',
    disabled: false,
    extensionHandlers: {},
    allowHelpDialog: true,
    allowNewInsertionBehaviour: true,
    quickInsert: true,
  };

  constructor(props: EditorProps) {
    super(props);
    editorDeprecationWarnings(props);
  }

  render() {
    return <EditorNextWrapper props={this.props} />;
  }
}
