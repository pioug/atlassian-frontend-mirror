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
} from '@atlaskit/editor-test-helpers/schema-builder';

import tablePlugin from '../../../../table';
import { pluginKey } from '../../../pm-plugins/plugin-factory';

describe('tables: main plugin', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: any) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add(tablePlugin),
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
});
