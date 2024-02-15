import { render, screen } from '@testing-library/react';
import React from 'react';
import { MediaClientConfig } from '@atlaskit/media-client';
import { MediaImageChildrenProps } from '../types';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers';
import { generateSampleFileItem } from '@atlaskit/media-test-data';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import { MediaImageV2Base } from './mediaImageV2Base';

const dummyMediaClientConfig = {} as MediaClientConfig;
const baseProps = {
  mediaClientConfig: dummyMediaClientConfig,
  apiConfig: {
    width: 10,
    height: 10,
  },
  children: ({ error, loading, data }: MediaImageChildrenProps) => {
    return error ? (
      <p>error</p>
    ) : loading ? (
      <p>loading</p>
    ) : (
      <p>{`${data?.src}`}</p>
    );
  },
};

describe('MediaImageV2', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render a loading placeholder while src is loading', async () => {
    const [fileItem, identifier] =
      generateSampleFileItem.workingImgWithRemotePreview();
    const { mediaApi } = createMockedMediaApi(fileItem);
    const props = {
      identifier,
      ...baseProps,
    };

    render(
      <MockedMediaClientProvider mockedMediaApi={mediaApi}>
        <MediaImageV2Base {...props} />
      </MockedMediaClientProvider>,
    );

    expect(screen.queryByText('loading')).toBeInTheDocument();
    expect(
      await screen.findByText('mock result of URL.createObjectURL()'),
    ).toBeInTheDocument();
  });
});
