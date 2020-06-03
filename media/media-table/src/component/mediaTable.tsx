import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from 'react';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import {
  Identifier,
  isFileIdentifier,
  withMediaClient,
  isProcessedFileState,
} from '@atlaskit/media-client';
import { N40 } from '@atlaskit/theme/colors';
import { RowType, RowCellType } from '@atlaskit/dynamic-table/types';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import Button from '@atlaskit/button';
import { MediaViewer, MediaViewerDataSource } from '@atlaskit/media-viewer';
import { MediaTableWrapper } from './styled';
import { Subscription } from 'rxjs/Subscription';
import {
  RowData,
  OnSortData,
  MediaTableProps,
  MediaTableState,
} from '../types';
import { generateRowValues, getValidTableProps } from '../util';

export class MediaTable extends Component<MediaTableProps, MediaTableState> {
  state: MediaTableState = {
    fileInfoState: new Map(),
  };

  private subscriptions: Subscription[] = [];
  private hasBeenMounted: boolean = false;

  componentDidMount() {
    this.hasBeenMounted = true;
    const { items, mediaClient } = this.props;

    items.forEach(async item => {
      const { id, data } = item;
      const collectionName = data.collectionName || '';

      const subscription = mediaClient.file
        .getFileState(id, { collectionName })
        .subscribe({
          next: fileState => {
            const { fileInfoState } = this.state;

            if (isProcessedFileState(fileState)) {
              fileInfoState.set(id, { fileName: fileState.name, id });
              if (this.hasBeenMounted) {
                this.safeSetState({ fileInfoState });
              }
            }
          },
        });

      this.subscriptions.push(subscription);
    });
  }

  private unsubscribe = () => {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  };

  componentWillUnmount() {
    this.hasBeenMounted = false;
    this.unsubscribe();
  }

  private generateCellValues = (data: RowData, id: string): RowCellType[] => {
    const cellValues: RowCellType[] = [];
    const { columns } = this.props;

    columns.cells.forEach(cell => {
      const content = (cell.key && data[cell.key]) || '';
      cellValues.push({
        key: cell.key,
        content:
          cell.key === 'download' ? this.renderDownloadButton(id) : content,
      });
    });

    return cellValues;
  };

  private onDownloadClick = (id: string) => (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    event.stopPropagation();
    const { mediaClient } = this.props;
    const { fileInfoState } = this.state;
    const nameInfo = fileInfoState.get(id);
    mediaClient.file.downloadBinary(
      id,
      nameInfo ? nameInfo.fileName : '',
      this.getCollectionName(id),
    );
  };

  private onSort = (data: OnSortData) => {
    const { onSort } = this.props;
    const { key, sortOrder, item } = data;
    item && item.isSortable && onSort && onSort(key, sortOrder);
  };

  private renderDownloadButton = (id: string) => {
    return (
      <Button
        appearance="subtle"
        iconAfter={<DownloadIcon label="download" />} // TODO [BENTO-6295]: add i18n key
        onClick={this.onDownloadClick(id)}
        theme={(current, themeProps) => ({
          buttonStyles: {
            ...current(themeProps).buttonStyles,
            minWidth: 'max-content',
            marginRight: '4px',
            '&:hover': {
              background: N40,
            },
          },
          spinnerStyles: current(themeProps).spinnerStyles,
        })}
      />
    );
  };

  private renderRowValues = (
    validItemsPerPage: number,
    validPageNumber: number,
    validTotalItems: number,
  ) => {
    const { items } = this.props;

    const rowValues: RowType[] = [];

    items.forEach(item => {
      const { data, id } = item;

      rowValues.push({
        cells: this.generateCellValues(data, id),
        key: id,
        onClick: this.onRowClick(id),
      });
    });

    return generateRowValues(
      rowValues,
      validItemsPerPage,
      validPageNumber,
      validTotalItems,
    );
  };

  private renderTable = () => {
    const {
      columns,
      itemsPerPage,
      isLoading,
      pageNumber,
      onSetPage,
      totalItems,
      items,
    } = this.props;

    const {
      validItemsPerPage,
      validPageNumber,
      validTotalItems,
    } = getValidTableProps(items.length, itemsPerPage, pageNumber, totalItems);

    const rowsPerPage =
      validTotalItems <= validItemsPerPage ? undefined : validItemsPerPage;

    return (
      <DynamicTableStateless
        caption={''}
        head={columns}
        rows={this.renderRowValues(
          validItemsPerPage,
          validPageNumber,
          validTotalItems,
        )}
        rowsPerPage={rowsPerPage}
        page={validPageNumber}
        loadingSpinnerSize="large"
        isLoading={isLoading}
        sortKey="term"
        sortOrder="ASC"
        onSort={this.onSort}
        onSetPage={onSetPage}
      />
    );
  };

  private transformToFileIdentifier = (id: string): Identifier => {
    return {
      id,
      mediaItemType: 'file',
      collectionName: this.getCollectionName(id),
    };
  };

  private getCollectionName = (id: string) => {
    const { items } = this.props;
    const item = items.find(itemData => {
      return itemData.id === id;
    });

    return (item && item.data.collectionName) || '';
  };

  private onRowClick = (selectedId: string) => () => {
    const fileIdentifer = this.transformToFileIdentifier(selectedId);

    this.safeSetState({ mediaViewerSelectedItem: fileIdentifer });
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
    const { mediaClient, items } = this.props;

    if (!mediaViewerSelectedItem) {
      return null;
    }

    const fileIdentifiers = items.map(item =>
      this.transformToFileIdentifier(item.id),
    );
    const dataSource: MediaViewerDataSource = {
      list: fileIdentifiers,
    };

    const collectionName =
      (isFileIdentifier(mediaViewerSelectedItem) &&
        mediaViewerSelectedItem.collectionName) ||
      '';
    return ReactDOM.createPortal(
      <MediaViewer
        mediaClientConfig={mediaClient.config}
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
