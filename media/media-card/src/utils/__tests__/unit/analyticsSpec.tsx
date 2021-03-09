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
  getRenderFailedMediaClientPayload,
  getRenderFailedMediaClientFailReason,
  RenderEventAction,
} from '../../analytics';
import { FileAttributes } from '@atlaskit/media-common';
import { createRateLimitedError } from '@atlaskit/media-test-helpers';
import { getMediaClientErrorReason } from '@atlaskit/media-client';

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

  describe('getRenderFailedMediaClientPayload', () => {
    const fileAttributes: FileAttributes = {
      fileId: 'some-id',
      fileSize: 10,
      fileMediatype: 'image',
      fileMimetype: 'image/png',
      fileStatus: 'processed',
    };
    it('should attach FailedSubscriptionFailReason to failReason and MediaClientErrorReason to error', () => {
      const error = createRateLimitedError();
      expect(
        getRenderFailedMediaClientPayload(fileAttributes, error),
      ).toMatchObject({
        eventType: 'operational',
        action: RenderEventAction.FAILED,
        actionSubject: 'mediaCardRender',
        attributes: {
          fileAttributes,
          status: 'fail',
          failReason: getRenderFailedMediaClientFailReason(
            fileAttributes.fileStatus,
          ),
          error: getMediaClientErrorReason(error),
        },
      });
    });
  });
});
