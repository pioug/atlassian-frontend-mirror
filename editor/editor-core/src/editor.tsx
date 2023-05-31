/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';

import { defaultProps } from './editor-next/utils/editorPropTypes';

import { EditorProps } from './types/editor-props';

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
import { FabricEditorAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { name, version } from './version-wrapper';
import { getAnalyticsAppearance } from '@atlaskit/editor-common/utils';
import uuid from 'uuid/v4';

interface WrapperProps {
  props: EditorProps;
}

const EditorNextWrapper = ({ props }: WrapperProps) => {
  const preset = useUniversalPreset({ props });
  return <EditorNext preset={preset} {...props} />;
};

export default class Editor extends React.Component<EditorProps> {
  static defaultProps = defaultProps;

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
