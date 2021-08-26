import React from 'react';
import uuidV4 from 'uuid/v4';
import { Subscription } from 'rxjs/Subscription';

import {
  intlShape,
  IntlProvider,
  injectIntl,
  InjectedIntlProps,
} from 'react-intl';

import {
  withAnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

import {
  MediaClient,
  UploadableFile,
  FileIdentifier,
  MediaStore,
} from '@atlaskit/media-client';
// Importing from own entry-point, since we dont' want to bring whole media-client at this point
import { RECENTS_COLLECTION } from '@atlaskit/media-client/constants';
import { messages, Shortcut } from '@atlaskit/media-ui';
import Button from '@atlaskit/button/standard-button';
import ModalDialog, {
  ModalTransition,
  ModalBody,
  ModalTitle,
  ModalHeader,
  ModalFooter,
} from '@atlaskit/modal-dialog';
import Spinner from '@atlaskit/spinner';

import EditorView from './editorView/editorView';
import { Blanket, SpinnerWrapper } from './styled';
import { fileToBase64, fireAnalyticsEvent } from '../util';
import ErrorView from './editorView/errorView/errorView';
import { CancelInputType, Dimensions, ShapeParameters, Tool } from '../common';

import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import { start, end } from 'perf-marks';

export const convertFileNameToPng = (fileName?: string) => {
  if (!fileName) {
    return 'annotated-image.png';
  }
  if (fileName.endsWith('.png')) {
    return fileName;
  } else {
    if (fileName.lastIndexOf('.') === 0 || fileName.lastIndexOf('.') === -1) {
      return `${fileName}.png`;
    } else {
      return `${fileName.substring(0, fileName.lastIndexOf('.'))}.png`;
    }
  }
};

export interface SmartMediaEditorProps {
  identifier: FileIdentifier;
  mediaClient: MediaClient;
  onUploadStart?: (identifier: FileIdentifier, dimensions: Dimensions) => void;
  onFinish?: (identifier: FileIdentifier) => void;
  onClose?: () => void;
}

export interface SmartMediaEditorState {
  hasError: boolean;
  errorMessage?: any;
  imageUrl?: string;
  hasBeenEdited: boolean;
  closeIntent: boolean;
}

export class SmartMediaEditor extends React.Component<
  SmartMediaEditorProps & InjectedIntlProps & WithAnalyticsEventsProps,
  SmartMediaEditorState
> {
  fileName?: string;
  state: SmartMediaEditorState = {
    hasError: false,
    hasBeenEdited: false,
    closeIntent: false,
  };
  getFileSubscription?: Subscription;
  uploadFileSubscription?: Subscription;

  static contextTypes = {
    intl: intlShape,
  };

  private getFileUnsubscribeTimeoutId: number | undefined;
  private uploadFileUnsubscribeTimeoutId: number | undefined;

  componentDidMount() {
    const { identifier } = this.props;
    this.getFile(identifier);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Readonly<SmartMediaEditorProps>) {
    const { identifier, mediaClient } = this.props;
    if (
      nextProps.identifier.id !== identifier.id ||
      nextProps.mediaClient !== mediaClient
    ) {
      this.getFile(nextProps.identifier);
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.getFileUnsubscribeTimeoutId);
    window.clearTimeout(this.uploadFileUnsubscribeTimeoutId);

    const { getFileSubscription, uploadFileSubscription } = this;
    if (getFileSubscription) {
      getFileSubscription.unsubscribe();
    }
    if (uploadFileSubscription) {
      uploadFileSubscription.unsubscribe();
    }
  }

  getFile = (identifier: FileIdentifier) => {
    const { mediaClient } = this.props;
    const { collectionName, occurrenceKey } = identifier;
    const { id } = identifier;
    const getFileSubscription = mediaClient.file
      .getFileState(id, { collectionName, occurrenceKey })
      .subscribe({
        next: async (state) => {
          if (state.status === 'error') {
            this.onError(state.message);
            this.getFileUnsubscribeTimeoutId = window.setTimeout(
              () => getFileSubscription.unsubscribe(),
              0,
            );
            return;
          }

          const { name, preview, status } = state;
          this.fileName = name;

          if (status === 'processed') {
            this.setRemoteImageUrl(identifier);
            this.getFileUnsubscribeTimeoutId = window.setTimeout(
              () => getFileSubscription.unsubscribe(),
              0,
            );
          } else if (preview) {
            const { value } = await preview;
            if (value instanceof Blob) {
              const imageUrl = await fileToBase64(value);
              this.setState({
                imageUrl,
              });
            } else {
              this.setState({
                imageUrl: value,
              });
            }

            this.getFileUnsubscribeTimeoutId = window.setTimeout(
              () => getFileSubscription.unsubscribe(),
              0,
            );
          }
        },
        error: (error) => {
          this.onError(error);
        },
      });
    this.getFileSubscription = getFileSubscription;
  };

  setRemoteImageUrl = async (identifier: FileIdentifier) => {
    const { mediaClient } = this.props;
    const { id } = identifier;
    const imageUrl = await mediaClient.getImageUrl(id, {
      collection: identifier.collectionName,
      mode: 'full-fit',
    });
    this.setState({
      imageUrl,
    });
  };

  copyFileToUserCollection = async (fileId: string) => {
    const {
      mediaClient: {
        config: { userAuthProvider, authProvider },
        file,
      },
      identifier: { collectionName },
    } = this.props;

    if (userAuthProvider) {
      const source = {
        id: fileId,
        collection: collectionName,
        authProvider,
      };
      const destination = {
        collection: RECENTS_COLLECTION,
        authProvider: userAuthProvider,
        occurrenceKey: uuidV4(),
        mediaStore: new MediaStore({
          authProvider: userAuthProvider,
        }),
      };
      await file.copyFile(source, destination);
    }
  };

  private onSave = (imageData: string, dimensions: Dimensions) => {
    const { fileName } = this;
    const {
      mediaClient,
      identifier,
      onUploadStart,
      onFinish,
      intl: { formatMessage },
    } = this.props;
    const { hasBeenEdited } = this.state;

    const { collectionName } = identifier;
    const uploadableFile: UploadableFile = {
      content: imageData,
      collection: collectionName,
      name: convertFileNameToPng(fileName),
    };
    const id = uuidV4();
    const occurrenceKey = uuidV4();
    const touchedFiles = mediaClient.file.touchFiles(
      [
        {
          fileId: id,
          collection: collectionName,
          occurrenceKey,
        },
      ],
      collectionName,
    );
    const deferredUploadId = touchedFiles.then(
      (touchedFiles) => touchedFiles.created[0].uploadId,
    );
    const uploadableFileUpfrontIds = {
      id,
      deferredUploadId,
      occurrenceKey,
    };

    const uploadingFileState = mediaClient.file.upload(
      uploadableFile,
      undefined,
      uploadableFileUpfrontIds,
    );
    const newFileIdentifier: FileIdentifier = {
      id,
      collectionName,
      mediaItemType: 'file',
      occurrenceKey,
    };

    start('MediaEditor.MediaAnnotation.Uploaded');

    fireAnalyticsEvent(
      {
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'saveButton',
        attributes: {
          annotated: hasBeenEdited,
        },
      },
      this.props.createAnalyticsEvent,
    );

    const uploadingFileStateSubscription = uploadingFileState.subscribe({
      next: (fileState) => {
        if (fileState.status === 'processing') {
          this.copyFileToUserCollection(fileState.id).then(() => {
            if (onFinish) {
              onFinish(newFileIdentifier);
            }
            const { duration } = end('MediaEditor.MediaAnnotation.Uploaded');

            fireAnalyticsEvent(
              {
                eventType: 'track',
                action: 'uploaded',
                actionSubject: 'media',
                actionSubjectId: id,
                attributes: {
                  status: 'success',
                  fileStatus: fileState.status,
                  fileMediatype: fileState.mediaType,
                  fileMimetype: fileState.mimeType,
                  fileSize: fileState.size,
                  uploadDurationMsec: duration,
                  annotated: hasBeenEdited,
                },
              },
              this.props.createAnalyticsEvent,
            );

            this.uploadFileUnsubscribeTimeoutId = window.setTimeout(
              () => uploadingFileStateSubscription.unsubscribe(),
              0,
            );
          });
        } else if (
          fileState.status === 'failed-processing' ||
          fileState.status === 'error'
        ) {
          this.onError(formatMessage(messages.could_not_save_image));
          this.uploadFileUnsubscribeTimeoutId = window.setTimeout(
            () => uploadingFileStateSubscription.unsubscribe(),
            0,
          );

          const { duration } = end('MediaEditor.MediaAnnotation.Uploaded');
          fireAnalyticsEvent(
            {
              eventType: 'track',
              action: 'uploaded',
              actionSubject: 'media',
              actionSubjectId: id,
              attributes: {
                status: 'fail',
                failReason: formatMessage(messages.could_not_save_image),
                fileStatus: fileState.status,
                uploadDurationMsec: duration,
                annotated: hasBeenEdited,
              },
            },
            this.props.createAnalyticsEvent,
          );
        }
      },
    });
    if (onUploadStart) {
      onUploadStart(newFileIdentifier, dimensions);
    }
  };

  private onAnyEdit = (tool: Tool, shapeParameters: ShapeParameters) => {
    const { hasBeenEdited } = this.state;

    fireAnalyticsEvent(
      {
        eventType: 'ui',
        action: 'annotated',
        actionSubject: 'annotation',
        actionSubjectId: tool,
        attributes: shapeParameters,
      },
      this.props.createAnalyticsEvent,
    );

    if (!hasBeenEdited) {
      this.setState({ hasBeenEdited: true });
    }
  };

  private closeConfirmationDialog = () => {
    this.setState({ closeIntent: false });
  };

  private closeAnyway = () => {
    const { onClose } = this.props;
    const { hasBeenEdited } = this.state;
    this.closeConfirmationDialog();

    fireAnalyticsEvent(
      {
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'confirmCancelButton',
        attributes: {
          annotated: hasBeenEdited,
        },
      },
      this.props.createAnalyticsEvent,
    );

    if (onClose) {
      onClose();
    }
  };

  private renderDeleteConfirmation = () => {
    const {
      intl: { formatMessage },
    } = this.props;
    const { closeIntent } = this.state;

    if (closeIntent) {
      return (
        <ModalTransition>
          <ModalDialog width="small" onClose={this.closeConfirmationDialog}>
            <ModalHeader>
              <ModalTitle appearance="danger">
                {formatMessage(messages.annotate_confirmation_heading)}
              </ModalTitle>
            </ModalHeader>

            <ModalBody>
              {formatMessage(messages.annotate_confirmation_content)}
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={this.closeConfirmationDialog}
                appearance="subtle"
              >
                {formatMessage(messages.cancel)}
              </Button>
              <Button autoFocus onClick={this.closeAnyway} appearance="danger">
                {formatMessage(messages.annotate_confirmation_close_anyway)}
              </Button>
            </ModalFooter>
          </ModalDialog>
        </ModalTransition>
      );
    }
    return null;
  };

  onCancel = (input: CancelInputType) => {
    const { hasBeenEdited } = this.state;
    const { onClose } = this.props;

    fireAnalyticsEvent(
      {
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'cancelButton',
        attributes: {
          annotated: hasBeenEdited,
          input,
        },
      },
      this.props.createAnalyticsEvent,
    );

    if (hasBeenEdited) {
      this.setState({ closeIntent: true });
    } else if (onClose) {
      onClose();
    }
  };

  onError = (error: any) => {
    this.setState({
      hasError: true,
      errorMessage: error,
    });
  };

  private clickShellNotPass = (e: React.SyntheticEvent<HTMLDivElement>) => {
    // Stop click from propagating back to the editor.
    // Without it editor will get focus and apply all the key events
    e.stopPropagation();
  };

  renderLoading = () => {
    return (
      <SpinnerWrapper>
        <Spinner size="large" appearance="invert" />
      </SpinnerWrapper>
    );
  };

  renderEditor = (imageUrl: string) => {
    return (
      <EditorView
        imageUrl={imageUrl}
        onSave={this.onSave}
        onCancel={this.onCancel}
        onError={this.onError}
        onAnyEdit={this.onAnyEdit}
      />
    );
  };

  renderError = (error: any) => {
    const { onClose } = this.props;
    if (error instanceof Error) {
      error = error.message;
    }
    return <ErrorView message={error} onCancel={onClose || (() => {})} />;
  };

  render() {
    const { imageUrl, hasError, errorMessage } = this.state;

    const content = hasError
      ? this.renderError(errorMessage)
      : imageUrl
      ? this.renderEditor(imageUrl)
      : this.renderLoading();

    return (
      <Blanket onClick={this.clickShellNotPass}>
        {this.renderDeleteConfirmation()}
        <Shortcut keyCode={27} handler={() => this.onCancel('esc')} />
        {content}
      </Blanket>
    );
  }
}

export default class SmartMediaEditorWithAnalytics extends React.Component<
  SmartMediaEditorProps
> {
  render() {
    const Component = withAnalyticsContext({
      packageName,
      packageVersion,
    })(withAnalyticsEvents()(injectIntl(SmartMediaEditor)));
    const content = <Component {...this.props} />;
    return this.context.intl ? (
      content
    ) : (
      <IntlProvider locale="en">{content}</IntlProvider>
    );
  }
}
