import {
  doc,
  li,
  p,
  ul,
  ol,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import analyticsPlugin, {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../../../../analytics';
import { toggleOrderedList, toggleBulletList } from '../../../commands/index';
import listPlugin from '../../..';

describe('list-conversion', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  beforeEach(() => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
  });

  const editor = (doc: DocBuilder) => {
    const preset = new Preset<LightEditorPlugin>()
      .add(listPlugin)
      .add([analyticsPlugin, { createAnalyticsEvent }]);

    return createEditor({
      doc,
      preset,
    });
  };
  describe.each([
    [
      'sibling',
      // prettier-ignore
      doc(
        ul(
          li(p('A{<>}')),
          li(p('B')),
        ),
      ),
      {
        itemIndexAtSelectionStart: 0,
        itemIndexAtSelectionEnd: 0,
        indentLevelAtSelectionStart: 0,
        indentLevelAtSelectionEnd: 0,
        itemsInSelection: 1,
      },
    ],
    [
      'nestedSibling',
      // prettier-ignore
      doc(
        ul(
          li(p('A'),
          ul(
            li(p('{<>}A1'))),
          ),
          li(p('B'),
          ul(
            li(p('B1'))),
          ),
        ),
      ),
      {
        itemIndexAtSelectionStart: 0,
        itemIndexAtSelectionEnd: 0,
        indentLevelAtSelectionStart: 1,
        indentLevelAtSelectionEnd: 1,
        itemsInSelection: 1,
      },
    ],
    [
      'withChildren',
      // prettier-ignore
      doc(
        ul(
          li(p('A{<>}'),
          ul(
            li(p('A1')),
            li(p('A2'))),
          ),
          li(p('B'),
          ul(
            li(p('B1'))),
          ),
        ),
      ),
      {
        itemIndexAtSelectionStart: 0,
        itemIndexAtSelectionEnd: 0,
        indentLevelAtSelectionStart: 0,
        indentLevelAtSelectionEnd: 0,
        itemsInSelection: 1,
      },
    ],
    [
      'rangedSiblingStart',
      // prettier-ignore
      doc(
        ul(
          li(p('{<}A')),
          li(p('B{>}')),
          li(p('C')),
        ),
      ),
      {
        itemIndexAtSelectionStart: 0,
        itemIndexAtSelectionEnd: 1,
        indentLevelAtSelectionStart: 0,
        indentLevelAtSelectionEnd: 0,
        itemsInSelection: 2,
      },
    ],
    [
      'rangedSiblingMid',
      // prettier-ignore
      doc(
        ul(
          li(p('A')),
          li(p('{<}B')),
          li(p('C{>}')),
        ),
      ),
      {
        itemIndexAtSelectionStart: 1,
        itemIndexAtSelectionEnd: 2,
        indentLevelAtSelectionStart: 0,
        indentLevelAtSelectionEnd: 0,
        itemsInSelection: 2,
      },
    ],

    [
      'rangedNestedDescending',
      // prettier-ignore
      doc(
        ul(
          li(p('{<}A'),
          ul(
            li(p('A1'),
            ul(
              li(p('1.1{>}')))),
            ),
          ),
        ),
      ),
      {
        itemIndexAtSelectionStart: 0,
        itemIndexAtSelectionEnd: 0,
        indentLevelAtSelectionStart: 0,
        indentLevelAtSelectionEnd: 2,
        itemsInSelection: 3,
      },
    ],

    [
      'rangedNestedAscending',
      // prettier-ignore
      doc(
        ul(
          li(p('A'),
          ul(
            li(p('A1'),
            ul(
              li(p('{<}A1.1'))),
            ),
            li(p('A2'))),
          ),
          li(p('B{>}')),
        ),
      ),
      {
        itemIndexAtSelectionStart: 0,
        itemIndexAtSelectionEnd: 1,
        indentLevelAtSelectionStart: 2,
        indentLevelAtSelectionEnd: 0,
        itemsInSelection: 3,
      },
    ],
  ])('list-conversion', (scenario, documentNode, expectedAttributes) => {
    it(`analytics ul to ol ${scenario}`, () => {
      const { editorView } = editor(documentNode);
      toggleOrderedList(editorView, INPUT_METHOD.KEYBOARD);

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: ACTION.CONVERTED,
        actionSubject: ACTION_SUBJECT.LIST,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          transformedFrom: ACTION_SUBJECT_ID.FORMAT_LIST_BULLET,
          inputMethod: INPUT_METHOD.KEYBOARD,
          ...expectedAttributes,
        }),
      });
    });
  });

  it(`list-conversion analytics ol to ul`, () => {
    const { editorView } = editor(
      // prettier-ignore
      doc(
        ol(
          li(p('A'),
          ol(
            li(p('{<>}A1'))),
          ),
          li(p('B'),
          ol(
            li(p('B1'))),
          ),
        ),
      ),
    );
    toggleBulletList(editorView, INPUT_METHOD.KEYBOARD);

    expect(createAnalyticsEvent).toHaveBeenCalledWith({
      action: ACTION.CONVERTED,
      actionSubject: ACTION_SUBJECT.LIST,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_LIST_BULLET,
      eventType: EVENT_TYPE.TRACK,
      attributes: expect.objectContaining({
        transformedFrom: ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER,
        inputMethod: INPUT_METHOD.KEYBOARD,
        itemIndexAtSelectionStart: 0,
        itemIndexAtSelectionEnd: 0,
        indentLevelAtSelectionStart: 1,
        indentLevelAtSelectionEnd: 1,
        itemsInSelection: 1,
      }),
    });
  });

  it(`list-conversion analytics for untoggling list`, () => {
    const { editorView } = editor(
      // prettier-ignore
      doc(
        ul(
          li(p('A{<>}')),
        ),
      ),
    );
    toggleBulletList(editorView, INPUT_METHOD.KEYBOARD);

    expect(createAnalyticsEvent).toHaveBeenCalledWith({
      action: ACTION.CONVERTED,
      actionSubject: ACTION_SUBJECT.LIST,
      actionSubjectId: ACTION_SUBJECT_ID.TEXT,
      eventType: EVENT_TYPE.TRACK,
      attributes: expect.objectContaining({
        transformedFrom: ACTION_SUBJECT_ID.FORMAT_LIST_BULLET,
        inputMethod: INPUT_METHOD.KEYBOARD,
        itemIndexAtSelectionStart: 0,
        itemIndexAtSelectionEnd: 0,
        indentLevelAtSelectionStart: 0,
        indentLevelAtSelectionEnd: 0,
        itemsInSelection: 1,
      }),
    });
  });
});
