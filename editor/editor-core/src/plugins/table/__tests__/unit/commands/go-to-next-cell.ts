import { PluginKey } from 'prosemirror-state';

import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  table,
  tr,
  td,
  tdEmpty,
  tdCursor,
  p,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../index';
import { pluginKey } from '../../../pm-plugins/plugin-factory';
import { TablePluginState } from '../../../types';
import { goToNextCell } from '../../../commands/go-to-next-cell';

const TABLE_LOCAL_ID = 'test-table-local-id';

const tdNextFocus = td()(p('{nextFocus}'));

describe('table plugin: goToNextCell', () => {
  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>().add(tablePlugin);
  const editor = (doc: DocBuilder) =>
    createEditor<TablePluginState, PluginKey>({
      doc,
      preset,
      pluginKey,
    });

  it('should do nothing when focus is not on a table', () => {
    const { editorView } = editor(doc(p()));
    const {
      state,
      state: { doc: initialDoc },
      dispatch,
    } = editorView;

    const returnValue = goToNextCell(1)(state, dispatch);

    expect(returnValue).toBeFalsy();
    expect(editorView.state.doc).toEqual(initialDoc);
  });

  it('should tab to next cell if focus is in the middle', () => {
    const { editorView, refs } = editor(
      doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(tdEmpty, tdCursor, tdNextFocus),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );
    const { state, dispatch } = editorView;

    const returnValue = goToNextCell(1)(state, dispatch);

    expect(returnValue).toBeTruthy();
    expect(editorView.state.selection.$anchor.pos).toEqual(refs.nextFocus);
  });

  it('should reverse tab to previous cell if focus is in the middle', () => {
    const { editorView, refs } = editor(
      doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(tdNextFocus, tdCursor, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );
    const { state, dispatch } = editorView;

    const returnValue = goToNextCell(-1)(state, dispatch);

    expect(returnValue).toBeTruthy();
    expect(editorView.state.selection.$anchor.pos).toEqual(refs.nextFocus);
  });

  it('should insert row at end of table when tabbed on last cell', () => {
    const { editorView } = editor(
      doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(tdEmpty, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdCursor),
        ),
      ),
    );
    const { state, dispatch } = editorView;

    const expected = doc(
      table({ localId: TABLE_LOCAL_ID })(
        tr(tdEmpty, tdEmpty, tdEmpty),
        tr(tdEmpty, tdEmpty, tdEmpty),
        tr(tdNextFocus, tdEmpty, tdEmpty),
      ),
    )(state.schema);

    const returnValue = goToNextCell(1)(state, dispatch);

    expect(returnValue).toBeTruthy();
    expect(expected.eq(editorView.state.doc)).toBeTruthy();
    expect(editorView.state.selection.$anchor.pos).toEqual(32);
  });

  it('should insert row at start of table when reverse tabbed on first cell', () => {
    const { editorView } = editor(
      doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(tdCursor, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );
    const { state, dispatch } = editorView;

    const expected = doc(
      table({ localId: TABLE_LOCAL_ID })(
        tr(tdNextFocus, tdEmpty, tdEmpty),
        tr(tdEmpty, tdEmpty, tdEmpty),
        tr(tdEmpty, tdEmpty, tdEmpty),
      ),
    )(state.schema);

    const returnValue = goToNextCell(-1)(state, dispatch);

    expect(returnValue).toBeTruthy();
    expect(expected.eq(editorView.state.doc)).toBeTruthy();
    expect(editorView.state.selection.$anchor.pos).toEqual(4);
  });
});
