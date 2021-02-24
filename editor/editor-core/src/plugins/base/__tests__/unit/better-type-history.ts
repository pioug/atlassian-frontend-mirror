import { Transaction } from 'prosemirror-state';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import {
  p,
  doc,
  code_block,
  panel,
  decisionList,
  decisionItem,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { DocumentType } from '@atlaskit/editor-test-helpers/create-editor-state';
import betterTypeHistoryPlugin from '../../';
import blockTypePlugin from '../../../block-type';
import panelPlugin from '../../../panel';
import codeBlockPlugin from '../../../code-block';
import tasksAndDecisionsPlugin from '../../../tasks-and-decisions';
import {
  pluginKey as undoRedoPluginKey,
  default as createPMPlugin,
} from '../../pm-plugins/better-type-history';

describe('close history', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocumentType) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(blockTypePlugin)
        .add(betterTypeHistoryPlugin)
        .add(panelPlugin)
        .add(codeBlockPlugin)
        .add(tasksAndDecisionsPlugin),
      pluginKey: undoRedoPluginKey,
    });

  const case0: [string, DocumentType, DocumentType] = [
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

  const case1: [string, DocumentType, DocumentType] = [
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

  const case2: [string, DocumentType, DocumentType] = [
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

  describe.each<[string, DocumentType, DocumentType]>([
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
});
