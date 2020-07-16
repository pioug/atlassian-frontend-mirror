import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider, intlShape } from 'react-intl';
import { Subscription } from 'rxjs/Subscription';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import { RowType, RowCellType } from '@atlaskit/dynamic-table/types';
import {
  isFileIdentifier,
  withMediaClient,
  isProcessedFileState,
} from '@atlaskit/media-client';
import { MediaViewer, MediaViewerDataSource } from '@atlaskit/media-viewer';
import { MediaTableWrapper } from './styled';
import DownloadButton from './downloadButton';
import {
  RowData,
  OnSortData,
  MediaTableProps,
  MediaTableState,
  FileIdentifier,
} from '../types';
import { generateRowValues, getValidTableProps } from '../util';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { ANALYTICS_MEDIA_CHANNEL } from '@atlaskit/media-viewer/src/components/media-viewer-analytics-error-boundary';

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
      const {
        identifier: { id, collectionName = '' },
      } = item;

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

  private generateCellValues = (
    data: RowData,
    identifier: FileIdentifier,
  ): RowCellType[] => {
    const cellValues: RowCellType[] = [];
    const { columns } = this.props;

    columns.cells.forEach(cell => {
      const content =
        cell.key === 'download' ? (
          <DownloadButton onClick={this.onDownloadClick(identifier)} />
        ) : (
          (cell.key && data[cell.key]) || ''
        );
      cellValues.push({
        key: cell.key,
        content,
      });
    });

    return cellValues;
  };

  private onDownloadClick = (identifier: FileIdentifier) => (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    const { id, collectionName } = identifier;
    event.stopPropagation();
    const { mediaClient } = this.props;
    const { fileInfoState } = this.state;
    const nameInfo = fileInfoState.get(id);
    mediaClient.file.downloadBinary(
      id,
      nameInfo ? nameInfo.fileName : '',
      collectionName,
    );
  };

  private onSort = (data: OnSortData) => {
    const { onSort } = this.props;
    const { key, sortOrder, item } = data;
    item && item.isSortable && onSort && onSort(key, sortOrder);
  };

  private renderRowValues = (
    validItemsPerPage: number,
    validPageNumber: number,
    validTotalItems: number,
  ) => {
    const { items, columns } = this.props;

    const rowValues: RowType[] = items.map(item => {
      const { data, identifier } = item;

      return {
        cells: this.generateCellValues(data, identifier),
        key: identifier.id,
        onClick: this.onRowClick(identifier),
      };
    });

    return generateRowValues({
      itemsPerPage: validItemsPerPage,
      pageNumber: validPageNumber,
      totalItems: validTotalItems,
      rowValues,
      headerCells: columns.cells,
    });
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
      sortKey,
      sortOrder,
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
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={this.onSort}
        onSetPage={onSetPage}
        isFixedSize
      />
    );
  };

  private onRowClick = (identifier: FileIdentifier) => () => {
    const { createAnalyticsEvent, onPreviewOpen } = this.props;
    const ev = createAnalyticsEvent({
      eventType: 'ui',
      action: 'clicked',
      actionSubject: 'mediaFile',
      actionSubjectId: 'mediaFileRow',
    });
    ev.fire(ANALYTICS_MEDIA_CHANNEL);
    this.safeSetState({ mediaViewerSelectedItem: identifier });
    onPreviewOpen && onPreviewOpen();
  };

  private safeSetState = (state: Partial<MediaTableState>) => {
    if (this.hasBeenMounted) {
      this.setState(state as Pick<MediaTableState, keyof MediaTableState>);
    }
  };

  private onMediaViewerClose = () => {
    const { onPreviewClose } = this.props;
    this.safeSetState({ mediaViewerSelectedItem: undefined });
    onPreviewClose && onPreviewClose();
  };

  private renderMediaViewer = (): React.ReactPortal | null => {
    const { mediaViewerSelectedItem } = this.state;
    const { mediaClient, items } = this.props;

    if (!mediaViewerSelectedItem) {
      return null;
    }

    const dataSource: MediaViewerDataSource = {
      list: items.map(item => item.identifier),
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

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const content = (
      <MediaTableWrapper>
        {this.renderTable()}
        {this.renderMediaViewer()}
      </MediaTableWrapper>
    );

    return this.context.intl ? (
      content
    ) : (
      <IntlProvider locale="en">{content}</IntlProvider>
    );
  }
}

export default withMediaClient(withAnalyticsEvents()(MediaTable));
