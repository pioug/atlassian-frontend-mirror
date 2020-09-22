import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { doc, li, p, ul } from '@atlaskit/editor-test-helpers/schema-builder';
import listPlugin from '../..';
import analyticsPlugin, {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INDENT_DIRECTION,
  INPUT_METHOD,
} from '../../../analytics';
import { indentList, outdentList } from '../../commands/index';

describe('list-indent', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  beforeEach(() => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
  });

  const editor = (doc: any) => {
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
      'root',
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
        canSink: false,
      },
    ],
    [
      'root index',
      // prettier-ignore
      doc(
        ul(
          li(p('A')),
          li(p('B{<>}')),
        ),
      ),
      {
        itemIndexAtSelectionStart: 1,
        itemIndexAtSelectionEnd: 1,
        indentLevelAtSelectionStart: 0,
        indentLevelAtSelectionEnd: 0,
        itemsInSelection: 1,
        canSink: true,
      },
    ],
    [
      'root ranged selection',
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
        canSink: true,
      },
    ],
    [
      'nested',
      // prettier-ignore
      doc(
        ul(
          li(p('A'),
          ul(
            li(p('{<>}A1'))),
          ),
        ),
      ),
      {
        itemIndexAtSelectionStart: 0,
        itemIndexAtSelectionEnd: 0,
        indentLevelAtSelectionStart: 1,
        indentLevelAtSelectionEnd: 1,
        itemsInSelection: 1,
        canSink: false,
      },
    ],
    [
      'nested descending',
      // prettier-ignore
      doc(
        ul(
          li(p('A'),
          ul(
            li(p('{<}A1'),
            ul(
              li(p('A1.1'),
              ul(
                li(p('A1.1.1{>}'))))),
              ),
            ),
          ),
        ),
      ),
      {
        itemIndexAtSelectionStart: 0,
        itemIndexAtSelectionEnd: 0,
        indentLevelAtSelectionStart: 1,
        indentLevelAtSelectionEnd: 3,
        itemsInSelection: 3,
        canSink: false,
      },
    ],
    [
      'nested ascending',
      // prettier-ignore
      doc(
        ul(
          li(p('A'),
          ul(
            li(p('A1'),
            ul(
              li(p('A1.1'),
              ul(
                li(p('{<}A1.1.1'))),
              ),
              li(p('A1.2'))),
            ),
            li(p('A2'))),
          ),
          li(p('B{>}'))
        ),
      ),
      {
        itemIndexAtSelectionStart: 0,
        itemIndexAtSelectionEnd: 1,
        indentLevelAtSelectionStart: 3,
        indentLevelAtSelectionEnd: 0,
        itemsInSelection: 4,
        canSink: false,
      },
    ],
    [
      'max depth',
      // prettier-ignore
      doc(
        ul(
          li(p('A'),
          ul(
            li(p('{<}A1'),
            ul(
              li(p('A1.1'),
              ul(
                li(p('A1.1.1'),
                ul(
                  li(p('A1.1.1.1'),
                  ul(
                    li(p('A1.1.1.1.1{>}'))))))),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
      {
        itemIndexAtSelectionStart: 0,
        itemIndexAtSelectionEnd: 0,
        indentLevelAtSelectionStart: 1,
        indentLevelAtSelectionEnd: 5,
        itemsInSelection: 5,
        canSink: false,
      },
    ],
  ])('analytics', (scenario, documentNode, expectedAttributes) => {
    it(`indent for ${scenario}`, () => {
      const {
        editorView: { state, dispatch },
      } = editor(documentNode);
      indentList()(state, dispatch);

      expect(createAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: ACTION.INDENTED,
          actionSubject: ACTION_SUBJECT.LIST,
          actionSubjectId: ACTION_SUBJECT_ID.FORMAT_LIST_BULLET,
          eventType: EVENT_TYPE.TRACK,
          attributes: expect.objectContaining({
            indentDirection: INDENT_DIRECTION.INDENT,
            inputMethod: INPUT_METHOD.KEYBOARD,
            ...expectedAttributes,
          }),
        }),
      );
    });

    it(`outdent for ${scenario}`, () => {
      const {
        editorView: { state, dispatch },
      } = editor(documentNode);
      outdentList()(state, dispatch);

      // `canSink` won't be applied to outdent events
      const { canSink, ...otherAttributes } = expectedAttributes;

      expect(createAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: ACTION.INDENTED,
          actionSubject: ACTION_SUBJECT.LIST,
          actionSubjectId: ACTION_SUBJECT_ID.FORMAT_LIST_BULLET,
          eventType: EVENT_TYPE.TRACK,
          attributes: expect.objectContaining({
            indentDirection: INDENT_DIRECTION.OUTDENT,
            inputMethod: INPUT_METHOD.KEYBOARD,
            ...otherAttributes,
          }),
        }),
      );
    });
  });
});
