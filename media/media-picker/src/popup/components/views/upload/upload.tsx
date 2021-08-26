import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Card,
  CardEvent,
  CardAction,
  CardEventHandler,
} from '@atlaskit/media-card';
import {
  FileItem,
  FileDetails,
  FileIdentifier,
  getMediaTypeFromMimeType,
  MediaClient,
} from '@atlaskit/media-client';
import { RECENTS_COLLECTION } from '@atlaskit/media-client/constants';
import Spinner from '@atlaskit/spinner';
import Flag, { FlagGroup } from '@atlaskit/flag';
import AnnotateIcon from '@atlaskit/icon/glyph/media-services/annotate';
import TrashIcon from '@atlaskit/icon/glyph/trash';
import EditorInfoIcon from '@atlaskit/icon/glyph/error';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import Button from '@atlaskit/button/standard-button';
import ModalDialog, {
  ModalTransition,
  ModalBody,
  ModalTitle,
  ModalHeader,
  ModalFooter,
} from '@atlaskit/modal-dialog';
import { messages, InfiniteScroll } from '@atlaskit/media-ui';
import { isWebGLAvailable } from '../../../tools/webgl';
import { Dropzone } from './dropzone';
import { fileClick } from '../../../actions/fileClick';
import { editorShowImage } from '../../../actions/editorShowImage';
import { editRemoteImage } from '../../../actions/editRemoteImage';

