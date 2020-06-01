import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from 'react';
import DynamicTable from '@atlaskit/dynamic-table';
import dateformat from 'dateformat';
import {
  Identifier,
  isFileIdentifier,
  FileState,
  MediaClient,
  FileIdentifier,
  ErrorFileState,
  isErrorFileState,
  withMediaClient,
} from '@atlaskit/media-client';
import { RowType, RowCellType, HeadType } from '@atlaskit/dynamic-table/types';
import { MediaClientConfig } from '@atlaskit/media-core';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import Button from '@atlaskit/button';
import { MediaViewer, MediaViewerDataSource } from '@atlaskit/media-viewer';
import { MediaTypeIcon } from '@atlaskit/media-ui/media-type-icon';
import { toHumanReadableMediaSize } from '@atlaskit/media-ui';
import { Subscription } from 'rxjs/Subscription';
import { NameCell, NameCellWrapper, MediaTableWrapper } from './styled';

export interface MediaTableItem {
  identifier: Identifier;
}

export interface MediaTableProps {
  items: MediaTableItem[];
  mediaClientConfig: MediaClientConfig;
  mediaClient: MediaClient;
}

export interface MediaTableState {
  fileStates: Map<string, FileState>;
  mediaViewerSelectedItem?: Identifier;
}

const head: HeadType = {
  cells: [
    {
      key: 'file',
      width: 50,
      content: 'File', // TODO [BENTO-6295]: add i18n key
      isSortable: true,
    },
    {
      key: 'size',
      width: 20,
      content: 'Size', // TODO [BENTO-6295]: add i18n key
      isSortable: true,
    },
    {
      key: 'date',
      width: 50,
      content: 'Upload time', // TODO [BENTO-6295]: add i18n key
      isSortable: true,
    },
    {
      content: '',
      width: 10,
    },
  ],
};

export class MediaTable extends Component<MediaTableProps, MediaTableState> {
  state: MediaTableState = {
    fileStates: new Map(),
  };

  private hasBeenMounted: boolean = false;
  private subscriptions: Subscription[] = [];

  componentDidMount() {
    const { items, mediaClient } = this.props;
    this.hasBeenMounted = true;
    items.forEach(async item => {
      const { identifier } = item;
      // TODO [BENTO-6295]: support external identifiers
      if (!isFileIdentifier(identifier)) {
        return;
      }

      const id = await identifier.id;

      const subscription = mediaClient.file
        .getFileState(id, { collectionName: identifier.collectionName })
        .subscribe({
          next: fileState => {
            const { fileStates } = this.state;
            const isEmptyFile =
              fileState.status === 'processing' &&
              !fileState.name &&
              !fileState.size;

            if (isEmptyFile) {
              fileStates.set(id, this.createErrorFileState(id, 'empty file'));
            } else {
              fileStates.set(id, fileState);
            }

            if (this.hasBeenMounted) {
              this.safeSetState({
                fileStates,
              });
            }
          },
          error: error => {
            const { fileStates } = this.state;
            fileStates.set(id, this.createErrorFileState(id, error));
            this.safeSetState({
              fileStates,
            });
          },
        });

      this.subscriptions.push(subscription);
    });
  }

  componentWillUnmount() {
    this.hasBeenMounted = false;
    this.unsubscribe();
  }

  private unsubscribe = () => {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  };

  private createErrorFileState = (
    id: string,
    message?: string,
  ): ErrorFileState => ({
    id,
    status: 'error',
    message,
  });

  private renderCells = (
    fileState: Exclude<FileState, ErrorFileState>,
  ): RowCellType[] => {
    const { name, mediaType, size, createdAt } = fileState;
    const icon = <MediaTypeIcon type={mediaType} />;
    const fileSize = toHumanReadableMediaSize(size);

    return [
      {
        key: name,
        content: (
          <NameCellWrapper>
            {icon}{' '}
            <NameCell>
              <span>{name}</span>
            </NameCell>
          </NameCellWrapper>
        ),
      },
      {
        key: size,
        content: fileSize,
      },
      {
        key: createdAt,
        content: dateformat(createdAt),
      },
      {
        key: 'download',
        content: this.renderDownloadButton(fileState),
      },
    ];
  };

