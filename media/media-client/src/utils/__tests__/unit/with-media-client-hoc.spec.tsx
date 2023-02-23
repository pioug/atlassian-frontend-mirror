import React from 'react';
import { mount } from 'enzyme';
import { MediaClientConfig } from '@atlaskit/media-core';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { withMediaClient, WithMediaClient } from '../../with-media-client-hoc';

class DummyComponent extends React.Component<WithMediaClient, {}> {
  render() {
    return null;
  }
}

const featureFlags = { some: 'feature flags' } as MediaFeatureFlags;
// Technically a different object
const featureFlags2 = { ...featureFlags } as MediaFeatureFlags;

describe('withMediaClient', () => {
  it('should create new mediaClient from given mediaClientConfig', () => {
    const Wrapper = withMediaClient(DummyComponent);
    const mediaClientConfig: MediaClientConfig = {
      authProvider: () =>
        Promise.resolve({
          baseUrl: 'url',
          clientId: 'client-id',
          token: 'token',
        }),
    };
    const component = mount(<Wrapper mediaClientConfig={mediaClientConfig} />);
    const mediaClient = component
      .find<WithMediaClient>(DummyComponent)
      .props().mediaClient;
    expect(mediaClient).not.toBeUndefined();
    expect(mediaClient.config).toEqual(mediaClientConfig);
  });

  it('should create new mediaClient from given mediaClientConfig and featureFlags objects', () => {
    const Wrapper = withMediaClient(DummyComponent, featureFlags);
    const mediaClientConfig: MediaClientConfig = {
      authProvider: () =>
        Promise.resolve({
          baseUrl: 'url',
          clientId: 'client-id',
          token: 'token',
        }),
    };
    const component = mount(<Wrapper mediaClientConfig={mediaClientConfig} />);
    const mediaClient = component
      .find<WithMediaClient>(DummyComponent)
      .props().mediaClient;
    expect(mediaClient).not.toBeUndefined();
    expect(mediaClient.config).toEqual(mediaClientConfig);
    expect(mediaClient.featureFlags).toEqual(featureFlags);
  });

  it('should reuse previously created mediaClient instance for same mediaClientConfig and feature flags', () => {
    // Different wrappers should output the same media client
    const Wrapper1 = withMediaClient(DummyComponent, featureFlags);
    const Wrapper2 = withMediaClient(DummyComponent, featureFlags);

    const mediaClientConfig: MediaClientConfig = {
      authProvider: () =>
        Promise.resolve({
          baseUrl: 'url',
          clientId: 'client-id',
          token: 'token',
        }),
    };
    const component1 = mount(
      <Wrapper1 mediaClientConfig={mediaClientConfig} />,
    );
    const component2 = mount(
      <Wrapper2 mediaClientConfig={mediaClientConfig} />,
    );
    const mediaClient1 = component1
      .find<WithMediaClient>(DummyComponent)
      .props().mediaClient;
    const mediaClient2 = component2
      .find<WithMediaClient>(DummyComponent)
      .props().mediaClient;
    expect(mediaClient1).toBe(mediaClient2);
  });

  it('should not reuse previously created mediaClient instance for different mediaClientConfig', () => {
    const Wrapper = withMediaClient(DummyComponent, featureFlags);

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

    // Same wrapper should output different media clients
    const component1 = mount(
      <Wrapper mediaClientConfig={mediaClientConfig1} />,
    );
    const component2 = mount(
      <Wrapper mediaClientConfig={mediaClientConfig2} />,
    );

    const mediaClient1 = component1
      .find<WithMediaClient>(DummyComponent)
      .props().mediaClient;

    const mediaClient2 = component2
      .find<WithMediaClient>(DummyComponent)
      .props().mediaClient;

    expect(mediaClient1).not.toBe(mediaClient2);
  });

  it('should not reuse previously created mediaClient instance for different feature flags', () => {
    const Wrapper1 = withMediaClient(DummyComponent, featureFlags);
    const Wrapper2 = withMediaClient(DummyComponent, featureFlags2);
    const Wrapper3 = withMediaClient(DummyComponent);

    const mediaClientConfig: MediaClientConfig = {
      authProvider: () =>
        Promise.resolve({
          baseUrl: 'url',
          clientId: 'client-id',
          token: 'token',
        }),
    };

    const component1 = mount(
      <Wrapper1 mediaClientConfig={mediaClientConfig} />,
    );
    const component2 = mount(
      <Wrapper2 mediaClientConfig={mediaClientConfig} />,
    );
    const component3 = mount(
      <Wrapper3 mediaClientConfig={mediaClientConfig} />,
    );

    const mediaClient1 = component1
      .find<WithMediaClient>(DummyComponent)
      .props().mediaClient;

    const mediaClient2 = component2
      .find<WithMediaClient>(DummyComponent)
      .props().mediaClient;

    const mediaClient3 = component3
      .find<WithMediaClient>(DummyComponent)
      .props().mediaClient;

    expect(mediaClient1).not.toBe(mediaClient2);
    expect(mediaClient1).not.toBe(mediaClient3);
    expect(mediaClient2).not.toBe(mediaClient3);
  });

  it('should use empty mediaClient when mediaClientConfig is not provided', async () => {
    const Wrapper = withMediaClient(DummyComponent);
    // Intentionally pass undefined mediaClientConfig to simulate external identifier usage
    const component = mount(
      <Wrapper
        mediaClientConfig={undefined as any}
        identifier={{ mediaItemType: 'external-image', dataURI: 'hehe' }}
      />,
    );
    const mediaClient = component
      .find<WithMediaClient>(DummyComponent)
      .props().mediaClient;
    expect(mediaClient).not.toBeUndefined();
    expect(await mediaClient.config.authProvider()).toEqual({
      clientId: '',
      token: '',
      baseUrl: '',
    });
  });
});
