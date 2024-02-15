jest.mock('./mediaImageV2Base');
import { render, screen } from '@testing-library/react';
import React from 'react';
import { FileIdentifier, MediaClientConfig } from '@atlaskit/media-client';
import MediaImageV2WithMediaClient from './mediaImageV2WithMediaClient';
import { MediaImageV2Base } from './mediaImageV2Base';
import {
  MediaClientContext,
  useMediaClient,
} from '@atlaskit/media-client-react';

const identifier: FileIdentifier = {
  id: 'some-id',
  mediaItemType: 'file',
  collectionName: 'some-collection-name',
  occurrenceKey: 'some-occurrence-key',
};

const dummyMediaClientConfig = {} as MediaClientConfig;
const baseProps = {
  mediaClientConfig: dummyMediaClientConfig,
  apiConfig: {
    width: 10,
    height: 10,
  },
  children: () => null,
};

describe('MediaImageV2WithMediaClient', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create and provide a mediaClient if there is none', async () => {
    const props = {
      identifier,
      ...baseProps,
    };

    let retrievedMediaClient: any;
    (MediaImageV2Base as jest.Mock).mockImplementation(() => {
      retrievedMediaClient = useMediaClient();
      return 'media-image-base';
    });

    render(<MediaImageV2WithMediaClient {...props} />);

    expect(await screen.findByText('media-image-base')).toBeInTheDocument();
    expect(retrievedMediaClient).toBeTruthy();
  });

  it('should continue to use the same mediaClient if there is one', async () => {
    const mockedMediaClient = { getImage: jest.fn() };
    const props = {
      identifier,
      ...baseProps,
    };

    let retrievedMediaClient: any;
    (MediaImageV2Base as jest.Mock).mockImplementation(() => {
      retrievedMediaClient = useMediaClient();
      return 'media-image-base';
    });

    render(
      <MediaClientContext.Provider value={mockedMediaClient as any}>
        <MediaImageV2WithMediaClient {...props} />
      </MediaClientContext.Provider>,
    );

    expect(await screen.findByText('media-image-base')).toBeInTheDocument();
    expect(retrievedMediaClient).toBe(mockedMediaClient);
  });
});
