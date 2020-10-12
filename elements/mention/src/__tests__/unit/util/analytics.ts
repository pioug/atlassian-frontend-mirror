import { ELEMENTS_CHANNEL } from '../../../_constants';
import { fireAnalyticsMentionTypeaheadEvent } from '../../../util/analytics';
import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';

describe('Util Analytics', () => {
  const createAnalyticsEventMock = jest.fn();

  it('fireAnalyticsMentionTypeaheadEvent should called with correct payload', () => {
    const eventMock = {
      fire: jest.fn(),
    };
    createAnalyticsEventMock.mockReturnValue(eventMock);
    fireAnalyticsMentionTypeaheadEvent({
      createAnalyticsEvent: createAnalyticsEventMock,
    })('someAction', 10, ['abc-123', 'abc-123', 'def-456'], 'someQuery');

    expect(createAnalyticsEventMock).toBeCalledWith({
      action: 'someAction',
      actionSubject: 'mentionTypeahead',
      attributes: {
        packageName,
        packageVersion,
        componentName: 'mention',
        duration: 10,
        queryLength: 9,
        userIds: ['abc-123', 'abc-123', 'def-456'],
      },
      eventType: 'operational',
    });
    expect(eventMock.fire).toBeCalledWith(ELEMENTS_CHANNEL);
  });

  it('fireAnalyticsMentionTypeaheadEvent should pass 0 for queryLength when query is undefined', () => {
    const eventMock = {
      fire: jest.fn(),
    };
    createAnalyticsEventMock.mockReturnValue(eventMock);
    fireAnalyticsMentionTypeaheadEvent({
      createAnalyticsEvent: createAnalyticsEventMock,
    })('someAction', 10, ['abc-123'], undefined);

    expect(createAnalyticsEventMock).toBeCalledWith({
      action: 'someAction',
      actionSubject: 'mentionTypeahead',
      attributes: {
        packageName,
        packageVersion,
        componentName: 'mention',
        duration: 10,
        queryLength: 0,
        userIds: ['abc-123'],
      },
      eventType: 'operational',
    });
  });
});
