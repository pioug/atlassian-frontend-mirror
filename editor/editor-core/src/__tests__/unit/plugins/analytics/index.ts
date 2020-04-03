import {
  fireAnalyticsEvent,
  AnalyticsEventPayload,
  ACTION,
  ACTION_SUBJECT,
  INPUT_METHOD,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '../../../../plugins/analytics';
import { editorAnalyticsChannel } from '../../../../plugins/analytics/consts';

describe('analytics', () => {
  const payload: AnalyticsEventPayload = {
    action: ACTION.CLICKED,
    actionSubject: ACTION_SUBJECT.BUTTON,
    actionSubjectId: ACTION_SUBJECT_ID.BUTTON_HELP,
    attributes: { inputMethod: INPUT_METHOD.TOOLBAR },
    eventType: EVENT_TYPE.UI,
  };

  describe('fireAnalyticsEvent', () => {
    let mockFire: jest.Mock;
    let mockCreateAnalyticsEvent: jest.Mock;
    let triggerAnalyticsEvent: any;

    beforeEach(() => {
      mockFire = jest.fn();
      mockCreateAnalyticsEvent = jest.fn(() => ({
        fire: mockFire,
      }));
      triggerAnalyticsEvent = fireAnalyticsEvent(mockCreateAnalyticsEvent);
    });

    it('fires analytics event payload', () => {
      triggerAnalyticsEvent({ payload });
      expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith(payload);
    });

    it('fires analytics event to default channel if none specified', () => {
      triggerAnalyticsEvent({ payload });
      expect(mockFire).toHaveBeenCalledWith(editorAnalyticsChannel);
    });

    it('fires analytics event payload to specific channel', () => {
      triggerAnalyticsEvent({ payload, channel: 'atlassian' });
      expect(mockFire).toHaveBeenCalledWith('atlassian');
    });
  });
});