  private onDownloadClick = (fileState: FileState) => (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    event.stopPropagation();
    const { mediaClient } = this.props;
    const name = isErrorFileState(fileState) ? '' : fileState.name;
    const collectionName = this.getCollectionFromFileState(fileState);

    mediaClient.file.downloadBinary(fileState.id, name, collectionName);
  };

  private renderDownloadButton = (fileState: FileState) => {
    return (
      <Button
        iconAfter={<DownloadIcon label="download" />} // TODO [BENTO-6295]: add i18n key
        onClick={this.onDownloadClick(fileState)}
      />
    );
  };

  private getCollectionFromFileState = (
    fileState: FileState,
  ): string | undefined => {
    const { items } = this.props;
    const item = items.find(
      item =>
        isFileIdentifier(item.identifier) &&
        item.identifier.id === fileState.id,
    );

    return item && item.identifier && isFileIdentifier(item.identifier)
      ? item.identifier.collectionName
      : undefined;
  };

  private isLoading = (): boolean => {
    const { fileStates } = this.state;
    const { items } = this.props;
    const ids = items.map(
      ({ identifier }) => (identifier as FileIdentifier).id,
    );
    const uniqueIds = ids.filter(
      (id, currentIndex) => ids.indexOf(id) === currentIndex,
    );

    return uniqueIds.length > fileStates.size;
  };

  private renderTable = () => {
    const { fileStates } = this.state;
    const rows: RowType[] = [];

    fileStates.forEach(fileState => {
      if (isErrorFileState(fileState)) {
        return;
      }

      rows.push({
        cells: this.renderCells(fileState),
        key: fileState.id,
        onClick: this.onRowClick(fileState),
      });
    });

    return (
      <DynamicTable
        head={head}
        rows={rows}
        rowsPerPage={10}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={this.isLoading()}
        isFixedSize
        defaultSortKey="file"
        defaultSortOrder="ASC"
      />
    );
  };

  private onRowClick = (fileState: FileState) => () => {
    const { items } = this.props;
    const selectedItem = items.find(item => {
      if (isFileIdentifier(item.identifier)) {
        return item.identifier.id === fileState.id;
      }

      return false;
    });

    if (selectedItem) {
      this.safeSetState({
        mediaViewerSelectedItem: selectedItem.identifier,
      });
    }
  };

  private safeSetState = (state: Partial<MediaTableState>) => {
    if (this.hasBeenMounted) {
      this.setState(state as Pick<MediaTableState, keyof MediaTableState>);
    }
  };

  private onMediaViewerClose = () => {
    this.safeSetState({
      mediaViewerSelectedItem: undefined,
    });
  };

  private renderMediaViewer = (): React.ReactPortal | null => {
    const { mediaViewerSelectedItem } = this.state;
    const { mediaClientConfig, items } = this.props;

    if (!mediaViewerSelectedItem) {
      return null;
    }

    const fileIdentifiers = items.map(item => item.identifier);
    const dataSource: MediaViewerDataSource = {
      list: fileIdentifiers,
    };
    const collectionName =
      (isFileIdentifier(mediaViewerSelectedItem) &&
        mediaViewerSelectedItem.collectionName) ||
      '';

    return ReactDOM.createPortal(
      <MediaViewer
        mediaClientConfig={mediaClientConfig}
        dataSource={dataSource}
        selectedItem={mediaViewerSelectedItem}
        onClose={this.onMediaViewerClose}
        collectionName={collectionName}
      />,
      document.body,
    );
  };

  render() {
    return (
      <MediaTableWrapper>
        {this.renderTable()}
        {this.renderMediaViewer()}
      </MediaTableWrapper>
    );
  }
}

export default withMediaClient(MediaTable);
