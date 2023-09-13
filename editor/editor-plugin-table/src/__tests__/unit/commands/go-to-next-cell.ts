import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import selectionPlugin from '@atlaskit/editor-core/src/plugins/selection';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  table,
  td,
  tdCursor,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../plugins/table';
import { goToNextCell } from '../../../plugins/table/commands/go-to-next-cell';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import type { TablePluginState } from '../../../plugins/table/types';

const TABLE_LOCAL_ID = 'test-table-local-id';

const tdNextFocus = td()(p('{nextFocus}'));

describe('table plugin: goToNextCell', () => {
  const editorAnalyticsAPIFake: EditorAnalyticsAPI = {
    attachAnalyticsEvent: jest.fn().mockReturnValue(() => jest.fn()),
  };
  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>()
    .add([featureFlagsPlugin, {}])
    .add([analyticsPlugin, {}])
    .add(contentInsertionPlugin)
    .add(widthPlugin)
    .add(guidelinePlugin)
    .add(selectionPlugin)
    .add(tablePlugin);
  const editor = (doc: DocBuilder) =>
    createEditor<TablePluginState, PluginKey, typeof preset>({
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

    const returnValue = goToNextCell(editorAnalyticsAPIFake)(1)(
      state,
      dispatch,
    );

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

    const returnValue = goToNextCell(editorAnalyticsAPIFake)(1)(
      state,
      dispatch,
    );

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

    const returnValue = goToNextCell(editorAnalyticsAPIFake)(-1)(
      state,
      dispatch,
    );

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

    const returnValue = goToNextCell(editorAnalyticsAPIFake)(1)(
      state,
      dispatch,
    );

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

    const returnValue = goToNextCell(editorAnalyticsAPIFake)(-1)(
      state,
      dispatch,
    );

    expect(returnValue).toBeTruthy();
    expect(expected.eq(editorView.state.doc)).toBeTruthy();
    expect(editorView.state.selection.$anchor.pos).toEqual(4);
  });
});
