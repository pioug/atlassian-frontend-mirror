import { Transaction, TextSelection } from 'prosemirror-state';
// @ts-ignore
import { __serializeForClipboard } from 'prosemirror-view';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import {
  p,
  doc,
  code_block,
  panel,
  decisionList,
  decisionItem,
  placeholder,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import betterTypeHistoryPlugin from '../../';
import blockTypePlugin from '../../../block-type';
import panelPlugin from '../../../panel';
import hyperlinkPlugin from '../../../hyperlink';
import pastePlugin from '../../../paste';
import codeBlockPlugin from '../../../code-block';
import tasksAndDecisionsPlugin from '../../../tasks-and-decisions';
import placeholderTextPlugin from '../../../placeholder-text';
import {
  pluginKey as undoRedoPluginKey,
  default as createPMPlugin,
} from '../../pm-plugins/better-type-history';

describe('close history', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(blockTypePlugin)
        .add([pastePlugin, {}])
        .add(hyperlinkPlugin)
        .add(betterTypeHistoryPlugin)
        .add(panelPlugin)
        .add(codeBlockPlugin)
        .add([placeholderTextPlugin, { allowInserting: true }])
        .add(tasksAndDecisionsPlugin),
      pluginKey: undoRedoPluginKey,
    });

  const case0: [string, DocBuilder, DocBuilder] = [
    'user press enter twice after type at the end of paragraph',
    // Scenario
    // prettier-ignore
    doc(
      p('LOL {<>}'),
      p('---'),
    ),
    // Expected Result
    // prettier-ignore
    doc(
      p('LOL INSERTED'),
      p('{<>}'),
      p('---'),
    ),
  ];

  const case1: [string, DocBuilder, DocBuilder] = [
    'user press enter twice inside of code block',
    // Scenario
    // prettier-ignore
    doc(
      code_block()('text {<>}'),
      p('---'),
    ),
    // Expected Result
    // prettier-ignore
    doc(
      code_block()('text INSERTED\n{<>}'),
      p('---'),
    ),
  ];

  const case2: [string, DocBuilder, DocBuilder] = [
    'user press enter twice inside of paragragh',
    // Scenario
    // prettier-ignore
    doc(
      p('Choc {<>} Choc'),
      p('---'),
    ),
    // Expected Result
    // prettier-ignore
    doc(
      p('Choc INSERTED'),
      p('{<>} Choc'),
      p('---'),
    ),
  ];

  describe.each<[string, DocBuilder, DocBuilder]>([
    // prettier-ignore
    case0,
    case1,
    case2,
  ])(
    '[case%#] when %s and undo',
    (_scenario, previousDocument, expectedDocument) => {
      it('should match the document', () => {
        const { editorView } = editor(previousDocument);

        const {
          state: { tr },
        } = editorView;

        tr.insertText('INSERTED');
        editorView.dispatch(tr);

        sendKeyToPm(editorView, 'Enter');
        sendKeyToPm(editorView, 'Enter');
        sendKeyToPm(editorView, 'Mod-z');

        expect(editorView.state.tr).toEqualDocumentAndSelection(
          expectedDocument,
        );
      });
    },
  );

  describe('when the cursor is inside of decision list', () => {
    it('should undone list item by list item', () => {
      const previousDocument = doc(
        // prettier-ignore
        decisionList()(
          decisionItem()('Hey yo{<>}'),
        ),
      );
      const { editorView } = editor(previousDocument);
      let decisionListNode = editorView.state.doc.nodeAt(0)!;
      expect(decisionListNode.childCount).toEqual(1);

      sendKeyToPm(editorView, 'Enter');

      editorView.dispatch(editorView.state.tr.insertText('INSERTED 1'));
      sendKeyToPm(editorView, 'Enter');

      editorView.dispatch(editorView.state.tr.insertText('INSERTED 2'));
      sendKeyToPm(editorView, 'Enter');

      editorView.dispatch(editorView.state.tr.insertText('INSERTED 3'));
      sendKeyToPm(editorView, 'Enter');

      decisionListNode = editorView.state.doc.nodeAt(0)!;
      expect(decisionListNode.childCount).toEqual(5);
      sendKeyToPm(editorView, 'Mod-z');

      decisionListNode = editorView.state.doc.nodeAt(0)!;
      expect(decisionListNode.childCount).toEqual(4);
      sendKeyToPm(editorView, 'Mod-z');

      decisionListNode = editorView.state.doc.nodeAt(0)!;
      expect(decisionListNode.childCount).toEqual(3);
      sendKeyToPm(editorView, 'Mod-z');

      decisionListNode = editorView.state.doc.nodeAt(0)!;
      expect(decisionListNode.childCount).toEqual(2);
      sendKeyToPm(editorView, 'Mod-z');

      decisionListNode = editorView.state.doc.nodeAt(0)!;
      expect(decisionListNode.childCount).toEqual(1);
    });
  });

  describe('when selection is not a cursor', () => {
    it('should not add apply new transaction', () => {
      const plugin = createPMPlugin();

      const previousDocument = doc(
        // prettier-ignore
        '{<node>}',
        panel()(p('LOL')),
        p('---'),
      );
      const { editorView } = editor(previousDocument);
      const { state: fakeState } = editorView;

      const { tr } = fakeState;

      const fakeTrs: Transaction[] = [tr];
      const result = plugin.spec.appendTransaction!(
        fakeTrs,
        fakeState,
        fakeState,
      );

      expect(result).toBeUndefined();
    });
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
