jest.mock('../../../../../analytics/events/operational/zipEntryLoadSucceeded', () => ({
	createZipEntryLoadSucceededEvent: jest.fn(),
}));
jest.mock('../../../../../analytics/events/operational/zipEntryLoadFailed', () => ({
	createZipEntryLoadFailedEvent: jest.fn(),
}));
jest.mock('../../../../../analytics/events/operational/previewUnsupported', () => ({
	createPreviewUnsupportedEvent: jest.fn(),
}));

jest.mock('../../../../../errorMessageWithAnalytics', () => {
	const React = require('react');
	const actual = jest.requireActual('../../../../../errorMessageWithAnalytics');
	return {
		__esModule: true,
		default: jest.fn((props: any) => React.createElement(actual.default, props)),
	};
});
jest.mock('../../../../../styleWrappers', () => {
	const React = require('react');
	const actual = jest.requireActual('../../../../../styleWrappers');
	return {
		...actual,
		ItemStage: jest.fn(({ children }: any) =>
			React.createElement(
				'div',
				{ 'data-testid': 'item-stage' },
				React.createElement(actual.ItemStage, null, children),
			),
		),
		CustomMediaPlayerWrapper: jest.fn((props: any) =>
			React.createElement(actual.CustomMediaPlayerWrapper, props),
		),
		AudioPlayer: jest.fn((props: any) => React.createElement(actual.AudioPlayer, props)),
		DefaultCoverWrapper: jest.fn((props: any) =>
			React.createElement(actual.DefaultCoverWrapper, props),
		),
		CustomAudioPlayerWrapper: jest.fn((props: any) =>
			React.createElement(actual.CustomAudioPlayerWrapper, props),
		),
	};
});
// The frames render only the player they're given, with the props a frame passes it, so the tests
// can see which of the archive viewer's own wrappers it uses.
const mockInsetVideoPlayerProps = { controlsPortalElement: null, onVideoElementChange: () => {} };
const mockInsetAudioPlayerProps = { controlsPortalElement: null };
jest.mock('../../../../../viewers/inset-video-frame', () => ({
	...jest.requireActual('../../../../../viewers/inset-video-frame'),
	InsetVideoFrame: jest.fn(({ renderPlayer }: any) => renderPlayer(mockInsetVideoPlayerProps)),
}));
jest.mock('../../../../../viewers/inset-audio-frame', () => ({
	...jest.requireActual('../../../../../viewers/inset-audio-frame'),
	InsetAudioFrame: jest.fn(({ renderPlayer }: any) => renderPlayer(mockInsetAudioPlayerProps)),
}));
jest.mock('@atlaskit/media-ui/customMediaPlayer', () => {
	const React = require('react');
	const actual = jest.requireActual('@atlaskit/media-ui/customMediaPlayer');
	return {
		...actual,
		CustomMediaPlayer: jest.fn((props: any) =>
			React.createElement(actual.CustomMediaPlayer, props),
		),
	};
});
jest.mock('../../../../../DownloadItem', () => {
	const original = jest.requireActual('../../../../../DownloadItem');
	return { ...original, DownloadItem: jest.fn(original.DownloadItem) };
});
jest.mock('../../../../../viewers/archiveSidebar/download-archive-entry', () => ({
	downloadArchiveEntry: jest.fn(),
}));
jest.mock('../../../../../viewers/archiveSidebar/nativePdfViewer', () => ({
	...jest.requireActual('../../../../../viewers/archiveSidebar/nativePdfViewer'),
	canRenderInNativePdfViewer: jest.fn(),
}));

const mockUnzip = jest.fn();

jest.mock('unzipit', () => ({
	unzip: (...args: any[]) => mockUnzip(...args),
	HTTPRangeReader: function () {
		return 'reader';
	},
}));

import React from 'react';

import { IntlProvider } from 'react-intl';

import type { ProcessedFileState } from '@atlaskit/media-state/file-state';
import { fakeMediaClient } from '@atlaskit/media-test-helpers/fakeMediaClient';
import { CustomMediaPlayer } from '@atlaskit/media-ui/customMediaPlayer';
import { messages as i18nMessages } from '@atlaskit/media-ui/messages';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render, waitFor } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';
import { within } from '@atlassian/testing-library/within';

