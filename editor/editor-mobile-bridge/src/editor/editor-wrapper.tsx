/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';

import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';

import type { EditorProps } from '@atlaskit/editor-core';

import viewUpdateSubscriptionPlugin from './editor-plugins/view-update-subscription';
import mobileDimensionsPlugin from './editor-plugins/mobile-dimensions';
import mobileSelectionPlugin from './editor-plugins/mobile-selection';

import type EditorConfiguration from './editor-configuration';
import { mobileApiPlugin } from './plugins/mobileApiPlugin';
import type WebBridgeImpl from './native-to-web';
import type { IntlShape } from 'react-intl-next';

interface WrapperProps {
  props: EditorWrapperProps;
}

interface EditorWrapperProps extends EditorProps {
  bridge: WebBridgeImpl;
  intl: IntlShape;
  editorConfiguration: EditorConfiguration;
}

const ComposableEditorWrapper = ({ props }: WrapperProps) => {
  const preset = useUniversalPreset({ props })
    .add(viewUpdateSubscriptionPlugin)
    .add(mobileDimensionsPlugin)
    .add(mobileSelectionPlugin)
    .add([
      mobileApiPlugin,
      {
        bridge: props.bridge,
        intl: props.intl,
        editorConfiguration: props.editorConfiguration,
      },
    ]);
  return <ComposableEditor preset={preset} {...props} />;
};

export class Editor extends React.Component<EditorWrapperProps> {
  // Copied from `packages/editor/editor-core/src/composable-editor/utils/editorPropTypes.ts`
  static defaultProps = {
    disabled: false,
    extensionHandlers: {},
    allowHelpDialog: true,
    quickInsert: true,
  };

  render() {
    return <ComposableEditorWrapper props={this.props} />;
  }
}
