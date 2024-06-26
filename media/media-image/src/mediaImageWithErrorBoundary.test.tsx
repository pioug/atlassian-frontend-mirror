jest.mock('@atlaskit/media-file-preview', () => {
	const actualModule = jest.requireActual('@atlaskit/media-file-preview');
	return {
		__esModule: true,
		...actualModule,
		useFilePreview: jest.fn(actualModule.useFilePreview),
	};
});
import { render, screen } from '@testing-library/react';
import React from 'react';
import { type MediaClientConfig } from '@atlaskit/media-client';
import { type MediaImageChildrenProps } from './types';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers';
import { generateSampleFileItem } from '@atlaskit/media-test-data';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import { useFilePreview } from '@atlaskit/media-file-preview';
import MediaImageWithErrorBoundary from './mediaImageWithErrorBoundary';

const dummyMediaClientConfig = {} as MediaClientConfig;
const baseProps = {
	mediaClientConfig: dummyMediaClientConfig,
	apiConfig: {
		width: 10,
		height: 10,
	},
	children: ({ error, loading, data }: MediaImageChildrenProps) => {
		return error ? <p>error</p> : loading ? <p>some-loading</p> : <p>{`${data?.src}`}</p>;
	},
};

describe('MediaImageWithErrorBoundary', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should catch when an error occurs in MediaImage', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
		const { mediaApi } = createMockedMediaApi(fileItem);
		const props = {
			identifier,
			...baseProps,
		};

		(useFilePreview as jest.Mock).mockImplementation(() => {
			throw new Error('an error occurred');
		});

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<MediaImageWithErrorBoundary {...props} />
			</MockedMediaClientProvider>,
		);

		expect(await screen.findByText('error')).toBeInTheDocument();
	});
});
