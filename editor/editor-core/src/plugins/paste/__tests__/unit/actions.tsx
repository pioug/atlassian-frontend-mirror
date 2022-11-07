import {
  Preset,
  LightEditorPlugin,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { MediaADFAttrs } from '@atlaskit/adf-schema';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import {
  doc,
  bodiedExtension,
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
  layoutSection,
  layoutColumn,
  panel,
  mediaSingle,
  media,
  caption,
  ul,
  li,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { uuid } from '@atlaskit/adf-schema';
import { EditorView } from 'prosemirror-view';
import pastePlugin from '../../index';
import tasksAndDecisionsPlugin from '../../../tasks-and-decisions';
import statusPlugin from '../../../status';
import blockTypePlugin from '../../../block-type';
import hyperlinkPlugin from '../../../hyperlink';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import expandPlugin from '../../../expand';
import datePlugin from '../../../date';
import layoutPlugin from '../../../layout';
import panelPlugin from '../../../panel';
import mediaPlugin from '../../../media';
import captionPlugin from '../../../caption';
import listPlugin from '../../../list';
import extensionPlugin from '../../../extension';

const pasteAndCompare = (
  { editorView }: { editorView: EditorView },
  clipboard: string,
  expected: any,
  compareSelection: boolean = false,
) => {
  dispatchPasteEvent(editorView, {
    html: clipboard,
  });

  if (compareSelection) {
    expect(editorView.state).toEqualDocumentAndSelection(expected);
  } else {
    expect(editorView.state.doc).toEqualDocument(expected);
  }
};

describe('action paste handler', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([pastePlugin, { plainTextPasteLinkification: false }])
        .add([tasksAndDecisionsPlugin])
        .add(blockTypePlugin)
        .add(captionPlugin)
        .add([
          mediaPlugin,
          { allowMediaSingle: true, featureFlags: { captions: true } },
        ])
        .add(listPlugin)
        .add(hyperlinkPlugin)
        .add([statusPlugin, { menuDisabled: false }])
        .add(tablesPlugin)
        .add(expandPlugin)
        .add(datePlugin)
        .add(layoutPlugin)
        .add(extensionPlugin)
        .add(panelPlugin),
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
      const clipboard = `<meta charset='utf-8'><table data-pm-slice="4 4 [&quot;expand&quot;,null,&quot;table&quot;,null,&quot;tableRow&quot;,null]"><tbody><tr><td class="pm-table-cell-content-wrap"><p>first line</p><p><span data-node-type="date" data-timestamp="1586822400000"></span> some text</p><p>last line</p></td></tr></tbody></table>`;
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

    it('should paste invalid table content after table and not delete selection', () => {
      const tableDoc = doc(
        table()(tr(td()(p('{<}sometext{>}')), td()(p('')), td()(p('')))),
      );
      const clipboard =
        '<meta charset="utf-8"><div data-layout-section="true" data-pm-slice="0 0 []"><div data-layout-column="true" style="flex-basis: 50%" data-column-width="50"><div data-layout-content="true"><p></p></div></div><div data-layout-column="true" style="flex-basis: 50%" data-column-width="50"><div data-layout-content="true"><p></p></div></div></div>';
      const expected = doc(
        table({ localId: 'local-uuid' })(
          tr(td()(p('sometext')), td()(p()), td()(p())),
        ),
        layoutSection(
          layoutColumn({ width: 50 })(p('{<>}')),
          layoutColumn({ width: 50 })(p()),
        ),
      );

      pasteAndCompare(editor(tableDoc), clipboard, expected, true);
    });

    it('should split paragraph when pasting (table supported) node in the middle of a paragraph', () => {
      const tableDoc = doc(
        table()(tr(td()(p('some{<>}text')), td()(p('')), td()(p('')))),
      );
      const clipboard =
        '<meta charset="utf-8"><div data-panel-type="info" data-pm-slice="0 0 []"><div><p></p></div></div>';
      const expected = doc(
        table({ localId: 'local-uuid' })(
          tr(
            td()(p('some'), panel()(p()), p('{<>}text')),
            td()(p()),
            td()(p()),
          ),
        ),
      );

      pasteAndCompare(editor(tableDoc), clipboard, expected, true);
    });

    it('should paste text to a table as expected', () => {
      const tableDoc = doc(
        bodiedExtension({
          extensionType: 'atlassian.com.editor',
          extensionKey: 'fake.extension',
          localId: 'local-uuid',
          parameters: {},
        })(
          table({ localId: 'local-uuid' })(
            tr(td()(p('some text')), td()(p('{<>}')), td()(p(''))),
          ),
        ),
      );

      const clipboard =
        '<meta charset=\'utf-8\'><p data-pm-slice="1 1 [&quot;table&quot;,{&quot;isNumberColumnEnabled&quot;:false,&quot;layout&quot;:&quot;default&quot;,&quot;__autoSize&quot;:false,&quot;localId&quot;:&quot;7b7a2461-e243-42c2-9099-b18db80cb95d&quot;},&quot;tableRow&quot;,null,&quot;tableHeader&quot;,{&quot;colspan&quot;:1,&quot;rowspan&quot;:1,&quot;colwidth&quot;:null,&quot;background&quot;:null}]">copiedText</p>';
      const expected = doc(
        bodiedExtension({
          extensionType: 'atlassian.com.editor',
          extensionKey: 'fake.extension',
          localId: 'local-uuid',
          parameters: {},
        })(
          table({ localId: 'local-uuid' })(
            tr(td()(p('some text')), td()(p('copiedText')), td()(p(''))),
          ),
        ),
      );
      pasteAndCompare(editor(tableDoc), clipboard, expected, true);
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

  describe('pasting into caption', () => {
    const mediaNodeAttrs = {
      id: 'a559980d-cd47-43e2-8377-27359fcb905f',
      type: 'file',
      collection: 'MediaServicesSample',
      width: 250,
      height: 250,
    } as MediaADFAttrs;

    const emptyCaptionDoc = doc(
      mediaSingle()(media(mediaNodeAttrs)(), caption('{<>}')),
    );

    const middleCaptionDoc = doc(
      mediaSingle()(media(mediaNodeAttrs)(), caption('ZZ{<>}ZZ')),
    );

    it('paste valid content inside an empty caption', () => {
      const clipboard = 'plain text';
      const expected = doc(
        mediaSingle()(media(mediaNodeAttrs)(), caption('plain text')),
      );

      pasteAndCompare(editor(emptyCaptionDoc), clipboard, expected, true);
    });

    it('paste valid content in the middle of a caption', () => {
      const clipboard = 'plain text';
      const expected = doc(
        mediaSingle()(media(mediaNodeAttrs)(), caption('ZZplain textZZ')),
      );

      pasteAndCompare(editor(middleCaptionDoc), clipboard, expected, true);
    });

    it('paste invalid content paragraph inside an empty caption', () => {
      const clipboard =
        '<meta charset="utf-8"><p data-pm-slice="1 1 []">paragraph</p>';
      const expected = doc(
        mediaSingle()(media(mediaNodeAttrs)(), caption('paragraph')),
      );

      pasteAndCompare(editor(emptyCaptionDoc), clipboard, expected, true);
    });

    it('paste invalid content bullet-list inside an empty caption', () => {
      const clipboard =
        '<meta charset="utf-8"><ul class="ak-ul" data-pm-slice="3 3 []"><li><p>fist item</p></li><li><p>second item</p></li></ul>';
      const expected = doc(
        mediaSingle()(media(mediaNodeAttrs)(), caption('fist item')),
        ul(li(p('second item'))),
      );

      pasteAndCompare(editor(emptyCaptionDoc), clipboard, expected, true);
    });

    it('paste invalid content paragraph in the middle of a caption', () => {
      const clipboard =
        '<meta charset="utf-8"><p data-pm-slice="1 1 []">paragraph</p>';
      const expected = doc(
        mediaSingle()(media(mediaNodeAttrs)(), caption('ZZparagraphZZ')),
      );

      pasteAndCompare(editor(middleCaptionDoc), clipboard, expected, true);
    });

    it('paste invalid content bullet-list in the middle of a caption', () => {
      const clipboard =
        '<meta charset="utf-8"><ul class="ak-ul" data-pm-slice="3 3 []"><li><p>fist item</p></li><li><p>second item</p></li></ul>';
      const expected = doc(
        mediaSingle()(media(mediaNodeAttrs)(), caption('ZZfist item')),
        ul(li(p('second itemZZ'))),
      );

      pasteAndCompare(editor(middleCaptionDoc), clipboard, expected, true);
    });
  });
});
