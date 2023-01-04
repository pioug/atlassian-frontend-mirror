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
import { FeatureFlags } from '@atlaskit/editor-common/types';
import featureFlagsContextPlugin from '../../../feature-flags-context';

describe('inputrules', () => {
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  const createEditor = createProsemirrorEditorFactory();

  let editorView: EditorView;
  const editor = (doc: DocBuilder, featureFlags?: FeatureFlags) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));

    const fakeEditor = createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(listTypePlugin)
        .add(basePlugins)
        .add(blockType)
        .add([codeBlockTypePlugin, { appearance: 'full-page' }])
        .add([analyticsPlugin, { createAnalyticsEvent }]),
      featureFlags,
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

    it('should be not be possible to convert a code_block to a list item', () => {
      const editorView = editor(doc(code_block()('{<>}')));
      insertText(editorView, '* ');
      expect(editorView.state.doc).toEqualDocument(doc(code_block()('* ')));
    });
  });

  describe('ordered list rule', () => {
    describe('when restartNumberedLists (custom start numbers for ordered lists) is not enabled', () => {
      const featureFlags = { restartNumberedLists: false };

      describe('type "1. "', () => {
        beforeEach(() => {
          editorView = editor(doc(p('{<>}')), featureFlags);

          insertText(editorView, '1. ');
        });

        it('should convert to an ordered list item', () => {
          expect(editorView.state.doc).toEqualDocument(doc(ol()(li(p()))));
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
          const editorView = editor(documentNode, featureFlags);
          insertText(editorView, '1. ');

          expect(editorView.state.doc).toEqualDocument(expectedDocumentNode);
        });

        it('should not convert to a ordered list item after multiple shift+enter', () => {
          const documentNode = doc(p('test', hardBreak(), hardBreak(), '{<>}'));
          const expectedDocumentNode = doc(
            p('test', hardBreak(), hardBreak(), '1. '),
          );
          const editorView = editor(documentNode, featureFlags);
          insertText(editorView, '1. ');

          expect(editorView.state.doc).toEqualDocument(expectedDocumentNode);
        });
      });

      describe('type "1) "', () => {
        beforeEach(() => {
          editorView = editor(doc(p('{<>}')), featureFlags);

          insertText(editorView, '1) ');
        });

        it('should convert to an ordered list item', () => {
          expect(editorView.state.doc).toEqualDocument(doc(ol()(li(p()))));
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
          const editorView = editor(doc(p('{<>}')), featureFlags);

          insertText(editorView, '2. ');
          expect(editorView.state.doc).toEqualDocument(doc(p('2. ')));
        });

        it('should not convert "2. " after shift+enter to a ordered list item', () => {
          const editorView = editor(
            doc(p('test', hardBreak(), '{<>}')),
            featureFlags,
          );
          insertText(editorView, '2. ');
          expect(editorView.state.doc).toEqualDocument(
            doc(p('test', hardBreak(), '2. ')),
          );
        });

        it('should not convert "2. " after multiple shift+enter to a ordered list item', () => {
          const editorView = editor(
            doc(p('test', hardBreak(), hardBreak(), '{<>}')),
            featureFlags,
          );
          insertText(editorView, '2. ');
          expect(editorView.state.doc).toEqualDocument(
            doc(p('test', hardBreak(), hardBreak(), '2. ')),
          );
        });

        it('should not convert "2) " to a ordered list item', () => {
          const editorView = editor(doc(p('{<>}')), featureFlags);

          insertText(editorView, '2) ');
          expect(editorView.state.doc).toEqualDocument(doc(p('2) ')));
        });
      });
    });

    it('should not be possible to convert code block to bullet list item', () => {
      const editorView = editor(doc(code_block()('{<>}')));

      insertText(editorView, '1. ');
      expect(editorView.state.doc).toEqualDocument(doc(code_block()('1. ')));
    });
  });
});

describe('inputrules when restartNumberedLists (custom start numbers for ordered lists) is enabled', () => {
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  const createEditor = createProsemirrorEditorFactory();
  let editorView: EditorView;
  const editor = (doc: DocBuilder, featureFlags?: FeatureFlags) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));

    const fakeEditor = createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([listTypePlugin, { restartNumberedLists: true }])
        .add(basePlugins)
        .add(blockType)
        .add([codeBlockTypePlugin, { appearance: 'full-page' }])
        .add([featureFlagsContextPlugin, { restartNumberedLists: true }])
        .add([analyticsPlugin, { createAnalyticsEvent }]),
      featureFlags,
    });

    return fakeEditor.editorView;
  };

  const featureFlags = { restartNumberedLists: true };

  describe('type "1. "', () => {
    beforeEach(() => {
      editorView = editor(doc(p('{<>}')), featureFlags);

      insertText(editorView, '1. ');
    });

    it('should convert to an ordered list item', () => {
      expect(editorView.state.doc).toEqualDocument(doc(ol()(li(p()))));
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
      editorView = editor(doc(p('{<>}')), featureFlags);

      insertText(editorView, '1) ');
    });

    it('should convert to an ordered list item', () => {
      expect(editorView.state.doc).toEqualDocument(doc(ol()(li(p()))));
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
    it('should convert "99. " to an ordered list item', () => {
      const editorView = editor(doc(p('{<>}')), featureFlags);

      insertText(editorView, '99. ');
      expect(editorView.state.doc).toEqualDocument(
        doc(ol({ order: 99 })(li(p()))),
      );
    });

    it('should not convert "99. " after shift+enter to an ordered list item', () => {
      const editorView = editor(
        doc(p('test', hardBreak(), '{<>}')),
        featureFlags,
      );
      insertText(editorView, '99. ');
      expect(editorView.state.doc).toEqualDocument(
        doc(p('test', hardBreak(), '99. ')),
      );
    });

    it('should not convert "99. " after multiple shift+enter to an ordered list item', () => {
      const editorView = editor(
        doc(p('test', hardBreak(), hardBreak(), '{<>}')),
        featureFlags,
      );
      insertText(editorView, '99. ');
      expect(editorView.state.doc).toEqualDocument(
        doc(p('test', hardBreak(), hardBreak(), '99. ')),
      );
    });

    it('should convert "99) " to an ordered list item', () => {
      const editorView = editor(doc(p('{<>}')), featureFlags);

      insertText(editorView, '99) ');
      expect(editorView.state.doc).toEqualDocument(
        doc(ol({ order: 99 })(li(p()))),
      );
    });

    it('should NOT convert "-99. " to an ordered list item', () => {
      const editorView = editor(doc(p('{<>}')), featureFlags);

      insertText(editorView, '-99. ');
      expect(editorView.state.doc).toEqualDocument(doc(p('-99. ')));
    });
  });

  describe('for numbers other than 1 before an existing list', () => {
    it('should convert "6. " to an ordered list item and join it with the following list', () => {
      const editorView = editor(
        doc(p('{<>}'), ol()(li(p('One')), li(p('Two')), li(p('Three')))),
        featureFlags,
      );

      insertText(editorView, '6. ');
      expect(editorView.state.doc).toEqualDocument(
        doc(
          ol({ order: 6 })(
            li(p('')),
            li(p('One')),
            li(p('Two')),
            li(p('Three')),
          ),
        ),
      );
    });
  });
});