import {
  FileReference,
  LocalUploadFileMetadata,
  LocalUploads,
  Recents,
  SelectedItem,
  ServiceFile,
  State,
  ServiceName,
} from '../../../domain';
import { menuDelete, menuEdit } from '../editor/phrases';
import {
  Wrapper,
  SpinnerWrapper,
  LoadingNextPageWrapper,
  CardsWrapper,
  RecentUploadsTitle,
  CardWrapper,
} from './styled';
import { removeFileFromRecents } from '../../../actions/removeFileFromRecents';
import { BrowserBase } from '../../../../components/browser/browser';
import { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';

const createEditCardAction = (
  handler: CardEventHandler,
  label: string,
): CardAction => {
  return {
    label,
    handler,
    icon: <AnnotateIcon label={menuEdit} size="medium" />,
  };
};

const createDeleteCardAction = (handler: CardEventHandler): CardAction => {
  return {
    label: menuDelete,
    handler,
    icon: <TrashIcon label={menuDelete} size="medium" />,
  };
};

const cardDimension = { width: 160, height: 108 };

interface IterableCard {
  key: string;
  card: JSX.Element;
}

export interface UploadViewOwnProps {
  readonly browserRef: React.RefObject<BrowserBase>;
  readonly mediaClient: MediaClient;
  readonly recentsCollection: string;
  readonly featureFlags?: MediaFeatureFlags;
}

export interface UploadViewStateProps {
  readonly isLoading: boolean;
  readonly recents: Recents;
  readonly uploads: LocalUploads;
  readonly selectedItems: SelectedItem[];
}

export interface UploadViewDispatchProps {
  readonly onFileClick: (
    serviceFile: ServiceFile,
    serviceName: ServiceName,
  ) => void;
  readonly onEditorShowImage: (file: FileReference, dataUri: string) => void;
  readonly onEditRemoteImage: (
    file: FileReference,
    collectionName: string,
  ) => void;
  readonly removeFileFromRecents: (id: string, occurrenceKey?: string) => void;
}

export type UploadViewProps = UploadViewOwnProps &
  UploadViewStateProps &
  UploadViewDispatchProps &
  InjectedIntlProps;

export interface UploadViewState {
  readonly hasPopupBeenVisible: boolean;
  readonly isWebGLWarningFlagVisible: boolean;
  readonly shouldDismissWebGLWarningFlag: boolean;
  readonly isLoadingNextPage: boolean;
  readonly deletionCandidate?: {
    id: string;
    occurrenceKey?: string;
  };
}

export class StatelessUploadView extends Component<
  UploadViewProps,
  UploadViewState
> {
  private mounted = false;

  state: UploadViewState = {
    hasPopupBeenVisible: false,
    isWebGLWarningFlagVisible: false,
    shouldDismissWebGLWarningFlag: false,
    isLoadingNextPage: false,
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { isLoading, browserRef, featureFlags } = this.props;
    const cards = this.renderCards();
    const isEmpty = !isLoading && cards.length === 0;

    let contentPart: JSX.Element | null = null;
    if (isLoading) {
      contentPart = this.renderLoadingView();
    } else if (!isEmpty) {
      contentPart = this.renderRecentsView(cards);
    }
    const confirmationDialog = this.renderDeleteConfirmation();

    return (
      <InfiniteScroll
        data-testid="media-picker-recents-infinite-scroll"
        height="100%"
        onThresholdReached={this.onThresholdReachedListener}
      >
        <Wrapper>
          <Dropzone
            isEmpty={isEmpty}
            browserRef={browserRef}
            featureFlags={featureFlags}
          />
          {contentPart}
          {confirmationDialog}
        </Wrapper>
      </InfiniteScroll>
    );
  }

  private renderDeleteConfirmation = () => {
    const { deletionCandidate } = this.state;
    const { removeFileFromRecents } = this.props;
    const closeDialog = () => {
      this.setState({ deletionCandidate: undefined });
    };

    if (!deletionCandidate) {
      return null;
    }

    const { id, occurrenceKey } = deletionCandidate;

    return (
      <ModalTransition>
        <ModalDialog width="small" onClose={closeDialog}>
          <ModalHeader>
            <ModalTitle appearance="danger">Delete forever?</ModalTitle>
          </ModalHeader>

          <ModalBody>
            This file is about to be permanently deleted. Once you delete, it's
            gone for good.
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                closeDialog();
              }}
              appearance="subtle"
            >
              Cancel
            </Button>
            <Button
              autoFocus
              onClick={() => {
                removeFileFromRecents(id, occurrenceKey);
                closeDialog();
              }}
              appearance="danger"
            >
              Delete permanently
            </Button>
          </ModalFooter>
        </ModalDialog>
      </ModalTransition>
    );
  };

  private onThresholdReachedListener = () => {
    const { isLoadingNextPage } = this.state;

    if (isLoadingNextPage) {
      return;
    }

    this.setState({ isLoadingNextPage: true }, async () => {
      try {
        const { mediaClient } = this.props;
        await mediaClient.collection.loadNextPage(RECENTS_COLLECTION);
      } finally {
        if (this.mounted) {
          this.setState({ isLoadingNextPage: false });
        }
      }
    });
  };

  private renderLoadingView = () => {
    return (
      <SpinnerWrapper>
        <Spinner size="large" />
      </SpinnerWrapper>
    );
  };

  private renderLoadingNextPageView = () => {
    const { isLoadingNextPage } = this.state;

    // We want to always render LoadingNextPageWrapper regardless of the next page loading or not
    // to keep the same wrapper height, this prevents jumping when interacting with the infinite scroll
    return (
      <LoadingNextPageWrapper>
        {isLoadingNextPage && <Spinner />}
      </LoadingNextPageWrapper>
    );
  };

  private renderRecentsView = (cards: JSX.Element[]) => {
    const { isWebGLWarningFlagVisible } = this.state;

    return (
      <div>
        <RecentUploadsTitle>
          <FormattedMessage {...messages.recent_uploads} />
        </RecentUploadsTitle>
        <CardsWrapper>{cards}</CardsWrapper>
        {this.renderLoadingNextPageView()}
        {isWebGLWarningFlagVisible && this.renderWebGLWarningFlag()}
      </div>
    );
  };

  public onAnnotateActionClick(callback: CardEventHandler): CardEventHandler {
    return () => {
      if (isWebGLAvailable()) {
        callback();
      } else {
        this.showWebGLWarningFlag();
      }
    };
  }

  private renderWebGLWarningFlag = (): JSX.Element => {
    const {
      intl: { formatMessage },
    } = this.props;

    return (
      <FlagGroup onDismissed={this.onFlagDismissed}>
        <Flag
          description={formatMessage(messages.webgl_warning_description)}
          icon={<EditorInfoIcon label="info" />}
          id="webgl-warning-flag"
          title={formatMessage(messages.unable_to_annotate_image)}
          actions={[
            {
              content: formatMessage(messages.learn_more),
              onClick: this.onLearnMoreClicked,
            },
          ]}
        />
      </FlagGroup>
    );
  };

  private renderCards() {
    const recentFilesCards = this.recentFilesCards();
    const uploadingFilesCards = this.uploadingFilesCards();
    return uploadingFilesCards.concat(recentFilesCards).map(({ key, card }) => (
      <CardWrapper tabIndex={0} key={key}>
        {card}
      </CardWrapper>
    ));
  }

  private uploadingFilesCards(): IterableCard[] {
    const { uploads, onFileClick, mediaClient, featureFlags } = this.props;
    const itemsKeys = Object.keys(uploads);
    itemsKeys.sort((a, b) => {
      return uploads[b].index - uploads[a].index;
    });

    const selectedIds = this.props.selectedItems
      .filter((item) => item.serviceName === 'upload')
      .map((item) => item.id);

    return itemsKeys.map((key) => {
      const item = this.props.uploads[key];
      const { file } = item;
      const mediaType = getMediaTypeFromMimeType(file.metadata.mimeType);
      const fileMetadata: LocalUploadFileMetadata = {
        ...file.metadata,
        mimeType: mediaType,
      };
      const { id, size, name, occurrenceKey } = fileMetadata;
      const selected = selectedIds.indexOf(id) > -1;
      const serviceFile: ServiceFile = {
        id,
        mimeType: mediaType,
        name,
        size,
        occurrenceKey,
        date: 0,
      };
      const onClick = () => onFileClick(serviceFile, 'upload');
      const actions: CardAction[] = [
        createDeleteCardAction(async () => {
          this.setState({
            deletionCandidate: { id, occurrenceKey },
          });
        }),
      ]; // TODO [MS-1017]: allow file annotation for uploading files

      const identifier: FileIdentifier = {
        id,
        mediaItemType: 'file',
        collectionName: RECENTS_COLLECTION,
      };

      return {
        isUploading: true,
        key: id,
        card: (
          <Card
            mediaClientConfig={mediaClient.config}
            identifier={identifier}
            dimensions={cardDimension}
            selectable={true}
            selected={selected}
            onClick={onClick}
            actions={actions}
            testId="media-picker-uploading-media-card"
            featureFlags={featureFlags}
          />
        ),
      };
    });
  }

  private recentFilesCards(): IterableCard[] {
    const {
      mediaClient,
      recents,
      recentsCollection,
      selectedItems,
      onFileClick,
      onEditRemoteImage,
      intl: { formatMessage },
      featureFlags,
    } = this.props;
    const { items } = recents;
    const selectedRecentFiles = selectedItems
      .filter((item) => item.serviceName === 'recent_files')
      .map((item) => item.id);
    const onClick = ({ mediaItemDetails }: CardEvent) => {
      const fileDetails = mediaItemDetails as FileDetails;
      if (fileDetails) {
        const { id } = fileDetails;

        onFileClick(
          {
            id,
            date: 0,
            name: fileDetails.name || '',
            mimeType: fileDetails.mimeType || '',
            size: fileDetails.size || 0,
            createdAt: fileDetails.createdAt || 0,
          },
          'recent_files',
        );
      }
    };

    const editHandler: CardEventHandler = (mediaItem?: FileItem) => {
      if (mediaItem && mediaItem.type === 'file') {
        const { id, name } = mediaItem.details;

        if (isWebGLAvailable()) {
          onEditRemoteImage(
            {
              id,
              name: name || '',
            },
            recentsCollection,
          );
        } else {
          // WebGL not available - show warning flag
          this.showWebGLWarningFlag();
        }
      }
    };

    return items.map((item) => {
      const { id, occurrenceKey, details } = item;
      const selected = selectedRecentFiles.indexOf(id) > -1;
      const actions: CardAction[] = [
        createDeleteCardAction(() => {
          this.setState({ deletionCandidate: { id, occurrenceKey } });
        }),
      ];

      if ((details as FileDetails).mediaType === 'image') {
        actions.unshift(
          createEditCardAction(editHandler, formatMessage(messages.annotate)),
        );
      }
      const identifier: FileIdentifier = {
        id,
        mediaItemType: 'file',
        collectionName: recentsCollection,
      };

      return {
        key: `${occurrenceKey}-${id}`,
        card: (
          <Card
            mediaClientConfig={mediaClient.config}
            identifier={identifier}
            dimensions={cardDimension}
            selectable={true}
            selected={selected}
            onClick={onClick}
            actions={actions}
            testId="media-picker-recent-media-card"
            featureFlags={featureFlags}
          />
        ),
      };
    });
  }

  private showWebGLWarningFlag() {
    this.setState({ isWebGLWarningFlagVisible: true });
  }

  private onFlagDismissed = () => {
    this.setState({ isWebGLWarningFlagVisible: false });
  };

  private onLearnMoreClicked = () => {
    this.setState({ shouldDismissWebGLWarningFlag: true });
    this.onFlagDismissed();
    window.open('https://get.webgl.org/');
  };
}

const mapStateToProps = (state: State): UploadViewStateProps => ({
  isLoading: state.view.isLoading,
  recents: state.recents,
  uploads: state.uploads,
  selectedItems: state.selectedItems,
});

const mapDispatchToProps = (
  dispatch: Dispatch<any>,
): UploadViewDispatchProps => ({
  onFileClick: (serviceFile, serviceName) =>
    dispatch(fileClick(serviceFile, serviceName)),
  onEditorShowImage: (file, dataUri) =>
    dispatch(editorShowImage(dataUri, file)),
  onEditRemoteImage: (file, collectionName) =>
    dispatch(editRemoteImage(file, collectionName)),
  removeFileFromRecents: (id, occurrenceKey) =>
    dispatch(removeFileFromRecents(id, occurrenceKey)),
});

export default connect<
  UploadViewStateProps,
  UploadViewDispatchProps,
  UploadViewOwnProps,
  State
>(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(StatelessUploadView));
