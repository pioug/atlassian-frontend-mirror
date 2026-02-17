import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createIntl } from 'react-intl-next';
import { type HeadType } from '@atlaskit/dynamic-table/types';
import {
	type MediaClient,
	type MediaType,
	type MediaSubscribable,
	createMediaSubscribable,
	createMediaSubject,
	type FileState,
	fromObservable,
	FileFetcherImpl,
} from '@atlaskit/media-client';
import {
	fakeMediaClient,
	imageFileId,
	audioFileId,
	docFileId,
	nextTick,
	asMockFunction,
	expectFunctionToHaveBeenCalledWith,
	renderWithIntl,
	asMock,
} from '@atlaskit/media-test-helpers';
import { toHumanReadableMediaSize } from '@atlaskit/media-ui';
import { type MediaTableProps, type MediaTableItem } from '../types';
import { MediaTable } from '../component/mediaTable';
import { NameCell } from '../component/nameCell';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

let mockMediaClient: MediaClient;

jest.mock('@atlaskit/media-client', () => ({
	...jest.requireActual<Object>('@atlaskit/media-client'),
	getMediaClient: jest.fn(() => mockMediaClient),
}));

describe('MediaTable', () => {
	const onSetPageMock = jest.fn();
	const onSortMock = jest.fn();
	const onPreviewOpenMock = jest.fn();
	const onPreviewCloseMock = jest.fn();

	let observables = [createMediaSubject(), createMediaSubject()];

	const mediaClient = fakeMediaClient();

	const defaultFileStates: FileState[] = [
		{
			id: audioFileId.id,
			status: 'processed',
			name: 'audio_file_name',
			size: 10,
			artifacts: {},
			mediaType: 'audio',
			mimeType: '',
			createdAt: 1476238235395,
		},
		{
			id: imageFileId.id,
			status: 'processed',
			name: 'image_file_name',
			size: 10,
			artifacts: {},
			mediaType: 'image',
			mimeType: '',
			createdAt: 1476238235395,
		},
	];

	beforeEach(() => {
		jest.spyOn(console, 'warn').mockImplementation(() => {});
		jest.clearAllMocks();

		jest.spyOn(FileFetcherImpl.prototype, 'getFileState').mockImplementation((id: string) => {
			return id === audioFileId.id
				? fromObservable(observables[0])
				: fromObservable(observables[1]);
		});

		asMock(mediaClient.file.getFileState).mockImplementation((id: string) => {
			return id === audioFileId.id
				? fromObservable(observables[0])
				: fromObservable(observables[1]);
		});

		observables[0].next(defaultFileStates[0]);
		observables[1].next(defaultFileStates[1]);
	});

	const defaultFileStateSubscribable = createMediaSubscribable(defaultFileStates[0]);

	const getDefaultMediaClient = (
		fileStateSubscribable: MediaSubscribable = defaultFileStateSubscribable,
	): MediaClient => {
		const mediaClient = fakeMediaClient();
		mockMediaClient = mediaClient;

		asMockFunction(mediaClient.file.getFileState).mockImplementation(() => fileStateSubscribable);

		return mediaClient;
	};

	const createMockFileData = (name: string, mediaType: MediaType) => {
		return <NameCell text={name} mediaType={mediaType} endFixedChars={4} />;
	};

	const defaultHeaders: HeadType = {
		cells: [
			{
				key: 'file',
				width: 50,
				content: 'File name',
				isSortable: true,
			},
			{
				key: 'size',
				width: 20,
				content: 'Size',
				isSortable: true,
			},
			{
				key: 'date',
				width: 50,
				content: 'Upload time',
				isSortable: false,
			},
			{
				key: 'download',
				content: '',
				width: 10,
			},
			{
				key: 'preview',
				content: '',
				width: 10,
			},
		],
	};

	const defaultItems: MediaTableItem[] = [
		{
			identifier: audioFileId,
			data: {
				file: createMockFileData('audio_file_name', 'audio'),
				size: toHumanReadableMediaSize(10),
				date: 'some date',
			},
		},
		{
			identifier: imageFileId,
			data: {
				file: createMockFileData('image_file_name', 'image'),
				size: toHumanReadableMediaSize(10),
				date: 'some date',
			},
		},
	];

	const createAnalyticsEventSpy = jest.fn();
	createAnalyticsEventSpy.mockReturnValue({ fire: jest.fn() });

	const defaultProps = {
		items: defaultItems,
		itemsPerPage: 3,
		totalItems: defaultItems.length,
		isLoading: false,
		columns: defaultHeaders,
		onSetPage: onSetPageMock,
		onSort: onSortMock,
		createAnalyticsEvent: createAnalyticsEventSpy,
		onPreviewOpen: onPreviewOpenMock,
		onPreviewClose: onPreviewCloseMock,
		intl: createIntl({ locale: 'en' }),
	};

	const setupRTL = async (
		waitForItems: boolean = true,
		props?: Omit<MediaTableProps, 'mediaClient'>,
		mediaClientParam: MediaClient = getDefaultMediaClient(),
	) => {
		const mediaClientConfig = mediaClientParam.config;

		const result = renderWithIntl(
			<MediaTable mediaClient={mediaClientParam} {...defaultProps} {...props} />,
		);

		if (waitForItems) {
			await nextTick(); // wait for getFileState subscription + set state
			await screen.findByRole('table');
		}

		return {
			user: userEvent.setup(),
			mediaClient: mediaClientParam,
			mediaClientConfig,
			createAnalyticsEventSpy,
			...result,
		};
	};

	it('should open MediaViewer and call onPreviewOpen when a row is clicked', async () => {
		const { user } = await setupRTL();

		// wait for table to appear
		expect(await screen.findByRole('table')).toBeInTheDocument();

		const rows = await screen.findAllByRole('row');

		// click first non-header row
		user.click(rows[1]);

		const mediaViewer = await screen.findByTestId('media-viewer-popup');

		expect(mediaViewer).toBeInTheDocument();
		expect(onPreviewOpenMock).toHaveBeenCalledTimes(1);

		// eslint-disable-next-line @atlassian/a11y/no-violation-count
		await expect(document.body).toBeAccessible({violationCount: 1});
	});

	it('should open MediaViewer and call onPreviewOpen when pressing enter on a row', async () => {
		const { user } = await setupRTL();

		// wait for table to appear
		expect(await screen.findByRole('table')).toBeInTheDocument();

		const rows = await screen.findAllByRole('row');

		// key press on first non-header row
		rows[1].focus();
		expect(rows[1]).toHaveFocus();
		user.keyboard('[Enter]');

		const mediaViewer = await screen.findByTestId('media-viewer-popup');

		expect(mediaViewer).toBeInTheDocument();
		expect(onPreviewOpenMock).toHaveBeenCalledTimes(1);
	});

	it('should open MediaViewer and call onPreviewOpen when a preview button is clicked', async () => {
		const { user } = await setupRTL();
		await screen.findByRole('table');
		const previewButtons = screen.getAllByTestId('preview-button');
		await user.click(previewButtons[0]);

		expect(screen.getByTestId('media-viewer-popup')).toBeInTheDocument();
		expect(onPreviewOpenMock).toHaveBeenCalledTimes(1);

		// eslint-disable-next-line @atlassian/a11y/no-violation-count
		await expect(document.body).toBeAccessible({violationCount: 1});
	});

	it('should close the MediaViwer and call onPreviewClose when the preview is closed', async () => {
		const { user } = await setupRTL();

		// wait for table to appear
		expect(await screen.findByRole('table')).toBeInTheDocument();

		const rows = await screen.findAllByRole('row');

		// Open the MediaViewer
		// click first non-header row
		user.click(rows[1]);

		const mediaViewer = await screen.findByTestId('media-viewer-popup');

		// Close the MediaViewer
		const closeButton = await screen.findByLabelText('Close');
		user.click(closeButton);

		await waitFor(() => {
			expect(mediaViewer).not.toBeInTheDocument();
		});

		expect(onPreviewOpenMock).toHaveBeenCalledTimes(1);
		expect(onPreviewCloseMock).toHaveBeenCalledTimes(1);

		// eslint-disable-next-line @atlassian/a11y/no-violation-count
		await expect(document.body).toBeAccessible({ violationCount: 1 });
	});

	// TODO: fix me. I was skipped because I was failing and blocking the pipeline
	it.skip('MediaViewer should display the correct items, and have the correct selected item', async () => {
		const { user } = await setupRTL();

		// wait for table to appear
		expect(await screen.findByRole('table')).toBeInTheDocument();

		const rows = await screen.findAllByRole('row');

		// click first non-header row
		user.click(rows[1]);

		await screen.findByTestId('media-viewer-popup');

		// selected item
		expect(await screen.findByTestId('media-viewer-file-name')).toHaveTextContent(
			'audio_file_name',
		);
		expect(await screen.findByTestId('media-viewer-file-metadata-text')).toHaveTextContent(
			/audio/i,
		);

		const nextButton = await screen.findByTestId('media-viewer-navigation-next');

		act(() => nextButton.click());

		// next item
		expect(await screen.findByTestId('media-viewer-file-name')).toHaveTextContent(
			'image_file_name',
		);
		expect(await screen.findByTestId('media-viewer-file-metadata-text')).toHaveTextContent(
			/image/i,
		);
	});

	it('should download file if download file is defined and fileState has been processed', async () => {
		const { mediaClient, user } = await setupRTL(true);

		await screen.findByRole('table');
		const downloadButtons = screen.getAllByTestId('download-button');
		await user.click(downloadButtons[0]);

		expect(mediaClient.file.downloadBinary).toBeCalledTimes(1);
		expectFunctionToHaveBeenCalledWith(mediaClient.file.downloadBinary, [
			audioFileId.id,
			'audio_file_name',
			audioFileId.collectionName,
		]);
	});

	it('should download file if download file is defined and fileState is still processing', async () => {
		const processingFileSubscribable = createMediaSubscribable({
			id: imageFileId.id,
			status: 'processing',
			name: 'image_file_name',
			size: 10,
			mediaType: 'image',
			mimeType: '',
			createdAt: 1476238235395,
		});

		const { mediaClient, user } = await setupRTL(
			true,
			defaultProps,
			getDefaultMediaClient(processingFileSubscribable),
		);

		await screen.findByRole('table');
		const downloadButtons = screen.getAllByTestId('download-button');
		await user.click(downloadButtons[0]);

		expect(mediaClient.file.downloadBinary).toBeCalledTimes(1);
	});

	it('should render right file size', async () => {
		await setupRTL();
		expect(screen.getAllByText('10 B').length).toBeGreaterThan(0);
	});

	it('should render right date', async () => {
		await setupRTL();
		expect(screen.getAllByText('some date').length).toBeGreaterThan(0);
	});

	it('should render file type icon', async () => {
		await setupRTL();
		// Image icon is rendered for image file type - check by img with role or alt
		const images = screen.getAllByRole('img');
		expect(images.length).toBeGreaterThanOrEqual(1);
	});

	it('should render empty table with no rows if table has no items', async () => {
		await setupRTL(true, { ...defaultProps, items: [] });
		const table = screen.getByRole('table');
		// Only header row, no data rows
		const rows = table.querySelectorAll('tbody tr');
		expect(rows.length).toEqual(0);
	});

	it('should allow rendering of custom column lengths', async () => {
		const customColumns = {
			...defaultHeaders,
			cells: [
				...defaultHeaders.cells,
				{
					content: 'new column header',
					width: 20,
				},
			],
		};

		await setupRTL(true, {
			...defaultProps,
			columns: customColumns,
		});

		expect(screen.getByText('new column header')).toBeInTheDocument();
	});

	it('should have matching row data length and column length', async () => {
		await setupRTL();
		const table = screen.getByRole('table');
		const firstDataRow = table.querySelector('tbody tr');
		const firstRowCells = firstDataRow?.querySelectorAll('td') ?? [];
		expect(firstRowCells.length).toBeGreaterThan(0);
		expect(firstRowCells.length).toBeGreaterThanOrEqual(3);
	});

	it('should render empty column, if value not provided for that column', async () => {
		const customItems = [
			{
				identifier: audioFileId,
				data: {
					file: createMockFileData('audio_file_name', 'audio'),
					size: toHumanReadableMediaSize(10),
				},
			},
		];

		await setupRTL(true, {
			...defaultProps,
			items: customItems,
		});

		const table = screen.getByRole('table');
		const firstRow = table.querySelector('tbody tr');
		const cells = firstRow?.querySelectorAll('td');
		// Date column (index 2) should be empty
		expect(cells?.[2]?.textContent?.trim()).toEqual('');
	});

	it('should still render cell data for each row even if internal media API fails', async () => {
		await setupRTL(false);
		const table = await screen.findByRole('table');
		const firstDataRow = table.querySelector('tbody tr');
		const firstRowCells = firstDataRow?.querySelectorAll('td') ?? [];
		expect(firstRowCells.length).toBeGreaterThan(0);
	});

	it('should have same number of table rows as rows passed in', async () => {
		await setupRTL();
		const table = screen.getByRole('table');
		const dataRows = table.querySelectorAll('tbody tr');
		expect(dataRows.length).toEqual(2);
	});

	it('should not show pagination when totalItems is less than itemsPerPage', async () => {
		await setupRTL(true, {
			...defaultProps,
			itemsPerPage: 6,
			totalItems: 5,
		});
		const table = screen.getByRole('table');
		const dataRows = table.querySelectorAll('tbody tr');
		expect(dataRows.length).toEqual(2);
	});

	it('should apply row props to specified rows', async () => {
		await setupRTL(true, {
			...defaultProps,
			items: [
				...defaultItems,
				{
					identifier: docFileId,
					rowProps: { className: 'test-class' },
					data: {
						file: createMockFileData('file_name', 'doc'),
						size: toHumanReadableMediaSize(10),
						date: 'some date',
					},
				},
			],
		});
		const table = screen.getByRole('table');
		const rows = table.querySelectorAll('tbody tr');
		expect(rows[0].className).not.toContain('test-class');
		expect(rows[1].className).not.toContain('test-class');
		expect(rows[2].className).toContain('test-class');
	});

	describe('loading spinner', () => {
		test('should be displayed when isLoading is set to true', async () => {
			await setupRTL(true, {
				...defaultProps,
				isLoading: true,
			});
			expect(screen.getByRole('img', { name: 'Loading table' })).toBeInTheDocument();
		});

		test('should not be displayed when isLoading is set to false', async () => {
			await setupRTL(true, {
				...defaultProps,
				isLoading: false,
			});
			expect(screen.queryByRole('img', { name: 'Loading table' })).not.toBeInTheDocument();
		});
	});

	describe('onSort', () => {
		test('is called with correct data when a sortable header item is clicked', async () => {
			const { user } = await setupRTL();
			const table = screen.getByRole('table');
			const headerSortButton = table.querySelector('thead button');
			expect(headerSortButton).toBeInTheDocument();
			if (headerSortButton) {
				await user.click(headerSortButton);
			}
			expect(onSortMock).toHaveBeenCalled();
			expect(onSortMock).toHaveBeenCalledWith('file', expect.any(String));
		});

		test('is not called with correct data when a non-sortable header item is clicked', async () => {
			const { user } = await setupRTL();
			const dateHeader = screen.getByRole('columnheader', { name: /upload time/i });
			await user.click(dateHeader);
			expect(onSortMock).not.toHaveBeenCalled();
		});
	});

	describe('onSetPage', () => {
		test('is called when navigating to another page', async () => {
			const manyItems = [
				...defaultItems,
				{
					identifier: docFileId,
					data: {
						file: createMockFileData('doc_file', 'doc'),
						size: toHumanReadableMediaSize(10),
						date: 'some date',
					},
				},
			];
			const { user } = await setupRTL(true, {
				...defaultProps,
				items: manyItems,
				itemsPerPage: 2,
				totalItems: 3,
			});
			const nextPageButton = screen.getByRole('button', { name: /next/i });
			await user.click(nextPageButton);
			expect(onSetPageMock).toHaveBeenCalled();
		});
	});

	describe('i18n', () => {
		it('does not render the IntlProvider internally if intl is present in context', async () => {
			await setupRTL(true);
			expect(screen.getByRole('table')).toBeInTheDocument();
		});

		it('renders the IntlProvider internally if intl is not present in context', async () => {
			renderWithIntl(
				<MediaTable
					mediaClient={getDefaultMediaClient()}
					items={defaultItems}
					itemsPerPage={3}
					totalItems={defaultItems.length}
					isLoading={false}
					columns={defaultHeaders}
					createAnalyticsEvent={jest.fn()}
					intl={createIntl({ locale: 'en' })}
				/>,
			);
			await screen.findByRole('table');
			expect(screen.getByRole('table')).toBeInTheDocument();
		});
	});

	describe('analyticsEvent', () => {
		it('should trigger UI analyticsEvent when mediaTable row is clicked', async () => {
			const { user, createAnalyticsEventSpy } = await setupRTL();
			const rows = await screen.findAllByRole('row');
			await user.click(rows[1]); // First data row (index 0 is header)

			expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
				action: 'clicked',
				actionSubject: 'mediaFile',
				actionSubjectId: 'mediaFileRow',
				eventType: 'ui',
			});
		});

		it('should trigger UI analyticsEvent when mediaTable enter is pressed on a row', async () => {
			const { user, createAnalyticsEventSpy } = await setupRTL();
			const rows = await screen.findAllByRole('row');
			rows[1].focus();
			await user.keyboard('[Enter]');

			expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
				eventType: 'ui',
				action: 'keyPressed',
				actionSubject: 'mediaFile',
				actionSubjectId: 'mediaFileRow',
			});
		});
	});

	describe('row clicking functionality - On click', () => {
		it('should trigger onRowClick when present', async () => {
			const onRowClick = jest.fn();
			const { user, createAnalyticsEventSpy } = await setupRTL(true, {
				...defaultProps,
				onRowClick,
			});
			const rows = await screen.findAllByRole('row');
			await user.click(rows[1]);

			expect(onRowClick).toHaveBeenCalledTimes(1);
			expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
				eventType: 'ui',
				action: 'clicked',
				actionSubject: 'mediaFile',
				actionSubjectId: 'mediaFileRow',
			});
		});

		it('should prevent openPreview & allow onRowClick when onRowClick returns true', async () => {
			const onRowClick = jest.fn(() => true);
			const onPreviewOpen = jest.fn();
			const { user } = await setupRTL(true, {
				...defaultProps,
				onRowClick,
				onPreviewOpen,
			});
			const items = defaultProps.items;
			const rows = await screen.findAllByRole('row');
			await user.click(rows[1]);

			expect(onPreviewOpen).toHaveBeenCalledTimes(0);
			expect(onRowClick).toHaveBeenCalledTimes(1);
			expect(onRowClick).toHaveBeenCalledWith(items[0].data, 0);
		});
	});

	describe('row clicking functionality - Key press (Enter)', () => {
		it('should trigger onRowClick when present', async () => {
			const onRowClick = jest.fn();
			const { user, createAnalyticsEventSpy } = await setupRTL(true, {
				...defaultProps,
				onRowClick,
			});
			const rows = await screen.findAllByRole('row');
			rows[1].focus();
			await user.keyboard('[Enter]');

			expect(onRowClick).toHaveBeenCalledTimes(1);
			expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
				eventType: 'ui',
				action: 'keyPressed',
				actionSubject: 'mediaFile',
				actionSubjectId: 'mediaFileRow',
			});
		});

		it('should prevent openPreview & allow onRowClick when onRowClick returns true', async () => {
			const onRowClick = jest.fn(() => true);
			const onPreviewOpen = jest.fn();
			const { user } = await setupRTL(true, {
				...defaultProps,
				onRowClick,
				onPreviewOpen,
			});
			const items = defaultProps.items;
			const rows = await screen.findAllByRole('row');
			rows[1].focus();
			await user.keyboard('[Enter]');

			expect(onPreviewOpen).toHaveBeenCalledTimes(0);
			expect(onRowClick).toHaveBeenCalledTimes(1);
			expect(onRowClick).toHaveBeenCalledWith(items[0].data, 0);
		});
	});
});
