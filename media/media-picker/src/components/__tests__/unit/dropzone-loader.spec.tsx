import React from 'react';
import { mount } from 'enzyme';
import { fakeMediaClient, nextTick } from '@atlaskit/media-test-helpers';

import {
  DropzoneLoader,
  DropzoneWithMediaClientConfigProps,
  State,
} from '../../dropzone';

const mediaClient = fakeMediaClient();
const container = document.createElement('div');

const config = { container, uploadParams: {} };

describe('Dropzone Async Loader', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When the async import returns with error', () => {
    beforeEach(() => {
      jest.mock('../../dropzone/dropzone', () => {
        throw new Error('Forcing async import error');
      });
    });

    it('should NOT render Dropzone component', async () => {
      const wrapper = mount<DropzoneWithMediaClientConfigProps, State>(
        <DropzoneLoader
          mediaClientConfig={mediaClient.config}
          config={config}
        />,
      );

      await nextTick();

      expect(wrapper.state().Dropzone).toBeUndefined();
    });
  });

  describe('When the async import for Error Boundary returns with error', () => {
    beforeEach(() => {
      jest.unmock('../../dropzone/dropzone');
      jest.mock('../../../service/uploadServiceImpl');
      jest.mock('../../media-picker-analytics-error-boundary', () => {
        throw new Error('Forcing error boundary async import error');
      });
    });

    it('should NOT render Dropzone component', async () => {
      const wrapper = mount<DropzoneWithMediaClientConfigProps, State>(
        <DropzoneLoader
          mediaClientConfig={mediaClient.config}
          config={config}
        />,
      );

      await nextTick();

      expect(wrapper.state().Dropzone).toBeUndefined();
    });
  });

  describe('When the async import returns with success', () => {
    let MediaPickerAnalyticsErrorBoundary: React.ReactComponentElement<any>;
    beforeEach(() => {
      jest.unmock('../../dropzone/dropzone');
      jest.unmock('../../media-picker-analytics-error-boundary');
      MediaPickerAnalyticsErrorBoundary = jest.requireActual(
        '../../media-picker-analytics-error-boundary',
      ).default;

      jest.mock('../../../service/uploadServiceImpl');
    });

    it('should render Dropzone component', async () => {
      const wrapper = await mount<DropzoneWithMediaClientConfigProps, State>(
        <DropzoneLoader
          mediaClientConfig={mediaClient.config}
          config={config}
        />,
      );

      await nextTick();
      await nextTick();

      expect(wrapper.state().Dropzone).toBeDefined();
    });

    it('should render Error boundary component', async () => {
      const wrapper = await mount<DropzoneWithMediaClientConfigProps, State>(
        <DropzoneLoader
          mediaClientConfig={mediaClient.config}
          config={config}
        />,
      );
      await nextTick();
      expect(wrapper.find(MediaPickerAnalyticsErrorBoundary)).toBeDefined();
    });
  });
});
