import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { processRawValue, getStepRange } from '@atlaskit/editor-common/utils';

describe('document: processRawValue', () => {
  describe('invalid prosemirror model', () => {
    // Doc version should be filled automatically from processRawValue()
    describe('doc without a version', () => {
      const initialDoc = {
        type: 'doc',
        content: [],
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
    });

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

      it('should return a repaired document, keeping the first link and removing the second one', () => {
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
        processRawValue(
          defaultSchema,
          initialDoc,
          undefined,
          undefined,
          undefined,
          dispatchAnalyticsEvent,
        );

        expect(dispatchAnalyticsEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            action: ACTION.DEDUPE_MARKS_TRANSFORMED_V2,
            actionSubject: ACTION_SUBJECT.EDITOR,
            eventType: EVENT_TYPE.OPERATIONAL,
            attributes: {
              discardedMarkTypes: ['link'],
            },
          }),
        );
      });
    });

    describe('when marks: [strong,strong] exist on a text node', () => {
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
                    type: 'strong',
                  },
                  {
                    type: 'strong',
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

      it('should return a repaired document, keeping the first strong mark and removing the second one', () => {
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
                      type: 'strong',
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
        processRawValue(
          defaultSchema,
          initialDoc,
          undefined,
          undefined,
          undefined,
          dispatchAnalyticsEvent,
        );

        expect(dispatchAnalyticsEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            action: ACTION.DEDUPE_MARKS_TRANSFORMED_V2,
            actionSubject: ACTION_SUBJECT.EDITOR,
            eventType: EVENT_TYPE.OPERATIONAL,
            attributes: {
              discardedMarkTypes: ['strong'],
            },
          }),
        );
      });
    });

    describe('various duplicate marks: when marks: [strong,strong] & [underline, underline] exist inside a document', () => {
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
                    type: 'strong',
                  },
                  {
                    type: 'strong',
                  },
                ],
              },
              {
                type: 'text',
                text: 'neko',
                marks: [
                  {
                    type: 'underline',
                  },
                  {
                    type: 'underline',
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

      it('should return a repaired document, keeping the first strong mark and removing the second one', () => {
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
                      type: 'strong',
                    },
                  ],
                },
                {
                  type: 'text',
                  text: 'neko',
                  marks: [
                    {
                      type: 'underline',
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
        processRawValue(
          defaultSchema,
          initialDoc,
          undefined,
          undefined,
          undefined,
          dispatchAnalyticsEvent,
        );

        expect(dispatchAnalyticsEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            action: ACTION.DEDUPE_MARKS_TRANSFORMED_V2,
            actionSubject: ACTION_SUBJECT.EDITOR,
            eventType: EVENT_TYPE.OPERATIONAL,
            attributes: {
              discardedMarkTypes: ['strong', 'underline'],
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

describe('document: getStepRange', () => {
  const helloSlice = (state: EditorState) =>
    new Slice(Fragment.from(p('Hello')(state.schema)), 1, 1);
  const xSlice = (state: EditorState) =>
    new Slice(Fragment.from(p('x')(state.schema)), 1, 1);

  it.each([
    [helloSlice, 7],
    [xSlice, 3],
  ])(
    'should return the from and to that describes the range of the changed document for a single change',
    (slice, expected) => {
      const state = createEditorState(doc(p('')));

      expect(getStepRange(state.tr)).toStrictEqual(null);

      const tr = state.tr.replaceRange(0, 0, slice(state));

      expect(getStepRange(tr)).toStrictEqual({
        from: 0,
        to: expected,
      });
    },
  );

  it('should return the from and to that describes the range of the changed document for a multiple additive steps', () => {
    const state = createEditorState(doc(p('')));

    expect(getStepRange(state.tr)).toStrictEqual(null);

    const tr = state.tr
      // insert "x" at the start of the doc
      .replaceRange(0, 0, xSlice(state))
      // add to the end of the doc "hello"
      .replaceRange(3, 3, helloSlice(state));

    expect(getStepRange(tr)).toStrictEqual({
      from: 0,
      to: 10,
    });
  });

  it('should return the from and to that describes the range of the changed document for a multiple overlapping/conflicting steps', () => {
    const state = createEditorState(doc(p('')));

    expect(getStepRange(state.tr)).toStrictEqual(null);

    const tr = state.tr
      // insert "x" at the start of the doc
      .replaceRange(0, 0, xSlice(state))
      // add to the end of the doc "hello"
      .replaceRange(3, 3, helloSlice(state))
      // replace the entire sequence of inserted ranges with "x"
      .replaceRange(0, 10, xSlice(state));

    expect(getStepRange(tr)).toStrictEqual({
      from: 0,
      to: 3,
    });
  });

  it('should return the from and to that describes the range of the changed document for a multiple steps where subsequent steps shrink the total step range', () => {
    const state = createEditorState(doc(p('')));

    expect(getStepRange(state.tr)).toStrictEqual(null);

    const tr = state.tr
      // insert "hello" at the start of the doc
      .replaceRange(0, 0, helloSlice(state))
      // replace part of the inserted range with a smaller range "x"
      // this should "shrink" the final step range
      .replaceRange(2, 5, xSlice(state));

    expect(getStepRange(tr)).toStrictEqual({
      from: 0,
      to: 5,
    });
  });
});
