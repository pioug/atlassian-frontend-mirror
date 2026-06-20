jest.mock('../../../../../analytics/events/operational/zipEntryLoadSucceeded', () => ({
	createZipEntryLoadSucceededEvent: jest.fn(),
}));
jest.mock('../../../../../analytics/events/operational/zipEntryLoadFailed', () => ({
	createZipEntryLoadFailedEvent: jest.fn(),
}));
jest.mock('../../../../../analytics/events/operational/previewUnsupported', () => ({
	createPreviewUnsupportedEvent: jest.fn(),
}));

const mockUnzip = jest.fn();

jest.mock('unzipit', () => ({
	unzip: (...args: any[]) => mockUnzip(...args),
	HTTPRangeReader: function () {
		return 'reader';
	},
}));

import React from 'react';
import { render, screen, waitFor, userEvent } from '@atlassian/testing-library';
import { IntlProvider } from 'react-intl';
import { type ProcessedFileState } from '@atlaskit/media-client';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import {
	ArchiveViewerBase,
	getArchiveEntriesFromFileState,
	type Props as ArchiveViewerProps,
} from '../../../../../viewers/archiveSidebar/archive';

import { ArchiveViewerError } from '../../../../../errors';
import { ENCRYPTED_ENTRY_ERROR_MESSAGE } from '../../../../../viewers/archiveSidebar/consts';
import { createZipEntryLoadSucceededEvent } from '../../../../../analytics/events/operational/zipEntryLoadSucceeded';
import { createPreviewUnsupportedEvent } from '../../../../../analytics/events/operational/previewUnsupported';
import { createZipEntryLoadFailedEvent } from '../../../../../analytics/events/operational/zipEntryLoadFailed';
import { MAX_FILE_SIZE_SUPPORTED_BY_CODEVIEWER } from '../../../../../item-viewer';

type EntryConfig = {
	name: string;
	isDirectory?: boolean;
	size?: number;
	blob?: jest.Mock;
};

const setUnzipEntries = (entries: EntryConfig[]) => {
	const entriesMap: Record<string, EntryConfig> = {};
	entries.forEach((entry) => {
		entriesMap[entry.name] = {
			isDirectory: false,
			blob: jest.fn().mockResolvedValue(new Blob(['data'], { type: 'application/octet-stream' })),
			...entry,
		};
	});
	mockUnzip.mockResolvedValue({ archive: 'file', entries: entriesMap });
};

