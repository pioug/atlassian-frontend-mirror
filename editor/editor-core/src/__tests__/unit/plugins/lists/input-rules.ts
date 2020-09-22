import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import listTypePlugin from '../../../../plugins/lists';
import {
  code_block,
  doc,
  li,
  ol,
  p,
  ul,
  hardBreak,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { EditorView } from 'prosemirror-view';
import analyticsPlugin from '../../../../plugins/analytics';
import basePlugins from '../../../../plugins/base';
import blockType from '../../../../plugins/block-type';
import codeBlockTypePlugin from '../../../../plugins/code-block';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

describe('inputrules', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: any) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));

    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(listTypePlugin)
        .add(basePlugins)
        .add(blockType)
        .add(codeBlockTypePlugin)
        .add([analyticsPlugin, { createAnalyticsEvent }]),
    });
  };

  describe('bullet list rule', () => {
    describe('type "* "', () => {
      let editorView: EditorView;
      let sel: number;

      beforeEach(() => {
        ({ editorView, sel } = editor(doc(p('{<>}'))));

        insertText(editorView, '* ', sel);
      });

      it('should convert to a bullet list item', () => {
        expect(editorView.state.doc).toEqualDocument(doc(ul(li(p()))));
      });

      it('should create analytics GAS V3 event', () => {
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'formatted',
          actionSubject: 'text',
          eventType: 'track',
          actionSubjectId: 'bulletedList',
          attributes: expect.objectContaining({
            inputMethod: 'autoformatting',
          }),
        });
      });

      it('should convert to a bullet list item after shift+enter ', () => {
        const { editorView, sel } = editor(doc(p('test', hardBreak(), '{<>}')));
        insertText(editorView, '* ', sel);

        expect(editorView.state.doc).toEqualDocument(
          doc(p('test'), ul(li(p()))),
        );
      });

      it('should convert to a bullet list item after multiple shift+enter', () => {
        const { editorView, sel } = editor(
          doc(p('test', hardBreak(), hardBreak(), '{<>}')),
        );
        insertText(editorView, '* ', sel);

        expect(editorView.state.doc).toEqualDocument(
          doc(p('test', hardBreak()), ul(li(p()))),
        );
      });

      it('should convert to a bullet list item after shift+enter for only current line', () => {
        const { editorView, sel } = editor(
          doc(p('test1', hardBreak(), '{<>}test2', hardBreak(), 'test3')),
        );
        insertText(editorView, '* ', sel);

        expect(editorView.state.doc).toEqualDocument(
          doc(p('test1'), ul(li(p('test2'))), p('test3')),
        );
      });
    });

    describe('type "- "', () => {
      let editorView: EditorView;
      let sel: number;

      beforeEach(() => {
        ({ editorView, sel } = editor(doc(p('{<>}'))));

        insertText(editorView, '- ', sel);
      });

      it('should convert to a bullet list item', () => {
        expect(editorView.state.doc).toEqualDocument(doc(ul(li(p()))));
      });

      it('should create analytics GAS V3 event', () => {
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'formatted',
          actionSubject: 'text',
          eventType: 'track',
          actionSubjectId: 'bulletedList',
          attributes: expect.objectContaining({
            inputMethod: 'autoformatting',
          }),
        });
      });
    });

    it('should be not be possible to convert a code_clock to a list item', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));
      insertText(editorView, '* ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(code_block()('* ')));
    });
  });

  describe('ordered list rule', () => {
    describe('type "1. "', () => {
      let editorView: EditorView;
      let sel: number;

      beforeEach(() => {
        ({ editorView, sel } = editor(doc(p('{<>}'))));

        insertText(editorView, '1. ', sel);
      });

      it('should convert to an ordered list item', () => {
        expect(editorView.state.doc).toEqualDocument(doc(ol(li(p()))));
      });

      it('should create analytics GAS V3 event', () => {
        const expectedPayload = {
          action: 'formatted',
          actionSubject: 'text',
          eventType: 'track',
          actionSubjectId: 'numberedList',
          attributes: expect.objectContaining({
            inputMethod: 'autoformatting',
          }),
        };
        expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
      });

      it('should convert to a ordered list item after shift+enter', () => {
        const { editorView, sel } = editor(doc(p('test', hardBreak(), '{<>}')));
        insertText(editorView, '1. ', sel);

        expect(editorView.state.doc).toEqualDocument(
          doc(p('test'), ol(li(p()))),
        );
      });

      it('should convert to a ordered list item after multiple shift+enter', () => {
        const { editorView, sel } = editor(
          doc(p('test', hardBreak(), hardBreak(), '{<>}')),
        );
        insertText(editorView, '1. ', sel);

        expect(editorView.state.doc).toEqualDocument(
          doc(p('test', hardBreak()), ol(li(p()))),
        );
      });
    });

    describe('type "1) "', () => {
      let editorView: EditorView;
      let sel: number;

      beforeEach(() => {
        ({ editorView, sel } = editor(doc(p('{<>}'))));

        insertText(editorView, '1) ', sel);
      });

      it('should convert to an ordered list item', () => {
        expect(editorView.state.doc).toEqualDocument(doc(ol(li(p()))));
      });

      it('should create analytics GAS V3 event', () => {
        const expectedPayload = {
          action: 'formatted',
          actionSubject: 'text',
          eventType: 'track',
          actionSubjectId: 'numberedList',
          attributes: expect.objectContaining({
            inputMethod: 'autoformatting',
          }),
        };
        expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
      });
    });

    describe('for numbers other than 1', () => {
      it('should not convert "2. " to a ordered list item', () => {
        const { editorView, sel } = editor(doc(p('{<>}')));

        insertText(editorView, '2. ', sel);
        expect(editorView.state.doc).toEqualDocument(doc(p('2. ')));
      });

      it('should not convert "2. " after shift+enter to a ordered list item', () => {
        const { editorView, sel } = editor(doc(p('test', hardBreak(), '{<>}')));
        insertText(editorView, '2. ', sel);
        expect(editorView.state.doc).toEqualDocument(
          doc(p('test', hardBreak(), '2. ')),
        );
      });

      it('should not convert "2. " after multiple shift+enter to a ordered list item', () => {
        const { editorView, sel } = editor(
          doc(p('test', hardBreak(), hardBreak(), '{<>}')),
        );
        insertText(editorView, '2. ', sel);
        expect(editorView.state.doc).toEqualDocument(
          doc(p('test', hardBreak(), hardBreak(), '2. ')),
        );
      });

      it('should not convert "2) " to a ordered list item', () => {
        const { editorView, sel } = editor(doc(p('{<>}')));

        insertText(editorView, '2) ', sel);
        expect(editorView.state.doc).toEqualDocument(doc(p('2) ')));
      });
    });

    it('should not be possible to convert code block to bullet list item', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '1. ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(code_block()('1. ')));
    });
  });
});
