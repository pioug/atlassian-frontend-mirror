import React from 'react';

import { render } from '@testing-library/react';

import { type MediaClient, type MediaClientConfig } from '@atlaskit/media-client';

import { MediaClientProvider, useMediaClient } from '../../src';

describe('MediaClientProvider', () => {
  it('should throw an error if no media client has been set', () => {
    const consoleMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    function Page() {
      useMediaClient();
      return null;
    }

    expect(() => render(<Page />)).toThrow(
      'No MediaClient set, use MediaClientProvider to set one',
    );

    consoleMock.mockRestore();
  });

  it('should get a mediaClient if MediaClientProvider is used', () => {
    const mediaConfig = {
      authProvider: jest.fn(),
    };
    function Page() {
      useMediaClient();
      return null;
    }

    expect(() =>
      render(
        <MediaClientProvider clientConfig={mediaConfig}>
          <Page />
        </MediaClientProvider>,
      ),
    ).not.toThrow('No MediaClient set, use MediaClientProvider to set one');
  });

  it('should get the same mediaClient if the same mediaConfig is passed', () => {
    let mediaClient1, mediaClient2;
    const mediaConfig = {
      authProvider: jest.fn(),
    };
    function Page1() {
      mediaClient1 = useMediaClient();
      return null;
    }

    function Page2() {
      mediaClient2 = useMediaClient();
      return null;
    }

    render(
      <>
        <MediaClientProvider clientConfig={mediaConfig}>
          <Page1 />
        </MediaClientProvider>
        <MediaClientProvider clientConfig={mediaConfig}>
          <Page2 />
        </MediaClientProvider>
      </>,
    );
    expect(mediaClient1).toEqual(mediaClient2);
  });

  it('should get the different mediaClient if different mediaConfigs are passed', () => {
    let mediaClient1, mediaClient2;
    const mediaConfig1 = {
      authProvider: jest.fn(),
    };
    const mediaConfig2 = {
      authProvider: jest.fn(),
    };
    function Page1() {
      mediaClient1 = useMediaClient();
      return null;
    }

    function Page2() {
      mediaClient2 = useMediaClient();
      return null;
    }

    render(
      <>
        <MediaClientProvider clientConfig={mediaConfig1}>
          <Page1 />
        </MediaClientProvider>
        <MediaClientProvider clientConfig={mediaConfig2}>
          <Page2 />
        </MediaClientProvider>
      </>,
    );
    expect(mediaClient1).not.toEqual(mediaClient2);
  });

  it('should get an empty client if no config has passed', async () => {
    // The Provider defines mediaClientConfig as required,
    // but integrators may skip it when using Media Card to display external images
    // i.e. a Media Client is not needed.
    // An empty mediaClientConfig object `{}` won't fall into this case,
    // but that case is handled internally by Media Client.
    const undefinedMediaClientConfig =
      undefined as unknown as MediaClientConfig;

    let mediaClient: MediaClient | undefined;

    function Page() {
      mediaClient = useMediaClient();
      return null;
    }

    render(
      <>
        <MediaClientProvider clientConfig={undefinedMediaClientConfig}>
          <Page />
        </MediaClientProvider>
      </>,
    );

    if (!mediaClient) {
      throw new Error('mediaClient is undefined');
    }
    const auth = await mediaClient.config.authProvider();
    expect(auth).toEqual({
      clientId: '',
      token: '',
      baseUrl: '',
    });
  });

  describe('with nested usage', () => {
    it('should get the same mediaClient', () => {
      let mediaClient1, mediaClient2;

      const mediaConfig = {
        authProvider: jest.fn(),
      };
      function Page1() {
        mediaClient1 = useMediaClient();
        return null;
      }

      function Page2() {
        mediaClient2 = useMediaClient();
        return null;
      }

      render(
        <MediaClientProvider clientConfig={mediaConfig}>
          <Page1 />
          <MediaClientProvider clientConfig={mediaConfig}>
            <Page2 />
          </MediaClientProvider>
        </MediaClientProvider>,
      );
      expect(mediaClient1).toEqual(mediaClient2);
    });

    it('should get different mediaClients', () => {
      let mediaClient1, mediaClient2;

      const mediaConfig1 = {
        authProvider: jest.fn(),
      };
      const mediaConfig2 = {
        authProvider: jest.fn(),
      };
      function Page1() {
        mediaClient1 = useMediaClient();
        return null;
      }

      function Page2() {
        mediaClient2 = useMediaClient();
        return null;
      }

      render(
        <MediaClientProvider clientConfig={mediaConfig1}>
          <Page1 />
          <MediaClientProvider clientConfig={mediaConfig2}>
            <Page2 />
          </MediaClientProvider>
        </MediaClientProvider>,
      );
      expect(mediaClient1).not.toEqual(mediaClient2);
    });
  });
});
