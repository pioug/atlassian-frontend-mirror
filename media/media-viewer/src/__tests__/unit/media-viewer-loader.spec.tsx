import React from 'react';
import { mount } from 'enzyme';
import { fakeMediaClient, nextTick } from '@atlaskit/media-test-helpers';
import { Identifier } from '@atlaskit/media-client';

import { ModalSpinner } from '@atlaskit/media-ui';
import AsyncMediaViewer, {
  MediaViewerWithMediaClientConfigProps,
  AsyncMediaViewerState,
} from '../../components/media-viewer-loader';

const mediaClient = fakeMediaClient();

const identifier: Identifier = {
  id: '123',
  mediaItemType: 'file',
  collectionName: 'some-name',
};

const props = {
  mediaClientConfig: mediaClient.config,
  selectedItem: identifier,
  dataSource: { list: [identifier] },
  collectionName: `${identifier.collectionName}`,
};

describe('Async Media Viewer Loader', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When the async import returns with error', () => {
    beforeEach(() => {
      jest.mock('../../components/media-viewer', () => {
        throw new Error('Forcing async import error');
      });
    });

    it('should render ModalSpinner with invertSpinnerColor if the async components were NOT resolved', async () => {
      const wrapper = mount<
        MediaViewerWithMediaClientConfigProps,
        AsyncMediaViewerState
      >(<AsyncMediaViewer {...props} />);

      await nextTick();

      expect(
        wrapper.find(ModalSpinner).prop('invertSpinnerColor'),
      ).toBeTruthy();

      expect(wrapper.state().MediaViewer).toBeUndefined();
    });
  });
  describe('When the async import for Error Boundary returns with error', () => {
    beforeEach(() => {
      jest.unmock('../../components/media-viewer');
      jest.mock(
        '../../components/media-viewer-analytics-error-boundary',
        () => {
          throw new Error('Forcing error boundary async import error');
        },
      );
    });

    it('should render ModalSpinner with invertSpinnerColor if the async components were NOT resolved', async () => {
      const wrapper = mount<
        MediaViewerWithMediaClientConfigProps,
        AsyncMediaViewerState
      >(<AsyncMediaViewer {...props} />);

      await nextTick();

      expect(
        wrapper.find(ModalSpinner).prop('invertSpinnerColor'),
      ).toBeTruthy();

      expect(wrapper.state().MediaViewer).toBeUndefined();
    });
  });

  describe('When the async import returns with success', () => {
    let MediaViewerAnalyticsErrorBoundary: React.ReactComponentElement<any>;
    beforeEach(() => {
      jest.unmock('../../components/media-viewer');
      jest.unmock('../../components/media-viewer-analytics-error-boundary');
      MediaViewerAnalyticsErrorBoundary = jest.requireActual(
        '../../components/media-viewer-analytics-error-boundary',
      ).default;
    });

    it('should render MediaViewer component', async () => {
      const wrapper = mount<
        MediaViewerWithMediaClientConfigProps,
        AsyncMediaViewerState
      >(<AsyncMediaViewer {...props} />);

      await nextTick();
      await nextTick();
      await nextTick();

      expect(wrapper.state().MediaViewer).toBeDefined();
    });

    it('should render Error boundary component', async () => {
      const wrapper = mount<
        MediaViewerWithMediaClientConfigProps,
        AsyncMediaViewerState
      >(<AsyncMediaViewer {...props} />);

      await nextTick();

      expect(wrapper.find(MediaViewerAnalyticsErrorBoundary)).toBeDefined();
    });
  });
});
