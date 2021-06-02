import { EditorView } from '@atlaskit/media-editor';
import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { deselectItem } from '../../../actions/deselectItem';
import { State, EditorData, EditorError, FileReference } from '../../../domain';
import ErrorView from './errorView/errorView';
import { SpinnerView } from './spinnerView/spinnerView';
import { Selection, editorClose } from '../../../actions/editorClose';
import { editorShowError } from '../../../actions/editorShowError';
import { CenterView } from './styles';
import { LocalUploadComponent } from '../../../../components/localUpload';

export interface MainEditorViewStateProps {
  readonly editorData?: EditorData;
}

export interface MainEditorViewOwnProps {
  readonly localUploader: LocalUploadComponent;
}

export interface MainEditorViewDispatchProps {
  readonly onCloseEditor: (selection: Selection) => void;
  readonly onShowEditorError: (error: EditorError) => void;
  readonly onDeselectFile: (fileId: string) => void;
}

export type MainEditorViewProps = MainEditorViewStateProps &
  MainEditorViewOwnProps &
  MainEditorViewDispatchProps;

export class MainEditorView extends Component<MainEditorViewProps> {
  render(): JSX.Element | null {
    const { editorData } = this.props;
    if (editorData) {
      return this.renderContent(editorData);
    } else {
      return null;
    }
  }

  private renderContent = (editorData: EditorData): JSX.Element => {
    const { imageUrl, originalFile, error } = editorData;

    if (error) {
      return this.renderError(error);
    } else if (imageUrl && originalFile) {
      return (
        <CenterView>
          <EditorView
            imageUrl={imageUrl}
            onSave={this.onEditorSave(originalFile)}
            onCancel={this.onCancel}
            onError={this.onEditorError}
          />
        </CenterView>
      );
    } else {
      return <SpinnerView onCancel={this.onCancel} />;
    }
  };

  private renderError({ message, retryHandler }: EditorError): JSX.Element {
    return (
      <ErrorView
        message={message}
        onRetry={retryHandler}
        onCancel={this.onCancel}
      />
    );
  }

  private onEditorError = (
    message: string,
    retryHandler?: () => void,
  ): void => {
    this.props.onShowEditorError({ message, retryHandler });
  };

  private onEditorSave = (originalFile: FileReference) => (
    image: string,
  ): void => {
    const { localUploader, onDeselectFile, onCloseEditor } = this.props;
    const filename = originalFile.name;
    const file = this.urltoFile(image, filename);
    localUploader.addFiles([file]);

    onDeselectFile(originalFile.id);
    onCloseEditor('Save');
  };

  private onCancel = (): void => {
    this.props.onCloseEditor('Close');
  };

  private urltoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const matches = arr[0].match(/:(.*?);/);

    if (!matches || matches.length < 2) {
      throw new Error('Failed to retrieve file from data URL');
    }

    const mime = matches[1];
    const bstr = atob(arr[1]);

    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new Blob([u8arr], { type: mime }) as any;
    file.name = filename;
    return file;
  };
}

export default connect<
  MainEditorViewStateProps,
  MainEditorViewDispatchProps,
  MainEditorViewOwnProps,
  State
>(
  ({ editorData }) => ({ editorData }),
  (dispatch) => ({
    onShowEditorError: ({ message, retryHandler }) =>
      dispatch(editorShowError(message, retryHandler)),
    onCloseEditor: (selection: Selection) => dispatch(editorClose(selection)),
    onDeselectFile: (fileId) => dispatch(deselectItem(fileId)),
  }),
)(MainEditorView);
