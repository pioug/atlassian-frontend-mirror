import React from 'react';
import {
	globalMediaEventEmitter,
	type MediaViewedEventPayload,
	type FileState,
} from '@atlaskit/media-client';
import { expectFunctionToHaveBeenCalledWith } from '@atlaskit/media-test-helpers';
import { InlinePlayer, getPreferredVideoArtifact } from '../../inlinePlayer';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { spinnerTestId, inlinePlayerTestId } from '../../../__tests__/utils/_testIDs';
import { IntlProvider } from 'react-intl-next';

import {
	createMockedMediaApi,
	createProcessingFileItem,
} from '@atlaskit/media-client/test-helpers';
import { generateSampleFileItem } from '@atlaskit/media-test-data';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import { createMockedMediaClientProvider } from '../../../__tests__/utils/mockedMediaClientProvider/_MockedMediaClientProvider';

describe('<InlinePlayer />', () => {
	// Media Client Mock
	beforeEach(() => {
		jest.spyOn(globalMediaEventEmitter, 'emit');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should render loading component when the video src is not ready', () => {
		const [fileItem, identifier] = generateSampleFileItem.workingVideo();
		const { mediaApi } = createMockedMediaApi(fileItem);

		render(
			<IntlProvider locale="en">
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<InlinePlayer
						autoplay={true}
						identifier={identifier}
						dimensions={{
							width: 10,
							height: '5%',
						}}
					/>
				</MockedMediaClientProvider>
			</IntlProvider>,
		);

		expect(screen.queryByTestId(spinnerTestId)).toBeInTheDocument();
	});

	it('should pass poster to CustomMediaPlayer when cardPreview is available', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingVideo();
		const { mediaApi } = createMockedMediaApi(fileItem);

		const user = userEvent.setup();
		const { container } = render(
			<IntlProvider locale="en">
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<InlinePlayer
						autoplay={true}
						identifier={identifier}
						cardPreview={{ dataURI: 'some-data-uri', source: 'remote' }}
					/>
				</MockedMediaClientProvider>
			</IntlProvider>,
		);
		fireEvent.load(await screen.findByTestId(inlinePlayerTestId));

		// Confirm the existence of Custom Media Player
		const playButton = await screen.findByLabelText('Play');
		expect(playButton).toBeInTheDocument();

		await user.hover(playButton);
		expect(playButton).toBeVisible();

		const videoElement = container.querySelector('video');
		const videoSrc = videoElement?.getAttribute('poster');
		expect(videoSrc).toEqual('some-data-uri');
	});

	describe('InlinePlayerWrapper', () => {
		it('should set width/height according to dimensions in the wrapper element', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const dimensions = {
				width: '80%',
				height: '20px',
			};

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<InlinePlayer autoplay={true} identifier={identifier} dimensions={dimensions} />
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			const inlinePlayer = await screen.findByTestId(inlinePlayerTestId);
			const styles = getComputedStyle(inlinePlayer);

			expect(styles.width).toBe(dimensions.width);
			expect(styles.height).toBe(dimensions.height);
		});

		it('default to 100%/auto width/height if no dimensions given', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<InlinePlayer autoplay={true} identifier={identifier} dimensions={{}} />
					</MockedMediaClientProvider>
				</IntlProvider>,
			);
			const inlinePlayer = await screen.findByTestId(inlinePlayerTestId);
			const styles = getComputedStyle(inlinePlayer);
			expect(styles.width).toBe('100%');
			expect(styles.height).toBe('auto');
		});
	});

	describe('fileState subscription', () => {
		it('should use binary from local preview when available and render custom media player', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { MockedMediaClientProvider, uploadItem, getLocalPreview } =
				createMockedMediaClientProvider({
					initialItems: fileItem,
				});

			uploadItem(fileItem, 0.5);

			const localPreview = getLocalPreview(fileItem.id);

			global.URL.createObjectURL = jest.fn(() => 'mock result of URL.createObjectURL()');

			const { container } = render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider>
						<InlinePlayer autoplay={true} identifier={identifier} />
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			// Confirm the existence of Custom Media Player
			const playButton = await screen.findByLabelText('Play');
			expect(playButton).toBeInTheDocument();

			// Check if the src is correct
			const videoElement = container.querySelector('video');
			const videoSrc = videoElement?.getAttribute('src');

			expect(global.URL.createObjectURL).toBeCalledWith((await localPreview)?.value);
			expect(videoSrc).toEqual('mock result of URL.createObjectURL()');
		});

		it('should fetch file binary if artifacts are not present and render custom media player', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { container } = render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<InlinePlayer autoplay={true} identifier={identifier} />
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			// Confirm the existence of Custom Media Player
			const playButton = await screen.findByLabelText('Play');
			expect(playButton).toBeInTheDocument();

			// Check if the src is correct
			const videoElement = container.querySelector('video');
			const videoSrc = videoElement?.getAttribute('src');
			expect(videoSrc).toEqual(`/file/${fileItem.id}/artifact/video_1280.mp4/binary`);
		});

		it('should use the file artifact if available and render custom media player', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { container } = render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<InlinePlayer autoplay={true} identifier={identifier} />
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			fireEvent.load(await screen.findByTestId(inlinePlayerTestId));

			// Confirm the existence of Custom Media Player
			const playButton = await screen.findByLabelText('Play');
			expect(playButton).toBeInTheDocument();

			// Check if the src is correct
			const videoElement = container.querySelector('video');
			const videoSrc = videoElement?.getAttribute('src');
			expect(videoSrc).toEqual(`/file/${fileItem.id}/artifact/video_1280.mp4/binary`);
		});
	});

	it('should download video binary when download button is clicked', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingVideo();
		const { mediaApi } = createMockedMediaApi(fileItem);

		const user = userEvent.setup();
		render(
			<IntlProvider locale="en">
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<InlinePlayer autoplay={true} identifier={identifier} />
				</MockedMediaClientProvider>
			</IntlProvider>,
		);

		// Get the download button and click it
		const downloadLabel = await screen.findByLabelText('download');
		await user.click(downloadLabel);

		// Expect that the emit function was called last with the correct arguments
		expect(globalMediaEventEmitter.emit).toHaveBeenLastCalledWith('media-viewed', {
			fileId: fileItem.id,
			isUserCollection: false,
			viewingLevel: 'download',
		});
	});

	it('should use binary artifact if file is processing and no other artifact is present', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingVideo();
		const { mediaApi } = createMockedMediaApi(fileItem);

		const store: any = { files: {} };
		store.files[fileItem.id] = {
			status: 'processing',
		};

		const { container } = render(
			<IntlProvider locale="en">
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<InlinePlayer autoplay={true} identifier={identifier} />
				</MockedMediaClientProvider>
			</IntlProvider>,
		);

		// Confirm the existence of Custom Media Player
		const playButton = await screen.findByLabelText('Play');
		expect(playButton).toBeInTheDocument();

		// Check if the src is correct
		const videoElement = container.querySelector('video');
		const videoSrc = videoElement?.getAttribute('src');
		expect(videoSrc).toEqual(`/file/${fileItem.id}/artifact/video_1280.mp4/binary`);
	});

	describe('getPreferredVideoArtifact()', () => {
		it('should return hd artifact if present', () => {
			const state = {
				status: 'processed',
				artifacts: {
					'video_1280.mp4': {},
					'video_640.mp4': {},
				},
			};

			expect(getPreferredVideoArtifact(state as FileState)).toEqual('video_1280.mp4');
		});

		it('should fallback to sd artifact if hd is not present', () => {
			const state = {
				status: 'processed',
				artifacts: {
					'audio.mp3': {},
					'video_640.mp4': {},
				},
			};

			expect(getPreferredVideoArtifact(state as FileState)).toEqual('video_640.mp4');
		});

		it('should work with processing status', () => {
			const state = {
				status: 'processing',
				artifacts: {
					'video_1280.mp4': {},
				},
			};

			expect(getPreferredVideoArtifact(state as FileState)).toEqual('video_1280.mp4');
		});
	});

	it('should trigger media-viewed when video is first played', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingVideo();
		const { mediaApi } = createMockedMediaApi(fileItem);

		render(
			<IntlProvider locale="en">
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<InlinePlayer autoplay={true} identifier={identifier} />
				</MockedMediaClientProvider>
			</IntlProvider>,
		);

		await screen.findByTestId(inlinePlayerTestId);

		expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
		expectFunctionToHaveBeenCalledWith(globalMediaEventEmitter.emit, [
			'media-viewed',
			{
				fileId: fileItem.id,
				viewingLevel: 'full',
			} as MediaViewedEventPayload,
		]);
	});

	it('should use mouse movement to show and hide video control area', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingVideo();
		const { mediaApi } = createMockedMediaApi(fileItem);

		const user = userEvent.setup();
		render(
			<IntlProvider locale="en">
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<InlinePlayer autoplay={true} identifier={identifier} />
				</MockedMediaClientProvider>
			</IntlProvider>,
		);
		fireEvent.load(await screen.findByTestId(inlinePlayerTestId));

		// Confirm the existence of Custom Media Player
		const playButton = await screen.findByLabelText('Play');
		expect(playButton).toBeInTheDocument();

		/*
      After the component has completed its initial rendering process, it requires waiting period for at least 2000 milliseconds before the video control bars become hidden.

      Reference: mouseMovementDelay variable in packages/media/media-ui/src/inactivityDetector/inactivityDetector.tsx
    */

		await waitFor(
			() => {
				expect(playButton).not.toBeVisible();
			},
			{ timeout: 3000 },
		);

		/*
      Afterwards, the inline player area needs to detect any mouse movement in order to re-activate the video control bars.
    */

		await user.hover(playButton);

		expect(playButton).toBeVisible();
	});

	describe('ProgressBar for video player', () => {
		it('should render ProgressBar for а video that is being played when status is uploading', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { MockedMediaClientProvider, uploadItem } = createMockedMediaClientProvider({
				initialItems: fileItem,
			});

			uploadItem(fileItem, 0.5);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider>
						<InlinePlayer autoplay={true} identifier={identifier} />
					</MockedMediaClientProvider>
				</IntlProvider>,
			);
			expect(await screen.findByRole('progressbar')).toBeInTheDocument();
		});

		it('should not render ProgressBar for а video that is being played when status is error', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			mediaApi.getItems = () => {
				throw new Error('some error');
			};

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<InlinePlayer autoplay={true} identifier={identifier} />
					</MockedMediaClientProvider>
				</IntlProvider>,
			);
			expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
		});

		it('should not render ProgressBar for а video that is being played when status is failed-processing', async () => {
			const [fileItem, identifier] = generateSampleFileItem.failedVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<InlinePlayer autoplay={true} identifier={identifier} />
					</MockedMediaClientProvider>
				</IntlProvider>,
			);
			expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
		});

		it('should not render ProgressBar for а video that is being played when status is processing', async () => {
			const [baseFileItem, identifier] = generateSampleFileItem.failedVideo();
			const fileItem = createProcessingFileItem(baseFileItem, 0);
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<InlinePlayer autoplay={true} identifier={identifier} />
					</MockedMediaClientProvider>
				</IntlProvider>,
			);
			expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
		});

		it('should not render ProgressBar for а video that is being played when status is processed', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingVideo();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<InlinePlayer autoplay={true} identifier={identifier} />
					</MockedMediaClientProvider>
				</IntlProvider>,
			);
			expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
		});
	});
});
