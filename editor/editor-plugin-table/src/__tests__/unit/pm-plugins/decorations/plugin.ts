import { Selection } from 'prosemirror-state';
import { addColumnAt } from '@atlaskit/editor-tables/utils';
import { DecorationSet } from 'prosemirror-view';

import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  table,
  tdCursor,
  tdEmpty,
  tr,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { selectColumn } from '../../../../plugins/table/commands';
import {
  getDecorations,
  handleDocOrSelectionChanged,
} from '../../../../plugins/table/pm-plugins/decorations/plugin';
import { pluginKey } from '../../../../plugins/table/pm-plugins/plugin-key';
import { TableDecorations } from '../../../../plugins/table/types';
import tablePlugin from '../../../../plugins/table';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';

describe('decorations plugin', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      attachTo: document.body,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add(tablePlugin),
      pluginKey,
    });

  // ED-8457
  describe('when there is a selection pointer set', () => {
    it('should remove the column selected decorations', () => {
      const { editorView } = editor(
        doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
      );

      selectColumn(1)(editorView.state, editorView.dispatch);

      const { tr: transaction } = editorView.state;

      transaction.setMeta('pointer', true);
      transaction.setSelection(Selection.atStart(transaction.doc));
      editorView.dispatch(transaction);

      const decorationSet = getDecorations(editorView.state);

      const columnSelectedDecorations = decorationSet.find(
        undefined,
        undefined,
        (spec) => spec.key.indexOf(TableDecorations.COLUMN_SELECTED) > -1,
      );

      expect(columnSelectedDecorations).toHaveLength(0);
    });
  });

  describe('when the doc did not changed', () => {
    it('should not re-create the decorations', () => {
      const pluginState = DecorationSet.empty;
      const { editorView } = editor(
        doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
      );

      const oldState = handleDocOrSelectionChanged(
        editorView.state.tr,
        pluginState,
        editorView.state,
      );

      const newState = handleDocOrSelectionChanged(
        editorView.state.tr,
        oldState,
        editorView.state,
      );

      expect(newState).toEqual(oldState);
    });
  });

  describe('when the table changed', () => {
    it('should re-create the column controls decorations', () => {
      const { editorView } = editor(
        doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
      );
      const { state } = editorView;

      const nextPluginState = handleDocOrSelectionChanged(
        editorView.state.tr,
        DecorationSet.empty,
        editorView.state,
      );

      const { tr: transaction } = state;
      editorView.dispatch(addColumnAt(2)(transaction));

      const newState = handleDocOrSelectionChanged(
        transaction,
        nextPluginState,
        editorView.state,
      );
      const expectedDecorationSet = newState;
      const decorations = expectedDecorationSet.find(
        undefined,
        undefined,
        (spec) =>
          spec.key.indexOf(TableDecorations.COLUMN_CONTROLS_DECORATIONS) > -1,
      );

      expect(decorations).toHaveLength(3);
    });
  });

  describe('when nothing changed', () => {
    it('should not re-create the column controls decorations', () => {
      const { editorView } = editor(
        doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
      );
      const oldPluginState = handleDocOrSelectionChanged(
        editorView.state.tr,
        DecorationSet.empty,
        editorView.state,
      );

      const newPluginState = handleDocOrSelectionChanged(
        editorView.state.tr,
        oldPluginState,
        editorView.state,
      );
      expect(oldPluginState).toEqual(newPluginState);
    });
  });
});
