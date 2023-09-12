import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  Preset,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { toggleMark } from '@atlaskit/editor-common/mark';
import pastePlugin from '../../index';
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import betterTypeHistoryPlugin from '../../../better-type-history';
import { textFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  doc,
  p,
  panel,
  taskList,
  taskItem,
  decisionList,
  decisionItem,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { ExtractPublicEditorAPI } from '@atlaskit/editor-common/types';

describe('Paste plugin', () => {
  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>()
    .add([featureFlagsPlugin, {}])
    .add([analyticsPlugin, {}])
    .add(betterTypeHistoryPlugin)
    .add([pastePlugin, {}])
    .add(blockTypePlugin)
    .add(hyperlinkPlugin)
    .add(textFormattingPlugin);

  let editorView: EditorView;
  let editorAPI: ExtractPublicEditorAPI<typeof preset>;

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset,
    });

  describe('With plain text link pasting', () => {
    beforeEach(() => {
      ({ editorView, editorAPI } = editor(doc(p('{<>}'))));
    });

    describe('cmd+shift+v', () => {
      describe('content without any links', () => {
        const paste = () => {
          dispatchPasteEvent(
            editorView,
            {
              html: `<meta charset='utf-8'><div style="color: #333333;background-color: #f5f5f5;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #4b69c6;">export</span><span style="color: #333333;"> </span><span style="color: #7a3e9d;">interface</span><span style="color: #333333;"> </span><span style="color: #7a3e9d;font-weight: bold;">PasteContent</span></div></div>`,
              plain: 'export interface PasteContent',
            },
            { shift: true },
          );
        };

        it('pastes plain text (ie. removes formatting from pasted content)', () => {
          paste();
          expect(editorView.state.doc).toMatchSnapshot();
        });

        it('preserves current formatting when pasting (ie. removes formatting, applies active formatting)', () => {
          const { strong } = editorView.state.schema.marks;

          editorAPI.core?.actions?.execute(toggleMark(strong));

          paste();
          expect(editorView.state.doc).toMatchSnapshot();
        });
      });

      describe('content with link', () => {
        const paste = () => {
          dispatchPasteEvent(
            editorView,
            {
              html: `<meta charset='utf-8'><div style="color: #333333;background-color: #f5f5f5;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #4b69c6;">export</span><span style="color: #333333;"> </span><span style="color: #7a3e9d;">interface</span><span style="color: #333333;"> </span><span style="color: #7a3e9d;font-weight: bold;">PasteContent</span> <a href="https://www.google.com">https://www.google.com</a> <span>some more content</span></div></div>`,
              plain:
                'export interface PasteContent https://www.google.com some more content',
            },
            { shift: true },
          );
        };

        it('pastes plain text but creates hyperlink (ie. removes formatting from pasted content)', () => {
          // This does not test that it doesn't create a *smart* link.
          paste();
          expect(editorView.state.doc).toMatchSnapshot();
        });

        it('preserves current formatting when pasting, creates hyperlink (ie. removes formatting, applies active formatting)', () => {
          // This does not test that it doesn't create a *smart* link.
          const { strong } = editorView.state.schema.marks;
          editorAPI.core?.actions?.execute(toggleMark(strong));
          paste();
          expect(editorView.state.doc).toMatchSnapshot();
        });
      });
    });
  });

  describe('when pasting content copied from the top level of the document (openStart is 0)', () => {
    describe('into a panel', () => {
      beforeEach(() => {
        const createEditor = createEditorFactory();
        const editor = (doc: DocBuilder) =>
          createEditor({
            doc,
            editorProps: {
              allowPanel: {
                allowCustomPanel: true,
                allowCustomPanelEdit: true,
              },
              allowTasksAndDecisions: true,
            },
          });

        ({ editorView } = editor(doc(panel()(p('{<>}')))));
      });

      it('the panel should not disappear when pasting one paragraph', () => {
        dispatchPasteEvent(editorView, {
          html: `<meta charset='utf-8'><p data-pm-slice="0 0 []">abc</p>`,
          plain: 'export interface PasteContent',
        });
        expect(editorView.state.doc).toEqualDocument(doc(panel({})(p('abc'))));
      });
      it('the panel should not disappear when pasting multiple paragraphs', () => {
        dispatchPasteEvent(editorView, {
          html: `<meta charset='utf-8'><p data-pm-slice="0 0 []">abc</p><p>123</p>`,
          plain: 'export interface PasteContent',
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(panel({})(p('abc'), p('123'))),
        );
      });
    });
    describe('into an actions list', () => {
      beforeEach(() => {
        const createEditor = createEditorFactory();
        const editor = (doc: DocBuilder) =>
          createEditor({
            doc,
            editorProps: {
              allowPanel: {
                allowCustomPanel: true,
                allowCustomPanelEdit: true,
              },
              allowTasksAndDecisions: true,
            },
          });

        ({ editorView } = editor(
          doc(
            taskList({ localId: 'test-id' })(
              taskItem({ localId: 'test-id' })('{<>}'),
            ),
          ),
        ));
      });

      it('the first action item should not disappear when pasting one paragraph', () => {
        dispatchPasteEvent(editorView, {
          html: `<meta charset='utf-8'><p data-pm-slice="0 0 []">abc</p>`,
          plain: 'export interface PasteContent',
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            taskList({ localId: 'test-id' })(
              taskItem({ localId: 'test-id' })('abc'),
            ),
          ),
        );
      });
      it('the first action item should not disappear when pasting multiple paragraphs', () => {
        dispatchPasteEvent(editorView, {
          html: `<meta charset='utf-8'><p data-pm-slice="0 0 []">abc</p><p>123</p>`,
          plain: 'export interface PasteContent',
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            taskList({ localId: 'test-id' })(
              taskItem({ localId: 'test-id' })('abc'),
            ),
            p('123'),
          ),
        );
      });
    });
    describe('into a decision list', () => {
      beforeEach(() => {
        const createEditor = createEditorFactory();
        const editor = (doc: DocBuilder) =>
          createEditor({
            doc,
            editorProps: {
              allowPanel: {
                allowCustomPanel: true,
                allowCustomPanelEdit: true,
              },
              allowTasksAndDecisions: true,
            },
          });

        ({ editorView } = editor(
          doc(
            decisionList({ localId: 'test-id' })(
              decisionItem({ localId: 'test-id' })('{<>}'),
            ),
          ),
        ));
      });

      it('the first decision item should not disappear when pasting one paragraph', () => {
        dispatchPasteEvent(editorView, {
          html: `<meta charset='utf-8'><p data-pm-slice="0 0 []">abc</p>`,
          plain: 'export interface PasteContent',
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            decisionList({ localId: 'test-id' })(
              decisionItem({ localId: 'test-id' })('abc'),
            ),
          ),
        );
      });
      it('the first decision item should not disappear when pasting multiple paragraphs', () => {
        dispatchPasteEvent(editorView, {
          html: `<meta charset='utf-8'><p data-pm-slice="0 0 []">abc</p><p>123</p>`,
          plain: 'export interface PasteContent',
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            decisionList({ localId: 'test-id' })(
              decisionItem({ localId: 'test-id' })('abc'),
            ),
            p('123'),
          ),
        );
      });
    });
  });
});
