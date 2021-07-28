import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import {
  doc,
  ol,
  li,
  p,
  hardBreak,
  date,
  panel,
  ul,
  expand,
  breakout,
  layoutColumn,
  layoutSection,
  strong,
  code_block,
  indentation,
  BuilderContent,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  enterKeyCommand,
  backspaceKeyCommand,
  indentList,
  toggleList,
} from '../../../commands';
import analyticsPlugin, {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../../../../analytics';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import listPlugin from '../../..';
import blockTypePlugin from '../../../../block-type';
import datePlugin from '../../../../date';
import codeBlockPlugin from '../../../../code-block';
import panelPlugin from '../../../../panel';
import indentationPlugin from '../../../../indentation';
import breakoutPlugin from '../../../../breakout';
import widthPlugin from '../../../../width';
import expandPlugin from '../../../../expand';
import layoutPlugin from '../../../../layout';
import textFormattingPlugin from '../../../../text-formatting';

describe('lists plugin -> commands', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    const preset = new Preset<LightEditorPlugin>()
      .add(listPlugin)
      .add([analyticsPlugin, { createAnalyticsEvent }])
      .add(blockTypePlugin)
      .add(datePlugin)
      .add(codeBlockPlugin)
      .add(panelPlugin)
      .add(indentationPlugin)
      .add(breakoutPlugin)
      .add(widthPlugin)
      .add(expandPlugin)
      .add([layoutPlugin, { allowBreakout: true }])
      .add(textFormattingPlugin);

    return createEditor({
      doc,
      preset,
    });
  };

  describe('enterKeyCommand', () => {
    it('should not outdent a list when list item has visible content', () => {
      const timestamp = Date.now();
      const { editorView } = editor(
        doc(ol(li(p('text')), li(p('{<>}', hardBreak(), date({ timestamp }))))),
      );
      enterKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          ol(
            li(p('text')),
            li(p('')),
            li(p('', hardBreak(), date({ timestamp }))),
          ),
        ),
      );
    });
  });

  describe('backspaceKeyCommand', () => {
    describe('when cursor is inside nested node', () => {
      it('should not outdent a list', () => {
        const { editorView } = editor(doc(ol(li(code_block()('{<>}text')))));

        backspaceKeyCommand(editorView.state, editorView.dispatch);

        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(code_block()('text')))),
        );
      });
    });

    describe('when GapCursor is inside a listItem and before the nested codeBlock', () => {
      it('should outdent a list', () => {
        const { editorView } = editor(
          doc(ol(li('{<gap|>}', code_block()('text')))),
        );

        backspaceKeyCommand(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(doc(code_block()('text')));
      });
    });

    describe('when GapCursor is before a codeBlock and after a list', () => {
      it('should join codeBlock with the list', () => {
        const { editorView } = editor(
          doc(ol(li(p('text'))), '{<gap|>}', code_block()('code')),
        );

        backspaceKeyCommand(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('text')), li(code_block()('code')))),
        );
      });
    });
  });

  describe('indentList', () => {
    it('should not indent if selection is not inside a list', () => {
      // prettier-ignore
      const { editorView: { state, dispatch } } = editor(
        doc(
          p('{<>}text'),
          ol(
            li(p('A')),
            li(p('B'))
          ),
        ),
      );

      expect(indentList(INPUT_METHOD.KEYBOARD)(state, dispatch)).toBeFalsy();
    });

    it('should not apply the change it it causes the indentation to go past the maximum', () => {
      // prettier-ignore
      const { editorView: { state, dispatch } } = editor(
        doc(
          ol(
            li(p('A'),
            ol(
              li(p('B'),
              ol(
                li(p('C'),
                ol(
                  li(p('D'),
                  ol(
                    li(p('E'),
                    ol(
                      li(p('F1')),
                      li(p('{<>}F2')),
                    )),
                  )),
                )),
              )),
            )),
          ),
        ),
      );

      expect(indentList(INPUT_METHOD.KEYBOARD)(state, dispatch)).toBeTruthy();
    });

    it('should indent otherwise', () => {
      // prettier-ignore
      const { editorView: { state, dispatch } } = editor(
        doc(
          ol(
            li(p('A')),
            li(p('B'))
          ),
        ),
      );

      expect(indentList(INPUT_METHOD.KEYBOARD)(state, dispatch)).toBeTruthy();
    });

    it('should add analytics', () => {
      createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
      const {
        editorView: { state, dispatch },
      } = editor(doc(ol(li(p('A')), li(p('B')))));

      indentList(INPUT_METHOD.KEYBOARD)(state, dispatch);

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: ACTION.INDENTED,
        actionSubject: ACTION_SUBJECT.LIST,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          inputMethod: INPUT_METHOD.KEYBOARD,
        }),
      });
    });
  });

  describe('toggleList', () => {
    describe('strips off the indent marks', () => {
      it.each<
        [
          string,
          {
            listType: 'bulletList' | 'orderedList';
            content: BuilderContent;
            expected: BuilderContent;
          },
        ]
      >([
        [
          'when bullet list toggled on an indented text with cursor in the end',
          {
            listType: 'bulletList',
            content: indentation({ level: 1 })(p('text{<>}')),
            expected: ul(li(p('text{<>}'))),
          },
        ],
        [
          'when ordered list toggled on an indented text with cursor in the beginning',
          {
            listType: 'orderedList',
            content: indentation({ level: 1 })(p('{<>}text')),
            expected: ol(li(p('text{<>}'))),
          },
        ],
        [
          'when bullet list toggled on an indented text with selected text',
          {
            listType: 'bulletList',
            content: indentation({ level: 1 })(p('{<text>}')),
            expected: ul(li(p('{<text>}'))),
          },
        ],
      ])('%s', (name, { listType, content, expected }) => {
        const { editorView } = editor(doc(content));

        toggleList(INPUT_METHOD.TOOLBAR, listType)(
          editorView.state,
          editorView.dispatch,
        );
        expect(editorView.state.doc).toEqualDocument(doc(expected));
      });
    });

    it('should be able to toggle ol to ul inside a panel', () => {
      const { editorView } = editor(doc(panel()(ol(li(p('text{<>}'))))));

      toggleList(INPUT_METHOD.TOOLBAR, 'bulletList')(
        editorView.state,
        editorView.dispatch,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(panel()(ul(li(p('text{<>}'))))),
      );
    });

    it('should be able to toggle ul to ol inside a panel', () => {
      const { editorView } = editor(doc(panel()(ul(li(p('text{<>}'))))));

      toggleList(INPUT_METHOD.TOOLBAR, 'orderedList')(
        editorView.state,
        editorView.dispatch,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(panel()(ol(li(p('text{<>}'))))),
      );
    });

    it('should keep breakout marks where they are valid on expands', () => {
      const { editorView } = editor(
        doc(breakout({ mode: 'wide' })(expand()(p('{<>}')))),
      );

      const { state, dispatch } = editorView;

      toggleList(INPUT_METHOD.TOOLBAR, 'bulletList')(state, dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc('{expandPos}', breakout({ mode: 'wide' })(expand()(ul(li(p()))))),
      );
    });

    it('should keep breakout marks where they are valid on layouts', () => {
      const { editorView } = editor(
        doc(
          breakout({ mode: 'wide' })(
            layoutSection(
              layoutColumn({ width: 50 })(p('{<>}')),
              layoutColumn({ width: 50 })(p()),
            ),
          ),
        ),
      );

      const { state, dispatch } = editorView;

      toggleList(INPUT_METHOD.TOOLBAR, 'bulletList')(state, dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          breakout({ mode: 'wide' })(
            layoutSection(
              layoutColumn({ width: 50 })(ul(li(p()))),
              layoutColumn({ width: 50 })(p()),
            ),
          ),
        ),
      );
    });
  });

  describe('Copy and paste', () => {
    it('should not create list item when text with marks is pasted', () => {
      const text = `<b>Marked Text</b> 1. item`;
      const { editorView } = editor(doc(p('{<>}')));

      dispatchPasteEvent(editorView, { html: text });
      expect(editorView.state.doc).toEqualDocument(
        doc(p(strong('Marked Text'), ' 1. item')),
      );
    });
  });
});