import { createPreviewUnsupportedEvent } from '../../../../../analytics/events/operational/previewUnsupported';
import { createZipEntryLoadFailedEvent } from '../../../../../analytics/events/operational/zipEntryLoadFailed';
import { createZipEntryLoadSucceededEvent } from '../../../../../analytics/events/operational/zipEntryLoadSucceeded';
import { ArchiveViewerError } from '../../../../../ArchiveViewerError';
import { DownloadItem } from '../../../../../DownloadItem';
import ErrorMessage from '../../../../../errorMessageWithAnalytics';
import { InsetViewerProvider, useHasArchiveColumn } from '../../../../../insetViewerContext';
import { MAX_FILE_SIZE_SUPPORTED_BY_CODEVIEWER } from '../../../../../item-viewer';
import {
	AudioPlayer,
	CustomAudioPlayerWrapper,
	CustomMediaPlayerWrapper,
	DefaultCoverWrapper,
} from '../../../../../styleWrappers';
import type { Props as ArchiveViewerProps } from '../../../../../viewers/archiveSidebar/archive';
import { ArchiveViewer } from '../../../../../viewers/archiveSidebar/archive';
import { ArchiveViewerBase } from '../../../../../viewers/archiveSidebar/archive-viewer-base';
import { ENCRYPTED_ENTRY_ERROR_MESSAGE } from '../../../../../viewers/archiveSidebar/consts';
import { downloadArchiveEntry } from '../../../../../viewers/archiveSidebar/download-archive-entry';
import { getArchiveEntriesFromFileState } from '../../../../../viewers/archiveSidebar/get-archive-entries-from-file-state';
import { canRenderInNativePdfViewer } from '../../../../../viewers/archiveSidebar/nativePdfViewer';
import { InsetAudioFrame } from '../../../../../viewers/inset-audio-frame';
import { InsetVideoFrame } from '../../../../../viewers/inset-video-frame';

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

	it('should render CustomMediaPlayerWrapper when a video entry is selected', async () => {
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
		failGate('platform_media_too_large_preview_state');
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

	it('shows the size-aware "too large" copy for an oversized zip entry when the gate is on, without changing analytics', async () => {
		passGate('platform_media_too_large_preview_state');
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

		// Visual copy changes to the dedicated "too large" heading.
		expect(
			screen.getByText(i18nMessages.file_too_large_to_preview.defaultMessage as string),
		).toBeInTheDocument();
		expect(
			screen.queryByText(i18nMessages.couldnt_load_file.defaultMessage as string),
		).not.toBeInTheDocument();

		// The archive's own zipEntryLoadFailed analytics firing (with supressAnalytics on
		// ErrorMessage) is unaffected by the gate - only the rendered copy changes.
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

		describe('platform_media_archive_zip_guard is on when the zip guard is enabled', () => {
			beforeEach(() => {
				passGate('platform_media_archive_zip_guard');
			});

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

		describe('platform_media_archive_zip_guard is off when the zip guard is disabled', () => {
			it('does not short-circuit non-ZIP archives and proceeds to unzip (legacy behaviour)', async () => {
				failGate('platform_media_archive_zip_guard');

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

	describe('in the inset viewer', () => {
		const ArchiveColumnProbe = () => (
			<span data-testid="has-archive-column">{String(useHasArchiveColumn())}</span>
		);

		const renderInset = (passedProps: Partial<ArchiveViewerProps> = {}) => {
			const props = {
				mediaClient,
				item: fileState,
				collectionName,
				onError: () => {},
				onSuccess: () => {},
				traceContext: { traceId: 'some-trace-id' },
				...passedProps,
			};
			const tree = (showViewer: boolean) => (
				<IntlProvider locale="en">
					<InsetViewerProvider isInsetViewer>
						<ArchiveColumnProbe />
						{showViewer && <ArchiveViewer {...props} />}
					</InsetViewerProvider>
				</IntlProvider>
			);
			const { rerender } = render(tree(true));
			return { unmountViewer: () => rerender(tree(false)) };
		};

		const lastErrorMessageProps = () => {
			const calls = (ErrorMessage as unknown as jest.Mock).mock.calls;
			return calls[calls.length - 1][0];
		};

		beforeEach(() => {
			// The wrapped viewer has real analytics, which need an event to fire.
			const analyticsEvent = {
				eventType: 'operational',
				actionSubject: 'mediaViewer',
				action: 'some-action',
				attributes: {},
			};
			(createPreviewUnsupportedEvent as jest.Mock).mockReturnValue(analyticsEvent);
			(createZipEntryLoadFailedEvent as jest.Mock).mockReturnValue(analyticsEvent);
			(createZipEntryLoadSucceededEvent as jest.Mock).mockReturnValue(analyticsEvent);
			(downloadArchiveEntry as jest.Mock).mockResolvedValue(undefined);
		});

		it('should show the spinner in the item stage, then the empty state until an entry is picked', async () => {
			renderInset();

			// While the zip is read, the spinner is centred in the item stage.
			expect(
				within(screen.getByTestId('item-stage')).getByTestId('spinner-wrapper'),
			).toBeInTheDocument();

			// Once the list loads, and before anything is picked, the empty state replaces it.
			expect(await screen.findByTestId('archive-empty-state')).toBeInTheDocument();
			expect(screen.queryByTestId('item-stage')).not.toBeInTheDocument();
			await expect(document.body).toBeAccessible();
		});

		it('should set the archive column flag while the layout is mounted and clear it after', async () => {
			const { unmountViewer } = renderInset();

			expect(screen.getByTestId('has-archive-column')).toHaveTextContent('true');

			unmountViewer();

			expect(screen.getByTestId('has-archive-column')).toHaveTextContent('false');
		});

		it('should render video and audio in the inset frames, not the overlay viewer wrappers', async () => {
			setUnzipEntries([{ name: 'file_a.mov' }, { name: 'file_b.mp3' }]);
			renderInset();

			// Picking a video renders it in the inset video frame, and the player gets the entry and
			// whatever the frame passes it.
			await userEvent.click(await screen.findByText('file_a.mov'));
			await waitFor(() =>
				expect(InsetVideoFrame).toHaveBeenCalledWith(
					expect.objectContaining({ 'data-testid': 'media-viewer-video-content' }),
					expect.anything(),
				),
			);
			expect(InsetAudioFrame).not.toHaveBeenCalled();
			expect(CustomMediaPlayer).toHaveBeenLastCalledWith(
				expect.objectContaining({
					type: 'video',
					src: 'blob:fake-url',
					isAutoPlay: false,
					...mockInsetVideoPlayerProps,
				}),
				expect.anything(),
			);

			// Picking audio renders it in the inset audio frame instead.
			await userEvent.click(screen.getByText('file_b.mp3'));
			await waitFor(() => expect(InsetAudioFrame).toHaveBeenCalled());
			expect(CustomMediaPlayer).toHaveBeenLastCalledWith(
				expect.objectContaining({
					type: 'audio',
					src: 'blob:fake-url',
					isAutoPlay: false,
					...mockInsetAudioPlayerProps,
				}),
				expect.anything(),
			);

			// Neither uses the wrappers the overlay viewer renders the players in.
			expect(CustomMediaPlayerWrapper).not.toHaveBeenCalled();
			expect(AudioPlayer).not.toHaveBeenCalled();
			expect(DefaultCoverWrapper).not.toHaveBeenCalled();
			expect(CustomAudioPlayerWrapper).not.toHaveBeenCalled();
		});

		it('should show the unsupported error, and report previewUnsupported once, for documents the native viewer cannot show', async () => {
			// The browser can't show either entry in its PDF viewer.
			(canRenderInNativePdfViewer as jest.Mock).mockReturnValue(false);
			setUnzipEntries([{ name: 'file_a.docx' }, { name: 'file_b.pdf' }]);
			renderInset();

			// Picking the first shows the unsupported error in the item stage, and reports it once.
			await userEvent.click(await screen.findByText('file_a.docx'));
			expect(
				within(await screen.findByTestId('item-stage')).getByTestId('media-viewer-error'),
			).toBeInTheDocument();
			expect(lastErrorMessageProps().error).toEqual(
				expect.objectContaining({ primaryReason: 'archiveviewer-unsupported' }),
			);
			expect(createPreviewUnsupportedEvent).toHaveBeenCalledTimes(1);
			expect(createPreviewUnsupportedEvent).toHaveBeenLastCalledWith(fileState);

			// Picking the second reports it again, once, and never as a failed load.
			await userEvent.click(screen.getByText('file_b.pdf'));
			await waitFor(() => expect(createPreviewUnsupportedEvent).toHaveBeenCalledTimes(2));
			expect(lastErrorMessageProps().error).toEqual(
				expect.objectContaining({ primaryReason: 'archiveviewer-unsupported' }),
			);
			expect(canRenderInNativePdfViewer).toHaveBeenLastCalledWith('application/pdf');
			expect(createZipEntryLoadFailedEvent).not.toHaveBeenCalled();
		});

		it('should render the native pdf viewer for a pdf the browser can show', async () => {
			(canRenderInNativePdfViewer as jest.Mock).mockReturnValue(true);
			setUnzipEntries([{ name: 'file_a.pdf' }]);
			renderInset();

			await userEvent.click(await screen.findByText('file_a.pdf'));

			expect(await screen.findByTestId('native-pdf-viewer')).toBeInTheDocument();
			expect(canRenderInNativePdfViewer).toHaveBeenLastCalledWith('application/pdf');
			expect(createPreviewUnsupportedEvent).not.toHaveBeenCalled();
		});

		it('should offer to download an entry that failed to preview, and report a failed download', async () => {
			const onError = jest.fn();
			setUnzipEntries([
				{
					name: 'dir/file_a.txt',
					size: (MAX_FILE_SIZE_SUPPORTED_BY_CODEVIEWER + 1) * 1024 * 1024,
					blob: jest.fn().mockResolvedValue({ text: jest.fn().mockResolvedValue('src') }) as any,
				},
			]);
			renderInset({ onError });

			// A text file too big for the code viewer, inside a folder, shows the error view.
			await userEvent.click(await screen.findByText('dir/'));
			await userEvent.click(await screen.findByText('file_a.txt'));

			// Its Download button is the inset viewer's themed button, and downloads that entry under its
			// own name, without the folder.
			const stage = await screen.findByTestId('item-stage');
			expect(DownloadItem).toHaveBeenCalledWith(
				expect.objectContaining({
					testId: 'media-viewer-error-download-button',
					variant: 'insetText',
				}),
				expect.anything(),
			);
			await userEvent.click(within(stage).getByTestId('media-viewer-error-download-button'));
			expect(downloadArchiveEntry).toHaveBeenCalledWith(
				expect.objectContaining({ name: 'dir/file_a.txt' }),
				'file_a.txt',
				'some-id',
			);
			expect(onError).not.toHaveBeenCalled();

			// A download that fails is reported through onError.
			const downloadError = new Error('download failed');
			(downloadArchiveEntry as jest.Mock).mockRejectedValueOnce(downloadError);
			await userEvent.click(screen.getByTestId('media-viewer-error-download-button'));
			await waitFor(() => expect(onError).toHaveBeenCalledWith(downloadError));
		});

		it('should not offer to download an entry that could not be read', async () => {
			setUnzipEntries([
				{
					name: 'file_a.jpeg',
					blob: jest.fn().mockImplementation(() => {
						throw new Error(ENCRYPTED_ENTRY_ERROR_MESSAGE);
					}),
				},
				{
					name: 'file_b.doc',
					blob: jest.fn().mockImplementation(() => {
						throw new Error('some-error');
					}),
				},
			]);
			renderInset();

			// An encrypted entry can't be read, so there's nothing to download.
			await userEvent.click(await screen.findByText('file_a.jpeg'));
			await waitFor(() =>
				expect(lastErrorMessageProps().error).toEqual(
					expect.objectContaining({ primaryReason: 'archiveviewer-encrypted-entry' }),
				),
			);
			expect(screen.queryByTestId('media-viewer-error-download-button')).not.toBeInTheDocument();

			// Nor is there for an entry whose read failed for any other reason.
			await userEvent.click(screen.getByText('file_b.doc'));
			await waitFor(() =>
				expect(lastErrorMessageProps().error).toEqual(
					expect.objectContaining({ primaryReason: 'archiveviewer-create-url' }),
				),
			);
			expect(screen.getByTestId('media-viewer-error')).toBeInTheDocument();
			expect(screen.queryByTestId('media-viewer-error-download-button')).not.toBeInTheDocument();
		});
	});
});
