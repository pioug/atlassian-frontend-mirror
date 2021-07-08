import React from 'react';
import { mount } from 'enzyme';
import { fakeMediaClient, nextTick } from '@atlaskit/media-test-helpers';
import { FileIdentifier } from '@atlaskit/media-client';
import {
  MediaImageLoader,
  MediaImageWithMediaClientConfigProps,
  AsyncMediaImageState,
  MediaImageLoaderChildrenProps,
} from '../../MediaImageLoader';

const identifier: FileIdentifier = {
  id: '123',
  mediaItemType: 'file',
  collectionName: 'some-name',
};

const mediaClient = fakeMediaClient();

const props = {
  mediaClientConfig: mediaClient.config,
  identifier,
  dimensions: {
    width: 10,
    height: 10,
  },
  children: () => null,
};

const propsWithChildren = {
  ...props,
  children: (childProps: MediaImageLoaderChildrenProps) => {
    const { loading, data } = childProps;
    return loading ? 'some-loading' : data;
  },
};

describe('Async Media Image Loader', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe('When the async import returns with error', () => {
    beforeEach(() => {
      jest.mock('../../mediaImage', () => {
        throw new Error('Forcing async import error');
      });
    });

    it('should pass dimensions to the loading component if the async components were NOT resolved', async () => {
      const wrapper = mount<
        MediaImageWithMediaClientConfigProps,
        AsyncMediaImageState
      >(<MediaImageLoader {...props} />);

      await nextTick();

      expect(wrapper.html()).toEqual(null);
    });

    it('should not render Media Image component', async () => {
      const wrapper = await mount<
        MediaImageWithMediaClientConfigProps,
        AsyncMediaImageState
      >(<MediaImageLoader {...props} />);

      await nextTick();

      expect(wrapper.state().MediaImage).toBeUndefined();
    });
  });

  describe('When the async import returns with success', () => {
    beforeEach(() => {
      jest.unmock('../../mediaImage');
    });

    it('should pass dimensions to the loading component if the async components were NOT resolved', async () => {
      const wrapper = mount<
        MediaImageWithMediaClientConfigProps,
        AsyncMediaImageState
      >(<MediaImageLoader {...propsWithChildren} />);

      expect(wrapper.html()).toEqual('some-loading');
    });

    it('should render Media Image component', async () => {
      const wrapper = await mount<
        MediaImageWithMediaClientConfigProps,
        AsyncMediaImageState
      >(<MediaImageLoader {...props} />);

      await nextTick();
      await nextTick();

      expect(wrapper.state().MediaImage).not.toBeUndefined();
    });
  });
});
