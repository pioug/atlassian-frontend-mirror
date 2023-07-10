/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';

import { Editor as EditorNext } from '@atlaskit/editor-core/composable-editor';

import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';

import { EditorProps } from '@atlaskit/editor-core';

import { mobileApiPlugin } from './plugins/mobileApiPlugin';
import WebBridgeImpl from './native-to-web';
import { name, version } from '../version-wrapper';

import { FabricEditorAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { getAnalyticsAppearance } from '@atlaskit/editor-common/utils';
import uuid from 'uuid/v4';

interface WrapperProps {
  props: EditorWrapperProps;
}

interface EditorWrapperProps extends EditorProps {
  bridge: WebBridgeImpl;
}

const EditorNextWrapper = ({ props }: WrapperProps) => {
  const preset = useUniversalPreset({ props }).add([
    mobileApiPlugin,
    { bridge: props.bridge },
  ]);
  return <EditorNext preset={preset} {...props} />;
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

  private editorSessionId = uuid();

  render() {
    // TODO: https://product-fabric.atlassian.net/browse/ED-16979
    // Move `FabricEditorAnalyticsContext` back into `EditorNext`
    // This was moved out here to workaround the issue that the analytics
    // context does not wrap the Preset (and therefore does not pass this context
    // information to analytics calls within plugins). After this cleanup task ^ we will
    // not have to generate the `createAnalyticsEvent` outside the Preset
    // and we can move this back into `EditorNext`.
    return (
      <FabricEditorAnalyticsContext
        data={{
          packageName: name,
          packageVersion: version,
          componentName: 'editorCore',
          appearance: getAnalyticsAppearance(this.props.appearance),
          editorSessionId: this.editorSessionId,
        }}
      >
        <EditorNextWrapper props={this.props} />
      </FabricEditorAnalyticsContext>
    );
  }
}
