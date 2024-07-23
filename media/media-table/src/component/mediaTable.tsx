/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IntlProvider, injectIntl, type WrappedComponentProps } from 'react-intl-next';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import { type RowType, type RowCellType } from '@atlaskit/dynamic-table/types';
import {
	isFileIdentifier,
	isProcessedFileState,
	type FileIdentifier,
	type MediaSubscription,
} from '@atlaskit/media-client';
import { withMediaClient } from '@atlaskit/media-client-react';
import { MediaViewer } from '@atlaskit/media-viewer';
import { mediaTableWrapperStyles } from './styles';
import DownloadButton from './downloadButton';
import PreviewButton from './previewButton';
import {
	type RowData,
	type OnSortData,
	type MediaTableProps,
	type MediaTableState,
} from '../types';
import {
	generateRowValues,
	getValidTableProps,
	generateHeadValues,
	CELL_KEY_DOWNLOAD,
	CELL_KEY_PREVIEW,
	ANALYTICS_MEDIA_CHANNEL,
} from '../util';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

export class MediaTable extends Component<
	MediaTableProps & WrappedComponentProps,
	MediaTableState
> {
	state: MediaTableState = {
		fileInfoState: new Map(),
	};

	private subscriptions: MediaSubscription[] = [];
	private hasBeenMounted: boolean = false;

	componentDidMount() {
		this.hasBeenMounted = true;
		const { items, mediaClient } = this.props;

		items.forEach(async (item) => {
			const {
				identifier: { id, collectionName = '' },
			} = item;

			const subscription = mediaClient.file.getFileState(id, { collectionName }).subscribe({
				next: (fileState) => {
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
		this.subscriptions.forEach((subscription) => subscription.unsubscribe());
		this.subscriptions = [];
	};

	componentWillUnmount() {
		this.hasBeenMounted = false;
		this.unsubscribe();
	}

	private generateCellValues = (data: RowData, identifier: FileIdentifier): RowCellType[] => {
		const cellValues: RowCellType[] = [];
		const { columns } = this.props;

		columns.cells.forEach((cell) => {
			const content =
				cell.key === CELL_KEY_DOWNLOAD ? (
					<DownloadButton onClick={this.onDownloadClick(identifier)} />
				) : cell.key === CELL_KEY_PREVIEW ? (
					<PreviewButton onClick={this.onPreviewClick(identifier)} />
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

	private onDownloadClick =
		(identifier: FileIdentifier) => (event: React.MouseEvent<HTMLElement>) => {
			const { id, collectionName } = identifier;
			event.stopPropagation();
			const { mediaClient } = this.props;
			const { fileInfoState } = this.state;
			const nameInfo = fileInfoState.get(id);
			mediaClient.file.downloadBinary(id, nameInfo ? nameInfo.fileName : '', collectionName);
		};

	private onPreviewClick =
		(identifier: FileIdentifier) => (event: React.MouseEvent<HTMLElement>) => {
			event.stopPropagation();
			this.openPreview(identifier);
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

		const rowValues: RowType[] = items.map((item, index) => {
			const { data, identifier, rowProps } = item;
			return {
				cells: this.generateCellValues(data, identifier),
				key: identifier.id,
				tabIndex: 0,
				onClick: this.onRowClick(identifier, data, index),
				onKeyPress: (event) => {
					if (event.key === 'Enter') {
						this.onRowEnterKeyPressed(identifier, data, index);
					}
				},
				...rowProps,
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
			highlightedRowIndex,
		} = this.props;

		const { validItemsPerPage, validPageNumber, validTotalItems } = getValidTableProps(
			items.length,
			itemsPerPage,
			pageNumber,
			totalItems,
		);

		const rowsPerPage = validTotalItems <= validItemsPerPage ? undefined : validItemsPerPage;

		return (
			<DynamicTableStateless
				caption={''}
				head={generateHeadValues(columns)}
				rows={this.renderRowValues(validItemsPerPage, validPageNumber, validTotalItems)}
				rowsPerPage={rowsPerPage}
				page={validPageNumber}
				loadingSpinnerSize="large"
				isLoading={isLoading}
				sortKey={sortKey}
				sortOrder={sortOrder}
				onSort={this.onSort}
				onSetPage={onSetPage}
				isFixedSize
				highlightedRowIndex={highlightedRowIndex}
			/>
		);
	};

	private openPreview = (identifier: FileIdentifier) => {
		const { onPreviewOpen } = this.props;

		this.safeSetState({ mediaViewerSelectedItem: identifier });
		onPreviewOpen && onPreviewOpen();
	};

	private onRowEnterKeyPressed = (identifier: FileIdentifier, data: RowData, index: number) => {
		const { createAnalyticsEvent, onRowClick } = this.props;

		const ev = createAnalyticsEvent({
			eventType: 'ui',
			action: 'keyPressed',
			actionSubject: 'mediaFile',
			actionSubjectId: 'mediaFileRow',
		});
		ev.fire(ANALYTICS_MEDIA_CHANNEL);

		const shouldPreventDefaultRowClick = onRowClick?.(data, index);

		if (!shouldPreventDefaultRowClick) {
			this.openPreview(identifier);
		}
	};

	private onRowClick = (identifier: FileIdentifier, data: RowData, index: number) => () => {
		const { createAnalyticsEvent, onRowClick } = this.props;

		const ev = createAnalyticsEvent({
			eventType: 'ui',
			action: 'clicked',
			actionSubject: 'mediaFile',
			actionSubjectId: 'mediaFileRow',
		});
		ev.fire(ANALYTICS_MEDIA_CHANNEL);

		const shouldPreventDefaultRowClick = onRowClick?.(data, index);

		if (!shouldPreventDefaultRowClick) {
			this.openPreview(identifier);
		}
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

		const mediaViewerItems = items.map((item) => item.identifier);

		const collectionName =
			(isFileIdentifier(mediaViewerSelectedItem) && mediaViewerSelectedItem.collectionName) || '';
		return ReactDOM.createPortal(
			<MediaViewer
				mediaClientConfig={mediaClient.config}
				items={mediaViewerItems}
				selectedItem={mediaViewerSelectedItem}
				onClose={this.onMediaViewerClose}
				collectionName={collectionName}
			/>,
			document.body,
		);
	};

	render() {
		const content = (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<div css={mediaTableWrapperStyles}>
				{this.renderTable()}
				{this.renderMediaViewer()}
			</div>
		);

		return this.props.intl ? content : <IntlProvider locale="en">{content}</IntlProvider>;
	}
}

export default withMediaClient(
	withAnalyticsEvents()(injectIntl(MediaTable, { enforceContext: false })),
);
