import React from 'react';

import { render } from '@testing-library/react';

import { type MediaClient, type MediaClientConfig } from '@atlaskit/media-client';

import { MediaClientProvider } from '../../src/MediaClientProvider';
import { withMediaClient, type WithMediaClient } from '../../src/withMediaClient';

describe('withMediaClient', () => {
  it('should create new mediaClient from given mediaClientConfig', () => {
    let mediaClient: MediaClient | undefined;
    function DummyComponent({ mediaClient: client }: WithMediaClient) {
      mediaClient = client;
      return null;
    }
    const Wrapper = withMediaClient(DummyComponent);
    const mediaClientConfig: MediaClientConfig = {
      authProvider: () =>
        Promise.resolve({
          baseUrl: 'url',
          clientId: 'client-id',
          token: 'token',
        }),
    };
    render(<Wrapper mediaClientConfig={mediaClientConfig} />);
    expect(mediaClient).toBeDefined();
    expect(mediaClient!.config).toEqual(mediaClientConfig);
  });

  it('should not reuse previously created mediaClient instance for different mediaClientConfig', () => {
    let mediaClient1, mediaClient2;
    function DummyComponent1({ mediaClient: client }: WithMediaClient) {
      mediaClient1 = client;
      return null;
    }

    function DummyComponent2({ mediaClient: client }: WithMediaClient) {
      mediaClient2 = client;
      return null;
    }

    const Wrapper1 = withMediaClient(DummyComponent1);
    const Wrapper2 = withMediaClient(DummyComponent2);

    const mediaClientConfig1: MediaClientConfig = {
      authProvider: () =>
        Promise.resolve({
          baseUrl: 'url',
          clientId: 'client-id',
          token: 'token',
        }),
    };

    // Technically a different object
    const mediaClientConfig2: MediaClientConfig = { ...mediaClientConfig1 };

    render(<Wrapper1 mediaClientConfig={mediaClientConfig1} />);
    render(<Wrapper2 mediaClientConfig={mediaClientConfig2} />);

    expect(mediaClient1).not.toBe(mediaClient2);
  });

  it('should use empty mediaClient when mediaClientConfig is not provided', async () => {
    let mediaClient: MediaClient | undefined;
    function DummyComponent({ mediaClient: client }: WithMediaClient) {
      mediaClient = client;
      return null;
    }

    const Wrapper = withMediaClient(DummyComponent);
    // Intentionally pass undefined mediaClientConfig to simulate external identifier usage
    render(
      <Wrapper
        mediaClientConfig={undefined as any}
        identifier={{ mediaItemType: 'external-image', dataURI: 'hehe' }}
      />,
    );

    expect(mediaClient).toBeDefined();
    expect(await mediaClient!.config.authProvider()).toEqual({
      clientId: '',
      token: '',
      baseUrl: '',
    });
  });

  it('should get mediaClient from parent when MediaClientProvider is provided from parent', async () => {
    let mediaClient: MediaClient | undefined;
    function DummyComponent({ mediaClient: client }: WithMediaClient) {
      mediaClient = client;
      return null;
    }

    const mediaClientConfigParent: MediaClientConfig = {
      authProvider: () =>
        Promise.resolve({
          baseUrl: 'url-parent',
          clientId: 'client-id-parent',
          token: 'token-parent',
        }),
    };

    const mediaClientConfigChild: MediaClientConfig = {
      authProvider: () =>
        Promise.resolve({
          baseUrl: 'url',
          clientId: 'client-id-child',
          token: 'token',
        }),
    };

    const Wrapper = withMediaClient(DummyComponent);
    render(
      <MediaClientProvider clientConfig={mediaClientConfigParent}>
        <Wrapper mediaClientConfig={mediaClientConfigChild} />
      </MediaClientProvider>,
    );

    expect(mediaClient).toBeDefined();
    expect(await mediaClient!.config.authProvider()).toEqual({
      baseUrl: 'url-parent',
      clientId: 'client-id-parent',
      token: 'token-parent',
    });
  });
});
