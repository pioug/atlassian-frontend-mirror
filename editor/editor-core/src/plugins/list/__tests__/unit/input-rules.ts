import {
  code_block,
  doc,
  li,
  ol,
  p,
  ul,
  hardBreak,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { EditorView } from 'prosemirror-view';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import listTypePlugin from '../..';
import analyticsPlugin from '../../../analytics';
import basePlugins from '../../../base';
import blockType from '../../../block-type';
import codeBlockTypePlugin from '../../../code-block';

describe('inputrules', () => {
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  const createEditor = createProsemirrorEditorFactory();

  let editorView: EditorView;
  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));

    const fakeEditor = createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(listTypePlugin)
        .add(basePlugins)
        .add(blockType)
        .add(codeBlockTypePlugin)
        .add([analyticsPlugin, { createAnalyticsEvent }]),
    });

    return fakeEditor.editorView;
  };

  describe('bullet list rule', () => {
    describe('type "* "', () => {
      it('should not convert to a bullet list item after shift+enter ', () => {
        const documentNode = doc(p('test', hardBreak(), '{<>}'));
        const expectedDocumentNode = doc(p('test', hardBreak(), '* '));
        const editorView = editor(documentNode);
        insertText(editorView, '* ');

        expect(editorView.state.doc).toEqualDocument(expectedDocumentNode);
      });

      it('should not convert to a bullet list item after multiple shift+enter', () => {
        const documentNode = doc(p('test', hardBreak(), hardBreak(), '{<>}'));
        const expectedDocumentNode = doc(
          p('test', hardBreak(), hardBreak(), '* '),
        );

        const editorView = editor(documentNode);
        insertText(editorView, '* ');

        expect(editorView.state.doc).toEqualDocument(expectedDocumentNode);
      });

      it('should not convert to a bullet list item after shift+enter for only current line', () => {
        const documentNode = doc(
          p('test1', hardBreak(), '{<>}test2', hardBreak(), 'test3'),
        );
        const expectedDocumentNode = doc(
          p('test1', hardBreak(), '* test2', hardBreak(), 'test3'),
        );
        const editorView = editor(documentNode);
        insertText(editorView, '* ');

        expect(editorView.state.doc).toEqualDocument(expectedDocumentNode);
      });
    });

    describe.each<[string, string]>([
      ['dash', '-'],
      ['asterisk', '*'],
      ['bullet point', '•'],
    ])(`type "%s "`, (_testName, inputCharacter) => {
      beforeEach(() => {
        editorView = editor(doc(p('{<>}')));
        insertText(editorView, `${inputCharacter} `);
      });

      it('should convert to a bullet list item', () => {
        expect(editorView.state.doc).toEqualDocument(doc(ul(li(p()))));
      });

      it('should create analytics GAS V3 event', () => {
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'inserted',
          actionSubject: 'list',
          eventType: 'track',
          actionSubjectId: 'bulletedList',
          attributes: expect.objectContaining({
            inputMethod: 'autoformatting',
          }),
        });
      });
    });

    it('should be not be possible to convert a code_clock to a list item', () => {
      const editorView = editor(doc(code_block()('{<>}')));
      insertText(editorView, '* ');
      expect(editorView.state.doc).toEqualDocument(doc(code_block()('* ')));
    });
  });

  describe('ordered list rule', () => {
    describe('type "1. "', () => {
      beforeEach(() => {
        editorView = editor(doc(p('{<>}')));

        insertText(editorView, '1. ');
      });

      it('should convert to an ordered list item', () => {
        expect(editorView.state.doc).toEqualDocument(doc(ol(li(p()))));
      });

      it('should create analytics GAS V3 event', () => {
        const expectedPayload = {
          action: 'inserted',
          actionSubject: 'list',
          eventType: 'track',
          actionSubjectId: 'numberedList',
          attributes: expect.objectContaining({
            inputMethod: 'autoformatting',
          }),
        };
        expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
      });

      it('should not convert to a ordered list item after shift+enter', () => {
        const documentNode = doc(p('test', hardBreak(), '{<>}'));
        const expectedDocumentNode = doc(p('test', hardBreak(), '1. '));
        const editorView = editor(documentNode);
        insertText(editorView, '1. ');

        expect(editorView.state.doc).toEqualDocument(expectedDocumentNode);
      });

      it('should not convert to a ordered list item after multiple shift+enter', () => {
        const documentNode = doc(p('test', hardBreak(), hardBreak(), '{<>}'));
        const expectedDocumentNode = doc(
          p('test', hardBreak(), hardBreak(), '1. '),
        );
        const editorView = editor(documentNode);
        insertText(editorView, '1. ');

        expect(editorView.state.doc).toEqualDocument(expectedDocumentNode);
      });
    });

    describe('type "1) "', () => {
      beforeEach(() => {
        editorView = editor(doc(p('{<>}')));

        insertText(editorView, '1) ');
      });

      it('should convert to an ordered list item', () => {
        expect(editorView.state.doc).toEqualDocument(doc(ol(li(p()))));
      });

      it('should create analytics GAS V3 event', () => {
        const expectedPayload = {
          action: 'inserted',
          actionSubject: 'list',
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
        const editorView = editor(doc(p('{<>}')));

        insertText(editorView, '2. ');
        expect(editorView.state.doc).toEqualDocument(doc(p('2. ')));
      });

      it('should not convert "2. " after shift+enter to a ordered list item', () => {
        const editorView = editor(doc(p('test', hardBreak(), '{<>}')));
        insertText(editorView, '2. ');
        expect(editorView.state.doc).toEqualDocument(
          doc(p('test', hardBreak(), '2. ')),
        );
      });

      it('should not convert "2. " after multiple shift+enter to a ordered list item', () => {
        const editorView = editor(
          doc(p('test', hardBreak(), hardBreak(), '{<>}')),
        );
        insertText(editorView, '2. ');
        expect(editorView.state.doc).toEqualDocument(
          doc(p('test', hardBreak(), hardBreak(), '2. ')),
        );
      });

      it('should not convert "2) " to a ordered list item', () => {
        const editorView = editor(doc(p('{<>}')));

        insertText(editorView, '2) ');
        expect(editorView.state.doc).toEqualDocument(doc(p('2) ')));
      });
    });

    it('should not be possible to convert code block to bullet list item', () => {
      const editorView = editor(doc(code_block()('{<>}')));

      insertText(editorView, '1. ');
      expect(editorView.state.doc).toEqualDocument(doc(code_block()('1. ')));
    });
  });
});
