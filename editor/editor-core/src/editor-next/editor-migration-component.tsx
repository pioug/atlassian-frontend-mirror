import React from 'react';
import { createFeatureFlagsFromProps } from '../create-editor/feature-flags-from-props';
import Editor from '../editor';
import { EditorProps } from '../types/editor-props';
import EditorNext from './index';

import useUniversalPreset from '../labs/next/presets/useUniversalPreset';
interface WrapperProps {
  props: EditorProps;
}

const EditorNextWrapper = ({ props }: WrapperProps) => {
  const preset = useUniversalPreset({ props });
  return <EditorNext preset={preset} {...props} />;
};

export default class EditorMigrationComponent extends React.Component<EditorProps> {
  render() {
    const featureFlags = createFeatureFlagsFromProps(this.props);

    if (!featureFlags.useEditorNext) {
      return <Editor {...this.props} />;
    }
    return <EditorNextWrapper props={this.props} />;
  }
}