describe('Archive', () => {
	const fileState: ProcessedFileState = {
		id: 'some-id',
		status: 'processed',
		name: 'file',
		size: 11222,
		mediaType: 'archive',
		mimeType: 'application/zip',
		artifacts: {},
		representations: { image: {} },
	};
	const mediaClient = fakeMediaClient();
	const collectionName = 'some-collection';

	const renderComponent = (passedProps: Partial<ArchiveViewerProps> = {}) => {
		const baseProps = {
			mediaClient,
			item: fileState,
			collectionName,
			onError: () => {},
			onSuccess: () => {},
			traceContext: { traceId: 'some-trace-id' },
		};
		const props = { ...baseProps, ...passedProps };
		return render(
			<IntlProvider locale="en">
				<ArchiveViewerBase {...props} />
			</IntlProvider>,
		);
	};

	let originalCreateObjectURL: typeof URL.createObjectURL;
	let originalRevokeObjectURL: typeof URL.revokeObjectURL;

	beforeAll(() => {
		originalCreateObjectURL = URL.createObjectURL;
		originalRevokeObjectURL = URL.revokeObjectURL;
		URL.createObjectURL = jest.fn(() => 'blob:fake-url');
		URL.revokeObjectURL = jest.fn();
	});

	afterAll(() => {
		URL.createObjectURL = originalCreateObjectURL;
		URL.revokeObjectURL = originalRevokeObjectURL;
	});

	beforeEach(() => {
		jest.clearAllMocks();
		setUnzipEntries([{ name: 'file_a.jpeg' }]);
	});

	it('should render the archive layout (sidebar + viewer area)', async () => {
		renderComponent({});
		// Sidebar entry visible after async unzip resolves
		expect(await screen.findByText('file_a.jpeg')).toBeInTheDocument();
	});

	it('should render the archive sidebar (with home/root header)', async () => {
		renderComponent({});
		expect(await screen.findByLabelText('Home')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should render content viewer area in loading state until an entry is selected', async () => {
		renderComponent({});
		// Multiple spinners may render (sidebar + viewer area)
		expect(screen.getAllByTestId('spinner-wrapper').length).toBeGreaterThan(0);
	});

	it('should leave no entry preview open after clicking the home header', async () => {
		renderComponent({});
		const homeButton = await screen.findByLabelText('Home');
		await userEvent.click(homeButton);
		expect(screen.queryByAltText('file_a.jpeg')).not.toBeInTheDocument();
		expect(screen.getByText('file_a.jpeg')).toBeInTheDocument();
	});

	it('should fire onSuccess when sidebar entries are loaded', async () => {
		const onSuccessMock = jest.fn();
		renderComponent({ onSuccess: onSuccessMock });
		await waitFor(() => {
			expect(onSuccessMock).toHaveBeenCalledTimes(1);
		});
	});

	it('should render InteractiveImg (img) when an image entry is selected', async () => {
		setUnzipEntries([
			{ name: 'file_a.jpeg', blob: jest.fn().mockResolvedValue(new Blob(['data'])) },
		]);
		renderComponent({});
		await userEvent.click(await screen.findByText('file_a.jpeg'));
		expect(await screen.findByAltText('file_a.jpeg')).toBeInTheDocument();
	});

	it('should render AudioPlayer when an audio entry is selected', async () => {
		setUnzipEntries([
			{ name: 'file_a.mp3', blob: jest.fn().mockResolvedValue(new Blob(['data'])) },
		]);
		renderComponent({});
		await userEvent.click(await screen.findByText('file_a.mp3'));
		expect(await screen.findByTestId('media-viewer-audio-content')).toBeInTheDocument();
	});

	it('should render CustomVideoPlayerWrapper when a video entry is selected', async () => {
		setUnzipEntries([
			{ name: 'file_a.mov', blob: jest.fn().mockResolvedValue(new Blob(['data'])) },
		]);
		renderComponent({});
		await userEvent.click(await screen.findByText('file_a.mov'));
		expect(await screen.findByTestId('media-viewer-video-content')).toBeInTheDocument();
	});

	it('should render NativePdfViewer (object) when a doc entry is selected', async () => {
		setUnzipEntries([
			{ name: 'file_a.doc', blob: jest.fn().mockResolvedValue(new Blob(['data'])) },
		]);
		renderComponent({});
		await userEvent.click(await screen.findByText('file_a.doc'));
		// NativePdfViewer renders an object/embed pointing at the blob URL
		await waitFor(() => {
			// eslint-disable-next-line testing-library/no-node-access
			const pdfObject = document.querySelector('object[data="blob:fake-url"]');
			expect(pdfObject).toBeInTheDocument();
		});
	});

	it('should render CodeViewRenderer when a code entry is selected', async () => {
		const src = 'Hello World';
		setUnzipEntries([
			{
				name: 'file_a.txt',
				blob: jest.fn().mockResolvedValue({
					text: jest.fn().mockResolvedValue(src),
					arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
					size: src.length,
					type: 'text/plain',
				}),
			} as any,
		]);
		renderComponent({});
		await userEvent.click(await screen.findByText('file_a.txt'));
		// CodeViewRenderer renders the code text content
		expect(await screen.findByText(src)).toBeInTheDocument();
	});

	it('should render error if selected code file size exceeds the limit', async () => {
		const src = 'Hello World';
		setUnzipEntries([
			{
				name: 'file_a.txt',
				size: (MAX_FILE_SIZE_SUPPORTED_BY_CODEVIEWER + 1) * 1024 * 1024,
				blob: jest.fn().mockResolvedValue({
					text: jest.fn().mockResolvedValue(src),
				}) as any,
			},
		]);
		renderComponent({});
		await userEvent.click(await screen.findByText('file_a.txt'));
		expect(await screen.findByTestId('media-viewer-error')).toBeInTheDocument();
		expect(createZipEntryLoadFailedEvent).toHaveBeenCalledWith(
			expect.objectContaining({ id: 'some-id' }),
			expect.objectContaining({ message: 'archiveviewer-codeviewer-file-size-exceeds' }),
			expect.objectContaining({ name: 'file_a.txt' }),
		);
	});

	it('should render error if blob() throws', async () => {
		const onErrorMock = jest.fn();
		setUnzipEntries([
			{
				name: 'file_a.doc',
				blob: jest.fn().mockImplementation(() => {
					throw new Error('some-error');
				}),
			},
		]);
		renderComponent({ onError: onErrorMock });
		await userEvent.click(await screen.findByText('file_a.doc'));
		expect(await screen.findByTestId('media-viewer-error')).toBeInTheDocument();
		expect(onErrorMock).toHaveBeenCalledWith(
			expect.objectContaining({ message: 'archiveviewer-create-url' }),
		);
	});

	it('should render error with encrypted reason if blob() throws encryption error', async () => {
		const onErrorMock = jest.fn();
		setUnzipEntries([
			{
				name: 'file_a.zip',
				blob: jest.fn().mockImplementation(() => {
					throw new Error(ENCRYPTED_ENTRY_ERROR_MESSAGE);
				}),
			},
		]);
		renderComponent({ onError: onErrorMock });
		await userEvent.click(await screen.findByText('file_a.zip'));
		expect(await screen.findByTestId('media-viewer-error')).toBeInTheDocument();
		expect(onErrorMock).toHaveBeenCalledWith(
			expect.objectContaining({ message: 'archiveviewer-encrypted-entry' }),
		);
	});

	it('should render error if blob src cannot be created (missing-name-src)', async () => {
		// Forcing URL.createObjectURL to return '' triggers the `!src` branch in
		// renderArchiveItemViewer that emits `archiveviewer-missing-name-src`.
		(URL.createObjectURL as jest.Mock).mockReturnValueOnce('');
		setUnzipEntries([
			{ name: 'file_a.jpeg', blob: jest.fn().mockResolvedValue(new Blob(['data'])) },
		]);
		renderComponent({});
		await userEvent.click(await screen.findByText('file_a.jpeg'));
		expect(await screen.findByTestId('media-viewer-error')).toBeInTheDocument();
		expect(createZipEntryLoadFailedEvent).toHaveBeenCalledWith(
			expect.objectContaining({ id: 'some-id' }),
			expect.objectContaining({ message: 'archiveviewer-missing-name-src' }),
			expect.objectContaining({ name: 'file_a.jpeg' }),
		);
	});

	it('should render Spinner when an entry is being selected (mid-load)', async () => {
		// Create a blob that never resolves to keep the entry in mid-load
		let resolveBlob: (b: Blob) => void = () => {};
		const slowBlob = new Promise<Blob>((res) => {
			resolveBlob = res;
		});
		setUnzipEntries([
			{
				name: 'file_a.jpeg',
				blob: jest.fn().mockReturnValue(slowBlob),
			},
		]);
		renderComponent({});
		await userEvent.click(await screen.findByText('file_a.jpeg'));
		// While blob is unresolved the viewer area shows a spinner
		await waitFor(() => {
			expect(screen.getAllByTestId('spinner-wrapper').length).toBeGreaterThan(0);
		});
		// Cleanup
		resolveBlob(new Blob(['data']));
	});

	describe('getArchiveEntriesFromFileState', () => {
		it('should get archive entries from fileState', async () => {
			mockUnzip.mockResolvedValue({
				archive: 'file',
				entries: { 'file_a.jpeg': { name: 'file_a.jpeg' } },
			});
			const result = await getArchiveEntriesFromFileState(fileState, mediaClient);
			expect(result).toEqual({
				archive: 'file',
				entries: {
					'file_a.jpeg': { name: 'file_a.jpeg' },
				},
			});
		});

		ffTest.on('platform_media_archive_zip_guard', 'when the zip guard is enabled', () => {
			it('throws archiveviewer-not-zip for a non-ZIP archive mime type', async () => {
				const nonZipFileState: ProcessedFileState = {
					...fileState,
					mimeType: 'application/x-rar-compressed',
				};
				await expect(getArchiveEntriesFromFileState(nonZipFileState, mediaClient)).rejects.toThrow(
					'archiveviewer-not-zip',
				);
			});

			it('throws archiveviewer-not-zip when the archive has no mimeType (regression: BMPT-7978)', async () => {
				const noMimeFileState: ProcessedFileState = {
					...fileState,
					mimeType: '',
				};
				await expect(getArchiveEntriesFromFileState(noMimeFileState, mediaClient)).rejects.toThrow(
					'archiveviewer-not-zip',
				);
			});

			it('fires a previewUnsupported (non-SLI) event - not loadFailed - for a non-ZIP archive', async () => {
				const nonZipFileState: ProcessedFileState = {
					...fileState,
					mimeType: 'application/x-7z-compressed',
				};
				renderComponent({ item: nonZipFileState });

				// The dedicated "unsupported file format" message is shown full-width.
				expect(
					await screen.findByText('Preview is not available for this file type.'),
				).toBeInTheDocument();

				// A previewUnsupported event is fired with the file state, so the
				// archive (unzipit-limited) case is distinguishable from the
				// browser-unknown case via fileAttributes.
				expect(createPreviewUnsupportedEvent).toHaveBeenCalledWith(nonZipFileState);
				// It must NOT be reported as a load failure.
				expect(createZipEntryLoadFailedEvent).not.toHaveBeenCalled();
			});
		});

		ffTest.off('platform_media_archive_zip_guard', 'when the zip guard is disabled', () => {
			it('does not short-circuit non-ZIP archives and proceeds to unzip (legacy behaviour)', async () => {
				mockUnzip.mockResolvedValue({ archive: 'file', entries: {} });
				const nonZipFileState: ProcessedFileState = {
					...fileState,
					mimeType: 'application/x-rar-compressed',
				};
				const result = await getArchiveEntriesFromFileState(nonZipFileState, mediaClient);
				expect(result).toEqual({ archive: 'file', entries: {} });
			});
		});
	});

	describe('Analytics', () => {
		it('should fire zip entry fail event if displays error', async () => {
			setUnzipEntries([
				{
					name: 'file_a.doc',
					blob: jest.fn().mockImplementation(() => {
						throw new Error('some-error');
					}),
				},
			]);
			renderComponent({});
			await userEvent.click(await screen.findByText('file_a.doc'));
			await screen.findByTestId('media-viewer-error');
			expect(createZipEntryLoadFailedEvent).toHaveBeenCalledTimes(1);
		});

		it('should fire success analytics when image viewer is loaded', async () => {
			setUnzipEntries([
				{
					name: 'file_a.jpeg',
					blob: jest.fn().mockResolvedValue(new Blob(['data'])),
				},
			]);
			renderComponent({});
			await userEvent.click(await screen.findByText('file_a.jpeg'));
			const img = await screen.findByAltText('file_a.jpeg');
			// Trigger load event on the rendered <img>
			img.dispatchEvent(new Event('load', { bubbles: true }));
			await waitFor(() => {
				expect(createZipEntryLoadSucceededEvent).toHaveBeenCalled();
			});
			expect(createZipEntryLoadSucceededEvent).toHaveBeenCalledWith(
				expect.objectContaining({ id: 'some-id' }),
				expect.objectContaining({ name: 'file_a.jpeg' }),
			);
		});
	});

	it('should call onError when the sidebar fails to load entries (unzip throws)', async () => {
		const onErrorMock = jest.fn();
		mockUnzip.mockImplementation(() => {
			throw new ArchiveViewerError('archiveviewer-read-binary');
		});
		renderComponent({ onError: onErrorMock });
		await waitFor(() => {
			expect(onErrorMock).toHaveBeenCalledTimes(1);
		});
		expect(onErrorMock).toHaveBeenCalledWith(
			expect.objectContaining({ message: 'archiveviewer-read-binary' }),
		);
	});
});
