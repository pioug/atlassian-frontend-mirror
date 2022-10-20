import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  table,
  tdEmpty,
  tr,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../plugins/table';
import expandPlugin from '@atlaskit/editor-core/src/plugins/expand';

import {
  isTableCollapsible,
  collapseSelectedTable,
} from '../../../plugins/table/utils/collapse';

describe('collapse', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder, expandInPlugins?: boolean) => {
    const preset = new Preset<LightEditorPlugin>().add([tablePlugin]);

    const finalPreset = expandInPlugins ? preset.add([expandPlugin]) : preset;

    return createEditor({ doc, preset: finalPreset });
  };

  describe('isTableCollapsible', () => {
    it('should not mutate a transaction when using isTableCollapsible', () => {
      const editorData = editor(doc(table()(tr(tdEmpty, tdEmpty))));
      const editorView = editorData.editorView;
      const newTr = editorView.state.tr;

      expect(newTr.steps.length).toEqual(0);

      const isTableCollapsibleRes = isTableCollapsible(newTr);

      expect(newTr.steps.length).toEqual(0);
      expect(isTableCollapsibleRes.tableIsCollapsible).toEqual(false);
    });

    it('should allow collapsing a table when expands are in schema', () => {
      const editorData = editor(doc(table()(tr(tdEmpty, tdEmpty))), true);
      const editorView = editorData.editorView;
      const newTr = editorView.state.tr;

      expect(newTr.steps.length).toEqual(0);

      const isTableCollapsibleRes = isTableCollapsible(newTr);

      expect(newTr.steps.length).toEqual(0);
      expect(isTableCollapsibleRes.tableIsCollapsible).toEqual(true);
    });
  });

  describe('collapseSelectedTable', () => {
    it('should add steps to tr when called', () => {
      const editorData = editor(doc(table()(tr(tdEmpty, tdEmpty))), true);
      const editorView = editorData.editorView;
      const newTr = editorView.state.tr;

      expect(newTr.steps.length).toEqual(0);

      const collapseTr = collapseSelectedTable(newTr);
      expect(collapseTr).toBeDefined();
      expect(collapseTr!.steps.length).toEqual(1);
    });
  });
});
