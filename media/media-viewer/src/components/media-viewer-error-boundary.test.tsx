import React from 'react';
import { render } from '@testing-library/react';
import { type MediaClientConfig } from '@atlaskit/media-core';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers';
import { generateSampleFileItem } from '@atlaskit/media-test-data';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import * as mediaViewerBaseModule from './media-viewer';
import { MediaViewerWithErrorBoundary } from './media-viewer-error-boundary';

const MediaViewerWithMediaClientSpy = jest
	.spyOn(mediaViewerBaseModule, 'MediaViewerWithMediaClient')
	.mockImplementation(() => {
		throw new Error('unexpected error');
	});

describe('MediaViewerWithErrorBoundary', () => {
	it('should catch unexpected errors', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingVideo();
		const { mediaApi } = createMockedMediaApi(fileItem);
		const { findByText } = render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<MediaViewerWithErrorBoundary
					selectedItem={identifier}
					collectionName=""
					items={[]}
					mediaClientConfig={{} as MediaClientConfig}
				/>
				<div>placeholder</div>
			</MockedMediaClientProvider>,
		);
		expect(MediaViewerWithMediaClientSpy).toHaveBeenCalled();
		expect(await findByText('placeholder')).toBeInTheDocument();
	});
});
