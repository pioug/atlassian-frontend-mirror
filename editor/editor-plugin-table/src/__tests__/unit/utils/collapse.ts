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
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';

import { isTableCollapsible } from '../../../plugins/table/utils/collapse';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';

describe('collapse', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    const preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, {}])
      .add(contentInsertionPlugin)
      .add(widthPlugin)
      .add(guidelinePlugin)
      .add(tablePlugin);

    return createEditor({ doc, preset });
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
  });
});
