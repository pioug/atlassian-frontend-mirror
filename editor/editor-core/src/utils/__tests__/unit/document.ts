import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
} from '../../../plugins/analytics/types/enums';
import { processRawValue } from '../../document';

describe('document: processRawValue', () => {
  describe('when an invalid prosemirror model is processed', () => {
    const initialDoc = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'lol',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'http://gnu.org',
                  },
                },
                {
                  type: 'link',
                  attrs: {
                    href: 'http://atlassian.com',
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    it('should not throw an exception', () => {
      expect(() => {
        processRawValue(
          defaultSchema,
          initialDoc,
          undefined,
          undefined,
          undefined,
        );
      }).not.toThrow();
    });

    it('should call the dispatchAnalyticsEvent', () => {
      const dispatchAnalyticsEvent = jest.fn();
      try {
        processRawValue(
          defaultSchema,
          initialDoc,
          undefined,
          undefined,
          undefined,
          dispatchAnalyticsEvent,
        );
      } catch (e) {}

      expect(dispatchAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: ACTION.INVALID_PROSEMIRROR_DOCUMENT,
          actionSubject: ACTION_SUBJECT.EDITOR,
          eventType: EVENT_TYPE.OPERATIONAL,
          attributes: {
            error:
              'RangeError: Invalid collection of marks for node text: link,link',
          },
        }),
      );
    });
  });
});
