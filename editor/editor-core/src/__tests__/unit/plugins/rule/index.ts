import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { bodiedExtensionData } from '@atlaskit/editor-test-helpers/mock-extension-data';
import {
  doc,
  hr,
  p,
  bodiedExtension,
  panel,
  DocBuilder,
  ul,
  li,
  ol,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { insertHorizontalRule } from '../../../../plugins/rule/commands';
import { INPUT_METHOD } from '../../../../plugins/analytics';

describe('rule', () => {
  const createEditor = createEditorFactory();

  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      editorProps: {
        allowExtension: {
          allowBreakout: true,
        },
        allowAnalyticsGASV3: true,
        allowRule: true,
        allowPanel: true,
        allowNewInsertionBehaviour: true,
      },
      createAnalyticsEvent,
    });
  };

  describe('keymap', () => {
    describe('when hits Shift-Ctrl--', () => {
      it('should create rule', () => {
        const { editorView } = editor(doc(p('text{<>}')));
        sendKeyToPm(editorView, 'Shift-Ctrl--');
        expect(editorView.state.doc).toEqualDocument(doc(p('text'), hr()));
      });

      it('should create rule inside bodied ext', () => {
        const extensionAttrs = bodiedExtensionData[1].attrs;
        const { editorView } = editor(
          doc(bodiedExtension(extensionAttrs)(p('{<>}'), p('text'))),
        );
        sendKeyToPm(editorView, 'Shift-Ctrl--');
        expect(editorView.state.doc).toEqualDocument(
          doc(bodiedExtension(extensionAttrs)(hr(), p('{<>}text'))),
        );
      });

      it('should fire analytics event when create rule', () => {
        const { editorView } = editor(doc(p('{<>}')));
        sendKeyToPm(editorView, 'Shift-Ctrl--');
        expect(createAnalyticsEvent).toBeCalledWith({
          action: 'inserted',
          actionSubject: 'document',
          actionSubjectId: 'divider',
          attributes: expect.objectContaining({ inputMethod: 'shortcut' }),
          eventType: 'track',
        });
      });
    });

    describe('when hits Shift-Ctrl-- in a list', () => {
      it('should safe inserts if one empty item in a list', () => {
        const { editorView } = editor(doc(ul(li(p('{<>}')))));
        sendKeyToPm(editorView, 'Shift-Ctrl--');
        expect(editorView.state.doc).toEqualDocument(doc(ul(li(p())), hr()));
      });

      it('should safe inserts if one item in a list', () => {
        const { editorView } = editor(doc(ul(li(p('aaa {<>}')))));
        sendKeyToPm(editorView, 'Shift-Ctrl--');
        expect(editorView.state.doc).toEqualDocument(
          doc(ul(li(p('aaa '))), hr()),
        );
      });

      it('should split in a flat list', () => {
        const { editorView } = editor(
          doc(ul(li(p('aaa')), li(p('bbb {<>}')), li(p('ccc')))),
        );
        sendKeyToPm(editorView, 'Shift-Ctrl--');
        expect(editorView.state.doc).toEqualDocument(
          doc(ul(li(p('aaa')), li(p('bbb '))), hr(), ul(li(p('ccc')))),
        );
      });

      it('should safe insert in a nested list', () => {
        const { editorView } = editor(
          doc(
            ul(
              li(p('aa'), ul(li(p('aaa')), li(p('bbb {<>}')), li(p('ccc')))),
              li(p('bb')),
            ),
          ),
        );
        sendKeyToPm(editorView, 'Shift-Ctrl--');
        expect(editorView.state.doc).toEqualDocument(
          doc(
            ul(
              li(p('aa'), ul(li(p('aaa')), li(p('bbb ')), li(p('ccc')))),
              li(p('bb')),
            ),
            hr(),
          ),
        );
      });
    });
  });

  describe('insert via quick insert', () => {
    describe('unlisted', () => {
      it('should split list when rule inserts in the end of an item', async () => {
        const { editorView, typeAheadTool } = editor(
          doc(ul(li(p('aa')), li(p('bb {<>}')), li(p('cc')))),
        );

        await typeAheadTool.searchQuickInsert('divider')?.insert({ index: 0 });

        expect(editorView.state.doc).toEqualDocument(
          doc(ul(li(p('aa')), li(p('bb '))), hr(), ul(li(p('cc')))),
        );
      });

      it('should split list when rule inserts in the middle of an item', async () => {
        const { editorView, typeAheadTool } = editor(
          doc(ul(li(p('aa')), li(p('b{<>}b')), li(p('cc')))),
        );

        await typeAheadTool.searchQuickInsert('divider')?.insert({ index: 0 });

        expect(editorView.state.doc).toEqualDocument(
          doc(ul(li(p('aa')), li(p('b'))), hr(), ul(li(p('b')), li(p('cc')))),
        );
      });
    });

    describe('orderlist', () => {
      it('should split list when rule inserts in the end of an item', async () => {
        const { editorView, typeAheadTool } = editor(
          doc(ol()(li(p('aa')), li(p('bb {<>}')), li(p('cc')))),
        );

        await typeAheadTool.searchQuickInsert('divider')?.insert({ index: 0 });

        expect(editorView.state.doc).toEqualDocument(
          doc(ol()(li(p('aa')), li(p('bb '))), hr(), ol()(li(p('cc')))),
        );
      });

      it('should split list when rule inserts in the middle of an item', async () => {
        const { editorView, typeAheadTool } = editor(
          doc(ol()(li(p('aa')), li(p('b{<>}b')), li(p('cc')))),
        );

        await typeAheadTool.searchQuickInsert('divider')?.insert({ index: 0 });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol()(li(p('aa')), li(p('b'))),
            hr(),
            ol()(li(p('b')), li(p('cc'))),
          ),
        );
      });
    });
  });

  describe('insert via toolbar', () => {
    it('should insert rule when selection is empty paragraph', () => {
      const { editorView } = editor(doc(p('{<>}')));
      insertHorizontalRule(INPUT_METHOD.TOOLBAR)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state.doc).toEqualDocument(doc(hr()));
    });

    it('should split the paragraph and insert rule when selection is in the middle of a paragraph', () => {
      const { editorView } = editor(doc(p('this is a{<>} paragraph')));
      insertHorizontalRule(INPUT_METHOD.TOOLBAR)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state.doc).toEqualDocument(
        // prettier-ignore
        doc(
          p('this is a'),
          hr(),
          p(' paragraph')
        ),
      );
    });

    it('should insert rule below when selection is in the middle of a node which does not allow rules', () => {
      const { editorView } = editor(
        // prettier-ignore
        doc(
          panel()(p('this is a {<>}paragraph')),
          p()
        ),
      );
      insertHorizontalRule(INPUT_METHOD.TOOLBAR)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state.doc).toEqualDocument(
        // prettier-ignore
        doc(
          panel()(
            p('this is a paragraph')
          ),
          hr(),
          p(),
        ),
      );
    });

    it('should safe insert the rule when in a nested list with space in the first child', () => {
      const { editorView } = editor(
        doc(
          ul(
            li(p('aa'), ul(li(p('aaa {<>}')), li(p('bbb')), li(p('ccc')))),
            li(p('bb')),
          ),
        ),
      );
      insertHorizontalRule(INPUT_METHOD.TOOLBAR)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state.doc).toEqualDocument(
        doc(
          ul(
            li(p('aa'), ul(li(p('aaa ')), li(p('bbb')), li(p('ccc')))),
            li(p('bb')),
          ),
          hr(),
        ),
      );
    });

    it('should safe insert the rule when in a nested list without space in the front child', () => {
      const { editorView } = editor(
        doc(
          ul(
            li(p('aa'), ul(li(p('aaa{<>}')), li(p('bbb')), li(p('ccc')))),
            li(p('bb')),
          ),
        ),
      );
      insertHorizontalRule(INPUT_METHOD.TOOLBAR)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state.doc).toEqualDocument(
        doc(
          ul(
            li(p('aa'), ul(li(p('aaa')), li(p('bbb')), li(p('ccc')))),
            li(p('bb')),
          ),
          hr(),
        ),
      );
    });

    it('should safe insert the rule when in a nested list with space in the middle child', () => {
      const { editorView } = editor(
        doc(
          ul(
            li(p('aa'), ul(li(p('aaa')), li(p('bbb {<>}')), li(p('ccc')))),
            li(p('bb')),
          ),
        ),
      );
      insertHorizontalRule(INPUT_METHOD.TOOLBAR)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state.doc).toEqualDocument(
        doc(
          ul(
            li(p('aa'), ul(li(p('aaa')), li(p('bbb ')), li(p('ccc')))),
            li(p('bb')),
          ),
          hr(),
        ),
      );
    });

    it('should safe insert the rule when in a nested list without space in the middle child', () => {
      const { editorView } = editor(
        doc(
          ul(
            li(p('aa'), ul(li(p('aaa')), li(p('bbb{<>}')), li(p('ccc')))),
            li(p('bb')),
          ),
        ),
      );
      insertHorizontalRule(INPUT_METHOD.TOOLBAR)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state.doc).toEqualDocument(
        doc(
          ul(
            li(p('aa'), ul(li(p('aaa')), li(p('bbb')), li(p('ccc')))),
            li(p('bb')),
          ),
          hr(),
        ),
      );
    });

    it('should safe insert the rule when in a nested list with space in the last child', () => {
      const { editorView } = editor(
        doc(
          ul(
            li(p('aa'), ul(li(p('aaa')), li(p('bbb')), li(p('ccc {<>}')))),
            li(p('bb')),
          ),
        ),
      );
      insertHorizontalRule(INPUT_METHOD.TOOLBAR)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state.doc).toEqualDocument(
        doc(
          ul(
            li(p('aa'), ul(li(p('aaa')), li(p('bbb')), li(p('ccc ')))),
            li(p('bb')),
          ),
          hr(),
        ),
      );
    });

    it('should safe insert the rule when in a nested list without space in the last child', () => {
      const { editorView } = editor(
        doc(
          ul(
            li(p('aa'), ul(li(p('aaa')), li(p('bbb')), li(p('ccc{<>}')))),
            li(p('bb')),
          ),
        ),
      );
      insertHorizontalRule(INPUT_METHOD.TOOLBAR)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state.doc).toEqualDocument(
        doc(
          ul(
            li(p('aa'), ul(li(p('aaa')), li(p('bbb')), li(p('ccc')))),
            li(p('bb')),
          ),
          hr(),
        ),
      );
    });

    it('should split rule for first child at the root indentation of a nested list', () => {
      const { editorView } = editor(
        doc(
          ul(
            li(p('aa{<>}')),
            li(p('bb'), ul(li(p('aaa')), li(p('bbb')))),
            li(p('cc')),
          ),
        ),
      );
      insertHorizontalRule(INPUT_METHOD.TOOLBAR)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state.doc).toEqualDocument(
        doc(
          ul(li(p('aa'))),
          hr(),
          ul(li(p('bb'), ul(li(p('aaa')), li(p('bbb')))), li(p('cc'))),
        ),
      );
    });

    it('should split rule for the middle child at the root indentation of a nested list', () => {
      const { editorView } = editor(
        doc(
          ul(
            li(p('aa')),
            li(p('bb{<>}'), ul(li(p('aaa')), li(p('bbb')))),
            li(p('cc')),
          ),
        ),
      );
      insertHorizontalRule(INPUT_METHOD.TOOLBAR)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state.doc).toEqualDocument(
        doc(
          ul(li(p('aa')), li(p('bb'), ul(li(p('aaa')), li(p('bbb'))))),
          hr(),
          ul(li(p('cc'))),
        ),
      );
    });
  });
});
