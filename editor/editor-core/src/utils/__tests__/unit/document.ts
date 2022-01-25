import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
} from '../../../plugins/analytics/types/enums';
import { processRawValue } from '../../document';

describe('document: processRawValue', () => {
  describe('invalid prosemirror model', () => {
    describe('when marks: [link,link] exist on a text node', () => {
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

      it('should return undefined', () => {
        let result = processRawValue(
          defaultSchema,
          initialDoc,
          undefined,
          undefined,
          undefined,
        );
        expect(result?.toJSON()).toEqual(undefined);
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
    describe('when marks: [link,code] exist on a text node', () => {
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
                    type: 'code',
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

      it('should return a repaired document, keeping the link and removing the code from the text', () => {
        const result = processRawValue(
          defaultSchema,
          initialDoc,
          undefined,
          undefined,
          undefined,
        );
        expect(result?.toJSON()).toEqual({
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
                        __confluenceMetadata: null,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        });
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
            action: ACTION.TEXT_LINK_MARK_TRANSFORMED,
            actionSubject: ACTION_SUBJECT.EDITOR,
            eventType: EVENT_TYPE.OPERATIONAL,
          }),
        );
      });
    });

    describe('when marks: [textColor, link] exist on a text node', () => {
      const initialDoc = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'more',
                marks: [
                  {
                    type: 'link',
                    attrs: {
                      href: 'http://google.com.au',
                      __confluenceMetadata: null,
                    },
                  },
                  {
                    type: 'textColor',
                    attrs: {
                      color: '#6554c0',
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

      it('should return an unchanged doc', () => {
        let result = processRawValue(
          defaultSchema,
          initialDoc,
          undefined,
          undefined,
          undefined,
        );
        expect(result?.toJSON()).toEqual({
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'more',
                  marks: [
                    {
                      type: 'link',
                      attrs: {
                        href: 'http://google.com.au',
                        __confluenceMetadata: null,
                      },
                    },
                    {
                      type: 'textColor',
                      attrs: {
                        color: '#6554c0',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        });
      });

      it('should not call the dispatchAnalyticsEvent', () => {
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

        expect(dispatchAnalyticsEvent).not.toHaveBeenCalledWith();
      });
    });
  });
});
