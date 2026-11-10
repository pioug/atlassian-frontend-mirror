import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import type { MediaClient } from '@atlaskit/media-client/media-client';
import type { FileState } from '@atlaskit/media-state/file-state';

import { createDownloadButtonClickedEvent } from '../../../analytics/events/ui/downloadButtonClicked';
import { fireAnalytics } from '../../../analytics/fireAnalytics';
import { createItemDownloader } from '../../../createItemDownloader';
import { DownloadItem } from '../../../DownloadItem';

jest.mock('../../../analytics/fireAnalytics', () => ({ fireAnalytics: jest.fn() }));
jest.mock('../../../createItemDownloader', () => ({ createItemDownloader: jest.fn() }));

const processedFile: FileState = {
	id: 'some-id',
	mediaType: 'image',
	mimeType: 'image/png',
	name: 'file.png',
	size: 100,
	status: 'processed',
	artifacts: {},
};
const analyticspayload = createDownloadButtonClickedEvent(processedFile);

describe('DownloadItem', () => {
	const itemDownloader = jest.fn();
	const mediaClient = {
		config: { enforceDataSecurityPolicy: false },
		file: { downloadBinary: jest.fn() },
	} as unknown as MediaClient;

	const renderDownloadItem = (
		props: Partial<React.ComponentProps<typeof DownloadItem>> = {},
		fileState: FileState = processedFile,
	) =>
		render(
			<IntlProvider locale="en">
				<DownloadItem
					testId="download-item"
					analyticspayload={analyticspayload}
					fileState={fileState}
					mediaClient={mediaClient}
					traceContext={{ traceId: 'trace-id' }}
					{...props}
				>
					Download
				</DownloadItem>
			</IntlProvider>,
		);

	beforeEach(() => {
		jest.clearAllMocks();
		jest.mocked(createItemDownloader).mockReturnValue(itemDownloader);
	});

	it('should download the file, and fire the click analytics, without onDownload', async () => {
		renderDownloadItem({ collectionName: 'some-collection', fallbackMediaName: 'fallback.png' });

		fireEvent.click(screen.getByTestId('download-item'));

		expect(createItemDownloader).toHaveBeenCalledWith(
			processedFile,
			mediaClient,
			expect.objectContaining({
				collectionName: 'some-collection',
				fallbackMediaName: 'fallback.png',
				traceContext: { traceId: 'trace-id' },
			}),
		);
		expect(itemDownloader).toHaveBeenCalledTimes(1);
		expect(fireAnalytics).toHaveBeenCalledWith(analyticspayload, expect.any(Function));
		await expect(document.body).toBeAccessible();
	});

	it('should call onDownload instead of downloading the file, and still fire the click analytics', () => {
		const onDownload = jest.fn();
		renderDownloadItem({ onDownload });

		fireEvent.click(screen.getByTestId('download-item'));

		expect(onDownload).toHaveBeenCalledTimes(1);
		expect(createItemDownloader).not.toHaveBeenCalled();
		expect(itemDownloader).not.toHaveBeenCalled();
		expect(mediaClient.file.downloadBinary).not.toHaveBeenCalled();
		expect(fireAnalytics).toHaveBeenCalledWith(analyticspayload, expect.any(Function));
	});

	it('should call onDownload once the abuse warning is confirmed', () => {
		const onDownload = jest.fn();
		renderDownloadItem({ onDownload }, { ...processedFile, abuseClassification: {} } as FileState);

		fireEvent.click(screen.getByTestId('download-item'));
		expect(onDownload).not.toHaveBeenCalled();

		fireEvent.click(screen.getByRole('button', { name: 'Proceed with download' }));

		expect(onDownload).toHaveBeenCalledTimes(1);
		expect(createItemDownloader).not.toHaveBeenCalled();
	});
});
