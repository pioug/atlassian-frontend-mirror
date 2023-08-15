import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  code_block,
  doc,
  li,
  ol,
  p,
  ul,
  hardBreak,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import listTypePlugin from '../..';
import deprecatedAnalyticsPlugin from '../../../analytics';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import basePlugins from '../../../base';
import blockType from '../../../block-type';
import codeBlockTypePlugin from '../../../code-block';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import compositionPlugin from '../../../composition';

describe('inputrules', () => {
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  const createEditor = createProsemirrorEditorFactory();

  let editorView: EditorView;
  const editor = (doc: DocBuilder, featureFlags: FeatureFlags = {}) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));

    const fakeEditor = createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, featureFlags])
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add([listTypePlugin, featureFlags])
        .add(basePlugins)
        .add(decorationsPlugin)
        .add(compositionPlugin)
        .add(blockType)
        .add([codeBlockTypePlugin, { appearance: 'full-page' }])
        .add([deprecatedAnalyticsPlugin, { createAnalyticsEvent }]),
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
    describe('with restartNumberedLists not enabled', () => {
      describe('type "1. "', () => {
        beforeEach(() => {
          editorView = editor(doc(p('{<>}')));
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
          editorView = editor(doc(p('{<>}')));
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
    });

    describe('with restartNumberedLists enabled', () => {
      const featureFlags = { restartNumberedLists: true };
      describe('type "1. "', () => {
        beforeEach(() => {
          editorView = editor(doc(p('{<>}')), featureFlags);
          insertText(editorView, '1. ');
        });

        it('should convert to an ordered list item', () => {
          expect(editorView.state.doc).toEqualDocument(
            doc(ol({ order: 1 })(li(p()))),
          );
        });

        it('should create analytics GAS V3 event', () => {
          const expectedPayload = {
            action: 'inserted',
            actionSubject: 'list',
            eventType: 'track',
            actionSubjectId: 'numberedList',
            attributes: expect.objectContaining({
              inputMethod: 'autoformatting',
              listStartNumber: 1,
              joinScenario: 'noJoin',
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
          expect(editorView.state.doc).toEqualDocument(
            doc(ol({ order: 1 })(li(p()))),
          );
        });

        it('should create analytics GAS V3 event', () => {
          const expectedPayload = {
            action: 'inserted',
            actionSubject: 'list',
            eventType: 'track',
            actionSubjectId: 'numberedList',
            attributes: expect.objectContaining({
              inputMethod: 'autoformatting',
              listStartNumber: 1,
              joinScenario: 'noJoin',
            }),
          };
          expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
        });
      });

      describe('for numbers other than 1', () => {
        it('should convert "2. " to a ordered list item', () => {
          const editorView = editor(doc(p('{<>}')), featureFlags);

          insertText(editorView, '2. ');
          expect(editorView.state.doc).toEqualDocument(
            doc(ol({ order: 2 })(li(p()))),
          );
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

        it('should convert "2) " to a ordered list item', () => {
          const editorView = editor(doc(p('{<>}')), featureFlags);

          insertText(editorView, '2) ');
          expect(editorView.state.doc).toEqualDocument(
            doc(ol({ order: 2 })(li(p()))),
          );
        });

        it('should not convert "-2. " to an ordered list item', () => {
          const editorView = editor(doc(p('{<>}')), featureFlags);

          insertText(editorView, '-2. ');
          expect(editorView.state.doc).toEqualDocument(doc(p('-2. ')));
        });

        describe('and when typed above another ordered list', () => {
          it('should convert "6. " to an ordered list item and join it with the list below', () => {
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
          it('should create analytics GAS V3 event', () => {
            const expectedPayload = {
              action: 'inserted',
              actionSubject: 'list',
              eventType: 'track',
              actionSubjectId: 'numberedList',
              attributes: expect.objectContaining({
                inputMethod: 'autoformatting',
                listStartNumber: 6,
                joinScenario: 'joinedToListBelow',
              }),
            };
            expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
          });
        });
        describe('and when typed below another ordered list', () => {
          it('should convert "6. " to an ordered list item and join it with the list above', () => {
            const editorView = editor(
              doc(
                ol({ order: 4 })(li(p('One')), li(p('Two')), li(p('Three'))),
                p('{<>}'),
              ),
              featureFlags,
            );
            insertText(editorView, '9. ');
            expect(editorView.state.doc).toEqualDocument(
              doc(
                ol({ order: 4 })(
                  li(p('One')),
                  li(p('Two')),
                  li(p('Three')),
                  li(p('')),
                ),
              ),
            );
          });
          it('should create analytics GAS V3 event', () => {
            const expectedPayload = {
              action: 'inserted',
              actionSubject: 'list',
              eventType: 'track',
              actionSubjectId: 'numberedList',
              attributes: expect.objectContaining({
                inputMethod: 'autoformatting',
                listStartNumber: 9,
                joinScenario: 'joinedToListAbove',
              }),
            };
            expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
          });
        });
      });
    });
  });

  it('should not be possible to convert code block to bullet list item', () => {
    const editorView = editor(doc(code_block()('{<>}')));
    insertText(editorView, '1. ');
    expect(editorView.state.doc).toEqualDocument(doc(code_block()('1. ')));
  });
});
