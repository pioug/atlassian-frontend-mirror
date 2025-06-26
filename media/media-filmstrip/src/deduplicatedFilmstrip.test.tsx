import React from 'react';
import { type MediaClientConfig } from '@atlaskit/media-core';
import { getFileStreamsCache } from '@atlaskit/media-client';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers';
import { generateSampleFileItem } from '@atlaskit/media-test-data';
import { DeduplicatedFilmStrip } from './deduplicatedFilmstrip';

const imgTestId = 'media-image';
const loadingTestId = 'media-card-loading';

const dummyMediaClientConfig = {} as MediaClientConfig;

// TODO: Remove this workaround that avoids a race condition between two functions that set card status
// Tracked by + explained in more detail in https://product-fabric.atlassian.net/browse/CXP-3751
const simulateImageLoadDelay = async () => {
	await new Promise((res) => setTimeout(res, 100));
};

describe('DeduplicatedFilmstrip', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		// clear file streams cache so that the state
		// that is not managed by media-state will be reset
		getFileStreamsCache().removeAll();
	});

	it('should capture and report a11y violations', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
		const { mediaApi } = createMockedMediaApi(fileItem);
		const { container } = render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<DeduplicatedFilmStrip
					mediaClientConfig={dummyMediaClientConfig}
					items={[{ identifier }]}
					isLazy={false}
				/>
			</MockedMediaClientProvider>,
		);

		await expect(container).toBeAccessible();
	});

	it('should render the card correctly for given fileId', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
		const { mediaApi } = createMockedMediaApi(fileItem);

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<DeduplicatedFilmStrip
					mediaClientConfig={dummyMediaClientConfig}
					items={[{ identifier }]}
					isLazy={false}
				/>
			</MockedMediaClientProvider>,
		);

		// simulate that the file has been fully loaded by the browser
		const img = await screen.findByTestId(imgTestId, undefined);
		await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
		await simulateImageLoadDelay();
		fireEvent.load(img);

		// card should completely process the file
		await waitFor(async () =>
			expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
				'data-test-status',
				'complete',
			),
		);

		expect((img as HTMLImageElement).alt).toBe('name.pdf');
	});

	it('should render loaidng card when no client config is provided and not wrapped in Provider', async () => {
		render(
			<DeduplicatedFilmStrip
				items={[
					{
						identifier: {
							mediaItemType: 'file',
							id: 'some-id',
						},
					},
				]}
				isLazy={false}
			/>,
		);

		// simulate that the file has been fully loaded by the browser
		const loadingCard = await screen.findByTestId(loadingTestId, undefined);
		expect(loadingCard).toBeVisible();
	});

	it('should only render the first card if multiple cards have the same hash', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
		const [fileItem2, identifier2] = generateSampleFileItem.workingPdfWithoutRemotePreview();

		fileItem.details = {
			...fileItem.details,
			hash: 'some-hash',
		};
		fileItem2.details = {
			...fileItem2.details,
			hash: 'some-hash',
			name: 'other-name.pdf',
		};

		const { mediaApi } = createMockedMediaApi([fileItem, fileItem2]);

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<DeduplicatedFilmStrip
					mediaClientConfig={dummyMediaClientConfig}
					items={[{ identifier }, { identifier: identifier2 }]}
					isLazy={false}
				/>
			</MockedMediaClientProvider>,
		);

		// simulate that the file has been fully loaded by the browser
		const img = await screen.findByTestId(imgTestId, undefined);
		await waitFor(() => expect(img.getAttribute('src')).toBeTruthy());
		await simulateImageLoadDelay();
		fireEvent.load(img);

		// card should completely process the file
		await waitFor(async () =>
			expect(await screen.findByTestId('media-file-card-view')).toHaveAttribute(
				'data-test-status',
				'complete',
			),
		);

		expect((img as HTMLImageElement).alt).toBe('name.pdf');
		expect(screen.queryAllByAltText('other-name.pdf').length).toBe(0);
	});

	it('should render all  cards if no cards share hashes', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
		const [fileItem2, identifier2] = generateSampleFileItem.workingPdfWithoutRemotePreview();

		fileItem.details = {
			...fileItem.details,
			hash: 'some-hash',
		};
		fileItem2.details = {
			...fileItem2.details,
			hash: 'some-other-hash',
			name: 'other-name.pdf',
		};

		const { mediaApi } = createMockedMediaApi([fileItem, fileItem2]);

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<DeduplicatedFilmStrip
					mediaClientConfig={dummyMediaClientConfig}
					items={[{ identifier }, { identifier: identifier2 }]}
					isLazy={false}
				/>
			</MockedMediaClientProvider>,
		);

		// simulate that the file has been fully loaded by the browser
		const imgs = await screen.findAllByTestId(imgTestId, undefined);
		await waitFor(() => expect(imgs[0].getAttribute('src')).toBeTruthy());
		await simulateImageLoadDelay();

		expect((imgs[0] as HTMLImageElement).alt).toBe('name.pdf');
		expect((imgs[1] as HTMLImageElement).alt).toBe('other-name.pdf');
	});
});
