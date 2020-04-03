import React from 'react';
import { EditorView } from 'prosemirror-view';

import { FileIdentifier } from '@atlaskit/media-client';
import { Dimensions, SmartMediaEditor } from '@atlaskit/media-editor';

import { MediaEditorState } from '../types';
import { uploadAnnotation, closeMediaEditor } from '../commands/media-editor';

type Props = {
  mediaEditorState: MediaEditorState;
  view: EditorView;
};

export default class MediaEditor extends React.PureComponent<Props> {
  static displayName = 'MediaEditor';

  private onUploadStart = (
    newFileIdentifier: FileIdentifier,
    dimensions: Dimensions,
  ) => {
    const { state, dispatch } = this.props.view;
    uploadAnnotation(newFileIdentifier, dimensions)(state, dispatch);
  };

  private onClose = () => {
    const { state, dispatch } = this.props.view;
    closeMediaEditor()(state, dispatch);
  };

  render() {
    const {
      mediaEditorState: { editor, mediaClientConfig },
    } = this.props;
    if (!editor || !mediaClientConfig) {
      return null;
    }

    const { identifier } = editor;

    return (
      <SmartMediaEditor
        identifier={identifier}
        mediaClientConfig={mediaClientConfig}
        onUploadStart={this.onUploadStart}
        onClose={this.onClose}
      />
    );
  }
}
