import React from 'react';
import { mount } from 'enzyme';
import { MediaClientConfig } from '@atlaskit/media-core';
import { withMediaClient, WithMediaClient } from '../../with-media-client-hoc';

class DummyComponent extends React.Component<WithMediaClient, {}> {
  render() {
    return null;
  }
}

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
    const mediaClient = component.find<WithMediaClient>(DummyComponent).props()
      .mediaClient;
    expect(mediaClient).not.toBeUndefined();
    expect(mediaClient.config).toEqual(mediaClientConfig);
  });

  it('should reuse previously created mediaClient instance for same mediaClientConfig', () => {
    const Wrapper = withMediaClient(DummyComponent);
    const mediaClientConfig: MediaClientConfig = {
      authProvider: () =>
        Promise.resolve({
          baseUrl: 'url',
          clientId: 'client-id',
          token: 'token',
        }),
    };
    const component1 = mount(<Wrapper mediaClientConfig={mediaClientConfig} />);
    const component2 = mount(<Wrapper mediaClientConfig={mediaClientConfig} />);
    const mediaClient1 = component1
      .find<WithMediaClient>(DummyComponent)
      .props().mediaClient;
    const mediaClient2 = component2
      .find<WithMediaClient>(DummyComponent)
      .props().mediaClient;
    expect(mediaClient1).toBe(mediaClient2);
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
    const mediaClient = component.find<WithMediaClient>(DummyComponent).props()
      .mediaClient;
    expect(mediaClient).not.toBeUndefined();
    expect(await mediaClient.config.authProvider()).toEqual({
      clientId: '',
      token: '',
      baseUrl: '',
    });
  });
});
