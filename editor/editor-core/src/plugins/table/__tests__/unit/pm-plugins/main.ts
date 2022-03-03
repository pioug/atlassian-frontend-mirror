import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  table,
  tdCursor,
  tdEmpty,
  tr,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { Selection } from 'prosemirror-state';
import * as pmUtils from 'prosemirror-utils';

import tablePlugin from '../../../../table';
import textFormattingPlugin from '../../../../text-formatting';
import { pluginKey } from '../../../pm-plugins/plugin-key';
import { getPluginState } from '../../../pm-plugins/plugin-factory';
import { setEditorFocus } from '../../../../table/commands/misc';
import * as miscCommands from '../../../../table/commands/misc';
import { NodeType } from 'prosemirror-model';
import { undo } from 'prosemirror-history';
import {
  toggleHeaderColumn,
  toggleHeaderRow,
  toggleNumberColumn,
} from '../../../../table/commands';

describe('tables: main plugin', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(tablePlugin)
        .add(textFormattingPlugin),
      pluginKey,
    });
  const tablePluginKey = (pluginKey as any).key;

  it('should not call emit when typing inside a table cell', async () => {
    const { editorView, eventDispatcher } = editor(
      doc(table()(tr(tdCursor, tdEmpty))),
    );
    const emitMock = jest.spyOn(eventDispatcher, 'emit');
    editorView.dispatch(editorView.state.tr.insertText('a'));
    editorView.dispatch(editorView.state.tr.insertText('b'));
    editorView.dispatch(editorView.state.tr.insertText('c'));

    expect(
      emitMock.mock.calls.filter(([e, _]) => e === tablePluginKey).length,
    ).toEqual(0);

    emitMock.mockClear();
  });

  it('should not call emit when typing anywhere in the document', async () => {
    const { editorView, eventDispatcher } = editor(doc(p('{pos}')));

    const emitMock = jest.spyOn(eventDispatcher, 'emit');
    editorView.dispatch(editorView.state.tr.insertText('a'));
    editorView.dispatch(editorView.state.tr.insertText('b'));
    editorView.dispatch(editorView.state.tr.insertText('c'));

    expect(
      emitMock.mock.calls.filter(([e, _]) => e === tablePluginKey).length,
    ).toEqual(0);

    emitMock.mockClear();
  });

  it('should call setTableRef() if it can find a table at the current position', async () => {
    const spied = jest.spyOn(miscCommands, 'setTableRef');

    const { editorView } = editor(doc(table()(tr(tdCursor, tdEmpty))));
    setEditorFocus(true)(editorView.state, editorView.dispatch);

    expect(spied).toBeCalled();

    spied.mockClear();
  });

  it('should not call setTableRef() if it cannot find a table at the current position', async () => {
    const spied = jest.spyOn(miscCommands, 'setTableRef');

    const findParentDomRefOfTypeMock = jest
      .spyOn(pmUtils, 'findParentDomRefOfType')
      // (nodeType: NodeType | NodeType[], domAtPos: DomAtPos):
      //   (selection: Selection)
      //     => Node | undefined
      .mockImplementation(
        (
          nodeType: NodeType | NodeType[],
          domAtPos: pmUtils.DomAtPos,
        ): ((selection: Selection) => Node | undefined) => {
          const parent = document.createElement('p');
          parent.querySelector = () => null;
          return () => parent;
        },
      );

    const { editorView } = editor(doc(table()(tr(tdCursor, tdEmpty))));
    setEditorFocus(true)(editorView.state, editorView.dispatch);

    expect(spied).not.toBeCalled();

    spied.mockClear();
    findParentDomRefOfTypeMock.mockClear();
  });

  describe('Toggle table options', () => {
    it('should update plugin state when we undo enabling of a header column option ', () => {
      const { editorView } = editor(doc(table()(tr(tdCursor, tdEmpty))));
      setEditorFocus(true)(editorView.state, editorView.dispatch);
      expect(getPluginState(editorView.state).isHeaderRowEnabled).toBe(false);
      expect(getPluginState(editorView.state).isHeaderColumnEnabled).toBe(
        false,
      );
      expect(getPluginState(editorView.state).isNumberColumnEnabled).toBe(
        false,
      );

      toggleHeaderColumn(editorView.state, editorView.dispatch);
      expect(getPluginState(editorView.state).isHeaderColumnEnabled).toBe(true);

      undo(editorView.state, editorView.dispatch);
      expect(getPluginState(editorView.state).isHeaderRowEnabled).toBe(false);
      expect(getPluginState(editorView.state).isHeaderColumnEnabled).toBe(
        false,
      );
      expect(getPluginState(editorView.state).isNumberColumnEnabled).toBe(
        false,
      );
    });

    it('should update plugin state when we undo enabling of a header row option ', () => {
      const { editorView } = editor(doc(table()(tr(tdCursor, tdEmpty))));
      setEditorFocus(true)(editorView.state, editorView.dispatch);
      expect(getPluginState(editorView.state).isHeaderRowEnabled).toBe(false);
      expect(getPluginState(editorView.state).isHeaderColumnEnabled).toBe(
        false,
      );
      expect(getPluginState(editorView.state).isNumberColumnEnabled).toBe(
        false,
      );

      toggleHeaderRow(editorView.state, editorView.dispatch);
      expect(getPluginState(editorView.state).isHeaderRowEnabled).toBe(true);

      undo(editorView.state, editorView.dispatch);
      expect(getPluginState(editorView.state).isHeaderRowEnabled).toBe(false);
      expect(getPluginState(editorView.state).isHeaderColumnEnabled).toBe(
        false,
      );
      expect(getPluginState(editorView.state).isNumberColumnEnabled).toBe(
        false,
      );
    });

    it('should update plugin state when we undo enabling of a numbered column option ', () => {
      const { editorView } = editor(doc(table()(tr(tdCursor, tdEmpty))));
      setEditorFocus(true)(editorView.state, editorView.dispatch);
      expect(getPluginState(editorView.state).isHeaderRowEnabled).toBe(false);
      expect(getPluginState(editorView.state).isHeaderColumnEnabled).toBe(
        false,
      );
      expect(getPluginState(editorView.state).isNumberColumnEnabled).toBe(
        false,
      );

      toggleNumberColumn(editorView.state, editorView.dispatch);
      expect(getPluginState(editorView.state).isNumberColumnEnabled).toBe(true);

      undo(editorView.state, editorView.dispatch);
      expect(getPluginState(editorView.state).isHeaderRowEnabled).toBe(false);
      expect(getPluginState(editorView.state).isHeaderColumnEnabled).toBe(
        false,
      );
      expect(getPluginState(editorView.state).isNumberColumnEnabled).toBe(
        false,
      );
    });
  });
});
