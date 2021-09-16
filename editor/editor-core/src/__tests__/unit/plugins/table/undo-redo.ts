import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  tr,
  th,
  DocBuilder,
  thEmpty,
  td,
  tdCursor,
  tdEmpty,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { EditorView } from 'prosemirror-view';
import {
  TablePluginState,
  PluginConfig,
} from '../../../../plugins/table/types';
import { pluginKey as tablePluginKey } from '../../../../plugins/table/pm-plugins/plugin-factory';
import { redo, undo } from 'prosemirror-history';
import { insertColumn } from '../../../../plugins/table/commands';
import { deleteColumns } from '../../../../plugins/table/transforms';
import { colsToRect } from '../../../../plugins/table/utils/table';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';

const TABLE_LOCAL_ID = 'test-table-local-id';

// HELPERS
const INSERT_COLUMN = (editorView: EditorView) =>
  insertColumn(1)(editorView.state, editorView.dispatch, editorView);
const DELETE_COLUMN = (editorView: EditorView) => {
  const { state, dispatch } = editorView;
  dispatch(deleteColumns(colsToRect([0], 1))(state.tr));
};
const SHORTCUT_ADD_COLUMN_BEFORE = (editorView: EditorView) =>
  sendKeyToPm(editorView, 'Ctrl-Alt-ArrowLeft');
const SHORTCUT_ADD_COLUMN_AFTER = (editorView: EditorView) =>
  sendKeyToPm(editorView, 'Ctrl-Alt-ArrowRight');

describe('undo/redo with tables', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  const editor = (doc: DocBuilder) => {
    const tableOptions = {
      advanced: true,
      allowColumnSorting: true,
    } as PluginConfig;
    return createEditor({
      doc,
      editorProps: {
        allowTables: tableOptions,
      },
      pluginKey: tablePluginKey,
    });
  };
  type TestCase = [
    string,
    {
      before: DocBuilder;
      after: DocBuilder;
      action: Function;
    },
  ];

  const case01: TestCase = [
    'when table has colwidth attribute and new col has been inserted',
    {
      before: doc(
        table({
          localId: TABLE_LOCAL_ID,
        })(tr(th({ colwidth: [285] })(p('')), th({ colwidth: [1310] })(p('')))),
      ),
      after: doc(
        table({
          localId: TABLE_LOCAL_ID,
        })(
          tr(
            th({ colwidth: [69] })(p('')),
            th({ colwidth: [140] })(p('')),
            th({ colwidth: [471] })(p('')),
          ),
        ),
      ),
      action: INSERT_COLUMN,
    },
  ];

  const case02: TestCase = [
    'when table has colwidth attribute and deleting a col',
    {
      before: doc(
        table({
          localId: TABLE_LOCAL_ID,
        })(tr(th({ colwidth: [285] })(p('')), th({ colwidth: [1310] })(p('')))),
      ),

      after: doc(
        table({
          localId: TABLE_LOCAL_ID,
        })(tr(th({ colwidth: [1310] })(p('')))),
      ),
      action: DELETE_COLUMN,
    },
  ];

  const case03: TestCase = [
    'when table has no colwidth attribute and new col is inserted',
    {
      before: doc(
        table({
          localId: TABLE_LOCAL_ID,
        })(tr(thEmpty, thEmpty)),
      ),
      after: doc(
        table({
          localId: TABLE_LOCAL_ID,
        })(tr(thEmpty, thEmpty, thEmpty)),
      ),
      action: INSERT_COLUMN,
    },
  ];

  const case04: TestCase = [
    'when table has no colwidth attribute and col is deleted',
    {
      before: doc(
        table({
          localId: TABLE_LOCAL_ID,
        })(tr(thEmpty, thEmpty)),
      ),
      after: doc(
        table({
          localId: TABLE_LOCAL_ID,
        })(tr(thEmpty)),
      ),
      action: DELETE_COLUMN,
    },
  ];

  const case05: TestCase = [
    'when table has colwidth attribute and col is inserted after selection via shortcuts',
    {
      before: doc(
        table({
          localId: TABLE_LOCAL_ID,
        })(
          tr(
            td({ colwidth: [194] })(p('{<>}')),
            td({ colwidth: [564] })(p('')),
          ),
        ),
      ),
      after: doc(
        table({
          localId: TABLE_LOCAL_ID,
        })(
          tr(
            td({ colwidth: [129] })(p('')),
            td({ colwidth: [140] })(p('')),
            td({ colwidth: [411] })(p('')),
          ),
        ),
      ),
      action: SHORTCUT_ADD_COLUMN_AFTER,
    },
  ];

  const case06: TestCase = [
    'when table has colwidth attribute and col is inserted before selection via shortcuts',
    {
      before: doc(
        table({
          localId: TABLE_LOCAL_ID,
        })(
          tr(
            td({ colwidth: [194] })(p('{<>}')),
            td({ colwidth: [564] })(p('')),
          ),
        ),
      ),
      after: doc(
        table({
          localId: TABLE_LOCAL_ID,
        })(
          tr(
            td({ colwidth: [140] })(p('')),
            td({ colwidth: [129] })(p('')),
            td({ colwidth: [411] })(p('')),
          ),
        ),
      ),
      action: SHORTCUT_ADD_COLUMN_BEFORE,
    },
  ];

  const case07: TestCase = [
    'when table has no colwidth attribute and col is inserted before selection via shortcuts',
    {
      before: doc(
        table({
          localId: TABLE_LOCAL_ID,
        })(tr(tdCursor, tdEmpty)),
      ),
      after: doc(
        table({
          localId: TABLE_LOCAL_ID,
        })(tr(tdEmpty, tdEmpty, tdEmpty)),
      ),
      action: SHORTCUT_ADD_COLUMN_BEFORE,
    },
  ];

  const case08: TestCase = [
    'when table has no colwidth attribute and col is inserted after selection via shortcuts',
    {
      before: doc(
        table({
          localId: TABLE_LOCAL_ID,
        })(tr(tdCursor, tdEmpty)),
      ),
      after: doc(
        table({
          localId: TABLE_LOCAL_ID,
        })(tr(tdEmpty, tdEmpty, tdEmpty)),
      ),
      action: SHORTCUT_ADD_COLUMN_BEFORE,
    },
  ];

  describe.each<TestCase>([
    case01,
    case02,
    case03,
    case04,
    case05,
    case06,
    case07,
    case08,
  ])('[case%#] %s', (_description, testCase) => {
    it('should be able to undo/redo', () => {
      const { editorView } = editor(testCase.before);
      testCase.action(editorView);
      expect(editorView.state.doc).toEqualDocument(testCase.after);
      undo(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(testCase.before);
      redo(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(testCase.after);
    });
  });
});
