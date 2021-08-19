import {
  Preset,
  LightEditorPlugin,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import {
  doc,
  status,
  taskList,
  taskItem,
  expand,
  tdEmpty,
  tr,
  thEmpty,
  table,
  td,
  nestedExpand,
  p,
  date,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { uuid } from '@atlaskit/adf-schema';
import { EditorView } from 'prosemirror-view';
import pastePlugin from '../../index';
import tasksAndDecisionsPlugin from '../../../tasks-and-decisions';
import statusPlugin from '../../../status';
import blockTypePlugin from '../../../block-type';
import hyperlinkPlugin from '../../../hyperlink';
import tablesPlugin from '../../../table';
import expandPlugin from '../../../expand';
import datePlugin from '../../../date';

const pasteAndCompare = (
  { editorView }: { editorView: EditorView },
  clipboard: string,
  expected: any,
) => {
  dispatchPasteEvent(editorView, {
    html: clipboard,
  });

  expect(editorView.state.doc).toEqualDocument(expected);
};

describe('action paste handler', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([pastePlugin, {}])
        .add([tasksAndDecisionsPlugin])
        .add(blockTypePlugin)
        .add(hyperlinkPlugin)
        .add([statusPlugin, { menuDisabled: false }])
        .add(tablesPlugin)
        .add(expandPlugin)
        .add(datePlugin),
    });

  const listProps = { localId: 'local-uuid' };
  const itemProps = { localId: 'local-uuid', state: 'TODO' };

  const emptyActionDoc = doc(taskList(listProps)(taskItem(itemProps)('{<>}')));

  const createNestedExpandDoc = (nodes: Array<any>) => {
    return doc(
      expand({ title: 'expand' })(
        table({ localId: 'local-uuid' })(
          tr(thEmpty, thEmpty, thEmpty),
          tr(
            td()(nestedExpand({ title: 'nestedExpand' })(...nodes)),
            tdEmpty,
            tdEmpty,
          ),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );
  };

  const actionDocMidSelection = doc(
    taskList(listProps)(taskItem(itemProps)('ZZZ{<>}ZZ')),
  );
  const actionDocEndSelection = doc(
    taskList(listProps)(taskItem(itemProps)('ZZZZZ{<>}')),
  );

  beforeEach(() => {
    uuid.setStatic('local-uuid');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  it('status into empty action', () => {
    /** CLIPBOARD
     * [STATUS]
     */
    const clipboard = `<meta charset='utf-8'><span data-node-type="status" data-color="blue" data-local-id="local-uuid" data-style="" contenteditable="false" data-pm-slice="0 0 []">STATUS</span>`;
    const expected = doc(
      taskList(listProps)(
        taskItem(itemProps)(
          status({ localId: 'local-uuid', text: 'STATUS', color: 'blue' }),
        ),
      ),
    );
    pasteAndCompare(editor(emptyActionDoc), clipboard, expected);
  });

  describe('pasting single action into', () => {
    /** CLIPBOARD
     * [] AAAAA
     */
    const clipboard = `<meta charset='utf-8'><div data-task-local-id="145" data-task-state="TODO" data-pm-slice="1 1 [&quot;table&quot;,null,&quot;tableRow&quot;,null,&quot;tableCell&quot;,null,&quot;taskList&quot;,null]">AAAAA</div>`;

    it('empty action', () => {
      const expected = doc(taskList(listProps)(taskItem(itemProps)('AAAAA')));
      pasteAndCompare(editor(emptyActionDoc), clipboard, expected);
    });

    it('middle of action', () => {
      const expected = doc(
        taskList(listProps)(taskItem(itemProps)('ZZZAAAAAZZ')),
      );
      pasteAndCompare(editor(actionDocMidSelection), clipboard, expected);
    });

    it('end of action', () => {
      const expected = doc(
        taskList(listProps)(taskItem(itemProps)('ZZZZZAAAAA')),
      );
      pasteAndCompare(editor(actionDocEndSelection), clipboard, expected);
    });
  });

  describe('pasting to table', () => {
    it('should paste multiple nodes including date from an expand correctly', () => {
      const clipboard = `<meta charset='utf-8'><p data-pm-slice="1 1 [&quot;expand&quot;,null,&quot;table&quot;,null,&quot;tableRow&quot;,null,&quot;tableCell&quot;,null]"><span data-node-type="date" data-timestamp="1586822400000"></span> some text</p>`;
      const expected = createNestedExpandDoc([
        p(date({ timestamp: '1586822400000' }), ' some text'),
      ]);

      pasteAndCompare(
        editor(createNestedExpandDoc([p('{<>}')])),
        clipboard,
        expected,
      );
    });

    it('should paste multiple nodes copied from a table cell correctly', () => {
      const clipboard = `<meta charset='utf-8'><table data-pm-slice="2 2 [&quot;expand&quot;,null,&quot;table&quot;,null,&quot;tableRow&quot;,null]"><tbody><tr><td class="pm-table-cell-content-wrap"><p>first line</p><p><span data-node-type="date" data-timestamp="1586822400000"></span> some text</p><p>last line</p></td></tr></tbody></table>`;
      const expected = createNestedExpandDoc([
        p('first line'),
        p(date({ timestamp: '1586822400000' }), ' some text'),
        p('last line'),
      ]);

      pasteAndCompare(
        editor(createNestedExpandDoc([p('{<>}')])),
        clipboard,
        expected,
      );
    });

    it('should paste multiple nodes copied from a table inside an expand inside a layout', () => {
      const clipboard = `<meta charset='utf-8'><p data-pm-slice="1 1 [&quot;layoutSection&quot;,null,&quot;layoutColumn&quot;,null,&quot;expand&quot;,null,&quot;table&quot;,null,&quot;tableRow&quot;,null,&quot;tableCell&quot;,null]"><span data-node-type="date" data-timestamp="1586822400000"></span> some text</p>`;
      const expected = createNestedExpandDoc([
        p(date({ timestamp: '1586822400000' }), ' some text'),
      ]);

      pasteAndCompare(
        editor(createNestedExpandDoc([p('{<>}')])),
        clipboard,
        expected,
      );
    });
  });

  describe('pasting nested actions into', () => {
    /** CLIPBOARD
     * [] AAAAA
     *    [] BBBBB
     */
    const clipboard = `<meta charset='utf-8'><div data-node-type="actionList" data-task-list-local-id="06ffbd76-3e14-464a-8038-21105f5ef6c2" style="list-style: none; padding-left: 0" data-pm-slice="2 3 [&quot;table&quot;,null,&quot;tableRow&quot;,null,&quot;tableCell&quot;,null]"><div data-task-local-id="15e9df57-52f8-4476-90e8-ec470abb4ba6" data-task-state="TODO">AAAAA</div><div data-node-type="actionList" data-task-list-local-id="6716ed13-16c9-4c1f-bb3d-a601e09e8288" style="list-style: none; padding-left: 0"><div data-task-local-id="91236d3f-0a28-43fc-ae32-bfda4350d2e9" data-task-state="TODO">BBBBB</div></div></div>`;

    it('empty action', () => {
      const expected = doc(
        taskList(listProps)(
          taskItem(itemProps)('AAAAA'),
          taskList(listProps)(taskItem(itemProps)('BBBBB')),
        ),
      );
      pasteAndCompare(editor(emptyActionDoc), clipboard, expected);
    });

    it('middle of action', () => {
      const expected = doc(
        taskList(listProps)(
          taskItem(itemProps)('ZZZAAAAA'),
          taskList(listProps)(taskItem(itemProps)('BBBBBZZ')),
        ),
      );
      pasteAndCompare(editor(actionDocMidSelection), clipboard, expected);
    });

    it('end of action', () => {
      const expected = doc(
        taskList(listProps)(
          taskItem(itemProps)('ZZZZZAAAAA'),
          taskList(listProps)(taskItem(itemProps)('BBBBB')),
        ),
      );
      pasteAndCompare(editor(actionDocEndSelection), clipboard, expected);
    });
  });

  describe('pasting nested action with empty parent into', () => {
    /** CLIPBOARD
     * []
     *    [] BBBBB
     */
    const clipboard = `<meta charset='utf-8'><div data-node-type="actionList" data-task-list-local-id="84bae53d-b8b8-4631-a66d-36f4b38d7e71" style="list-style: none; padding-left: 0" data-pm-slice="2 3 []"><div data-task-local-id="4763b554-d573-4031-a204-c733cec080fe" data-task-state="TODO"></div><div data-node-type="actionList" data-task-list-local-id="ac5c5ad3-86ec-4f47-8870-95aee2dbda06" style="list-style: none; padding-left: 0"><div data-task-local-id="008fff65-3dce-4565-81db-b95d031665a3" data-task-state="TODO">BBBBB</div></div></div>`;

    it('empty action', () => {
      const expected = doc(
        taskList(listProps)(
          taskItem(itemProps)(''),
          taskList(listProps)(taskItem(itemProps)('BBBBB')),
        ),
      );
      pasteAndCompare(editor(emptyActionDoc), clipboard, expected);
    });

    it('middle of action', () => {
      const expected = doc(
        taskList(listProps)(
          taskItem(itemProps)('ZZZ'),
          taskList(listProps)(taskItem(itemProps)('BBBBBZZ')),
        ),
      );
      pasteAndCompare(editor(actionDocMidSelection), clipboard, expected);
    });

    it('end of action', () => {
      const expected = doc(
        taskList(listProps)(
          taskItem(itemProps)('ZZZZZ'),
          taskList(listProps)(taskItem(itemProps)('BBBBB')),
        ),
      );
      pasteAndCompare(editor(actionDocEndSelection), clipboard, expected);
    });
  });
});
