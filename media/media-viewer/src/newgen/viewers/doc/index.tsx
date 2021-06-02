import React from 'react';
import {
  MediaClient,
  FileState,
  isPreviewableFileState,
} from '@atlaskit/media-client';
import { Outcome } from '../../domain';
import { MediaViewerError } from '../../errors';
import { Spinner } from '../../loading';
import { Props as RendererProps } from './pdfRenderer';
import { ComponentClass } from 'react';
import { BaseViewer } from '../base-viewer';
import { getObjectUrlFromFileState } from '../../utils/getObjectUrlFromFileState';

const moduleLoader = () =>
  import(
    /* webpackChunkName: "@atlaskit-internal_media-pdf-viewer" */ './pdfRenderer'
  );

const componentLoader: () => Promise<ComponentClass<RendererProps>> = () =>
  moduleLoader().then((module) => module.PDFRenderer);

export type Props = {
  mediaClient: MediaClient;
  item: FileState;
  collectionName?: string;
  onClose?: () => void;
  onError: (error: MediaViewerError) => void;
  onSuccess: () => void;
};

export type State = {
  content: Outcome<string, MediaViewerError>;
};

export class DocViewer extends BaseViewer<string, Props> {
  static PDFComponent: ComponentClass<RendererProps>;

  protected get initialState() {
    return {
      content: Outcome.pending<string, MediaViewerError>(),
    };
  }

  protected async init() {
    if (!DocViewer.PDFComponent) {
      await this.loadDocViewer();
    }
    const { item, mediaClient, collectionName, onError } = this.props;

    if (isPreviewableFileState(item)) {
      const src = await getObjectUrlFromFileState(item);
      if (!src) {
        this.setState({
          content: Outcome.pending(),
        });
        return;
      }
      this.setState({
        content: Outcome.successful(src),
      });
    } else if (item.status === 'processed') {
      try {
        const src = await mediaClient.file.getArtifactURL(
          item.artifacts,
          'document.pdf',
          collectionName,
        );
        this.onMediaDisplayed();
        this.setState({
          content: Outcome.successful(src),
        });
      } catch (error) {
        const docError = new MediaViewerError('docviewer-fetch-url', error);
        this.setState({
          content: Outcome.failed(docError),
        });
        if (onError) {
          onError(docError);
        }
      }
    }
  }

  private async loadDocViewer() {
    DocViewer.PDFComponent = await componentLoader();
    this.forceUpdate();
  }

  protected release() {
    const { content } = this.state;
    if (!content.data) {
      return;
    }

    URL.revokeObjectURL(content.data);
  }

  protected renderSuccessful(content: string) {
    const { item, onClose, onSuccess, onError } = this.props;
    const { PDFComponent } = DocViewer;

    if (!PDFComponent) {
      return <Spinner />;
    }
    return (
      <PDFComponent
        item={item}
        src={content}
        onSuccess={onSuccess}
        onError={onError}
        onClose={onClose}
      />
    );
  }
}
