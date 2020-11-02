import React, { ComponentClass } from 'react';
import {
  MediaClient,
  FileState,
  isErrorFileState,
} from '@atlaskit/media-client';
import { Outcome } from '../../domain';
import ErrorMessage, {
  createError,
  MediaViewerError,
  ErrorName,
} from '../../error';
import { Spinner } from '../../loading';
import { Props as RendererProps } from './codeViewerRenderer';
import { BaseViewer } from '../base-viewer';
import { DEFAULT_LANGUAGE } from './util';
import { getLanguageType, getExtension } from '@atlaskit/media-ui/codeViewer';
import { msgToText } from './msg-parser';

const moduleLoader = () =>
  import(
    /* webpackChunkName: "@atlaskit-internal_media-viewer-code-viewer" */ './codeViewerRenderer'
  );

const componentLoader: () => Promise<ComponentClass<RendererProps>> = () =>
  moduleLoader().then(module => module.CodeViewRenderer);

export type Props = {
  mediaClient: MediaClient;
  item: FileState;
  collectionName?: string;
  onClose?: () => void;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
};

export class CodeViewer extends BaseViewer<string, Props> {
  static CodeViewerComponent: ComponentClass<RendererProps>;

  private renderError(errorName: ErrorName) {
    return <ErrorMessage error={createError(errorName)} />;
  }

  protected get initialState() {
    return {
      content: Outcome.pending<string, MediaViewerError>(),
    };
  }

  protected async init() {
    if (!CodeViewer.CodeViewerComponent) {
      await this.loadCodeViewer();
    }
    const { item, mediaClient, collectionName, onError } = this.props;

    if (item.status === 'processed' || item.status === 'processing') {
      try {
        const downloadUrl = await mediaClient.file.getFileBinaryURL(
          item.id,
          collectionName,
        );
        const response = await fetch(downloadUrl);
        const ext = getExtension(item.name);

        // Pass through EmailViewer logic
        if (ext === 'msg') {
          const arrayBuffer = await response.arrayBuffer();
          const src = msgToText(arrayBuffer);
          // email contents parsed successfully
          if (typeof src === 'string') {
            this.onMediaDisplayed();
            this.setState({
              content: Outcome.successful(src),
            });
          } else {
            //email contents could not be parsed
            this.setState({
              content: Outcome.failed(createError('previewFailed')),
            });
            return this.renderError('previewFailed');
          }
        } else {
          const src = await response.text();
          this.onMediaDisplayed();
          this.setState({
            content: Outcome.successful(src),
          });
        }
      } catch (err) {
        this.setState({
          content: Outcome.failed(createError('previewFailed', err, item)),
        });
        if (onError) {
          onError(err);
        }
      }
    }
  }

  private async loadCodeViewer() {
    CodeViewer.CodeViewerComponent = await componentLoader();
    this.forceUpdate();
  }

  private getCodeLanguage(item: FileState) {
    if (!isErrorFileState(item)) {
      return getLanguageType(item.name);
    }
    return DEFAULT_LANGUAGE;
  }

  protected release() {}

  protected renderSuccessful(content: string) {
    const { onClose, onSuccess, onError } = this.props;
    const { CodeViewerComponent } = CodeViewer;

    if (!CodeViewerComponent) {
      return <Spinner />;
    }

    return (
      <CodeViewerComponent
        src={content}
        language={this.getCodeLanguage(this.props.item) || DEFAULT_LANGUAGE}
        onSuccess={onSuccess}
        onError={onError}
        onClose={onClose}
      />
    );
  }
}
