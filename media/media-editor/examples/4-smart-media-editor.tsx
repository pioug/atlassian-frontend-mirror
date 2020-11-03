import React from 'react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import { Card } from '@atlaskit/media-card';
import {
  imageFileId,
  I18NWrapper,
  createUploadMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import { FileIdentifier } from '@atlaskit/media-client';
import { SmartMediaEditor } from '../src';

interface State {
  showEditorVersion?: 'with-i18n' | 'without-i18n';
  showWithError: boolean;
  newFileIdentifier?: FileIdentifier;
}

const mediaClientConfig = createUploadMediaClientConfig();

class SmartMediaEditorExample extends React.Component<{}, State> {
  state: State = {
    showWithError: false,
  };

  openSmartEditor = (editorVersion: State['showEditorVersion']) => () => {
    this.setState({ showEditorVersion: editorVersion, showWithError: false });
  };

  openSmartEditorWithError = (
    editorVersion: State['showEditorVersion'],
  ) => () => {
    this.setState({ showEditorVersion: editorVersion, showWithError: true });
  };

  onFinish = () => {
    this.setState({ showEditorVersion: undefined });
  };

  onUploadStart = (identifier: FileIdentifier) => {
    this.setState({
      newFileIdentifier: identifier,
      showEditorVersion: undefined,
    });
  };

  private renderContent = (editorVersion: State['showEditorVersion']) => {
    const { showWithError, showEditorVersion } = this.state;

    const renderEditor = () => (
      <SmartMediaEditor
        identifier={{
          ...imageFileId,
          id: showWithError ? '🥳' : imageFileId.id,
        }}
        mediaClientConfig={mediaClientConfig}
        onFinish={this.onFinish}
        onUploadStart={this.onUploadStart}
      />
    );

    return (
      <div>
        <ButtonGroup>
          <Button onClick={this.openSmartEditor(editorVersion)}>
            Open Smart Editor
          </Button>
          <Button onClick={this.openSmartEditorWithError(editorVersion)}>
            Open Smart Editor (with an error)
          </Button>
        </ButtonGroup>

        {editorVersion && showEditorVersion === editorVersion
          ? renderEditor()
          : null}
      </div>
    );
  };

  render() {
    const { newFileIdentifier } = this.state;
    return (
      <div>
        <h3>With i18n</h3>
        <I18NWrapper>{this.renderContent('with-i18n')}</I18NWrapper>

        <h3>Without i18n</h3>
        {this.renderContent('without-i18n')}

        {newFileIdentifier ? (
          <Card
            identifier={newFileIdentifier}
            mediaClientConfig={mediaClientConfig}
          />
        ) : null}
      </div>
    );
  }
}

export default () => <SmartMediaEditorExample />;
