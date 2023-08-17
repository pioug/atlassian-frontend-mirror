/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';

import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';

import type { EditorProps } from '@atlaskit/editor-core';

import { mobileApiPlugin } from './plugins/mobileApiPlugin';
import type WebBridgeImpl from './native-to-web';

interface WrapperProps {
  props: EditorWrapperProps;
}

interface EditorWrapperProps extends EditorProps {
  bridge: WebBridgeImpl;
}

const ComposableEditorWrapper = ({ props }: WrapperProps) => {
  const preset = useUniversalPreset({ props }).add([
    mobileApiPlugin,
    { bridge: props.bridge },
  ]);
  return <ComposableEditor preset={preset} {...props} />;
};

export class Editor extends React.Component<EditorWrapperProps> {
  // Copied from `packages/editor/editor-core/src/editor-next/utils/editorPropTypes.ts`
  static defaultProps = {
    disabled: false,
    extensionHandlers: {},
    allowHelpDialog: true,
    allowNewInsertionBehaviour: true,
    quickInsert: true,
  };

  render() {
    return <ComposableEditorWrapper props={this.props} />;
  }
}
