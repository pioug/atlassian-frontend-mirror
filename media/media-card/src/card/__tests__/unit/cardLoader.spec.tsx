jest.mock('../../card');
import React from 'react';
import { mount } from 'enzyme';
import { fakeMediaClient, nextTick } from '@atlaskit/media-test-helpers';
import { FileIdentifier } from '@atlaskit/media-client';
import { CardLoading } from '../../../utils/lightCards/cardLoading';
import CardLoader, { CardWithMediaClientConfigProps } from '../../cardLoader';

const mediaClient = fakeMediaClient();

jest.mock('@atlaskit/media-common', () => ({
  ...jest.requireActual<Object>('@atlaskit/media-common'),
}));

const identifier: FileIdentifier = {
  id: '123',
  mediaItemType: 'file',
  collectionName: 'some-name',
};

const props = {
  dimensions: {
    width: 10,
    height: 10,
  },
  mediaClientConfig: mediaClient.config,
  identifier,
  featureFlags: { captions: true },
};

describe('Async Card Loader', () => {
  const mockCardModule = () => <div />;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When the async import returns with error', () => {
    beforeEach(() => {
      jest.mock('../../card', () => {
        throw new Error('Forcing async import error');
      });
    });

    it('should pass dimensions to the loading component if the async components were NOT resolved', async () => {
      const wrapper = mount<CardWithMediaClientConfigProps>(
        <CardLoader {...props} />,
      );

      await nextTick();

      expect(wrapper.find(CardLoading).prop('dimensions')).toEqual(
        props.dimensions,
      );
    });

    it('should NOT render MediaCard component', async () => {
      const wrapper = mount<CardWithMediaClientConfigProps>(
        <CardLoader {...props} />,
      );

      await nextTick();

      expect(
        wrapper
          .find('WithMediaAnalyticsContext(WithAnalyticsEvents(CardBase))')
          .exists(),
      ).toBe(false);
    });
  });

  describe('When the async import returns with success', () => {
    let MediaPickerAnalyticsErrorBoundary: React.ReactComponentElement<any>;
    beforeEach(() => {
      jest.mock('../../card', () => ({
        __esModule: true,
        Card: mockCardModule,
      }));
      jest.unmock('../../../card/media-card-analytics-error-boundary');
      MediaPickerAnalyticsErrorBoundary = jest.requireActual(
        '../../../card/media-card-analytics-error-boundary',
      ).default;
    });

    it('should render Card component', async () => {
      const wrapper = mount(<CardLoader {...props} />);

      await nextTick();
      await nextTick();
      wrapper.update();
      expect(
        wrapper
          .find('WithMediaAnalyticsContext(WithAnalyticsEvents(CardBase))')
          .exists(),
      ).toBe(false);
    });

    it('should render Error boundary component', async () => {
      const wrapper = mount(<CardLoader {...props} />);
      await nextTick();
      expect(wrapper.find(MediaPickerAnalyticsErrorBoundary)).toBeDefined();
    });
  });

  describe('When the async import for Error Boundary returns with error', () => {
    beforeEach(() => {
      jest.unmock('../../card');
      jest.mock('../../../card/media-card-analytics-error-boundary', () => {
        throw new Error('Forcing error boundary async import error');
      });
    });

    it('should render CardLoading component', async () => {
      const wrapper = mount(<CardLoader {...props} />);

      await nextTick();
      wrapper.update();
      expect(wrapper.find(CardLoading)).toHaveLength(1);
    });
  });

  describe('feature flags', () => {
    it('passes featureFlags to CardWithMediaClient', () => {
      const wrapper = mount(<CardLoader {...props} />);
      expect(wrapper.find('CardWithMediaClient').prop('featureFlags')).toEqual({
        captions: true,
      });
    });
  });
});
