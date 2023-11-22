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
import undoRedoPlugin from '@atlaskit/editor-core/src/plugins/undo-redo';
import { betterTypeHistoryPlugin } from '@atlaskit/editor-plugin-better-type-history';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import createPMPlugin from '@atlaskit/editor-plugin-better-type-history/src/pm-plugins/main';
import { historyPlugin } from '@atlaskit/editor-plugin-history';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
// @ts-ignore
import { __serializeForClipboard } from '@atlaskit/editor-prosemirror/view';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  code_block,
  decisionItem,
  decisionList,
  doc,
  p,
  panel,
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
        .add(betterTypeHistoryPlugin),
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
});
