jest.mock('../../../utils/analytics', () => {
  const actualModule = jest.requireActual('../../../utils/analytics');
  return {
    __esModule: true,
    ...actualModule,
    getRenderFailedFileStatusPayload: jest.fn(() => 'some-failed-payload'),
    getRenderErrorEventPayload: jest.fn(() => 'some-error-payload'),
    getRenderSucceededEventPayload: jest.fn(() => 'some-suceeded-payload'),
    getCopiedFilePayload: jest.fn(() => 'some-copied-payload'),
    getRenderCommencedEventPayload: jest.fn(() => 'some-commenced-payload'),
  };
});
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  fireOperationalEvent,
  fireCopiedEvent,
  fireCommencedEvent,
} from '../../card/cardAnalytics';
import {
  FileAttributes,
  ANALYTICS_MEDIA_CHANNEL,
  PerformanceAttributes,
} from '@atlaskit/media-common';
import {
  getRenderFailedFileStatusPayload,
  getRenderErrorEventPayload,
  getRenderSucceededEventPayload,
  getCopiedFilePayload,
  getRenderCommencedEventPayload,
} from '../../../utils/analytics';
import { MediaCardError } from '../../../errors';

const event = { fire: jest.fn() };
const createAnalyticsEventMock = jest.fn(() => event);
const createAnalyticsEvent = (createAnalyticsEventMock as unknown) as CreateUIAnalyticsEvent;
const fileAttributes = ({
  some: 'file attributes',
} as unknown) as FileAttributes;
const performanceAttributes = ({
  some: 'performance attributes',
} as unknown) as PerformanceAttributes;

describe('fireOperationalEvent', () => {
  beforeEach(() => {
    event.fire.mockClear();
    createAnalyticsEventMock.mockClear();
  });

  it('should fire failed event if status is failed-processing', () => {
    fireOperationalEvent(
      createAnalyticsEvent,
      'failed-processing',
      fileAttributes,
      performanceAttributes,
    );

    expect(getRenderFailedFileStatusPayload).toBeCalledWith(
      fileAttributes,
      performanceAttributes,
    );
    expect(createAnalyticsEventMock).toBeCalledWith('some-failed-payload');
    expect(event.fire).toBeCalledTimes(1);
    expect(event.fire).toBeCalledWith(ANALYTICS_MEDIA_CHANNEL);
  });

  it('should fire failed event if status is error and an error object is provided', () => {
    const error = new MediaCardError('upload');
    fireOperationalEvent(
      createAnalyticsEvent,
      'error',
      fileAttributes,
      performanceAttributes,
      {
        error,
      },
    );

    expect(getRenderErrorEventPayload).toBeCalledWith(
      fileAttributes,
      performanceAttributes,
      error,
    );
    expect(createAnalyticsEventMock).toBeCalledWith('some-error-payload');
    expect(event.fire).toBeCalledTimes(1);
    expect(event.fire).toBeCalledWith(ANALYTICS_MEDIA_CHANNEL);
  });

  it('should fire completed event if status is complete and there is no dataURI', () => {
    fireOperationalEvent(
      createAnalyticsEvent,
      'complete',
      fileAttributes,
      performanceAttributes,
    );

    expect(getRenderSucceededEventPayload).toBeCalledWith(
      fileAttributes,
      performanceAttributes,
    );
    expect(createAnalyticsEventMock).toBeCalledWith('some-suceeded-payload');
    expect(event.fire).toBeCalledTimes(1);
    expect(event.fire).toBeCalledWith(ANALYTICS_MEDIA_CHANNEL);
  });

  it('should fire commenced event', () => {
    fireCommencedEvent(
      createAnalyticsEvent,
      fileAttributes,
      performanceAttributes,
    );

    expect(getRenderCommencedEventPayload).toBeCalledWith(
      fileAttributes,
      performanceAttributes,
    );
    expect(createAnalyticsEventMock).toBeCalledWith('some-commenced-payload');
    expect(event.fire).toBeCalledTimes(1);
    expect(event.fire).toBeCalledWith(ANALYTICS_MEDIA_CHANNEL);
  });
});

describe('fireCopiedEvent', () => {
  const cardRef = document.createElement('div');
  const fileId = 'some-file-id';

  beforeEach(() => {
    event.fire.mockClear();
    createAnalyticsEventMock.mockClear();
  });

  it('should fire copied event if the div element is inside a selection', () => {
    window.getSelection = jest.fn().mockReturnValue({
      containsNode: () => true,
    });

    fireCopiedEvent(createAnalyticsEvent, fileId, cardRef);

    expect(getCopiedFilePayload).toBeCalledWith(fileId);
    expect(createAnalyticsEventMock).toBeCalledWith('some-copied-payload');
    expect(event.fire).toBeCalledTimes(1);
    expect(event.fire).toBeCalledWith(ANALYTICS_MEDIA_CHANNEL);
  });

  it('should not fire copied event if selection api is not available', () => {
    window.getSelection = jest.fn().mockReturnValue({});

    fireCopiedEvent(createAnalyticsEvent, fileId, cardRef);
    expect(event.fire).toBeCalledTimes(0);
  });

  it('should not fire copied event if the div element is not inside a selection', () => {
    window.getSelection = jest.fn().mockReturnValue({
      containsNode: () => false,
    });

    fireCopiedEvent(createAnalyticsEvent, fileId, cardRef);
    expect(event.fire).toBeCalledTimes(0);
  });
});
