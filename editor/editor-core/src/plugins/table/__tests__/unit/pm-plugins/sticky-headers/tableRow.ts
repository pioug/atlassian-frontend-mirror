import { EditorView } from 'prosemirror-view';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  table,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { TableRowNodeView } from '../../../../pm-plugins/sticky-headers';
import tablePlugin from '../../../../../table';
import { pluginKey } from '../../../../pm-plugins/plugin-factory';
import { EventDispatcher } from '../../../../../../test-utils';

describe('TableRowNodeView', () => {
  let tableRowNodeView: TableRowNodeView;
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: any) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add(tablePlugin),
      pluginKey,
    });

  describe('ignoreMutation', () => {
    let editorView: EditorView;
    let eventDispatcher: EventDispatcher;
    let tableRowNode: ProseMirrorNode | null = null;
    let tableRowDom: HTMLTableRowElement;
    beforeEach(() => {
      const editorData = editor(doc(table()(tr(tdEmpty, tdEmpty))));
      editorView = editorData.editorView;
      eventDispatcher = editorData.eventDispatcher;
      tableRowNode = editorView.state.doc.firstChild!.firstChild!;
      tableRowNodeView = new TableRowNodeView(
        tableRowNode,
        editorView,
        jest.fn(),
        eventDispatcher,
      );
      tableRowDom = editorView.dom.getElementsByTagName('tr')[0];
    });

    it.each<[string, string, boolean]>([
      ['disallows observing mutations on row element', 'attributes', true],
      ['allows mutations for row element selection', 'selection', false],
    ])('%s', (_, mutationType, expected) => {
      const mutationRecord = {
        type: mutationType,
        target: tableRowDom,
      } as any;
      expect(tableRowNodeView.ignoreMutation(mutationRecord as any)).toBe(
        expected,
      );
    });
  });
});
