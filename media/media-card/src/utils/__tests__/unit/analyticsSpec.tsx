import React from 'react';
import { mount } from 'enzyme';
import {
  AnalyticsListener,
  withAnalyticsEvents,
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import {
  createAndFireMediaCardEvent,
  fireMediaCardEvent,
  MediaCardAnalyticsEventPayload,
  getRenderErrorFailReason,
  getRenderErrorErrorReason,
  getRenderErrorErrorDetail,
  getRenderErrorRequestMetadata,
  getRenderErrorEventPayload,
  RenderEventAction,
  getRenderPreviewableCardPayload,
} from '../../analytics';
import { FileAttributes, PerformanceAttributes } from '@atlaskit/media-common';
import { createRateLimitedError } from '@atlaskit/media-test-helpers';
import { getMediaClientErrorReason } from '@atlaskit/media-client';
import { MediaCardError } from '../../../errors';

const somePayload: MediaCardAnalyticsEventPayload = {
  eventType: 'ui',
  action: 'clicked',
  actionSubject: 'the-subject',
  actionSubjectId: 'the-subject-id',
  attributes: {
    label: 'somelabel',
  },
};

const mediaPayload: MediaCardAnalyticsEventPayload = {
  ...somePayload,
  attributes: {
    ...somePayload.attributes,
  },
};

describe('Media Analytics', () => {
  it('Should provide an analytics event creator for Media Card', () => {
    const SomeComponent = ({ onClick }: any) => (
      <span onClick={onClick}>Hi!</span>
    );
    const SomeWrappedComponent = withAnalyticsEvents({
      onClick: createAndFireMediaCardEvent(somePayload),
    })(SomeComponent);

    const analyticsEventHandler = jest.fn();
    const listener = mount(
      <AnalyticsListener
        channel={FabricChannel.media}
        onEvent={analyticsEventHandler}
      >
        <SomeWrappedComponent />
      </AnalyticsListener>,
    );
    listener.find(SomeComponent).simulate('click');

    expect(analyticsEventHandler).toHaveBeenCalledTimes(1);
    const actualEvent: Partial<UIAnalyticsEvent> =
      analyticsEventHandler.mock.calls[0][0];
    expect(actualEvent.payload).toMatchObject(mediaPayload);
  });

  it('Should provide an analytics event trigger for Media Card', () => {
    type SomeComponentProps = {
      createAnalyticsEvent: CreateUIAnalyticsEvent;
    };
    const SomeComponent = (props: SomeComponentProps) => {
      const onCustomEvent = () => {
        fireMediaCardEvent(somePayload, props.createAnalyticsEvent);
      };
      onCustomEvent();
      return <span>'Hi!'</span>;
    };
    const SomeWrappedComponent = withAnalyticsEvents()(SomeComponent);

    const analyticsEventHandler = jest.fn();
    mount(
      <AnalyticsListener
        channel={FabricChannel.media}
        onEvent={analyticsEventHandler}
      >
        <SomeWrappedComponent />
      </AnalyticsListener>,
    );

    expect(analyticsEventHandler).toHaveBeenCalledTimes(1);
    const actualEvent: Partial<UIAnalyticsEvent> =
      analyticsEventHandler.mock.calls[0][0];
    expect(actualEvent.payload).toMatchObject(mediaPayload);
  });

  describe('getRenderErrorEventPayload', () => {
    const fileAttributes: FileAttributes = {
      fileId: 'some-id',
      fileSize: 10,
      fileMediatype: 'image',
      fileMimetype: 'image/png',
      fileStatus: 'processed',
    };
    const performanceAttributes: PerformanceAttributes = {
      overall: {
        durationSinceCommenced: 100,
        durationSincePageStart: 1000,
      },
    };
    it('should attach FailedSubscriptionFailReason to failReason and MediaClientErrorReason to error', () => {
      const error = new MediaCardError(
        'metadata-fetch',
        createRateLimitedError(),
      );
      expect(
        getRenderErrorEventPayload(
          fileAttributes,
          performanceAttributes,
          error,
        ),
      ).toMatchObject({
        eventType: 'operational',
        action: RenderEventAction.FAILED,
        actionSubject: 'mediaCardRender',
        attributes: {
          fileAttributes,
          performanceAttributes,
          status: 'fail',
          failReason: getRenderErrorFailReason(error),
          error: getRenderErrorErrorReason(error),
          errorDetail: getRenderErrorErrorDetail(error),
          request: getRenderErrorRequestMetadata(error),
        },
      });
    });
  });

  describe('getRenderPreviewableCardPayload', () => {
    const fileAttributes: FileAttributes = {
      fileId: 'some-id',
      fileSize: 10,
      fileMediatype: 'video',
      fileMimetype: 'video/webm',
      fileStatus: 'processed',
    };

    it('should be a screen event returning mediaCardRenderScreen as the actionSubject and name', () => {
      expect(getRenderPreviewableCardPayload(fileAttributes)).toMatchObject({
        eventType: 'screen',
        action: 'viewed',
        actionSubject: 'mediaCardRenderScreen',
        name: 'mediaCardRenderScreen',
        attributes: { fileAttributes },
      });
    });
  });

  describe('Helpers', () => {
    it('getRenderFailedPreviewFetchFailReason should return media card error primary reason', () => {
      const error = new MediaCardError(
        'local-preview-get',
        new Error('some-error'),
      );
      expect(getRenderErrorFailReason(error)).toBe(error.primaryReason);
    });

    it('getRenderErrorErrorReason should return MediaClientErrorReason or nativeError', () => {
      const someMediaClientError = createRateLimitedError();
      expect(
        getRenderErrorErrorReason(
          new MediaCardError('preview-fetch', someMediaClientError),
        ),
      ).toBe(getMediaClientErrorReason(someMediaClientError));

      expect(
        getRenderErrorErrorReason(
          new MediaCardError('preview-fetch', new Error('some-error')),
        ),
      ).toBe('nativeError');
    });

    it('getRenderErrorErrorDetail should return secondary error message', () => {
      const someMediaClientError = createRateLimitedError();
      expect(
        getRenderErrorErrorDetail(
          new MediaCardError('preview-fetch', someMediaClientError),
        ),
      ).toBe(someMediaClientError.message);

      expect(
        getRenderErrorErrorDetail(
          new MediaCardError('preview-fetch', new Error('some-error-message')),
        ),
      ).toBe('some-error-message');
    });

    it('getRenderErrorRequestMetadata should return request metadata', () => {
      const someMediaClientError = createRateLimitedError({
        method: 'POST',
        endpoint: '/some-endpoint',
      });

      expect(
        getRenderErrorRequestMetadata(
          new MediaCardError('preview-fetch', someMediaClientError),
        ),
      ).toStrictEqual({
        method: 'POST',
        endpoint: '/some-endpoint',
        statusCode: 429,
      });
    });
  });
});
