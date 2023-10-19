import React from 'react';

import { render } from '@testing-library/react';

import { MediaClient } from '@atlaskit/media-client';

import { useMediaClient } from '../../src';

import { MockedMediaClientProvider } from './MockedMediaClientProvider';

describe('MockedMediaClientProvider', () => {
  it('should create and provide a mediaClient using mockedMediaApi and initialStore', () => {
    const mockedMediaApi = { getItems: jest.fn() };
    const initialStore = { files: {} };

    let mediaClient: MediaClient | undefined;

    function Page() {
      mediaClient = useMediaClient();
      return null;
    }

    render(
      <MockedMediaClientProvider
        mockedMediaApi={mockedMediaApi}
        initialStore={initialStore}
      >
        <Page />
      </MockedMediaClientProvider>,
    );
    expect(mediaClient).toBeDefined();
    if (!mediaClient) {
      throw new Error('mediaClient is undefined');
    }
    expect(mediaClient.mediaStore).toEqual(mockedMediaApi);
    expect(mediaClient.__DO_NOT_USE__getMediaStore().getState()).toEqual(
      initialStore,
    );
  });
});
