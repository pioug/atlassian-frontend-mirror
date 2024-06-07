import { render, screen } from '@testing-library/react';
import React from 'react';
import { type MediaClientConfig } from '@atlaskit/media-client';
import { type MediaImageChildrenProps } from './types';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers';
import { generateSampleFileItem } from '@atlaskit/media-test-data';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import { MediaImageBase } from './mediaImageBase';
import { getMediaClient } from '@atlaskit/media-client-react';

const dummyMediaClientConfig = {} as MediaClientConfig;
const baseProps = {
	mediaClientConfig: dummyMediaClientConfig,
	apiConfig: {
		width: 10,
		height: 10,
	},
	children: ({ error, loading, data }: MediaImageChildrenProps) => {
		return error ? <p>error</p> : loading ? <p>loading</p> : <p>{`${data?.src}`}</p>;
	},
};

describe('MediaImage', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should render a loading placeholder while src is loading', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
		const { mediaApi } = createMockedMediaApi(fileItem);

		const mediaClient = getMediaClient(dummyMediaClientConfig);
		const props = {
			identifier,
			...baseProps,
		};

		render(
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<MediaImageBase {...props} mediaClient={mediaClient} />
			</MockedMediaClientProvider>,
		);

		expect(screen.queryByText('loading')).toBeInTheDocument();
		expect(await screen.findByText('mock result of URL.createObjectURL()')).toBeInTheDocument();
	});
});
