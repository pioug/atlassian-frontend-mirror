import type { DocBuilder } from '@atlaskit/editor-common/types';
import selectionPlugin from '@atlaskit/editor-core/src/plugins/selection';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  table,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../plugins/table';
import { isTableCollapsible } from '../../../plugins/table/utils/collapse';

describe('collapse', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    const preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, {}])
      .add(contentInsertionPlugin)
      .add(widthPlugin)
      .add(guidelinePlugin)
      .add(selectionPlugin)
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
