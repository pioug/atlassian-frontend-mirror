import {
  codeBlock as codeBlockAdf,
  decisionItem as decisionItemAdf,
  decisionList as decisionListAdf,
  link as linkAdf,
  panel as panelAdf,
  placeholder as placeholderAdf,
} from '@atlaskit/adf-schema';
import type {
  DocBuilder,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import pastePlugin from '@atlaskit/editor-core/src/plugins/paste';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import undoRedoPlugin from '@atlaskit/editor-core/src/plugins/undo-redo';
import { betterTypeHistoryPlugin } from '@atlaskit/editor-plugin-better-type-history';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { historyPlugin } from '@atlaskit/editor-plugin-history';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
// @ts-ignore
import { __serializeForClipboard } from '@atlaskit/editor-prosemirror/view';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  panel,
  placeholder,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';

const mockNodesPlugin: NextEditorPlugin<'nodesPlugin'> = ({}) => ({
  name: 'nodesPlugin',
  nodes() {
    return [
      { name: 'panel', node: panelAdf(true) },
      { name: 'placeholder', node: placeholderAdf },
      { name: 'decisionItem', node: decisionItemAdf },
      { name: 'decisionList', node: decisionListAdf },
      { name: 'codeBlock', node: codeBlockAdf },
    ];
  },
  marks() {
    return [{ name: 'link', mark: linkAdf }];
  },
});

describe('close history', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(mockNodesPlugin)
        .add(typeAheadPlugin)
        .add(historyPlugin)
        .add(undoRedoPlugin)
        .add(betterTypeHistoryPlugin)
        .add([pastePlugin, {}]),
    });

  describe('paste then undo', () => {
    const case01: [string, DocBuilder, DocBuilder] = [
      'pasting text in an empty paragraph',
      // Scenario
      doc(
        // prettier-ignore
        p('{<}INITIAL{>}'),
        p('{nextPos}'),
      ),
      // Expected Document
      doc(
        // prettier-ignore
        p('INITIAL'),
        p('INITIAL'),
      ),
    ];
    const case02: [string, DocBuilder, DocBuilder] = [
      'pasting text at the end of paragraph',
      // Scenario
      doc(
        // prettier-ignore
        p('{<}INITIAL{>}'),
        p('SOME-TEXT..{nextPos}'),
      ),
      // Expected Document
      doc(
        // prettier-ignore
        p('INITIAL'),
        p('SOME-TEXT..INITIAL'),
      ),
    ];

    const case03: [string, DocBuilder, DocBuilder] = [
      'pasting text in the middle of a paragraph',
      // Scenario
      doc(
        // prettier-ignore
        p('{<}INITIAL{>}'),
        p('SOME-{nextPos}-TEXT'),
      ),
      // Expected Document
      doc(
        // prettier-ignore
        p('INITIAL'),
        p('SOME-INITIAL-TEXT'),
      ),
    ];

    const case04: [string, DocBuilder, DocBuilder] = [
      'copying text from a panel and pasting it in an empty paragraph',
      // Scenario
      // prettier-ignore
      doc(
        panel()(
          p('{<}INITIAL{>}')
        ),
        p('{nextPos}'),
      ),
      // Expected Document
      doc(
        // prettier-ignore
        panel()(
          p('INITIAL')
        ),
        p('INITIAL'),
      ),
    ];

    const case05: [string, DocBuilder, DocBuilder] = [
      'copying an empty panel and pasting it in an empty paragraph',
      // Scenario
      // prettier-ignore
      doc('{<node>}',
        panel()(
          p()
        ),
        p('{nextPos}'),
      ),
      // Expected Document
      doc(
        // prettier-ignore
        panel()(
          p('')
        ),
        panel()(p('')),
      ),
    ];

    const case06: [string, DocBuilder, DocBuilder] = [
      'copying an empty panel and pasting it in a paragraph',
      // Scenario
      // prettier-ignore
      doc('{<node>}',
        panel()(
          p('INITIAL')
        ),
        p('{nextPos}'),
      ),
      // Expected Document
      doc(
        // prettier-ignore
        panel()(
          p('INITIAL')
        ),
        panel()(p('INITIAL')),
      ),
    ];

    const case07: [string, DocBuilder, DocBuilder] = [
      'copying text from a paragraph and pasting it in an placeholder',
      // Scenario
      // prettier-ignore
      doc(
        p('{nextPos}', placeholder({ text: 'Type something' })),
        p('{<}INITIAL{>}')
      ),
      // Expected Document
      doc(
        // prettier-ignore
        p(placeholder({ text: 'Type something' })),
        p('INITIAL'),
      ),
    ];

    describe.each<[string, DocBuilder, DocBuilder]>([
      // prettier-ignore
      case01,
      case02,
      case03,
      case04,
      case05,
      case06,
      case07,
    ])(
      '[case%#] when %s and undo',
      (_scenario, scenarioDocument, expectedDocument) => {
        it('should match the document', () => {
          const {
            editorView,
            refs: { nextPos },
          } = editor(scenarioDocument);

          // copy the selection from the document
          const { dom, text } = __serializeForClipboard(
            editorView,
            editorView.state.selection.content(),
          );

          const $pos = editorView.state.doc.resolve(nextPos);
          editorView.dispatch(
            editorView.state.tr.setSelection(new TextSelection($pos, $pos)),
          );

          dispatchPasteEvent(editorView, { html: dom.innerHTML, plain: text });

          editorView.dispatch(editorView.state.tr.insertText('INSERTED'));

          sendKeyToPm(editorView, 'Mod-z');

          expect(editorView.state.tr).toEqualDocumentAndSelection(
            expectedDocument,
          );
        });
      },
    );
  });
});
