import React from 'react';
import { render } from '@testing-library/react';
import { type MediaClientConfig } from '@atlaskit/media-client';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers';
import { generateSampleFileItem } from '@atlaskit/media-test-data';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import * as mediaImageBaseModule from './mediaImage';
import { MediaImageWithErrorBoundary } from './mediaImageErrorBoundary';

const MediaViewerWithMediaClientSpy = jest
	.spyOn(mediaImageBaseModule, 'MediaImageWithMediaClient')
	.mockImplementation(() => {
		throw new Error('unexpected error');
	});

let wasLoading = true,
	hadError = false;

describe('MediaImageWithErrorBoundary', () => {
	it('should capture and report a11y violations', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingVideo();
		const { mediaApi } = createMockedMediaApi(fileItem);
		const { container } = render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<MediaImageWithErrorBoundary
					identifier={identifier}
					mediaClientConfig={{} as MediaClientConfig}
				>
					{({ loading, error }) => {
						wasLoading = loading;
						hadError = error;
						return <div>placeholder</div>;
					}}
				</MediaImageWithErrorBoundary>
			</MockedMediaClientProvider>,
		);

		await expect(container).toBeAccessible();
	});

	it('should catch unexpected errors', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingVideo();
		const { mediaApi } = createMockedMediaApi(fileItem);
		const { findByText } = render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<MediaImageWithErrorBoundary
					identifier={identifier}
					mediaClientConfig={{} as MediaClientConfig}
				>
					{({ loading, error }) => {
						wasLoading = loading;
						hadError = error;
						return <div>placeholder</div>;
					}}
				</MediaImageWithErrorBoundary>
			</MockedMediaClientProvider>,
		);
		expect(MediaViewerWithMediaClientSpy).toHaveBeenCalled();
		expect(wasLoading).toBe(false);
		expect(hadError).toBe(true);
		expect(await findByText('placeholder')).toBeInTheDocument();
	});
});
