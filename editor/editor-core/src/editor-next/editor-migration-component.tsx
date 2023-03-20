import React from 'react';
import { EditorProps } from '../types/editor-props';
import Editor from '../editor';
import EditorNext from './index';
import { createFeatureFlagsFromProps } from '../create-editor/feature-flags-from-props';

export default class EditorMigrationComponent extends React.Component<EditorProps> {
  render() {
    const featureFlags = createFeatureFlagsFromProps(this.props);
    return featureFlags.useEditorNext ? (
      <EditorNext {...this.props} />
    ) : (
      <Editor {...this.props} />
    );
  }
}
