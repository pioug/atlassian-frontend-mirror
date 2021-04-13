jest.mock('../../../utils/analytics', () => {
  const actualModule = jest.requireActual('../../../utils/analytics');
  return {
    __esModule: true,
    ...actualModule,
    getRenderFailedFileStatusPayload: jest.fn(() => 'some-failed-payload'),
    getRenderErrorEventPayload: jest.fn(() => 'some-error-payload'),
    getRenderSucceededEventPayload: jest.fn(() => 'some-suceeded-payload'),
  };
});
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { fireOperationalEvent } from '../../card/cardAnalytics';
import { FileAttributes } from '@atlaskit/media-common';
import {
  getRenderFailedFileStatusPayload,
  getRenderErrorEventPayload,
  getRenderSucceededEventPayload,
} from '../../../utils/analytics';
import { MediaCardError } from '../../../errors';

const event = { fire: jest.fn() };
const createAnalyticsEventMock = jest.fn(() => event);
const createAnalyticsEvent = (createAnalyticsEventMock as unknown) as CreateUIAnalyticsEvent;
const fileAttributes = ({
  some: 'file attributes',
} as unknown) as FileAttributes;

describe('Card Analytics', () => {
  beforeEach(() => {
    event.fire.mockClear();
    createAnalyticsEventMock.mockClear();
  });
  it('should fire failed event if status is failed-processing', () => {
    fireOperationalEvent(
      createAnalyticsEvent,
      'failed-processing',
      fileAttributes,
    );

    expect(getRenderFailedFileStatusPayload).toBeCalledWith(fileAttributes);
    expect(createAnalyticsEventMock).toBeCalledWith('some-failed-payload');
    expect(event.fire).toBeCalledTimes(1);
  });

  it('should fire failed event if status is error and an error object is provided', () => {
    const error = new MediaCardError('upload');
    fireOperationalEvent(createAnalyticsEvent, 'error', fileAttributes, {
      error,
    });

    expect(getRenderErrorEventPayload).toBeCalledWith(fileAttributes, error);
    expect(createAnalyticsEventMock).toBeCalledWith('some-error-payload');
    expect(event.fire).toBeCalledTimes(1);
  });

  it('should fire suceeded event if status is complete and there is no dataURI', () => {
    fireOperationalEvent(createAnalyticsEvent, 'complete', fileAttributes);

    expect(getRenderSucceededEventPayload).toBeCalledWith(fileAttributes);
    expect(createAnalyticsEventMock).toBeCalledWith('some-suceeded-payload');
    expect(event.fire).toBeCalledTimes(1);
  });
});
